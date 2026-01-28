# 🎯 完整系统设计方案

## 📁 目录结构分析

### 当前状态

```
/mnt/volume_sgp1_01/
├── svs/              ← 当前开发中的多Bot系统（Python）
├── svs_bot/          ← 原有的单Bot系统（Python + Go）
└── svs-mcp/          ← DeepWeay网站项目
```

### 项目说明

#### 1. `/svs/` - 多Bot群聊系统（当前开发）
- **语言**: Python
- **功能**: 3个Bot群聊互动（小爱、倩倩姐、Notion助手）
- **特点**: 
  - 5轮连续对话
  - 独立关键词触发
  - 私聊永久记忆
- **状态**: ✅ V3已完成

#### 2. `/svs_bot/` - 原有Bot系统
- **语言**: Python + Go
- **功能**: 
  - 单Bot高情商AI
  - Gemini Router（25个API Key池）
  - 多模型支持
- **特点**:
  - 成熟的Key管理系统
  - Docker部署
  - 完整的监控系统

#### 3. `/svs-mcp/` - DeepWeay网站
- **语言**: Next.js + TypeScript
- **功能**: 菌丝堡垒社区平台
- **域名**: deepweay.com

---

## 🎯 新需求整理

### 1. 停止激活系统
- ✅ 5轮后自动停止
- ✅ 需要重新触发关键词
- ⚠️ **新增**: 每分钟每用户只能触发一次

### 2. 游戏系统（活跃气氛）
- 3个Bot协作的游戏
- 可学习的关键词组
- 增加群聊互动性

### 3. 项目整合
- 将 `/svs/` 迁移到 `/svs_bot/`
- 整合Gemini Key池
- 统一管理系统

### 4. Go版本重构
- 主Bot用Go重写
- 更高性能
- 更严谨的类型系统

---

## 🚀 实施方案

### 阶段1: 添加触发限制（立即实施）

#### 功能：每分钟每用户只能触发一次

```python
class RateLimiter:
    """触发频率限制"""
    
    def __init__(self):
        self.cooldown = 60  # 60秒冷却
    
    def can_trigger(self, chat_id: int, user_id: int, bot_name: str) -> bool:
        """检查是否可以触发"""
        key = f"trigger_limit:{bot_name}:{chat_id}:{user_id}"
        last_trigger = redis_client.get(key)
        
        if last_trigger:
            return False  # 冷却中
        
        # 设置冷却
        redis_client.setex(key, self.cooldown, "1")
        return True
```

---

### 阶段2: 设计游戏系统

#### 游戏1: 菌丝接龙
```
玩法:
1. 用户说 "菌丝接龙"
2. 小爱: "灵芝" [1/5]
3. 用户: "芝麻"
4. 倩倩姐: "麻辣"
5. 用户: "辣椒"
6. Notion: "椒盐"
...连续接龙5轮
```

#### 游戏2: 真菌知识问答
```
玩法:
1. 用户说 "真菌问答"
2. Notion: "问题：哪种蘑菇会发光？"
3. 用户: "荧光蘑菇"
4. 小爱: "正确！+10菌丝"
```

#### 游戏3: Bot协作故事
```
玩法:
1. 用户说 "讲故事"
2. 小爱: "从前有一个菌丝网络..."
3. 倩倩姐: "它连接着整个森林..."
4. Notion: "科学家发现它能传递信息..."
5. 用户可以选择故事走向
```

---

### 阶段3: 项目整合方案

#### 方案A: 迁移到 svs_bot（推荐）

**优点**:
- 复用成熟的Key池系统
- 统一的Docker部署
- 完整的监控体系

**步骤**:
```bash
1. 复制 /svs/multi_bot_v3.py → /svs_bot/multi_bot_system.py
2. 整合 gemini_router.py
3. 更新 docker-compose.yml
4. 测试部署
5. 删除 /svs/
```

#### 方案B: Go版本重构（长期）

**优点**:
- 更高性能
- 更低内存占用
- 类型安全

**技术栈**:
```
- Go 1.21+
- go-telegram-bot-api
- go-redis
- Docker多阶段构建
```

---

## 🎮 游戏系统详细设计

### 可学习关键词组

```python
class GameKeywords:
    """游戏关键词学习系统"""
    
    def __init__(self):
        self.games = {
            "接龙": ["菌丝接龙", "蘑菇接龙", "真菌接龙"],
            "问答": ["真菌问答", "蘑菇问答", "知识问答"],
            "故事": ["讲故事", "编故事", "菌丝故事"],
        }
    
    def learn_keyword(self, game_type: str, keyword: str):
        """学习新关键词"""
        if game_type in self.games:
            if keyword not in self.games[game_type]:
                self.games[game_type].append(keyword)
                # 保存到Redis
                redis_client.sadd(f"game_keywords:{game_type}", keyword)
```

### 游戏状态管理

```python
class GameSession:
    """游戏会话管理"""
    
    def __init__(self, chat_id: int, game_type: str):
        self.chat_id = chat_id
        self.game_type = game_type
        self.round = 0
        self.max_rounds = 5
        self.players = []
        self.score = {}
    
    def next_round(self) -> bool:
        """进入下一轮"""
        self.round += 1
        return self.round <= self.max_rounds
    
    def add_score(self, user_id: int, points: int):
        """添加分数"""
        self.score[user_id] = self.score.get(user_id, 0) + points
```

---

## 📊 Redis数据结构设计

### 现有结构
```
group_round:{bot}:{chat_id}:{user_id} = 1-5
private_chat:{bot}:{user_id} = [对话列表]
```

### 新增结构
```
# 触发限制
trigger_limit:{bot}:{chat_id}:{user_id} = 1 (TTL: 60秒)

# 游戏会话
game_session:{chat_id} = {
    "type": "接龙",
    "round": 3,
    "players": [123, 456],
    "score": {"123": 10, "456": 20}
}

# 学习的关键词
game_keywords:{game_type} = Set["关键词1", "关键词2"]
```

---

## 🔧 Go版本架构设计

### 项目结构
```
svs_bot_go/
├── cmd/
│   └── bot/
│       └── main.go
├── internal/
│   ├── bot/
│   │   ├── handler.go
│   │   ├── personality.go
│   │   └── game.go
│   ├── memory/
│   │   ├── redis.go
│   │   └── conversation.go
│   ├── router/
│   │   └── gemini.go
│   └── config/
│       └── config.go
├── pkg/
│   └── telegram/
│       └── client.go
├── go.mod
├── go.sum
├── Dockerfile
└── docker-compose.yml
```

### 核心代码示例

```go
package bot

type Bot struct {
    Name        string
    Username    string
    Keywords    []string
    Personality Personality
    Memory      *memory.Manager
    Router      *router.GeminiRouter
}

type Personality interface {
    GenerateReply(ctx context.Context, msg Message) (string, error)
}

func (b *Bot) HandleMessage(ctx context.Context, msg Message) error {
    // 检查触发限制
    if !b.Memory.CanTrigger(msg.ChatID, msg.UserID) {
        return nil
    }
    
    // 检查关键词或对话中
    if b.isTriggered(msg.Text) || b.Memory.InConversation(msg.ChatID, msg.UserID) {
        // 生成回复
        reply, err := b.Personality.GenerateReply(ctx, msg)
        if err != nil {
            return err
        }
        
        // 发送回复
        return b.SendReply(msg.ChatID, reply)
    }
    
    return nil
}
```

---

## 📋 实施时间表

### Week 1: 完善Python版本
- ✅ Day 1-2: 添加触发限制
- ✅ Day 3-4: 实现游戏系统
- ✅ Day 5: 测试和优化

### Week 2: 项目整合
- Day 1-2: 迁移到 svs_bot
- Day 3-4: 整合Key池
- Day 5: 部署测试

### Week 3-4: Go版本开发
- Day 1-3: 核心Bot功能
- Day 4-5: 游戏系统
- Day 6-7: 测试部署

---

## 🎯 立即行动项

### 1. 添加触发限制（30分钟）
```python
# 在 multi_bot_v3.py 中添加
rate_limiter = RateLimiter()

# 在 handle_message 中检查
if is_triggered:
    if not rate_limiter.can_trigger(chat_id, user_id, bot_name):
        await msg.reply_text("⏰ 请等待1分钟后再触发")
        return
```

### 2. 设计游戏关键词（1小时）
```python
GAME_KEYWORDS = {
    "接龙": ["菌丝接龙", "蘑菇接龙", "接龙游戏"],
    "问答": ["真菌问答", "蘑菇问答", "知识竞赛"],
    "故事": ["讲故事", "编故事", "菌丝传说"],
}
```

### 3. 实现简单游戏（2小时）
```python
class MushroomGame:
    """蘑菇接龙游戏"""
    
    async def start(self, chat_id: int):
        """开始游戏"""
        pass
    
    async def process_answer(self, user_id: int, answer: str):
        """处理用户回答"""
        pass
```

---

## 💡 建议

1. **先完善Python版本** - 快速迭代，验证游戏玩法
2. **再整合到svs_bot** - 复用成熟基础设施
3. **最后Go重构** - 性能优化和长期维护

---

**需要我立即实施哪个部分？**

1. ⚡ 添加触发限制（最快）
2. 🎮 实现游戏系统（最有趣）
3. 🔄 项目整合（最实用）
4. 🚀 Go版本开发（最长期）
