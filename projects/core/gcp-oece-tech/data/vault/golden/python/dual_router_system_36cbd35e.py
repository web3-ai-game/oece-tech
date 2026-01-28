#!/usr/bin/env python3
"""
双路由器四组架构 + 多模态系统
路由器A控制A-1,A-2组 | 路由器B控制B-1,B-2组
"""

import os
import time
import random
import json
import requests
from enum import Enum
from typing import Dict, List, Optional, Tuple
from collections import defaultdict, deque
from datetime import datetime, timedelta
import threading
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class RouterID(Enum):
    """路由器ID"""
    ROUTER_A = "router_a"
    ROUTER_B = "router_b"


class WorkGroup(Enum):
    """工作组"""
    GROUP_A1 = "group_a1"  # 路由器A管理
    GROUP_A2 = "group_a2"  # 路由器A管理
    GROUP_B1 = "group_b1"  # 路由器B管理
    GROUP_B2 = "group_b2"  # 路由器B管理


# ========== Keys配置 (29个总Keys) ==========
KEYS_CONFIG = {
    # 路由器 (2个)
    RouterID.ROUTER_A: "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
    RouterID.ROUTER_B: "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
    
    # 工作组A-1 (7个Keys) - 路由器A管理
    WorkGroup.GROUP_A1: [
        "AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
        "AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
        "AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
        "AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
        "AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
        "AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
        "AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
    ],
    
    # 工作组A-2 (7个Keys) - 路由器A管理
    WorkGroup.GROUP_A2: [
        "AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
        "AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
        "AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
        "AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
        "AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
        "AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
        "AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
    ],
    
    # 工作组B-1 (7个Keys) - 路由器B管理
    WorkGroup.GROUP_B1: [
        "AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
        "AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
        "AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
        "AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
        "AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA",
        "AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
        "AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
    ],
    
    # 工作组B-2 (6个Keys) - 路由器B管理，少1个
    WorkGroup.GROUP_B2: [
        "AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI",
        "AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",
        "AIzaSyCFsMpRhiwm_SMgsJNODRAR86NKDxM6M8c",
        "AIzaSyAt0PUYuIrHN898bGAE1amOsUjP3ogrXiQ",
        # 后面加2个已有的key补充
        "AIzaSyAWXpDiRsyELoVB5VNpHuGevufpurQTMwg",
        "AIzaSyDMzpEWY3kbgkZVpNpcipIsNg6xinQsvAs",
    ],
}


class DualRouterSystem:
    """双路由器系统"""
    
    def __init__(self):
        self.routers = {
            RouterID.ROUTER_A: KEYS_CONFIG[RouterID.ROUTER_A],
            RouterID.ROUTER_B: KEYS_CONFIG[RouterID.ROUTER_B],
        }
        
        # 路由器管理的组
        self.router_groups = {
            RouterID.ROUTER_A: [WorkGroup.GROUP_A1, WorkGroup.GROUP_A2],
            RouterID.ROUTER_B: [WorkGroup.GROUP_B1, WorkGroup.GROUP_B2],
        }
        
        self.work_groups = {
            WorkGroup.GROUP_A1: KEYS_CONFIG[WorkGroup.GROUP_A1],
            WorkGroup.GROUP_A2: KEYS_CONFIG[WorkGroup.GROUP_A2],
            WorkGroup.GROUP_B1: KEYS_CONFIG[WorkGroup.GROUP_B1],
            WorkGroup.GROUP_B2: KEYS_CONFIG[WorkGroup.GROUP_B2],
        }
        
        # 使用追踪
        self.key_usage = defaultdict(lambda: {
            "daily_count": 0,
            "rpm_count": deque(maxlen=60),
            "last_used": None,
            "error_count": 0,
        })
        
        self.lock = threading.Lock()
        self.last_daily_reset = datetime.now()
    
    def _is_key_available(self, key: str, rpm_limit: int = 10) -> bool:
        """检查Key是否可用"""
        usage = self.key_usage[key]
        
        # 检查RPM
        current_time = time.time()
        while usage["rpm_count"] and current_time - usage["rpm_count"][0] > 60:
            usage["rpm_count"].popleft()
        
        if len(usage["rpm_count"]) >= rpm_limit:
            return False
        
        # 检查日限额 (保守60)
        if usage["daily_count"] >= 60:
            return False
        
        return True
    
    def get_work_key(self, router_id: RouterID = None) -> Tuple[str, str, str]:
        """
        获取工作Key
        返回: (router_key, worker_key, group)
        """
        # 如果没指定路由器，随机选择
        if not router_id:
            router_id = random.choice([RouterID.ROUTER_A, RouterID.ROUTER_B])
        
        router_key = self.routers[router_id]
        managed_groups = self.router_groups[router_id]
        
        # 从管理的组中随机选择
        group = random.choice(managed_groups)
        keys = self.work_groups[group]
        
        # 随机选择可用Key
        shuffled = random.sample(keys, len(keys))
        for key in shuffled:
            if self._is_key_available(key):
                # 标记使用
                self.key_usage[key]["daily_count"] += 1
                self.key_usage[key]["rpm_count"].append(time.time())
                self.key_usage[key]["last_used"] = datetime.now()
                
                logger.info(f"路由器{router_id.value} -> 组{group.value} -> Key {key[:20]}...")
                return router_key, key, group.value
        
        return router_key, None, group.value
    
    def get_status(self) -> Dict:
        """获取系统状态"""
        status = {
            "timestamp": datetime.now().isoformat(),
            "routers": {},
            "groups": {}
        }
        
        for router_id in RouterID:
            managed_groups = self.router_groups[router_id]
            total_usage = 0
            for group in managed_groups:
                for key in self.work_groups[group]:
                    total_usage += self.key_usage[key]["daily_count"]
            
            status["routers"][router_id.value] = {
                "key": self.routers[router_id][:20] + "...",
                "managed_groups": [g.value for g in managed_groups],
                "total_usage": total_usage
            }
        
        for group in WorkGroup:
            keys = self.work_groups[group]
            status["groups"][group.value] = {
                "size": len(keys),
                "available": sum(1 for k in keys if self._is_key_available(k)),
                "usage": sum(self.key_usage[k]["daily_count"] for k in keys)
            }
        
        return status


class MultimodalXiaoAi:
    """多模态小爱同学 - 支持文本和图像生成"""
    
    def __init__(self, router_system: DualRouterSystem):
        self.router = router_system
        self.conversation_context = {}  # 简单上下文，不保存太多
        
    def detect_image_request(self, text: str) -> bool:
        """检测是否是图像生成请求"""
        image_keywords = [
            "生成图", "画一个", "画个", "出图", "生成图片", 
            "画", "图像", "picture", "image", "draw", "generate"
        ]
        return any(keyword in text.lower() for keyword in image_keywords)
    
    def generate_text(self, user_id: str, message: str) -> Dict:
        """生成文本回复"""
        router_key, worker_key, group = self.router.get_work_key()
        
        if not worker_key:
            return {"error": "No available keys"}
        
        # 构建请求
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={worker_key}"
        
        # 获取简单上下文（最多3轮）
        context = self.conversation_context.get(user_id, [])
        
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": msg}]}
                for msg in context[-3:]  # 最多3轮
            ] + [
                {"role": "user", "parts": [{"text": message}]}
            ],
            "generationConfig": {
                "maxOutputTokens": 500,
                "temperature": 0.7
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                reply = data['candidates'][0]['content']['parts'][0]['text']
                
                # 更新简单上下文
                if user_id not in self.conversation_context:
                    self.conversation_context[user_id] = []
                self.conversation_context[user_id].append(message)
                self.conversation_context[user_id].append(reply)
                
                # 只保留最近6条（3轮）
                if len(self.conversation_context[user_id]) > 6:
                    self.conversation_context[user_id] = self.conversation_context[user_id][-6:]
                
                return {
                    "type": "text",
                    "content": reply,
                    "router": router_key[:20] + "...",
                    "worker": worker_key[:20] + "...",
                    "group": group
                }
            else:
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
    
    def generate_image(self, user_id: str, prompt: str) -> Dict:
        """生成图像"""
        router_key, worker_key, group = self.router.get_work_key()
        
        if not worker_key:
            return {"error": "No available keys"}
        
        # 使用imagen-3.0生成图像
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate:predict?key={worker_key}"
        
        payload = {
            "instances": [{
                "prompt": prompt
            }],
            "parameters": {
                "sampleCount": 1
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code == 200:
                data = response.json()
                # 图像通常在predictions中返回base64或URL
                return {
                    "type": "image",
                    "data": data,
                    "router": router_key[:20] + "...",
                    "worker": worker_key[:20] + "...",
                    "group": group
                }
            else:
                # 如果imagen-3.0不行，尝试其他图像生成模型
                return self._try_alternative_image_gen(worker_key, prompt, router_key, group)
        except Exception as e:
            logger.error(f"图像生成失败: {e}")
            return {"error": str(e)}
    
    def _try_alternative_image_gen(self, worker_key: str, prompt: str, router_key: str, group: str) -> Dict:
        """尝试备选图像生成方法"""
        # 方法2: 使用gemini-2.0-flash-preview-image-generation
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={worker_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Generate an image: {prompt}"
                }]
            }]
        }
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code == 200:
                return {
                    "type": "image",
                    "data": response.json(),
                    "router": router_key[:20] + "...",
                    "worker": worker_key[:20] + "...",
                    "group": group,
                    "method": "gemini-image-gen"
                }
        except Exception as e:
            pass
        
        return {"error": "All image generation methods failed"}
    
    def process_message(self, user_id: str, message: str) -> Dict:
        """处理消息 - 自动检测是文本还是图像请求"""
        if self.detect_image_request(message):
            logger.info(f"检测到图像生成请求: {message}")
            return self.generate_image(user_id, message)
        else:
            return self.generate_text(user_id, message)


def demo_system():
    """演示系统"""
    print("🚀 双路由器四组多模态系统")
    print("=" * 80)
    
    # 初始化系统
    router_system = DualRouterSystem()
    xiaoai = MultimodalXiaoAi(router_system)
    
    # 显示架构
    print("\n📊 系统架构:")
    print("-" * 80)
    print("路由器A -> 组A-1 (7 Keys), 组A-2 (7 Keys)")
    print("路由器B -> 组B-1 (7 Keys), 组B-2 (6 Keys)")
    print("总计: 2路由器 + 27工作Keys")
    print()
    
    # 测试文本对话
    print("📝 测试文本对话:")
    print("-" * 80)
    test_messages = [
        ("user1", "你好，小爱同学"),
        ("user1", "今天天气怎么样"),
        ("user2", "介绍一下你自己"),
    ]
    
    for user_id, msg in test_messages:
        print(f"\n用户{user_id}: {msg}")
        result = xiaoai.process_message(user_id, msg)
        if "error" not in result:
            print(f"小爱: {result.get('content', '...')[:100]}")
            print(f"  (路由: {result['router']}, 工作: {result['worker']}, 组: {result['group']})")
        else:
            print(f"❌ {result['error']}")
        time.sleep(1)
    
    # 测试图像生成
    print("\n\n🎨 测试图像生成:")
    print("-" * 80)
    image_requests = [
        ("user3", "画一个可爱的猫咪"),
        ("user4", "生成图：美丽的日落"),
    ]
    
    for user_id, msg in image_requests:
        print(f"\n用户{user_id}: {msg}")
        result = xiaoai.process_message(user_id, msg)
        if "error" not in result:
            print(f"✅ 图像已生成 (方法: {result.get('method', 'default')})")
            print(f"  (路由: {result['router']}, 工作: {result['worker']}, 组: {result['group']})")
        else:
            print(f"❌ {result['error']}")
        time.sleep(1)
    
    # 显示状态
    print("\n\n📊 系统状态:")
    print("-" * 80)
    status = router_system.get_status()
    print(json.dumps(status, indent=2))
    
    # 保存配置
    config = {
        "architecture": "dual_router_quad_group",
        "routers": {
            "router_a": {
                "key": KEYS_CONFIG[RouterID.ROUTER_A],
                "manages": ["group_a1", "group_a2"]
            },
            "router_b": {
                "key": KEYS_CONFIG[RouterID.ROUTER_B],
                "manages": ["group_b1", "group_b2"]
            }
        },
        "groups": {
            "group_a1": {"size": 7, "keys": KEYS_CONFIG[WorkGroup.GROUP_A1]},
            "group_a2": {"size": 7, "keys": KEYS_CONFIG[WorkGroup.GROUP_A2]},
            "group_b1": {"size": 7, "keys": KEYS_CONFIG[WorkGroup.GROUP_B1]},
            "group_b2": {"size": 6, "keys": KEYS_CONFIG[WorkGroup.GROUP_B2]},
        },
        "features": [
            "dual_router_architecture",
            "text_generation",
            "image_generation",
            "simple_context_memory",
            "auto_detection"
        ],
        "capacity": {
            "total_keys": 29,
            "router_keys": 2,
            "worker_keys": 27,
            "estimated_users": 50,
            "rpm_per_group": 70,
            "total_rpm": 280
        }
    }
    
    with open("dual_router_config.json", "w") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print("\n✅ 配置已保存到 dual_router_config.json")


if __name__ == "__main__":
    demo_system()
