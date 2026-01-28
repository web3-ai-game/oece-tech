#!/usr/bin/env python3
"""
温和测试Gemini API Keys账户归属
通过少量请求判断Keys分组，避免触发风控
"""

import time
import requests
import json
from datetime import datetime
from typing import Dict, List, Tuple
import hashlib

# 25个Keys
KEYS = [
    "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
    "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
    "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
    "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",
    "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
    "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
    "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
    "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
    "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
    "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
    "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
    "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
    "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
    "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
    "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
    "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
    "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
    "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
    "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
    "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
    "AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
    "AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA",
    "AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
    "AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
    "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI"
]

def get_key_signature(key: str) -> str:
    """基于Key特征生成签名，用于推测账户"""
    # 分析Key的模式
    # Google API Keys通常格式: AIzaSy[A-Za-z0-9_-]{33}
    # 相同项目的Keys可能有相似的中间部分
    
    # 提取Key的特征部分
    if len(key) > 20:
        # 取中间部分作为特征
        feature = key[10:20]
        return feature
    return key[:10]

def test_key_gently(key: str) -> Dict:
    """温和测试单个Key，只发1个请求"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key={key}"
    
    payload = {
        "contents": [{"parts": [{"text": "Hi"}]}],
        "generationConfig": {"maxOutputTokens": 1, "temperature": 0}
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        
        # 分析响应头获取配额信息
        headers = dict(response.headers)
        
        return {
            "key": key[:20] + "...",
            "status": response.status_code,
            "rate_limit": headers.get('X-RateLimit-Limit', 'unknown'),
            "rate_remaining": headers.get('X-RateLimit-Remaining', 'unknown'),
            "rate_reset": headers.get('X-RateLimit-Reset', 'unknown'),
            "headers": {k: v for k, v in headers.items() if 'rate' in k.lower()},
            "signature": get_key_signature(key)
        }
    except Exception as e:
        return {"key": key[:20] + "...", "error": str(e)}

def analyze_key_patterns():
    """通过Key模式分析可能的账户归属"""
    print("🔍 分析API Keys模式...")
    print("=" * 60)
    
    # 根据Key特征分组
    pattern_groups = {}
    
    for i, key in enumerate(KEYS, 1):
        # 分析Key模式
        sig = get_key_signature(key)
        prefix = key[:10]
        
        # 基于特征分组
        if sig not in pattern_groups:
            pattern_groups[sig] = []
        pattern_groups[sig].append({
            "index": i,
            "key": key,
            "display": key[:20] + "...",
            "prefix": prefix
        })
    
    print(f"\n发现 {len(pattern_groups)} 个不同的Key模式组")
    
    for i, (pattern, keys) in enumerate(pattern_groups.items(), 1):
        print(f"\n模式组 {i} (特征: {pattern}):")
        print(f"  包含 {len(keys)} 个Keys")
        for k in keys[:3]:  # 只显示前3个
            print(f"    - Key #{k['index']}: {k['display']}")
        if len(keys) > 3:
            print(f"    ... 还有 {len(keys)-3} 个Keys")
    
    return pattern_groups

def gentle_test_sample_keys():
    """温和测试样本Keys"""
    print("\n📊 温和测试样本Keys (每5个测1个)")
    print("-" * 60)
    
    results = []
    
    # 只测试样本Keys，避免大量请求
    sample_indices = [0, 4, 9, 14, 19, 24]  # 每5个测1个
    
    for idx in sample_indices:
        if idx < len(KEYS):
            key = KEYS[idx]
            print(f"\n测试Key #{idx+1}: {key[:20]}...")
            
            result = test_key_gently(key)
            results.append(result)
            
            if result.get('status') == 200:
                print(f"  ✅ 成功")
                print(f"  限制: {result.get('rate_limit', 'N/A')}")
                print(f"  剩余: {result.get('rate_remaining', 'N/A')}")
            else:
                print(f"  ❌ 失败: {result.get('error', 'Unknown')}")
            
            time.sleep(2)  # 每个请求间隔2秒
    
    return results

def estimate_account_distribution():
    """基于模式估算账户分布"""
    print("\n\n📈 估算账户分布")
    print("=" * 60)
    
    # 基于Google Cloud的典型限制：
    # - 每个项目通常10个API Keys
    # - 每个账户可以有多个项目
    # - 相似的Key模式可能来自同一项目
    
    # 保守估算
    estimates = [
        {
            "scenario": "最乐观情况",
            "accounts": 25,
            "projects": 25,
            "keys_per_project": 1,
            "total_rpm": 750,  # 25 * 30 RPM
            "total_daily": 5000,  # 25 * 200 RPD
            "risk": "极低"
        },
        {
            "scenario": "中等情况",
            "accounts": 5,
            "projects": 5,
            "keys_per_project": 5,
            "total_rpm": 750,
            "total_daily": 5000,
            "risk": "低"
        },
        {
            "scenario": "保守估计",
            "accounts": 3,
            "projects": 3,
            "keys_per_project": 8,
            "total_rpm": 750,
            "total_daily": 5000,
            "risk": "中"
        },
        {
            "scenario": "最坏情况",
            "accounts": 1,
            "projects": 3,
            "keys_per_project": 8,
            "total_rpm": 240,  # 受限于账户级别
            "total_daily": 1500,
            "risk": "高"
        }
    ]
    
    for est in estimates:
        print(f"\n{est['scenario']}:")
        print(f"  账户数: {est['accounts']}")
        print(f"  项目数: {est['projects']}")
        print(f"  每项目Keys: {est['keys_per_project']}")
        print(f"  总RPM: {est['total_rpm']}")
        print(f"  总日配额: {est['total_daily']}")
        print(f"  风控风险: {est['risk']}")
    
    return estimates

def generate_safe_config():
    """生成安全的使用配置"""
    print("\n\n🛡️ 安全使用建议")
    print("=" * 60)
    
    config = {
        "routing_strategy": {
            "method": "random_weighted",
            "key_groups": [
                {
                    "name": "primary",
                    "keys": KEYS[:5],  # 只用前5个作为主力
                    "weight": 0.6,
                    "max_rpm": 20
                },
                {
                    "name": "secondary",
                    "keys": KEYS[5:10],  # 5-10作为次级
                    "weight": 0.3,
                    "max_rpm": 15
                },
                {
                    "name": "backup",
                    "keys": KEYS[10:15],  # 10-15作为备用
                    "weight": 0.1,
                    "max_rpm": 10
                },
                {
                    "name": "reserve",
                    "keys": KEYS[15:],  # 其余作为储备
                    "weight": 0,
                    "max_rpm": 5
                }
            ]
        },
        "safety_rules": {
            "max_concurrent_keys": 5,
            "key_cooldown_seconds": 10,
            "max_errors_before_blacklist": 3,
            "blacklist_duration_minutes": 60,
            "daily_usage_limit_percent": 30  # 只用30%配额
        },
        "monitoring": {
            "track_429_errors": True,
            "track_response_time": True,
            "alert_on_high_error_rate": 0.1,
            "log_all_requests": False
        }
    }
    
    print("""
推荐的安全策略：

1. **分组使用**
   - 主力组: 5个Keys (60%流量)
   - 次级组: 5个Keys (30%流量)
   - 备用组: 5个Keys (10%流量)
   - 储备组: 10个Keys (应急)

2. **随机轮换**
   - 使用加权随机选择
   - 每次请求换Key
   - 设置10秒冷却时间

3. **配额控制**
   - 每个Key只用30%日配额
   - 监控429错误率
   - 错误超过3次自动拉黑1小时

4. **监控告警**
   - 实时监控错误率
   - 响应时间异常告警
   - 自动降级机制
""")
    
    # 保存配置
    with open("safe_keys_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ 安全配置已保存到 safe_keys_config.json")
    
    return config

def main():
    """主函数"""
    print("🚀 Gemini Keys安全分析")
    print("=" * 60)
    print("⚠️ 使用温和测试，避免触发风控")
    print()
    
    # 1. 分析Key模式
    pattern_groups = analyze_key_patterns()
    
    # 2. 温和测试样本
    test_results = gentle_test_sample_keys()
    
    # 3. 估算账户分布
    estimates = estimate_account_distribution()
    
    # 4. 生成安全配置
    safe_config = generate_safe_config()
    
    # 保存分析结果
    analysis = {
        "timestamp": datetime.now().isoformat(),
        "total_keys": len(KEYS),
        "pattern_groups": len(pattern_groups),
        "test_samples": len(test_results),
        "recommended_usage": {
            "active_keys": 10,  # 建议只激活10个
            "reserve_keys": 15,  # 其余作为储备
            "max_rpm_per_key": 10,  # 每个Key限制10 RPM
            "daily_usage_target": "30%"  # 只用30%配额
        }
    }
    
    with open("keys_safety_analysis.json", "w") as f:
        json.dump(analysis, f, indent=2)
    
    print("\n" + "=" * 60)
    print("📊 分析完成！")
    print(f"• 建议激活使用: 10个Keys")
    print(f"• 储备备用: 15个Keys")
    print(f"• 每Key限制: 10 RPM (安全值)")
    print(f"• 日配额使用: 30% (避免触发限制)")
    print("\n💡 关键建议: 使用随机轮换，避免集中使用！")

if __name__ == "__main__":
    main()
