#!/usr/bin/env python3
"""
小爱同学Bot 简化版 - 专注解决群聊触发问题
"""

import logging
import asyncio
import random
from datetime import datetime
from typing import List, Dict, Optional
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logger = logging.getLogger(__name__)

class SimpleXiaoAiBot:
    """简化版小爱同学Bot"""
    
    def __init__(self):
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'owner_messages': 0,
            'group_messages': 0,
            'private_messages': 0
        }
        
        # 关键词定义
        self.keywords = {
            '管理员': ['管理员', '管理員', 'admin', 'administrator', 'moderator'],
            '小爱同学': ['小爱同学', '小愛同學', 'xiaoai', 'xiao ai', 'little love']
        }
        
        # 展平所有关键词
        self.all_keywords = []
        for category, keywords in self.keywords.items():
            self.all_keywords.extend(keywords)
        
        logger.info("🤖 SimpleXiaoAiBot initialized")
        logger.info(f"🔍 Keywords loaded: {len(self.all_keywords)}")
    
    def is_owner(self, user) -> bool:
        """检查是否为Owner"""
        return user.username == 'svskilo'
    
    def detect_keyword(self, message: str) -> Optional[tuple]:
        """检测关键词"""
        message_lower = message.lower()
        
        for category, keywords in self.keywords.items():
            for keyword in keywords:
                if keyword.lower() in message_lower:
                    logger.info(f"🎯 Keyword detected: '{keyword}' (category: {category})")
                    return (category, keyword)
        
        return None
    
    async def handle_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理命令"""
        message_text = update.message.text
        user = update.effective_user
        
        if message_text == '/start':
            await update.message.reply_text(
                "🤖 你好！我是小爱同学！\n\n"
                "🍄 像菌丝网络一样，我可以连接一切！\n\n"
                "💬 在群聊中发送「管理员」或「小爱同学」来触发我\n"
                "📊 /status - 查看状态\n"
                "❓ /help - 帮助信息"
            )
            
        elif message_text == '/help':
            help_text = """
🤖 小爱同学帮助

📝 **使用方式**:
• 私聊：直接对话
• 群聊：发送关键词触发

🔑 **关键词**:
• 管理员 / 管理員 / admin
• 小爱同学 / 小愛同學 / xiaoai

⚡ **功能**:
• 智能对话
• 关键词触发
• 群聊助手

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

🍄 系统运行正常！
            """
            await update.message.reply_text(status_text)
    
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
                keyword_triggered = self.detect_keyword(message_text)
                
                if keyword_triggered:
                    # 记录触发
                    self.stats['keyword_triggers'] += 1
                    category, keyword = keyword_triggered
                    
                    # 生成触发回复
                    trigger_responses = [
                        f"@{user.username or user.first_name} 🍄 我在！有什么可以帮助你的吗？",
                        f"@{user.username or user.first_name} 🤖 小爱同学来啦！请讲～",
                        f"@{user.username or user.first_name} ✨ 听到我的名字啦！需要什么帮助？"
                    ]
                    
                    trigger_msg = random.choice(trigger_responses)
                    await update.message.reply_text(trigger_msg)
                    
                    logger.info(f"🎯 Keyword trigger: '{keyword}' by {user.username} in {chat.title}")
                    return  # 群聊触发后不再生成AI响应
            
            # 2. 生成AI响应（简化版）
            if is_group and not keyword_triggered:
                return  # 群聊非关键词不回复
            
            # 简单响应模板
            if is_owner:
                responses = [
                    f"🍄 {user.first_name}，我收到你的消息了！\n\n你说：{message_text}\n\n有什么我可以帮助你的吗？",
                    f"🤖 嗨 {user.first_name}！\n\n你的消息：{message_text}\n\n让我想想怎么帮你...",
                    f"✨ {user.first_name}，收到！\n\n「{message_text}」\n\n需要我做什么吗？"
                ]
            else:
                responses = [
                    "🍄 你好！我是小爱同学，很高兴为你服务！",
                    "🤖 小爱同学来啦！有什么可以帮助你的吗？",
                    "✨ 你好！我像菌丝网络一样连接一切，请问有什么需要？",
                    "🌱 你好！我是小爱同学，请讲～"
                ]
            
            response_text = random.choice(responses)
            await update.message.reply_text(response_text)
            
            logger.info(f"✅ Response sent to {user.username} (group: {is_group})")
            
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}", exc_info=True)
            await update.message.reply_text(
                "抱歉，处理消息时出现错误。请稍后再试。\n\n"
                "🍄 像菌丝一样，我会从错误中学习成长..."
            )

def main():
    """主函数"""
    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("🚀 Starting Simple XiaoAi Bot...")
    
    # 创建Bot实例
    bot = SimpleXiaoAiBot()
    
    # 创建Telegram应用
    application = Application.builder().token("8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg").build()
    
    # 添加处理器
    application.add_handler(CommandHandler("start", bot.handle_command))
    application.add_handler(CommandHandler("help", bot.handle_command))
    application.add_handler(CommandHandler("status", bot.handle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    logger.info("✅ Simple XiaoAi Bot started!")
    logger.info("🍄 群聊关键词触发系统已激活")
    logger.info("🎯 支持关键词: 管理员, 小爱同学 (简繁英)")
    
    # 启动Bot
    application.run_polling()

if __name__ == "__main__":
    main()
