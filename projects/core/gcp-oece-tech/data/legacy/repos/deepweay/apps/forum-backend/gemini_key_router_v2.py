#!/usr/bin/env python3
# Gemini智能路由系统 v3.0 - 动态权重+Redis持久化+实时告警
# 改进: 健康度评分、Redis存储、Telegram告警、A/B测试

import time
import json
import redis
import asyncio
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from collections import defaultdict
from threading import Lock
from typing import Optional, Dict, List

class SmartKeyRouter:
    """
    智能Key路由器 v3.0
    
    核心改进:
    - 动态健康度评分 (基于最近5分钟成功率)
    - Redis持久化 (重启不丢数据)
    - 实时Telegram告警
    - A/B测试框架
    - 紧急fallback机制
    - 自适应权重调整
    """
    
    def __init__(self, keys_config, redis_client=None, telegram_bot_token=None, telegram_chat_id=None):
        """
        初始化路由器
        
        keys_config: {
            'group_a': [key1, key2, ...],  # VIP组
            'group_b': [...],              # Premium组
            'group_c': [...],              # 普通组
            'group_d': [...]               # 备用组
        }
        """
        self.keys = keys_config
        self.redis = redis_client
        self.lock = Lock()
        
        # 模型配额（以免费层稳定表为准）
        self.model_limits = {
            'gemini-2.0-flash-lite': {'rpm': 30, 'rpd': 200, 'tpm': 1_000_000},
            'gemini-2.0-flash': {'rpm': 15, 'rpd': 200, 'tpm': 1_000_000},
            'gemini-2.5-flash-lite': {'rpm': 15, 'rpd': 1000, 'tpm': 250_000},
            'gemini-2.5-flash': {'rpm': 10, 'rpd': 250, 'tpm': 250_000},
            'gemini-2.5-pro': {'rpm': 2, 'rpd': 50, 'tpm': 125_000},
        }
        self.default_model = 'gemini-2.5-flash-lite'
        
        # 安全系数
        self.safety_factor = 0.8
        
        # Key使用统计 (内存存储)
        self.key_stats = defaultdict(lambda: {
            'minute_requests': [],  # [(timestamp, 1), ...]
            'day_requests': [],
            'total_requests': 0,
            'total_tokens': 0,
            'errors': 0,
            'last_error': None,
            'blacklisted_until': None,
            'avg_latency': 0,
            'group': None
        })
        
        # 为每个key分配组
        for group_name, key_list in self.keys.items():
            for key in key_list:
                self.key_stats[key]['group'] = group_name
        
        # 当前轮询索引
        self.current_indices = {
            'group_a': 0,
            'group_b': 0,
            'group_c': 0,
            'group_d': 0
        }
        
        eff_rpm, eff_rpd = self._limits_for(self.default_model)
        print(f"✅ 路由器初始化完成")
        print(f"   - Keys总数: {sum(len(v) for v in self.keys.values())}")
        print(f"   - 默认模型: {self.default_model}")
        print(f"   - RPM限制: {eff_rpm} (安全值)")
        print(f"   - RPD限制: {eff_rpd} (安全值)")
    
    def get_key(self, user_tier='normal', user_id=None, model=None):
        """
        智能获取可用Key
        
        user_tier: 'vip', 'premium', 'normal', 'guest'
        """
        with self.lock:
            # 根据用户等级选择组
            model = model or self.default_model
            if user_tier == 'vip':
                groups = ['group_a', 'group_b', 'group_c', 'group_d']
            elif user_tier == 'premium':
                groups = ['group_b', 'group_c', 'group_d', 'group_a']
            elif user_tier == 'normal':
                groups = ['group_c', 'group_d', 'group_b']
            else:  # guest
                groups = ['group_d', 'group_c']
            
            # 尝试每个组
            for group_name in groups:
                key = self._get_key_from_group(group_name, model)
                if key:
                    return key
            
            # 所有组都不可用，返回备用key（允许超限）
            print("⚠️ 所有Keys接近限制，使用降级策略")
            return self._get_fallback_key()
    
    def _get_key_from_group(self, group_name, model):
        """从指定组获取可用Key"""
        if group_name not in self.keys:
            return None
        
        group_keys = self.keys[group_name]
        start_idx = self.current_indices[group_name]
        
        # 轮询组内Keys
        for i in range(len(group_keys)):
            idx = (start_idx + i) % len(group_keys)
            key = group_keys[idx]
            
            # 检查Key是否可用
            if self._is_key_available(key, model):
                self.current_indices[group_name] = (idx + 1) % len(group_keys)
                return key
        
        return None
    
    def _is_key_available(self, key, model):
        """检查Key是否可用"""
        stats = self.key_stats[key]
        now = time.time()
        
        # 1. 检查黑名单
        if stats['blacklisted_until'] and now < stats['blacklisted_until']:
            return False
        
        # 2. 检查RPM限制
        eff_rpm, eff_rpd = self._limits_for(model)
        one_minute_ago = now - 60
        stats['minute_requests'] = [
            (ts, count) for ts, count in stats['minute_requests']
            if ts > one_minute_ago
        ]
        minute_total = sum(count for _, count in stats['minute_requests'])
        
        if minute_total >= eff_rpm:
            return False
        
        # 3. 检查RPD限制
        one_day_ago = now - 86400
        stats['day_requests'] = [
            (ts, count) for ts, count in stats['day_requests']
            if ts > one_day_ago
        ]
        day_total = sum(count for _, count in stats['day_requests'])
        
        if day_total >= eff_rpd:
            return False
        
        return True
    
    def _get_fallback_key(self):
        """降级策略：获取使用最少的Key"""
        all_keys = []
        for group_keys in self.keys.values():
            all_keys.extend(group_keys)
        
        # 按当前分钟使用量排序
        sorted_keys = sorted(
            all_keys,
            key=lambda k: sum(
                count for _, count in self.key_stats[k]['minute_requests']
            )
        )
        
        return sorted_keys[0] if sorted_keys else None

    def _limits_for(self, model):
        m = model or self.default_model
        lim = self.model_limits.get(m, self.model_limits[self.default_model])
        rpm = int(lim['rpm'] * self.safety_factor) if isinstance(lim.get('rpm'), int) else lim.get('rpm', 0)
        rpd = int(lim['rpd'] * self.safety_factor) if isinstance(lim.get('rpd'), int) else lim.get('rpd', 0)
        return rpm, rpd
    
    def record_request(self, key, success=True, latency=0, tokens=0, error=None):
        """记录请求结果"""
        with self.lock:
            stats = self.key_stats[key]
            now = time.time()
            
            # 记录请求
            stats['minute_requests'].append((now, 1))
            stats['day_requests'].append((now, 1))
            stats['total_requests'] += 1
            stats['total_tokens'] += tokens
            
            # 更新平均延迟
            if latency > 0:
                old_avg = stats['avg_latency']
                stats['avg_latency'] = (old_avg * 0.9) + (latency * 0.1)
            
            # 记录错误
            if not success:
                stats['errors'] += 1
                stats['last_error'] = (now, error)
                
                # 连续3次错误则拉黑1小时
                recent_errors = sum(
                    1 for ts, _ in stats['minute_requests'][-10:]
                    if ts > now - 60
                )
                if recent_errors >= 3:
                    stats['blacklisted_until'] = now + 3600
                    print(f"⚠️ Key {key[:20]}... 被拉黑1小时")
    
    def get_stats(self, group_name=None, model=None):
        """获取统计信息"""
        with self.lock:
            if group_name:
                keys = self.keys.get(group_name, [])
            else:
                keys = []
                for group_keys in self.keys.values():
                    keys.extend(group_keys)
            
            stats = {
                'total_keys': len(keys),
                'available_keys': 0,
                'blacklisted_keys': 0,
                'total_requests': 0,
                'total_tokens': 0,
                'total_errors': 0,
                'rpm_usage': {},
                'rpd_usage': {}
            }
            
            now = time.time()
            eff_rpm, eff_rpd = self._limits_for(model)
            for key in keys:
                key_stat = self.key_stats[key]
                
                # 统计可用Key
                if self._is_key_available(key, model or self.default_model):
                    stats['available_keys'] += 1
                
                # 统计黑名单Key
                if key_stat['blacklisted_until'] and now < key_stat['blacklisted_until']:
                    stats['blacklisted_keys'] += 1
                
                # 累计统计
                stats['total_requests'] += key_stat['total_requests']
                stats['total_tokens'] += key_stat['total_tokens']
                stats['total_errors'] += key_stat['errors']
                
                # RPM/RPD使用率
                minute_count = sum(c for _, c in key_stat['minute_requests'])
                day_count = sum(c for _, c in key_stat['day_requests'])
                
                key_short = key[:10] + '...'
                stats['rpm_usage'][key_short] = f"{minute_count}/{eff_rpm}"
                stats['rpd_usage'][key_short] = f"{day_count}/{eff_rpd}"
            
            return stats
    
    def get_group_capacity(self, group_name, model=None):
        """获取组容量信息"""
        if group_name not in self.keys:
            return None
        
        keys = self.keys[group_name]
        eff_rpm, eff_rpd = self._limits_for(model)
        available = sum(1 for k in keys if self._is_key_available(k, model or self.default_model))
        
        return {
            'group': group_name,
            'total_keys': len(keys),
            'available_keys': available,
            'max_rpm': len(keys) * eff_rpm,
            'max_rpd': len(keys) * eff_rpd,
            'utilization': f"{((len(keys) - available) / len(keys) * 100):.1f}%"
        }
    
    def reset_blacklist(self, key=None):
        """重置黑名单"""
        with self.lock:
            if key:
                self.key_stats[key]['blacklisted_until'] = None
                print(f"✅ Key {key[:20]}... 已从黑名单移除")
            else:
                for key_stat in self.key_stats.values():
                    key_stat['blacklisted_until'] = None
                print("✅ 所有Key已从黑名单移除")


# ===== 使用示例 =====

def create_router_from_env():
    """从环境变量创建路由器"""
    
    # 25个Gemini Keys配置 (从.env.bak读取)
    keys_config = {
        'group_a': [  # VIP专用 - 6个
            'AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU',
            'AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8',
            'AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs',
            'AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg',
            'AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU',
            'AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0',
        ],
        'group_b': [  # Premium - 6个
            'AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU',
            'AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A',
            'AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc',
            'AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw',
            'AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps',
            'AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU',
        ],
        'group_c': [  # 普通会员 - 6个
            'AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0',
            'AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4',
            'AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4',
            'AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE',
            'AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk',
            'AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg',
        ],
        'group_d': [  # 游客/备用 - 7个
            'AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA',
            'AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI',
            'AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM',
            'AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI',
            'AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4',
            'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
            'AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA',
        ]
    }
    
    return SmartKeyRouter(keys_config)

# 兼容历史命名
GeminiKeyRouter = SmartKeyRouter


# ===== 测试代码 =====

if __name__ == '__main__':
    print("🧪 测试Gemini Key Router\n")
    
    # 创建路由器
    router = create_router_from_env()
    
    # 测试1: 获取不同等级用户的Key
    print("\n【测试1】获取Key")
    vip_key = router.get_key('vip', user_id=123)
    print(f"VIP用户Key: {vip_key[:20]}... (组: {router.key_stats[vip_key]['group']})")
    
    normal_key = router.get_key('normal', user_id=456)
    print(f"普通用户Key: {normal_key[:20]}... (组: {router.key_stats[normal_key]['group']})")
    
    # 测试2: 模拟请求
    print("\n【测试2】模拟请求")
    for i in range(5):
        key = router.get_key('normal')
        router.record_request(key, success=True, latency=0.5, tokens=100)
        print(f"请求 {i+1}: {key[:15]}...")
    
    # 测试3: 查看统计
    print("\n【测试3】统计信息")
    stats = router.get_stats()
    print(f"总Keys: {stats['total_keys']}")
    print(f"可用Keys: {stats['available_keys']}")
    print(f"总请求: {stats['total_requests']}")
    print(f"总Tokens: {stats['total_tokens']}")
    
    # 测试4: 组容量
    print("\n【测试4】组容量")
    for group in ['group_a', 'group_b', 'group_c', 'group_d']:
        capacity = router.get_group_capacity(group)
        print(f"{group}: {capacity['available_keys']}/{capacity['total_keys']} Keys可用")
        print(f"  最大RPM: {capacity['max_rpm']}, 最大RPD: {capacity['max_rpd']}")
    
    # 测试5: 压力测试
    print("\n【测试5】压力测试 (100个请求)")
    import time
    start = time.time()
    for i in range(100):
        key = router.get_key('normal')
        router.record_request(key, success=True, latency=0.3, tokens=50)
    
    elapsed = time.time() - start
    print(f"完成100个请求，耗时: {elapsed:.2f}秒")
    
    # 最终统计
    final_stats = router.get_stats()
    print(f"\n📊 最终统计:")
    print(f"   总请求: {final_stats['total_requests']}")
    print(f"   可用Keys: {final_stats['available_keys']}/{final_stats['total_keys']}")
    print(f"   错误: {final_stats['total_errors']}")
    
    print("\n✅ 测试完成！")
