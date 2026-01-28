package database

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

// ChatHistory 聊天历史记录
type ChatHistory struct {
	ID           int64                  `json:"id,omitempty" db:"id"`
	ChatID       int64                  `json:"chat_id" db:"chat_id"`
	UserID       int64                  `json:"user_id" db:"user_id"`
	Username     string                 `json:"username" db:"username"`
	MessageText  string                 `json:"message_text" db:"message_text"`
	ResponseText string                 `json:"response_text" db:"response_text"`
	ModelUsed    string                 `json:"model_used" db:"model_used"`
	Metadata     map[string]interface{} `json:"metadata" db:"metadata"`
	CreatedAt    time.Time              `json:"created_at" db:"created_at"`
}

// UserRegistry 用户注册信息
type UserRegistry struct {
	ID                 int64     `json:"id,omitempty" db:"id"`
	UserID             int64     `json:"user_id" db:"user_id"`
	Username           string    `json:"username" db:"username"`
	FirstName          string    `json:"first_name" db:"first_name"`
	ChatID             int64     `json:"chat_id" db:"chat_id"`
	TriggeredByKeyword string    `json:"triggered_by_keyword" db:"triggered_by_keyword"`
	TriggerCount       int       `json:"trigger_count" db:"trigger_count"`
	LastTriggeredAt    time.Time `json:"last_triggered_at" db:"last_triggered_at"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
}

// Database 数据库管理器
type Database struct {
	client        *supabase.Client
	logger        *zap.Logger
	memoryStorage *MemoryStorage
	mu            sync.RWMutex
}

// MemoryStorage 内存存储（当Supabase不可用时的降级方案）
type MemoryStorage struct {
	ChatHistory  []ChatHistory
	UserRegistry map[string]UserRegistry // key: userID_chatID
	mu           sync.RWMutex
}

// NewDatabase 创建数据库实例
func NewDatabase(url, key string, logger *zap.Logger) (*Database, error) {
	db := &Database{
		logger: logger,
		memoryStorage: &MemoryStorage{
			ChatHistory:  make([]ChatHistory, 0),
			UserRegistry: make(map[string]UserRegistry),
		},
	}

	if url != "" && key != "" {
		client, err := supabase.NewClient(url, key, nil)
		if err != nil {
			logger.Warn("Failed to create Supabase client, using memory storage",
				zap.Error(err))
			return db, nil
		}
		db.client = client
		logger.Info("✅ Supabase client initialized")
	} else {
		logger.Warn("⚠️ Supabase not configured, using in-memory storage")
	}

	return db, nil
}

// SaveChatHistory 保存聊天记录
func (db *Database) SaveChatHistory(ctx context.Context, chat ChatHistory) error {
	if db.client != nil {
		// Supabase存储
		metadata, _ := json.Marshal(chat.Metadata)
		_, _, err := db.client.From("chat_history").
			Insert(map[string]interface{}{
				"chat_id":       chat.ChatID,
				"user_id":       chat.UserID,
				"username":      chat.Username,
				"message_text":  chat.MessageText,
				"response_text": chat.ResponseText,
				"model_used":    chat.ModelUsed,
				"metadata":      metadata,
				"created_at":    chat.CreatedAt,
			}, false, "", "", "").
			Execute()

		if err != nil {
			db.logger.Error("Failed to save chat history", zap.Error(err))
			return err
		}

		db.logger.Info("💾 Saved chat history",
			zap.Int64("user_id", chat.UserID),
			zap.String("model", chat.ModelUsed))
		return nil
	}

	// 内存存储
	db.memoryStorage.mu.Lock()
	defer db.memoryStorage.mu.Unlock()

	db.memoryStorage.ChatHistory = append(db.memoryStorage.ChatHistory, chat)

	// 只保留最近1000条
	if len(db.memoryStorage.ChatHistory) > 1000 {
		db.memoryStorage.ChatHistory = db.memoryStorage.ChatHistory[len(db.memoryStorage.ChatHistory)-1000:]
	}

	return nil
}

// GetUserHistory 获取用户聊天历史
func (db *Database) GetUserHistory(ctx context.Context, userID int64, limit int) ([]ChatHistory, error) {
	if db.client != nil {
		// 从Supabase获取
		var results []ChatHistory
		_, err := db.client.From("chat_history").
			Select("*", "", false).
			Eq("user_id", fmt.Sprintf("%d", userID)).
			Order("created_at", &supabase.OrderOpts{Ascending: false}).
			Limit(limit, "").
			Execute().
			Decode(&results)

		if err != nil {
			db.logger.Error("Failed to get user history", zap.Error(err))
			return nil, err
		}

		return results, nil
	}

	// 从内存获取
	db.memoryStorage.mu.RLock()
	defer db.memoryStorage.mu.RUnlock()

	var userChats []ChatHistory
	for _, chat := range db.memoryStorage.ChatHistory {
		if chat.UserID == userID {
			userChats = append(userChats, chat)
		}
	}

	// 按时间排序并限制数量
	if len(userChats) > limit {
		userChats = userChats[len(userChats)-limit:]
	}

	return userChats, nil
}

// RegisterUser 注册用户
func (db *Database) RegisterUser(ctx context.Context, user UserRegistry) error {
	key := fmt.Sprintf("%d_%d", user.UserID, user.ChatID)

	if db.client != nil {
		// 检查是否存在
		var existing []UserRegistry
		_, err := db.client.From("user_registry").
			Select("*", "", false).
			Eq("user_id", fmt.Sprintf("%d", user.UserID)).
			Eq("chat_id", fmt.Sprintf("%d", user.ChatID)).
			Execute().
			Decode(&existing)

		if err != nil {
			db.logger.Error("Failed to check existing user", zap.Error(err))
			return err
		}

		if len(existing) > 0 {
			// 更新触发次数
			_, _, err = db.client.From("user_registry").
				Update(map[string]interface{}{
					"trigger_count":     existing[0].TriggerCount + 1,
					"last_triggered_at": time.Now(),
				}, "", "").
				Eq("user_id", fmt.Sprintf("%d", user.UserID)).
				Eq("chat_id", fmt.Sprintf("%d", user.ChatID)).
				Execute()
		} else {
			// 插入新记录
			_, _, err = db.client.From("user_registry").
				Insert(map[string]interface{}{
					"user_id":              user.UserID,
					"username":             user.Username,
					"first_name":           user.FirstName,
					"chat_id":              user.ChatID,
					"triggered_by_keyword": user.TriggeredByKeyword,
					"trigger_count":        1,
					"last_triggered_at":    time.Now(),
					"created_at":           time.Now(),
				}, false, "", "", "").
				Execute()
		}

		if err != nil {
			db.logger.Error("Failed to register user", zap.Error(err))
			return err
		}

		db.logger.Info("📝 Registered user",
			zap.String("username", user.Username),
			zap.Int64("user_id", user.UserID))
		return nil
	}

	// 内存存储
	db.memoryStorage.mu.Lock()
	defer db.memoryStorage.mu.Unlock()

	if existing, exists := db.memoryStorage.UserRegistry[key]; exists {
		existing.TriggerCount++
		existing.LastTriggeredAt = time.Now()
		db.memoryStorage.UserRegistry[key] = existing
	} else {
		user.TriggerCount = 1
		user.LastTriggeredAt = time.Now()
		user.CreatedAt = time.Now()
		db.memoryStorage.UserRegistry[key] = user
	}

	return nil
}

// GetUserInfo 获取用户信息
func (db *Database) GetUserInfo(ctx context.Context, userID, chatID int64) (*UserRegistry, error) {
	if db.client != nil {
		var results []UserRegistry
		_, err := db.client.From("user_registry").
			Select("*", "", false).
			Eq("user_id", fmt.Sprintf("%d", userID)).
			Eq("chat_id", fmt.Sprintf("%d", chatID)).
			Execute().
			Decode(&results)

		if err != nil {
			db.logger.Error("Failed to get user info", zap.Error(err))
			return nil, err
		}

		if len(results) > 0 {
			return &results[0], nil
		}
		return nil, nil
	}

	// 从内存获取
	db.memoryStorage.mu.RLock()
	defer db.memoryStorage.mu.RUnlock()

	key := fmt.Sprintf("%d_%d", userID, chatID)
	if user, exists := db.memoryStorage.UserRegistry[key]; exists {
		return &user, nil
	}

	return nil, nil
}

// GetActiveUsersCount 获取活跃用户数
func (db *Database) GetActiveUsersCount(ctx context.Context, chatID int64) (int, error) {
	if db.client != nil {
		var results []struct {
			UserID int64 `json:"user_id"`
		}

		_, err := db.client.From("chat_history").
			Select("user_id", "", false).
			Eq("chat_id", fmt.Sprintf("%d", chatID)).
			Execute().
			Decode(&results)

		if err != nil {
			db.logger.Error("Failed to get active users count", zap.Error(err))
			return 0, err
		}

		// 去重计数
		uniqueUsers := make(map[int64]bool)
		for _, r := range results {
			uniqueUsers[r.UserID] = true
		}

		return len(uniqueUsers), nil
	}

	// 从内存获取
	db.memoryStorage.mu.RLock()
	defer db.memoryStorage.mu.RUnlock()

	uniqueUsers := make(map[int64]bool)
	for _, chat := range db.memoryStorage.ChatHistory {
		if chat.ChatID == chatID {
			uniqueUsers[chat.UserID] = true
		}
	}

	return len(uniqueUsers), nil
}
