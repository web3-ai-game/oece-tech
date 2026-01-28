package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/svs/telegram-bot/internal/config"
	"go.uber.org/zap"
)

// GeminiClient Gemini AI客户端
type GeminiClient struct {
	httpClient *http.Client
	logger     *zap.Logger
	config     *config.Config
}

// NewGeminiClient 创建Gemini客户端
func NewGeminiClient(cfg *config.Config, logger *zap.Logger) *GeminiClient {
	return &GeminiClient{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		logger: logger,
		config: cfg,
	}
}

// Message 消息结构
type Message struct {
	Role    string `json:"role"`
	Content string `json:"parts"`
}

// GenerateRequest 生成请求
type GenerateRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
		Role string `json:"role,omitempty"`
	} `json:"contents"`
	GenerationConfig GenerationConfig `json:"generationConfig"`
	SafetySettings   []SafetySetting  `json:"safetySettings,omitempty"`
}

// GenerationConfig 生成配置
type GenerationConfig struct {
	Temperature      float64  `json:"temperature"`
	TopP             float64  `json:"topP"`
	TopK             int      `json:"topK"`
	MaxOutputTokens  int      `json:"maxOutputTokens"`
	StopSequences    []string `json:"stopSequences,omitempty"`
	CandidateCount   int      `json:"candidateCount"`
	ResponseMimeType string   `json:"responseMimeType,omitempty"`
}

// SafetySetting 安全设置
type SafetySetting struct {
	Category  string `json:"category"`
	Threshold string `json:"threshold"`
}

// GenerateResponse 生成响应
type GenerateResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
			Role string `json:"role"`
		} `json:"content"`
		FinishReason string `json:"finishReason"`
		SafetyRatings []struct {
			Category    string `json:"category"`
			Probability string `json:"probability"`
		} `json:"safetyRatings"`
	} `json:"candidates"`
	UsageMetadata struct {
		PromptTokenCount     int `json:"promptTokenCount"`
		CandidatesTokenCount int `json:"candidatesTokenCount"`
		TotalTokenCount      int `json:"totalTokenCount"`
	} `json:"usageMetadata"`
}

// ConversationContext 对话上下文
type ConversationContext struct {
	Messages []Message
	UserID   int64
	ChatID   int64
	Model    config.ModelType
}

// GenerateText 生成文本
func (gc *GeminiClient) GenerateText(ctx context.Context, apiKey string, prompt string, model config.ModelType) (string, error) {
	modelConfig := gc.config.Models[model]
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
		modelConfig.Name, apiKey)

	request := GenerateRequest{}
	request.Contents = []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
		Role string `json:"role,omitempty"`
	}{
		{
			Parts: []struct {
				Text string `json:"text"`
			}{
				{Text: prompt},
			},
		},
	}

	request.GenerationConfig = GenerationConfig{
		Temperature:     0.7,
		TopP:            0.95,
		TopK:            40,
		MaxOutputTokens: 1024,
		CandidateCount:  1,
	}

	// 安全设置（放宽限制）
	request.SafetySettings = []SafetySetting{
		{Category: "HARM_CATEGORY_HARASSMENT", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_HATE_SPEECH", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_DANGEROUS_CONTENT", Threshold: "BLOCK_NONE"},
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := gc.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
	}

	var response GenerateResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		gc.logger.Debug("Generated text",
			zap.String("model", string(model)),
			zap.Int("prompt_tokens", response.UsageMetadata.PromptTokenCount),
			zap.Int("response_tokens", response.UsageMetadata.CandidatesTokenCount))
		return response.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no response generated")
}

// GenerateWithContext 带上下文生成
func (gc *GeminiClient) GenerateWithContext(ctx context.Context, apiKey string, convCtx *ConversationContext) (string, error) {
	modelConfig := gc.config.Models[convCtx.Model]
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
		modelConfig.Name, apiKey)

	request := GenerateRequest{}

	// 构建带历史的对话
	request.Contents = make([]struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
		Role string `json:"role,omitempty"`
	}, 0)

	for _, msg := range convCtx.Messages {
		content := struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
			Role string `json:"role,omitempty"`
		}{
			Parts: []struct {
				Text string `json:"text"`
			}{
				{Text: msg.Content},
			},
			Role: msg.Role,
		}
		request.Contents = append(request.Contents, content)
	}

	// 生成配置（根据模型调整）
	request.GenerationConfig = gc.getGenerationConfig(convCtx.Model)

	// 安全设置
	request.SafetySettings = []SafetySetting{
		{Category: "HARM_CATEGORY_HARASSMENT", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_HATE_SPEECH", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", Threshold: "BLOCK_NONE"},
		{Category: "HARM_CATEGORY_DANGEROUS_CONTENT", Threshold: "BLOCK_NONE"},
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := gc.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
	}

	var response GenerateResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		gc.logger.Debug("Generated with context",
			zap.String("model", string(convCtx.Model)),
			zap.Int64("user_id", convCtx.UserID),
			zap.Int("context_size", len(convCtx.Messages)),
			zap.Int("tokens_used", response.UsageMetadata.TotalTokenCount))
		return response.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no response generated")
}

// getGenerationConfig 根据模型获取生成配置
func (gc *GeminiClient) getGenerationConfig(model config.ModelType) GenerationConfig {
	switch model {
	case config.ModelPro:
		return GenerationConfig{
			Temperature:     0.9,
			TopP:            0.95,
			TopK:            40,
			MaxOutputTokens: 2048,
			CandidateCount:  1,
		}
	case config.ModelFlash:
		return GenerationConfig{
			Temperature:     0.7,
			TopP:            0.9,
			TopK:            32,
			MaxOutputTokens: 1024,
			CandidateCount:  1,
		}
	case config.ModelFlashLite:
		return GenerationConfig{
			Temperature:     0.6,
			TopP:            0.8,
			TopK:            20,
			MaxOutputTokens: 512,
			CandidateCount:  1,
		}
	default:
		return GenerationConfig{
			Temperature:     0.7,
			TopP:            0.9,
			TopK:            32,
			MaxOutputTokens: 1024,
			CandidateCount:  1,
		}
	}
}

// AnalyzeImage 分析图片（多模态）
func (gc *GeminiClient) AnalyzeImage(ctx context.Context, apiKey string, imageData []byte, mimeType string, prompt string) (string, error) {
	// TODO: 实现图片分析功能
	// 需要使用gemini-pro-vision模型
	return "图片分析功能开发中...", nil
}

// StreamGenerateText 流式生成文本
func (gc *GeminiClient) StreamGenerateText(ctx context.Context, apiKey string, prompt string, model config.ModelType, callback func(string)) error {
	// TODO: 实现流式生成
	// 使用SSE (Server-Sent Events) 接收流式响应
	return fmt.Errorf("streaming not implemented yet")
}
