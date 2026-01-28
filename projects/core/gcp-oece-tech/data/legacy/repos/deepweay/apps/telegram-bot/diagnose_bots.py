#!/usr/bin/env python3
"""诊断Bot状态和群组配置"""

import asyncio
import sys
from telegram import Bot

TOKENS = {
    "小爱同学": "8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg",
    "Notion助手": "7849921796:AAHb7fhDG_ooYzgP6sYjv7ALy6jqZaBf66E",
    "倩倩姐": "8364183144:AAEIKOLENbquiX_KT_UlpGPU06tlbvn0z2w"
}

async def diagnose_bot(bot_name, token):
    """诊断单个Bot"""
    bot = Bot(token)
    
    print(f"\n{'='*70}")
    print(f"🤖 诊断 {bot_name}")
    print(f"{'='*70}")
    
    try:
        # 1. Bot基本信息
        me = await bot.get_me()
        print(f"\n✅ Bot信息:")
        print(f"   用户名: @{me.username}")
        print(f"   ID: {me.id}")
        print(f"   名称: {me.first_name}")
        
        # 2. 获取最新消息
        updates = await bot.get_updates(limit=20, timeout=5)
        
        if not updates:
            print(f"\n⚠️  状态: Bot没有收到任何消息")
            print(f"\n💡 可能原因:")
            print(f"   1. Bot还没有加入任何群组")
            print(f"   2. 群组开启了隐私模式 (Bot只能看到@它的消息)")
            print(f"   3. Bot刚启动，还没有新消息")
            return
        
        print(f"\n✅ 收到 {len(updates)} 条消息")
        
        # 3. 分析消息来源
        chats = {}
        for update in updates:
            if update.message:
                chat = update.message.chat
                chat_id = chat.id
                if chat_id not in chats:
                    chats[chat_id] = {
                        'type': chat.type,
                        'title': chat.title or chat.username or '私聊',
                        'count': 0
                    }
                chats[chat_id]['count'] += 1
        
        print(f"\n📊 消息来源统计:")
        for chat_id, info in chats.items():
            print(f"   {info['type'].upper()}: {info['title']}")
            print(f"   └─ Chat ID: {chat_id}")
            print(f"   └─ 消息数: {info['count']}")
        
        # 4. 显示最近5条消息
        print(f"\n📨 最近5条消息:")
        for update in updates[-5:]:
            if update.message:
                msg = update.message
                user = msg.from_user.username or msg.from_user.first_name
                text = (msg.text or "[非文本]")[:60]
                print(f"\n   👤 @{user}: {text}")
                print(f"   📍 {msg.chat.type} - {msg.chat.title or '私聊'}")
                print(f"   🕐 {msg.date}")
        
        # 5. 检查Bot权限
        print(f"\n🔐 权限检查:")
        for chat_id in chats.keys():
            try:
                chat_member = await bot.get_chat_member(chat_id, me.id)
                print(f"   Chat {chat_id}: {chat_member.status}")
            except Exception as e:
                print(f"   Chat {chat_id}: 无法获取权限 ({e})")
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()

async def main():
    print("\n" + "="*70)
    print("🔍 Bot诊断工具")
    print("="*70)
    
    for bot_name, token in TOKENS.items():
        await diagnose_bot(bot_name, token)
        await asyncio.sleep(1)
    
    print("\n" + "="*70)
    print("✅ 诊断完成")
    print("="*70)
    
    print("\n💡 建议:")
    print("   1. 确保Bot已加入群组")
    print("   2. 在群组设置中关闭'隐私模式' (@BotFather -> /mybots -> 选择Bot -> Bot Settings -> Group Privacy -> Turn Off)")
    print("   3. 在群里发送消息测试: @小爱同学 你好")
    print("   4. 或发送包含关键词的消息: 小爱 帮忙")
    print()

if __name__ == "__main__":
    asyncio.run(main())
