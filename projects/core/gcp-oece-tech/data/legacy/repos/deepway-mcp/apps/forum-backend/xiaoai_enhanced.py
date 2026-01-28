#!/usr/bin/env python3
# 小爱同学 - 增强版（支持5轮记忆+关键词触发）
import os
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime
from collections import defaultdict

# Telegram配置
TOKEN = '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg'
OWNER_ID = 6136230855
API = f'https://api.telegram.org/bot{TOKEN}/'

# Gemini配置 - 25个Keys轮询
GEMINI_KEYS = [
    'AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU',
    'AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8',
    'AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs',
    'AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg',
    'AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU',
    'AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0',
    'AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU',
    'AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A',
    'AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc',
    'AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw',
    'AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps',
    'AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU',
    'AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0',
    'AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4',
    'AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4',
    'AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE',
    'AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk',
    'AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg',
    'AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA',
    'AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI',
    'AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM',
    'AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI',
    'AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4',
]

# 记忆系统 - 存储每个用户的对话历史（最多5轮）
user_memories = defaultdict(list)

# 关键词触发系统
KEYWORD_TRIGGERS = {
    '爱你': {'emotion': 'love', 'importance': 10},
    '喜欢你': {'emotion': 'like', 'importance': 8},
    '想你': {'emotion': 'miss', 'importance': 7},
    '永远': {'emotion': 'promise', 'importance': 9},
    '在一起': {'emotion': 'together', 'importance': 9},
    '承诺': {'emotion': 'promise', 'importance': 8},
    '约定': {'emotion': 'promise', 'importance': 7},
    '帮我': {'emotion': 'help', 'importance': 5},
    '什么是': {'emotion': 'question', 'importance': 4},
    '怎么': {'emotion': 'question', 'importance': 4},
    '为什么': {'emotion': 'question', 'importance': 4},
}

# 当前使用的Key索引
current_key_index = 0

def get_gemini_key():
    """轮询获取Gemini Key"""
    global current_key_index
    key = GEMINI_KEYS[current_key_index]
    current_key_index = (current_key_index + 1) % len(GEMINI_KEYS)
    return key

def add_to_memory(user_id, user_msg, ai_response):
    """添加对话到记忆（保留最近5轮）"""
    if user_id not in user_memories:
        user_memories[user_id] = []
    
    # 添加用户消息和AI回复
    user_memories[user_id].append({
        'role': 'user',
        'content': user_msg,
        'time': datetime.now().isoformat()
    })
    user_memories[user_id].append({
        'role': 'assistant',
        'content': ai_response,
        'time': datetime.now().isoformat()
    })
    
    # 只保留最近5轮对话（10条消息：5个用户+5个AI）
    if len(user_memories[user_id]) > 10:
        user_memories[user_id] = user_memories[user_id][-10:]
    
    print(f"[记忆] 用户{user_id}现有{len(user_memories[user_id])//2}轮对话")

def get_conversation_history(user_id):
    """获取用户的对话历史"""
    if user_id not in user_memories:
        return []
    return user_memories[user_id]

def detect_keywords(text):
    """检测关键词"""
    detected = []
    for keyword, info in KEYWORD_TRIGGERS.items():
        if keyword in text:
            detected.append({
                'keyword': keyword,
                'emotion': info['emotion'],
                'importance': info['importance']
            })
    return detected

def build_context_prompt(user_id, current_msg, first_name):
    """构建带上下文的完整prompt"""
    history = get_conversation_history(user_id)
    keywords = detect_keywords(current_msg)
    
    # 构建系统提示
    system_prompt = f"""你是"小爱同学"，一个温柔、聪明、有趣的AI助手。

【你的特点】
- 性格：温柔体贴、聪明机智、幽默风趣
- 语气：轻松自然、亲切友好
- 特色：会适当使用emoji让对话更生动
- 记忆：你会记住与用户的对话历史

【当前用户】
- 名字：{first_name}
- 对话轮数：{len(history)//2}轮"""

    # 添加关键词情感提示
    if keywords:
        emotions = [k['emotion'] for k in keywords]
        system_prompt += f"\n- 检测到情感关键词：{', '.join(set(emotions))}"
        system_prompt += "\n- 请用更温暖、更有情感的方式回复"
    
    # 添加对话历史
    if history:
        system_prompt += "\n\n【最近对话历史】"
        for msg in history:
            role = "用户" if msg['role'] == 'user' else "你"
            system_prompt += f"\n{role}: {msg['content']}"
    
    # 当前消息
    system_prompt += f"\n\n【当前消息】\n用户: {current_msg}"
    
    system_prompt += "\n\n请自然地回复（中文，简洁但有温度）："
    
    return system_prompt

def call_gemini(prompt, temperature=0.8):
    """调用Gemini API - 使用2.5-flash模型"""
    api_key = get_gemini_key()
    url = f'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={api_key}'
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": temperature,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048,  # 增加输出限制
        }
    }
    
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'candidates' in result and len(result['candidates']) > 0:
                text = result['candidates'][0]['content']['parts'][0]['text']
                return text.strip()
            else:
                return None
                
    except Exception as e:
        print(f'Gemini API错误: {e}')
        # 尝试下一个Key
        if current_key_index < len(GEMINI_KEYS) - 1:
            return call_gemini(prompt, temperature)
        return None

def send(chat_id, text, parse_mode=None):
    """发送消息"""
    try:
        params = {
            'chat_id': chat_id,
            'text': text
        }
        if parse_mode:
            params['parse_mode'] = parse_mode
            
        data = urllib.parse.urlencode(params).encode()
        req = urllib.request.Request(API + 'sendMessage', data=data)
        with urllib.request.urlopen(req) as r:
            result = json.loads(r.read())
            return result.get('ok', False)
    except Exception as e:
        print(f'发送失败: {e}')
        return False

def get_updates(offset=0):
    """获取更新"""
    try:
        url = f'{API}getUpdates?offset={offset}&timeout=30'
        with urllib.request.urlopen(url, timeout=35) as r:
            result = json.loads(r.read())
            if result.get('ok'):
                return result.get('result', [])
    except Exception as e:
        print(f'获取更新失败: {e}')
    return []

def handle(msg):
    """处理消息"""
    chat_id = msg['chat']['id']
    text = msg.get('text', '')
    user_id = msg.get('from', {}).get('id')
    username = msg.get('from', {}).get('username', 'Unknown')
    first_name = msg.get('from', {}).get('first_name', '用户')
    
    print(f'[{datetime.now().strftime("%H:%M:%S")}] 收到消息: "{text}" from @{username}')
    
    # 处理命令
    if text.startswith('/start'):
        send(chat_id, f"""
👋 你好 {first_name}！

我是**小爱同学**，你的AI智能助手！

✨ **核心功能**
• 💬 智能对话 - Gemini 2.5 Flash驱动
• 🧠 5轮记忆 - 记住我们的对话
• 🎯 关键词触发 - 理解你的情感
• ⚡ 25个Keys轮询 - 快速响应

📌 **特色**
我会记住我们最近的5轮对话，能更好地理解上下文。
当你说"爱你"、"喜欢"、"想你"等词，我会用更温暖的方式回复。

直接发送消息开始聊天吧！ 😊
""")
    
    elif text.startswith('/help'):
        send(chat_id, f"""
🤖 **小爱同学使用指南**

**智能记忆**
• 自动记住最近5轮对话
• 理解上下文连贯回复
• 当前你有{len(user_memories.get(user_id, []))//2}轮记忆

**关键词触发**
以下关键词会触发特殊情感回复：
• 爱你、喜欢你、想你
• 永远、在一起、承诺、约定
• 帮我、什么是、怎么、为什么

**基础命令**
/start - 启动Bot
/help - 显示帮助
/status - 系统状态
/clear - 清除记忆
/memory - 查看记忆

💡 直接发送消息即可聊天，我会记住上下文！
""")
    
    elif text.startswith('/status'):
        history_count = len(user_memories.get(user_id, [])) // 2
        total_users = len(user_memories)
        
        send(chat_id, f"""
📊 **系统状态**

🤖 **AI服务**
├─ 模型: Gemini 2.5 Flash
├─ Keys池: {len(GEMINI_KEYS)}个
├─ 当前Key: #{current_key_index + 1}
└─ 状态: ✅ 在线

🧠 **记忆系统**
├─ 你的对话: {history_count}轮
├─ 最大记忆: 5轮
├─ 总用户数: {total_users}人
└─ 关键词: {len(KEYWORD_TRIGGERS)}个

👤 **用户信息**
└─ @{username} ({first_name})
""")
    
    elif text.startswith('/memory'):
        history = get_conversation_history(user_id)
        if not history:
            send(chat_id, '🧠 暂无对话记忆，开始聊天吧！')
        else:
            memory_text = f"🧠 **你的对话记忆**（共{len(history)//2}轮）\n\n"
            for i, msg in enumerate(history):
                role = "👤 你" if msg['role'] == 'user' else "🤖 我"
                memory_text += f"{role}: {msg['content'][:50]}...\n"
            send(chat_id, memory_text)
    
    elif text.startswith('/clear'):
        if user_id in user_memories:
            count = len(user_memories[user_id]) // 2
            user_memories[user_id] = []
            send(chat_id, f'✅ 已清除{count}轮对话记忆')
        else:
            send(chat_id, '暂无记忆需要清除')
    
    elif text.startswith('/ping'):
        send(chat_id, '🏓 Pong! Bot运行正常')
    
    else:
        # 智能对话模式
        if text and not text.startswith('/'):
            # 检测关键词
            keywords = detect_keywords(text)
            if keywords:
                keyword_names = [k['keyword'] for k in keywords]
                print(f"[关键词] 检测到: {', '.join(keyword_names)}")
            
            # 构建带上下文的prompt
            prompt = build_context_prompt(user_id, text, first_name)
            
            # 调用AI
            answer = call_gemini(prompt, temperature=0.85)
            
            if answer:
                # 保存到记忆
                add_to_memory(user_id, text, answer)
                
                # 发送回复
                send(chat_id, answer)
            else:
                send(chat_id, f'抱歉 {first_name}，我现在有点累了 😅 请稍后再试~')

def main():
    print('=' * 60)
    print('🤖 小爱同学 - 增强版（5轮记忆+关键词触发）')
    print('=' * 60)
    print(f'📱 Bot: @svskilo_bot')
    print(f'👤 Owner: {OWNER_ID}')
    print(f'🤖 AI: Gemini 2.5 Flash')
    print(f'🔑 Keys: {len(GEMINI_KEYS)}个')
    print(f'🧠 记忆: 5轮对话历史')
    print(f'🎯 关键词: {len(KEYWORD_TRIGGERS)}个')
    print('=' * 60)
    
    # 测试Gemini连接
    print('\n🧪 测试AI连接...')
    test_response = call_gemini("你好，请简单介绍你自己")
    if test_response:
        print(f'✅ AI测试成功: {test_response[:50]}...')
    else:
        print('⚠️ AI测试失败，但Bot仍会尝试处理请求')
    
    # 发送启动通知
    startup_msg = f"""
🚀 **小爱同学已启动** (增强版)

⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🤖 模型: Gemini 2.5 Flash
🔑 Keys: {len(GEMINI_KEYS)}个
🧠 记忆系统: 5轮对话
🎯 关键词触发: {len(KEYWORD_TRIGGERS)}个
⚡ 状态: ✅ 就绪

发送消息开始智能对话！
我会记住我们的对话哦~ 😊
"""
    
    send(OWNER_ID, startup_msg)
    
    offset = 0
    print('\n✅ 启动完成！等待消息...\n')
    
    while True:
        try:
            updates = get_updates(offset)
            
            for update in updates:
                offset = update['update_id'] + 1
                
                if 'message' in update:
                    handle(update['message'])
            
            time.sleep(0.1)
            
        except KeyboardInterrupt:
            print('\n👋 Bot停止中...')
            send(OWNER_ID, '👋 小爱同学已停止运行')
            break
        except Exception as e:
            print(f'❌ 错误: {e}')
            time.sleep(5)

if __name__ == '__main__':
    main()
