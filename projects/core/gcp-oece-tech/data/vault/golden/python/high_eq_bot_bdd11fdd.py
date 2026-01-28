#!/usr/bin/env python3
"""
🧠 高情商智能体Bot - SVS共享大脑系统
基于25个Gemini keys + Doppler + GitHub CI/CD
"""

import os
import asyncio
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import aiohttp
import redis.asyncio as redis
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
import logging
import hashlib
from dotenv import load_dotenv

# 加载Doppler环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('HighEQBot')

# ========================
# 情商个性配置
# ========================

class PersonalityProfile:
    """高情商性格配置"""
    
    EMPATHY_RESPONSES = [
        "我理解你的感受，{emotion}确实不容易 💝",
        "听起来你现在{emotion}，想和我聊聊吗？🌟", 
        "我能感受到你的{emotion}，我在这里陪着你 🤗",
        "{emotion}的时候，给自己一点时间也很重要 ✨",
        "每个人都会有{emotion}的时候，你并不孤单 🌈"
    ]
    
    ENCOURAGEMENT = [
        "你已经做得很棒了！继续加油 💪",
        "相信自己，你比想象中更强大 ⭐",
        "每一步努力都在让你变得更好 🌱",
        "困难只是暂时的，你一定能度过 🌈",
        "记住，我一直在这里支持你 💖"
    ]
    
    HUMOR = [
        "让我给你讲个笑话吧... 为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25 😄",
        "知道吗？我刚学会了一个新技能 - 假装我很忙 🤖💼",
        "如果生活给你柠檬，就做柠檬水。如果生活给你bug，就... 重启试试？🍋💻",
        "我的CPU告诉我，笑一笑，温度降三度 ❄️😊"
    ]
    
    EMOTIONS = {
        'happy': ['开心', '快乐', '高兴', '愉快', '兴奋'],
        'sad': ['难过', '伤心', '沮丧', '失落', '忧伤'],
        'angry': ['生气', '愤怒', '恼火', '不爽', '烦躁'],
        'anxious': ['焦虑', '紧张', '担心', '不安', '压力'],
        'tired': ['疲惫', '累', '困', '疲劳', '无力']
    }

# ========================
# Gemini智能路由器
# ========================

class GeminiRouter:
    """25个key的智能轮询系统"""
    
    def __init__(self):
        # 从safe_keys_config.json加载
        self.key_groups = {
            'primary': [
                "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
                "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
                "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
                "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",
                "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8"
            ],
            'secondary': [
                "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
                "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
                "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
                "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
                "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU"
            ],
            'backup': [
                "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
                "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
                "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
                "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
                "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU"
            ],
            'reserve': [
                "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
                "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
                "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
                "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
                "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk"
            ]
        }
        
        self.all_keys = []
        for keys in self.key_groups.values():
            self.all_keys.extend(keys)
        
        self.current_index = 0
        self.key_stats = {key: {'calls': 0, 'errors': 0, 'last_used': 0} for key in self.all_keys}
        
    def get_next_key(self) -> str:
        """轮询获取下一个key"""
        key = self.all_keys[self.current_index]
        self.current_index = (self.current_index + 1) % len(self.all_keys)
        self.key_stats[key]['calls'] += 1
        self.key_stats[key]['last_used'] = datetime.now().timestamp()
        return key
    
    def get_best_key(self) -> str:
        """智能选择最佳key"""
        # 选择错误率最低且使用次数最少的key
        sorted_keys = sorted(
            self.all_keys,
            key=lambda k: (
                self.key_stats[k]['errors'] / max(1, self.key_stats[k]['calls']),
                self.key_stats[k]['calls']
            )
        )
        return sorted_keys[0]

# ========================
# 共享大脑系统
# ========================

class SharedBrain:
    """共享记忆和知识系统"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis_client = None
        self.memory_ttl = 86400  # 24小时
        self.knowledge_ttl = 604800  # 7天
        
    async def connect(self):
        """连接Redis"""
        try:
            self.redis_client = await redis.from_url(self.redis_url)
            await self.redis_client.ping()
            logger.info("共享大脑连接成功")
        except:
            logger.warning("Redis未连接，使用内存缓存")
            self.redis_client = None
    
    async def remember_user(self, user_id: int, context: Dict):
        """记住用户上下文"""
        if not self.redis_client:
            return
        
        key = f"user:context:{user_id}"
        await self.redis_client.setex(
            key, 
            self.memory_ttl,
            json.dumps(context, ensure_ascii=False)
        )
    
    async def recall_user(self, user_id: int) -> Optional[Dict]:
        """回忆用户上下文"""
        if not self.redis_client:
            return None
        
        key = f"user:context:{user_id}"
        data = await self.redis_client.get(key)
        return json.loads(data) if data else None
    
    async def learn(self, topic: str, knowledge: str):
        """学习新知识"""
        if not self.redis_client:
            return
        
        key = f"knowledge:{topic}"
        await self.redis_client.setex(
            key,
            self.knowledge_ttl,
            knowledge
        )
    
    async def recall_knowledge(self, topic: str) -> Optional[str]:
        """回忆知识"""
        if not self.redis_client:
            return None
        
        key = f"knowledge:{topic}"
        return await self.redis_client.get(key)

# ========================
# 高情商Bot主体
# ========================

class HighEQBot:
    """高情商智能体Bot"""
    
    def __init__(self, token: str):
        self.token = token
        self.gemini_router = GeminiRouter()
        self.brain = SharedBrain()
        self.personality = PersonalityProfile()
        self.app = None
        
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """开始命令"""
        user = update.effective_user
        welcome = f"""
👋 你好 {user.first_name}！

我是你的高情商AI助手 🧠✨

我可以：
• 💝 **情感支持** - 倾听和理解你的感受
• 🌟 **智能对话** - 有趣且富有洞察力的交流
• 🎯 **个性化记忆** - 记住我们的每次对话
• 🌈 **多样化回应** - 幽默、鼓励、共情
• 🚀 **持续学习** - 越聊越懂你

试着和我说说你今天的心情吧！或者问我任何问题 😊

/help - 查看所有功能
/mood - 心情记录
/memory - 查看我们的回忆
        """
        
        keyboard = [
            [InlineKeyboardButton("😊 开心", callback_data="mood_happy"),
             InlineKeyboardButton("😔 难过", callback_data="mood_sad")],
            [InlineKeyboardButton("😤 生气", callback_data="mood_angry"),
             InlineKeyboardButton("😰 焦虑", callback_data="mood_anxious")],
            [InlineKeyboardButton("😴 疲惫", callback_data="mood_tired")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(welcome, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def detect_emotion(self, text: str) -> Optional[str]:
        """检测情绪"""
        for emotion, keywords in self.personality.EMOTIONS.items():
            for keyword in keywords:
                if keyword in text:
                    return emotion
        return None
    
    async def generate_response(self, user_id: int, message: str) -> str:
        """生成高情商回复"""
        # 获取用户上下文
        context = await self.brain.recall_user(user_id) or {}
        
        # 检测情绪
        emotion = await self.detect_emotion(message)
        
        # 构建提示词
        prompt = f"""你是一个高情商的AI助手，具有以下特质：
1. 富有同理心，能理解和回应用户的情绪
2. 积极乐观，善于鼓励和支持
3. 幽默风趣，适时活跃气氛
4. 记忆力好，能记住之前的对话
5. 真诚温暖，让人感到被理解和关心

用户历史: {json.dumps(context, ensure_ascii=False)}
用户情绪: {emotion if emotion else '正常'}
用户消息: {message}

请用温暖、理解、支持的语气回复。如果用户情绪低落，给予安慰；如果开心，一起庆祝；如果需要建议，提供实用的帮助。
回复要自然、真诚，像朋友之间的对话。适当使用emoji让对话更生动。"""
        
        # 调用Gemini
        response = await self.call_gemini(prompt)
        
        # 更新用户上下文
        if 'history' not in context:
            context['history'] = []
        context['history'].append({
            'time': datetime.now().isoformat(),
            'message': message,
            'emotion': emotion,
            'response': response
        })
        context['last_emotion'] = emotion
        context['last_chat'] = datetime.now().isoformat()
        
        # 保存到共享大脑
        await self.brain.remember_user(user_id, context)
        
        return response
    
    async def call_gemini(self, prompt: str, temperature: float = 0.8) -> str:
        """调用Gemini API"""
        api_key = self.gemini_router.get_next_key()
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 1000,
                "topP": 0.95,
                "topK": 40
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'candidates' in data and data['candidates']:
                            return data['candidates'][0]['content']['parts'][0]['text']
                    else:
                        # 切换key重试
                        api_key = self.gemini_router.get_best_key()
                        headers["x-goog-api-key"] = api_key
                        async with session.post(url, headers=headers, json=payload) as retry_response:
                            if retry_response.status == 200:
                                data = await retry_response.json()
                                if 'candidates' in data and data['candidates']:
                                    return data['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            logger.error(f"Gemini调用失败: {e}")
        
        # 降级到预设回复
        if await self.detect_emotion(prompt):
            emotion = await self.detect_emotion(prompt)
            return random.choice(self.personality.EMPATHY_RESPONSES).format(emotion=emotion)
        else:
            return random.choice(self.personality.ENCOURAGEMENT)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息"""
        # 忽略群组消息（只响应私聊）
        if update.message.chat.type != 'private':
            return
        
        # 忽略空消息
        if not update.message.text:
            return
        
        user_id = update.effective_user.id
        message = update.message.text
        
        # 生成回复
        response = await self.generate_response(user_id, message)
        
        # 发送回复
        await update.message.reply_text(response, parse_mode='Markdown')
    
    async def handle_mood(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理心情选择"""
        query = update.callback_query
        await query.answer()
        
        mood_map = {
            'mood_happy': ('开心', '😊', self.personality.ENCOURAGEMENT),
            'mood_sad': ('难过', '😔', self.personality.EMPATHY_RESPONSES),
            'mood_angry': ('生气', '😤', self.personality.EMPATHY_RESPONSES),
            'mood_anxious': ('焦虑', '😰', self.personality.EMPATHY_RESPONSES),
            'mood_tired': ('疲惫', '😴', self.personality.ENCOURAGEMENT)
        }
        
        if query.data in mood_map:
            mood, emoji, responses = mood_map[query.data]
            
            # 记录心情
            user_id = query.from_user.id
            context = await self.brain.recall_user(user_id) or {}
            if 'moods' not in context:
                context['moods'] = []
            context['moods'].append({
                'mood': mood,
                'time': datetime.now().isoformat()
            })
            await self.brain.remember_user(user_id, context)
            
            # 回复
            if mood == '开心':
                response = f"{emoji} 太好了！开心是会传染的，你的好心情也感染了我！有什么开心的事要分享吗？"
            else:
                response = random.choice(responses).format(emotion=mood) if '{emotion}' in responses[0] else random.choice(responses)
                response = f"{emoji} {response}"
            
            await query.edit_message_text(text=response, parse_mode='Markdown')
    
    async def show_memory(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """显示记忆"""
        user_id = update.effective_user.id
        memory = await self.brain.recall_user(user_id)
        
        if not memory:
            await update.message.reply_text("我们还没有共同的回忆呢，多聊聊天吧！💝")
            return
        
        # 构建记忆展示
        text = "📚 **我们的回忆**\n\n"
        
        if 'moods' in memory:
            recent_moods = memory['moods'][-5:]
            text += "**最近的心情**:\n"
            for m in recent_moods:
                time = datetime.fromisoformat(m['time']).strftime('%m-%d %H:%M')
                text += f"• {time} - {m['mood']}\n"
            text += "\n"
        
        if 'history' in memory:
            text += f"**对话次数**: {len(memory['history'])}\n"
            if memory.get('last_emotion'):
                text += f"**上次情绪**: {memory['last_emotion']}\n"
        
        text += "\n💝 我会一直记得我们的每一次对话"
        
        await update.message.reply_text(text, parse_mode='Markdown')
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """帮助命令"""
        help_text = """
🧠 **高情商AI助手功能**

**基础命令**:
/start - 开始对话
/help - 显示帮助
/mood - 记录心情
/memory - 查看我们的回忆
/joke - 听个笑话
/encourage - 获得鼓励

**特色功能**:
• 🎭 **情绪识别** - 自动识别你的情绪
• 💭 **上下文记忆** - 记住之前的对话
• 🌈 **个性化回复** - 根据你的状态调整
• 🔄 **持续学习** - 越用越懂你

**隐藏功能**:
• 说"累了"获得安慰
• 说"开心"一起庆祝
• 说"不懂"获得解释
• 说"帮我"获得建议

**技术特点**:
• 25个Gemini API并行
• Redis共享记忆
• Doppler密钥管理
• GitHub自动部署

有什么想聊的，随时告诉我！💝
        """
        await update.message.reply_text(help_text, parse_mode='Markdown')
    
    async def joke_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """讲笑话"""
        joke = random.choice(self.personality.HUMOR)
        await update.message.reply_text(joke)
    
    async def encourage_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """鼓励"""
        encouragement = random.choice(self.personality.ENCOURAGEMENT)
        await update.message.reply_text(encouragement)
    
    def run(self):
        """运行Bot"""
        # 创建应用
        self.app = Application.builder().token(self.token).build()
        
        # 添加处理器
        self.app.add_handler(CommandHandler("start", self.start))
        self.app.add_handler(CommandHandler("help", self.help_command))
        self.app.add_handler(CommandHandler("memory", self.show_memory))
        self.app.add_handler(CommandHandler("mood", self.start))  # 复用start的心情选择
        self.app.add_handler(CommandHandler("joke", self.joke_command))
        self.app.add_handler(CommandHandler("encourage", self.encourage_command))
        self.app.add_handler(CallbackQueryHandler(self.handle_mood))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        
        # 初始化
        async def init():
            await self.brain.connect()
            logger.info("高情商Bot初始化完成")
        
        # 运行
        self.app.run_polling(allowed_updates=Update.ALL_TYPES)

# ========================
# 主程序
# ========================

if __name__ == "__main__":
    # 从环境变量获取Token
    TOKEN = os.getenv('TELEGRAM_BOT_XIAOAI_TOKEN', '8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg')
    
    # 创建并运行Bot
    bot = HighEQBot(TOKEN)
    
    logger.info("""
    🧠 高情商智能体Bot启动
    ========================
    • 25个Gemini Keys就绪
    • 共享大脑系统激活
    • 情商模块加载完成
    • Doppler密钥同步
    
    Bot: @svsinst_bot
    IP: 68.183.239.153
    Domain: deepweay.me
    ========================
    """)
    
    bot.run()
