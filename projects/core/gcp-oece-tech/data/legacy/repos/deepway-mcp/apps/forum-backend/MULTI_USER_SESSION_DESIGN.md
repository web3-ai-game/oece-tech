# 🎯 小爱同学多用户会话管理系统设计

## 📋 需求分析

### 核心功能
```yaml
1. 多用户并发对话:
   - 最多5个用户同时对话
   - 每个用户独立的5轮记忆
   - 用户A和用户B互不干扰

2. 对话轮数控制:
   - 被提及后开始计数
   - 5轮后自动结束
   - 再次提及重新开始

3. 用户限流:
   - Owner: 无限制
   - 普通用户: 每天10次
   - 每次最多5轮对话

4. 智能语言适配:
   - 中文简体: 回复长度 0.8-1.0x
   - 中文繁体: 回复长度 0.8-1.0x
   - 英文: 回复长度 1.2-1.5x
   - 根据用户语言动态调整

5. Token优化:
   - 短消息合并处理
   - 避免浪费配额
   - 智能压缩历史
```

## 🏗️ 系统架构

### 整体架构
```
Telegram群组
    │
    ├─> User A @小爱 你好
    ├─> User B @小爱 问题
    └─> User C @小爱 查询
         │
         ▼
┌──────────────────────────────────────┐
│     Telegram Bot (Go)                │
│  • 消息接收与解析                     │
│  • 用户识别 (@提及检测)               │
│  • 命令处理 (/help, /stats)          │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Session Manager (核心模块)          │
│  • 多用户会话管理                     │
│  • 5轮记忆维护                        │
│  • 会话过期处理                       │
│  • 并发控制(最多5个)                  │
└──────────────────────────────────────┘
         │
         ├──> Redis (缓存)
         │    • 会话状态
         │    • 用户计数
         │    • 限流数据
         │
         └──> Supabase (持久化)
              • 会话历史
              • 用户配额
              • 统计数据
         │
         ▼
┌──────────────────────────────────────┐
│  Rate Limiter (限流器)                │
│  • 日配额检查                         │
│  • 实时计数                           │
│  • VIP判断                            │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Language Detector (语言识别)        │
│  • 简体中文/繁体中文/英文              │
│  • 回复长度调整系数                   │
│  • 上下文语言保持                     │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Gemini Router (25 Keys池)           │
│  • 智能负载均衡                       │
│  • 故障切换                           │
│  • 配额管理                           │
└──────────────────────────────────────┘
         │
         ▼
    AI Response
         │
         ▼
  User收到回复
```

## 💾 数据结构设计

### 1. 会话状态 (Session)
```go
type Session struct {
    SessionID     string         `json:"session_id"`      // 唯一会话ID
    UserID        int64          `json:"user_id"`         // Telegram用户ID
    GroupID       int64          `json:"group_id"`        // 群组ID
    Username      string         `json:"username"`        // 用户名
    Language      string         `json:"language"`        // 语言 (zh-CN, zh-TW, en)
    RoundCount    int            `json:"round_count"`     // 当前轮数 (1-5)
    MaxRounds     int            `json:"max_rounds"`      // 最大轮数 (5)
    Messages      []Message      `json:"messages"`        // 消息历史
    CreatedAt     time.Time      `json:"created_at"`      // 创建时间
    LastActiveAt  time.Time      `json:"last_active_at"`  // 最后活跃时间
    ExpireAt      time.Time      `json:"expire_at"`       // 过期时间
    Status        string         `json:"status"`          // active, expired, completed
}

type Message struct {
    Role      string    `json:"role"`       // user, assistant, system
    Content   string    `json:"content"`    // 消息内容
    Timestamp time.Time `json:"timestamp"`  // 时间戳
    TokenCount int      `json:"token_count"` // Token数量
}
```

### 2. 用户配额 (User Quota)
```go
type UserQuota struct {
    UserID          int64     `json:"user_id"`           // 用户ID
    Username        string    `json:"username"`          // 用户名
    IsOwner         bool      `json:"is_owner"`          // 是否Owner
    DailyLimit      int       `json:"daily_limit"`       // 每日限制 (10次)
    UsedToday       int       `json:"used_today"`        // 今日已用
    LastResetDate   string    `json:"last_reset_date"`   // 上次重置日期
    TotalCalls      int       `json:"total_calls"`       // 总调用次数
    ActiveSessions  int       `json:"active_sessions"`   // 当前活跃会话数
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
}
```

### 3. 语言配置 (Language Config)
```go
type LanguageConfig struct {
    Code              string  `json:"code"`               // zh-CN, zh-TW, en
    Name              string  `json:"name"`               // 简体中文, 繁體中文, English
    ResponseMultiplier float64 `json:"response_multiplier"` // 回复长度系数
    MaxTokens         int     `json:"max_tokens"`         // 最大token数
    SystemPrompt      string  `json:"system_prompt"`      // 系统提示词
}

var LanguageConfigs = map[string]LanguageConfig{
    "zh-CN": {
        Code:              "zh-CN",
        Name:              "简体中文",
        ResponseMultiplier: 0.9,    // 稍短
        MaxTokens:         800,
        SystemPrompt:      "你是小爱同学，一个友好的AI助手。用简洁的中文回复。",
    },
    "zh-TW": {
        Code:              "zh-TW",
        Name:              "繁體中文",
        ResponseMultiplier: 0.9,    // 稍短
        MaxTokens:         800,
        SystemPrompt:      "你是小愛同學，一個友好的AI助手。用簡潔的中文回覆。",
    },
    "en": {
        Code:              "en",
        Name:              "English",
        ResponseMultiplier: 1.3,    // 稍长
        MaxTokens:         1200,
        SystemPrompt:      "You are Xiaoai, a friendly AI assistant. Reply concisely in English.",
    },
}
```

### 4. Redis存储结构
```
Key命名规范:

1. 会话数据:
   session:{user_id}:{group_id} -> Session JSON
   TTL: 30分钟 (无活动自动过期)

2. 活跃会话列表:
   active_sessions:{group_id} -> Set[user_id]
   用于限制最多5个并发会话

3. 用户今日配额:
   quota:{user_id}:{date} -> count
   TTL: 24小时 (每日自动重置)

4. 用户活跃会话计数:
   user_sessions:{user_id} -> count
   
5. 语言检测缓存:
   lang:{user_id} -> language_code
   TTL: 7天
```

## 🔧 核心模块实现

### 1. Session Manager
```go
type SessionManager struct {
    redis    *redis.Client
    supabase *supabase.Client
    maxConcurrentSessions int  // 5
    sessionTimeout        time.Duration // 30分钟
}

// 创建新会话
func (sm *SessionManager) CreateSession(userID, groupID int64, username string) (*Session, error) {
    // 1. 检查活跃会话数量
    activeCount := sm.GetActiveSessions GroupCount(groupID)
    if activeCount >= sm.maxConcurrentSessions {
        return nil, errors.New("群组会话数量已达上限(5个)")
    }
    
    // 2. 检测用户语言
    lang := sm.DetectLanguage(userID)
    
    // 3. 创建会话
    session := &Session{
        SessionID:    fmt.Sprintf("%d_%d_%d", userID, groupID, time.Now().Unix()),
        UserID:       userID,
        GroupID:      groupID,
        Username:     username,
        Language:     lang,
        RoundCount:   0,
        MaxRounds:    5,
        Messages:     []Message{},
        CreatedAt:    time.Now(),
        LastActiveAt: time.Now(),
        ExpireAt:     time.Now().Add(sm.sessionTimeout),
        Status:       "active",
    }
    
    // 4. 存储到Redis
    key := fmt.Sprintf("session:%d:%d", userID, groupID)
    data, _ := json.Marshal(session)
    sm.redis.Set(context.Background(), key, data, sm.sessionTimeout)
    
    // 5. 添加到活跃列表
    sm.redis.SAdd(context.Background(), fmt.Sprintf("active_sessions:%d", groupID), userID)
    
    return session, nil
}

// 处理消息
func (sm *SessionManager) HandleMessage(userID, groupID int64, message string) (*Response, error) {
    // 1. 获取或创建会话
    session, err := sm.GetSession(userID, groupID)
    if err != nil || session == nil {
        session, err = sm.CreateSession(userID, groupID, "")
        if err != nil {
            return nil, err
        }
    }
    
    // 2. 检查轮数限制
    if session.RoundCount >= session.MaxRounds {
        sm.CloseSession(userID, groupID)
        return &Response{
            Content: "本轮对话已结束，再次@我可开始新的对话~",
            Final:   true,
        }, nil
    }
    
    // 3. 添加用户消息
    session.Messages = append(session.Messages, Message{
        Role:      "user",
        Content:   message,
        Timestamp: time.Now(),
    })
    session.RoundCount++
    session.LastActiveAt = time.Now()
    
    // 4. 调用AI生成回复
    langConfig := LanguageConfigs[session.Language]
    aiResponse, err := sm.CallAI(session, langConfig)
    if err != nil {
        return nil, err
    }
    
    // 5. 添加AI回复
    session.Messages = append(session.Messages, Message{
        Role:      "assistant",
        Content:   aiResponse,
        Timestamp: time.Now(),
    })
    
    // 6. 更新会话
    sm.UpdateSession(session)
    
    // 7. 返回响应
    isFinal := session.RoundCount >= session.MaxRounds
    return &Response{
        Content: aiResponse,
        Round:   session.RoundCount,
        Final:   isFinal,
    }, nil
}

// 关闭会话
func (sm *SessionManager) CloseSession(userID, groupID int64) error {
    // 1. 标记为已完成
    session, _ := sm.GetSession(userID, groupID)
    if session != nil {
        session.Status = "completed"
        sm.SaveToDatabase(session) // 持久化到Supabase
    }
    
    // 2. 从Redis删除
    key := fmt.Sprintf("session:%d:%d", userID, groupID)
    sm.redis.Del(context.Background(), key)
    
    // 3. 从活跃列表移除
    sm.redis.SRem(context.Background(), fmt.Sprintf("active_sessions:%d", groupID), userID)
    
    return nil
}
```

### 2. Rate Limiter
```go
type RateLimiter struct {
    redis     *redis.Client
    ownerID   int64
}

// 检查配额
func (rl *RateLimiter) CheckQuota(userID int64) (bool, error) {
    // Owner无限制
    if userID == rl.ownerID {
        return true, nil
    }
    
    // 获取今日使用量
    date := time.Now().Format("2006-01-02")
    key := fmt.Sprintf("quota:%d:%s", userID, date)
    
    count, err := rl.redis.Get(context.Background(), key).Int()
    if err == redis.Nil {
        count = 0
    } else if err != nil {
        return false, err
    }
    
    // 检查限制 (每天10次)
    if count >= 10 {
        return false, errors.New("今日配额已用完，明天再来吧~")
    }
    
    return true, nil
}

// 增加使用计数
func (rl *RateLimiter) IncrementUsage(userID int64) error {
    // Owner不计数
    if userID == rl.ownerID {
        return nil
    }
    
    date := time.Now().Format("2006-01-02")
    key := fmt.Sprintf("quota:%d:%s", userID, date)
    
    // 递增
    rl.redis.Incr(context.Background(), key)
    
    // 设置过期时间 (24小时)
    rl.redis.Expire(context.Background(), key, 24*time.Hour)
    
    return nil
}

// 获取剩余配额
func (rl *RateLimiter) GetRemainingQuota(userID int64) int {
    if userID == rl.ownerID {
        return -1 // 无限制
    }
    
    date := time.Now().Format("2006-01-02")
    key := fmt.Sprintf("quota:%d:%s", userID, date)
    
    count, err := rl.redis.Get(context.Background(), key).Int()
    if err != nil {
        count = 0
    }
    
    remaining := 10 - count
    if remaining < 0 {
        remaining = 0
    }
    
    return remaining
}
```

### 3. Language Detector
```go
type LanguageDetector struct {
    redis *redis.Client
}

// 检测语言
func (ld *LanguageDetector) Detect(text string) string {
    // 简单规则检测
    
    // 检测繁体中文特征字
    traditionalChars := []rune{'繁', '體', '習', '學', '們', '個', '這', '來', '說', '國'}
    traditionalCount := 0
    for _, char := range text {
        for _, tc := range traditionalChars {
            if char == tc {
                traditionalCount++
            }
        }
    }
    
    if traditionalCount > 0 {
        return "zh-TW"
    }
    
    // 检测中文 (简体)
    chineseCount := 0
    for _, char := range text {
        if char >= 0x4E00 && char <= 0x9FA5 {
            chineseCount++
        }
    }
    
    if float64(chineseCount)/float64(len([]rune(text))) > 0.3 {
        return "zh-CN"
    }
    
    // 默认英文
    return "en"
}

// 获取用户语言（带缓存）
func (ld *LanguageDetector) GetUserLanguage(userID int64, defaultText string) string {
    key := fmt.Sprintf("lang:%d", userID)
    
    // 尝试从缓存读取
    lang, err := ld.redis.Get(context.Background(), key).Result()
    if err == nil && lang != "" {
        return lang
    }
    
    // 检测语言
    detected := ld.Detect(defaultText)
    
    // 缓存7天
    ld.redis.Set(context.Background(), key, detected, 7*24*time.Hour)
    
    return detected
}
```

## 📊 使用场景

### 场景1: 单用户对话
```
User A: @小爱 你好
Bot: 你好！我是小爱同学，有什么可以帮你的吗？ [1/5]

User A: 今天天气怎么样
Bot: 抱歉，我目前无法查询实时天气... [2/5]

User A: 讲个笑话
Bot: 好的！为什么番茄... [3/5]

... (继续到5轮)

User A: 还有呢
Bot: 本轮对话已结束，再次@我可开始新的对话~
```

### 场景2: 多用户并发对话
```
[时间 14:00:00]
User A: @小爱 你好           -> 创建Session A (轮数: 1/5)
Bot -> User A: 你好！

[时间 14:00:05]
User B: @小爱 问个问题       -> 创建Session B (轮数: 1/5)
Bot -> User B: 请说！

[时间 14:00:10]
User A: 继续刚才的话题       -> Session A (轮数: 2/5)
Bot -> User A: 好的...

[时间 14:00:15]
User B: 那个问题的答案       -> Session B (轮数: 2/5)
Bot -> User B: 让我想想...

互不干扰，各自维护5轮记忆！
```

### 场景3: 达到并发上限
```
当前活跃: User A, B, C, D, E (5个)

User F: @小爱 你好
Bot: 抱歉，当前群组对话人数已达上限(5人)，请稍后再试~

[User A的会话结束]

User F: @小爱 你好           -> 创建成功
Bot: 你好！...
```

### 场景4: 配额限制
```
User X (普通用户):
- 今日已使用: 9次
- 剩余: 1次

User X: @小爱 第10次提问
Bot: 回复... [这是今天最后一次啦！]

User X: @小爱 第11次
Bot: 抱歉，你今天的配额已用完(10次)，明天再来吧~ 🌙

Owner:
- 无限制！
```

### 场景5: 语言自适应
```
User (简体中文):
@小爱 你好
Bot: 你好！我是小爱~ (简洁回复, 800 tokens)

User (English):
@小爱 Hello
Bot: Hello! I'm Xiaoai, your friendly AI assistant... (详细回复, 1200 tokens)

User (繁體中文):
@小愛 你好
Bot: 你好！我是小愛~ (簡潔回覆, 800 tokens)
```

## 🚀 部署配置

### 环境变量
```env
# Bot配置
TELEGRAM_BOT_TOKEN=8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
BOT_OWNER_ID=你的TelegramID

# Redis配置
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Supabase配置
SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 会话配置
MAX_CONCURRENT_SESSIONS=5
SESSION_TIMEOUT_MINUTES=30
MAX_ROUNDS_PER_SESSION=5

# 限流配置
DAILY_QUOTA_PER_USER=10
OWNER_UNLIMITED=true

# AI配置
GEMINI_API_KEYS=key1,key2,key3...
```

### 数据库表结构 (Supabase)
```sql
-- 会话历史表
CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    username VARCHAR(100),
    language VARCHAR(10),
    round_count INT DEFAULT 0,
    max_rounds INT DEFAULT 5,
    messages JSONB,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    INDEX idx_user_group (user_id, group_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
);

-- 用户配额表
CREATE TABLE user_quotas (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(100),
    is_owner BOOLEAN DEFAULT FALSE,
    daily_limit INT DEFAULT 10,
    used_today INT DEFAULT 0,
    last_reset_date DATE,
    total_calls INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 统计表
CREATE TABLE usage_stats (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    group_id BIGINT,
    session_id VARCHAR(100),
    rounds INT,
    tokens_used INT,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user (user_id),
    INDEX idx_date (created_at DESC)
);
```

## 📈 性能优化

1. **Redis缓存优先**
   - 所有活跃会话存Redis
   - 30分钟后自动过期
   - Supabase仅存历史记录

2. **Token压缩**
   - 短消息(<50字)等待后续
   - 智能合并上下文
   - 只保留最近3轮完整历史

3. **并发控制**
   - 每个群组最多5个并发
   - 使用Redis Set原子操作
   - 防止雪崩

4. **语言检测缓存**
   - 检测一次缓存7天
   - 减少重复计算

## ✅ 测试用例

```bash
# 1. 单用户5轮对话
# 2. 5个用户并发对话
# 3. 第6个用户被拒绝
# 4. 用户达到日配额
# 5. Owner无限制
# 6. 会话30分钟过期
# 7. 语言自动识别
# 8. 中英文回复长度不同
```

---

**设计完成**: 2025-11-09  
**核心模块**: Session Manager + Rate Limiter + Language Detector  
**并发支持**: 5用户 × 5轮 = 25个活跃对话  
**配额控制**: 10次/天 (Owner无限)  
**语言支持**: 简体/繁体/英文 自适应 🍄
