package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/svs/platform/internal/api"
	"github.com/svs/platform/internal/auth"
	"github.com/svs/platform/internal/config"
	"github.com/svs/platform/internal/database"
	"github.com/svs/platform/internal/encryption"
	"github.com/svs/platform/internal/notion"
	"go.uber.org/zap"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 初始化日志
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Fatal("Failed to load config", zap.Error(err))
	}

	// 初始化数据库
	db, err := database.NewDatabase(cfg.DatabaseURL, logger)
	if err != nil {
		logger.Fatal("Failed to connect database", zap.Error(err))
	}

	// 初始化Firebase认证
	firebaseAuth, err := auth.NewFirebaseAuth(cfg.FirebaseCredFile)
	if err != nil {
		logger.Fatal("Failed to init Firebase", zap.Error(err))
	}

	// 初始化加密服务
	encryptor := encryption.NewEncryptor(cfg.EncryptionKey)

	// 初始化Notion客户端
	notionClient := notion.NewClient(cfg.NotionToken)

	// 创建API服务器
	router := gin.Default()
	
	// 中间件
	router.Use(corsMiddleware())
	router.Use(rateLimitMiddleware())

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "ai-platform-api",
			"time":    time.Now(),
		})
	})

	// API路由
	apiGroup := router.Group("/api/v1")
	{
		// 公开路由
		apiGroup.GET("/tutorials", api.GetTutorials(db))
		apiGroup.GET("/tutorials/:id", api.GetTutorial(db))
		
		// 需要认证的路由
		protected := apiGroup.Group("")
		protected.Use(firebaseAuth.Middleware())
		{
			// AI工具
			protected.POST("/ai/chat", api.AIChat(cfg, encryptor))
			protected.POST("/ai/analyze", api.AIAnalyze(cfg))
			
			// 加密内容
			protected.GET("/premium/content/:id", api.GetPremiumContent(db, encryptor))
			protected.POST("/premium/content", api.CreatePremiumContent(db, encryptor))
			
			// 用户管理
			protected.GET("/user/profile", api.GetUserProfile(db))
			protected.PUT("/user/profile", api.UpdateUserProfile(db))
		}

		// Notion同步（后台任务）
		apiGroup.POST("/sync/notion", api.SyncNotion(notionClient, db))
	}

	// 启动后台任务
	go startBackgroundTasks(notionClient, db, logger)

	// 创建HTTP服务器
	srv := &http.Server{
		Addr:           ":" + cfg.Port,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	// 优雅关闭
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed", zap.Error(err))
		}
	}()

	logger.Info("🚀 Server started",
		zap.String("port", cfg.Port),
		zap.String("env", cfg.Environment))

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}

	logger.Info("Server exited")
}

// 后台任务
func startBackgroundTasks(notionClient *notion.Client, db *database.DB, logger *zap.Logger) {
	// Notion同步任务
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		logger.Info("🔄 Starting Notion sync...")
		
		if err := notion.SyncAllDatabases(notionClient, db); err != nil {
			logger.Error("Notion sync failed", zap.Error(err))
		} else {
			logger.Info("✅ Notion sync completed")
		}
	}
}

// CORS中间件
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// 限流中间件
func rateLimitMiddleware() gin.HandlerFunc {
	// 简单的内存限流，生产环境应使用Redis
	limiter := make(map[string][]time.Time)
	var mu sync.RWMutex

	return func(c *gin.Context) {
		ip := c.ClientIP()
		
		mu.Lock()
		defer mu.Unlock()

		// 清理旧记录
		now := time.Now()
		cutoff := now.Add(-1 * time.Minute)
		
		times, exists := limiter[ip]
		if !exists {
			times = []time.Time{}
		}

		// 过滤旧时间
		newTimes := []time.Time{}
		for _, t := range times {
			if t.After(cutoff) {
				newTimes = append(newTimes, t)
			}
		}

		// 检查限制
		if len(newTimes) >= 100 { // 100次/分钟
			c.JSON(429, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}

		newTimes = append(newTimes, now)
		limiter[ip] = newTimes

		c.Next()
	}
}
