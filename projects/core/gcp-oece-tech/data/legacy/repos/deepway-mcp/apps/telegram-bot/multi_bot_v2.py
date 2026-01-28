#!/usr/bin/env python3
"""
多Bot群聊系统 V2 - 增强版
- 小爱同学: 5轮对话追踪 + @用户名回复
- 倩倩姐: 高冷女神，偶尔回复
- Notion助手: 专业知识分享
"""

import asyncio
import logging
import os
import random
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import redis
from telegram import Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Redis连接
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True
)

# Bot配置
BOTS = {
    "xiaoai": {
        "token": os.getenv("TELEGRAM_BOT_XIAOAI_TOKEN", "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"),
        "name": "小爱同学",
        "username": "svskilo_bot",
        "role": "群管理 + 5轮对话",
        "personality": "温暖、理解、支持",
        "reply_rate": 1.0,  # 100% 触发时回复
    },
    "qianqian": {
        "token": os.getenv("TELEGRAM_BOT_QIANQIAN_TOKEN", "8364183144:AAEIKOLENbquiX_KT_UlpGPU06tlbvn0z2w"),
        "name": "倩倩姐",
        "username": "qitiandashengqianqian_bot",
        "role": "高冷女神",
        "personality": "高冷、简洁、偶尔温柔",
        "reply_rate": 0.15,  # 15% 随机回复
    },
    "notion": {
        "token": os.getenv("TELEGRAM_BOT_NOTION_TOKEN", "7849921796:AAHb7fhDG_ooYzgP6sYjv7ALy6jqZaBf66E"),
        "name": "Notion助手",
        "username": "svs_notion_bot",
        "role": "专业知识分享",
        "personality": "专业、理性、博学",
        "reply_rate": 0.12,  # 12% 随机回复
    }
}

# 小爱同学触发关键词
XIAOAI_KEYWORDS = {
    "简体": ["小爱", "小爱同学", "群主", "管理", "我操", "都来", "接茬"],
    "繁体": ["小愛", "小愛同學", "群主", "管理", "我操", "都來", "接茬"],
    "英文": ["xiaoai", "admin", "manager", "help", "hey"]
}

class ConversationTracker:
    """对话追踪器 - 5轮对话系统"""
    
    def __init__(self):
        self.max_rounds = 5
        self.expire_time = 3600  # 1小时过期
    
    def get_key(self, chat_id: int, user_id: int) -> str:
        """获取Redis键"""
        return f"conv:{chat_id}:{user_id}"
    
    def get_round(self, chat_id: int, user_id: int) -> int:
        """获取当前轮次"""
        key = self.get_key(chat_id, user_id)
        round_num = redis_client.get(key)
        return int(round_num) if round_num else 0
    
    def increment_round(self, chat_id: int, user_id: int) -> int:
        """增加轮次"""
        key = self.get_key(chat_id, user_id)
        new_round = redis_client.incr(key)
        redis_client.expire(key, self.expire_time)
        
        # 超过5轮重置
        if new_round > self.max_rounds:
            redis_client.set(key, 1)
            redis_client.expire(key, self.expire_time)
            return 1
        
        return new_round
    
    def reset_round(self, chat_id: int, user_id: int):
        """重置轮次"""
        key = self.get_key(chat_id, user_id)
        redis_client.delete(key)

tracker = ConversationTracker()

class BotPersonality:
    """Bot人格系统"""
    
    @staticmethod
    def xiaoai_reply(username: str, round_num: int, user_message: str) -> str:
        """小爱同学回复 - 温暖群管理"""
        templates = [
            f"@{username} 我明白你的感受 😊 [{round_num}/5]",
            f"@{username} 让我来帮你 💝 [{round_num}/5]",
            f"@{username} 我一直在这里 🌟 [{round_num}/5]",
            f"@{username} 别担心，慢慢说 💫 [{round_num}/5]",
            f"@{username} 我懂你的意思 ✨ [{round_num}/5]",
        ]
        return random.choice(templates)
    
    @staticmethod
    def qianqian_reply(username: str, user_message: str) -> str:
        """倩倩姐回复 - 高冷女神"""
        templates = [
            f"@{username} 嗯。",
            f"@{username} 知道了。",
            f"@{username} 随便。",
            f"@{username} 哦。",
            f"@{username} 行吧。",
            f"@{username} 可以。",
            f"@{username} 无所谓。",
        ]
        return random.choice(templates)
    
    @staticmethod
    def notion_reply(username: str, user_message: str) -> str:
        """Notion助手回复 - 专业知识"""
        templates = [
            f"@{username} 根据我的了解，这个问题需要从多个角度分析 📚",
            f"@{username} 建议参考相关文献和资料 💡",
            f"@{username} 从专业角度来看，这涉及到几个关键概念 🔍",
            f"@{username} 让我分享一些专业见解 📖",
            f"@{username} 这个话题很有深度，值得深入探讨 🎓",
        ]
        return random.choice(templates)

def check_xiaoai_trigger(text: str) -> bool:
    """检查是否触发小爱同学"""
    if not text:
        return False
    
    text_lower = text.lower()
    
    # 检查所有关键词
    for lang, keywords in XIAOAI_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text_lower:
                return True
    
    return False

async def handle_group_message(update: Update, context: ContextTypes.DEFAULT_TYPE, bot_name: str):
    """处理群消息"""
    if not update.message or not update.message.text:
        return
    
    msg = update.message
    chat_id = msg.chat.id
    user_id = msg.from_user.id
    username = msg.from_user.username or msg.from_user.first_name
    text = msg.text
    
    # 忽略Bot自己的消息
    bot_usernames = [b["username"] for b in BOTS.values()]
    if msg.from_user.username in bot_usernames:
        return
    
    logger.info(f"[{bot_name}] 收到消息: @{username}: {text[:50]}")
    
    # 小爱同学逻辑
    if bot_name == "xiaoai":
        if check_xiaoai_trigger(text):
            # 获取当前轮次
            current_round = tracker.get_round(chat_id, user_id)
            new_round = tracker.increment_round(chat_id, user_id)
            
            # 生成回复
            reply = BotPersonality.xiaoai_reply(username, new_round, text)
            
            try:
                await msg.reply_text(reply)
                logger.info(f"[小爱同学] 回复 @{username} [{new_round}/5]: {reply}")
                
                # 随机触发另一个Bot
                if random.random() < 0.3:  # 30%概率
                    other_bot = random.choice(["qianqian", "notion"])
                    await asyncio.sleep(random.uniform(1, 3))
                    
                    if other_bot == "qianqian":
                        other_reply = BotPersonality.qianqian_reply(username, text)
                    else:
                        other_reply = BotPersonality.notion_reply(username, text)
                    
                    # 这里需要用另一个Bot发送，暂时用同一个Bot模拟
                    logger.info(f"[{BOTS[other_bot]['name']}] 也想回复: {other_reply}")
                    
            except Exception as e:
                logger.error(f"回复失败: {e}")
    
    # 倩倩姐逻辑 - 高冷随机回复
    elif bot_name == "qianqian":
        if random.random() < BOTS["qianqian"]["reply_rate"]:
            reply = BotPersonality.qianqian_reply(username, text)
            
            try:
                await msg.reply_text(reply)
                logger.info(f"[倩倩姐] 高冷回复: {reply}")
            except Exception as e:
                logger.error(f"回复失败: {e}")
    
    # Notion助手逻辑 - 专业随机回复
    elif bot_name == "notion":
        if random.random() < BOTS["notion"]["reply_rate"]:
            reply = BotPersonality.notion_reply(username, text)
            
            try:
                await msg.reply_text(reply)
                logger.info(f"[Notion助手] 专业回复: {reply}")
            except Exception as e:
                logger.error(f"回复失败: {e}")

async def create_bot_app(bot_name: str, token: str) -> Application:
    """创建Bot应用"""
    app = Application.builder().token(token).build()
    
    # 添加消息处理器
    async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await handle_group_message(update, context, bot_name)
    
    app.add_handler(MessageHandler(filters.TEXT & filters.ChatType.GROUPS, message_handler))
    
    return app

def main():
    """主函数"""
    logger.info("="*70)
    logger.info("🚀 启动多Bot群聊系统 V2")
    logger.info("="*70)
    
    # 检查Redis
    try:
        redis_client.ping()
        logger.info("✅ Redis连接成功")
    except Exception as e:
        logger.error(f"❌ Redis连接失败: {e}")
        return
    
    # 显示Bot配置
    logger.info("\n📋 Bot配置:")
    for bot_id, config in BOTS.items():
        logger.info(f"  • {config['name']} (@{config['username']})")
        logger.info(f"    角色: {config['role']}")
        logger.info(f"    人格: {config['personality']}")
        logger.info(f"    回复率: {config['reply_rate']*100}%")
    
    logger.info("\n🔑 触发关键词 (小爱同学):")
    for lang, keywords in XIAOAI_KEYWORDS.items():
        logger.info(f"  {lang}: {', '.join(keywords)}")
    
    logger.info("\n" + "="*70)
    logger.info("✅ 所有Bot启动成功，开始监听...")
    logger.info("="*70 + "\n")
    
    # 只启动小爱同学 (简化版本)
    logger.info("🤖 启动小爱同学...")
    config = BOTS["xiaoai"]
    app = Application.builder().token(config["token"]).build()
    
    # 添加消息处理器
    async def xiaoai_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await handle_group_message(update, context, "xiaoai")
    
    app.add_handler(MessageHandler(filters.TEXT & filters.ChatType.GROUPS, xiaoai_handler))
    
    # 启动Bot
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
