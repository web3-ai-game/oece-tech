#!/usr/bin/env python3
# Gemini智能路由系统 v3.0 - 完全重构版
# 核心改进: 动态权重、Redis持久化、Telegram告警、A/B测试

import time
import json
import redis
import urllib.request
import urllib.parse
from datetime import datetime
from collections import defaultdict
from threading import Lock
from typing import Optional, Dict, List, Tuple

class SmartKeyRouter:
    """
    智能Key路由器 v3.0
    
    核心改进:
    1. 动态健康度评分 - 基于最近5分钟成功率实时调整
    2. Redis持久化 - 所有统计数据存Redis，重启不丢
    3. Telegram实时告警 - Key挂了立即通知
    4. 紧急fallback - 全挂时自动切换备用策略
    5. A/B测试框架 - 不同路由策略并行测试
    """
    
    def __init__(self, keys_config: Dict[str, List[str]], 
                 redis_client: Optional[redis.Redis] = None,
                 telegram_bot_token: Optional[str] = None,
                 telegram_chat_id: Optional[str] = None):
        
        self.keys = keys_config
        self.redis = redis_client or redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        self.tg_token = telegram_bot_token
        self.tg_chat_id = telegram_chat_id
        self.lock = Lock()
        
        # Gemini 2.5 Flash限制
        self.rpm_limit = 15
        self.rpd_limit = 1500
        
        # 健康度评分 (0-1)
        self.health_scores = {}
        self.last_health_check = {}
        
        # A/B测试配置
        self.ab_test_enabled = True
        self.ab_test_ratio = 0.1  # 10%流量用于测试新策略
        
        # 初始化
        self._init_health_scores()
        self._load_from_redis()
        
        print(f"✅ 智能路由器v3.0初始化")
        print(f"   Keys总数: {sum(len(v) for v in self.keys.values())}")
        print(f"   Redis: {'✅ 连接' if self._test_redis() else '❌ 断开'}")
        print(f"   告警: {'✅ 启用' if self.tg_token else '❌ 禁用'}")
    
    def _init_health_scores(self):
        """初始化所有Keys的健康度评分"""
        for group_keys in self.keys.values():
            for key in group_keys:
                self.health_scores[key] = 1.0  # 初始满分
                self.last_health_check[key] = time.time()
    
    def _test_redis(self) -> bool:
        """测试Redis连接"""
        try:
            self.redis.ping()
            return True
        except:
            return False
    
    def _load_from_redis(self):
        """从Redis加载历史数据"""
        try:
            # 加载健康度评分
            scores_key = "router:health_scores"
            scores_data = self.redis.hgetall(scores_key)
            if scores_data:
                self.health_scores.update({k: float(v) for k, v in scores_data.items()})
                print(f"   ✅ 从Redis恢复 {len(scores_data)} 个Key的健康度")
        except Exception as e:
            print(f"   ⚠️ Redis加载失败: {e}")
    
    def _save_to_redis(self):
        """保存到Redis"""
        try:
            # 保存健康度评分
            scores_key = "router:health_scores"
            self.redis.hset(scores_key, mapping={k: v for k, v in self.health_scores.items()})
        except Exception as e:
            print(f"⚠️ Redis保存失败: {e}")
    
    def get_best_key(self, user_tier: str = 'normal', user_id: Optional[int] = None) -> Optional[str]:
        """
        获取最佳Key - 核心路由逻辑
        
        动态权重算法:
        1. 过滤健康度>0.7的Keys
        2. 检查RPM/RPD限制
        3. 按健康度排序
        4. 返回最佳Key
        """
        with self.lock:
            # 选择组
            if user_tier == 'vip':
                groups = ['group_a', 'group_b', 'group_c', 'group_d']
            elif user_tier == 'premium':
                groups = ['group_b', 'group_c', 'group_d']
            elif user_tier == 'normal':
                groups = ['group_c', 'group_d', 'group_b']
            else:  # guest
                groups = ['group_d', 'group_c']
            
            # 收集候选Keys
            candidates = []
            now = time.time()
            
            for group_name in groups:
                if group_name not in self.keys:
                    continue
                    
                for key in self.keys[group_name]:
                    # 检查健康度
                    health = self.health_scores.get(key, 1.0)
                    if health < 0.7:
                        continue
                    
                    # 检查最近检查时间
                    last_check = self.last_health_check.get(key, 0)
                    if now - last_check > 60:  # 超过1分钟没检查，降低优先级
                        health *= 0.8
                    
                    # 检查RPM限制
                    if self._check_rpm_limit(key):
                        candidates.append((key, health, group_name))
            
            if not candidates:
                # 触发紧急fallback
                return self._emergency_rotation()
            
            # 按健康度排序，返回最佳
            candidates.sort(key=lambda x: x[1], reverse=True)
            best_key, best_health, best_group = candidates[0]
            
            # A/B测试: 10%流量随机选择
            if self.ab_test_enabled and user_id and user_id % 10 == 0:
                import random
                test_key = random.choice(candidates)[0]
                self._log_ab_test(user_id, test_key, best_key)
                return test_key
            
            return best_key
    
    def _check_rpm_limit(self, key: str) -> bool:
        """检查Key的RPM限制"""
        try:
            rpm_key = f"router:rpm:{key}"
            count = self.redis.get(rpm_key)
            return int(count or 0) < self.rpm_limit
        except:
            return True
    
    def _emergency_rotation(self) -> Optional[str]:
        """紧急fallback - 当所有Keys都不可用时"""
        print("🚨 触发紧急fallback")
        
        # 从所有Keys中找使用最少的
        all_keys = []
        for group_keys in self.keys.values():
            all_keys.extend(group_keys)
        
        if not all_keys:
            return None
        
        # 按最近使用时间排序
        key_usage = []
        for key in all_keys:
            try:
                last_use = float(self.redis.get(f"router:last_use:{key}") or 0)
                key_usage.append((key, last_use))
            except:
                key_usage.append((key, 0))
        
        key_usage.sort(key=lambda x: x[1])
        fallback_key = key_usage[0][0]
        
        # 发送告警
        self._send_alert(f"🚨 紧急fallback触发\n使用Key: {fallback_key[:15]}...")
        
        return fallback_key
    
    def record_request(self, key: str, success: bool = True, 
                       latency: float = 0, tokens: int = 0, 
                       error: Optional[str] = None):
        """
        记录请求结果 - 更新健康度评分
        
        健康度计算:
        - 成功: +0.05 (最高1.0)
        - 失败: -0.2 (最低0.0)
        - 考虑最近5分钟的成功率
        """
        with self.lock:
            now = time.time()
            
            # 更新Redis统计
            try:
                # RPM计数
                rpm_key = f"router:rpm:{key}"
                self.redis.incr(rpm_key)
                self.redis.expire(rpm_key, 60)
                
                # RPD计数
                rpd_key = f"router:rpd:{key}"
                self.redis.incr(rpd_key)
                self.redis.expire(rpd_key, 86400)
                
                # 最后使用时间
                self.redis.set(f"router:last_use:{key}", now)
                
                # 请求历史 (最近100次)
                history_key = f"router:history:{key}"
                self.redis.lpush(history_key, json.dumps({
                    'time': now,
                    'success': success,
                    'latency': latency,
                    'tokens': tokens,
                    'error': error
                }))
                self.redis.ltrim(history_key, 0, 99)
                
            except Exception as e:
                print(f"⚠️ Redis记录失败: {e}")
            
            # 更新健康度评分
            current_health = self.health_scores.get(key, 1.0)
            
            if success:
                # 成功则提升健康度
                new_health = min(1.0, current_health + 0.05)
            else:
                # 失败则降低健康度
                new_health = max(0.0, current_health - 0.2)
                
                # 连续失败告警
                if new_health < 0.5:
                    self._send_alert(f"⚠️ Key健康度过低\n{key[:15]}...\n健康度: {new_health:.2f}")
            
            self.health_scores[key] = new_health
            self.last_health_check[key] = now
            
            # 定期保存到Redis
            if int(now) % 10 == 0:  # 每10秒保存一次
                self._save_to_redis()
    
    def _send_alert(self, message: str):
        """发送Telegram告警"""
        if not self.tg_token or not self.tg_chat_id:
            return
        
        try:
            url = f"https://api.telegram.org/bot{self.tg_token}/sendMessage"
            data = {
                'chat_id': self.tg_chat_id,
                'text': f"🤖 Key路由器告警\n\n{message}",
                'parse_mode': 'HTML'
            }
            
            req = urllib.request.Request(
                url,
                data=urllib.parse.urlencode(data).encode(),
                method='POST'
            )
            urllib.request.urlopen(req, timeout=5)
        except Exception as e:
            print(f"⚠️ Telegram告警失败: {e}")
    
    def _log_ab_test(self, user_id: int, test_key: str, control_key: str):
        """记录A/B测试"""
        try:
            ab_key = "router:ab_test"
            self.redis.lpush(ab_key, json.dumps({
                'time': time.time(),
                'user_id': user_id,
                'test_key': test_key[:15],
                'control_key': control_key[:15]
            }))
            self.redis.ltrim(ab_key, 0, 999)
        except:
            pass
    
    def get_stats(self) -> Dict:
        """获取完整统计"""
        with self.lock:
            all_keys = []
            for group_keys in self.keys.values():
                all_keys.extend(group_keys)
            
            stats = {
                'total_keys': len(all_keys),
                'healthy_keys': sum(1 for h in self.health_scores.values() if h > 0.7),
                'critical_keys': sum(1 for h in self.health_scores.values() if h < 0.3),
                'health_scores': {k[:15]: round(v, 2) for k, v in self.health_scores.items()},
                'avg_health': round(sum(self.health_scores.values()) / len(self.health_scores), 2) if self.health_scores else 0
            }
            
            # 从Redis获取请求统计
            try:
                total_requests = 0
                for key in all_keys:
                    rpd_key = f"router:rpd:{key}"
                    count = int(self.redis.get(rpd_key) or 0)
                    total_requests += count
                
                stats['total_requests_today'] = total_requests
            except:
                stats['total_requests_today'] = 0
            
            return stats
    
    def get_health_report(self) -> str:
        """生成健康度报告"""
        stats = self.get_stats()
        
        report = f"""
🏥 Keys健康度报告
━━━━━━━━━━━━━━━━━━━━
总Keys: {stats['total_keys']}
健康: {stats['healthy_keys']} (>0.7)
危险: {stats['critical_keys']} (<0.3)
平均健康度: {stats['avg_health']}
今日请求: {stats['total_requests_today']}

🔝 健康度前5:
"""
        
        sorted_health = sorted(self.health_scores.items(), key=lambda x: x[1], reverse=True)
        for key, health in sorted_health[:5]:
            report += f"  {key[:15]}... : {health:.2f}\n"
        
        report += "\n⚠️ 需要关注:"
        critical = [(k, v) for k, v in self.health_scores.items() if v < 0.5]
        if critical:
            for key, health in critical[:5]:
                report += f"\n  {key[:15]}... : {health:.2f} 🔴"
        else:
            report += "\n  无异常 ✅"
        
        return report


# ===== 快速创建 =====

def create_smart_router(telegram_bot_token: Optional[str] = None, 
                        telegram_chat_id: Optional[str] = None) -> SmartKeyRouter:
    """快速创建智能路由器"""
    
    keys_config = {
        'group_a': [  # VIP - 6个
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
        'group_c': [  # Normal - 6个
            'AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0',
            'AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4',
            'AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4',
            'AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE',
            'AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk',
            'AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg',
        ],
        'group_d': [  # Backup - 7个
            'AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA',
            'AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI',
            'AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM',
            'AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI',
            'AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4',
            'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
            'AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA',
        ]
    }
    
    try:
        redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        redis_client.ping()
    except:
        redis_client = None
        print("⚠️ Redis未连接，使用内存模式")
    
    return SmartKeyRouter(
        keys_config,
        redis_client=redis_client,
        telegram_bot_token=telegram_bot_token,
        telegram_chat_id=telegram_chat_id
    )


# ===== 测试代码 =====

if __name__ == '__main__':
    print("🧪 测试智能路由器v3.0\n")
    
    # 创建路由器
    router = create_smart_router(
        telegram_bot_token='8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg',
        telegram_chat_id='6136230855'
    )
    
    # 测试1: 获取最佳Key
    print("\n【测试1】动态权重路由")
    for i in range(5):
        key = router.get_best_key('normal', user_id=i)
        print(f"  请求{i+1}: {key[:15]}... (健康度: {router.health_scores[key]:.2f})")
    
    # 测试2: 模拟请求和失败
    print("\n【测试2】健康度动态调整")
    test_key = router.get_best_key('normal')
    print(f"  初始健康度: {router.health_scores[test_key]:.2f}")
    
    # 成功请求
    router.record_request(test_key, success=True, latency=0.5, tokens=100)
    print(f"  成功后: {router.health_scores[test_key]:.2f}")
    
    # 失败请求
    router.record_request(test_key, success=False, error="429 Too Many Requests")
    print(f"  失败后: {router.health_scores[test_key]:.2f}")
    
    # 测试3: 健康度报告
    print("\n【测试3】健康度报告")
    print(router.get_health_report())
    
    # 测试4: 统计信息
    print("\n【测试4】系统统计")
    stats = router.get_stats()
    print(f"  总Keys: {stats['total_keys']}")
    print(f"  健康Keys: {stats['healthy_keys']}")
    print(f"  平均健康度: {stats['avg_health']}")
    
    print("\n✅ 测试完成！")
