#!/usr/bin/env python3
"""
SVS Telegram Bot (@svskilo)
A Telegram bot for SVS services
"""

import os
import logging
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """发送欢迎消息"""
    user = update.effective_user
    await update.message.reply_html(
        rf"Hi {user.mention_html()}! 👋"
        "\n\n欢迎使用 SVS Bot！"
        "\n\n可用命令："
        "\n/start - 开始使用"
        "\n/help - 获取帮助"
        "\n/status - 检查状态"
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """发送帮助信息"""
    await update.message.reply_text(
        "🤖 SVS Bot 帮助\n\n"
        "可用命令：\n"
        "/start - 开始使用\n"
        "/help - 显示此帮助信息\n"
        "/status - 检查 bot 状态\n"
    )


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """检查 bot 状态"""
    await update.message.reply_text(
        "✅ Bot 运行正常！\n"
        f"🤖 Bot: @{context.bot.username}\n"
        "🌱 像菌丝网络一样，连接一切..."
    )


async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """回显消息"""
    await update.message.reply_text(
        f"你说: {update.message.text}\n\n"
        "🍄 我正在学习如何更好地为你服务..."
    )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """处理错误"""
    logger.error(msg="Exception while handling an update:", exc_info=context.error)


def main() -> None:
    """启动 bot"""
    # 从环境变量获取 token
    token = os.getenv('TELEGRAM_BOT_SVSKILO_TOKEN')
    if not token:
        raise ValueError("未找到 TELEGRAM_BOT_SVSKILO_TOKEN 环境变量")
    
    logger.info("🚀 正在启动 SVS Bot...")
    
    # 创建应用
    application = Application.builder().token(token).build()
    
    # 注册命令处理器
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("status", status_command))
    
    # 注册消息处理器
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    # 注册错误处理器
    application.add_error_handler(error_handler)
    
    # 启动 bot
    logger.info("✅ SVS Bot 已启动，开始监听消息...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
