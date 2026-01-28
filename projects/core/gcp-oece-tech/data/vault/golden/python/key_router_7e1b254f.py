#!/usr/bin/env python3
"""
Gemini API Keys智能路由系统
分布式直连架构实现
"""

import os
import time
import random
import logging
from enum import Enum
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
import json
import asyncio
from dataclasses import dataclass

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class UserTier(Enum):
    """用户层级定义"""
    OWNER = 5
    VIP = 4
    PREMIUM = 3
    MEMBER = 2
    GUEST = 1


@dataclass
class KeyPerformance:
    """Key性能数据"""
    key_id: str
    avg_response_time: float
    tier: str  # S/A/B/C
    daily_limit: int = 1500
    rpm_limit: int = 15


class KeyRouter:
    """分布式直连Key路由器"""
    
    def __init__(self):
        self.keys = self._initialize_keys()
        self.key_allocation = self._setup_allocation()
        self.usage_tracker = defaultdict(lambda: {"daily": 0, "rpm": []})
        self.last_reset = datetime.now()
        
    def _initialize_keys(self) -> Dict[str, KeyPerformance]:
        """初始化Keys性能数据"""
        return {
            "FREE_1": KeyPerformance("FREE_1", 0.78, "A"),
            "FREE_2": KeyPerformance("FREE_2", 0.86, "B"),
            "FREE_3": KeyPerformance("FREE_3", 0.93, "C"),
            "FREE_4": KeyPerformance("FREE_4", 0.88, "C"),
            "FREE_5": KeyPerformance("FREE_5", 0.92, "C"),
            "FREE_6": KeyPerformance("FREE_6", 0.71, "S"),  # 最快
            "FREE_7": KeyPerformance("FREE_7", 0.83, "B"),
            "FREE_8": KeyPerformance("FREE_8", 0.96, "C"),
            "FREE_9": KeyPerformance("FREE_9", 0.83, "A"),
            "FREE_10": KeyPerformance("FREE_10", 0.90, "C"),
        }
    
    def _setup_allocation(self) -> Dict[UserTier, Dict]:
        """设置用户层级的Key分配策略"""
        return {
            UserTier.OWNER: {
                "primary": ["FREE_6"],  # S级专用
                "backup": ["FREE_1"],   # A级备用
                "daily_limit": 2000,
                "rpm_limit": 30,
                "memory_rounds": 10,
                "model": "gemini-2.0-flash"
            },
            UserTier.VIP: {
                "primary": ["FREE_1", "FREE_9"],
                "backup": ["FREE_7"],
                "daily_limit": 1000,
                "rpm_limit": 20,
                "memory_rounds": 5,
                "model": "gemini-2.0-flash"
            },
            UserTier.PREMIUM: {
                "primary": ["FREE_7", "FREE_2"],
                "backup": ["FREE_3"],
                "daily_limit": 500,
                "rpm_limit": 10,
                "memory_rounds": 3,
                "model": "gemini-2.0-flash-lite"
            },
            UserTier.MEMBER: {
                "primary": ["FREE_3", "FREE_4", "FREE_5"],
                "backup": ["FREE_8"],
                "daily_limit": 100,
                "rpm_limit": 5,
                "memory_rounds": 1,
                "model": "gemini-2.0-flash-lite"
            },
            UserTier.GUEST: {
                "primary": ["FREE_8", "FREE_10"],
                "backup": [],
                "daily_limit": 10,
                "rpm_limit": 2,
                "memory_rounds": 0,
                "model": "gemini-2.0-flash-lite"
            }
        }
    
    def _reset_daily_usage(self):
        """重置日使用量"""
        now = datetime.now()
        if now.date() > self.last_reset.date():
            logger.info("重置日使用量统计")
            for key in self.usage_tracker:
                self.usage_tracker[key]["daily"] = 0
            self.last_reset = now
    
    def _clean_rpm_tracker(self, key_id: str):
        """清理超过1分钟的RPM记录"""
        now = time.time()
        self.usage_tracker[key_id]["rpm"] = [
            t for t in self.usage_tracker[key_id]["rpm"]
            if now - t < 60
        ]
    
    def _is_key_available(self, key_id: str, rpm_limit: int) -> bool:
        """检查Key是否可用"""
        # 检查日限额
        if self.usage_tracker[key_id]["daily"] >= self.keys[key_id].daily_limit:
            return False
        
        # 检查RPM限制
        self._clean_rpm_tracker(key_id)
        if len(self.usage_tracker[key_id]["rpm"]) >= min(rpm_limit, 15):
            return False
        
        return True
    
    def get_optimal_key(self, user_id: str, user_tier: UserTier) -> Optional[str]:
        """获取最优Key"""
        self._reset_daily_usage()
        
        allocation = self.key_allocation[user_tier]
        
        # 尝试主Keys
        available_keys = [
            key for key in allocation["primary"]
            if self._is_key_available(key, allocation["rpm_limit"])
        ]
        
        # 如果主Keys不可用，尝试备用Keys
        if not available_keys and allocation["backup"]:
            available_keys = [
                key for key in allocation["backup"]
                if self._is_key_available(key, allocation["rpm_limit"])
            ]
        
        if not available_keys:
            logger.warning(f"用户 {user_id} (层级: {user_tier.name}) 无可用Keys")
            return None
        
        # 选择负载最低的Key
        selected = min(
            available_keys,
            key=lambda k: self.usage_tracker[k]["daily"]
        )
        
        # 更新使用统计
        self.usage_tracker[selected]["daily"] += 1
        self.usage_tracker[selected]["rpm"].append(time.time())
        
        logger.info(
            f"分配Key {selected} 给用户 {user_id} "
            f"(层级: {user_tier.name}, "
            f"日使用: {self.usage_tracker[selected]['daily']}/{self.keys[selected].daily_limit})"
        )
        
        return selected
    
    def get_metrics(self) -> Dict:
        """获取监控指标"""
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "keys": {},
            "tiers": defaultdict(lambda: {"requests": 0, "keys_used": set()})
        }
        
        for key_id, usage in self.usage_tracker.items():
            self._clean_rpm_tracker(key_id)
            metrics["keys"][key_id] = {
                "daily_usage": usage["daily"],
                "daily_limit": self.keys[key_id].daily_limit,
                "usage_percent": (usage["daily"] / self.keys[key_id].daily_limit) * 100,
                "current_rpm": len(usage["rpm"]),
                "performance_tier": self.keys[key_id].tier,
                "avg_response_time": self.keys[key_id].avg_response_time
            }
        
        return metrics
    
    def export_prometheus_metrics(self) -> str:
        """导出Prometheus格式的指标"""
        metrics = self.get_metrics()
        lines = []
        
        # Key使用量
        for key_id, data in metrics["keys"].items():
            lines.append(f'gemini_key_daily_usage{{key="{key_id}"}} {data["daily_usage"]}')
            lines.append(f'gemini_key_usage_percent{{key="{key_id}"}} {data["usage_percent"]:.2f}')
            lines.append(f'gemini_key_current_rpm{{key="{key_id}"}} {data["current_rpm"]}')
        
        return "\n".join(lines)


class LoadBalancer:
    """负载均衡器 - 管理多个路由器实例"""
    
    def __init__(self, num_instances: int = 3):
        self.routers = [KeyRouter() for _ in range(num_instances)]
        self.current_router = 0
        
    def get_router(self) -> KeyRouter:
        """轮询获取路由器实例"""
        router = self.routers[self.current_router]
        self.current_router = (self.current_router + 1) % len(self.routers)
        return router
    
    def route_request(self, user_id: str, user_tier: UserTier) -> Optional[str]:
        """路由请求到合适的Key"""
        router = self.get_router()
        return router.get_optimal_key(user_id, user_tier)


async def simulate_usage():
    """模拟使用场景"""
    router = KeyRouter()
    
    # 模拟不同层级用户
    test_users = [
        ("owner_001", UserTier.OWNER),
        ("vip_001", UserTier.VIP),
        ("vip_002", UserTier.VIP),
        ("premium_001", UserTier.PREMIUM),
        ("member_001", UserTier.MEMBER),
        ("member_002", UserTier.MEMBER),
        ("guest_001", UserTier.GUEST),
    ]
    
    # 模拟100次请求
    for i in range(100):
        user_id, tier = random.choice(test_users)
        key = router.get_optimal_key(user_id, tier)
        
        if key:
            print(f"✅ 请求 {i+1}: {user_id} ({tier.name}) -> {key}")
        else:
            print(f"❌ 请求 {i+1}: {user_id} ({tier.name}) -> 无可用Key")
        
        # 随机延迟
        await asyncio.sleep(random.uniform(0.1, 0.5))
        
        # 每20次请求输出一次指标
        if (i + 1) % 20 == 0:
            print("\n📊 当前指标:")
            metrics = router.get_metrics()
            for key_id, data in metrics["keys"].items():
                if data["daily_usage"] > 0:
                    print(f"  {key_id}: {data['daily_usage']}/{data['daily_limit']} "
                          f"({data['usage_percent']:.1f}%), "
                          f"RPM: {data['current_rpm']}")
            print()


def main():
    """主函数 - 演示用法"""
    print("🚀 Gemini API Keys智能路由系统")
    print("=" * 50)
    
    # 创建路由器
    router = KeyRouter()
    
    # 测试不同用户层级
    print("\n📋 测试Key分配:")
    print("-" * 50)
    
    # Owner请求
    key = router.get_optimal_key("owner_123", UserTier.OWNER)
    print(f"Owner -> {key}")
    
    # VIP请求
    key = router.get_optimal_key("vip_456", UserTier.VIP)
    print(f"VIP -> {key}")
    
    # Member请求
    key = router.get_optimal_key("member_789", UserTier.MEMBER)
    print(f"Member -> {key}")
    
    # 输出指标
    print("\n📊 当前使用指标:")
    print("-" * 50)
    metrics = router.get_metrics()
    print(json.dumps(metrics, indent=2, default=str))
    
    # 导出Prometheus指标
    print("\n📈 Prometheus指标:")
    print("-" * 50)
    print(router.export_prometheus_metrics())
    
    # 运行异步模拟
    print("\n🔄 运行使用模拟...")
    print("-" * 50)
    asyncio.run(simulate_usage())


if __name__ == "__main__":
    main()
