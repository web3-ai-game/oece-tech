#!/usr/bin/env python3
"""
小爱同学Bot v2 - 双Key轮替 + 简化架构
"""

import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

from config import Config
from keyword_detector import KeywordDetector
from dual_key_router import DualKeyRouter

# 简化数据库 - 暂时禁用Supabase
class SimpleDB:
    """简单内存数据库"""
    
    def __init__(self):
        self.chat_history = []
        self.triggered_users = set()
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'owner_messages': 0
        }
    
    async def save_chat_history(self, **kwargs):
        """保存聊天记录"""
        self.chat_history.append({
            'timestamp': datetime.now().isoformat(),
            **kwargs
        })
        # 只保留最近100条
        if len(self.chat_history) > 100:
            self.chat_history = self.chat_history[-100:]
    
    async def register_user(self, **kwargs):
        """注册用户"""
        self.triggered_users.add(kwargs.get('user_id'))
    
    async def get_user_history(self, user_id: int, limit: int = 5) -> List:
        """获取用户历史"""
        user_history = [
            msg for msg in self.chat_history 
            if msg.get('user_id') == user_id
        ]
        return user_history[-limit:]
    
    async def get_active_users_count(self, chat_id: int) -> int:
        """获取活跃用户数"""
        return len(self.triggered_users)

logger = logging.getLogger(__name__)

class XiaoAiBotV2:
    """小爱同学Bot v2"""
    
    def __init__(self):
        self.db = SimpleDB()
        self.keyword_detector = KeywordDetector()
        self.dual_router = DualKeyRouter()
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'owner_messages': 0,
            'group_messages': 0,
            'private_messages': 0
        }
        
        logger.info("🤖 XiaoAiBot V2 initialized")
    
    def is_owner(self, user) -> bool:
        """检查是否为Owner"""
        return user.username == Config.OWNER_USERNAME
    
    async def handle_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理命令"""
        message_text = update.message.text
        user = update.effective_user
        chat = update.effective_chat
        is_owner = self.is_owner(user)
        
        if message_text == '/start':
            await update.message.reply_text(
                "🤖 你好！我是小爱同学！\n\n"
                "🍄 像菌丝网络一样，我可以连接一切！\n\n"
                "💬 在群聊中发送「管理员」或「小爱同学」来触发我\n"
                "📊 /status - 查看状态\n"
                "📈 /mystats - 个人统计\n"
                "❓ /help - 帮助信息"
            )
            
        elif message_text == '/help':
            help_text = """
🤖 小爱同学帮助

📝 **使用方式**:
• 私聊：直接对话
• 群聊：@我或发送关键词触发

🔑 **关键词**:
• 管理员 / 管理員 / admin
• 小爱同学 / 小愛同學 / xiaoai

⚡ **功能**:
• 智能对话
• 关键词触发
• 群聊助手
• 快速响应

📊 **命令**:
• /status - 系统状态
• /mystats - 个人统计
• /help - 帮助信息

🍄 像菌丝一样连接一切！
            """
            await update.message.reply_text(help_text)
            
        elif message_text == '/status':
            status_text = f"""
🤖 小爱同学状态

📊 **统计**:
• 总消息: {self.stats['total_messages']}
• 关键词触发: {self.stats['keyword_triggers']}
• Owner消息: {self.stats['owner_messages']}
• 群聊消息: {self.stats['group_messages']}
• 私聊消息: {self.stats['private_messages']}

🔑 **双Key路由**:
• KEY_1: 主Key (支持所有模型)
• KEY_2: 备用Key (Flash-Lite)

⚡ **响应策略**:
• 群聊/用户: Flash-Lite快速响应
• Owner私聊: 高级模型处理

🍄 系统运行正常！
            """
            await update.message.reply_text(status_text)
            
        elif message_text == '/mystats':
            history = await self.db.get_user_history(user.id)
            user_stats = f"""
📊 你的统计

👤 **用户**: {user.username or user.first_name}
💬 **消息数**: {self.stats['total_messages']}
🎯 **触发次数**: {self.stats['keyword_triggers']}
📝 **聊天记录**: {len(history)}条

🕒 **最近对话**:
"""
            for i, msg in enumerate(history[-3:]):
                user_msg = msg.get('message_text', '')[:30] + '...' if len(msg.get('message_text', '')) > 30 else msg.get('message_text', '')
                user_stats += f"• {user_msg}\n"
            
            await update.message.reply_text(user_stats)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息 - 核心逻辑"""
        message_text = update.message.text
        user = update.effective_user
        chat = update.effective_chat
        is_group = chat.type in ['group', 'supergroup', 'channel']
        is_owner = self.is_owner(user)
        
        # 统计
        self.stats['total_messages'] += 1
        if is_group:
            self.stats['group_messages'] += 1
        else:
            self.stats['private_messages'] += 1
        if is_owner:
            self.stats['owner_messages'] += 1
        
        try:
            # 1. 检测关键词（群聊）
            keyword_triggered = None
            if is_group:
                keyword_triggered = self.keyword_detector.detect(message_text)
                
                if keyword_triggered:
                    # 记录触发
                    self.stats['keyword_triggers'] += 1
                    category, keyword = keyword_triggered
                    
                    # 注册用户
                    await self.db.register_user(
                        user_id=user.id,
                        username=user.username or user.first_name,
                        chat_id=chat.id,
                        triggered_by_keyword=keyword
                    )
                    
                    # 生成触发回复
                    trigger_responses = [
                        f"@{user.username or user.first_name} 🍄 我在！有什么可以帮助你的吗？",
                        f"@{user.username or user.first_name} 🤖 小爱同学来啦！请讲～",
                        f"@{user.username or user.first_name} ✨ 听到我的名字啦！需要什么帮助？"
                    ]
                    
                    import random
                    trigger_msg = random.choice(trigger_responses)
                    await update.message.reply_text(trigger_msg)
                    
                    logger.info(f"🎯 Keyword trigger: '{keyword}' by {user.username} in {chat.title}")
            
            # 2. 获取用户历史（简化版）
            history = await self.db.get_user_history(user.id, limit=3)
            
            # 3. 构建上下文
            context_text = ""
            if history:
                context_text = "\n".join([
                    f"用户: {msg.get('message_text', '')}" 
                    for msg in history[-2:]
                ])
                context_text = f"\n\n最近对话:\n{context_text}\n"
            
            # 4. 双Key路由生成响应
            response_text, route_info = self.dual_router.route_and_generate(
                message_text, is_group, is_owner
            )
            
            # 5. 发送响应
            if is_group and keyword_triggered:
                # 群聊触发时@用户
                mention = f"@{user.username}" if user.username else user.first_name
                final_response = f"{mention}\n{response_text}"
            else:
                final_response = response_text
            
            await update.message.reply_text(final_response)
            
            # 6. 保存记录
            await self.db.save_chat_history(
                chat_id=chat.id,
                user_id=user.id,
                username=user.username or user.first_name,
                message_text=message_text,
                response_text=final_response,
                route_info=route_info,
                keyword_triggered=keyword_triggered is not None,
                is_owner=is_owner,
                is_group=is_group
            )
            
            logger.info(
                f"✅ Response sent via {route_info['key_used']} "
                f"({route_info['model_used']}) to {user.username}"
            )
            
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}", exc_info=True)
            await update.message.reply_text(
                "抱歉，处理消息时出现错误。请稍后再试。\n\n"
                "🍄 像菌丝一样，我会从错误中学习成长..."
            )

async def main():
    """主函数"""
    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("🚀 Starting XiaoAi Bot V2...")
    
    # 创建Bot实例
    bot = XiaoAiBotV2()
    
    # 创建Telegram应用
    application = Application.builder().token(Config.TELEGRAM_TOKEN).build()
    
    # 添加处理器
    application.add_handler(CommandHandler("start", bot.handle_command))
    application.add_handler(CommandHandler("help", bot.handle_command))
    application.add_handler(CommandHandler("status", bot.handle_command))
    application.add_handler(CommandHandler("mystats", bot.handle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    logger.info("✅ XiaoAi Bot V2 started!")
    logger.info("🍄 群聊关键词触发系统已激活")
    logger.info("🎯 支持关键词: 管理员, 小爱同学 (简繁英)")
    logger.info("🔄 双Key轮替系统已启用")
    
    # 启动Bot
    await application.run_polling()

if __name__ == "__main__":
    asyncio.run(main())
