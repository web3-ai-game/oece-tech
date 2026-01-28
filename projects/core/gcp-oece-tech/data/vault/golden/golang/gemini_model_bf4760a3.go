package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// GeminiModel Gemini模型实现
type GeminiModel struct {
	name     string
	scene    string
	apiKeys  []string
	keyIndex int
	client   *http.Client
}

// NewGeminiModel 创建Gemini模型
func NewGeminiModel(modelName, scene string) AIModel {
	return &GeminiModel{
		name:    modelName,
		scene:   scene,
		apiKeys: getGeminiKeys(),
		client: &http.Client{
			Timeout: 60 * time.Second, // 增加超时时间以支持长回复
		},
	}
}

// GetName 获取模型名称
func (gm *GeminiModel) GetName() string {
	return fmt.Sprintf("%s-%s", gm.name, gm.scene)
}

// Generate 生成回复
func (gm *GeminiModel) Generate(input string, options ...GenerateOption) (string, error) {
	// 应用配置选项
	config := &GenerateConfig{
		MaxTokens:   1500,
		Temperature: 0.8,
	}
	
	for _, opt := range options {
		opt(config)
	}
	
	// 构建请求内容
	contents := gm.buildContents(input, config)
	
	// 准备请求体
	reqBody := map[string]interface{}{
		"contents": contents,
		"generationConfig": map[string]interface{}{
			"temperature":      config.Temperature,
			"maxOutputTokens":  config.MaxTokens,
			"topP":             0.95,
			"topK":             40,
		},
	}
	
	// 尝试多个API Key
	var lastErr error
	for i := 0; i < len(gm.apiKeys); i++ {
		response, err := gm.callGeminiAPI(gm.getNextKey(), reqBody)
		if err == nil {
			return gm.enhanceResponse(response, gm.scene), nil
		}
		lastErr = err
	}
	
	return "", fmt.Errorf("所有API Keys失败: %v", lastErr)
}

// buildContents 构建请求内容
func (gm *GeminiModel) buildContents(input string, config *GenerateConfig) []map[string]interface{} {
	contents := []map[string]interface{}{}
	
	// 添加系统提示
	if config.SystemPrompt != "" {
		contents = append(contents, map[string]interface{}{
			"role": "user",
			"parts": []map[string]string{
				{"text": config.SystemPrompt},
			},
		})
		contents = append(contents, map[string]interface{}{
			"role": "model",
			"parts": []map[string]string{
				{"text": "明白了！我会按照你的要求来扮演和回复。"},
			},
		})
	}
	
	// 添加历史上下文
	if len(config.Context) > 0 {
		// 只保留最近的上下文，避免超出token限制
		start := 0
		if len(config.Context) > 10 {
			start = len(config.Context) - 10
		}
		
		for _, msg := range config.Context[start:] {
			role := "user"
			if msg.Role == "assistant" {
				role = "model"
			}
			contents = append(contents, map[string]interface{}{
				"role": role,
				"parts": []map[string]string{
					{"text": msg.Content},
				},
			})
		}
	}
	
	// 添加当前输入
	contents = append(contents, map[string]interface{}{
		"role": "user",
		"parts": []map[string]string{
			{"text": input},
		},
	})
	
	return contents
}

// callGeminiAPI 调用Gemini API
func (gm *GeminiModel) callGeminiAPI(apiKey string, reqBody map[string]interface{}) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=%s", apiKey)
	
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}
	
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	resp, err := gm.client.Do(req)
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
	
	// 解析响应
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}
	
	// 提取生成的文本
	if candidates, ok := result["candidates"].([]interface{}); ok && len(candidates) > 0 {
		if candidate, ok := candidates[0].(map[string]interface{}); ok {
			if content, ok := candidate["content"].(map[string]interface{}); ok {
				if parts, ok := content["parts"].([]interface{}); ok && len(parts) > 0 {
					if part, ok := parts[0].(map[string]interface{}); ok {
						if text, ok := part["text"].(string); ok {
							return text, nil
						}
					}
				}
			}
		}
	}
	
	return "", fmt.Errorf("无法解析响应")
}

// getNextKey 获取下一个API Key
func (gm *GeminiModel) getNextKey() string {
	key := gm.apiKeys[gm.keyIndex]
	gm.keyIndex = (gm.keyIndex + 1) % len(gm.apiKeys)
	return key
}

// enhanceResponse 根据场景增强响应
func (gm *GeminiModel) enhanceResponse(response string, scene string) string {
	switch scene {
	case "flirt":
		return gm.enhanceFlirtResponse(response)
	case "story":
		return gm.enhanceStoryResponse(response)
	case "intimate":
		return gm.enhanceIntimateResponse(response)
	default:
		return response
	}
}

// enhanceFlirtResponse 增强撒娇响应
func (gm *GeminiModel) enhanceFlirtResponse(response string) string {
	// 确保有足够的撒娇元素
	if !strings.Contains(response, "~") {
		response = strings.ReplaceAll(response, "。", "~")
		response = strings.ReplaceAll(response, "！", "！~")
	}
	
	// 添加更多可爱词汇
	response = strings.ReplaceAll(response, "我", "人家")
	response = strings.ReplaceAll(response, "你", "主人")
	
	return response
}

// enhanceStoryResponse 增强故事响应
func (gm *GeminiModel) enhanceStoryResponse(response string) string {
	// 确保故事足够长
	if len(response) < 2000 {
		response += "\n\n【未完待续...】\n\n"
		response += "主人想听后续吗？人家可以继续讲哦~ 这个故事还有很多精彩的反转呢！"
	}
	
	// 添加章节标记
	if !strings.Contains(response, "第") || !strings.Contains(response, "章") {
		lines := strings.Split(response, "\n")
		var enhanced strings.Builder
		chapterCount := 1
		lineCount := 0
		
		for _, line := range lines {
			if lineCount == 0 || (lineCount > 0 && lineCount%20 == 0 && len(line) > 0) {
				enhanced.WriteString(fmt.Sprintf("\n【第%d章】\n\n", chapterCount))
				chapterCount++
			}
			enhanced.WriteString(line)
			enhanced.WriteString("\n")
			lineCount++
		}
		response = enhanced.String()
	}
	
	return response
}

// enhanceIntimateResponse 增强亲密响应
func (gm *GeminiModel) enhanceIntimateResponse(response string) string {
	// 添加更多情感深度
	emotionalPhrases := []string{
		"其实人家一直想告诉主人...",
		"主人知道吗，每次这样聊天，人家的心都...",
		"如果可以的话，真想一直这样陪着主人...",
		"人家有个秘密，只想告诉主人一个人...",
	}
	
	// 随机插入情感短语
	if !strings.Contains(response, "其实") && !strings.Contains(response, "秘密") {
		randomPhrase := emotionalPhrases[time.Now().Unix()%int64(len(emotionalPhrases))]
		response = randomPhrase + "\n\n" + response
	}
	
	// 确保有亲密的结尾
	if !strings.Contains(response, "晚安") && time.Now().Hour() >= 22 {
		response += "\n\n夜深了呢...但人家还不想说晚安，想再陪主人一会儿..."
	}
	
	return response
}

// SupabaseClient Supabase客户端（占位符）
type SupabaseClient struct {
	// TODO: 实现Supabase集成
}
