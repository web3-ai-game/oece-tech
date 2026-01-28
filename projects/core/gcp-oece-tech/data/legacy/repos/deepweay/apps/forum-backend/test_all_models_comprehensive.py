#!/usr/bin/env python3
"""
全面测试所有Gemini模型
对比免费层和付费层账户差异
"""

import requests
import time
import json
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict

# 测试的模型列表（基于截图）
ALL_MODELS = {
    # 文本生成模型
    "text_models": [
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash-exp",
    ],
    # 多模态生成模型
    "multimodal_models": [
        "gemini-2.0-flash-preview-image-generation",
        "gemini-2.5-flash-tts",
    ],
    # Live API模型
    "live_models": [
        "gemini-2.0-flash-live",
        "gemini-2.5-flash-live",
        "gemini-2.5-flash-native-audio-dialog",
    ],
    # 实验模型
    "experimental_models": [
        "learnlm-2.0-flash-experimental",
        "gemini-robotics-er-1.5-preview",
    ],
    # 图像生成
    "image_models": [
        "imagen-3.0-generate",
    ],
    # 视频生成
    "video_models": [
        "veo-2.0-generate-001",
    ]
}

# Keys分类（基于用户提供）
TEST_KEYS = {
    "free_tier": [
        # 免费层Keys（之前测试的25个中选10个）
        "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
        "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
        "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
        "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
        "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
    ],
    "paid_tier": [
        # 用户之前提到的付费层Keys
        "AIzaSyCFsMpRhiwm_SMgsJNODRAR86NKDxM6M8c",
        "AIzaSyAt0PUYuIrHN898bGAE1amOsUjP3ogrXiQ",
    ]
}

def test_text_model(key: str, model: str) -> Dict:
    """测试文本生成模型"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": "Say hi"}]
        }],
        "generationConfig": {
            "maxOutputTokens": 5,
            "temperature": 0
        }
    }
    
    try:
        start = time.time()
        response = requests.post(url, json=payload, timeout=10)
        elapsed = time.time() - start
        
        # 获取响应头信息
        headers = dict(response.headers)
        
        result = {
            "model": model,
            "status": response.status_code,
            "response_time": round(elapsed, 2),
            "rate_limit_info": {
                "rpm_limit": headers.get('X-RateLimit-Limit-Requests', 'N/A'),
                "rpm_remaining": headers.get('X-RateLimit-Remaining-Requests', 'N/A'),
                "tpm_limit": headers.get('X-RateLimit-Limit-Tokens', 'N/A'),
                "tpm_remaining": headers.get('X-RateLimit-Remaining-Tokens', 'N/A'),
            },
            "success": response.status_code == 200,
            "error": None if response.status_code == 200 else response.text[:200]
        }
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'candidates' in data:
                    result["response_text"] = data['candidates'][0]['content']['parts'][0]['text'][:50]
            except:
                pass
        
        return result
        
    except Exception as e:
        return {
            "model": model,
            "status": -1,
            "response_time": 0,
            "success": False,
            "error": str(e)
        }

def test_image_model(key: str, model: str) -> Dict:
    """测试图像生成模型"""
    # imagen使用不同的endpoint
    if "imagen" in model:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}?key={key}"
    else:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    
    payload = {
        "prompt": "A simple test image",
        "numberOfImages": 1
    }
    
    try:
        start = time.time()
        response = requests.post(url, json=payload, timeout=15)
        elapsed = time.time() - start
        
        return {
            "model": model,
            "status": response.status_code,
            "response_time": round(elapsed, 2),
            "success": response.status_code == 200,
            "error": None if response.status_code == 200 else response.text[:200]
        }
    except Exception as e:
        return {
            "model": model,
            "status": -1,
            "response_time": 0,
            "success": False,
            "error": str(e)
        }

def comprehensive_test():
    """全面测试所有模型"""
    print("🔍 开始全面测试Gemini模型")
    print("=" * 80)
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "free_tier": {},
        "paid_tier": {}
    }
    
    # 测试免费层
    print("\n📊 测试免费层Keys")
    print("-" * 80)
    for i, key in enumerate(TEST_KEYS["free_tier"][:2], 1):  # 只测前2个避免过度
        print(f"\n免费层Key #{i}: {key[:20]}...")
        results["free_tier"][f"key_{i}"] = {
            "key_display": key[:20] + "...",
            "models": {}
        }
        
        # 测试文本模型
        print("  测试文本模型:")
        for model in ALL_MODELS["text_models"]:
            print(f"    - {model}...", end=" ")
            result = test_text_model(key, model)
            results["free_tier"][f"key_{i}"]["models"][model] = result
            
            if result["success"]:
                print(f"✅ ({result['response_time']}s)")
            elif result["status"] == 429:
                print(f"⚠️ 429限流")
            else:
                print(f"❌ {result['status']}")
            
            time.sleep(1)  # 避免太快
    
    # 测试付费层
    print("\n\n💰 测试付费层Keys")
    print("-" * 80)
    for i, key in enumerate(TEST_KEYS["paid_tier"], 1):
        print(f"\n付费层Key #{i}: {key[:20]}...")
        results["paid_tier"][f"key_{i}"] = {
            "key_display": key[:20] + "...",
            "models": {}
        }
        
        # 测试文本模型
        print("  测试文本模型:")
        for model in ALL_MODELS["text_models"]:
            print(f"    - {model}...", end=" ")
            result = test_text_model(key, model)
            results["paid_tier"][f"key_{i}"]["models"][model] = result
            
            if result["success"]:
                print(f"✅ ({result['response_time']}s)")
            elif result["status"] == 429:
                print(f"⚠️ 429限流 ← 重点关注!")
            elif result["status"] == 403:
                print(f"❌ 403无权限")
            else:
                print(f"❌ {result['status']}")
            
            time.sleep(1)
    
    # 保存结果
    with open("comprehensive_model_test.json", "w") as f:
        json.dump(results, f, indent=2)
    
    return results

def analyze_results(results: Dict):
    """分析测试结果"""
    print("\n\n📈 测试结果分析")
    print("=" * 80)
    
    # 统计免费层
    print("\n🆓 免费层统计:")
    free_stats = defaultdict(lambda: {"success": 0, "total": 0, "429": 0})
    
    for key_data in results["free_tier"].values():
        for model, result in key_data["models"].items():
            free_stats[model]["total"] += 1
            if result["success"]:
                free_stats[model]["success"] += 1
            elif result["status"] == 429:
                free_stats[model]["429"] += 1
    
    for model, stats in free_stats.items():
        success_rate = (stats["success"] / stats["total"] * 100) if stats["total"] > 0 else 0
        print(f"  {model:40s} 成功率: {success_rate:5.1f}%  429错误: {stats['429']}")
    
    # 统计付费层
    print("\n💰 付费层统计:")
    paid_stats = defaultdict(lambda: {"success": 0, "total": 0, "429": 0, "403": 0})
    
    for key_data in results["paid_tier"].values():
        for model, result in key_data["models"].items():
            paid_stats[model]["total"] += 1
            if result["success"]:
                paid_stats[model]["success"] += 1
            elif result["status"] == 429:
                paid_stats[model]["429"] += 1
            elif result["status"] == 403:
                paid_stats[model]["403"] += 1
    
    for model, stats in paid_stats.items():
        success_rate = (stats["success"] / stats["total"] * 100) if stats["total"] > 0 else 0
        status = "✅" if stats["success"] > 0 else "❌"
        print(f"  {status} {model:40s} 成功率: {success_rate:5.1f}%  429: {stats['429']}  403: {stats['403']}")
    
    # 对比分析
    print("\n🔄 免费层 vs 付费层对比:")
    print("-" * 80)
    
    all_models = set(free_stats.keys()) | set(paid_stats.keys())
    for model in sorted(all_models):
        free_ok = free_stats[model]["success"] > 0 if model in free_stats else False
        paid_ok = paid_stats[model]["success"] > 0 if model in paid_stats else False
        
        if free_ok and paid_ok:
            print(f"  ✅ {model:40s} 两者都可用")
        elif free_ok:
            print(f"  🆓 {model:40s} 仅免费层可用")
        elif paid_ok:
            print(f"  💰 {model:40s} 仅付费层可用")
        else:
            print(f"  ❌ {model:40s} 两者都不可用")
    
    # 429错误分析
    print("\n⚠️ 429限流错误分析:")
    print("-" * 80)
    
    free_429_count = sum(stats["429"] for stats in free_stats.values())
    paid_429_count = sum(stats["429"] for stats in paid_stats.values())
    
    print(f"  免费层429错误总数: {free_429_count}")
    print(f"  付费层429错误总数: {paid_429_count}")
    
    if paid_429_count > 0:
        print(f"\n  ⚠️ 警告: 付费层出现{paid_429_count}次429错误，可能:")
        print(f"     1. 付费层配额已用完")
        print(f"     2. 付费层实际是免费层")
        print(f"     3. 账户被限流")

def generate_recommendations(results: Dict):
    """生成使用建议"""
    print("\n\n💡 使用建议")
    print("=" * 80)
    
    # 分析哪些模型可用
    available_models = {
        "free": [],
        "paid": [],
        "both": []
    }
    
    for key_data in results["free_tier"].values():
        for model, result in key_data["models"].items():
            if result["success"] and model not in available_models["free"]:
                available_models["free"].append(model)
    
    for key_data in results["paid_tier"].values():
        for model, result in key_data["models"].items():
            if result["success"] and model not in available_models["paid"]:
                available_models["paid"].append(model)
    
    both = set(available_models["free"]) & set(available_models["paid"])
    available_models["both"] = list(both)
    
    print("\n1️⃣ 推荐使用免费层Keys:")
    for model in available_models["free"]:
        if model in available_models["both"]:
            print(f"   ✅ {model} (免费层和付费层都可用)")
        else:
            print(f"   🆓 {model} (仅免费层)")
    
    print("\n2️⃣ 付费层Keys状态:")
    if len(available_models["paid"]) == 0:
        print("   ❌ 付费层Keys可能无效或配额用完")
        print("   💡 建议: 专注使用免费层Keys")
    else:
        for model in available_models["paid"]:
            if model not in available_models["both"]:
                print(f"   💰 {model} (仅付费层)")
    
    print("\n3️⃣ 最终建议:")
    print("   • 免费层25个Keys已足够使用")
    print("   • 付费层不建议使用（除非确认配额充足）")
    print("   • 采用保守策略: 10个免费Keys轮换使用")
    print("   • 每Key限制10 RPM，避免触发429")

def main():
    """主函数"""
    # 运行全面测试
    results = comprehensive_test()
    
    # 分析结果
    analyze_results(results)
    
    # 生成建议
    generate_recommendations(results)
    
    print("\n✅ 测试完成! 详细结果已保存到 comprehensive_model_test.json")

if __name__ == "__main__":
    main()
