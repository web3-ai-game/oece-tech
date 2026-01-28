package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

type GeminiRouter struct {
	keys        []string
	currentIdx  int
	mu          sync.Mutex
	client      *http.Client
}

type GeminiRequest struct {
	Contents []GeminiContent `json:"contents"`
	GenerationConfig GeminiConfig `json:"generationConfig"`
}

type GeminiContent struct {
	Role  string        `json:"role"`
	Parts []GeminiPart `json:"parts"`
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiConfig struct {
	Temperature     float64 `json:"temperature"`
	MaxOutputTokens int     `json:"maxOutputTokens"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func NewGeminiRouter(keys []string) *GeminiRouter {
	rand.Seed(time.Now().UnixNano())
	return &GeminiRouter{
		keys:       keys,
		currentIdx: rand.Intn(len(keys)),
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// 生成回复
func (gr *GeminiRouter) Generate(messages []Message, langConfig LanguageConfig) (string, error) {
	// 准备内容
	contents := []GeminiContent{}
	
	// 系统提示词
	contents = append(contents, GeminiContent{
		Role: "user",
		Parts: []GeminiPart{
			{Text: langConfig.SystemPrompt},
		},
	})
	contents = append(contents, GeminiContent{
		Role: "model",
		Parts: []GeminiPart{
			{Text: "好的，我明白了！我会按照你的要求来回复。"},
		},
	})

	// 添加对话历史（最近3轮）
	start := len(messages) - 6 // 3轮 = 6条消息 (user + assistant)
	if start < 0 {
		start = 0
	}
	
	for _, msg := range messages[start:] {
		role := "user"
		if msg.Role == "assistant" {
			role = "model"
		}
		contents = append(contents, GeminiContent{
			Role: role,
			Parts: []GeminiPart{
				{Text: msg.Content},
			},
		})
	}

	// 准备请求
	reqBody := GeminiRequest{
		Contents: contents,
		GenerationConfig: GeminiConfig{
			Temperature:     0.8,
			MaxOutputTokens: langConfig.MaxTokens,
		},
	}

	// 尝试所有Keys
	var lastErr error
	for i := 0; i < len(gr.keys); i++ {
		key := gr.getNextKey()
		response, err := gr.callGemini(key, reqBody)
		if err == nil {
			return response, nil
		}
		lastErr = err
	}

	return "", fmt.Errorf("所有API Keys都失败了: %v", lastErr)
}

// 调用Gemini API
func (gr *GeminiRouter) callGemini(apiKey string, reqBody GeminiRequest) (string, error) {
	// 使用gemini-pro模型，支持更高的token限制(1000)
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=%s", apiKey)

	jsonData, _ := json.Marshal(reqBody)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := gr.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("API错误 %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var geminiResp GeminiResponse
	if err := json.Unmarshal(body, &geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("响应格式错误")
	}

	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}

// 获取下一个Key (轮询)
func (gr *GeminiRouter) getNextKey() string {
	gr.mu.Lock()
	defer gr.mu.Unlock()

	key := gr.keys[gr.currentIdx]
	gr.currentIdx = (gr.currentIdx + 1) % len(gr.keys)
	return key
}
