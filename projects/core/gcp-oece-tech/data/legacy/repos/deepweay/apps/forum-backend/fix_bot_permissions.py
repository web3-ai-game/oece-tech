#!/usr/bin/env python3
"""
修复Bot权限脚本
"""

import requests
import json

BOT_TOKEN = "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"

def check_bot_permissions():
    """检查Bot当前权限"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getMe"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data['ok']:
            bot_info = data['result']
            print("🤖 当前Bot信息:")
            print(f"• ID: {bot_info['id']}")
            print(f"• 用户名: @{bot_info['username']}")
            print(f"• 名称: {bot_info['first_name']}")
            print(f"• 可加入群组: {bot_info.get('can_join_groups', False)}")
            print(f"• 可读取所有群组消息: {bot_info.get('can_read_all_group_messages', False)}")
            print(f"• 支持内联查询: {bot_info.get('supports_inline_queries', False)}")
            
            if not bot_info.get('can_join_groups'):
                print("\n❌ 问题发现: Bot无法加入群组!")
                print("🔧 解决方案:")
                print("1. 联系 @BotFather")
                print("2. 使用 /setcommands")
                print("3. 使用 /setprivacy")
                print("4. 重新生成Bot Token")
                return False
            else:
                print("\n✅ Bot权限正常!")
                return True
        else:
            print(f"❌ 错误: {data}")
            return False
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return False

def get_bot_updates():
    """获取Bot更新消息"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data['ok']:
            updates = data['result']
            print(f"\n📨 最近 {len(updates)} 条消息:")
            
            for update in updates[-5:]:  # 显示最近5条
                message = update.get('message', {})
                if message:
                    user = message.get('from', {})
                    chat = message.get('chat', {})
                    text = message.get('text', '')
                    
                    chat_type = chat.get('type', 'unknown')
                    chat_title = chat.get('title', chat.get('first_name', 'Unknown'))
                    
                    print(f"• [{chat_type}] {chat_title}")
                    print(f"  用户: {user.get('username', user.get('first_name', 'Unknown'))}")
                    print(f"  消息: {text[:50]}...")
                    print()
        else:
            print(f"❌ 获取更新失败: {data}")
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")

if __name__ == "__main__":
    print("🔍 检查Bot权限状态...")
    check_bot_permissions()
    
    print("\n📨 检查最近消息...")
    get_bot_updates()
    
    print("\n🔧 如果Bot无法加入群组，请:")
    print("1. 访问 @BotFather")
    print("2. 发送 /mybots")
    print("3. 选择你的Bot")
    print("4. 检查Bot Group设置")
    print("5. 必要时重新生成Token")
