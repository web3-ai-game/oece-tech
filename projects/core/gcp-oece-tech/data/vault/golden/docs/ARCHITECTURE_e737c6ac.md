# 🤖 SVS Telegram Bot - 智能架构设计

## 📊 Doppler 资源分配表

### Gemini API Keys 可用性测试结果

| Key 名称 | 状态 | 分配用途 | 备注 |
|---------|------|---------|------|
| `GEMINI_API_KEY` (KEY_1) | ✅ 可用 | **主要线路** - 任务识别 + 普通对话 | svs-telegram-bot 专用 |
| `GEMINI_API_KEY_2` (KEY_2) | ❌ 失败 | 不可用 | API key not valid |
| `GEMINI_API_KEY_3` (KEY_3) | ✅ 可用 | **备用线路** - 群聊 + 并发支持 | svs-telegram-bot 专用 |

### 模型配置

| 模型名称 | 用途 | 限制 | 优先级 |
|---------|------|------|--------|
| `gemini-2.5-flash-lite` | 任务识别 + 闲聊 + 群聊 | 每日 1000 次 | P0 (最高) |
| `gemini-2.5-flash` | 普通任务 | 每日 250 次 | P1 |
| `gemini-2.5-pro` | 复杂任务（发布/改造/重构） | 每日 50 次，每分钟 2 次 | P2 |

---

## 🏗️ 智能多模型并发架构

### 架构概览

```
用户消息
    │
    ↓
┌─────────────────────────────────────┐
│   任务识别模块 (Flash-Lite)          │  ← KEY_1 (主线路)
│   - 快速分析用户意图                 │
│   - 消息类型分类                     │
│   - 难度评估                         │
└─────────────────────────────────────┘
    │
    ├──→ 闲聊 ──→ Flash-Lite (KEY_1)
    │
    ├──→ 群聊 ──→ Flash-Lite (KEY_3) ← 第三条管道
    │                   │
    │                   └──→ 保存聊天记录到数据库
    │
    ├──→ 普通任务 ──→ Flash (KEY_1)
    │
    └──→ 复杂任务 ──→ Pro (KEY_1)
                        │
                        └──→ 速率限制时切换到 Flash (KEY_3)
```

### 三条管道架构

#### 🔵 管道 1: 主线路 (KEY_1)
- **用途**: 任务识别 + 私聊 + 复杂任务
- **模型**: Flash-Lite → Flash → Pro (按需升级)
- **优先级**: 最高

#### 🟢 管道 2: 备用线路 (KEY_3)  
- **用途**: Pro 速率限制时的降级处理
- **模型**: Flash (250次/天)
- **优先级**: 中

#### 🟡 管道 3: 群聊专线 (KEY_3)
- **用途**: 群聊消息 + 记录保存 + 论坛内容
- **模型**: Flash-Lite (1000次/天)
- **功能**:
  - 实时群聊响应
  - 聊天记录持久化
  - 论坛内容同步
  - 小爱同学功能集成

---

## 🎯 消息路由策略

### 1. 任务识别阶段 (Flash-Lite)

```python
message → analyze_intent() → {
    'type': 'chat' | 'task_simple' | 'task_complex' | 'group',
    'confidence': 0.0 - 1.0,
    'keywords': [...],
    'urgency': 'low' | 'medium' | 'high'
}
```

### 2. 路由决策树

```
┌─ type == 'chat' ────────→ Flash-Lite (KEY_1)
│
├─ type == 'group' ───────→ Flash-Lite (KEY_3) + 保存记录
│
├─ type == 'task_simple' ─→ Flash (KEY_1)
│                            ↓ 如果限额用完
│                            Flash (KEY_3)
│
└─ type == 'task_complex' ─→ Pro (KEY_1)
                             ↓ 如果速率限制
                             Flash (KEY_3) + 队列等待
```

### 3. 速率限制与降级

| 场景 | 主策略 | 降级策略 |
|------|--------|---------|
| Pro 达到 2次/分钟 | 等待 30 秒 | 使用 Flash (KEY_3) 先处理 |
| Pro 达到 50次/天 | 队列延后 | 使用 Flash (KEY_3) 降级处理 |
| Flash 达到 250次/天 | 切换 KEY_3 | 使用 Flash-Lite 降级 |
| Flash-Lite 达到 1000次/天 | 暂停服务 | 提示用户明天再试 |

---

## 💾 数据持久化架构

### 群聊记录表结构

```sql
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(255),
    message_text TEXT,
    message_type VARCHAR(50),
    model_used VARCHAR(100),
    response_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_chat_id ON chat_history(chat_id);
CREATE INDEX idx_user_id ON chat_history(user_id);
CREATE INDEX idx_created_at ON chat_history(created_at);
```

### 使用量追踪表

```sql
CREATE TABLE model_usage (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100),
    api_key_name VARCHAR(100),
    request_count INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    hour INTEGER,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    UNIQUE(model_name, api_key_name, date, hour)
);
```

---

## 🔧 技术实现

### 核心组件

```python
# 1. 任务识别器
class TaskAnalyzer:
    model = 'gemini-2.5-flash-lite'
    api_key = GEMINI_API_KEY  # KEY_1
    
    def analyze(message) -> TaskIntent
    
# 2. 模型路由器
class ModelRouter:
    def route(intent) -> (model, api_key)
    def check_rate_limit() -> bool
    def fallback_strategy() -> (model, api_key)

# 3. 并发管理器
class ConcurrentManager:
    pipeline_1: Queue  # 主线路
    pipeline_2: Queue  # 备用线路  
    pipeline_3: Queue  # 群聊专线
    
    def dispatch(task, pipeline)
    def balance_load()

# 4. 群聊记录器
class ChatRecorder:
    api_key = GEMINI_API_KEY_3  # KEY_3
    
    def save_message()
    def save_response()
    def sync_to_forum()
```

---

## 📈 性能指标与监控

### 关键指标

| 指标 | 目标 | 监控方式 |
|------|------|---------|
| 任务识别延迟 | < 1 秒 | Prometheus |
| 普通任务响应 | < 3 秒 | Prometheus |
| 复杂任务响应 | < 10 秒 | Prometheus |
| 群聊响应率 | > 95% | 数据库统计 |
| API 使用率 | < 80% | 实时追踪 |

### 告警规则

```yaml
alerts:
  - name: "Pro API 接近限额"
    condition: pro_daily_usage > 40  # 80% of 50
    action: "切换到降级模式"
    
  - name: "Flash-Lite 接近限额"
    condition: flash_lite_daily_usage > 800  # 80% of 1000
    action: "发送管理员通知"
    
  - name: "响应延迟过高"
    condition: avg_response_time > 10s
    action: "检查 API 状态"
```

---

## 🚀 部署清单

### 阶段 1: 基础设施 ✓
- [x] Doppler 配置
- [x] Docker 容器化
- [x] GitHub 仓库
- [ ] PostgreSQL 数据库

### 阶段 2: 核心功能
- [ ] 任务识别模块
- [ ] 模型路由器
- [ ] 速率限制器
- [ ] 并发管理器

### 阶段 3: 群聊功能
- [ ] 群聊消息处理
- [ ] 聊天记录保存
- [ ] 论坛内容同步
- [ ] 小爱同学集成

### 阶段 4: 监控与优化
- [ ] Prometheus 集成
- [ ] Grafana 仪表板
- [ ] 告警系统
- [ ] 性能优化

---

## 🎨 设计哲学

> "像菌丝网络一样，三条管道相互支撑，  
> 当一条受阻，另一条立即接管，  
> 从不让用户等待，从不浪费资源。"

### 核心原则

1. **永不等待** - 总有备用方案
2. **智能路由** - 根据任务选择最优模型
3. **资源节约** - 简单任务不用复杂模型
4. **并发优先** - 群聊不影响私聊
5. **数据为王** - 记录一切，分析一切

---

## 📝 下一步行动

### 立即执行
1. ✅ 测试 Gemini Keys 可用性
2. ✅ 分配 Keys 给 Bot
3. ⏳ 设置 PostgreSQL 数据库
4. ⏳ 实现任务识别模块
5. ⏳ 构建模型路由器

### 本周目标
- [ ] 完成核心架构
- [ ] 实现基础对话功能
- [ ] 部署监控系统

### 本月愿景
- [ ] 群聊功能上线
- [ ] 论坛集成
- [ ] 小爱同学功能完善
- [ ] 成为最智能的 Telegram Bot 🌟

---

*架构设计：像画家构图一样精心布局  
实现代码：像架构师建筑一样严谨细致  
运行维护：像真菌生长一样自然有机*

🍄 ✨ 🤖
