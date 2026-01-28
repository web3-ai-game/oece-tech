#!/usr/bin/env python3
"""
Gemini Keys最终分组配置
2个路由组长 + 4组工作Keys
"""

import os
import time
import random
import json
from enum import Enum
from typing import Dict, List, Optional
from collections import defaultdict, deque
from datetime import datetime, timedelta
import threading
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class KeyRole(Enum):
    """Key角色定义"""
    ROUTER_LEADER = "router_leader"  # 路由组长
    WORKER = "worker"                 # 工作Key


class WorkGroup(Enum):
    """工作组定义"""
    GROUP_A = "group_a"  # 第1组：6个Keys
    GROUP_B = "group_b"  # 第2组：6个Keys
    GROUP_C = "group_c"  # 第3组：6个Keys
    GROUP_D = "group_d"  # 第4组：5个Keys (23个Keys分4组)


# ========== Keys分组配置 ==========
KEY_GROUPS = {
    # 路由组长 (2个) - 负责请求分发和监控
    KeyRole.ROUTER_LEADER: [
        "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",  # 路由组长1 (响应最快)
        "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",  # 路由组长2
    ],
    
    # 工作组A (6个Keys) - VIP用户专用
    WorkGroup.GROUP_A: [
        "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
        "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
        "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
        "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
        "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
        "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
    ],
    
    # 工作组B (6个Keys) - Premium用户专用
    WorkGroup.GROUP_B: [
        "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
        "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
        "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
        "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
        "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
        "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
    ],
    
    # 工作组C (6个Keys) - 普通用户
    WorkGroup.GROUP_C: [
        "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
        "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
        "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
        "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
        "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
        "AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
    ],
    
    # 工作组D (5个Keys) - 备用/储备
    WorkGroup.GROUP_D: [
        "AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA",
        "AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
        "AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
        "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI",
        "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",
    ],
}

# 之前标记为"付费层"的Keys（实际也是免费层）
FORMER_PAID_KEYS = [
    "AIzaSyCFsMpRhiwm_SMgsJNODRAR86NKDxM6M8c",
    "AIzaSyAt0PUYuIrHN898bGAE1amOsUjP3ogrXiQ",
]


class FinalKeyRouter:
    """最终Key路由系统 - 2路由组长 + 4工作组"""
    
    def __init__(self):
        self.router_leaders = KEY_GROUPS[KeyRole.ROUTER_LEADER]
        self.work_groups = {
            WorkGroup.GROUP_A: KEY_GROUPS[WorkGroup.GROUP_A],
            WorkGroup.GROUP_B: KEY_GROUPS[WorkGroup.GROUP_B],
            WorkGroup.GROUP_C: KEY_GROUPS[WorkGroup.GROUP_C],
            WorkGroup.GROUP_D: KEY_GROUPS[WorkGroup.GROUP_D],
        }
        
        # 配置
        self.config = {
            "router_rpm_limit": 15,      # 路由组长RPM限制（更高）
            "worker_rpm_limit": 10,       # 工作Key RPM限制
            "daily_usage_percent": 30,    # 日配额使用率
            "cooldown_seconds": 10,       # 冷却时间
            "error_threshold": 3,         # 错误阈值
            "blacklist_duration": 60,     # 黑名单时长（分钟）
        }
        
        # 使用追踪
        self.key_usage = defaultdict(lambda: {
            "daily_count": 0,
            "rpm_count": deque(maxlen=60),
            "last_used": None,
            "error_count": 0,
            "blacklisted_until": None,
            "role": None
        })
        
        # 组负载追踪
        self.group_load = defaultdict(lambda: {
            "total_requests": 0,
            "active_keys": 0,
            "avg_response_time": 0,
        })
        
        # 线程锁
        self.lock = threading.Lock()
        self.last_daily_reset = datetime.now()
        
        # 初始化Key角色
        self._initialize_key_roles()
    
    def _initialize_key_roles(self):
        """初始化Key角色"""
        for key in self.router_leaders:
            self.key_usage[key]["role"] = KeyRole.ROUTER_LEADER
        
        for group, keys in self.work_groups.items():
            for key in keys:
                self.key_usage[key]["role"] = group
    
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
            cooldown_end = usage["last_used"] + timedelta(seconds=self.config["cooldown_seconds"])
            if now < cooldown_end:
                return False
        
        # 检查RPM限制
        current_time = time.time()
        while usage["rpm_count"] and current_time - usage["rpm_count"][0] > 60:
            usage["rpm_count"].popleft()
        
        # 路由组长有更高的RPM限制
        role = usage["role"]
        rpm_limit = self.config["router_rpm_limit"] if role == KeyRole.ROUTER_LEADER else self.config["worker_rpm_limit"]
        
        if len(usage["rpm_count"]) >= rpm_limit:
            return False
        
        # 检查日配额 (假设每个Key 200 RPD，30%就是60)
        max_daily = 60
        if usage["daily_count"] >= max_daily:
            return False
        
        return True
    
    def get_router_leader(self) -> Optional[str]:
        """获取路由组长Key"""
        for key in self.router_leaders:
            if self._is_key_available(key):
                return key
        return None
    
    def get_worker_key(self, preferred_group: Optional[WorkGroup] = None) -> Optional[str]:
        """获取工作Key"""
        self._reset_daily_counters()
        
        # 如果指定了偏好组
        if preferred_group and preferred_group in self.work_groups:
            groups_to_try = [preferred_group] + [g for g in WorkGroup if g != preferred_group]
        else:
            # 随机选择组顺序
            groups_to_try = random.sample(list(WorkGroup), len(WorkGroup))
        
        # 尝试从各组获取可用Key
        for group in groups_to_try:
            keys = self.work_groups[group]
            shuffled_keys = random.sample(keys, len(keys))
            
            for key in shuffled_keys:
                if self._is_key_available(key):
                    logger.info(f"选择Key: {key[:20]}... (组: {group.value})")
                    return key
        
        logger.warning("没有可用的工作Keys!")
        return None
    
    def route_request(self, user_tier: str = "normal") -> Dict:
        """路由请求"""
        # 根据用户层级选择组
        group_mapping = {
            "owner": WorkGroup.GROUP_A,
            "vip": WorkGroup.GROUP_A,
            "premium": WorkGroup.GROUP_B,
            "member": WorkGroup.GROUP_C,
            "guest": WorkGroup.GROUP_D,
        }
        
        preferred_group = group_mapping.get(user_tier, WorkGroup.GROUP_C)
        
        # 获取路由组长（用于监控和协调）
        router = self.get_router_leader()
        
        # 获取工作Key
        worker = self.get_worker_key(preferred_group)
        
        if not worker:
            return {"error": "No available keys"}
        
        # 标记使用
        self._mark_key_used(worker)
        if router:
            self._mark_key_used(router, is_router=True)
        
        return {
            "worker_key": worker,
            "router_key": router,
            "group": preferred_group.value,
            "timestamp": datetime.now().isoformat()
        }
    
    def _mark_key_used(self, key: str, success: bool = True, is_router: bool = False):
        """标记Key已使用"""
        with self.lock:
            usage = self.key_usage[key]
            usage["daily_count"] += 1
            usage["rpm_count"].append(time.time())
            usage["last_used"] = datetime.now()
            
            if not success:
                usage["error_count"] += 1
                if usage["error_count"] >= self.config["error_threshold"]:
                    usage["blacklisted_until"] = datetime.now() + timedelta(
                        minutes=self.config["blacklist_duration"]
                    )
                    logger.warning(f"Key {key[:20]}... 已被拉黑")
    
    def get_status(self) -> Dict:
        """获取系统状态"""
        with self.lock:
            status = {
                "timestamp": datetime.now().isoformat(),
                "router_leaders": {
                    "total": len(self.router_leaders),
                    "available": sum(1 for k in self.router_leaders if self._is_key_available(k)),
                    "usage": sum(self.key_usage[k]["daily_count"] for k in self.router_leaders)
                },
                "work_groups": {}
            }
            
            for group in WorkGroup:
                keys = self.work_groups[group]
                status["work_groups"][group.value] = {
                    "total_keys": len(keys),
                    "available_keys": sum(1 for k in keys if self._is_key_available(k)),
                    "total_usage": sum(self.key_usage[k]["daily_count"] for k in keys),
                    "avg_usage_per_key": sum(self.key_usage[k]["daily_count"] for k in keys) / len(keys)
                }
            
            return status
    
    def export_config(self) -> Dict:
        """导出配置供Doppler使用"""
        config = {
            "router_leaders": {},
            "work_groups": {}
        }
        
        # 路由组长
        for i, key in enumerate(self.router_leaders, 1):
            config["router_leaders"][f"GEMINI_ROUTER_LEADER_{i}"] = key
        
        # 工作组
        for group in WorkGroup:
            group_name = group.value.upper()
            for i, key in enumerate(self.work_groups[group], 1):
                config["work_groups"][f"GEMINI_{group_name}_KEY_{i}"] = key
        
        # 元数据
        config["metadata"] = {
            "total_keys": 25,
            "router_leaders": 2,
            "work_groups": 4,
            "group_sizes": {
                "group_a": 6,
                "group_b": 6,
                "group_c": 6,
                "group_d": 5
            }
        }
        
        return config


def demo_routing():
    """演示路由系统"""
    router = FinalKeyRouter()
    
    print("🚀 最终Key路由系统")
    print("=" * 80)
    print(f"📊 配置: 2路由组长 + 4工作组(6/6/6/5 Keys)")
    print()
    
    # 模拟不同用户请求
    test_cases = [
        ("owner", "Owner用户"),
        ("vip", "VIP用户"),
        ("premium", "Premium用户"),
        ("member", "普通会员"),
        ("guest", "游客"),
    ]
    
    print("📋 路由测试:")
    print("-" * 80)
    
    for tier, name in test_cases:
        result = router.route_request(tier)
        if "error" not in result:
            print(f"✅ {name:15s} -> 工作Key: {result['worker_key'][:20]}... (组: {result['group']})")
            if result['router_key']:
                print(f"   {'':15s}    路由器: {result['router_key'][:20]}...")
        else:
            print(f"❌ {name:15s} -> {result['error']}")
        time.sleep(0.5)
    
    # 显示状态
    print("\n📊 系统状态:")
    print("-" * 80)
    status = router.get_status()
    print(json.dumps(status, indent=2))
    
    # 导出配置
    print("\n📝 Doppler配置:")
    print("-" * 80)
    config = router.export_config()
    
    print("\n路由组长:")
    for k, v in config["router_leaders"].items():
        print(f"  {k}={v}")
    
    print("\n工作组A (VIP):")
    for k, v in list(config["work_groups"].items())[:6]:
        if "GROUP_A" in k:
            print(f"  {k}={v}")
    
    print("\n工作组B (Premium):")
    for k, v in list(config["work_groups"].items()):
        if "GROUP_B" in k:
            print(f"  {k}={v}")
    
    print("\n工作组C (普通):")
    for k, v in list(config["work_groups"].items()):
        if "GROUP_C" in k:
            print(f"  {k}={v}")
    
    print("\n工作组D (备用):")
    for k, v in list(config["work_groups"].items()):
        if "GROUP_D" in k:
            print(f"  {k}={v}")
    
    # 保存配置
    with open("final_keys_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ 配置已保存到 final_keys_config.json")


def main():
    """主函数"""
    demo_routing()
    
    # 打印容量估算
    print("\n💪 容量估算:")
    print("-" * 80)
    print("路由组长 (2个): 15 RPM × 2 = 30 RPM (协调)")
    print("工作组A (6个): 10 RPM × 6 = 60 RPM, 360 RPD")
    print("工作组B (6个): 10 RPM × 6 = 60 RPM, 360 RPD")
    print("工作组C (6个): 10 RPM × 6 = 60 RPM, 360 RPD")
    print("工作组D (5个): 10 RPM × 5 = 50 RPM, 300 RPD")
    print()
    print("总工作容量: 230 RPM, 1,380 RPD (保守估计)")
    print("可扩展至: 575 RPM, 4,600 RPD (激进)")


if __name__ == "__main__":
    main()
