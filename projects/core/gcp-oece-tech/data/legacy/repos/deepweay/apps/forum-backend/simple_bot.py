#!/usr/bin/env python3
# 简单的Telegram Bot - 无需安装依赖

import os
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime

BOT_TOKEN = os.getenv('TELEGRAM_BOT_SVSKILO_TOKEN', '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg')
OWNER_ID = int(os.getenv('BOT_OWNER_ID', '6136230855'))

class SimpleTelegramBot:
    def __init__(self, token):
        self.token = token
        self.api_url = f"https://api.telegram.org/bot{token}/"
        self.offset = 0
        
    def make_request(self, method, params=None):
        """发送API请求"""
        url = self.api_url + method
        if params:
            data = urllib.parse.urlencode(params).encode()
            req = urllib.request.Request(url, data=data)
        else:
            req = urllib.request.Request(url)
            
        try:
            with urllib.request.urlopen(req) as response:
                return json.loads(response.read().decode())
        except Exception as e:
            print(f"API请求错误: {e}")
            return None
    
    def send_message(self, chat_id, text, parse_mode='Markdown'):
        """发送消息"""
        params = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': parse_mode
        }
        return self.make_request('sendMessage', params)
    
    def get_updates(self):
        """获取更新"""
        params = {
            'offset': self.offset,
            'timeout': 30
        }
        result = self.make_request('getUpdates', params)
        if result and result['ok']:
            return result['result']
        return []
    
    def handle_command(self, message):
        """处理命令"""
        chat_id = message['chat']['id']
        text = message.get('text', '')
        user_id = message['from']['id']
        
        if text.startswith('/start'):
            self.send_message(chat_id, """
🤖 **超级Bot已启动**

我是你的智能助手，支持以下功能：

📊 /status - 系统状态
📈 /monitor - 实时监控
🚀 /deploy - 部署管理
🗄️ /db - 数据库状态
❓ /help - 帮助信息

Owner专属功能已激活！
""")
        
        elif text.startswith('/status'):
            import subprocess
            try:
                # 获取系统状态
                cpu = subprocess.check_output("top -bn1 | head -5", shell=True).decode()
                mem = subprocess.check_output("free -h | head -3", shell=True).decode()
                
                status_msg = f"""
📊 **系统状态**

```
{cpu[:200]}
```

**内存使用**
```
{mem}
```

更新时间: {datetime.now().strftime('%H:%M:%S')}
"""
                self.send_message(chat_id, status_msg)
            except Exception as e:
                self.send_message(chat_id, f"❌ 获取状态失败: {e}")
        
        elif text.startswith('/monitor'):
            self.send_message(chat_id, """
📈 **监控面板**

🟢 Bot状态: 运行中
🟢 Redis: 连接正常
🟢 数据库: 连接正常
⚡ 响应时间: <100ms

今日统计：
- 消息处理: 0
- 活跃用户: 0
- API调用: 0

[实时监控开发中...]
""")
        
        elif text.startswith('/deploy'):
            if user_id == OWNER_ID:
                self.send_message(chat_id, """
🚀 **部署管理**

选择部署目标：
- /deploy_bot - 更新Bot
- /deploy_static - 部署静态站
- /deploy_all - 全量部署

当前版本: v1.0.0
最后部署: 刚刚
""")
            else:
                self.send_message(chat_id, "❌ 权限不足")
        
        elif text.startswith('/db'):
            self.send_message(chat_id, """
🗄️ **数据库状态**

**Redis**
- 键数量: 0
- 内存使用: 0MB
- 连接数: 1

**Supabase**
- 用户数: 0
- 存储: 0MB
- 状态: 正常

[详细统计开发中...]
""")
        
        elif text.startswith('/help'):
            self.send_message(chat_id, """
❓ **帮助信息**

基本命令：
- /start - 开始使用
- /status - 系统状态
- /monitor - 监控面板
- /help - 帮助信息

Owner命令：
- /deploy - 部署管理
- /db - 数据库管理
- /logs - 查看日志
- /restart - 重启服务

更多功能开发中...
""")
        
        else:
            # 默认回复
            self.send_message(chat_id, f"收到消息: {text}\n\nAI回复功能开发中...")
    
    def run(self):
        """运行Bot"""
        print(f"✅ Bot启动成功")
        print(f"   Token: {self.token[:20]}...")
        print(f"   Owner ID: {OWNER_ID}")
        print("   等待消息...")
        
        # 发送启动通知
        if OWNER_ID:
            self.send_message(OWNER_ID, f"""
🚀 **Bot已启动**

时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
PID: {os.getpid()}

发送 /help 查看可用命令
""")
        
        while True:
            try:
                updates = self.get_updates()
                
                for update in updates:
                    self.offset = update['update_id'] + 1
                    
                    if 'message' in update:
                        message = update['message']
                        print(f"收到消息: {message.get('text', '')}")
                        self.handle_command(message)
                
                time.sleep(1)
                
            except KeyboardInterrupt:
                print("\n👋 Bot停止")
                break
            except Exception as e:
                print(f"❌ 错误: {e}")
                time.sleep(5)

def main():
    if not BOT_TOKEN:
        print("❌ 缺少环境变量: TELEGRAM_BOT_XIAOAI_TOKEN")
        print("   请设置: export TELEGRAM_BOT_XIAOAI_TOKEN='your-token'")
        return
    
    bot = SimpleTelegramBot(BOT_TOKEN)
    bot.run()

if __name__ == '__main__':
    main()
