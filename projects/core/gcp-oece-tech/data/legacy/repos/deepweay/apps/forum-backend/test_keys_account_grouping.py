#!/usr/bin/env python3
"""
测试Gemini API Keys的账户归属
通过并发RPM测试判断哪些Keys属于同一账户
"""

import time
import requests
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict
from typing import Dict, List, Set
import json
from datetime import datetime

# 25个待测试的Keys
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

def make_request(key: str, request_id: int) -> Dict:
    """发送单个请求并记录结果"""
    model = "gemini-2.0-flash-lite"  # 使用RPM限制高的模型 (30 RPM)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": f"Test {request_id}"}]
        }],
        "generationConfig": {
            "maxOutputTokens": 1,
            "temperature": 0
        }
    }
    
    try:
        start = time.time()
        response = requests.post(url, json=payload, timeout=5)
        elapsed = time.time() - start
        
        return {
            "key": key[:20] + "...",
            "request_id": request_id,
            "status": response.status_code,
            "elapsed": round(elapsed, 2),
            "timestamp": time.time(),
            "error": None if response.status_code == 200 else response.text[:100]
        }
    except Exception as e:
        return {
            "key": key[:20] + "...",
            "request_id": request_id,
            "status": -1,
            "elapsed": 0,
            "timestamp": time.time(),
            "error": str(e)
        }

def test_concurrent_rpm(key1: str, key2: str, num_requests: int = 10) -> bool:
    """
    测试两个Keys是否共享RPM限制
    如果共享限制，说明属于同一账户
    """
    print(f"\n测试Keys并发: {key1[:15]}... vs {key2[:15]}...")
    
    results = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        # 同时发送多个请求
        futures = []
        for i in range(num_requests):
            futures.append(executor.submit(make_request, key1, i))
            futures.append(executor.submit(make_request, key2, i + 100))
        
        for future in as_completed(futures):
            results.append(future.result())
    
    # 分析结果
    key1_results = [r for r in results if key1[:20] in r["key"]]
    key2_results = [r for r in results if key2[:20] in r["key"]]
    
    key1_errors = sum(1 for r in key1_results if r["status"] != 200)
    key2_errors = sum(1 for r in key2_results if r["status"] != 200)
    
    # 如果两个Keys都出现大量429错误，可能共享限制
    if key1_errors > 3 and key2_errors > 3:
        print(f"  ⚠️ 可能共享限制: Key1错误{key1_errors}, Key2错误{key2_errors}")
        return True
    else:
        print(f"  ✅ 独立限制: Key1错误{key1_errors}, Key2错误{key2_errors}")
        return False

def test_single_key_rpm(key: str, num_requests: int = 35) -> int:
    """测试单个Key的实际RPM限制"""
    print(f"\n测试单Key RPM: {key[:20]}...")
    
    success_count = 0
    error_count = 0
    
    # 在60秒内快速发送请求
    start_time = time.time()
    for i in range(num_requests):
        if time.time() - start_time > 60:
            break
            
        result = make_request(key, i)
        if result["status"] == 200:
            success_count += 1
        else:
            error_count += 1
            if error_count > 5:  # 连续错误太多就停止
                break
        
        # 稍微延迟避免太激进
        time.sleep(0.5)
    
    elapsed = time.time() - start_time
    actual_rpm = int((success_count / elapsed) * 60)
    
    print(f"  成功: {success_count}, 失败: {error_count}, 实际RPM: {actual_rpm}")
    return actual_rpm

def group_keys_by_account():
    """通过RPM测试将Keys分组到不同账户"""
    print("🔍 开始测试Keys账户归属...")
    print("=" * 60)
    
    # Step 1: 测试每个Key的独立RPM
    key_rpm = {}
    print("\n📊 Step 1: 测试每个Key的独立RPM限制")
    print("-" * 60)
    
    for i, key in enumerate(KEYS[:10], 1):  # 先测试前10个避免太激进
        print(f"\n[{i}/10] 测试Key: {key[:20]}...")
        rpm = test_single_key_rpm(key, num_requests=20)
        key_rpm[key] = rpm
        time.sleep(2)  # 每个Key之间暂停
    
    # Step 2: 测试Keys之间是否共享限制
    print("\n\n📊 Step 2: 测试Keys之间的并发限制")
    print("-" * 60)
    
    account_groups = []
    tested_pairs = set()
    
    # 测试一些Key对
    test_pairs = [
        (0, 1),   # 测试前两个
        (0, 5),   # 测试第1个和第6个
        (0, 10),  # 测试第1个和第11个
        (5, 6),   # 测试相邻的
        (10, 11), # 测试另一组相邻的
        (0, 24),  # 测试首尾
    ]
    
    shared_groups = defaultdict(set)
    
    for i, j in test_pairs:
        if i < len(KEYS) and j < len(KEYS):
            key1, key2 = KEYS[i], KEYS[j]
            if (key1, key2) not in tested_pairs and (key2, key1) not in tested_pairs:
                is_shared = test_concurrent_rpm(key1, key2, num_requests=15)
                tested_pairs.add((key1, key2))
                
                if is_shared:
                    # 找到共享限制的Keys
                    shared_groups[key1].add(key2)
                    shared_groups[key2].add(key1)
                
                time.sleep(3)  # 避免太激进
    
    # Step 3: 基于测试结果推断分组
    print("\n\n📊 Step 3: 分析结果并分组")
    print("-" * 60)
    
    # 基于共享关系构建账户组
    visited = set()
    final_groups = []
    
    for key in KEYS:
        if key not in visited:
            group = {key}
            if key in shared_groups:
                group.update(shared_groups[key])
            final_groups.append(list(group))
            visited.update(group)
    
    return final_groups, key_rpm

def estimate_account_limits(groups: List[List[str]], key_rpm: Dict[str, int]):
    """估算每个账户的限额"""
    print("\n📈 账户限额估算")
    print("=" * 60)
    
    account_info = []
    
    for i, group in enumerate(groups, 1):
        # 估算账户限额
        avg_rpm = sum(key_rpm.get(k, 30) for k in group if k in key_rpm) / len([k for k in group if k in key_rpm])
        
        info = {
            "account_id": f"Account_{i}",
            "keys_count": len(group),
            "keys": [k[:20] + "..." for k in group],
            "estimated_rpm": int(avg_rpm * len(group)),
            "estimated_daily": int(avg_rpm * len(group) * 60 * 24 / 100),  # 假设10%使用率
            "risk_level": "高" if len(group) > 10 else "中" if len(group) > 5 else "低"
        }
        account_info.append(info)
        
        print(f"\n账户 {i}:")
        print(f"  Keys数量: {info['keys_count']}")
        print(f"  预估RPM: {info['estimated_rpm']}")
        print(f"  预估日限额: {info['estimated_daily']}")
        print(f"  风险等级: {info['risk_level']}")
        print(f"  Keys: {', '.join(info['keys'][:3])}...")
    
    return account_info

def generate_safe_routing_strategy(account_info: List[Dict]):
    """生成安全的路由策略"""
    print("\n\n🛡️ 安全路由策略建议")
    print("=" * 60)
    
    print("""
1. **随机轮换策略**
   - 每个请求随机选择不同账户的Key
   - 避免单账户连续使用
   - 设置账户级别的冷却时间

2. **负载均衡策略**
   - 追踪每个账户的使用率
   - 优先使用负载低的账户
   - 设置账户日限额阈值 (建议50%)

3. **风险控制**
   - 高风险账户(>10 Keys): 限制使用频率
   - 中风险账户(5-10 Keys): 正常使用
   - 低风险账户(<5 Keys): 可作为主力

4. **监控告警**
   - 实时监控429错误率
   - 单账户错误率>10%时自动降级
   - 设置账户黑名单机制
    """)

def main():
    """主函数"""
    print("🚀 Gemini Keys账户归属测试")
    print("=" * 60)
    print("⚠️ 注意: 测试会消耗一定配额，建议在低峰期运行")
    print()
    
    # 分组Keys
    groups, key_rpm = group_keys_by_account()
    
    # 估算账户限额
    account_info = estimate_account_limits(groups, key_rpm)
    
    # 生成安全策略
    generate_safe_routing_strategy(account_info)
    
    # 保存结果
    result = {
        "timestamp": datetime.now().isoformat(),
        "total_keys": len(KEYS),
        "estimated_accounts": len(groups),
        "account_details": account_info,
        "key_rpm_tests": {k[:20] + "...": v for k, v in key_rpm.items()},
        "recommendations": {
            "use_random_selection": True,
            "max_keys_per_account": 5,
            "account_cooldown_seconds": 10,
            "max_account_usage_percent": 50
        }
    }
    
    with open("keys_account_analysis.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print("\n✅ 分析完成! 结果已保存到 keys_account_analysis.json")
    
    # 生成安全的配置
    print("\n📝 推荐的安全配置:")
    print("-" * 60)
    print(f"• 预估账户数: {len(groups)}")
    print(f"• 建议同时使用: {min(5, len(groups))} 个账户")
    print(f"• 每账户使用上限: 50% 日配额")
    print(f"• Key轮换间隔: 10秒")
    print(f"• 避免单账户超过5个Keys同时使用")

if __name__ == "__main__":
    main()
