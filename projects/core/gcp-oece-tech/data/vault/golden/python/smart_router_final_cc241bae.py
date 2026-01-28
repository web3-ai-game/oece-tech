#!/usr/bin/env python3
# Gemini智能路由器 - 基于实际测试的最终版
# 核心: 每日配额管理 + 智能权重 + 统计分析

import time
import json
import redis
import urllib.request
from datetime import datetime, timedelta
from collections import defaultdict
from threading import Lock
from typing import Optional, Dict, List

class GeminiSmartRouter:
    """
    Gemini智能路由器 - 基于实际测试优化
    
    实测结果:
    - gemini-2.5-flash: RPM=1000, RPD=10000 (主力模型)
    - gemini-2.5-pro: RPM=150, RPD=10000 (高级任务)
    
    核心功能:
    1. 每日配额管理 - 每天自动重置
    2. 智能权重分配 - 基于历史使用
    3. 实时统计 - 每个key的日/周/月使用量
    4. 健康度评分 - 动态调整
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
        
        # 模型限制 (基于实测)
        self.models = {
            'gemini-2.5-flash': {
                'rpm': 1000,
                'rpd': 10000,
                'avg_latency': 2.0,
                'use_case': '群聊/闲聊/日常对话',
                'priority': 1  # 主力模型
            },
            'gemini-2.5-pro': {
                'rpm': 150,
                'rpd': 10000,
                'avg_latency': 7.5,
                'use_case': '复杂任务/代码生成',
                'priority': 2  # 高级模型
            }
        }
        
        # 默认使用flash (最高日配额)
        self.default_model = 'gemini-2.5-flash'
        
        # 健康度评分
        self.health_scores = {}
        
        # 初始化
        self._init_keys()
        self._check_daily_reset()
        
        print(f"✅ Gemini智能路由器初始化")
        print(f"   Keys: {sum(len(v) for v in self.keys.values())} 个")
        print(f"   主力模型: {self.default_model} (RPD=10K)")
        print(f"   Redis: {'✅' if self._test_redis() else '❌'}")
    
    def _init_keys(self):
        """初始化所有Keys"""
        for group_keys in self.keys.values():
            for key in group_keys:
                self.health_scores[key] = 1.0
    
    def _test_redis(self) -> bool:
        """测试Redis"""
        try:
            self.redis.ping()
            return True
        except:
            return False
    
    def _check_daily_reset(self):
        """检查是否需要每日重置"""
        today = datetime.now().strftime('%Y-%m-%d')
        last_reset = self.redis.get('router:last_reset')
        
        if last_reset != today:
            print(f"🔄 执行每日配额重置 (上次: {last_reset or '从未'})")
            self._reset_daily_quota()
            self.redis.set('router:last_reset', today)
    
    def _reset_daily_quota(self):
        """重置每日配额"""
        # 清理所有日统计
        for pattern in ['router:rpd:*', 'router:daily_stats:*']:
            keys = self.redis.keys(pattern)
            if keys:
                self.redis.delete(*keys)
        
        # 重置健康度为满分
        for key in self.health_scores:
            self.health_scores[key] = 1.0
        
        print("   ✅ 配额已重置，健康度已恢复")
    
    def get_best_key(self, model: str = None, user_tier: str = 'normal') -> Optional[str]:
        """
        获取最佳Key - 核心路由逻辑
        
        策略:
        1. 优先选择健康度>0.8的Keys
        2. 检查今日RPD使用量
        3. 按剩余配额排序
        4. 返回最优Key
        """
        with self.lock:
            model = model or self.default_model
            model_limits = self.models.get(model, self.models[self.default_model])
            
            # 根据用户等级选择组
            if user_tier == 'vip':
                groups = ['group_a', 'group_b', 'group_c', 'group_d']
            elif user_tier == 'premium':
                groups = ['group_b', 'group_c', 'group_d']
            else:
                groups = ['group_c', 'group_d', 'group_b']
            
            # 收集候选Keys
            candidates = []
            for group_name in groups:
                if group_name not in self.keys:
                    continue
                
                for key in self.keys[group_name]:
                    # 检查健康度
                    health = self.health_scores.get(key, 1.0)
                    if health < 0.8:
                        continue
                    
                    # 检查今日使用量
                    daily_count = self._get_daily_count(key, model)
                    remaining = model_limits['rpd'] - daily_count
                    
                    if remaining <= 0:
                        continue
                    
                    # 计算权重分数
                    weight = health * remaining / model_limits['rpd']
                    
                    candidates.append({
                        'key': key,
                        'health': health,
                        'remaining': remaining,
                        'weight': weight,
                        'group': group_name
                    })
            
            if not candidates:
                return self._emergency_fallback(model)
            
            # 按权重排序
            candidates.sort(key=lambda x: x['weight'], reverse=True)
            best = candidates[0]
            
            return best['key']
    
    def _get_daily_count(self, key: str, model: str) -> int:
        """获取今日使用次数"""
        try:
            today = datetime.now().strftime('%Y-%m-%d')
            count_key = f"router:daily_stats:{key}:{model}:{today}"
            return int(self.redis.get(count_key) or 0)
        except:
            return 0
    
    def _emergency_fallback(self, model: str) -> Optional[str]:
        """紧急fallback"""
        print(f"🚨 {model} 所有Keys配额已用完")
        
        # 查找使用最少的Key
        all_keys = []
        for group_keys in self.keys.values():
            all_keys.extend(group_keys)
        
        min_usage = float('inf')
        fallback_key = None
        
        for key in all_keys:
            usage = self._get_daily_count(key, model)
            if usage < min_usage:
                min_usage = usage
                fallback_key = key
        
        if fallback_key:
            self._send_alert(f"🚨 紧急fallback\n模型: {model}\nKey: {fallback_key[:15]}...\n已用: {min_usage}")
        
        return fallback_key
    
    def record_request(self, key: str, model: str, success: bool = True, 
                       latency: float = 0, tokens: int = 0):
        """记录请求 - 更新统计"""
        with self.lock:
            today = datetime.now().strftime('%Y-%m-%d')
            
            try:
                # 更新日统计
                daily_key = f"router:daily_stats:{key}:{model}:{today}"
                self.redis.incr(daily_key)
                self.redis.expire(daily_key, 86400 * 7)  # 保留7天
                
                # 更新健康度
                current_health = self.health_scores.get(key, 1.0)
                if success:
                    self.health_scores[key] = min(1.0, current_health + 0.02)
                else:
                    self.health_scores[key] = max(0.0, current_health - 0.15)
                
                # 记录详细历史
                history = {
                    'time': time.time(),
                    'model': model,
                    'success': success,
                    'latency': latency,
                    'tokens': tokens
                }
                history_key = f"router:history:{key}"
                self.redis.lpush(history_key, json.dumps(history))
                self.redis.ltrim(history_key, 0, 99)
                
            except Exception as e:
                print(f"⚠️ 统计记录失败: {e}")
    
    def get_statistics(self, key: Optional[str] = None, days: int = 1) -> Dict:
        """获取统计信息"""
        with self.lock:
            if key:
                return self._get_key_stats(key, days)
            else:
                return self._get_global_stats(days)
    
    def _get_key_stats(self, key: str, days: int) -> Dict:
        """获取单个Key统计"""
        stats = {
            'key': key[:15] + '...',
            'health': round(self.health_scores.get(key, 1.0), 2),
            'models': {}
        }
        
        for model_name in self.models.keys():
            daily_counts = []
            for d in range(days):
                date = (datetime.now() - timedelta(days=d)).strftime('%Y-%m-%d')
                count_key = f"router:daily_stats:{key}:{model_name}:{date}"
                count = int(self.redis.get(count_key) or 0)
                daily_counts.append(count)
            
            stats['models'][model_name] = {
                'today': daily_counts[0],
                'total': sum(daily_counts),
                'remaining_today': self.models[model_name]['rpd'] - daily_counts[0]
            }
        
        return stats
    
    def _get_global_stats(self, days: int) -> Dict:
        """获取全局统计"""
        all_keys = []
        for group_keys in self.keys.values():
            all_keys.extend(group_keys)
        
        stats = {
            'total_keys': len(all_keys),
            'healthy_keys': sum(1 for h in self.health_scores.values() if h > 0.8),
            'models': {},
            'top_keys': []
        }
        
        # 每个模型的统计
        for model_name, model_info in self.models.items():
            model_stats = {
                'total_requests': 0,
                'avg_per_key': 0,
                'max_capacity': model_info['rpd'] * len(all_keys)
            }
            
            for key in all_keys:
                today = datetime.now().strftime('%Y-%m-%d')
                count_key = f"router:daily_stats:{key}:{model_name}:{today}"
                count = int(self.redis.get(count_key) or 0)
                model_stats['total_requests'] += count
            
            model_stats['avg_per_key'] = model_stats['total_requests'] // len(all_keys) if all_keys else 0
            model_stats['usage_rate'] = f"{model_stats['total_requests'] / model_stats['max_capacity'] * 100:.1f}%"
            
            stats['models'][model_name] = model_stats
        
        # Top Keys
        key_usage = []
        for key in all_keys:
            total_usage = sum(
                self._get_daily_count(key, model) 
                for model in self.models.keys()
            )
            key_usage.append((key, total_usage, self.health_scores.get(key, 1.0)))
        
        key_usage.sort(key=lambda x: x[1], reverse=True)
        stats['top_keys'] = [
            {'key': k[:15]+'...', 'requests': u, 'health': round(h, 2)}
            for k, u, h in key_usage[:5]
        ]
        
        return stats
    
    def get_daily_report(self) -> str:
        """生成每日报告"""
        stats = self.get_statistics(days=1)
        
        report = f"""
📊 Gemini路由器每日报告
{'='*50}

🔑 Keys状态
总Keys: {stats['total_keys']}
健康Keys: {stats['healthy_keys']} ({stats['healthy_keys']/stats['total_keys']*100:.0f}%)

📈 模型使用情况
"""
        
        for model_name, model_stats in stats['models'].items():
            report += f"\n{model_name}:\n"
            report += f"  今日请求: {model_stats['total_requests']}\n"
            report += f"  平均/Key: {model_stats['avg_per_key']}\n"
            report += f"  使用率: {model_stats['usage_rate']}\n"
            report += f"  剩余容量: {model_stats['max_capacity'] - model_stats['total_requests']}\n"
        
        report += f"\n🏆 使用最多的Keys:\n"
        for item in stats['top_keys']:
            report += f"  {item['key']}: {item['requests']}次 (健康度: {item['health']})\n"
        
        return report
    
    def _send_alert(self, message: str):
        """发送Telegram告警"""
        if not self.tg_token or not self.tg_chat_id:
            return
        
        try:
            url = f"https://api.telegram.org/bot{self.tg_token}/sendMessage"
            data = urllib.parse.urlencode({
                'chat_id': self.tg_chat_id,
                'text': f"🤖 路由器告警\n\n{message}",
                'parse_mode': 'HTML'
            }).encode()
            urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=5)
        except:
            pass


def create_router(telegram_bot_token: Optional[str] = None,
                  telegram_chat_id: Optional[str] = None) -> GeminiSmartRouter:
    """快速创建路由器"""
    
    keys_config = {
        'group_a': [
            'AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU',
            'AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8',
            'AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs',
            'AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg',
            'AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU',
            'AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0',
        ],
        'group_b': [
            'AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU',
            'AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A',
            'AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc',
            'AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw',
            'AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps',
            'AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU',
        ],
        'group_c': [
            'AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0',
            'AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4',
            'AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4',
            'AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE',
            'AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk',
            'AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg',
        ],
        'group_d': [
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
    
    return GeminiSmartRouter(
        keys_config,
        redis_client=redis_client,
        telegram_bot_token=telegram_bot_token,
        telegram_chat_id=telegram_chat_id
    )


if __name__ == '__main__':
    print("🧪 测试最终版路由器\n")
    
    router = create_router(
        telegram_bot_token='8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg',
        telegram_chat_id='6136230855'
    )
    
    # 测试1: 获取Key
    print("\n【测试1】获取最佳Key")
    key = router.get_best_key('gemini-2.5-flash', 'normal')
    print(f"  Flash模型: {key[:20]}...")
    
    # 测试2: 模拟使用
    print("\n【测试2】模拟请求")
    for i in range(5):
        key = router.get_best_key('gemini-2.5-flash')
        router.record_request(key, 'gemini-2.5-flash', success=True, latency=1.5, tokens=100)
        print(f"  请求{i+1}: {key[:15]}...")
    
    # 测试3: 查看统计
    print("\n【测试3】单Key统计")
    stats = router.get_statistics(key)
    print(f"  健康度: {stats['health']}")
    print(f"  今日Flash使用: {stats['models']['gemini-2.5-flash']['today']}")
    print(f"  剩余配额: {stats['models']['gemini-2.5-flash']['remaining_today']}")
    
    # 测试4: 全局报告
    print("\n【测试4】每日报告")
    print(router.get_daily_report())
    
    print("\n✅ 测试完成！")
