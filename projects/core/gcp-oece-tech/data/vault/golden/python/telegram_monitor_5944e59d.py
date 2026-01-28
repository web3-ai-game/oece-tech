#!/usr/bin/env python3
# 监控Bot - 简化版，无需额外依赖

import os
import json
import time
import subprocess
import urllib.request
import urllib.parse
from datetime import datetime

# 配置
BOT_TOKEN = os.getenv('TELEGRAM_BOT_XIAOAI_TOKEN', '')
OWNER_ID = os.getenv('BOT_OWNER_ID', '')

def send_telegram_message(chat_id, text):
    """发送Telegram消息"""
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        data = urllib.parse.urlencode({
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown'
        }).encode()
        
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return result['ok']
    except Exception as e:
        print(f"Error sending message: {e}")
        return False

def get_system_status():
    """获取系统状态"""
    try:
        # CPU使用率
        cpu_cmd = "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1"
        cpu = subprocess.check_output(cpu_cmd, shell=True).decode().strip()
        
        # 内存使用
        mem_cmd = "free -m | awk 'NR==2{printf \"%.1f\", $3*100/$2}'"
        mem = subprocess.check_output(mem_cmd, shell=True).decode().strip()
        
        # 磁盘使用
        disk_cmd = "df -h / | awk 'NR==2{print $5}'"
        disk = subprocess.check_output(disk_cmd, shell=True).decode().strip()
        
        # 负载
        load = os.getloadavg()[0]
        
        return {
            'cpu': cpu,
            'memory': mem,
            'disk': disk,
            'load': load
        }
    except Exception as e:
        print(f"Error getting system status: {e}")
        return None

def main():
    """主函数"""
    if not BOT_TOKEN or not OWNER_ID:
        print("❌ 缺少必要的环境变量: TELEGRAM_BOT_XIAOAI_TOKEN 或 BOT_OWNER_ID")
        return
    
    print(f"✅ 监控Bot启动")
    print(f"   Owner ID: {OWNER_ID}")
    print(f"   Bot Token: {BOT_TOKEN[:20]}...")
    
    # 发送启动消息
    startup_msg = f"""
🚀 **超级Bot监控系统已启动**

时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
PID: {os.getpid()}

输入以下命令查看状态：
/status - 系统状态
/monitor - 实时监控
"""
    
    if send_telegram_message(OWNER_ID, startup_msg):
        print("✅ 启动消息已发送")
    else:
        print("❌ 启动消息发送失败")
    
    # 定期发送系统状态
    while True:
        try:
            status = get_system_status()
            if status:
                status_msg = f"""
📊 **系统监控报告**

🖥️ CPU使用率: {status['cpu']}%
💾 内存使用: {status['memory']}%
💿 磁盘使用: {status['disk']}
⚡ 系统负载: {status['load']:.2f}

更新时间: {datetime.now().strftime('%H:%M:%S')}
"""
                
                # 如果CPU或内存过高，发送告警
                try:
                    if float(status['cpu']) > 80:
                        status_msg += "\n⚠️ **警告: CPU使用率过高！**"
                    if float(status['memory']) > 80:
                        status_msg += "\n⚠️ **警告: 内存使用率过高！**"
                except:
                    pass
                
                # 每小时发送一次状态报告
                if datetime.now().minute == 0:
                    send_telegram_message(OWNER_ID, status_msg)
                    print(f"📊 状态报告已发送 {datetime.now().strftime('%H:%M')}")
            
            # 等待60秒
            time.sleep(60)
            
        except KeyboardInterrupt:
            print("\n👋 监控Bot停止")
            break
        except Exception as e:
            print(f"❌ 错误: {e}")
            time.sleep(60)

if __name__ == '__main__':
    main()
