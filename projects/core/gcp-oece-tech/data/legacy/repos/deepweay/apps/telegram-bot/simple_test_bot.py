#!/usr/bin/env python3
"""简化测试Bot - 打印所有收到的消息"""

import asyncio
import logging
from telegram import Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot Token
TOKEN = "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"

async def handle_all_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理所有消息"""
    if not update.message:
        return
    
    msg = update.message
    chat_type = msg.chat.type
    chat_title = msg.chat.title or "私聊"
    user = msg.from_user.username or msg.from_user.first_name
    text = msg.text or "[非文本]"
    
    logger.info(f"""
╔══════════════════════════════════════════════════════════════╗
║ 📨 收到消息
╠══════════════════════════════════════════════════════════════╣
║ 聊天类型: {chat_type}
║ 聊天名称: {chat_title}
║ 发送者: @{user}
║ 内容: {text}
║ Chat ID: {msg.chat.id}
║ Message ID: {msg.message_id}
╚══════════════════════════════════════════════════════════════╝
    """)
    
    # 回复确认
    try:
        await msg.reply_text(f"✅ 收到！来自 @{user} 的消息")
    except Exception as e:
        logger.error(f"回复失败: {e}")

def main():
    """启动Bot"""
    logger.info("🚀 启动简化测试Bot")
    logger.info(f"Token: {TOKEN[:20]}...")
    
    # 创建应用
    app = Application.builder().token(TOKEN).build()
    
    # 添加消息处理器 - 接收所有消息
    app.add_handler(MessageHandler(filters.ALL, handle_all_messages))
    
    logger.info("✅ Bot启动成功，等待消息...")
    logger.info("💡 在群里发送任何消息测试")
    
    # 启动轮询
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
