#!/usr/bin/env python3
# 小爱同学 - 智能路由版本
# 集成: 5轮记忆 + 关键词触发 + 智能Key路由

import os
import json
import time
import random
import re
import urllib.request
import urllib.parse
from datetime import datetime
from collections import defaultdict
from gemini_key_router_v2 import GeminiKeyRouter, create_router_from_env
try:
    from supabase import create_client as _create_sb
except Exception:
    _create_sb = None

# Telegram配置
TOKEN = '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg'
OWNER_ID = 6136230855
API = f'https://api.telegram.org/bot{TOKEN}/'

# 初始化智能路由器
print("🔧 初始化智能Key路由器...")
key_router = create_router_from_env()

# 用户等级配置与模式
# 等级: member(1), pro(2), pro_annual(3), admin
USER_TIERS = {
    OWNER_ID: 'admin',  # 管理员
    # 其他用户: user_id: 'member' | 'pro' | 'pro_annual'
}

# DM 与群聊默认模型
DEFAULT_DM_MODEL = 'gemini-2.5-flash'
DEFAULT_GROUP_MODEL = 'gemini-2.5-flash-lite'

# 人格名
AGENT_NAME = 'svs-R01'

# 管理员“工作模式”
ADMIN_DM_MODE = {}          # user_id -> 'work' | 'crush'
ADMIN_THROTTLE_S = 1.5
ADMIN_LAST_DM = {}          # user_id -> timestamp

# Supabase 用户层级刷新（每12小时一次，可选）
SB_URL = os.getenv('SUPABASE_URL')
SB_KEY = os.getenv('SUPABASE_ANON_KEY') or os.getenv('SUPABASE_SERVICE_KEY')
_SB = _create_sb(SB_URL, SB_KEY) if (_create_sb and SB_URL and SB_KEY) else None
_LAST_USER_SYNC = 0

def refresh_user_tiers(force=False):
    global USER_TIERS, _LAST_USER_SYNC
    if not _SB:
        return False
    now = time.time()
    if not force and now - _LAST_USER_SYNC < 12 * 3600:
        return False
    try:
        data = _SB.table('users').select('uid,tier,is_admin').execute()
        rows = data.data or []
        for r in rows:
            uid = int(r.get('uid'))
            tier = (r.get('tier') or 'member').lower()
            if r.get('is_admin'):
                USER_TIERS[uid] = 'admin'
            else:
                USER_TIERS[uid] = tier if tier in ('member','pro','pro_annual','admin','root') else 'member'
        _LAST_USER_SYNC = now
        return True
    except Exception:
        return False

# 记忆系统
# 私聊: 持久化到文件; 群聊: 会话临时记忆(每用户5次)
user_memories = defaultdict(list)  # 兼容旧逻辑(将不再用于私聊持久化)
DM_MEMORY_DIR = os.path.join(os.path.dirname(__file__), 'private_memory')
os.makedirs(DM_MEMORY_DIR, exist_ok=True)

# 事件日志（JSONL，本地轻量归档，供Worker批处理到Postgres）
LOG_DIR = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, 'events.jsonl')

def append_event(event):
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(json.dumps(event, ensure_ascii=False) + '\n')
    except Exception:
        pass

# 群聊并发会话: 每群最多5个并发用户, 每用户5次回复
group_sessions = defaultdict(dict)  # {chat_id: {user_id: {messages:[], replies:int, started_at:str}}}
MAX_GROUP_TURNS = 5
MAX_GROUP_CONCURRENT = 5

# 关键词触发
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

def get_user_tier(user_id):
    """获取用户等级"""
    # 尝试周期性刷新用户层级
    refresh_user_tiers(False)
    return USER_TIERS.get(user_id, 'member')

def add_to_memory(user_id, user_msg, ai_response):
    """添加到记忆"""
    if user_id not in user_memories:
        user_memories[user_id] = []
    
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
    
    if len(user_memories[user_id]) > 10:
        user_memories[user_id] = user_memories[user_id][-10:]

def _dm_mem_path(user_id):
    return os.path.join(DM_MEMORY_DIR, f'{user_id}.json')

def load_private_memory(user_id):
    path = _dm_mem_path(user_id)
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_private_memory(user_id, messages):
    path = _dm_mem_path(user_id)
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False)
    except Exception:
        pass

def get_conversation_history(user_id):
    """兼容函数: 返回私聊历史(持久化)"""
    return load_private_memory(user_id)

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

def build_context_prompt(chat_type, chat_id, user_id, current_msg, first_name, style='B'):
    """构建上下文prompt - 私聊/群聊分别读取历史，切换回复姿态 A/B/C"""
    if chat_type in ('group', 'supergroup'):
        session = group_sessions.get(chat_id, {}).get(user_id, {'messages': []})
        history = session.get('messages', [])
    else:
        history = load_private_memory(user_id)
    keywords = detect_keywords(current_msg)
    
    system_prompt = f"""你叫{AGENT_NAME}，不要自称AI，保持自然人类风格。

【特点】
- 温柔体贴、机智幽默
- 适当使用emoji
- 记住对话历史

【回复姿态】
- A：详细解答（结构化、步骤清晰，适度举例）
- B：中等长度自然对话（口语化、直给）
- C：简短回应（几句以内；低信号内容在群聊可直接忽略）

【当前姿态】{style}

【用户】
- 名字：{first_name}
- 对话轮数：{len(history)//2}"""

    if keywords:
        emotions = [k['emotion'] for k in keywords]
        system_prompt += f"\n- 检测到情感：{', '.join(set(emotions))}"
        system_prompt += "\n- 请用更温暖的方式回复"
    
    if history:
        system_prompt += "\n\n【最近对话】"
        for msg in history:
            role = "用户" if msg['role'] == 'user' else "你"
            system_prompt += f"\n{role}: {msg['content']}"
    
    system_prompt += f"\n\n【当前消息】\n用户: {current_msg}\n\n请回复（中文，简洁有温度）："
    
    return system_prompt

_LOW_SIGNAL = re.compile(r'^(哈+|嗯+|哦+|呀+|啊+|嗨+|[hHah]+)+[!！。~\s]*$')

def decide_style(text, chat_type, tier):
    t = text.strip()
    if chat_type in ('group','supergroup') and _LOW_SIGNAL.match(t):
        return 'C'
    if '?' in t or any(k in t for k in ('怎么','为何','为什么','如何','教我','配置','安装','报错','错误','解决', 'ssh', '任务', '分析')):
        base = 'A'
    elif len(t) <= 8 and any(k in t for k in ('哈哈','嘻嘻','呵呵','嘿嘿','lol','hhh')):
        base = 'C'
    else:
        base = 'B'
    r = random.random()
    if base == 'A' and r < 0.15:
        return 'B'
    if base == 'B' and r < 0.15:
        return 'A'
    if base == 'B' and 0.15 <= r < 0.30:
        return 'C'
    if base == 'C' and r < 0.20:
        return 'B'
    return base

def style_params(style):
    if style == 'A':
        # 详细解答不限制长度（使用模型默认），略微降低温度
        return 0.75, None
    if style == 'C':
        return 0.65, 350
    # B 中等长度不限制（交给模型与内容），略高随机性
    return 0.85, None

def call_gemini(prompt, user_id, model=None, temperature=0.85, max_tokens=None):
    """调用Gemini API - 使用智能路由"""
    
    # 1. 获取用户等级
    user_tier = get_user_tier(user_id)
    
    # 2. 从路由器获取合适的Key（业务等级 -> 路由等级）
    tier_map = {
        'member': 'normal',
        'pro': 'premium',
        'pro_annual': 'vip',
        'admin': 'vip',
    }
    router_tier = tier_map.get(user_tier, 'normal')
    api_key = key_router.get_key(router_tier, user_id, model or DEFAULT_DM_MODEL)
    
    if not api_key:
        print("❌ 无可用Key")
        return None
    
    # 显示使用的Key信息
    key_group = key_router.key_stats[api_key]['group']
    print(f"🔑 使用Key: {api_key[:15]}... (组: {key_group}, 等级: {user_tier})")
    
    # 3. 调用API
    use_model = model or DEFAULT_DM_MODEL
    url = f'https://generativelanguage.googleapis.com/v1/models/{use_model}:generateContent?key={api_key}'
    
    generation_config = {
        "temperature": temperature,
        "topK": 40,
        "topP": 0.95,
    }
    if max_tokens is not None:
        generation_config["maxOutputTokens"] = max_tokens

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": generation_config,
    }
    
    start_time = time.time()
    success = False
    tokens_used = 0
    error_msg = None
    
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
                
                # 获取token使用量
                if 'usageMetadata' in result:
                    tokens_used = result['usageMetadata'].get('totalTokenCount', 0)
                
                success = True
                latency = time.time() - start_time
                
                # 记录成功请求
                key_router.record_request(api_key, success=True, latency=latency, tokens=tokens_used)
                # 追加事件日志
                append_event({
                    'ts': datetime.now().isoformat(),
                    'user_id': user_id,
                    'model': use_model,
                    'key_short': api_key[:8],
                    'tokens': tokens_used,
                    'latency_ms': int(latency * 1000),
                    'ok': True
                })
                return text.strip()
            else:
                error_msg = "No candidates in response"
                
    except urllib.error.HTTPError as e:
        error_msg = f"HTTP {e.code}: {e.reason}"
        print(f'❌ Gemini API错误: {error_msg}')
    except Exception as e:
        error_msg = str(e)
        print(f'❌ 错误: {error_msg}')
    
    # 记录失败请求
    latency = time.time() - start_time
    key_router.record_request(api_key, success=False, latency=latency, error=error_msg)
    append_event({
        'ts': datetime.now().isoformat(),
        'user_id': user_id,
        'model': use_model,
        'key_short': api_key[:8],
        'ok': False,
        'error': error_msg
    })
    
    # 尝试下一个Key
    print("🔄 尝试切换到其他Key...")
    # 使用相同的路由等级与模型重试
    # 重新计算业务->路由等级映射，保证一致
    tier_map = {
        'member': 'normal',
        'pro': 'premium',
        'pro_annual': 'vip',
        'admin': 'vip',
    }
    router_tier_retry = tier_map.get(get_user_tier(user_id), 'normal')
    retry_key = key_router.get_key(router_tier_retry, user_id, use_model)
    if retry_key and retry_key != api_key:
        return call_gemini(prompt, user_id, model=use_model, temperature=temperature, max_tokens=max_tokens)
    
    return None

def send(chat_id, text, parse_mode=None):
    """发送消息"""
    try:
        params = {'chat_id': chat_id, 'text': text}
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
    
    user_tier = get_user_tier(user_id)
    print(f'[{datetime.now().strftime("%H:%M:%S")}] 收到消息: "{text}" from @{username} (等级: {user_tier})')
    
    if text.startswith('/start'):
        send(chat_id, f"""
👋 你好 {first_name}！

我是**小爱同学**，你的智能AI助手！

✨ **核心功能**
• 💬 私聊默认 - {DEFAULT_DM_MODEL}
• 💬 群聊默认 - {DEFAULT_GROUP_MODEL}
• 🧠 5轮记忆 - 记住对话历史
• 🎯 关键词触发 - 理解情感
• 🔑 智能路由 - 25个Keys自动调度
• ⚡ 负载均衡 - 优化响应速度

🎖️ **你的等级**: {user_tier.upper()}
{get_tier_info(user_tier)}

发送消息开始聊天吧！ 😊
""")
    
    elif text.startswith('/status'):
        # 显示详细状态
        stats = key_router.get_stats()
        # 私聊持久记忆条数
        dm_hist = load_private_memory(user_id)
        history_count = len(dm_hist) // 2
        
        status_text = f"""
📊 **系统状态**

🤖 **AI服务**
├─ 私聊: {DEFAULT_DM_MODEL}
├─ 群聊: {DEFAULT_GROUP_MODEL}
├─ Keys总数: {stats['total_keys']}
├─ 可用Keys: {stats['available_keys']}
├─ 黑名单: {stats['blacklisted_keys']}
└─ 状态: ✅ 在线

📈 **使用统计**
├─ 总请求: {stats['total_requests']}
├─ 总Tokens: {stats['total_tokens']:,}
├─ 错误数: {stats['total_errors']}
└─ 成功率: {((stats['total_requests'] - stats['total_errors']) / max(stats['total_requests'], 1) * 100):.1f}%

🧠 **记忆系统**
├─ 私聊持久: {history_count}轮 (不清除将一直保留)
└─ 群聊临时: 每用户{MAX_GROUP_TURNS}次/轮，单群并发{MAX_GROUP_CONCURRENT}人

👤 **用户信息**
├─ @{username} ({first_name})
└─ 等级: {user_tier.upper()}
"""
        
        send(chat_id, status_text)
    
    elif text.startswith('/router'):
        # 显示路由器详细信息
        router_info = "🔑 **Key路由器状态**\n\n"
        
        for group in ['group_a', 'group_b', 'group_c', 'group_d']:
            capacity = key_router.get_group_capacity(group, DEFAULT_GROUP_MODEL)
            router_info += f"**{group.upper()}**\n"
            router_info += f"├─ Keys: {capacity['available_keys']}/{capacity['total_keys']}可用\n"
            router_info += f"├─ RPM: {capacity['max_rpm']}\n"
            router_info += f"├─ RPD: {capacity['max_rpd']}\n"
            router_info += f"└─ 使用率: {capacity['utilization']}\n\n"
        
        send(chat_id, router_info)
    
    elif text.startswith('/clear'):
        # 清除私聊持久化与群聊临时会话
        dm_hist = load_private_memory(user_id)
        cleared_rounds = len(dm_hist) // 2
        try:
            path = _dm_mem_path(user_id)
            if os.path.exists(path):
                os.remove(path)
        except Exception:
            pass
        if chat_id in group_sessions and user_id in group_sessions[chat_id]:
            del group_sessions[chat_id][user_id]
        send(chat_id, f'✅ 已清除你的私聊记忆与群聊会话（{cleared_rounds}轮）')
    
    elif text.startswith('/mode') and get_user_tier(user_id) == 'admin':
        # 管理员切换工作模式: /mode work | /mode crush
        parts = text.strip().split()
        if len(parts) >= 2 and parts[1] in ('work', 'crush'):
            ADMIN_DM_MODE[user_id] = parts[1]
            send(chat_id, f"✅ 模式已切换为: {parts[1]}")
        else:
            send(chat_id, "用法: /mode work 或 /mode crush")
    elif text.startswith('/ssh') and get_user_tier(user_id) == 'admin':
        parts = text.strip().split(maxsplit=1)
        if len(parts) == 1 or parts[1].lower() in ('on', 'off'):
            if len(parts) == 1 or parts[1].lower() == 'on':
                ADMIN_DM_MODE[user_id] = 'work'
                send(chat_id, '✅ 已开启任务模式: 2.5-pro (1.5s节流)')
            else:
                ADMIN_DM_MODE[user_id] = 'crush'
                send(chat_id, '✅ 已关闭任务模式')
        else:
            # 直接以任务模式执行后续内容
            task_text = parts[1]
            last = ADMIN_LAST_DM.get(user_id, 0)
            now = time.time()
            if now - last < ADMIN_THROTTLE_S:
                time.sleep(ADMIN_THROTTLE_S - (now - last))
            ADMIN_LAST_DM[user_id] = time.time()

            prompt = build_context_prompt('private', chat_id, user_id, task_text, first_name)
            answer = call_gemini(prompt, user_id, model='gemini-2.5-pro')
            if answer:
                hist = load_private_memory(user_id)
                hist.append({'role': 'user', 'content': task_text, 'time': datetime.now().isoformat()})
                hist.append({'role': 'assistant', 'content': answer, 'time': datetime.now().isoformat()})
                save_private_memory(user_id, hist)
                send(chat_id, answer)
            else:
                send(chat_id, '任务执行失败，请稍后重试。')
    elif text.startswith('/help'):
        send(chat_id, """
🤖 **小爱同学使用指南**

**基础命令**
/start - 启动Bot
/help - 帮助信息
/status - 系统状态
/router - 路由器状态
/clear - 清除记忆
/**ssh** - 管理员任务模式（/ssh on|off 或 /ssh <任务>）

**AI功能**
• 直接发送消息进行对话
• 我会记住最近5轮对话
• 支持关键词情感识别

**智能路由**
• VIP: 优先使用Group A
• 普通: 使用Group C/D
• 自动负载均衡
• 故障自动转移

💡 开始聊天，体验智能对话！
""")
    
    else:
        if text and not text.startswith('/'):
            chat_type = msg['chat'].get('type', 'private')
            keywords = detect_keywords(text)
            if keywords:
                print(f"[关键词] {[k['keyword'] for k in keywords]}")

            if chat_type in ('group', 'supergroup'):
                # 群聊: 关键词触发或已有会话继续
                session = group_sessions.get(chat_id, {}).get(user_id)
                if not session and keywords:
                    # 并发限制
                    if len(group_sessions[chat_id]) >= MAX_GROUP_CONCURRENT:
                        return
                    group_sessions[chat_id][user_id] = {'messages': [], 'replies': 0, 'started_at': datetime.now().isoformat()}
                    session = group_sessions[chat_id][user_id]

                if session and session['replies'] < MAX_GROUP_TURNS:
                    # 低信号在群聊可忽略
                    if _LOW_SIGNAL.match(text.strip()):
                        return
                    style = decide_style(text, chat_type, user_tier)
                    temp, mx = style_params(style)
                    prompt = build_context_prompt(chat_type, chat_id, user_id, text, first_name, style)
                    answer = call_gemini(prompt, user_id, model=DEFAULT_GROUP_MODEL, temperature=temp, max_tokens=mx)
                    if answer:
                        add_to_memory(user_id, text, answer)  # 仍保留短期内存以供上下文构建
                        # 存入会话(仅保留最近5轮≈10条)
                        session['messages'].append({'role': 'user', 'content': text, 'time': datetime.now().isoformat()})
                        session['messages'].append({'role': 'assistant', 'content': answer, 'time': datetime.now().isoformat()})
                        session['messages'] = session['messages'][-10:]
                        session['replies'] += 1
                        progress = f"({session['replies']}/{MAX_GROUP_TURNS})"
                        send(chat_id, f"{answer}\n{progress}")
                        if session['replies'] >= MAX_GROUP_TURNS:
                            # 本轮结束
                            send(chat_id, f"本轮对 @{username} 的对话已完成 {MAX_GROUP_TURNS}/{MAX_GROUP_TURNS}，可稍后再触发或私聊继续。")
                            # 会话仍可保留一段时间以便延续，这里不清除立即删除，交由后续逻辑回收
                    else:
                        send(chat_id, f'抱歉 {first_name}，服务繁忙，请稍后重试 😅')
                else:
                    # 无触发或已满额，不响应
                    pass
            else:
                # 私聊: 持久记忆
                style = decide_style(text, 'private', user_tier)
                temp, mx = style_params(style)
                prompt = build_context_prompt('private', chat_id, user_id, text, first_name, style)
                # 选择模型
                tier = get_user_tier(user_id)
                if tier == 'admin' and ADMIN_DM_MODE.get(user_id) == 'work':
                    # 管理员工作模式：2.5-pro + 1.5s节流
                    last = ADMIN_LAST_DM.get(user_id, 0)
                    now = time.time()
                    if now - last < ADMIN_THROTTLE_S:
                        time.sleep(ADMIN_THROTTLE_S - (now - last))
                    ADMIN_LAST_DM[user_id] = time.time()
                    chosen_model = 'gemini-2.5-pro'
                else:
                    # VIP(Pro/Pro_Annual) 与普通管理员(非任务模式) 用 2.5-flash
                    # 普通会员默认用 2.5-flash-lite（更宽的池）
                    if tier in ('pro', 'pro_annual', 'admin'):
                        chosen_model = 'gemini-2.5-flash'
                    else:
                        chosen_model = 'gemini-2.5-flash-lite'
                answer = call_gemini(prompt, user_id, model=chosen_model, temperature=temp, max_tokens=mx)
                if answer:
                    # 写入持久文件
                    hist = load_private_memory(user_id)
                    hist.append({'role': 'user', 'content': text, 'time': datetime.now().isoformat()})
                    hist.append({'role': 'assistant', 'content': answer, 'time': datetime.now().isoformat()})
                    save_private_memory(user_id, hist)
                    send(chat_id, answer)
                else:
                    send(chat_id, f'抱歉 {first_name}，服务繁忙，请稍后重试 😅')

def get_tier_info(tier):
    """获取等级说明"""
    tier_info = {
        'admin': '👑 管理员 - 可切换工作模式(2.5-pro)',
        'pro_annual': '🌟 年费Pro - 享受VIP路由优先',
        'pro': '⭐ Pro - 优先使用高质量Key',
        'member': '👤 会员 - 标准服务',
    }
    return tier_info.get(tier, '')

def main():
    print('=' * 60)
    print('🤖 小爱同学 - 智能路由版')
    print('=' * 60)
    print(f'📱 Bot: @svskilo_bot')
    print(f'👤 Owner: {OWNER_ID}')
    print(f'🤖 AI: Gemini 2.5 Flash')
    print(f'🔑 Keys: 25个 (4组)')
    print(f'🧠 记忆: 5轮对话')
    print(f'🎯 关键词: {len(KEYWORD_TRIGGERS)}个')
    print('=' * 60)
    
    # 测试AI连接
    print('\n🧪 测试AI连接...')
    test_response = call_gemini("你好", OWNER_ID)
    if test_response:
        print(f'✅ AI测试成功: {test_response[:50]}...')
    
    # 发送启动通知
    startup_msg = f"""
🚀 **小爱同学已启动** (智能路由版)

⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🤖 Gemini 2.5 Flash
🔑 25个Keys智能调度
🧠 5轮记忆系统
🎯 关键词触发
⚡ 负载均衡

发送消息开始智能对话！
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
            
            # 显示最终统计
            final_stats = key_router.get_stats()
            print(f"\n📊 运行统计:")
            print(f"   总请求: {final_stats['total_requests']}")
            print(f"   总Tokens: {final_stats['total_tokens']:,}")
            print(f"   错误: {final_stats['total_errors']}")
            
            send(OWNER_ID, '👋 小爱同学已停止运行')
            break
        except Exception as e:
            print(f'❌ 错误: {e}')
            time.sleep(5)

if __name__ == '__main__':
    main()
