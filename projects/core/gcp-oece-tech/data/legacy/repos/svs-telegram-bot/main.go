package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

// RouterID 路由器标识
type RouterID string

const (
	RouterA RouterID = "router_a"
	RouterB RouterID = "router_b"
)

// WorkGroup 工作组
type WorkGroup string

const (
	GroupA1 WorkGroup = "group_a1"
	GroupA2 WorkGroup = "group_a2"
	GroupB1 WorkGroup = "group_b1"
	GroupB2 WorkGroup = "group_b2"
)

// KeyUsage Key使用统计
type KeyUsage struct {
	DailyCount int
	RPMTimes   []time.Time
	LastUsed   time.Time
	ErrorCount int
	mu         sync.Mutex
}

// DualRouterSystem 双路由器系统
type DualRouterSystem struct {
	Routers      map[RouterID]string
	RouterGroups map[RouterID][]WorkGroup
	WorkGroups   map[WorkGroup][]string
	KeyUsage     map[string]*KeyUsage
	mu           sync.RWMutex
}

// NewDualRouterSystem 创建双路由器系统
func NewDualRouterSystem() *DualRouterSystem {
	system := &DualRouterSystem{
		Routers: map[RouterID]string{
			RouterA: "AIzaSyA5PgAqHpLt8yHCcxdTyBTHt_YP9VmOwjA",
			RouterB: "AIzaSyDNpOIB0nn4YcVTG9x559O3Ht-AdnHUiLA",
		},
		RouterGroups: map[RouterID][]WorkGroup{
			RouterA: {GroupA1, GroupA2},
			RouterB: {GroupB1, GroupB2},
		},
		WorkGroups: map[WorkGroup][]string{
			GroupA1: {
				"AIzaSyCPxNPKzWp29Bfn41KhfGzor8Nw98UBUlU",
				"AIzaSyAWpD1-bJIE6lXv3lwT-yePeb2faEpYXd8",
				"AIzaSyBKOla-lFvzYBnMozGcqJvGMWD_A3BkpMs",
				"AIzaSyCVRIQzW07PYeo9YJJnOqS4f15yLe6WRsg",
				"AIzaSyCm7hYdz36B75sGtDhtnGrWW75WNTrQ-pU",
				"AIzaSyAGWdNp7CzAqaCGkan75OW1AwEyL53ljT0",
				"AIzaSyDoQMM0PQmdNabF9CKTC4lzavLsZnR6zQU",
			},
			GroupA2: {
				"AIzaSyA9-h77IHDo_LXwYQqO4ZLeIbb49HYaU4A",
				"AIzaSyAjo1tVdfrDyCzIjQtaTtN6Zt2s4X3bijc",
				"AIzaSyBOzbxdFcRN_1b007QhuSi-f4FbZXKc5Lw",
				"AIzaSyD1qjHKnBuGH5ukDCn3CN7dN_OqA5o6Qps",
				"AIzaSyB7Wx2a_j2YU3Dcklq4Li3p_1Hxxl5abtU",
				"AIzaSyA8u-ZYsrUU0rDSFPGARGNFHRlpAlXgaS0",
				"AIzaSyB7xWKLkqOOWJbIcvA3sk4O0dFGbRKhNR4",
			},
			GroupB1: {
				"AIzaSyATC0o1O_4Ai3oEw_4KfnukCikwKYnXzp4",
				"AIzaSyDE8txzP-pHA_xO5iXP3VTJExGPgDyw3TE",
				"AIzaSyDyh8M0djG2E7pbCvNm3d2ecotv2ot8Zkk",
				"AIzaSyB_PhtmKUEE6d2CtAGiqZMk67R4qrgsXyg",
				"AIzaSyBRm9efJEnuaeLXkPGuXWDwIWVGBrJVhgA",
				"AIzaSyArIZw_CufZHxeUkrTmma3oUIJi2bXn4lI",
				"AIzaSyC1_xh4ylFxwlsT7RnECrGbcsfHp4wLftM",
			},
			GroupB2: {
				"AIzaSyAlsZ3fLPsB3udtH6hBLOJsSEyijVFXTmI",
				"AIzaSyCl9-5P5EomTcv5G82___nTB1y29-FpBW4",
				"AIzaSyCFsMpRhiwm_SMgsJNODRAR86NKDxM6M8c",
				"AIzaSyAt0PUYuIrHN898bGAE1amOsUjP3ogrXiQ",
				"AIzaSyAWXpDiRsyELoVB5VNpHuGevufpurQTMwg",
				"AIzaSyDMzpEWY3kbgkZVpNpcipIsNg6xinQsvAs",
			},
		},
		KeyUsage: make(map[string]*KeyUsage),
	}
	
	// 初始化所有Key的使用统计
	for _, keys := range system.WorkGroups {
		for _, key := range keys {
			system.KeyUsage[key] = &KeyUsage{
				RPMTimes: make([]time.Time, 0),
			}
		}
	}
	
	return system
}

// IsKeyAvailable 检查Key是否可用
func (s *DualRouterSystem) IsKeyAvailable(key string, rpmLimit int) bool {
	usage, exists := s.KeyUsage[key]
	if !exists {
		return false
	}
	
	usage.mu.Lock()
	defer usage.mu.Unlock()
	
	// 清理60秒前的记录
	now := time.Now()
	cutoff := now.Add(-60 * time.Second)
	newTimes := make([]time.Time, 0)
	for _, t := range usage.RPMTimes {
		if t.After(cutoff) {
			newTimes = append(newTimes, t)
		}
	}
	usage.RPMTimes = newTimes
	
	// 检查RPM限制
	if len(usage.RPMTimes) >= rpmLimit {
		return false
	}
	
	// 检查日限额 (保守60)
	if usage.DailyCount >= 60 {
		return false
	}
	
	return true
}

// GetWorkKey 获取工作Key
func (s *DualRouterSystem) GetWorkKey(routerID *RouterID) (string, string, string, error) {
	// 随机选择路由器
	var rid RouterID
	if routerID == nil {
		routers := []RouterID{RouterA, RouterB}
		rid = routers[rand.Intn(len(routers))]
	} else {
		rid = *routerID
	}
	
	routerKey := s.Routers[rid]
	managedGroups := s.RouterGroups[rid]
	
	// 随机选择组
	group := managedGroups[rand.Intn(len(managedGroups))]
	keys := s.WorkGroups[group]
	
	// 打乱Keys顺序
	shuffled := make([]string, len(keys))
	copy(shuffled, keys)
	rand.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})
	
	// 找到可用Key
	for _, key := range shuffled {
		if s.IsKeyAvailable(key, 10) {
			// 标记使用
			usage := s.KeyUsage[key]
			usage.mu.Lock()
			usage.DailyCount++
			usage.RPMTimes = append(usage.RPMTimes, time.Now())
			usage.LastUsed = time.Now()
			usage.mu.Unlock()
			
			log.Printf("路由器%s -> 组%s -> Key %s...", rid, group, key[:20])
			return routerKey, key, string(group), nil
		}
	}
	
	return routerKey, "", string(group), fmt.Errorf("no available keys")
}

// GeminiRequest Gemini API请求
type GeminiRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
	GenerationConfig struct {
		MaxOutputTokens int     `json:"maxOutputTokens"`
		Temperature     float64 `json:"temperature"`
	} `json:"generationConfig"`
}

// GeminiResponse Gemini API响应
type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// GenerateText 生成文本
func GenerateText(apiKey, message string) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=%s", apiKey)
	
	request := GeminiRequest{}
	request.Contents = []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	}{
		{
			Parts: []struct {
				Text string `json:"text"`
			}{
				{Text: message},
			},
		},
	}
	request.GenerationConfig.MaxOutputTokens = 500
	request.GenerationConfig.Temperature = 0.7
	
	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", err
	}
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
	}
	
	var response GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}
	
	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		return response.Candidates[0].Content.Parts[0].Text, nil
	}
	
	return "", fmt.Errorf("no response generated")
}

// MultimodalXiaoAi 多模态小爱
type MultimodalXiaoAi struct {
	Router  *DualRouterSystem
	Context map[int64][]string // 简单上下文
	mu      sync.RWMutex
}

// NewMultimodalXiaoAi 创建多模态小爱
func NewMultimodalXiaoAi(router *DualRouterSystem) *MultimodalXiaoAi {
	return &MultimodalXiaoAi{
		Router:  router,
		Context: make(map[int64][]string),
	}
}

// DetectImageRequest 检测图像请求
func (m *MultimodalXiaoAi) DetectImageRequest(text string) bool {
	keywords := []string{"画", "生成图", "出图", "picture", "image", "draw", "generate"}
	lowerText := strings.ToLower(text)
	for _, keyword := range keywords {
		if strings.Contains(lowerText, keyword) {
			return true
		}
	}
	return false
}

// ProcessMessage 处理消息
func (m *MultimodalXiaoAi) ProcessMessage(userID int64, message string) (string, error) {
	// 检测是否是图像请求
	if m.DetectImageRequest(message) {
		log.Printf("检测到图像生成请求: %s", message)
		return "🎨 图像生成功能开发中，请稍候...", nil
	}
	
	// 获取工作Key
	_, workerKey, group, err := m.Router.GetWorkKey(nil)
	if err != nil {
		return "", err
	}
	
	// 生成文本
	reply, err := GenerateText(workerKey, message)
	if err != nil {
		return "", err
	}
	
	// 更新上下文（保留最近3轮）
	m.mu.Lock()
	if _, exists := m.Context[userID]; !exists {
		m.Context[userID] = make([]string, 0)
	}
	m.Context[userID] = append(m.Context[userID], message, reply)
	if len(m.Context[userID]) > 6 {
		m.Context[userID] = m.Context[userID][len(m.Context[userID])-6:]
	}
	m.mu.Unlock()
	
	log.Printf("组%s响应用户%d", group, userID)
	return reply, nil
}

func main() {
	// 获取环境变量
	token := os.Getenv("TELEGRAM_TOKEN")
	if token == "" {
		log.Fatal("TELEGRAM_TOKEN environment variable is required")
	}
	
	// 初始化系统
	log.Println("🚀 启动Go版小爱同学多模态Bot")
	log.Println("=" + strings.Repeat("=", 60))
	
	router := NewDualRouterSystem()
	xiaoai := NewMultimodalXiaoAi(router)
	
	// 创建Bot
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Fatal(err)
	}
	
	bot.Debug = false
	log.Printf("✅ 已授权账号: %s", bot.Self.UserName)
	log.Println("📊 双路由器四组架构已就绪")
	log.Println("🎨 多模态功能已启用")
	
	// 配置更新
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	
	updates := bot.GetUpdatesChan(u)
	
	// 处理消息
	for update := range updates {
		if update.Message == nil {
			continue
		}
		
		// 处理命令
		if update.Message.IsCommand() {
			switch update.Message.Command() {
			case "start":
				msg := tgbotapi.NewMessage(update.Message.Chat.ID,
					"👋 你好！我是Go版小爱同学！\n\n"+
						"🎯 我能做什么：\n"+
						"• 💬 智能对话\n"+
						"• 🎨 生成图像（开发中）\n"+
						"• 🚀 超快响应（Go编写）\n\n"+
						"试试跟我说话吧！")
				bot.Send(msg)
				
			case "status":
				status := "📊 系统状态\n\n"
				status += "🔧 路由器: 2个\n"
				status += "📦 工作组: 4个\n"
				status += "🔑 工作Keys: 27个\n"
				status += "⚡ 语言: Go (高性能)\n"
				status += "💾 内存: ~15MB\n"
				msg := tgbotapi.NewMessage(update.Message.Chat.ID, status)
				bot.Send(msg)
			}
			continue
		}
		
		// 处理普通消息
		go func(msg *tgbotapi.Message) {
			// 发送"正在输入"
			action := tgbotapi.NewChatAction(msg.Chat.ID, tgbotapi.ChatTyping)
			bot.Send(action)
			
			// 处理消息
			reply, err := xiaoai.ProcessMessage(msg.From.ID, msg.Text)
			if err != nil {
				log.Printf("处理消息出错: %v", err)
				replyMsg := tgbotapi.NewMessage(msg.Chat.ID, fmt.Sprintf("❌ 出错了: %v", err))
				replyMsg.ReplyToMessageID = msg.MessageID
				bot.Send(replyMsg)
				return
			}
			
			// 发送回复
			replyMsg := tgbotapi.NewMessage(msg.Chat.ID, reply)
			replyMsg.ReplyToMessageID = msg.MessageID
			bot.Send(replyMsg)
		}(update.Message)
	}
}
