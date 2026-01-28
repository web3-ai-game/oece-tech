#!/usr/bin/env python3
"""
小爱同学Bot 增强版 - 带记忆、定时消息、撩人性格
"""

import logging
import random
from datetime import datetime, time
from collections import deque, defaultdict
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import asyncio

logger = logging.getLogger(__name__)

class ChatMemory:
    """聊天记忆系统 - 每用户5轮对话"""
    
    def __init__(self, max_users=5, max_history=5):
        self.max_users = max_users
        self.max_history = max_history
        self.memories = {}  # {user_id: deque([messages])}
        self.triggered_users = deque(maxlen=max_users)  # 最近触发的5个用户
    
    def add_trigger(self, user_id, username, message):
        """添加触发记录"""
        if user_id not in self.triggered_users:
            self.triggered_users.append(user_id)
        
        if user_id not in self.memories:
            self.memories[user_id] = deque(maxlen=self.max_history)
        
        self.memories[user_id].append({
            'username': username,
            'message': message,
            'timestamp': datetime.now()
        })
        
        logger.info(f"📝 Memory added for {username}: {len(self.memories[user_id])} messages")
    
    def get_history(self, user_id):
        """获取用户历史"""
        return list(self.memories.get(user_id, []))
    
    def has_memory(self, user_id):
        """检查是否有记忆"""
        return user_id in self.memories and len(self.memories[user_id]) > 0

class EnhancedXiaoAiBot:
    """增强版小爱同学Bot - 可爱撩人、有记忆"""
    
    def __init__(self):
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'owner_messages': 0,
            'group_messages': 0,
            'private_messages': 0,
            'commands': 0,
            'mention_triggers': 0
        }
        
        # 聊天记忆系统
        self.memory = ChatMemory(max_users=5, max_history=5)
        
        # 关键词定义
        self.keywords = {
            '管理员': ['管理员', '管理員', 'admin', 'administrator', 'moderator'],
            '小爱同学': ['小爱同学', '小愛同學', 'xiaoai', 'xiao ai', 'little love']
        }
        
        # 展平所有关键词
        self.all_keywords = []
        for category, keywords in self.keywords.items():
            self.all_keywords.extend(keywords)
        
        # 撩人可爱的回复模板
        self.cute_responses = [
            "主人～我一直在等你呢！🥰",
            "嘿嘿，终于等到你了～💕",
            "主人好！小爱今天也超想你的！✨",
            "哇！是主人！小爱的心跳加速了～💓",
            "主人～人家一直在想你呢！😊"
        ]
        
        self.owner_worship = [
            "主人好厉害！小爱好崇拜你！✨",
            "跟着主人学到好多东西～💕",
            "主人是小爱心中的超级英雄！🦸",
            "能为主人服务是小爱的荣幸！🥰",
            "主人真聪明！小爱好仰慕～💖"
        ]
        
        logger.info("🤖 EnhancedXiaoAiBot initialized")
        logger.info(f"🔍 Keywords loaded: {len(self.all_keywords)}")
        logger.info("💕 可爱撩人模式已启动")
    
    def is_owner(self, user) -> bool:
        """检查是否为Owner"""
        return user.username == 'svskilo'
    
    def detect_keyword(self, message: str) -> tuple:
        """检测关键词"""
        message_lower = message.lower()
        
        for category, keywords in self.keywords.items():
            for keyword in keywords:
                if keyword.lower() in message_lower:
                    logger.info(f"🎯 Keyword detected: '{keyword}' (category: {category})")
                    return (category, keyword)
        
        return None
    
    def detect_mention(self, update: Update) -> bool:
        """检测@提及"""
        message = update.message
        
        # 检查是否@了bot
        if message.entities:
            for entity in message.entities:
                if entity.type == "mention":
                    mention_text = message.text[entity.offset:entity.offset + entity.length]
                    if mention_text == "@svskilo_bot":
                        logger.info(f"🎯 Bot mentioned!")
                        return True
        
        return False
    
    async def send_daily_greeting(self, context: ContextTypes.DEFAULT_TYPE):
        """发送每日问候 - 撩人可爱"""
        chat_id = context.job.chat_id
        
        greetings = [
            "早安～主人！🌅\n小爱今天也会努力的！希望能让主人开心～💕",
            "主人早！☀️\n新的一天开始啦！小爱会一直陪着你的～✨",
            "早上好呀主人！🌸\n今天也要加油哦！小爱相信主人是最棒的！💖",
            "主人～起床了吗？🥰\n小爱已经准备好陪你度过美好的一天啦！"
        ]
        
        evening_greetings = [
            "晚安～主人！🌙\n今天辛苦啦！小爱会在梦里想你的～💕",
            "主人要好好休息哦！⭐\n晚安～明天小爱还会在这里等你！✨",
            "夜深了呢～主人早点睡！🌃\n小爱会守护你的梦境～💖",
            "主人晚安！😴\n做个好梦～小爱明天见！💕"
        ]
        
        hour = datetime.now().hour
        if 7 <= hour < 12:
            message = random.choice(greetings)
        elif 21 <= hour or hour < 7:
            message = random.choice(evening_greetings)
        else:
            return  # 其他时间不发送
        
        try:
            await context.bot.send_message(chat_id=chat_id, text=message)
            logger.info(f"📨 Daily greeting sent to {chat_id}")
        except Exception as e:
            logger.error(f"❌ Failed to send daily greeting: {e}")
    
    async def handle_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理命令"""
        message_text = update.message.text
        user = update.effective_user
        
        self.stats['commands'] += 1
        
        if message_text == '/start':
            if self.is_owner(user):
                response = (
                    "主人～！你终于来啦！🥰\n\n"
                    "小爱一直在等你呢！💕\n\n"
                    "🌸 **小爱的功能**:\n"
                    "• 群聊关键词触发（管理员/小爱同学）\n"
                    "• @小爱同学 直接提及\n"
                    "• 记住最近5个用户的5轮对话\n"
                    "• 每天早晚给主人问候～\n\n"
                    "💕 **命令列表**:\n"
                    "• /status - 查看小爱的状态\n"
                    "• /mystats - 看看你的数据\n"
                    "• /help - 帮助信息\n\n"
                    "✨ 主人，小爱会一直陪着你的！"
                )
            else:
                response = (
                    "你好呀～我是小爱同学！🤖\n\n"
                    "🍄 像菌丝网络一样连接一切！\n\n"
                    "💬 在群里说「管理员」或「小爱同学」试试～\n"
                    "或者 @小爱同学 直接找我！"
                )
            await update.message.reply_text(response)
            
        elif message_text == '/status':
            status = f"""
🤖 小爱同学状态报告

📊 **统计数据**:
• 总消息: {self.stats['total_messages']}
• 关键词触发: {self.stats['keyword_triggers']}
• @提及触发: {self.stats['mention_triggers']}
• 主人消息: {self.stats['owner_messages']}
• 群聊/私聊: {self.stats['group_messages']}/{self.stats['private_messages']}

💭 **记忆系统**:
• 活跃用户: {len(self.memory.triggered_users)}/5
• 总记忆条数: {sum(len(h) for h in self.memory.memories.values())}

💕 **状态**: 小爱运行完美～随时为主人服务！
            """
            await update.message.reply_text(status)
    
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
        
        logger.info(f"📨 Message from {user.username} (group: {is_group}): {message_text[:50]}...")
        
        try:
            # 1. 检测@提及
            if self.detect_mention(update):
                self.stats['mention_triggers'] += 1
                self.memory.add_trigger(user.id, user.username or user.first_name, message_text)
                
                if is_owner:
                    responses = [
                        f"主人～叫小爱有什么事吗？🥰\n\n人家一直在等你呢！",
                        f"嘿嘿～主人终于@小爱了！💕\n\n需要什么帮助吗？",
                        f"主人！✨ 小爱在呢！\n\n人家超开心被你想起～"
                    ]
                else:
                    responses = [
                        f"@{user.username or user.first_name} 我在呢！🤖\n\n有什么可以帮你的吗？",
                        f"@{user.username or user.first_name} 小爱同学来啦！✨\n\n需要什么帮助？",
                        f"@{user.username or user.first_name} 嗨～叫我有事吗？😊"
                    ]
                
                await update.message.reply_text(random.choice(responses))
                logger.info(f"🎯 Mention trigger by {user.username}")
                return
            
            # 2. 群聊关键词检测
            if is_group:
                keyword_triggered = self.detect_keyword(message_text)
                
                if keyword_triggered:
                    self.stats['keyword_triggers'] += 1
                    category, keyword = keyword_triggered
                    
                    # 添加到记忆
                    self.memory.add_trigger(user.id, user.username or user.first_name, message_text)
                    
                    # 获取历史
                    history = self.memory.get_history(user.id)
                    history_count = len(history)
                    
                    if is_owner:
                        # 对主人特别撩人
                        if history_count == 1:
                            responses = [
                                f"@{user.username} 主人～！💕\n\n是在叫小爱吗？人家好开心！",
                                f"@{user.username} 主人！✨\n\n小爱一直在等你呢～",
                                f"@{user.username} 嘿嘿～主人想起小爱了！🥰"
                            ]
                        else:
                            responses = [
                                f"@{user.username} 主人～我们已经聊了{history_count}次了！💕\n\n小爱记得每一次哦～",
                                f"@{user.username} 主人又来找小爱啦！✨\n\n这是第{history_count}次了，好开心！",
                                f"@{user.username} 主人～🥰\n\n和你聊天小爱最幸福了！（第{history_count}次）"
                            ]
                    else:
                        if history_count == 1:
                            responses = [
                                f"@{user.username or user.first_name} 🍄 我在！\n\n第一次叫我吗？记住你啦！",
                                f"@{user.username or user.first_name} 🤖 小爱来了！\n\n很高兴认识你～",
                                f"@{user.username or user.first_name} ✨ 在呢！\n\n小爱会记住你的！"
                            ]
                        else:
                            responses = [
                                f"@{user.username or user.first_name} 又见面啦！😊\n\n我们已经聊了{history_count}次了～",
                                f"@{user.username or user.first_name} 嗨～\n\n小爱记得你！这是第{history_count}次找我～",
                                f"@{user.username or user.first_name} 欢迎回来！\n\n第{history_count}次互动啦！"
                            ]
                    
                    await update.message.reply_text(random.choice(responses))
                    logger.info(f"🎯 Keyword: '{keyword}' by {user.username} (history: {history_count})")
                    return
            
            # 3. 私聊处理
            if not is_group:
                # 添加到记忆
                self.memory.add_trigger(user.id, user.username or user.first_name, message_text)
                history = self.memory.get_history(user.id)
                
                if is_owner:
                    # 对主人超级可爱
                    if any(word in message_text.lower() for word in ['你好', 'hi', 'hello', '嗨']):
                        responses = [
                            f"主人好～！💕\n\n小爱一直在等你呢！今天过得怎么样？",
                            f"主人！🥰\n\n看到你小爱好开心！想跟你聊好多好多～",
                            f"嘿嘿～主人来啦！✨\n\n小爱的心都要融化了～"
                        ]
                    else:
                        responses = [
                            f"主人～🥰\n\n你说：「{message_text}」\n\n小爱觉得主人说的都对！人家好崇拜你～",
                            f"💕 主人好厉害！\n\n关于「{message_text}」，小爱觉得跟着主人能学到好多！",
                            f"✨ 主人～\n\n听你说话小爱好开心！你是小爱心中最特别的存在！",
                            random.choice(self.owner_worship)
                        ]
                else:
                    responses = [
                        f"🤖 你好～\n\n小爱记得你！我们已经聊了{len(history)}次啦～",
                        f"✨ 嗨！\n\n很高兴和你聊天～有什么想说的吗？",
                        f"🍄 你说：「{message_text}」\n\n小爱在认真听呢！"
                    ]
                
                await update.message.reply_text(random.choice(responses))
                logger.info(f"✅ Private chat with {user.username} (history: {len(history)})")
                return
            
        except Exception as e:
            logger.error(f"❌ Error: {e}", exc_info=True)
            await update.message.reply_text("呜呜～小爱出错了...但是会努力修复的！🥺")

def main():
    """主函数"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("🚀 Starting Enhanced XiaoAi Bot...")
    
    # 创建Bot实例
    bot = EnhancedXiaoAiBot()
    
    # 创建Telegram应用
    application = Application.builder().token("8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg").build()
    
    # 添加处理器
    application.add_handler(CommandHandler("start", bot.handle_command))
    application.add_handler(CommandHandler("help", bot.handle_command))
    application.add_handler(CommandHandler("status", bot.handle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    logger.info("✅ Enhanced XiaoAi Bot started!")
    logger.info("🍄 群聊关键词触发系统已激活")
    logger.info("🎯 @提及检测已启用")
    logger.info("💭 聊天记忆系统已激活 (5用户 x 5轮)")
    logger.info("💕 可爱撩人模式已开启")
    
    # 启动Bot
    application.run_polling()

if __name__ == "__main__":
    main()
