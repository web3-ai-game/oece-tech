package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type Session struct {
	SessionID    string    `json:"session_id"`
	UserID       int64     `json:"user_id"`
	GroupID      int64     `json:"group_id"`
	Username     string    `json:"username"`
	Language     string    `json:"language"`
	RoundCount   int       `json:"round_count"`
	MaxRounds    int       `json:"max_rounds"`
	Messages     []Message `json:"messages"`
	CreatedAt    time.Time `json:"created_at"`
	LastActiveAt time.Time `json:"last_active_at"`
	Status       string    `json:"status"`
}

type Message struct {
	Role      string    `json:"role"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

type Response struct {
	Content string `json:"content"`
	Round   int    `json:"round"`
	Final   bool   `json:"final"`
}

type SessionManager struct {
	redis         *redis.Client
	maxConcurrent int
	timeout       time.Duration
}

func NewSessionManager(redis *redis.Client) *SessionManager {
	return &SessionManager{
		redis:         redis,
		maxConcurrent: 5,
		timeout:       30 * time.Minute,
	}
}

// 创建会话（支持自定义轮数）
func (sm *SessionManager) CreateSessionWithRounds(userID, groupID int64, username string, lang string, maxRounds int) (*Session, error) {
	// 检查活跃会话数量
	count := sm.GetActiveSessionsCount(groupID)
	if count >= sm.maxConcurrent {
		return nil, fmt.Errorf("群组会话数量已达上限(5个)")
	}

	// 如果是无限记忆模式，设置一个很大的数
	if maxRounds == -1 {
		maxRounds = 999999
	}

	session := &Session{
		SessionID:    fmt.Sprintf("%d_%d_%d", userID, groupID, time.Now().Unix()),
		UserID:       userID,
		GroupID:      groupID,
		Username:     username,
		Language:     lang,
		RoundCount:   0,
		MaxRounds:    maxRounds,
		Messages:     []Message{},
		CreatedAt:    time.Now(),
		LastActiveAt: time.Now(),
		Status:       "active",
	}

	// 存储到Redis
	key := fmt.Sprintf("session:%d:%d", userID, groupID)
	data, _ := json.Marshal(session)
	ctx := context.Background()
	sm.redis.Set(ctx, key, data, sm.timeout)

	// 添加到活跃列表
	sm.redis.SAdd(ctx, fmt.Sprintf("active_sessions:%d", groupID), userID)

	return session, nil
}

// 获取会话
func (sm *SessionManager) GetSession(userID, groupID int64) (*Session, error) {
	key := fmt.Sprintf("session:%d:%d", userID, groupID)
	ctx := context.Background()

	data, err := sm.redis.Get(ctx, key).Result()
	if err == redis.Nil {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	var session Session
	if err := json.Unmarshal([]byte(data), &session); err != nil {
		return nil, err
	}

	return &session, nil
}

// 更新会话
func (sm *SessionManager) UpdateSession(session *Session) error {
	key := fmt.Sprintf("session:%d:%d", session.UserID, session.GroupID)
	data, _ := json.Marshal(session)
	ctx := context.Background()
	return sm.redis.Set(ctx, key, data, sm.timeout).Err()
}

// 关闭会话
func (sm *SessionManager) CloseSession(userID, groupID int64) error {
	key := fmt.Sprintf("session:%d:%d", userID, groupID)
	ctx := context.Background()
	sm.redis.Del(ctx, key)
	sm.redis.SRem(ctx, fmt.Sprintf("active_sessions:%d", groupID), userID)
	return nil
}

// 获取活跃会话数量
func (sm *SessionManager) GetActiveSessionsCount(groupID int64) int {
	ctx := context.Background()
	count, _ := sm.redis.SCard(ctx, fmt.Sprintf("active_sessions:%d", groupID)).Result()
	return int(count)
}

// 处理消息（支持自定义轮数）
func (sm *SessionManager) HandleMessageWithRounds(
	userID, groupID int64,
	username, message string,
	maxRounds int,
	langDetector *LanguageDetector,
	geminiRouter *GeminiRouter,
) (*Response, error) {
	// 获取或创建会话
	session, err := sm.GetSession(userID, groupID)
	if err != nil || session == nil {
		lang := langDetector.GetUserLanguage(userID, message)
		session, err = sm.CreateSessionWithRounds(userID, groupID, username, lang, maxRounds)
		if err != nil {
			return nil, err
		}
	}

	// Owner无限记忆模式
	if maxRounds == -1 {
		// 不检查轮数，直接处理
	} else if session.RoundCount >= session.MaxRounds {
		// 检查轮数限制
		sm.CloseSession(userID, groupID)
		return &Response{
			Content: "本轮对话已结束~",
			Round:   session.MaxRounds,
			Final:   true,
		}, nil
	}

	// 添加用户消息
	session.Messages = append(session.Messages, Message{
		Role:      "user",
		Content:   message,
		Timestamp: time.Now(),
	})
	session.RoundCount++
	session.LastActiveAt = time.Now()

	// 调用AI生成回复
	langConfig := GetLanguageConfig(session.Language)
	aiResponse, err := geminiRouter.Generate(session.Messages, langConfig)
	if err != nil {
		return nil, err
	}

	// 添加AI回复
	session.Messages = append(session.Messages, Message{
		Role:      "assistant",
		Content:   aiResponse,
		Timestamp: time.Now(),
	})

	// 更新会话
	sm.UpdateSession(session)

	// 检查是否结束
	isFinal := session.RoundCount >= session.MaxRounds
	if isFinal {
		sm.CloseSession(userID, groupID)
	}

	return &Response{
		Content: aiResponse,
		Round:   session.RoundCount,
		Final:   isFinal,
	}, nil
}
