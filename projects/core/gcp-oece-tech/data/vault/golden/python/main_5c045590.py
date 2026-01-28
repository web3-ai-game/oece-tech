"""
Telegram Bot主程序
提供管理员面板、内联按钮、智能对话功能
"""
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
)
from dotenv import load_dotenv
import os
import sys

# 添加项目根目录到路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

load_dotenv()

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# 配置
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ADMIN_ID = int(os.getenv('TELEGRAM_ADMIN_ID', 0))

# 管理员键盘
def get_admin_keyboard():
    keyboard = [
        [
            InlineKeyboardButton("📊 查看统计", callback_data='stats'),
            InlineKeyboardButton("⚙️ 系统设置", callback_data='settings'),
        ],
        [
            InlineKeyboardButton("🔍 消息查询", callback_data='search'),
            InlineKeyboardButton("📝 日志查看", callback_data='logs'),
        ],
        [
            InlineKeyboardButton("🔄 重启服务", callback_data='restart'),
            InlineKeyboardButton("📤 导出数据", callback_data='export'),
        ],
        [
            InlineKeyboardButton("🤖 AI设置", callback_data='ai_settings'),
            InlineKeyboardButton("📡 平台管理", callback_data='platforms'),
        ],
    ]
    return InlineKeyboardMarkup(keyboard)

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理/start命令"""
    user_id = update.effective_user.id
    
    if user_id == ADMIN_ID:
        await update.message.reply_text(
            "🎛️ *管理员控制面板*\n\n"
            "欢迎回来！请选择您需要的功能：",
            reply_markup=get_admin_keyboard(),
            parse_mode='Markdown'
        )
    else:
        await update.message.reply_text(
            "👋 您好！我是智能消息聚合助手。\n\n"
            "如需帮助，请联系管理员。"
        )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理按钮回调"""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    if user_id != ADMIN_ID:
        await query.edit_message_text("⛔ 无权限访问")
        return
    
    data = query.data
    
    if data == 'stats':
        stats_text = (
            "📊 *系统统计*\n\n"
            "🔹 今日消息数: 156\n"
            "🔹 AI分析次数: 89\n"
            "🔹 活跃平台: 5\n"
            "🔹 队列消息: 12\n"
            "🔹 系统运行时间: 23小时\n"
        )
        keyboard = [[InlineKeyboardButton("🔙 返回", callback_data='back')]]
        await query.edit_message_text(
            stats_text,
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode='Markdown'
        )
    
    elif data == 'settings':
        settings_keyboard = [
            [InlineKeyboardButton("⏰ 轮询间隔", callback_data='set_interval')],
            [InlineKeyboardButton("🚦 速率限制", callback_data='set_rate_limit')],
            [InlineKeyboardButton("🔔 通知设置", callback_data='set_notifications')],
            [InlineKeyboardButton("🔙 返回", callback_data='back')],
        ]
        await query.edit_message_text(
            "⚙️ *系统设置*\n\n请选择要配置的项目：",
            reply_markup=InlineKeyboardMarkup(settings_keyboard),
            parse_mode='Markdown'
        )
    
    elif data == 'back':
        await query.edit_message_text(
            "🎛️ *管理员控制面板*\n\n请选择您需要的功能：",
            reply_markup=get_admin_keyboard(),
            parse_mode='Markdown'
        )

async def handle_private_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理私聊消息（智能对话）"""
    user_id = update.effective_user.id
    message_text = update.message.text
    
    if user_id == ADMIN_ID:
        # TODO: 集成Gemini API
        await update.message.reply_text(
            "💡 收到您的消息，正在处理中...\n\n"
            f"您说：{message_text}\n\n"
            "（实际部署后会通过Gemini AI智能回复）"
        )
    else:
        await update.message.reply_text("抱歉，目前仅管理员可以使用此功能。")

async def handle_group_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理群组消息（被动回复）"""
    message = update.message
    bot_username = context.bot.username
    
    if message.text and f"@{bot_username}" in message.text:
        await message.reply_text("👋 您好！有什么我可以帮助的吗？")
    elif message.reply_to_message and message.reply_to_message.from_user.id == context.bot.id:
        await message.reply_text("收到！我会处理这条消息。")

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """错误处理"""
    logger.error(f"Update {update} caused error {context.error}")

def main():
    """启动Bot"""
    if not BOT_TOKEN:
        logger.error("请设置TELEGRAM_BOT_TOKEN环境变量！")
        return
    
    if not ADMIN_ID:
        logger.error("请设置TELEGRAM_ADMIN_ID环境变量！")
        return
    
    logger.info("正在启动Telegram Bot...")
    
    application = Application.builder().token(BOT_TOKEN).build()
    
    # 添加处理器
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CallbackQueryHandler(button_callback))
    application.add_handler(
        MessageHandler(
            filters.TEXT & filters.ChatType.PRIVATE & ~filters.COMMAND,
            handle_private_message
        )
    )
    application.add_handler(
        MessageHandler(
            filters.TEXT & filters.ChatType.GROUPS & ~filters.COMMAND,
            handle_group_message
        )
    )
    application.add_error_handler(error_handler)
    
    logger.info("Bot启动成功！")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
