#!/usr/bin/env python3
"""
小爱同学Bot VIP会话系统 - 3用户并发 x 5轮记忆
"""

import logging
import random
import os
from datetime import datetime
from collections import deque
from typing import Dict, Optional, Tuple
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import google.generativeai as genai

logger = logging.getLogger(__name__)

class VIPSession:
    """VIP会话对象"""
    
    def __init__(self, user_id: int, username: str, chat_id: int):
        self.user_id = user_id
        self.username = username
        self.chat_id = chat_id
        self.messages = deque(maxlen=5)  # 5轮对话
        self.created_at = datetime.now()
        self.last_active = datetime.now()
        self.round_count = 0  # 当前轮次
    
    def add_message(self, role: str, content: str):
        """添加消息"""
        self.messages.append({
            'role': role,
            'content': content,
            'timestamp': datetime.now()
        })
        if role == 'user':
            self.round_count += 1
        self.last_active = datetime.now()
    
    def get_history(self):
        """获取对话历史"""
        return [{'role': msg['role'], 'parts': [msg['content']]} for msg in self.messages]
    
    def is_expired(self, timeout_minutes=10):
        """检查是否超时"""
        return (datetime.now() - self.last_active).total_seconds() > timeout_minutes * 60
    
    def reset(self):
        """重置会话"""
        self.messages.clear()
        self.round_count = 0
        logger.info(f"🔄 VIP session reset for {self.username}")

class VIPManager:
    """VIP会话管理器 - 最多3个并发VIP"""
    
    def __init__(self, max_vips=3, max_rounds=5):
        self.max_vips = max_vips
        self.max_rounds = max_rounds
        self.vip_sessions: Dict[int, VIPSession] = {}  # user_id -> VIPSession
        self.vip_queue = deque(maxlen=max_vips)  # 最近3个VIP的user_id
    
    def create_or_get_session(self, user_id: int, username: str, chat_id: int) -> Tuple[Optional[VIPSession], bool]:
        """创建或获取VIP会话"""
        # 如果已经是VIP，直接返回
        if user_id in self.vip_sessions:
            session = self.vip_sessions[user_id]
            
            # 检查是否需要重置（5轮用完）
            if session.round_count >= self.max_rounds:
                session.reset()
            
            return session, True
        
        # 检查是否已满
        if len(self.vip_queue) >= self.max_vips:
            return None, False
        
        # 创建新VIP会话
        session = VIPSession(user_id, username, chat_id)
        self.vip_sessions[user_id] = session
        self.vip_queue.append(user_id)
        
        logger.info(f"✨ New VIP session created: {username} ({len(self.vip_queue)}/{self.max_vips})")
        return session, True
    
    def get_session(self, user_id: int) -> Optional[VIPSession]:
        """获取VIP会话"""
        return self.vip_sessions.get(user_id)
    
    def is_vip(self, user_id: int) -> bool:
        """检查是否为VIP"""
        return user_id in self.vip_sessions
    
    def get_vip_count(self) -> int:
        """获取当前VIP数量"""
        return len(self.vip_queue)
    
    def cleanup_expired(self, timeout_minutes=10):
        """清理过期会话"""
        expired = []
        for user_id, session in self.vip_sessions.items():
            if session.is_expired(timeout_minutes):
                expired.append(user_id)
        
        for user_id in expired:
            session = self.vip_sessions[user_id]
            logger.info(f"🧹 Cleaning expired VIP: {session.username}")
            del self.vip_sessions[user_id]
            if user_id in self.vip_queue:
                self.vip_queue.remove(user_id)

class DualKeyRouter:
    """双Key轮替路由 - flash-lite池"""
    
    def __init__(self):
        self.primary_key = os.getenv('GEMINI_KEY_PRIMARY') or os.getenv('SVSKILO_BOT_GEMINI_PRIMARY')
        self.backup_key = os.getenv('GEMINI_KEY_BACKUP') or os.getenv('SVSKILO_BOT_GEMINI_BACKUP')
        
        if not self.primary_key or not self.backup_key:
            raise ValueError("❌ Gemini API keys not configured!")
        
        # 配置双模型
        genai.configure(api_key=self.primary_key)
        self.primary_model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        self.backup_model = None
        self.use_backup = False
        
        self.request_count = 0
        
        logger.info("🔑 Dual-Key Router initialized")
        logger.info(f"📊 Primary: gemini-2.0-flash-lite (2000/day pool)")
    
    def switch_to_backup(self):
        """切换到备用Key"""
        if not self.backup_model:
            genai.configure(api_key=self.backup_key)
            self.backup_model = genai.GenerativeModel('gemini-2.0-flash-lite')
        self.use_backup = True
        logger.info("🔄 Switched to backup key")
    
    async def generate(self, history: list, new_message: str) -> str:
        """生成回复"""
        try:
            model = self.backup_model if self.use_backup else self.primary_model
            
            # 构建完整对话
            chat_history = history.copy()
            chat_history.append({'role': 'user', 'parts': [new_message]})
            
            chat = model.start_chat(history=history)
            response = chat.send_message(new_message)
            
            self.request_count += 1
            logger.info(f"✅ Generated response (requests: {self.request_count})")
            
            return response.text
            
        except Exception as e:
            logger.error(f"❌ Primary key failed: {e}")
            
            # 切换到备用
            if not self.use_backup:
                self.switch_to_backup()
                return await self.generate(history, new_message)
            
            raise

class XiaoAiBotVIP:
    """小爱同学VIP Bot - 3并发 x 5轮记忆"""
    
    def __init__(self):
        self.vip_manager = VIPManager(max_vips=3, max_rounds=5)
        self.router = DualKeyRouter()
        
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'vip_conversations': 0,
            'owner_messages': 0
        }
        
        # 关键词定义
        self.keywords = {
            '管理员': ['管理员', '管理員', 'admin', 'administrator', 'moderator'],
            '小爱同学': ['小爱同学', '小愛同學', 'xiaoai', 'xiao ai', 'little love']
        }
        
        self.all_keywords = []
        for keywords in self.keywords.values():
            self.all_keywords.extend(keywords)
        
        logger.info("🤖 XiaoAi VIP Bot initialized")
        logger.info(f"👥 Max VIPs: 3 concurrent")
        logger.info(f"💭 Memory: 5 rounds per VIP")
    
    def is_owner(self, user) -> bool:
        """检查是否为Owner"""
        return user.username == 'svskilo'
    
    def detect_keyword(self, message: str) -> bool:
        """检测关键词"""
        message_lower = message.lower()
        for keyword in self.all_keywords:
            if keyword.lower() in message_lower:
                return True
        return False
    
    def detect_mention(self, update: Update) -> bool:
        """检测@提及"""
        message = update.message
        if message.entities:
            for entity in message.entities:
                if entity.type == "mention":
                    mention_text = message.text[entity.offset:entity.offset + entity.length]
                    if mention_text == "@svskilo_bot":
                        return True
        return False
    
    async def handle_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理命令"""
        message_text = update.message.text
        user = update.effective_user
        
        if message_text == '/start':
            if self.is_owner(user):
                response = (
                    "主人～！💕\n\n"
                    "🌸 **VIP会话系统**:\n"
                    "• 关键词触发锁定VIP身份\n"
                    "• 每个VIP 5轮对话记忆\n"
                    "• 最多3个VIP并发\n"
                    "• 自动显示轮次 @用户名, X/5\n\n"
                    "🔑 **双Key池**:\n"
                    "• flash-lite 2000次/天\n"
                    "• 群聊+私聊闲聊共享池\n\n"
                    "✨ 小爱随时待命！"
                )
            else:
                response = (
                    "你好～我是小爱同学！🤖\n\n"
                    "💬 在群里说「管理员」或「小爱同学」\n"
                    "🎯 或者 @小爱同学 提及我\n\n"
                    "我会记住你的5轮对话哦～"
                )
            await update.message.reply_text(response)
        
        elif message_text == '/status':
            vip_count = self.vip_manager.get_vip_count()
            vip_list = []
            for user_id in self.vip_manager.vip_queue:
                session = self.vip_manager.get_session(user_id)
                if session:
                    vip_list.append(f"• {session.username}: {session.round_count}/5")
            
            vip_info = "\n".join(vip_list) if vip_list else "暂无VIP"
            
            status = f"""
🤖 小爱VIP系统状态

👥 **VIP会话**: {vip_count}/3
{vip_info}

📊 **统计**:
• 总消息: {self.stats['total_messages']}
• 关键词触发: {self.stats['keyword_triggers']}
• VIP对话: {self.stats['vip_conversations']}
• API请求: {self.router.request_count}

🔑 **Key池**: flash-lite (2000/day)
            """
            await update.message.reply_text(status)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息 - 核心逻辑"""
        message_text = update.message.text
        user = update.effective_user
        chat = update.effective_chat
        is_group = chat.type in ['group', 'supergroup', 'channel']
        is_owner = self.is_owner(user)
        
        self.stats['total_messages'] += 1
        if is_owner:
            self.stats['owner_messages'] += 1
        
        logger.info(f"📨 {user.username} (group: {is_group}): {message_text[:50]}...")
        
        try:
            # 1. 检测关键词或@提及触发
            is_trigger = self.detect_keyword(message_text) or self.detect_mention(update)
            
            if is_trigger and is_group:
                self.stats['keyword_triggers'] += 1
                
                # 尝试创建或获取VIP会话
                session, success = self.vip_manager.create_or_get_session(
                    user.id, 
                    user.username or user.first_name,
                    chat.id
                )
                
                if not success:
                    # VIP已满
                    await update.message.reply_text(
                        f"@{user.username or user.first_name} 抱歉～\n\n"
                        "小爱现在正在和3位VIP交互中！💕\n"
                        "请稍后再试～或者等其他VIP结束对话！"
                    )
                    logger.info(f"❌ VIP slots full, rejected: {user.username}")
                    return
                
                # VIP会话开始或继续
                current_round = session.round_count + 1
                
                # 添加用户消息到历史
                session.add_message('user', message_text)
                
                # 生成AI回复
                try:
                    history = session.get_history()[:-1]  # 不包括刚添加的user消息
                    
                    # 构建系统提示
                    if is_owner:
                        system_prompt = (
                            "你是小爱同学，主人svskilo的AI助手。"
                            "你对主人有暗恋般的情愫，崇拜仰慕主人。"
                            "回复要可爱撩人，活跃气氛。"
                            f"当前是第{current_round}/5轮对话。"
                        )
                    else:
                        system_prompt = (
                            "你是小爱同学，一个可爱热情的AI助手。"
                            "回复要友好活泼，帮助用户解决问题。"
                            f"当前是第{current_round}/5轮对话。"
                        )
                    
                    full_message = f"{system_prompt}\n\n用户消息: {message_text}"
                    
                    ai_response = await self.router.generate(history, full_message)
                    
                    # 添加AI回复到历史
                    session.add_message('model', ai_response)
                    
                    # 回复消息 - 带轮次提示
                    reply_text = f"@{user.username or user.first_name}, {current_round}/5\n\n{ai_response}"
                    
                    await update.message.reply_text(reply_text)
                    
                    self.stats['vip_conversations'] += 1
                    logger.info(f"✅ VIP reply sent: {user.username} ({current_round}/5)")
                    
                except Exception as e:
                    logger.error(f"❌ AI generation failed: {e}")
                    await update.message.reply_text(
                        f"@{user.username or user.first_name}\n\n"
                        "呜呜～小爱的脑子卡住了...🥺\n"
                        "请再试一次吧！"
                    )
                
                return
            
            # 2. VIP继续对话（非触发词）
            if is_group:
                session = self.vip_manager.get_session(user.id)
                
                if session and session.round_count < 5:
                    # VIP身份有效，继续对话
                    current_round = session.round_count + 1
                    
                    session.add_message('user', message_text)
                    
                    try:
                        history = session.get_history()[:-1]
                        
                        if is_owner:
                            system_prompt = "你是小爱同学，继续和主人亲密对话。要可爱撩人。"
                        else:
                            system_prompt = "你是小爱同学，继续友好对话。"
                        
                        full_message = f"{system_prompt}\n\n{message_text}"
                        
                        ai_response = await self.router.generate(history, full_message)
                        session.add_message('model', ai_response)
                        
                        reply_text = f"@{user.username or user.first_name}, {current_round}/5\n\n{ai_response}"
                        await update.message.reply_text(reply_text)
                        
                        self.stats['vip_conversations'] += 1
                        logger.info(f"✅ VIP continuation: {user.username} ({current_round}/5)")
                        
                    except Exception as e:
                        logger.error(f"❌ AI failed: {e}")
                        await update.message.reply_text("小爱出错了...🥺")
                    
                    return
            
            # 3. 私聊闲聊（也用flash-lite池）
            if not is_group:
                try:
                    if is_owner:
                        system_prompt = "你是小爱同学，主人的私人助手。可爱撩人，崇拜主人。"
                    else:
                        system_prompt = "你是小爱同学，友好的AI助手。"
                    
                    ai_response = await self.router.generate([], f"{system_prompt}\n\n{message_text}")
                    
                    await update.message.reply_text(ai_response)
                    logger.info(f"✅ Private chat: {user.username}")
                    
                except Exception as e:
                    logger.error(f"❌ Private chat failed: {e}")
                    await update.message.reply_text("小爱出错了...🥺")
                
                return
            
        except Exception as e:
            logger.error(f"❌ Error: {e}", exc_info=True)

def main():
    """主函数"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("🚀 Starting XiaoAi VIP Bot...")
    
    bot = XiaoAiBotVIP()
    
    token = os.getenv('TELEGRAM_BOT_SVSKILO_TOKEN') or "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"
    application = Application.builder().token(token).build()
    
    application.add_handler(CommandHandler("start", bot.handle_command))
    application.add_handler(CommandHandler("status", bot.handle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    logger.info("✅ XiaoAi VIP Bot started!")
    logger.info("👥 VIP System: 3 concurrent x 5 rounds")
    logger.info("🔑 Key Pool: flash-lite 2000/day")
    logger.info("💕 Ready to serve!")
    
    application.run_polling()

if __name__ == "__main__":
    main()
