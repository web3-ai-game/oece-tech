#!/usr/bin/env python3
"""测试Bot是否能收到群消息"""

import asyncio
from telegram import Bot

# Bot Tokens
TOKENS = {
    "小爱同学": "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg",
    "Notion助手": "7849921796:AAHb7fhDG_ooYzgP6sYjv7ALy6jqZaBf66E",
    "倩倩姐": "8364183144:AAEIKOLENbquiX_KT_UlpGPU06tlbvn0z2w"
}

async def check_bot_updates(bot_name, token):
    """检查Bot的最新消息"""
    bot = Bot(token)
    
    print(f"\n{'='*60}")
    print(f"🤖 检查 {bot_name}")
    print(f"{'='*60}")
    
    try:
        # 获取Bot信息
        me = await bot.get_me()
        print(f"✅ Bot用户名: @{me.username}")
        print(f"✅ Bot ID: {me.id}")
        
        # 获取最新消息
        updates = await bot.get_updates(limit=10)
        
        if not updates:
            print("⚠️  没有收到任何消息")
            return
        
        print(f"\n📨 最近收到 {len(updates)} 条消息:\n")
        
        for update in updates[-5:]:  # 只显示最后5条
            if update.message:
                msg = update.message
                chat_type = msg.chat.type
                chat_title = msg.chat.title or msg.chat.username or "私聊"
                user = msg.from_user.username or msg.from_user.first_name
                text = msg.text or "[非文本消息]"
                
                print(f"  📍 {chat_type.upper()} - {chat_title}")
                print(f"  👤 发送者: @{user}")
                print(f"  💬 内容: {text[:50]}...")
                print(f"  🕐 时间: {msg.date}")
                print()
                
    except Exception as e:
        print(f"❌ 错误: {e}")

async def main():
    print("\n" + "="*60)
    print("🔍 检查所有Bot的消息接收状态")
    print("="*60)
    
    for bot_name, token in TOKENS.items():
        await check_bot_updates(bot_name, token)
        await asyncio.sleep(1)
    
    print("\n" + "="*60)
    print("✅ 检查完成")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
