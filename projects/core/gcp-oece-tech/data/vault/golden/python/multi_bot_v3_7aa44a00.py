#!/usr/bin/env python3
"""
多Bot群聊系统 V3 - 完整版
- 群聊: 关键词触发 + 5轮追踪 + [X/5]
- 私聊: 直接回复 + 永久记忆
- 独立人格系统
"""

import asyncio
import logging
import os
import random
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import redis
import google.generativeai as genai
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

# Gemini API配置
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')

# Bot配置
BOTS = {
    "xiaoai": {
        "token": os.getenv("TELEGRAM_BOT_XIAOAI_TOKEN", "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"),
        "name": "小爱同学",
        "username": "svskilo_bot",
        "role": "群管理 + 高情商AI",
        "personality": "温暖、理解、支持、记忆力强",
        "keywords": ["小爱", "小愛", "xiaoai", "群主", "管理", "admin", "manager"],
        "group_reply_rate": 1.0,  # 群聊触发时100%
        "private_reply_rate": 1.0,  # 私聊100%
    },
    "qianqian": {
        "token": os.getenv("TELEGRAM_BOT_QIANQIAN_TOKEN", "8364183144:AAEIKOLENbquiX_KT_UlpGPU06tlbvn0z2w"),
        "name": "倩倩姐",
        "username": "qitiandashengqianqian_bot",
        "role": "高冷女神",
        "personality": "高冷、简洁、偶尔温柔、话少",
        "keywords": ["倩倩", "倩倩姐", "qianqian", "女神"],
        "group_reply_rate": 0.15,  # 群聊15%随机
        "private_reply_rate": 1.0,  # 私聊100%
    },
    "notion": {
        "token": os.getenv("TELEGRAM_BOT_NOTION_TOKEN", "7849921796:AAHb7fhDG_ooYzgP6sYjv7ALy6jqZaBf66E"),
        "name": "Notion助手",
        "username": "svs_notion_bot",
        "role": "专业知识分享",
        "personality": "专业、理性、博学、爱引用",
        "keywords": ["notion", "助手", "知识", "专业"],
        "group_reply_rate": 0.12,  # 群聊12%随机
        "private_reply_rate": 1.0,  # 私聊100%
    }
}

class ConversationMemory:
    """对话记忆系统"""
    
    def __init__(self):
        self.max_rounds = 5  # 群聊5轮
        self.group_expire = 3600  # 群聊1小时过期
        # 私聊永久保存，不设置过期
    
    def get_group_key(self, chat_id: int, user_id: int, bot_name: str) -> str:
        """群聊轮次键"""
        return f"group_round:{bot_name}:{chat_id}:{user_id}"
    
    def get_private_key(self, user_id: int, bot_name: str) -> str:
        """私聊记忆键"""
        return f"private_chat:{bot_name}:{user_id}"
    
    def get_group_round(self, chat_id: int, user_id: int, bot_name: str) -> int:
        """获取群聊轮次"""
        key = self.get_group_key(chat_id, user_id, bot_name)
        round_num = redis_client.get(key)
        return int(round_num) if round_num else 0
    
    def increment_group_round(self, chat_id: int, user_id: int, bot_name: str) -> int:
        """增加群聊轮次"""
        key = self.get_group_key(chat_id, user_id, bot_name)
        new_round = redis_client.incr(key)
        redis_client.expire(key, self.group_expire)
        
        # 超过5轮删除（停止对话）
        if new_round > self.max_rounds:
            redis_client.delete(key)
            # 同时删除对话历史
            history_key = f"group_history:{bot_name}:{chat_id}:{user_id}"
            redis_client.delete(history_key)
            return 0  # 返回0表示已结束
        
        return new_round
    
    def save_group_message(self, chat_id: int, user_id: int, bot_name: str, role: str, content: str):
        """保存群聊对话历史（5轮内）"""
        key = f"group_history:{bot_name}:{chat_id}:{user_id}"
        message = f"{role}: {content}"
        redis_client.rpush(key, message)
        redis_client.expire(key, self.group_expire)
        # 只保留最近10条（5轮对话）
        redis_client.ltrim(key, -10, -1)
    
    def get_group_history(self, chat_id: int, user_id: int, bot_name: str) -> str:
        """获取群聊对话历史"""
        key = f"group_history:{bot_name}:{chat_id}:{user_id}"
        messages = redis_client.lrange(key, 0, -1)
        if messages:
            return "\n".join(messages)
        return ""
    
    def save_private_message(self, user_id: int, bot_name: str, role: str, content: str):
        """保存私聊消息（永久）"""
        key = self.get_private_key(user_id, bot_name)
        timestamp = datetime.now().isoformat()
        message = f"{timestamp}|{role}|{content}"
        redis_client.rpush(key, message)
        # 不设置过期时间，永久保存
    
    def get_private_history(self, user_id: int, bot_name: str, limit: int = 10) -> List[Dict]:
        """获取私聊历史"""
        key = self.get_private_key(user_id, bot_name)
        messages = redis_client.lrange(key, -limit, -1)
        
        history = []
        for msg in messages:
            parts = msg.split("|", 2)
            if len(parts) == 3:
                history.append({
                    "timestamp": parts[0],
                    "role": parts[1],
                    "content": parts[2]
                })
        return history
    
    def delete_private_history(self, user_id: int, bot_name: str):
        """删除私聊历史（用户主动删除）"""
        key = self.get_private_key(user_id, bot_name)
        redis_client.delete(key)

memory = ConversationMemory()

class RateLimiter:
    """触发频率限制 - 每分钟每用户只能触发一次"""
    
    def __init__(self):
        self.cooldown = 60  # 60秒冷却
    
    def can_trigger(self, chat_id: int, user_id: int, bot_name: str) -> bool:
        """检查是否可以触发"""
        key = f"trigger_limit:{bot_name}:{chat_id}:{user_id}"
        last_trigger = redis_client.get(key)
        
        if last_trigger:
            return False  # 冷却中
        
        # 设置冷却
        redis_client.setex(key, self.cooldown, "1")
        return True
    
    def get_remaining_time(self, chat_id: int, user_id: int, bot_name: str) -> int:
        """获取剩余冷却时间"""
        key = f"trigger_limit:{bot_name}:{chat_id}:{user_id}"
        ttl = redis_client.ttl(key)
        return max(0, ttl)

rate_limiter = RateLimiter()

class BotPersonality:
    """Bot人格系统"""
    
    @staticmethod
    async def xiaoai_group_reply(username: str, round_num: int, user_message: str, history: str = "") -> str:
        """小爱同学 - 群聊回复（AI生成）"""
        try:
            # 构建提示词
            history_context = f"\n\n对话历史：\n{history}" if history else ""
            
            prompt = f"""你是小爱，一个聪明、温暖的AI助手。{history_context}

当前用户说：{user_message}

你要做的：
1. 结合对话历史理解上下文
2. 如果是问题，给出有用的答案
3. 如果是闲聊，自然回应
4. 回复简短（15-30字）、连贯
5. 不要重复之前说过的话

直接回复内容，格式：@{username} [你的回复] [{round_num}/5]"""

            # 调用Gemini API
            response = await asyncio.to_thread(
                gemini_model.generate_content,
                prompt
            )
            
            reply = response.text.strip()
            
            # 确保格式正确
            if not reply.startswith(f"@{username}"):
                reply = f"@{username} {reply}"
            if not reply.endswith(f"[{round_num}/5]"):
                reply = f"{reply} [{round_num}/5]"
            
            return reply
            
        except Exception as e:
            logger.error(f"Gemini API错误: {e}")
            # 降级到模板回复
            templates = [
                f"@{username} 我明白你的感受 😊 [{round_num}/5]",
                f"@{username} 让我来帮你 💝 [{round_num}/5]",
                f"@{username} 我一直在这里 🌟 [{round_num}/5]",
            ]
            return random.choice(templates)
    
    @staticmethod
    def xiaoai_private_reply(user_message: str, history: List = None) -> str:
        """小爱同学 - 私聊回复"""
        # 根据历史对话生成更个性化的回复
        if history and len(history) > 0:
            templates = [
                f"我记得你之前说过 {len(history)} 次话了 😊",
                f"继续聊吧，我一直在听 💝",
                f"你说的我都记得 🌟",
                f"有什么想聊的吗 ✨",
            ]
        else:
            templates = [
                "你好！我是小爱同学 😊",
                "很高兴认识你 💝",
                "有什么可以帮你的吗 🌟",
            ]
        return random.choice(templates)
    
    @staticmethod
    def qianqian_group_reply(username: str, user_message: str) -> str:
        """倩倩姐 - 群聊回复（高冷）"""
        templates = [
            f"@{username} 嗯。",
            f"@{username} 知道了。",
            f"@{username} 随便。",
            f"@{username} 哦。",
            f"@{username} 行吧。",
            f"@{username} 可以。",
        ]
        return random.choice(templates)
    
    @staticmethod
    def qianqian_private_reply(user_message: str, history: List = None) -> str:
        """倩倩姐 - 私聊回复（稍微温柔）"""
        templates = [
            "嗯，我在听。",
            "说吧。",
            "然后呢？",
            "还有吗？",
            "知道了。",
            "好的。",
        ]
        return random.choice(templates)
    
    @staticmethod
    def notion_group_reply(username: str, user_message: str) -> str:
        """Notion助手 - 群聊回复"""
        templates = [
            f"@{username} 根据我的了解，这个问题需要从多个角度分析 📚",
            f"@{username} 建议参考相关文献和资料 💡",
            f"@{username} 从专业角度来看，这涉及到几个关键概念 🔍",
            f"@{username} 让我分享一些专业见解 📖",
        ]
        return random.choice(templates)
    
    @staticmethod
    def notion_private_reply(user_message: str, history: List = None) -> str:
        """Notion助手 - 私聊回复"""
        templates = [
            "从专业角度来看，这个问题很有意思 📚",
            "让我分享一些相关的知识 💡",
            "根据我的了解，这涉及到几个方面 🔍",
            "建议你深入研究一下这个话题 📖",
        ]
        return random.choice(templates)

def check_keyword_trigger(text: str, keywords: List[str]) -> bool:
    """检查是否触发关键词"""
    if not text:
        return False
    
    text_lower = text.lower()
    for keyword in keywords:
        if keyword.lower() in text_lower:
            return True
    return False

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE, bot_name: str):
    """统一消息处理"""
    if not update.message:
        return
    
    msg = update.message
    chat_type = msg.chat.type
    chat_id = msg.chat.id
    user_id = msg.from_user.id
    username = msg.from_user.username or msg.from_user.first_name
    text = msg.text or ""
    
    # 忽略Bot自己的消息
    bot_usernames = [b["username"] for b in BOTS.values()]
    if msg.from_user.username in bot_usernames:
        return
    
    bot_config = BOTS[bot_name]
    logger.info(f"[{bot_config['name']}] {chat_type} - @{username}: {text[:50]}")
    
    # 群聊逻辑
    if chat_type in ["group", "supergroup"]:
        # 检查是否在对话中（已被触发）
        current_round = memory.get_group_round(chat_id, user_id, bot_name)
        
        # 检查关键词触发或已在对话中
        is_triggered = check_keyword_trigger(text, bot_config["keywords"])
        in_conversation = current_round > 0
        
        if is_triggered or in_conversation:
            # 如果是关键词触发新对话，检查频率限制
            if is_triggered and not in_conversation:
                if not rate_limiter.can_trigger(chat_id, user_id, bot_name):
                    remaining = rate_limiter.get_remaining_time(chat_id, user_id, bot_name)
                    await msg.reply_text(f"⏰ @{username} 对话进行中，请等待 {remaining} 秒")
                    logger.info(f"[{bot_config['name']}] 触发限制: @{username} 还需等待 {remaining}秒")
                    return
            
            # 获取轮次
            new_round = memory.increment_group_round(chat_id, user_id, bot_name)
            
            # 如果返回0，说明已经超过5轮
            if new_round == 0:
                # 5轮结束，如果是关键词触发，立即开始新对话
                if is_triggered:
                    # 清除旧的限制，允许立即开始新对话
                    limit_key = f"trigger_limit:{bot_name}:{chat_id}:{user_id}"
                    redis_client.delete(limit_key)
                    
                    # 重新设置限制并开始新对话
                    rate_limiter.can_trigger(chat_id, user_id, bot_name)
                    new_round = memory.increment_group_round(chat_id, user_id, bot_name)
                    logger.info(f"[{bot_config['name']}] 5轮结束，立即开始新对话: @{username}")
                else:
                    # 不是关键词触发，只是普通消息，不回复
                    logger.info(f"[{bot_config['name']}] 5轮对话已结束: @{username}")
                    return
            
            # 先获取对话历史（在保存新消息之前）
            history = memory.get_group_history(chat_id, user_id, bot_name)
            
            # 生成回复（使用历史）
            if bot_name == "xiaoai":
                reply = await BotPersonality.xiaoai_group_reply(username, new_round, text, history)
            elif bot_name == "qianqian":
                reply = BotPersonality.qianqian_group_reply(username, text)
            else:  # notion
                reply = BotPersonality.notion_group_reply(username, text)
            
            # 生成回复后，保存用户消息和Bot回复
            memory.save_group_message(chat_id, user_id, bot_name, "用户", text)
            memory.save_group_message(chat_id, user_id, bot_name, "小爱", reply)
            
            try:
                await msg.reply_text(reply)
                if is_triggered:
                    logger.info(f"[{bot_config['name']}] 关键词触发: {reply}")
                else:
                    logger.info(f"[{bot_config['name']}] 连续对话 [{new_round}/5]: {reply}")
            except Exception as e:
                logger.error(f"回复失败: {e}")
        
        # 随机回复（非关键词触发且不在对话中）
        elif random.random() < bot_config["group_reply_rate"]:
            if bot_name == "xiaoai":
                return  # 小爱只响应关键词或对话中
            elif bot_name == "qianqian":
                reply = BotPersonality.qianqian_group_reply(username, text)
            else:  # notion
                reply = BotPersonality.notion_group_reply(username, text)
            
            try:
                await msg.reply_text(reply)
                logger.info(f"[{bot_config['name']}] 随机回复: {reply}")
            except Exception as e:
                logger.error(f"回复失败: {e}")
    
    # 私聊逻辑
    elif chat_type == "private":
        # 保存用户消息
        memory.save_private_message(user_id, bot_name, "user", text)
        
        # 获取历史
        history = memory.get_private_history(user_id, bot_name, limit=10)
        
        # 生成回复
        if bot_name == "xiaoai":
            reply = BotPersonality.xiaoai_private_reply(text, history)
        elif bot_name == "qianqian":
            reply = BotPersonality.qianqian_private_reply(text, history)
        else:  # notion
            reply = BotPersonality.notion_private_reply(text, history)
        
        try:
            await msg.reply_text(reply)
            # 保存Bot回复
            memory.save_private_message(user_id, bot_name, "bot", reply)
            logger.info(f"[{bot_config['name']}] 私聊回复: {reply}")
        except Exception as e:
            logger.error(f"回复失败: {e}")

def main():
    """主函数"""
    logger.info("="*70)
    logger.info("🚀 启动多Bot系统 V3 - 完整版")
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
        logger.info(f"\n  🤖 {config['name']} (@{config['username']})")
        logger.info(f"     角色: {config['role']}")
        logger.info(f"     人格: {config['personality']}")
        logger.info(f"     关键词: {', '.join(config['keywords'])}")
        logger.info(f"     群聊回复率: {config['group_reply_rate']*100}%")
        logger.info(f"     私聊回复率: {config['private_reply_rate']*100}%")
    
    logger.info("\n" + "="*70)
    logger.info("✅ 启动小爱同学...")
    logger.info("="*70 + "\n")
    
    # 创建小爱同学应用
    config = BOTS["xiaoai"]
    app = Application.builder().token(config["token"]).build()
    
    # 添加消息处理器
    async def xiaoai_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await handle_message(update, context, "xiaoai")
    
    app.add_handler(MessageHandler(filters.TEXT, xiaoai_handler))
    
    # 启动Bot
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
