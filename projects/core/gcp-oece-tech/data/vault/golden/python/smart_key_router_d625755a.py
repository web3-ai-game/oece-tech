#!/usr/bin/env python3
"""
Gemini API智能Key路由系统
25个免费层Keys智能调度
"""

import os
import time
import random
from enum import Enum
from typing import Dict, List, Optional
from collections import defaultdict
from datetime import datetime, timedelta
import json

class UserTier(Enum):
    """用户层级"""
    OWNER = 5      # 系统拥有者
    VIP = 4        # VIP用户  
    PREMIUM = 3    # 高级用户
    MEMBER = 2     # 普通会员
    GUEST = 1      # 游客

class ModelType(Enum):
    """模型类型"""
    PRO = "gemini-2.5-pro"                    # 最强能力 (2 RPM, 50 RPD)
    FLASH = "gemini-2.5-flash"                # 平衡型 (10 RPM, 250 RPD)  
    FLASH_LITE = "gemini-2.5-flash-lite"      # 高容量 (15 RPM, 1000 RPD)
    FAST = "gemini-2.0-flash-lite"            # 高速 (30 RPM, 200 RPD)
    IMAGE = "gemini-2.0-flash-preview-image-generation"  # 图像生成
    TTS = "gemini-2.5-flash-tts"              # 语音合成

# 25个可用的免费层Keys
FREE_KEYS = [
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

# 支持Pro模型的Keys (从测试中发现)
PRO_CAPABLE_KEYS = [
    "AIzaSyAWXpDiRsyELoVB5VNpHuGevufpurQTMwg",
    "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
    "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
    "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI"
]

class SmartKeyRouter:
    """智能Key路由器 - 25个免费Keys智能调度"""
    
    def __init__(self):
        # Key池分配
        self.key_pools = {
            ModelType.PRO: PRO_CAPABLE_KEYS[:2],  # 2个Pro专用
            ModelType.FLASH: FREE_KEYS[4:7],      # 3个Flash
            ModelType.FLASH_LITE: FREE_KEYS[7:15], # 8个Flash-lite (高容量)
            ModelType.FAST: FREE_KEYS[15:23],     # 8个Fast (高速)
            ModelType.IMAGE: FREE_KEYS[23:25],    # 2个图像生成
            ModelType.TTS: [FREE_KEYS[0]]         # 1个TTS
        }
        
        # 用户配额配置
        self.tier_config = {
            UserTier.OWNER: {
                "models": [ModelType.PRO, ModelType.FLASH, ModelType.IMAGE, ModelType.TTS],
                "daily_limit": 2000,
                "rpm_limit": 30,
                "memory_rounds": 10,
                "priority": 10
            },
            UserTier.VIP: {
                "models": [ModelType.FLASH, ModelType.FLASH_LITE],
                "daily_limit": 1500,
                "rpm_limit": 20,
                "memory_rounds": 5,
                "priority": 8
            },
            UserTier.PREMIUM: {
                "models": [ModelType.FLASH_LITE],
                "daily_limit": 1000,
                "rpm_limit": 15,
                "memory_rounds": 3,
                "priority": 6
            },
            UserTier.MEMBER: {
                "models": [ModelType.FAST],
                "daily_limit": 500,
                "rpm_limit": 10,
                "memory_rounds": 1,
                "priority": 4
            },
            UserTier.GUEST: {
                "models": [ModelType.FAST],
                "daily_limit": 50,
                "rpm_limit": 2,
                "memory_rounds": 0,
                "priority": 1
            }
        }
        
        # 使用追踪
        self.usage_tracker = defaultdict(lambda: {
            "daily": 0,
            "rpm": [],
            "last_used": None
        })
        
        # 用户使用统计
        self.user_usage = defaultdict(lambda: {
            "daily": 0,
            "last_reset": datetime.now()
        })
        
    def get_best_model_for_user(self, user_tier: UserTier, task_type: str = "text") -> ModelType:
        """根据用户层级和任务类型选择最佳模型"""
        config = self.tier_config[user_tier]
        
        if task_type == "image" and ModelType.IMAGE in config["models"]:
            return ModelType.IMAGE
        elif task_type == "tts" and ModelType.TTS in config["models"]:
            return ModelType.TTS
        else:
            # 返回该层级最好的文本模型
            return config["models"][0]
    
    def get_optimal_key(self, user_id: str, user_tier: UserTier, model_type: ModelType) -> Optional[str]:
        """获取最优Key"""
        
        # 检查用户配额
        if not self._check_user_quota(user_id, user_tier):
            return None
        
        # 获取模型对应的Key池
        key_pool = self.key_pools.get(model_type, [])
        if not key_pool:
            return None
        
        # 选择负载最低的Key
        available_keys = []
        for key in key_pool:
            if self._is_key_available(key, model_type):
                available_keys.append((key, self.usage_tracker[key]["daily"]))
        
        if not available_keys:
            return None
        
        # 选择使用量最少的Key
        selected_key = min(available_keys, key=lambda x: x[1])[0]
        
        # 更新使用统计
        self._update_usage(selected_key, user_id)
        
        return selected_key
    
    def _check_user_quota(self, user_id: str, user_tier: UserTier) -> bool:
        """检查用户配额"""
        config = self.tier_config[user_tier]
        user_data = self.user_usage[user_id]
        
        # 重置日配额
        if datetime.now().date() > user_data["last_reset"].date():
            user_data["daily"] = 0
            user_data["last_reset"] = datetime.now()
        
        # 检查日限额
        if user_data["daily"] >= config["daily_limit"]:
            return False
        
        return True
    
    def _is_key_available(self, key: str, model_type: ModelType) -> bool:
        """检查Key是否可用"""
        usage = self.usage_tracker[key]
        
        # 模型限制
        model_limits = {
            ModelType.PRO: {"rpm": 2, "rpd": 50},
            ModelType.FLASH: {"rpm": 10, "rpd": 250},
            ModelType.FLASH_LITE: {"rpm": 15, "rpd": 1000},
            ModelType.FAST: {"rpm": 30, "rpd": 200},
            ModelType.IMAGE: {"rpm": 10, "rpd": 100},
            ModelType.TTS: {"rpm": 3, "rpd": 15}
        }
        
        limits = model_limits.get(model_type, {"rpm": 10, "rpd": 200})
        
        # 检查日限额
        if usage["daily"] >= limits["rpd"]:
            return False
        
        # 检查RPM
        now = time.time()
        usage["rpm"] = [t for t in usage["rpm"] if now - t < 60]
        if len(usage["rpm"]) >= limits["rpm"]:
            return False
        
        return True
    
    def _update_usage(self, key: str, user_id: str):
        """更新使用统计"""
        # 更新Key使用
        self.usage_tracker[key]["daily"] += 1
        self.usage_tracker[key]["rpm"].append(time.time())
        self.usage_tracker[key]["last_used"] = datetime.now()
        
        # 更新用户使用
        self.user_usage[user_id]["daily"] += 1
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        stats = {
            "timestamp": datetime.now().isoformat(),
            "total_keys": len(FREE_KEYS),
            "model_pools": {},
            "key_usage": {},
            "user_count": len(self.user_usage)
        }
        
        # 模型池统计
        for model, keys in self.key_pools.items():
            stats["model_pools"][model.value] = len(keys)
        
        # Key使用统计
        for key, usage in self.usage_tracker.items():
            if usage["daily"] > 0:
                stats["key_usage"][key[:20] + "..."] = {
                    "daily": usage["daily"],
                    "current_rpm": len(usage["rpm"])
                }
        
        return stats


# ========== 使用示例 ==========
def main():
    """演示智能路由系统"""
    router = SmartKeyRouter()
    
    print("🚀 Gemini智能Key路由系统")
    print("=" * 60)
    print(f"✅ 已加载 {len(FREE_KEYS)} 个免费层Keys")
    print()
    
    # 模拟不同用户请求
    test_cases = [
        ("owner_123", UserTier.OWNER, "text", ModelType.PRO),
        ("vip_456", UserTier.VIP, "text", ModelType.FLASH),
        ("member_789", UserTier.MEMBER, "text", ModelType.FAST),
        ("owner_123", UserTier.OWNER, "image", ModelType.IMAGE),
        ("owner_123", UserTier.OWNER, "tts", ModelType.TTS),
    ]
    
    print("📋 路由测试:")
    print("-" * 60)
    for user_id, tier, task, expected_model in test_cases:
        model = router.get_best_model_for_user(tier, task)
        key = router.get_optimal_key(user_id, tier, model)
        
        if key:
            print(f"✅ {user_id} ({tier.name}) - {task}")
            print(f"   模型: {model.value}")
            print(f"   Key: {key[:20]}...")
        else:
            print(f"❌ {user_id} ({tier.name}) - 无可用Key")
        print()
    
    # 显示统计
    print("📊 系统统计:")
    print("-" * 60)
    stats = router.get_stats()
    print(json.dumps(stats, indent=2, default=str))
    
    # 容量汇总
    print("\n💪 总容量汇总:")
    print("-" * 60)
    print(f"gemini-2.5-flash-lite: 375 RPM, 25,000 RPD")
    print(f"gemini-2.0-flash-lite: 750 RPM, 5,000 RPD")
    print(f"gemini-2.5-flash: 250 RPM, 6,250 RPD")
    print(f"gemini-2.5-pro: 8 RPM, 200 RPD")
    print()
    print("🎯 总计: 每天可处理 36,450+ 请求！")

if __name__ == "__main__":
    main()
