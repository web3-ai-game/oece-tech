package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	// 服务器配置
	Port        string
	Environment string

	// 数据库
	DatabaseURL string

	// Firebase
	FirebaseCredFile string
	FirebaseProjectID string

	// Notion
	NotionToken string
	NotionDatabases map[string]string

	// 加密
	EncryptionKey string

	// Gemini API
	GeminiAPIKeys []string

	// 限流
	RateLimitPerMin int
	MaxConcurrent   int

	// 存储
	StorageBucket string
}

func LoadConfig() (*Config, error) {
	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENVIRONMENT", "development"),

		// 数据库
		DatabaseURL: getEnv("DATABASE_URL", ""),

		// Firebase
		FirebaseCredFile:  getEnv("FIREBASE_CRED_FILE", "./secrets/firebase.json"),
		FirebaseProjectID: getEnv("FIREBASE_PROJECT_ID", ""),

		// Notion
		NotionToken: getEnv("NOTION_TOKEN", ""),
		NotionDatabases: map[string]string{
			"tutorials": getEnv("NOTION_DB_TUTORIALS", ""),
			"docs":      getEnv("NOTION_DB_DOCS", ""),
			"faq":       getEnv("NOTION_DB_FAQ", ""),
		},

		// 加密
		EncryptionKey: getEnv("ENCRYPTION_KEY", ""),

		// Gemini
		GeminiAPIKeys: getEnvArray("GEMINI_API_KEYS", ","),

		// 限流
		RateLimitPerMin: getEnvAsInt("RATE_LIMIT_PER_MIN", 100),
		MaxConcurrent:   getEnvAsInt("MAX_CONCURRENT", 10),

		// 存储
		StorageBucket: getEnv("STORAGE_BUCKET", ""),
	}

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

func (c *Config) Validate() error {
	if c.Environment == "production" {
		if c.DatabaseURL == "" {
			return fmt.Errorf("DATABASE_URL is required in production")
		}
		if c.FirebaseProjectID == "" {
			return fmt.Errorf("FIREBASE_PROJECT_ID is required in production")
		}
		if c.EncryptionKey == "" {
			return fmt.Errorf("ENCRYPTION_KEY is required in production")
		}
	}
	return nil
}

// Helper functions
func getEnv(key, defaultValue string) string {
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

func getEnvArray(key, separator string) []string {
	value := os.Getenv(key)
	if value == "" {
		return []string{}
	}
	return strings.Split(value, separator)
}
