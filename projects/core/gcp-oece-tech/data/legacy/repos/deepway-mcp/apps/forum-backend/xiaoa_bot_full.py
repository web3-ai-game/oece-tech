#!/usr/bin/env python3
"""
小爱同学Bot 完整版 - 修复所有功能
"""

import logging
import random
from datetime import datetime
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logger = logging.getLogger(__name__)

class FullXiaoAiBot:
    """完整版小爱同学Bot"""
    
    def __init__(self):
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'owner_messages': 0,
            'group_messages': 0,
            'private_messages': 0,
            'commands': 0
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
        
        logger.info("🤖 FullXiaoAiBot initialized")
        logger.info(f"🔍 Keywords loaded: {len(self.all_keywords)}")
    
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
    
    async def handle_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理命令"""
        message_text = update.message.text
        user = update.effective_user
        chat = update.effective_chat
        is_group = chat.type in ['group', 'supergroup', 'channel']
        
        self.stats['commands'] += 1
        
        if message_text == '/start':
            await update.message.reply_text(
                "🤖 你好！我是小爱同学！\n\n"
                "🍄 像菌丝网络一样，我可以连接一切！\n\n"
                "💬 **群聊功能**:\n"
                "• 发送「管理员」或「小爱同学」触发我\n"
                "• 我会@你并智能回复\n"
                "• 支持简繁英文关键词\n\n"
                "📊 **命令**:\n"
                "• /status - 查看状态\n"
                "• /mystats - 个人统计\n"
                "• /help - 帮助信息\n\n"
                "✨ 现在就去群里试试吧！"
            )
            
        elif message_text == '/help':
            help_text = """
🤖 小爱同学完整帮助

📝 **使用方式**:
• 私聊：直接对话，智能回复
• 群聊：发送关键词触发

🔑 **关键词列表**:
**管理员类**:
• 管理员 / 管理員 / admin
• administrator / moderator

**小爱同学类**:
• 小爱同学 / 小愛同學
• xiaoai / xiao ai / little love

⚡ **功能特点**:
• 🎯 精准关键词检测
• 📢 群聊@用户提醒
• 🤖 智能上下文回复
• 📊 实时统计监控
• 🍄 菌丝网络般连接

📊 **命令**:
• /start - 开始使用
• /status - 系统状态
• /mystats - 个人统计
• /help - 帮助信息

💡 **使用技巧**:
1. 群聊中直接说"管理员"或"小爱同学"
2. 我会立即@你并回复
3. 私聊可以随意对话
4. 支持中英文混合

🍄 像菌丝一样连接一切！
            """
            await update.message.reply_text(help_text)
            
        elif message_text == '/status':
            status_text = f"""
🤖 小爱同学系统状态

📊 **实时统计**:
• 总消息数: {self.stats['total_messages']}
• 关键词触发: {self.stats['keyword_triggers']}
• Owner消息: {self.stats['owner_messages']}
• 群聊消息: {self.stats['group_messages']}
• 私聊消息: {self.stats['private_messages']}
• 命令执行: {self.stats['commands']}

🔧 **系统信息**:
• Bot名称: 小爱同学 (svskilo_bot)
• 版本: 完整版 v2.0
• 关键词数量: {len(self.all_keywords)}
• 运行状态: 🟢 正常

⚡ **功能状态**:
• 群聊关键词检测: ✅ 正常
• @用户功能: ✅ 正常
• 智能回复: ✅ 正常
• 命令系统: ✅ 正常

🍄 系统运行完美！
            """
            await update.message.reply_text(status_text)
            
        elif message_text == '/mystats':
            # 简单的用户统计
            user_stats = f"""
📊 你的使用统计

👤 **用户信息**:
• 用户名: {user.username or '无'}
• 昵称: {user.first_name}
• 用户ID: {user.id}

💬 **互动统计**:
• 当前会话消息: {self.stats['total_messages']}
• 触发关键词: {self.stats['keyword_triggers']}
• 是否为Owner: {'是' if self.is_owner(user) else '否'}

🎯 **功能权限**:
• 私聊对话: ✅ 完全可用
• 群聊触发: ✅ 完全可用
• 高级功能: {'✅ Owner专用' if self.is_owner(user) else '⭐ 标准功能'}

🍄 感谢使用小爱同学！
            """
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
        
        logger.info(f"📨 Message from {user.username} (group: {is_group}): {message_text[:50]}...")
        
        try:
            # 1. 群聊关键词检测
            if is_group:
                keyword_triggered = self.detect_keyword(message_text)
                
                if keyword_triggered:
                    # 记录触发
                    self.stats['keyword_triggers'] += 1
                    category, keyword = keyword_triggered
                    
                    # 生成智能触发回复
                    trigger_responses = [
                        f"@{user.username or user.first_name} 🍄 我在！听到你的呼唤了！\n\n需要什么帮助吗？我可以：\n• 回答问题\n• 提供建议\n• 聊天陪伴\n• 协助任务",
                        f"@{user.username or user.first_name} 🤖 小爱同学来啦！\n\n很高兴为你服务！有什么想法或问题都可以告诉我～",
                        f"@{user.username or user.first_name} ✨ 召唤成功！\n\n我是你的AI助手小爱同学，像菌丝网络一样连接知识和创意。请讲！",
                        f"@{user.username or user.first_name} 🌱 收到召唤！\n\n小爱同学在此，随时准备为你提供帮助和支持！"
                    ]
                    
                    trigger_msg = random.choice(trigger_responses)
                    await update.message.reply_text(trigger_msg)
                    
                    logger.info(f"🎯 Keyword trigger: '{keyword}' by {user.username} in {chat.title}")
                    return
            
            # 2. 私聊智能回复
            if not is_group:
                # 根据消息内容智能回复
                if any(greeting in message_text.lower() for greeting in ['你好', 'hello', 'hi', '嗨']):
                    responses = [
                        f"🍄 你好 {user.first_name}！我是小爱同学，很高兴认识你！\n\n有什么可以帮助你的吗？",
                        f"🤖 嗨 {user.first_name}！小爱同学在此！\n\n随时准备为你提供帮助～",
                        f"✨ 你好呀！我是小爱同学，像菌丝网络一样连接一切！\n\n今天想聊什么呢？"
                    ]
                elif any(question in message_text for question in ['？', '?', '吗', '呢', '如何', '怎么']):
                    responses = [
                        f"🤔 {user.first_name}，这是个好问题！\n\n让我想想... {message_text}\n\n我的建议是：保持开放的心态，像菌丝一样探索各种可能性！",
                        f"💡 关于「{message_text}」，我觉得...\n\n这需要从多个角度来考虑。小爱同学建议你可以试试不同的思路！",
                        f"🌱 {user.first_name}，你问得很好！\n\n对于这个问题，我觉得最重要的是保持好奇心和探索精神。"
                    ]
                elif len(message_text) < 10:
                    responses = [
                        "🍄 嗨！我是小爱同学，很高兴收到你的消息！\n\n想聊什么呢？",
                        "🤖 小爱同学在此！有什么可以帮你的吗？",
                        "✨ 你好！我是你的AI助手，随时准备为你服务！"
                    ]
                else:
                    responses = [
                        f"🍄 {user.first_name}，我收到你的消息了！\n\n你说：{message_text}\n\n这很有意思！让我想想怎么回应...\n\n我觉得我们可以从多个角度来探讨这个话题！",
                        f"🤖 嗨 {user.first_name}！\n\n关于「{message_text}」，小爱同学觉得...\n\n这是一个很有深度的话题！我很乐意和你一起探讨。",
                        f"✨ {user.first_name}，感谢分享！\n\n你说：{message_text}\n\n像菌丝网络一样，知识和想法需要连接才能产生新的洞见。让我们一起探索吧！"
                    ]
                
                response_text = random.choice(responses)
                await update.message.reply_text(response_text)
                
                logger.info(f"✅ Private response sent to {user.username}")
                return
            
            # 3. 群聊非关键词不回复（避免噪音）
            if is_group and not any(keyword.lower() in message_text.lower() for keyword in self.all_keywords):
                logger.info(f"🔇 Group message ignored (no keyword): {message_text[:30]}...")
                return
            
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}", exc_info=True)
            await update.message.reply_text(
                "抱歉，处理消息时出现了一些小问题。\n\n"
                "🍄 但别担心，像菌丝一样，我会从错误中学习成长！\n\n"
                "请稍后再试，或者试试换个说法～"
            )

def main():
    """主函数"""
    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("🚀 Starting Full XiaoAi Bot...")
    
    # 创建Bot实例
    bot = FullXiaoAiBot()
    
    # 创建Telegram应用
    application = Application.builder().token("8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg").build()
    
    # 添加处理器
    application.add_handler(CommandHandler("start", bot.handle_command))
    application.add_handler(CommandHandler("help", bot.handle_command))
    application.add_handler(CommandHandler("status", bot.handle_command))
    application.add_handler(CommandHandler("mystats", bot.handle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    logger.info("✅ Full XiaoAi Bot started!")
    logger.info("🍄 群聊关键词触发系统已激活")
    logger.info("🎯 支持关键词: 管理员, 小爱同学 (简繁英)")
    logger.info("🤖 智能回复系统已启用")
    logger.info("📊 统计功能已激活")
    
    # 启动Bot
    application.run_polling()

if __name__ == "__main__":
    main()
