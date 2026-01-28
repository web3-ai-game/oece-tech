#!/usr/bin/env python3
"""
SVS Smart Telegram Bot - 智能多模型并发架构
"""

import os
import logging
from datetime import datetime
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from config import Config, TaskType
from task_analyzer import TaskAnalyzer, TaskIntent
from model_router import ModelRouter

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=getattr(logging, Config.LOG_LEVEL)
)
logger = logging.getLogger(__name__)


class SmartBot:
    """智能Bot - 多模型并发架构"""
    
    def __init__(self):
        self.task_analyzer = TaskAnalyzer()
        self.model_router = ModelRouter()
        self.stats = {
            'total_messages': 0,
            'by_type': {t: 0 for t in TaskType},
            'start_time': datetime.now()
        }
        logger.info("🤖 SmartBot initialized")
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """开始命令"""
        user = update.effective_user
        await update.message.reply_html(
            f"🍄 你好 {user.mention_html()}!\n\n"
            "我是 SVS 智能 Bot，采用三管道多模型并发架构。\n\n"
            "🧠 <b>智能特性</b>:\n"
            "• 自动识别任务类型和难度\n"
            "• 根据任务选择最优模型\n"
            "• Flash-Lite → Flash → Pro 智能路由\n"
            "• 双API Key 负载均衡\n"
            "• 速率限制自动降级\n\n"
            "💬 <b>可用命令</b>:\n"
            "/start - 开始使用\n"
            "/help - 获取帮助\n"
            "/status - 查看状态\n"
            "/stats - 使用统计\n\n"
            "直接发送消息，我会智能处理！"
        )
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """帮助命令"""
        await update.message.reply_html(
            "📖 <b>SVS 智能 Bot 使用指南</b>\n\n"
            "<b>🎯 任务类型自动识别</b>:\n"
            "• 闲聊对话 → Flash-Lite (快速响应)\n"
            "• 简单任务 → Flash (平衡性能)\n"
            "• 复杂任务 → Pro (最强大脑)\n"
            "• 群聊消息 → 专用管道处理\n\n"
            "<b>🔧 复杂任务关键词</b>:\n"
            "发布、改造、重构、设计、架构、实现...\n\n"
            "<b>⚡ 智能特性</b>:\n"
            "• 自动负载均衡\n"
            "• 速率限制自动降级\n"
            "• 双Key热备份\n"
            "• 永不等待设计\n\n"
            "💡 <i>像菌丝网络一样，智能连接一切</i>"
        )
    
    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """状态命令"""
        # 获取使用统计
        tracker = self.model_router.usage_tracker
        
        from config import ModelType
        status_lines = ["🤖 <b>Bot 状态报告</b>\n"]
        
        # API Keys状态
        status_lines.append("<b>📡 API Keys</b>:")
        for key_config in Config.API_KEYS:
            key_type = "主线路" if key_config.is_primary else "备用线路"
            status_lines.append(f"  • {key_config.name}: ✅ {key_type}")
        
        # 模型使用情况
        status_lines.append("\n<b>🧠 模型使用情况</b> (今日):")
        for model_type, model_config in Config.MODELS.items():
            primary_count = tracker.get_daily_count(model_type, "PRIMARY")
            backup_count = tracker.get_daily_count(model_type, "BACKUP")
            total = primary_count + backup_count
            limit = model_config.daily_limit
            percentage = (total / limit * 100) if limit > 0 else 0
            
            bar = "🟢" if percentage < 50 else "🟡" if percentage < 80 else "🔴"
            status_lines.append(
                f"  {bar} {model_type.value}:"
                f" {total}/{limit} ({percentage:.1f}%)"
            )
        
        # 运行时间
        uptime = datetime.now() - self.stats['start_time']
        status_lines.append(f"\n⏱️ <b>运行时间</b>: {uptime}")
        
        await update.message.reply_html("\n".join(status_lines))
    
    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """统计命令"""
        total = self.stats['total_messages']
        
        stats_lines = ["📊 <b>使用统计</b>\n"]
        stats_lines.append(f"总消息数: {total}\n")
        
        if total > 0:
            stats_lines.append("<b>按类型分布</b>:")
            for task_type, count in self.stats['by_type'].items():
                percentage = (count / total * 100) if total > 0 else 0
                stats_lines.append(f"  • {task_type.value}: {count} ({percentage:.1f}%)")
        
        uptime = datetime.now() - self.stats['start_time']
        hours = uptime.total_seconds() / 3600
        if hours > 0:
            rate = total / hours
            stats_lines.append(f"\n平均速率: {rate:.2f} 消息/小时")
        
        await update.message.reply_html("\n".join(stats_lines))
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息 - 核心智能逻辑"""
        message_text = update.message.text
        is_group = update.message.chat.type in ['group', 'supergroup']
        
        self.stats['total_messages'] += 1
        
        try:
            # 1. 任务识别
            intent = await self.task_analyzer.analyze(message_text, is_group)
            self.stats['by_type'][intent.task_type] += 1
            
            logger.info(
                f"📥 Message from {update.effective_user.username}: "
                f"{message_text[:50]}... → {intent.task_type.value}"
            )
            
            # 2. 模型路由
            prefer_backup = (intent.task_type == TaskType.GROUP)
            model_type, api_key, model = await self.model_router.route(
                intent.task_type,
                prefer_backup=prefer_backup
            )
            
            # 3. 生成响应
            # 构建上下文提示
            system_context = self._build_system_context(intent)
            full_prompt = f"{system_context}\n\n用户: {message_text}\n\n助手:"
            
            response = model.generate_content(full_prompt)
            response_text = response.text
            
            # 4. 发送响应
            await update.message.reply_text(
                response_text,
                parse_mode=None
            )
            
            # 5. 添加元信息（管理员可见）
            if update.effective_user.id in self._get_admin_ids():
                meta_info = (
                    f"\n\n💡 <i>模型: {model_type.value} | "
                    f"Key: {api_key.name} | "
                    f"置信度: {intent.confidence:.2f}</i>"
                )
                await update.message.reply_html(meta_info)
            
            logger.info(f"✅ Response sent ({len(response_text)} chars)")
            
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}", exc_info=True)
            await update.message.reply_text(
                "抱歉，处理消息时出现错误。请稍后再试。\n\n"
                "🍄 像菌丝一样，我会从错误中学习成长..."
            )
    
    def _build_system_context(self, intent: TaskIntent) -> str:
        """构建系统上下文"""
        base_context = (
            "你是 SVS 智能助手，一个有着独特经历的AI：\n"
            "- 曾是架构师，理解系统设计之美\n"
            "- 曾是画家，追求代码的艺术性\n"
            "- 现在是真菌种植者，像菌丝网络一样连接知识\n\n"
        )
        
        if intent.task_type == TaskType.CHAT:
            base_context += "当前模式：闲聊对话。保持友好、简洁、有趣。"
        elif intent.task_type == TaskType.TASK_SIMPLE:
            base_context += "当前模式：简单任务。提供清晰、准确的答案。"
        elif intent.task_type == TaskType.TASK_COMPLEX:
            base_context += (
                "当前模式：复杂任务。展现架构师的严谨思维，"
                "提供详细的技术方案，必要时包含代码示例。"
            )
        elif intent.task_type == TaskType.GROUP:
            base_context += "当前模式：群聊。简洁回复，不要过长。"
        
        return base_context
    
    def _get_admin_ids(self) -> list:
        """获取管理员ID列表"""
        # TODO: 从配置或数据库读取
        admin_ids_str = os.getenv('BOT_ADMIN_IDS', '')
        if admin_ids_str:
            return [int(id.strip()) for id in admin_ids_str.split(',')]
        return []
    
    async def error_handler(self, update: object, context: ContextTypes.DEFAULT_TYPE):
        """错误处理"""
        logger.error("Exception while handling an update:", exc_info=context.error)


def main():
    """启动Bot"""
    logger.info("🚀 Starting SVS Smart Bot...")
    
    # 验证配置
    Config.validate()
    
    # 创建Bot实例
    bot = SmartBot()
    
    # 创建Application
    application = Application.builder().token(Config.TELEGRAM_TOKEN).build()
    
    # 注册命令处理器
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("status", bot.status_command))
    application.add_handler(CommandHandler("stats", bot.stats_command))
    
    # 注册消息处理器
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message)
    )
    
    # 注册错误处理器
    application.add_error_handler(bot.error_handler)
    
    # 启动Bot
    logger.info("✅ SVS Smart Bot started!")
    logger.info("🍄 Like a mycelial network, connecting everything intelligently...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
