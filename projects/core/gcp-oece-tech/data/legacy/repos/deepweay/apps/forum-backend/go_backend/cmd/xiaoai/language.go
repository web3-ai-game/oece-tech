package main

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type LanguageConfig struct {
	Code               string
	Name               string
	ResponseMultiplier float64
	MaxTokens          int
	SystemPrompt       string
}

var LanguageConfigs = map[string]LanguageConfig{
	"zh-CN": {
		Code:               "zh-CN",
		Name:               "简体中文",
		ResponseMultiplier: 0.9,
		MaxTokens:          1000,
		SystemPrompt:       "你是小爱同学，一个友好、智能的AI助手。用简体中文回复，保持专业且温暖。",
	},
	"zh-TW": {
		Code:               "zh-TW",
		Name:               "繁體中文",
		ResponseMultiplier: 0.9,
		MaxTokens:          1000,
		SystemPrompt:       "你是小愛同學，一個友好、智能的AI助手。用繁體中文回覆，保持專業且溫暖。",
	},
	"en": {
		Code:               "en",
		Name:               "English",
		ResponseMultiplier: 1.3,
		MaxTokens:          1000,
		SystemPrompt:       "You are Xiaoai, a friendly and intelligent AI assistant. Reply in English with clear, professional, and helpful responses.",
	},
}

type LanguageDetector struct {
	redis *redis.Client
}

func NewLanguageDetector(redis *redis.Client) *LanguageDetector {
	return &LanguageDetector{
		redis: redis,
	}
}

// 检测语言
func (ld *LanguageDetector) Detect(text string) string {
	// 繁体中文特征字
	traditionalChars := []rune{'繁', '體', '習', '學', '們', '個', '這', '來', '說', '國', '會', '實', '擇', '變', '應'}
	traditionalCount := 0
	
	for _, char := range text {
		for _, tc := range traditionalChars {
			if char == tc {
				traditionalCount++
				break
			}
		}
	}

	if traditionalCount > 0 {
		return "zh-TW"
	}

	// 检测中文 (简体)
	chineseCount := 0
	totalRunes := 0
	for _, char := range text {
		totalRunes++
		if char >= 0x4E00 && char <= 0x9FA5 {
			chineseCount++
		}
	}

	if totalRunes > 0 && float64(chineseCount)/float64(totalRunes) > 0.3 {
		return "zh-CN"
	}

	// 默认英文
	return "en"
}

// 获取用户语言（带缓存）
func (ld *LanguageDetector) GetUserLanguage(userID int64, defaultText string) string {
	key := fmt.Sprintf("lang:%d", userID)
	ctx := context.Background()

	// 尝试从缓存读取
	lang, err := ld.redis.Get(ctx, key).Result()
	if err == nil && lang != "" {
		return lang
	}

	// 检测语言
	detected := ld.Detect(defaultText)

	// 缓存7天
	ld.redis.Set(ctx, key, detected, 7*24*time.Hour)

	return detected
}

// 获取语言配置
func GetLanguageConfig(langCode string) LanguageConfig {
	if config, ok := LanguageConfigs[langCode]; ok {
		return config
	}
	return LanguageConfigs["zh-CN"] // 默认简体中文
}
