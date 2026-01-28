#!/usr/bin/env python3
"""
安全的Gemini API Key路由系统
基于风控考虑的保守使用策略
"""

import os
import time
import random
import json
import hashlib
from enum import Enum
from typing import Dict, List, Optional, Tuple
from collections import defaultdict, deque
from datetime import datetime, timedelta
import threading
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class KeyGroup(Enum):
    """Key分组 - 基于风险和使用策略"""
    PRIMARY = "primary"      # 主力组 (5个Keys)
    SECONDARY = "secondary"  # 次级组 (5个Keys)
    BACKUP = "backup"       # 备用组 (5个Keys)
    RESERVE = "reserve"     # 储备组 (10个Keys)


class SafeKeyRouter:
    """安全的Key路由器 - 避免触发风控"""
    
    def __init__(self):
        # 25个Keys分组配置（基于测试结果，每个Key看起来独立）
        self.key_groups = {
            KeyGroup.PRIMARY: [
                "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
                "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
                "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
                "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
                "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs"
            ],
            KeyGroup.SECONDARY: [
                "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
                "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
                "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
                "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
                "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A"
            ],
            KeyGroup.BACKUP: [
                "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
                "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
                "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
                "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
                "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0"
            ],
            KeyGroup.RESERVE: [
                "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
                "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
                "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
                "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
                "AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
                "AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA",
                "AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
                "AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
                "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI",
                "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4"  # 可能无效的Key
            ]
        }
        
        # 安全配置
        self.config = {
            "max_rpm_per_key": 10,           # 每个Key最多10 RPM (保守值)
            "max_daily_percent": 30,          # 只用30%日配额
            "key_cooldown_seconds": 10,      # Key使用后冷却10秒
            "error_threshold": 3,             # 错误3次后拉黑
            "blacklist_duration_minutes": 60, # 黑名单持续60分钟
            "group_weights": {                # 分组权重
                KeyGroup.PRIMARY: 0.6,
                KeyGroup.SECONDARY: 0.3,
                KeyGroup.BACKUP: 0.1,
                KeyGroup.RESERVE: 0.0  # 储备组默认不用
            }
        }
        
        # 使用追踪
        self.key_usage = defaultdict(lambda: {
            "daily_count": 0,
            "rpm_count": deque(maxlen=60),  # 最近60秒的请求时间
            "last_used": None,
            "error_count": 0,
            "blacklisted_until": None
        })
        
        # 线程锁
        self.lock = threading.Lock()
        
        # 上次重置时间
        self.last_daily_reset = datetime.now()
        
    def _reset_daily_counters(self):
        """重置日计数器"""
        now = datetime.now()
        if now.date() > self.last_daily_reset.date():
            with self.lock:
                for key_data in self.key_usage.values():
                    key_data["daily_count"] = 0
                    key_data["error_count"] = 0
                self.last_daily_reset = now
                logger.info("已重置日计数器")
    
    def _is_key_available(self, key: str) -> bool:
        """检查Key是否可用"""
        usage = self.key_usage[key]
        now = datetime.now()
        
        # 检查黑名单
        if usage["blacklisted_until"] and now < usage["blacklisted_until"]:
            return False
        
        # 检查冷却时间
        if usage["last_used"]:
            cooldown_end = usage["last_used"] + timedelta(seconds=self.config["key_cooldown_seconds"])
            if now < cooldown_end:
                return False
        
        # 检查RPM限制
        current_time = time.time()
        # 清理60秒前的记录
        while usage["rpm_count"] and current_time - usage["rpm_count"][0] > 60:
            usage["rpm_count"].popleft()
        
        if len(usage["rpm_count"]) >= self.config["max_rpm_per_key"]:
            return False
        
        # 检查日配额 (假设每个Key 200 RPD，30%就是60)
        max_daily = 60  # 200 * 0.3
        if usage["daily_count"] >= max_daily:
            return False
        
        return True
    
    def _mark_key_used(self, key: str, success: bool = True):
        """标记Key已使用"""
        with self.lock:
            usage = self.key_usage[key]
            usage["daily_count"] += 1
            usage["rpm_count"].append(time.time())
            usage["last_used"] = datetime.now()
            
            if not success:
                usage["error_count"] += 1
                if usage["error_count"] >= self.config["error_threshold"]:
                    # 拉黑Key
                    usage["blacklisted_until"] = datetime.now() + timedelta(
                        minutes=self.config["blacklist_duration_minutes"]
                    )
                    logger.warning(f"Key {key[:20]}... 已被拉黑至 {usage['blacklisted_until']}")
    
    def get_random_key(self, prefer_group: Optional[KeyGroup] = None) -> Optional[str]:
        """获取随机Key（加权随机选择）"""
        self._reset_daily_counters()
        
        # 如果指定了偏好组
        if prefer_group:
            groups_to_try = [prefer_group] + [g for g in KeyGroup if g != prefer_group]
        else:
            # 按权重随机选择组
            groups_to_try = self._weighted_shuffle()
        
        # 尝试从各组获取可用Key
        for group in groups_to_try:
            keys = self.key_groups[group]
            # 随机打乱Keys顺序
            shuffled_keys = random.sample(keys, len(keys))
            
            for key in shuffled_keys:
                if self._is_key_available(key):
                    logger.info(f"选择Key: {key[:20]}... (组: {group.value})")
                    return key
        
        logger.warning("没有可用的Keys!")
        return None
    
    def _weighted_shuffle(self) -> List[KeyGroup]:
        """按权重返回组的顺序"""
        groups = list(KeyGroup)
        weights = [self.config["group_weights"][g] for g in groups]
        
        # 加权随机排序
        result = []
        remaining = groups.copy()
        remaining_weights = weights.copy()
        
        while remaining:
            if sum(remaining_weights) == 0:
                # 如果所有权重都是0，随机选择
                result.extend(random.sample(remaining, len(remaining)))
                break
            
            # 加权随机选择
            chosen = random.choices(remaining, weights=remaining_weights)[0]
            idx = remaining.index(chosen)
            result.append(chosen)
            remaining.pop(idx)
            remaining_weights.pop(idx)
        
        return result
    
    def report_success(self, key: str):
        """报告成功使用"""
        self._mark_key_used(key, success=True)
    
    def report_error(self, key: str):
        """报告使用错误"""
        self._mark_key_used(key, success=False)
    
    def get_status(self) -> Dict:
        """获取当前状态"""
        with self.lock:
            status = {
                "timestamp": datetime.now().isoformat(),
                "groups": {}
            }
            
            for group in KeyGroup:
                keys = self.key_groups[group]
                available = sum(1 for k in keys if self._is_key_available(k))
                total_usage = sum(self.key_usage[k]["daily_count"] for k in keys)
                
                status["groups"][group.value] = {
                    "total_keys": len(keys),
                    "available_keys": available,
                    "total_daily_usage": total_usage,
                    "weight": self.config["group_weights"][group]
                }
            
            # 黑名单Keys
            blacklisted = []
            for key, usage in self.key_usage.items():
                if usage["blacklisted_until"] and datetime.now() < usage["blacklisted_until"]:
                    blacklisted.append({
                        "key": key[:20] + "...",
                        "until": usage["blacklisted_until"].isoformat()
                    })
            
            status["blacklisted_keys"] = blacklisted
            
            return status
    
    def activate_reserve(self, activate: bool = True):
        """激活或停用储备组"""
        self.config["group_weights"][KeyGroup.RESERVE] = 0.1 if activate else 0.0
        logger.info(f"储备组已{'激活' if activate else '停用'}")


# ========== 使用示例 ==========
def demo_safe_routing():
    """演示安全路由"""
    router = SafeKeyRouter()
    
    print("🛡️ 安全Key路由系统")
    print("=" * 60)
    
    # 模拟请求
    print("\n模拟10个请求:")
    print("-" * 40)
    
    for i in range(10):
        key = router.get_random_key()
        if key:
            print(f"请求 {i+1}: 获得Key {key[:20]}...")
            
            # 模拟成功或失败
            if random.random() > 0.1:  # 90%成功率
                router.report_success(key)
                print("  ✅ 成功")
            else:
                router.report_error(key)
                print("  ❌ 失败")
        else:
            print(f"请求 {i+1}: ❌ 无可用Key")
        
        time.sleep(1)  # 模拟请求间隔
    
    # 显示状态
    print("\n📊 当前状态:")
    print("-" * 40)
    status = router.get_status()
    print(json.dumps(status, indent=2, default=str))
    
    # 容量计算
    print("\n💪 安全容量估算:")
    print("-" * 40)
    print("激活Keys: 10个 (主力+次级组)")
    print("每Key限制: 10 RPM, 60 RPD (30%配额)")
    print("总容量: 100 RPM, 600 RPD")
    print("储备Keys: 15个 (应急使用)")
    print("\n⚠️ 这是保守估计，实际可根据使用情况调整")


def main():
    """主函数"""
    # 运行演示
    demo_safe_routing()
    
    # 保存配置
    config = {
        "strategy": "conservative",
        "active_keys": 10,
        "reserve_keys": 15,
        "safety_rules": {
            "max_rpm_per_key": 10,
            "daily_usage_percent": 30,
            "key_cooldown": 10,
            "random_selection": True,
            "weighted_groups": True
        },
        "estimated_capacity": {
            "safe_rpm": 100,
            "safe_daily": 600,
            "max_rpm": 250,
            "max_daily": 2000
        }
    }
    
    with open("safe_routing_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ 安全配置已保存到 safe_routing_config.json")


if __name__ == "__main__":
    main()
