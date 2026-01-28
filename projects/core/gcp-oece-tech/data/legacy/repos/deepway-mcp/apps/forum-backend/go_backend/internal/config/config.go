package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// ModelType 模型类型
type ModelType string

const (
	ModelFlashLite ModelType = "gemini-2.0-flash-exp"
	ModelFlash     ModelType = "gemini-2.5-flash"
	ModelPro       ModelType = "gemini-2.5-pro"
)

// TaskType 任务类型
type TaskType string

const (
	TaskChat    TaskType = "chat"
	TaskGroup   TaskType = "group"
	TaskSimple  TaskType = "simple"
	TaskComplex TaskType = "complex"
)

// UserRole 用户角色
type UserRole string

const (
	RoleOwner   UserRole = "owner"
	RoleVIP     UserRole = "vip"
	RolePremium UserRole = "premium"
	RoleNormal  UserRole = "normal"
	RoleGuest   UserRole = "guest"
)

// ModelConfig 模型配置
type ModelConfig struct {
	Name         string
	DailyLimit   int
	MinuteLimit  int
	Priority     int
	CooldownSecs int
}

// KeyGroupConfig API密钥组配置
type KeyGroupConfig struct {
	Name      string
	Keys      []string
	Role      UserRole
	RPMLimit  int
	MaxErrors int
}

// Config 全局配置
type Config struct {
	// Telegram
	TelegramToken   string
	TelegramBotName string
	OwnerUsername   string
	OwnerID         int64

	// Gemini API Keys
	RouterKeys map[string]string
	KeyGroups  map[string]KeyGroupConfig

	// 模型配置
	Models map[ModelType]ModelConfig

	// 任务路由规则
	TaskRouting map[TaskType]ModelType

	// Supabase
	SupabaseURL string
	SupabaseKey string

	// Redis
	RedisHost string
	RedisPort int
	RedisDB   int

	// 速率限制
	RateLimitBuffer float64
	CooldownSeconds int
	MaxConcurrent   int

	// 日志
	LogLevel string
}

// NewConfig 创建配置
func NewConfig() (*Config, error) {
	cfg := &Config{
		// Telegram
		TelegramToken:   getEnvOrDefault("TELEGRAM_BOT_SVSKILO_TOKEN", ""),
		TelegramBotName: getEnvOrDefault("TELEGRAM_BOT_SVSKILO_NAME", "svskilo_bot"),
		OwnerUsername:   "svskilo",

		// 路由器密钥
		RouterKeys: map[string]string{
			"router_a": getEnvOrDefault("ROUTER_KEY_A", "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA"),
			"router_b": getEnvOrDefault("ROUTER_KEY_B", "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA"),
		},

		// 密钥组配置
		KeyGroups: initializeKeyGroups(),

		// 模型配置
		Models: map[ModelType]ModelConfig{
			ModelFlashLite: {
				Name:        string(ModelFlashLite),
				DailyLimit:  1000,
				Priority:    0,
				CooldownSecs: 10,
			},
			ModelFlash: {
				Name:        string(ModelFlash),
				DailyLimit:  250,
				Priority:    1,
				CooldownSecs: 30,
			},
			ModelPro: {
				Name:         string(ModelPro),
				DailyLimit:   50,
				MinuteLimit:  2,
				Priority:     2,
				CooldownSecs: 60,
			},
		},

		// 任务路由
		TaskRouting: map[TaskType]ModelType{
			TaskChat:    ModelFlashLite,
			TaskGroup:   ModelFlashLite,
			TaskSimple:  ModelFlash,
			TaskComplex: ModelPro,
		},

		// Supabase
		SupabaseURL: getEnvOrDefault("SUPABASE_URL", getEnvOrDefault("NEXT_PUBLIC_SUPABASE_URL", "")),
		SupabaseKey: getSupabaseKey(),

		// Redis
		RedisHost: getEnvOrDefault("REDIS_HOST", "localhost"),
		RedisPort: getEnvAsInt("REDIS_PORT", 6379),
		RedisDB:   getEnvAsInt("REDIS_DB", 0),

		// 速率限制
		RateLimitBuffer: 0.8,
		CooldownSeconds: 30,
		MaxConcurrent:   5,

		// 日志
		LogLevel: getEnvOrDefault("LOG_LEVEL", "INFO"),
	}

	return cfg, cfg.Validate()
}

// initializeKeyGroups 初始化密钥组
func initializeKeyGroups() map[string]KeyGroupConfig {
	return map[string]KeyGroupConfig{
		"group_a": {
			Name: "VIP/Owner专用组",
			Role: RoleOwner,
			Keys: strings.Split(getEnvOrDefault("GROUP_A_KEYS",
				"AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU,AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8,AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs"), ","),
			RPMLimit:  10,
			MaxErrors: 3,
		},
		"group_b": {
			Name: "Premium用户组",
			Role: RolePremium,
			Keys: strings.Split(getEnvOrDefault("GROUP_B_KEYS",
				"AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg,AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU,AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0"), ","),
			RPMLimit:  10,
			MaxErrors: 3,
		},
		"group_c": {
			Name: "普通会员组",
			Role: RoleNormal,
			Keys: strings.Split(getEnvOrDefault("GROUP_C_KEYS",
				"AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A,AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc,AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw"), ","),
			RPMLimit:  10,
			MaxErrors: 3,
		},
		"group_d": {
			Name: "游客/备用组",
			Role: RoleGuest,
			Keys: strings.Split(getEnvOrDefault("GROUP_D_KEYS",
				"AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4,AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE"), ","),
			RPMLimit:  10,
			MaxErrors: 3,
		},
	}
}

// Validate 验证配置
func (c *Config) Validate() error {
	if c.TelegramToken == "" {
		return fmt.Errorf("TELEGRAM_TOKEN is required")
	}

	if len(c.RouterKeys) == 0 {
		return fmt.Errorf("at least one router key is required")
	}

	if len(c.KeyGroups) == 0 {
		return fmt.Errorf("at least one key group is required")
	}

	return nil
}

// Helper functions
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getSupabaseKey() string {
	keys := []string{
		"SUPABASE_SERVICE_ROLE_KEY",
		"SUPABASE_KEY",
		"SUPABASE_ANON_KEY",
		"NEXT_PUBLIC_SUPABASE_ANON_KEY",
	}
	for _, key := range keys {
		if value := os.Getenv(key); value != "" {
			return value
		}
	}
	return ""
}
