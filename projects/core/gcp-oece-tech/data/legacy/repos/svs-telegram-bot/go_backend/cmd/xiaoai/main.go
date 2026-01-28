package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 初始化Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     getEnv("REDIS_URL", "localhost:6379"),
		Password: getEnv("REDIS_PASSWORD", ""),
		DB:       0,
	})

	// 测试Redis连接
	ctx := context.Background()
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatalf("❌ Redis连接失败: %v", err)
	}
	log.Println("✅ Redis连接成功")

	// 初始化Telegram Bot
	botToken := getEnv("TELEGRAM_BOT_XIAOAI_TOKEN", "")
	ownerID, _ := strconv.ParseInt(getEnv("BOT_OWNER_ID", "0"), 10, 64)

	bot, err := tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Fatalf("❌ Bot初始化失败: %v", err)
	}
	bot.Debug = false
	log.Printf("✅ Bot启动成功: @%s", bot.Self.UserName)

	// 初始化核心服务
	sessionManager := NewSessionManager(redisClient)
	rateLimiter := NewRateLimiter(redisClient, ownerID)
	langDetector := NewLanguageDetector(redisClient)
	geminiRouter := NewGeminiRouter(getGeminiKeys())
	
	// 初始化数据追踪和私聊菜单
	dataTracker := NewDataTracker(redisClient)
	privateMenu := NewPrivateMenu(bot, redisClient, ownerID)
	
	// V2.0 新增组件
	personality := NewPersonalityEngine()
	memory := NewMemorySystem(redisClient)
	aiRouter := NewAIRouter(personality, memory)

	// 启动Telegram Bot更新循环
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	updates := bot.GetUpdatesChan(u)

	log.Println("🚀 小爱同学开始监听消息...")

	// 关键词列表
	keywords := []string{
		"管理", "管理员", "admin", "administrator",
		"小爱", "xiaoai", "小愛",
		"普通话", "mandarin",
		"帮助", "help", "幫助",
	}

	// 处理消息
	go func() {
		for update := range updates {
			// 处理回调查询
			if update.CallbackQuery != nil {
				privateMenu.HandleCallback(update.CallbackQuery)
				continue
			}
			
			if update.Message == nil {
				continue
			}

			// 私聊处理
			isPrivate := update.Message.Chat.Type == "private"
			isOwner := update.Message.From.ID == ownerID
			
			// 处理私聊消息（命令和中文关键词）
			if isPrivate {
				// 先尝试处理Owner的命令和中文关键词
				handled := privateMenu.HandlePrivateMessage(update.Message)
				
				// 如果已被处理（命令或关键词），不继续AI对话
				if handled {
					continue
				}
				
				// 否则继续AI对话处理
			}
			
			// 私聊直接响应，群聊需要触发条件
			if !isPrivate {
				// 群聊需要检查触发条件：@提及 或 关键词
				isMention := isMentioned(update.Message, bot.Self.UserName)
				hasKeyword := containsKeywords(update.Message.Text, keywords)
				
				// 如果既没被提及，也没关键词，跳过
				if !isMention && !hasKeyword {
					continue
				}
			}
			
			// 到这里的消息都需要AI回复：
			// 1. 所有私聊（Owner和普通用户）
			// 2. 群聊中的@提及或关键词触发

			userID := update.Message.From.ID
			groupID := update.Message.Chat.ID
			username := update.Message.From.UserName
			message := update.Message.Text

			// Owner无配额限制
			if !isOwner {
				// 检查配额
				allowed, err := rateLimiter.CheckQuota(userID)
				if !allowed {
					reply := "呜...主人，你今天已经找了人家80次了呢~ 人家需要休息一下啦~ 明天再来好吗？💕"
					if err != nil {
						reply = err.Error()
					}
					msg := tgbotapi.NewMessage(groupID, reply)
					msg.ReplyToMessageID = update.Message.MessageID
					bot.Send(msg)
					continue
				}
			}

			// 更新人格情绪状态
			personality.UpdateMood(message)
			
			// 记录开始时间
			startTime := time.Now()
			
			// 使用V2.0 AI路由系统处理消息
			response, err := aiRouter.Route(context.Background(), message, userID, isPrivate)
			
			// 计算响应时间
			responseTime := int(time.Since(startTime).Milliseconds())
			
			// 确定触发类型用于统计
			triggerType := "chat"
			if isPrivate {
				triggerType = "private"
			}
			
			// 记录数据
			dataTracker.RecordCall(userID, groupID, username, triggerType, responseTime, err == nil)
			
			if err != nil {
				log.Printf("❌ 处理消息失败: %v", err)
				msg := tgbotapi.NewMessage(groupID, "抱歉，处理消息时出错了~ 😅")
				msg.ReplyToMessageID = update.Message.MessageID
				bot.Send(msg)
				continue
			}

			// 增加使用计数
			rateLimiter.IncrementUsage(userID)

			// 发送回复 (V2.0不需要轮数限制)
			msg := tgbotapi.NewMessage(groupID, response)
			msg.ReplyToMessageID = update.Message.MessageID
			msg.ParseMode = "Markdown"
			
			// 私聊Owner时关闭链接预览（更亲密）
			if isPrivate && isOwner {
				msg.DisableWebPagePreview = true
			}
			
			if _, err := bot.Send(msg); err != nil {
				log.Printf("❌ 发送消息失败: %v", err)
			}

			log.Printf("✅ 回复用户 %s (%s模式)", username, triggerType)
		}
	}()

	// 启动API服务器 (用于Mini App)
	router := gin.Default()

	// CORS中间件
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API路由
	api := router.Group("/api/v1")
	{
		// 用户状态
		api.GET("/user/quota/:user_id", func(c *gin.Context) {
			userIDStr := c.Param("user_id")
			userID, _ := strconv.ParseInt(userIDStr, 10, 64)
			remaining := rateLimiter.GetRemainingQuota(userID)
			c.JSON(200, gin.H{
				"user_id":   userID,
				"remaining": remaining,
				"is_owner":  userID == ownerID,
			})
		})

		// 活跃会话
		api.GET("/sessions/active/:group_id", func(c *gin.Context) {
			groupIDStr := c.Param("group_id")
			groupID, _ := strconv.ParseInt(groupIDStr, 10, 64)
			count := sessionManager.GetActiveSessionsCount(groupID)
			c.JSON(200, gin.H{
				"group_id":       groupID,
				"active_count":   count,
				"max_concurrent": 5,
			})
		})

		// 健康检查
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "healthy",
				"bot":     bot.Self.UserName,
				"version": "1.0.0",
			})
		})
	}

	// 启动API服务器
	go func() {
		port := getEnv("API_PORT", "8080")
		log.Printf("🌐 API服务器启动在端口 %s", port)
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("❌ API服务器启动失败: %v", err)
		}
	}()

	// 优雅退出
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("👋 小爱同学正在关闭...")
	bot.StopReceivingUpdates()
	redisClient.Close()
	log.Println("✅ 已安全退出")
}

// 检查是否提及Bot
func isMentioned(message *tgbotapi.Message, botUsername string) bool {
	// 检查是否是回复Bot的消息
	if message.ReplyToMessage != nil && message.ReplyToMessage.From.UserName == botUsername {
		return true
	}

	// 检查是否直接@Bot
	for _, entity := range message.Entities {
		if entity.Type == "mention" {
			mention := message.Text[entity.Offset : entity.Offset+entity.Length]
			if mention == "@"+botUsername || mention == "@小爱" {
				return true
			}
		}
	}

	return false
}

// 检查消息是否包含关键词
func containsKeywords(text string, keywords []string) bool {
	textLower := strings.ToLower(text)
	for _, keyword := range keywords {
		keywordLower := strings.ToLower(keyword)
		if strings.Contains(textLower, keywordLower) || strings.Contains(text, keyword) {
			return true
		}
	}
	return false
}

// 获取环境变量
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// 获取Gemini Keys
func getGeminiKeys() []string {
	keys := []string{
		os.Getenv("GEMINI_API_KEY"),
		os.Getenv("GEMINI_API_KEY_2"),
		os.Getenv("GEMINI_API_KEY_3"),
		os.Getenv("SVSKILO_BOT_GEMINI_PRIMARY"),
		os.Getenv("SVSKILO_BOT_GEMINI_BACKUP"),
	}

	// 过滤空值
	validKeys := []string{}
	for _, key := range keys {
		if key != "" {
			validKeys = append(validKeys, key)
		}
	}

	return validKeys
}
