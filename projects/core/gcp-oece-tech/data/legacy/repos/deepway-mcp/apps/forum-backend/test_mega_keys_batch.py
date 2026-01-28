#!/usr/bin/env python3
"""
Gemini API Keys超级批量测试器
测试所有提供的Keys并智能分类
"""

import os
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Tuple
from datetime import datetime
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ========== 待测试的Keys ==========
TEST_KEYS = [
    # 第一批 - 可能包含付费层
    "AIzaSyDMzpEWY3kbgkZVpNpcipIsNg6xinQsvAs",
    "AIzaSyAWXpDiRsyELoVB5VNpHuGevufpurQTMwg", 
    "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
    "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
    "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
    "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
    "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
    
    # 绝对可用的免费层
    "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
    "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
    
    # 其他Keys (去掉无效字符)
    "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",  # 可能无效
    "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
    "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
    "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
    "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
    "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
    "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
    "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
    "AIzaSyDDDwu7zjqSxe1vhLVjC3NKBG7rGyLvsf0",
    "AIzaSyAk63C9pVrXpKcvlDeKdp9tu10oFPz0oJA",
    "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
    "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
    "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
    "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
    "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
    "AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
    "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI",
    "AIzaSyAoNfDauSWld1lWlWIRi3D8Yj_ur8T9n6M",
    "AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
    "AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
    "AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA"
]

# ========== 模型配额信息 (免费层) ==========
FREE_TIER_MODELS = {
    # 文本生成模型
    "gemini-2.0-flash": {"rpm": 15, "tpm": 1000000, "rpd": 200, "type": "text"},
    "gemini-2.0-flash-lite": {"rpm": 30, "tpm": 1000000, "rpd": 200, "type": "text"},
    "gemini-2.0-flash-exp": {"rpm": 10, "tpm": 250000, "rpd": 500, "type": "text"},
    "gemini-2.5-flash": {"rpm": 10, "tpm": 250000, "rpd": 250, "type": "text"},
    "gemini-2.5-flash-lite": {"rpm": 15, "tpm": 250000, "rpd": 1000, "type": "text"},
    "gemini-2.5-pro": {"rpm": 2, "tpm": 125000, "rpd": 50, "type": "text"},
    
    # 多模态模型
    "gemini-2.0-flash-preview-image-generation": {"rpm": 10, "tpm": 200000, "rpd": 100, "type": "image"},
    "gemini-2.5-flash-tts": {"rpm": 3, "tpm": 10000, "rpd": 15, "type": "tts"},
    "gemini-2.5-pro-tts": {"rpm": 10, "tpm": 10000, "rpd": 50, "type": "tts"},
    
    # 实验模型
    "learnim-2.0-flash-experimental": {"rpm": 15, "tpm": None, "rpd": 1500, "type": "experimental"}
}

# ========== 模型配额信息 (付费层) ==========
PAID_TIER_MODELS = {
    "gemini-2.0-flash": {"rpm": 1000, "tpm": 1000000, "rpd": 200, "type": "text"},
    "gemini-2.0-flash-lite": {"rpm": 1000, "tpm": 1000000, "rpd": 200, "type": "text"},
    "gemini-2.5-flash": {"rpm": 1000, "tpm": 250000, "rpd": 250, "type": "text"},
    "gemini-2.5-pro": {"rpm": 10, "tpm": 250000, "rpd": 50, "type": "text"}
}

def test_key(key: str) -> Dict:
    """测试单个Key"""
    result = {
        "key": key,
        "valid": False,
        "tier": "unknown",
        "models_available": [],
        "response_time": None,
        "error": None
    }
    
    # 测试基础模型来判断层级
    test_models = [
        ("gemini-2.0-flash-lite", "text"),
        ("gemini-2.5-flash", "text"),
        ("gemini-2.5-pro", "text")
    ]
    
    for model, model_type in test_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": "Hi"}]
            }],
            "generationConfig": {
                "maxOutputTokens": 10,
                "temperature": 0
            }
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, json=payload, timeout=5)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                result["valid"] = True
                result["models_available"].append(model)
                if not result["response_time"]:
                    result["response_time"] = round(elapsed, 2)
                
                # 通过响应头判断层级
                rate_limit = response.headers.get('X-RateLimit-Limit', '')
                if '1000' in rate_limit or '100' in rate_limit:
                    result["tier"] = "paid"
                else:
                    result["tier"] = "free"
                    
            elif response.status_code == 403:
                # Key无效或无权限
                result["error"] = "Invalid or no permission"
                break
                
        except requests.Timeout:
            result["error"] = "Timeout"
        except Exception as e:
            result["error"] = str(e)
    
    return result

def test_all_keys():
    """测试所有Keys"""
    print("🚀 开始批量测试 Gemini API Keys")
    print("=" * 60)
    
    results = []
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(test_key, key): key for key in TEST_KEYS}
        
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            # 实时显示进度
            print(f"  测试 {result['key'][:20]}... {'✅' if result['valid'] else '❌'}")
    
    # 分类结果
    free_keys = []
    paid_keys = []
    invalid_keys = []
    
    for result in results:
        if result["valid"]:
            if result["tier"] == "free":
                free_keys.append(result)
            else:
                paid_keys.append(result)
        else:
            invalid_keys.append(result)
    
    return free_keys, paid_keys, invalid_keys

def generate_doppler_config(free_keys: List[Dict], paid_keys: List[Dict]):
    """生成Doppler配置"""
    print("\n📋 Doppler环境变量配置")
    print("=" * 60)
    
    # 免费层Keys
    print("\n# ========== 免费层Keys池 ==========")
    for i, key_info in enumerate(free_keys, 1):
        print(f"GEMINI_KEY_FREE_{i}={key_info['key']}")
        print(f"# 响应时间: {key_info['response_time']}s, 可用模型: {', '.join(key_info['models_available'])}")
    
    # 付费层Keys
    if paid_keys:
        print("\n# ========== 付费层Keys池 ==========")
        for i, key_info in enumerate(paid_keys, 1):
            print(f"GEMINI_KEY_PAID_{i}={key_info['key']}")
            print(f"# 响应时间: {key_info['response_time']}s, 可用模型: {', '.join(key_info['models_available'])}")
    
    # 元数据
    print("\n# ========== 配置元数据 ==========")
    print(f"KEY_FREE_POOL_SIZE={len(free_keys)}")
    print(f"KEY_PAID_POOL_SIZE={len(paid_keys)}")
    print("KEY_ROTATION_ENABLED=true")

def calculate_capacity(num_free_keys: int, num_paid_keys: int):
    """计算总容量"""
    print("\n📊 容量计算")
    print("=" * 60)
    
    # 免费层容量
    print("\n🆓 免费层容量 (假设均匀使用所有模型):")
    for model, limits in FREE_TIER_MODELS.items():
        if limits["type"] == "text":
            total_rpm = limits["rpm"] * num_free_keys
            total_rpd = limits["rpd"] * num_free_keys
            print(f"  {model}:")
            print(f"    - 总RPM: {total_rpm} 请求/分钟")
            print(f"    - 总RPD: {total_rpd} 请求/天")
    
    # 特殊推荐
    print("\n⭐ 推荐配置:")
    print(f"  gemini-2.0-flash-lite (最高RPM):")
    print(f"    - 单Key: 30 RPM, 200 RPD")
    print(f"    - {num_free_keys}个Keys: {30*num_free_keys} RPM, {200*num_free_keys} RPD")
    
    print(f"\n  gemini-2.5-flash-lite (最高RPD):")
    print(f"    - 单Key: 15 RPM, 1000 RPD")
    print(f"    - {num_free_keys}个Keys: {15*num_free_keys} RPM, {1000*num_free_keys} RPD")
    
    print(f"\n  gemini-2.5-pro (最强能力):")
    print(f"    - 单Key: 2 RPM, 50 RPD")
    print(f"    - {num_free_keys}个Keys: {2*num_free_keys} RPM, {50*num_free_keys} RPD")

def design_routing_strategy(num_free_keys: int):
    """设计路由策略"""
    print("\n🔄 智能路由策略")
    print("=" * 60)
    
    print("""
用户分级与模型分配:

1️⃣ **Owner专属** (你):
   - 模型: gemini-2.5-pro (最强)
   - Keys分配: 2个专用Keys
   - RPM: 4 (2×2)
   - RPD: 100 (50×2)
   - 特权: 10轮对话记忆, 图像生成, TTS

2️⃣ **VIP用户**:
   - 模型: gemini-2.5-flash
   - Keys分配: 3个Keys轮换
   - RPM: 30 (10×3)
   - RPD: 750 (250×3)
   - 特权: 5轮对话记忆

3️⃣ **普通用户**:
   - 模型: gemini-2.0-flash-lite (高速)
   - Keys分配: 剩余Keys池
   - RPM: 30×剩余Keys数
   - RPD: 200×剩余Keys数
   - 特权: 1轮对话记忆

4️⃣ **图像生成服务**:
   - 模型: gemini-2.0-flash-preview-image-generation
   - 专用Keys: 2个
   - RPM: 20 (10×2)
   - RPD: 200 (100×2)
   
5️⃣ **TTS服务**:
   - 模型: gemini-2.5-flash-tts
   - 专用Keys: 1个
   - RPM: 3
   - RPD: 15
""")

def main():
    """主函数"""
    # 测试所有Keys
    free_keys, paid_keys, invalid_keys = test_all_keys()
    
    # 显示结果
    print(f"\n✅ 有效免费层Keys: {len(free_keys)}")
    for key in free_keys:
        print(f"  - {key['key'][:20]}... (响应: {key['response_time']}s)")
    
    print(f"\n💰 有效付费层Keys: {len(paid_keys)}")
    for key in paid_keys:
        print(f"  - {key['key'][:20]}... (响应: {key['response_time']}s)")
    
    print(f"\n❌ 无效Keys: {len(invalid_keys)}")
    for key in invalid_keys:
        print(f"  - {key['key'][:20]}... (错误: {key['error']})")
    
    # 生成配置
    generate_doppler_config(free_keys, paid_keys)
    
    # 计算容量
    calculate_capacity(len(free_keys), len(paid_keys))
    
    # 设计路由策略
    design_routing_strategy(len(free_keys))
    
    # 保存结果
    with open("keys_test_result.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "free_keys": free_keys,
            "paid_keys": paid_keys,
            "invalid_keys": invalid_keys,
            "summary": {
                "total_tested": len(TEST_KEYS),
                "free_valid": len(free_keys),
                "paid_valid": len(paid_keys),
                "invalid": len(invalid_keys)
            }
        }, f, indent=2)
    
    print("\n✅ 测试完成! 结果已保存到 keys_test_result.json")

if __name__ == "__main__":
    main()
