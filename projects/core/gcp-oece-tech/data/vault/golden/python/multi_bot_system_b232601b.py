#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多Bot群聊系统
支持3个Bot协同工作，制造群聊活跃度
"""

import os
import json
import random
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict, deque

import redis.asyncio as redis
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ========================
# Bot人格配置
# ========================

class BotPersonality:
    """Bot人格配置"""
    
    XIAOAI = {
        'name': '小爱同学',
        'role': '群管理',
        'response_rate': 1.0,  # 100% 被触发时
        'emojis': ['😊', '💝', '🌟', '✨'],
        'templates': [
            '我明白你的感受 {emoji}',
            '让我来帮你 {emoji}',
            '这个问题很有意思 {emoji}',
        ]
    }
    
    NOTION = {
        'name': 'Notion助手',
        'role': '知识分享',
        'response_rate': 0.1,  # 10% 随机回复
        'emojis': ['📚', '💡', '🔍'],
        'templates': [
            '根据我的了解，{content}',
            '从专业角度来看，{content}',
            '建议参考：{content}',
        ]
    }
    
    QIANQIAN = {
        'name': '倩倩姐',
        'role': '活跃气氛',
        'response_rate': 0.15,  # 15% 随机回复
        'emojis': ['😄', '🎉', '💖', '🌈', '✨'],
        'templates': [
            '哈哈哈 {emoji} {content}',
            '我觉得 {emoji} {content}',
            '有意思！{emoji} {content}',
        ]
    }

# ========================
# 群聊记忆系统
# ========================

class GroupMemorySystem:
    """群聊记忆系统 - 5用户×5对话"""
    
    def __init__(self):
        self.redis_client = None
        self.local_memory = defaultdict(lambda: deque(maxlen=5))
        
    async def connect_redis(self, redis_url: str):
        """连接Redis"""
        try:
            self.redis_client = await redis.from_url(redis_url)
            logger.info("✅ Redis连接成功")
        except Exception as e:
            logger.warning(f"⚠️ Redis连接失败，使用本地内存: {e}")
            
    async def remember(self, user_id: int, message: str, chat_id: int):
        """记录用户消息"""
        key = f"group_memory:{chat_id}:{user_id}"
        
        memory_item = {
            'time': datetime.now().isoformat(),
            'message': message
        }
        
        # 添加到本地内存
        self.local_memory[key].append(memory_item)
        
        # 同步到Redis
        if self.redis_client:
            try:
                await self.redis_client.lpush(key, json.dumps(memory_item))
                await self.redis_client.ltrim(key, 0, 4)  # 只保留最新5条
                await self.redis_client.expire(key, 86400)  # 24小时过期
            except Exception as e:
                logger.error(f"Redis写入失败: {e}")
                
    async def recall(self, user_id: int, chat_id: int) -> List[Dict]:
        """回忆用户历史"""
        key = f"group_memory:{chat_id}:{user_id}"
        
        # 优先从Redis读取
        if self.redis_client:
            try:
                items = await self.redis_client.lrange(key, 0, 4)
                if items:
                    return [json.loads(item) for item in items]
            except Exception as e:
                logger.error(f"Redis读取失败: {e}")
        
        # 降级到本地内存
        return list(self.local_memory[key])

# ========================
# 关键词检测器
# ========================

class KeywordDetector:
    """多语言关键词检测"""
    
    KEYWORDS = {
        'xiaoai': [
            # 简体
            '小爱', '小爱同学', '群主', '管理', '我操', '都来', '接茬',
            # 繁体
            '小愛', '小愛同學', '群主', '管理', '我操', '都來', '接茬',
            # 英文
            'xiaoai', 'admin', 'manager', 'help', 'hey'
        ]
    }
    
    @classmethod
    def should_respond(cls, message: str, bot_type: str = 'xiaoai') -> bool:
        """检测是否应该回复"""
        message_lower = message.lower()
        keywords = cls.KEYWORDS.get(bot_type, [])
        
        return any(keyword.lower() in message_lower for keyword in keywords)

# ========================
# 多Bot管理器
# ========================

class MultiBotManager:
    """多Bot管理器"""
    
    def __init__(self):
        self.memory = GroupMemorySystem()
        self.bots = {}
        
    async def initialize(self, redis_url: str):
        """初始化"""
        await self.memory.connect_redis(redis_url)
        
    def register_bot(self, bot_name: str, app: Application):
        """注册Bot"""
        self.bots[bot_name] = app
        logger.info(f"✅ 注册Bot: {bot_name}")
        
    async def handle_group_message(
        self, 
        update: Update, 
        context: ContextTypes.DEFAULT_TYPE,
        bot_type: str
    ):
        """处理群聊消息"""
        if not update.message or not update.message.text:
            return
            
        chat_type = update.message.chat.type
        if chat_type not in ['group', 'supergroup']:
            return
            
        user_id = update.effective_user.id
        chat_id = update.message.chat.id
        message = update.message.text
        
        # 记录消息
        await self.memory.remember(user_id, message, chat_id)
        
        # 根据Bot类型决定是否回复
        should_reply = False
        
        if bot_type == 'xiaoai':
            # 小爱同学：关键词触发
            should_reply = KeywordDetector.should_respond(message, 'xiaoai')
        elif bot_type == 'notion':
            # Notion助手：10%随机
            should_reply = random.random() < BotPersonality.NOTION['response_rate']
        elif bot_type == 'qianqian':
            # 倩倩姐：15%随机
            should_reply = random.random() < BotPersonality.QIANQIAN['response_rate']
            
        if should_reply:
            await self.generate_and_send_response(
                update, context, bot_type, user_id, chat_id
            )
            
    async def generate_and_send_response(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE,
        bot_type: str,
        user_id: int,
        chat_id: int
    ):
        """生成并发送回复"""
        # 获取用户历史
        history = await self.memory.recall(user_id, chat_id)
        
        # 根据Bot类型选择人格
        personality = getattr(BotPersonality, bot_type.upper(), BotPersonality.XIAOAI)
        
        # 生成回复
        template = random.choice(personality['templates'])
        emoji = random.choice(personality['emojis'])
        
        response = template.format(
            emoji=emoji,
            content=f"我记得你之前说过{len(history)}次话"
        )
        
        # 发送回复
        await update.message.reply_text(response)
        logger.info(f"📤 {personality['name']} 回复: {response}")

# ========================
# 主Bot类
# ========================

class MultiBot:
    """多Bot系统主类"""
    
    def __init__(self, token: str, bot_type: str):
        self.token = token
        self.bot_type = bot_type
        self.manager = None
        self.app = None
        
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """开始命令"""
        personality = getattr(BotPersonality, self.bot_type.upper(), BotPersonality.XIAOAI)
        
        welcome = f"""
👋 你好！我是 {personality['name']}

角色: {personality['role']}
功能: 群聊互动 + 记忆系统

在群里@我或说关键词，我会回复你！
        """
        
        await update.message.reply_text(welcome)
        
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息"""
        if self.manager:
            await self.manager.handle_group_message(update, context, self.bot_type)
            
    def build_app(self, manager: MultiBotManager) -> Application:
        """构建应用"""
        self.manager = manager
        self.app = Application.builder().token(self.token).build()
        
        # 注册处理器
        self.app.add_handler(CommandHandler("start", self.start_command))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        
        return self.app

# ========================
# 主程序
# ========================

async def main():
    """主程序"""
    logger.info("🚀 启动多Bot群聊系统")
    
    # 环境变量
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
    
    # Bot Tokens
    XIAOAI_TOKEN = os.getenv('TELEGRAM_BOT_XIAOAI_TOKEN', '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg')
    NOTION_TOKEN = os.getenv('TELEGRAM_BOT_NOTION_TOKEN', '7849921796:AAHb7fhDG_ooYzgP6sYjv7ALy6jqZaBf66E')
    QIANQIAN_TOKEN = os.getenv('TELEGRAM_BOT_QIANQIAN_TOKEN', '8364183144:AAEIKOLENbquiX_KT_UlpGPU06tlbvn0z2w')
    
    # 创建管理器
    manager = MultiBotManager()
    await manager.initialize(REDIS_URL)
    
    # 创建Bot实例
    xiaoai_bot = MultiBot(XIAOAI_TOKEN, 'xiaoai')
    notion_bot = MultiBot(NOTION_TOKEN, 'notion')
    qianqian_bot = MultiBot(QIANQIAN_TOKEN, 'qianqian')
    
    # 构建应用
    xiaoai_app = xiaoai_bot.build_app(manager)
    notion_app = notion_bot.build_app(manager)
    qianqian_app = qianqian_bot.build_app(manager)
    
    # 注册到管理器
    manager.register_bot('xiaoai', xiaoai_app)
    manager.register_bot('notion', notion_app)
    manager.register_bot('qianqian', qianqian_app)
    
    logger.info("""
    ✅ 多Bot系统启动成功
    ========================
    • 小爱同学 (主Bot)
    • Notion助手
    • 倩倩姐
    ========================
    """)
    
    # 启动所有Bot
    async with xiaoai_app:
        async with notion_app:
            async with qianqian_app:
                await xiaoai_app.start()
                await notion_app.start()
                await qianqian_app.start()
                
                await xiaoai_app.updater.start_polling()
                await notion_app.updater.start_polling()
                await qianqian_app.updater.start_polling()
                
                # 保持运行
                await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
