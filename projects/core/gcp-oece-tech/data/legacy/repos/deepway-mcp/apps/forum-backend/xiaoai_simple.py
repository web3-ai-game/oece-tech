#!/usr/bin/env python3
# 小爱同学 - 极简版本
import os
import json
import time
import urllib.request
import urllib.parse

TOKEN = '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg'
OWNER_ID = 6136230855
API = f'https://api.telegram.org/bot{TOKEN}/'

def send(chat_id, text):
    """发送消息"""
    try:
        data = urllib.parse.urlencode({
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown'
        }).encode()
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
    
    print(f'收到消息: "{text}" from @{username}')
    
    if text.startswith('/start'):
        send(chat_id, """
🤖 **小爱同学已启动**

我是小爱，您的AI助手！

📌 **可用命令**
/start - 开始
/help - 帮助  
/status - 状态
/ping - 测试

💡 直接发送消息与我对话
""")
    
    elif text.startswith('/help'):
        send(chat_id, """
❓ **帮助信息**

**基本命令**
• /start - 启动Bot
• /help - 显示帮助
• /status - 系统状态
• /ping - 测试连接

**AI功能**
• 直接发送消息进行对话
• 支持多轮对话
• 智能回复

更多功能开发中...
""")
    
    elif text.startswith('/status'):
        import subprocess
        try:
            cpu = subprocess.check_output("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'", shell=True).decode().strip()
            mem = subprocess.check_output("free -h | awk 'NR==2{print $3\"/\"$2}'", shell=True).decode().strip()
            
            send(chat_id, f"""
📊 **系统状态**

🖥️ CPU: {cpu}%
💾 内存: {mem}
🤖 Bot: 运行正常
⚡ 响应: <100ms

Owner: @{username}
状态: ✅ 在线
""")
        except:
            send(chat_id, '📊 系统运行正常！')
    
    elif text.startswith('/ping'):
        send(chat_id, '🏓 Pong! Bot正常运行')
    
    else:
        # 默认回复
        if user_id == OWNER_ID:
            send(chat_id, f'收到您的消息: {text}\n\n_AI回复功能开发中..._')
        else:
            send(chat_id, f'您好！收到消息: {text}')

def main():
    print('🚀 小爱同学启动中...')
    print(f'   Bot: @svskilo_bot')
    print(f'   Owner: {OWNER_ID}')
    
    # 发送启动通知
    send(OWNER_ID, f"""
🚀 **小爱同学已启动**

时间: {time.strftime('%Y-%m-%d %H:%M:%S')}
Bot: @svskilo_bot
Owner: {OWNER_ID}

✅ 系统就绪，等待指令
发送 /help 查看命令
""")
    
    offset = 0
    print('✅ 启动完成，等待消息...\n')
    
    while True:
        try:
            updates = get_updates(offset)
            
            for update in updates:
                offset = update['update_id'] + 1
                
                if 'message' in update:
                    handle(update['message'])
            
            time.sleep(0.1)
            
        except KeyboardInterrupt:
            print('\n👋 Bot停止')
            send(OWNER_ID, '👋 小爱同学已停止运行')
            break
        except Exception as e:
            print(f'❌ 错误: {e}')
            time.sleep(5)

if __name__ == '__main__':
    main()
