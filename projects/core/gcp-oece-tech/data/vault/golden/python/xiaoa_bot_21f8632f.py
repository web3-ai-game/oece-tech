#!/usr/bin/env python3
"""
小爱同学 Telegram Bot - 群聊关键词触发版本
"""

import os
import logging
from datetime import datetime
from typing import List, Dict
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from config import Config, TaskType
from task_analyzer import TaskAnalyzer
from model_router import ModelRouter
from keyword_detector import KeywordDetector
from database import Database

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=getattr(logging, Config.LOG_LEVEL)
)
logger = logging.getLogger(__name__)


class XiaoAiBot:
    """小爱同学智能Bot - 支持群聊关键词触发"""
    
    def __init__(self):
        self.task_analyzer = TaskAnalyzer()
        self.model_router = ModelRouter()
        self.keyword_detector = KeywordDetector()
        self.database = Database()
        
        self.stats = {
            'total_messages': 0,
            'keyword_triggers': 0,
            'by_type': {t: 0 for t in TaskType},
            'start_time': datetime.now()
        }
        
        logger.info("🤖 XiaoAiBot (小爱同学) initialized")
    
    def is_owner(self, user) -> bool:
        """判断是否是所有者"""
        if user.username and user.username.lower() == Config.OWNER_USERNAME.lower():
            return True
        if Config.OWNER_ID and user.id == Config.OWNER_ID:
            return True
        return False
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """开始命令"""
        user = update.effective_user
        is_owner = self.is_owner(user)
        
        welcome_msg = (
            f"🍄 你好 {user.mention_html()}!\n\n"
            f"我是<b>小爱同学</b>，一个智能的群聊助手。\n\n"
        )
        
        if is_owner:
            welcome_msg += (
                "👑 <b>所有者模式</b>\n"
                "• 使用主Key (KEY_1)\n"
                "• 可使用所有模型 (Pro/Flash/Flash-Lite)\n"
                "• 智能任务识别\n\n"
            )
        else:
            welcome_msg += (
                "💚 <b>用户模式</b>\n"
                "• 使用备用Key (KEY_3)\n"
                "• Flash-Lite 模型\n\n"
            )
        
        welcome_msg += (
            "🎯 <b>群聊触发关键词</b>:\n"
            "• 管理员 / 管理員 / admin\n"
            "• 小爱同学 / 小愛同學 / xiaoai\n\n"
            "在群里提到这些关键词，我会@你回复！\n\n"
            "📝 <b>功能特点</b>:\n"
            "• 自动记录聊天历史（每人5条）\n"
            "• 最多同时服务5个用户\n"
            "• 智能上下文理解\n\n"
            "💬 <b>命令</b>:\n"
            "/start - 开始使用\n"
            "/help - 帮助信息\n"
            "/status - 查看状态\n"
            "/mystats - 我的统计\n"
        )
        
        await update.message.reply_html(welcome_msg)
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """帮助命令"""
        await update.message.reply_html(
            "📖 <b>小爱同学使用指南</b>\n\n"
            "<b>🎯 关键词触发</b> (简体/繁体/英文):\n"
            "• 管理员 / 管理員 / admin / administrator\n"
            "• 小爱同学 / 小愛同學 / xiaoai / xiao ai\n\n"
            "<b>💡 如何使用</b>:\n"
            "1. 在群里发送包含关键词的消息\n"
            "2. 小爱会@你并回复\n"
            "3. 继续对话，我会记住前5条消息\n\n"
            "<b>📊 限制</b>:\n"
            "• 最多同时服务5个用户\n"
            "• 每人保留5条聊天记录\n"
            "• 所有记录都会保存用于分析\n\n"
            "<b>🔒 隐私</b>:\n"
            "• 聊天记录仅用于改进服务\n"
            "• 不会分享给第三方\n\n"
            "🍄 <i>像菌丝网络一样，智能连接每一个人</i>"
        )
    
    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """状态命令"""
        tracker = self.model_router.usage_tracker
        
        status_lines = ["🤖 <b>小爱同学状态报告</b>\n"]
        
        # 关键词触发统计
        status_lines.append(f"🎯 <b>关键词触发</b>: {self.stats['keyword_triggers']} 次\n")
        
        # API Keys状态
        status_lines.append("<b>📡 API Keys</b>:")
        for key_config in Config.API_KEYS:
            key_type = "主线路(Owner)" if key_config.is_primary else "备用线路(用户)"
            status_lines.append(f"  • {key_config.name}: ✅ {key_type}")
        
        # 模型使用情况
        status_lines.append("\n<b>🧠 模型使用情况</b> (今日):")
        from config import ModelType
        for model_type, model_config in Config.MODELS.items():
            primary_count = tracker.get_daily_count(model_type, "PRIMARY")
            backup_count = tracker.get_daily_count(model_type, "BACKUP")
            total = primary_count + backup_count
            limit = model_config.daily_limit
            percentage = (total / limit * 100) if limit > 0 else 0
            
            bar = "🟢" if percentage < 50 else "🟡" if percentage < 80 else "🔴"
            status_lines.append(
                f"  {bar} {model_type.value}: {total}/{limit} ({percentage:.1f}%)"
            )
        
        # 运行时间
        uptime = datetime.now() - self.stats['start_time']
        status_lines.append(f"\n⏱️ <b>运行时间</b>: {uptime}")
        
        await update.message.reply_html("\n".join(status_lines))
    
    async def mystats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """个人统计命令"""
        user = update.effective_user
        
        # 获取用户信息
        user_info = await self.database.get_user_info(
            user.id,
            update.effective_chat.id
        )
        
        # 获取聊天历史
        history = await self.database.get_user_history(
            user.id,
            limit=Config.MAX_CHAT_HISTORY_PER_USER
        )
        
        stats_lines = [f"📊 <b>{user.first_name}的统计</b>\n"]
        
        if user_info:
            stats_lines.append(f"🎯 触发次数: {user_info.get('trigger_count', 0)}")
            stats_lines.append(f"🔑 触发关键词: {user_info.get('triggered_by_keyword', 'N/A')}")
            stats_lines.append(f"📅 最后触发: {user_info.get('last_triggered_at', 'N/A')}")
        
        stats_lines.append(f"\n💬 聊天记录: {len(history)} 条")
        
        if history:
            stats_lines.append("\n<b>最近对话</b>:")
            for i, chat in enumerate(history[:3], 1):
                msg = chat.get('message_text', '')[:30]
                stats_lines.append(f"{i}. {msg}...")
        
        await update.message.reply_html("\n".join(stats_lines))
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息 - 核心逻辑"""
        message_text = update.message.text
        user = update.effective_user
        chat = update.effective_chat
        is_group = chat.type in ['group', 'supergroup', 'channel']
        is_owner = self.is_owner(user)
        
        self.stats['total_messages'] += 1
        detected = None  # 初始化detected变量
        
        try:
            # 1. 检测关键词（群聊）
            if is_group:
                detected = self.keyword_detector.detect(message_text)
                
                if detected:
                    # 检查并发用户限制
                    active_users = await self.database.get_active_users_count(chat.id)
                    
                    if active_users >= Config.MAX_CONCURRENT_USERS:
                        logger.warning(
                            f"⚠️  Max users ({Config.MAX_CONCURRENT_USERS}) reached in chat {chat.id}"
                        )
                        await update.message.reply_text(
                            "抱歉，当前服务用户已满（5人），请稍后再试～"
                        )
                        return
                    
                    # 记录关键词触发
                    self.stats['keyword_triggers'] += 1
                    category, keyword = detected
                    
                    # 注册用户
                    await self.database.register_user(
                        user_id=user.id,
                        username=user.username or user.first_name,
                        first_name=user.first_name,
                        chat_id=chat.id,
                        triggered_by_keyword=keyword
                    )
                    
                    # 生成触发回复
                    trigger_msg = self.keyword_detector.get_trigger_message(
                        keyword,
                        user.username or user.first_name
                    )
                    
                    await update.message.reply_text(trigger_msg)
                    
                    logger.info(
                        f"🎯 Keyword trigger: '{keyword}' by {user.username} in {chat.title}"
                    )
            
            # 2. 获取用户历史
            history = await self.database.get_user_history(user.id, limit=5)
            
            # 3. 任务识别
            intent = await self.task_analyzer.analyze(message_text, is_group)
            self.stats['by_type'][intent.task_type] += 1
            
            # 4. 模型路由（区分Owner和普通用户）
            model_type, api_key, model = await self.model_router.route(
                intent.task_type,
                prefer_backup=is_group,
                is_owner=is_owner
            )
            
            logger.info(
                f"📥 Message from {user.username} ({'OWNER' if is_owner else 'USER'}): "
                f"{message_text[:50]}... → {model_type.value}"
            )
            
            # 5. 构建上下文
            system_context = self._build_context(intent, history, is_owner)
            full_prompt = f"{system_context}\n\n用户: {message_text}\n\n小爱:"
            
            # 6. 生成响应
            response = model.generate_content(full_prompt)
            response_text = response.text
            
            # 7. 发送响应
            if is_group and detected:
                # 群聊中@用户
                mention = f"@{user.username}" if user.username else user.first_name
                response_text = f"{mention}\n{response_text}"
            
            await update.message.reply_text(response_text)
            
            # 8. 保存聊天记录
            await self.database.save_chat_history(
                chat_id=chat.id,
                user_id=user.id,
                username=user.username or user.first_name,
                message_text=message_text,
                response_text=response_text,
                model_used=model_type.value,
                metadata={
                    'is_owner': is_owner,
                    'is_group': is_group,
                    'keyword_triggered': detected is not None,
                    'intent': intent.task_type.value
                }
            )
            
            logger.info(f"✅ Response sent ({len(response_text)} chars)")
            
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}", exc_info=True)
            await update.message.reply_text(
                "抱歉，处理消息时出现错误。请稍后再试。\n\n"
                "🍄 像菌丝一样，我会从错误中学习成长..."
            )
    
    def _build_context(self, intent, history: List, is_owner: bool) -> str:
        """构建系统上下文"""
        context = (
            "你是小爱同学，一个智能、友好、像菌丝网络一样连接一切的AI助手。\n\n"
        )
        
        if is_owner:
            context += "当前用户是所有者(@svskilo)，可以使用所有高级功能。\n\n"
        
        # 添加历史记录
        if history:
            context += "最近的对话历史:\n"
            for chat in reversed(history[:3]):
                user_msg = chat.get('message_text', '')[:50]
                bot_response = chat.get('response_text', '')[:50]
                context += f"用户: {user_msg}\n小爱: {bot_response}\n\n"
        
        # 根据任务类型调整
        if intent.task_type == TaskType.CHAT:
            context += "当前模式：友好闲聊。"
        elif intent.task_type == TaskType.TASK_SIMPLE:
            context += "当前模式：简单任务处理。"
        elif intent.task_type == TaskType.TASK_COMPLEX:
            context += "当前模式：复杂任务，展现专业能力。"
        elif intent.task_type == TaskType.GROUP:
            context += "当前模式：群聊互动，保持简洁。"
        
        return context
    
    async def error_handler(self, update: object, context: ContextTypes.DEFAULT_TYPE):
        """错误处理"""
        logger.error("Exception while handling an update:", exc_info=context.error)


def main():
    """启动Bot"""
    logger.info("🚀 Starting XiaoAi Bot (小爱同学)...")
    
    # 验证配置
    Config.validate()
    
    # 创建Bot实例
    bot = XiaoAiBot()
    
    # 创建Application
    application = Application.builder().token(Config.TELEGRAM_TOKEN).build()
    
    # 注册命令处理器
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("status", bot.status_command))
    application.add_handler(CommandHandler("mystats", bot.mystats_command))
    
    # 注册消息处理器
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message)
    )
    
    # 注册错误处理器
    application.add_error_handler(bot.error_handler)
    
    # 启动Bot
    logger.info("✅ XiaoAi Bot started!")
    logger.info("🍄 群聊关键词触发系统已激活")
    logger.info("🎯 支持关键词: 管理员, 小爱同学 (简繁英)")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
