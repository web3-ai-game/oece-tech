#!/usr/bin/env python3
"""
🧪 测试高情商Bot功能
"""

import asyncio
import json
from high_eq_bot import HighEQBot, GeminiRouter, SharedBrain, PersonalityProfile

async def test_gemini_router():
    """测试Gemini路由器"""
    print("测试Gemini路由器...")
    router = GeminiRouter()
    
    # 测试key轮询
    keys = []
    for i in range(5):
        key = router.get_next_key()
        keys.append(key[:20] + "...")
        
    print(f"✅ 轮询测试: 获取了{len(set(keys))}个不同的key")
    
    # 测试最佳key选择
    best_key = router.get_best_key()
    print(f"✅ 最佳key: {best_key[:20]}...")

async def test_shared_brain():
    """测试共享大脑"""
    print("\n测试共享大脑...")
    brain = SharedBrain()
    await brain.connect()
    
    # 测试用户记忆
    test_user_id = 123456789
    test_context = {
        "name": "测试用户",
        "mood": "开心",
        "history": ["对话1", "对话2"]
    }
    
    await brain.remember_user(test_user_id, test_context)
    recalled = await brain.recall_user(test_user_id)
    
    if recalled:
        print(f"✅ 用户记忆: {json.dumps(recalled, ensure_ascii=False)[:100]}...")
    else:
        print("⚠️ Redis未连接，跳过记忆测试")
    
    # 测试知识学习
    await brain.learn("测试", "这是一个测试知识")
    knowledge = await brain.recall_knowledge("测试")
    if knowledge:
        print(f"✅ 知识回忆: {knowledge}")
    else:
        print("⚠️ 知识存储跳过")

async def test_emotion_detection():
    """测试情绪检测"""
    print("\n测试情绪检测...")
    bot = HighEQBot("test_token")
    
    test_messages = [
        ("我今天很开心！", "happy"),
        ("感觉有点难过", "sad"),
        ("真的好生气啊", "angry"),
        ("压力好大，很焦虑", "anxious"),
        ("累死了，想休息", "tired"),
        ("今天天气不错", None)
    ]
    
    for message, expected in test_messages:
        emotion = await bot.detect_emotion(message)
        result = "✅" if emotion == expected else "❌"
        print(f"{result} '{message}' -> 检测: {emotion}, 预期: {expected}")

async def test_personality():
    """测试个性配置"""
    print("\n测试个性配置...")
    personality = PersonalityProfile()
    
    print(f"✅ 共情回复数: {len(personality.EMPATHY_RESPONSES)}")
    print(f"✅ 鼓励语句数: {len(personality.ENCOURAGEMENT)}")
    print(f"✅ 幽默语句数: {len(personality.HUMOR)}")
    print(f"✅ 情绪类型数: {len(personality.EMOTIONS)}")

async def test_api_call():
    """测试API调用"""
    print("\n测试Gemini API调用...")
    bot = HighEQBot("test_token")
    
    # 测试简单调用
    response = await bot.call_gemini("你好，介绍一下自己")
    if response:
        print(f"✅ API响应: {response[:100]}...")
    else:
        print("❌ API调用失败或降级到预设回复")

async def main():
    """运行所有测试"""
    print("🧪 开始测试高情商Bot系统")
    print("=" * 50)
    
    # 运行测试
    await test_gemini_router()
    await test_shared_brain()
    await test_emotion_detection()
    await test_personality()
    await test_api_call()
    
    print("\n" + "=" * 50)
    print("✅ 测试完成!")
    print("\n提示:")
    print("1. 如果Redis未连接，记忆功能将跳过")
    print("2. 如果API调用失败，检查网络和密钥")
    print("3. 运行 ./start.sh 启动完整服务")

if __name__ == "__main__":
    asyncio.run(main())
