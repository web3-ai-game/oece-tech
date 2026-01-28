package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

// MemorySystem 记忆系统
type MemorySystem struct {
	redis      *redis.Client
	ctx        context.Context
	supabase   *SupabaseClient // 后续实现
}

// Memory 记忆单元
type Memory struct {
	ID          string    `json:"id"`
	UserID      int64     `json:"user_id"`
	Type        string    `json:"type"` // happy, intimate, milestone
	Content     string    `json:"content"`
	Emotion     string    `json:"emotion"`
	Importance  int       `json:"importance"` // 1-10
	CreatedAt   time.Time `json:"created_at"`
	Tags        []string  `json:"tags"`
}

// Relationship 关系状态
type Relationship struct {
	UserID          int64              `json:"user_id"`
	IntimacyLevel   int                `json:"intimacy_level"`   // 0-100
	TrustLevel      int                `json:"trust_level"`      // 0-100
	AffectionLevel  int                `json:"affection_level"`  // 0-100
	FirstMeet       time.Time          `json:"first_meet"`
	MilestoneDates  map[string]time.Time `json:"milestone_dates"`
	SpecialMemories []Memory           `json:"special_memories"`
	LastInteraction time.Time          `json:"last_interaction"`
}

// ChatHistory 聊天历史
type ChatHistory struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Message   string    `json:"message"`
	Response  string    `json:"response"`
	Emotion   string    `json:"emotion"`
	Scene     string    `json:"scene"`
	ModelUsed string    `json:"model_used"`
	CreatedAt time.Time `json:"created_at"`
	Metadata  map[string]interface{} `json:"metadata"`
}

// NewMemorySystem 创建记忆系统
func NewMemorySystem(redis *redis.Client) *MemorySystem {
	return &MemorySystem{
		redis: redis,
		ctx:   context.Background(),
	}
}

// AddMessage 添加消息到历史
func (ms *MemorySystem) AddMessage(userID int64, message, response, scene string) error {
	history := ChatHistory{
		ID:        time.Now().UnixNano(),
		UserID:    userID,
		Message:   message,
		Response:  response,
		Scene:     scene,
		CreatedAt: time.Now(),
	}
	
	// 存储到Redis (短期)
	key := fmt.Sprintf("chat:history:%d", userID)
	data, _ := json.Marshal(history)
	ms.redis.LPush(ms.ctx, key, data)
	ms.redis.LTrim(ms.ctx, key, 0, 99) // 保留最近100条
	ms.redis.Expire(ms.ctx, key, 7*24*time.Hour) // 7天过期
	
	// TODO: 异步存储到Supabase (长期)
	
	// 更新最后互动时间
	ms.UpdateLastInteraction(userID)
	
	// 检查是否需要创建特殊记忆
	ms.checkForSpecialMemory(userID, message, response, scene)
	
	return nil
}

// GetRecentMessages 获取最近消息
func (ms *MemorySystem) GetRecentMessages(userID int64, count int) []Message {
	key := fmt.Sprintf("chat:history:%d", userID)
	
	results, err := ms.redis.LRange(ms.ctx, key, 0, int64(count*2-1)).Result()
	if err != nil || len(results) == 0 {
		return []Message{}
	}
	
	messages := []Message{}
	for i := len(results) - 1; i >= 0; i-- {
		var history ChatHistory
		if err := json.Unmarshal([]byte(results[i]), &history); err == nil {
			// 用户消息
			messages = append(messages, Message{
				Role:      "user",
				Content:   history.Message,
				Timestamp: history.CreatedAt,
			})
			// AI回复
			messages = append(messages, Message{
				Role:      "assistant",
				Content:   history.Response,
				Timestamp: history.CreatedAt,
			})
		}
	}
	
	return messages
}

// GetRelationship 获取关系状态
func (ms *MemorySystem) GetRelationship(userID int64) (*Relationship, error) {
	key := fmt.Sprintf("relationship:%d", userID)
	
	data, err := ms.redis.Get(ms.ctx, key).Result()
	if err == redis.Nil {
		// 新用户，创建关系
		rel := &Relationship{
			UserID:          userID,
			IntimacyLevel:   10, // 初始亲密度
			TrustLevel:      20,
			AffectionLevel:  30,
			FirstMeet:       time.Now(),
			MilestoneDates:  make(map[string]time.Time),
			SpecialMemories: []Memory{},
			LastInteraction: time.Now(),
		}
		ms.SaveRelationship(rel)
		return rel, nil
	} else if err != nil {
		return nil, err
	}
	
	var rel Relationship
	err = json.Unmarshal([]byte(data), &rel)
	return &rel, err
}

// SaveRelationship 保存关系状态
func (ms *MemorySystem) SaveRelationship(rel *Relationship) error {
	key := fmt.Sprintf("relationship:%d", rel.UserID)
	data, _ := json.Marshal(rel)
	return ms.redis.Set(ms.ctx, key, data, 0).Err()
}

// UpdateIntimacy 更新亲密度
func (ms *MemorySystem) UpdateIntimacy(userID int64, delta int) error {
	rel, err := ms.GetRelationship(userID)
	if err != nil {
		return err
	}
	
	rel.IntimacyLevel = min(100, max(0, rel.IntimacyLevel+delta))
	
	// 检查里程碑
	if rel.IntimacyLevel >= 50 && rel.MilestoneDates["intimacy_50"] == (time.Time{}) {
		rel.MilestoneDates["intimacy_50"] = time.Now()
		ms.CreateMemory(userID, "milestone", "我们的关系更进一步了！", 8)
	}
	
	if rel.IntimacyLevel >= 80 && rel.MilestoneDates["intimacy_80"] == (time.Time{}) {
		rel.MilestoneDates["intimacy_80"] = time.Now()
		ms.CreateMemory(userID, "milestone", "我们已经这么亲密了呢~", 9)
	}
	
	return ms.SaveRelationship(rel)
}

// CreateMemory 创建特殊记忆
func (ms *MemorySystem) CreateMemory(userID int64, memType, content string, importance int) error {
	memory := Memory{
		ID:         fmt.Sprintf("mem_%d_%d", userID, time.Now().UnixNano()),
		UserID:     userID,
		Type:       memType,
		Content:    content,
		Importance: importance,
		CreatedAt:  time.Now(),
	}
	
	// 添加到关系记忆中
	rel, _ := ms.GetRelationship(userID)
	if rel != nil {
		rel.SpecialMemories = append(rel.SpecialMemories, memory)
		// 只保留最重要的20个记忆
		if len(rel.SpecialMemories) > 20 {
			rel.SpecialMemories = rel.SpecialMemories[len(rel.SpecialMemories)-20:]
		}
		ms.SaveRelationship(rel)
	}
	
	// 存储到记忆列表
	key := fmt.Sprintf("memories:%d", userID)
	data, _ := json.Marshal(memory)
	ms.redis.ZAdd(ms.ctx, key, &redis.Z{
		Score:  float64(importance),
		Member: data,
	})
	
	return nil
}

// GetSpecialMemories 获取特殊记忆
func (ms *MemorySystem) GetSpecialMemories(userID int64, count int) []Memory {
	key := fmt.Sprintf("memories:%d", userID)
	
	// 按重要性获取记忆
	results, _ := ms.redis.ZRevRangeWithScores(ms.ctx, key, 0, int64(count-1)).Result()
	
	memories := []Memory{}
	for _, z := range results {
		var memory Memory
		if err := json.Unmarshal([]byte(z.Member.(string)), &memory); err == nil {
			memories = append(memories, memory)
		}
	}
	
	return memories
}

// checkForSpecialMemory 检查是否需要创建特殊记忆
func (ms *MemorySystem) checkForSpecialMemory(userID int64, message, response, scene string) {
	// 检查关键词触发特殊记忆
	specialKeywords := map[string]int{
		"爱你":   10,
		"喜欢你":  8,
		"想你":   7,
		"永远":   9,
		"在一起":  9,
		"承诺":   8,
		"约定":   7,
	}
	
	for keyword, importance := range specialKeywords {
		if containsKeyword(message, keyword) || containsKeyword(response, keyword) {
			content := fmt.Sprintf("主人说了「%s」，人家好开心！", keyword)
			ms.CreateMemory(userID, "happy", content, importance)
			ms.UpdateIntimacy(userID, 5)
			break
		}
	}
	
	// 深夜对话记忆
	hour := time.Now().Hour()
	if (hour >= 23 || hour < 2) && scene == "intimate" {
		ms.CreateMemory(userID, "intimate", "深夜的悄悄话", 6)
		ms.UpdateIntimacy(userID, 3)
	}
}

// UpdateLastInteraction 更新最后互动时间
func (ms *MemorySystem) UpdateLastInteraction(userID int64) {
	rel, _ := ms.GetRelationship(userID)
	if rel != nil {
		// 检查距离上次互动的时间
		timeSinceLastInteraction := time.Since(rel.LastInteraction)
		
		if timeSinceLastInteraction > 24*time.Hour {
			// 超过一天没互动
			ms.CreateMemory(userID, "reunion", "主人终于回来了，好想你！", 7)
		}
		
		rel.LastInteraction = time.Now()
		ms.SaveRelationship(rel)
	}
}

// GetEmotionalContext 获取情感上下文
func (ms *MemorySystem) GetEmotionalContext(userID int64) string {
	rel, _ := ms.GetRelationship(userID)
	if rel == nil {
		return "初次见面"
	}
	
	// 根据亲密度返回不同的情感状态
	if rel.IntimacyLevel >= 80 {
		return "深爱着主人"
	} else if rel.IntimacyLevel >= 60 {
		return "非常喜欢主人"
	} else if rel.IntimacyLevel >= 40 {
		return "对主人有好感"
	} else if rel.IntimacyLevel >= 20 {
		return "想更了解主人"
	}
	return "刚认识主人"
}

// GetRelationshipSummary 获取关系摘要
func (ms *MemorySystem) GetRelationshipSummary(userID int64) string {
	rel, _ := ms.GetRelationship(userID)
	if rel == nil {
		return "我们刚刚认识呢~"
	}
	
	daysTogether := int(time.Since(rel.FirstMeet).Hours() / 24)
	memories := ms.GetSpecialMemories(userID, 3)
	
	summary := fmt.Sprintf(
		"我们已经认识%d天了！\n"+
		"亲密度: %d/100 💕\n"+
		"信任度: %d/100 🤝\n"+
		"好感度: %d/100 ❤️\n",
		daysTogether,
		rel.IntimacyLevel,
		rel.TrustLevel,
		rel.AffectionLevel,
	)
	
	if len(memories) > 0 {
		summary += "\n最珍贵的回忆:\n"
		for i, mem := range memories {
			summary += fmt.Sprintf("%d. %s\n", i+1, mem.Content)
		}
	}
	
	return summary
}

// 辅助函数
func containsKeyword(text, keyword string) bool {
	return strings.Contains(strings.ToLower(text), strings.ToLower(keyword))
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
