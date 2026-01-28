# 🔑 智能Key路由系统完整指南

## 📊 系统架构

### 核心组件

```
┌─────────────────────────────────────┐
│     Telegram Bot接口                │
│     (xiaoai_with_router.py)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   GeminiKeyRouter (智能路由器)      │
│   • RPM/RPD限制管理                 │
│   • 自动故障转移                     │
│   • 负载均衡                         │
│   • 实时监控统计                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      25个Gemini API Keys            │
│   Group A (6) │ Group B (6)         │
│   Group C (6) │ Group D (7)         │
└─────────────────────────────────────┘
```

---

## 🔐 Gemini 2.5 Flash 免费层限制

### 官方限制
```yaml
单Key限制:
  RPM: 15 requests/minute  # 每分钟请求数
  RPD: 1500 requests/day   # 每天请求数
  TPM: 1,000,000 tokens/min # 每分钟Token数
  TPD: 100,000,000 tokens/day # 每天Token数

并发限制:
  同时请求数: 未明确限制
```

### 实际配置（80%安全系数）
```yaml
使用限制:
  RPM: 12 (15 × 0.8)
  RPD: 1200 (1500 × 0.8)

原因:
  - 避免触发速率限制
  - 预留缓冲空间
  - 提高稳定性
```

---

## 📈 容量规划

### 分组配置

**Group A - VIP专用** (6 Keys)
```yaml
Keys数: 6
RPM容量: 72 (6 × 12)
RPD容量: 7,200 (6 × 1,200)
用途: Owner和VIP用户
优先级: 最高
```

**Group B - Premium** (6 Keys)
```yaml
Keys数: 6
RPM容量: 72
RPD容量: 7,200
用途: Premium付费用户
优先级: 高
```

**Group C - 普通会员** (6 Keys)
```yaml
Keys数: 6
RPM容量: 72
RPD容量: 7,200
用途: 注册用户
优先级: 中
```

**Group D - 游客/备用** (7 Keys)
```yaml
Keys数: 7
RPM容量: 84
RPD容量: 8,400
用途: 未注册用户、降级服务
优先级: 低
```

### 总容量
```yaml
总Keys: 25
总RPM: 300 requests/minute
总RPD: 30,000 requests/day
峰值能力: 支持300个并发用户（每人1 RPM）
```

---

## 🎯 智能路由策略

### 1. 用户分级路由

```python
用户等级 → 优先组序列:
  VIP:     Group A → B → C → D
  Premium: Group B → C → D → A
  Normal:  Group C → D → B
  Guest:   Group D → C
```

**原理**:
- VIP用户优先使用最好的Keys
- 各等级有备用组，保证服务可用
- 防止所有用户挤在同一组

### 2. 轮询机制

```python
# 组内轮询
for i in range(len(group_keys)):
    key = group_keys[(start_idx + i) % len(group_keys)]
    if is_available(key):
        return key
```

**优点**:
- 均衡使用所有Keys
- 避免单Key过载
- 延长Keys生命周期

### 3. 可用性检查

```python
检查项:
  1. 是否在黑名单
  2. 分钟请求数 < RPM限制
  3. 日请求数 < RPD限制
```

### 4. 故障转移

```
Key1请求失败
    ↓
记录错误
    ↓
3次错误? → 是 → 拉黑1小时
    ↓ 否
立即切换到Key2
    ↓
继续请求
```

### 5. 降级策略

```
所有组Keys都接近限制
    ↓
选择使用量最少的Key
    ↓
允许超限使用（风险可控）
```

---

## 📊 监控统计

### 实时统计

```python
router.get_stats()

返回:
  total_keys: 25
  available_keys: 23  # 可用Keys
  blacklisted_keys: 2 # 黑名单Keys
  total_requests: 1250
  total_tokens: 125000
  total_errors: 15
  rpm_usage: {
    'AIzaSy...': '8/12',  # 当前/限制
    ...
  }
  rpd_usage: {
    'AIzaSy...': '450/1200',
    ...
  }
```

### 组容量监控

```python
router.get_group_capacity('group_a')

返回:
  group: 'group_a'
  total_keys: 6
  available_keys: 5
  max_rpm: 72
  max_rpd: 7200
  utilization: '16.7%'  # 使用率
```

---

## 🔧 使用示例

### 基础用法

```python
from gemini_key_router_v2 import create_router_from_env

# 创建路由器
router = create_router_from_env()

# 获取Key (自动选择最佳)
key = router.get_key('vip', user_id=123)

# 使用Key调用API
response = call_api(key, prompt)

# 记录结果
router.record_request(
    key,
    success=True,
    latency=0.5,
    tokens=100
)
```

### 高级用法

```python
# 查看统计
stats = router.get_stats()
print(f"可用Keys: {stats['available_keys']}/{stats['total_keys']}")

# 查看组容量
for group in ['group_a', 'group_b', 'group_c', 'group_d']:
    capacity = router.get_group_capacity(group)
    print(f"{group}: {capacity['utilization']}")

# 手动重置黑名单
router.reset_blacklist()  # 重置所有
router.reset_blacklist('specific_key')  # 重置特定Key
```

---

## 💡 优化建议

### 1. 用户分级

```python
# 在xiaoai_with_router.py中配置
USER_TIERS = {
    OWNER_ID: 'vip',
    123456: 'premium',
    789012: 'normal',
    # 其他用户默认'normal'
}
```

**建议**:
- Owner: VIP
- 付费用户: Premium
- 活跃用户: Normal
- 新用户/游客: Guest

### 2. Redis集成

```python
# 持久化统计数据
class GeminiKeyRouter:
    def __init__(self, keys_config, redis_client):
        self.redis = redis_client
        
        # 从Redis恢复统计
        self.load_stats_from_redis()
    
    def record_request(self, key, ...):
        # 更新内存统计
        self.update_memory_stats()
        
        # 持久化到Redis
        self.save_stats_to_redis()
```

**好处**:
- Bot重启后保留统计
- 跨实例共享数据
- 实时监控面板

### 3. 动态调整

```python
# 根据实际使用情况调整安全系数
if error_rate > 0.1:  # 错误率 > 10%
    safety_factor = 0.7  # 更保守
elif error_rate < 0.01:  # 错误率 < 1%
    safety_factor = 0.9  # 更激进
```

### 4. Keys轮换

```python
# 定期轮换Keys (每月)
# 避免单个Key被频繁使用

def rotate_keys():
    # 重新排列Keys顺序
    for group_name in keys_config:
        random.shuffle(keys_config[group_name])
```

---

## 🔴 常见问题

### Q1: Keys用完了怎么办？
**A**: 路由器会：
1. 自动降级到备用组
2. 选择使用量最少的Key
3. 等待RPM/RPD重置
4. 发送告警通知

### Q2: 如何知道哪个Key有问题？
**A**: 
```python
stats = router.get_stats()
# 检查rpm_usage和错误率

# 查看黑名单
if stats['blacklisted_keys'] > 0:
    # 有Keys被拉黑
```

### Q3: 300 RPM够用吗？
**A**: 容量分析：
```
场景1: 100活跃用户
  平均: 100 × 2 RPM = 200 RPM ✅ 充足

场景2: 200活跃用户  
  平均: 200 × 1.5 RPM = 300 RPM ⚠️ 接近上限

场景3: 500活跃用户
  平均: 500 × 1 RPM = 500 RPM ❌ 超载
  → 需要增加Keys或限流
```

### Q4: 如何增加Keys？
**A**: 
1. 获取更多Gemini API Keys
2. 添加到keys_config
3. 重启Bot即可

---

## 📈 性能指标

### 预期性能

```yaml
响应时间:
  P50: <1s
  P95: <2s
  P99: <3s

成功率:
  目标: >99%
  告警阈值: <95%

可用性:
  目标: >99.9%
  故障转移: <100ms
```

### 容量规划

```yaml
当前配置 (25 Keys):
  RPM: 300
  RPD: 30,000
  支持用户: 200-300并发

扩展到50 Keys:
  RPM: 600
  RPD: 60,000
  支持用户: 400-600并发

扩展到100 Keys:
  RPM: 1,200
  RPD: 120,000
  支持用户: 800-1,200并发
```

---

## 🚀 部署步骤

### 1. 安装依赖
```bash
# 无需额外依赖，使用Python标准库
python3 --version  # 确保Python 3.7+
```

### 2. 配置Keys
```python
# 编辑 gemini_key_router_v2.py
# 或从环境变量/配置文件加载
```

### 3. 启动Bot
```bash
chmod +x START_ROUTER_BOT.sh
./START_ROUTER_BOT.sh
```

### 4. 测试
```bash
# 在Telegram发送
/start
/status
/router
```

### 5. 监控
```bash
# 查看日志
tail -f logs/xiaoai_router.log

# 查看进程
ps aux | grep xiaoai_with_router
```

---

## 📊 与Doppler集成

### 建议配置

```yaml
Doppler配置添加:
  # 25个Gemini Keys
  GEMINI_GROUP_A_KEY_1: AIzaSy...
  GEMINI_GROUP_A_KEY_2: AIzaSy...
  ...
  GEMINI_GROUP_D_KEY_7: AIzaSy...
  
  # 路由配置
  GEMINI_RPM_LIMIT: 15
  GEMINI_RPD_LIMIT: 1500
  GEMINI_SAFETY_FACTOR: 0.8
  
  # 用户等级
  USER_TIER_VIP: 123456,789012
  USER_TIER_PREMIUM: 111222,333444
```

### 从Doppler加载

```python
import os

keys_config = {
    'group_a': [
        os.getenv(f'GEMINI_GROUP_A_KEY_{i}')
        for i in range(1, 7)
    ],
    # ...
}

router = GeminiKeyRouter(keys_config)
```

---

## ✅ 总结

### 核心优势
1. ✅ **智能分配** - 根据用户等级自动选择最佳Key
2. ✅ **负载均衡** - 轮询机制均衡使用所有Keys
3. ✅ **故障转移** - 自动检测并切换故障Key
4. ✅ **容量管理** - 严格遵守RPM/RPD限制
5. ✅ **实时监控** - 完整的统计和告警

### 适用场景
- ✅ 多用户Telegram Bot
- ✅ 高并发AI服务
- ✅ 需要分级服务
- ✅ 免费层资源优化

### 扩展性
- ✅ 支持任意数量Keys
- ✅ 支持自定义分组
- ✅ 支持Redis持久化
- ✅ 支持分布式部署

---

**系统版本**: v2.0  
**最后更新**: 2025-11-10  
**状态**: ✅ 生产就绪
