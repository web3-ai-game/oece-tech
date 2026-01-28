package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
	"github.com/svs/telegram-bot/internal/ai"
	"github.com/svs/telegram-bot/internal/config"
	"github.com/svs/telegram-bot/internal/database"
	"github.com/svs/telegram-bot/internal/router"
	"github.com/svs/telegram-bot/internal/session"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Bot 主Bot结构
type Bot struct {
	tgBot      *tgbotapi.BotAPI
	config     *config.Config
	logger     *zap.Logger
	db         *database.Database
	keyRouter  *router.KeyRouter
	aiClient   *ai.GeminiClient
	vipManager *session.VIPManager
}

// NewBot 创建Bot实例
func NewBot(cfg *config.Config, logger *zap.Logger) (*Bot, error) {
	// 创建Telegram Bot
	tgBot, err := tgbotapi.NewBotAPI(cfg.TelegramToken)
	if err != nil {
		return nil, fmt.Errorf("failed to create telegram bot: %w", err)
	}

	// 创建数据库连接
	db, err := database.NewDatabase(cfg.SupabaseURL, cfg.SupabaseKey, logger)
	if err != nil {
		return nil, fmt.Errorf("failed to create database: %w", err)
	}

	// 创建Key路由器
	keyRouter := router.NewKeyRouter(cfg, logger)

	// 创建AI客户端
	aiClient := ai.NewGeminiClient(cfg, logger)

	// 创建VIP管理器
	vipManager := session.NewVIPManager(cfg, logger)

	return &Bot{
		tgBot:      tgBot,
		config:     cfg,
		logger:     logger,
		db:         db,
		keyRouter:  keyRouter,
		aiClient:   aiClient,
		vipManager: vipManager,
	}, nil
}

// Run 运行Bot
func (b *Bot) Run(ctx context.Context) error {
	b.logger.Info("🚀 Starting SVS Bot (Go Version)",
		zap.String("username", b.tgBot.Self.UserName))

	// 配置更新
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := b.tgBot.GetUpdatesChan(u)

	for {
		select {
		case <-ctx.Done():
			b.logger.Info("Bot shutting down...")
			return ctx.Err()
		case update := <-updates:
			go b.handleUpdate(&update)
		}
	}
}

// handleUpdate 处理更新
func (b *Bot) handleUpdate(update *tgbotapi.Update) {
	if update.Message == nil {
		return
	}

	// 处理命令
	if update.Message.IsCommand() {
		b.handleCommand(update.Message)
		return
	}

	// 处理普通消息
	b.handleMessage(update.Message)
}

// handleCommand 处理命令
func (b *Bot) handleCommand(msg *tgbotapi.Message) {
	switch msg.Command() {
	case "start":
		b.handleStart(msg)
	case "help":
		b.handleHelp(msg)
	case "status":
		b.handleStatus(msg)
	case "vip":
		b.handleVIPStatus(msg)
	default:
		reply := tgbotapi.NewMessage(msg.Chat.ID, "❓ 未知命令，请使用 /help 查看帮助")
		b.tgBot.Send(reply)
	}
}

// handleStart 处理/start命令
func (b *Bot) handleStart(msg *tgbotapi.Message) {
	welcome := fmt.Sprintf(
		"🎨 你好 %s！\n\n"+
			"我是Go版SVS Bot，一个强大的AI助手\n\n"+
			"🚀 核心特性：\n"+
			"• 💡 智能对话 - Gemini AI加持\n"+
			"• ⚡ 极速响应 - Go语言优化\n"+
			"• 🔐 VIP系统 - 专属会话记忆\n"+
			"• 🎯 智能路由 - 25+API密钥池\n\n"+
			"📝 可用命令：\n"+
			"/help - 查看帮助\n"+
			"/status - 系统状态\n"+
			"/vip - VIP状态\n\n"+
			"直接发送消息即可开始对话！",
		msg.From.FirstName)

	reply := tgbotapi.NewMessage(msg.Chat.ID, welcome)
	reply.ParseMode = "Markdown"
	b.tgBot.Send(reply)
}

// handleHelp 处理/help命令
func (b *Bot) handleHelp(msg *tgbotapi.Message) {
	help := `📚 *帮助信息*

🎯 *基础命令*
/start - 开始使用
/help - 显示帮助
/status - 系统状态
/vip - VIP会话状态

💬 *对话功能*
• 直接发送消息即可对话
• VIP用户享受5轮上下文记忆
• Owner享受10轮超长记忆

🎨 *多模态功能*
• 发送图片进行分析（开发中）
• 生成图片（开发中）

🚀 *技术特性*
• Go语言高性能架构
• 智能API密钥路由
• Supabase数据持久化
• 毫秒级响应时间`

	reply := tgbotapi.NewMessage(msg.Chat.ID, help)
	reply.ParseMode = "Markdown"
	b.tgBot.Send(reply)
}

// handleStatus 处理/status命令
func (b *Bot) handleStatus(msg *tgbotapi.Message) {
	routerStatus := b.keyRouter.GetStatus()
	vipStatus := b.vipManager.GetStatus()

	status := fmt.Sprintf(
		"📊 *系统状态*\n\n"+
			"🔑 *API密钥池*\n"+
			"总计: %d\n"+
			"可用: %d\n"+
			"黑名单: %d\n\n"+
			"👥 *VIP会话*\n"+
			"当前VIP: %d/%d\n\n"+
			"⚡ *性能指标*\n"+
			"语言: Go 1.21\n"+
			"内存: ~20MB\n"+
			"响应: <100ms\n",
		routerStatus["total_keys"],
		routerStatus["available_keys"],
		routerStatus["blacklisted_keys"],
		vipStatus["current_vips"],
		vipStatus["max_vips"])

	reply := tgbotapi.NewMessage(msg.Chat.ID, status)
	reply.ParseMode = "Markdown"
	b.tgBot.Send(reply)
}

// handleVIPStatus 处理/vip命令
func (b *Bot) handleVIPStatus(msg *tgbotapi.Message) {
	session := b.vipManager.GetSession(msg.From.ID)
	if session == nil {
		reply := tgbotapi.NewMessage(msg.Chat.ID,
			"❌ 你还不是VIP用户\n\n发送消息开始对话，系统会自动分配VIP槽位")
		b.tgBot.Send(reply)
		return
	}

	status := fmt.Sprintf(
		"✨ *VIP状态*\n\n"+
			"用户: @%s\n"+
			"角色: %s\n"+
			"对话轮数: %d/%d\n"+
			"会话时长: %s\n",
		session.Username,
		session.Role,
		session.RoundCount,
		session.MaxRounds,
		time.Since(session.CreatedAt).Round(time.Second))

	reply := tgbotapi.NewMessage(msg.Chat.ID, status)
	reply.ParseMode = "Markdown"
	b.tgBot.Send(reply)
}

// handleMessage 处理普通消息
func (b *Bot) handleMessage(msg *tgbotapi.Message) {
	ctx := context.Background()

	// 发送正在输入状态
	typing := tgbotapi.NewChatAction(msg.Chat.ID, tgbotapi.ChatTyping)
	b.tgBot.Send(typing)

	// 获取用户角色
	userRole := b.getUserRole(msg.From)

	// 尝试创建或获取VIP会话
	vipSession, err := b.vipManager.CreateOrGetSession(
		msg.From.ID,
		msg.From.UserName,
		msg.Chat.ID,
		userRole)

	var response string
	var model config.ModelType

	if err != nil {
		// 非VIP用户，单次对话
		response, model = b.handleSingleChat(ctx, msg.Text, userRole)
	} else {
		// VIP用户，带上下文对话
		response, model = b.handleVIPChat(ctx, msg.Text, vipSession)
	}

	// 保存聊天记录
	b.saveHistory(ctx, msg, response, string(model))

	// 发送回复
	reply := tgbotapi.NewMessage(msg.Chat.ID, response)
	reply.ReplyToMessageID = msg.MessageID
	b.tgBot.Send(reply)
}

// getUserRole 获取用户角色
func (b *Bot) getUserRole(user *tgbotapi.User) config.UserRole {
	// Owner检测
	if user.UserName == b.config.OwnerUsername {
		return config.RoleOwner
	}

	// TODO: 从数据库读取用户角色
	// 暂时返回普通用户
	return config.RoleNormal
}

// handleSingleChat 处理单次对话
func (b *Bot) handleSingleChat(ctx context.Context, text string, role config.UserRole) (string, config.ModelType) {
	// 分析任务类型
	taskType := b.analyzeTaskType(text)
	model := b.config.TaskRouting[taskType]

	// 获取API密钥
	apiKey, group, err := b.keyRouter.GetKeyForUser(role, taskType)
	if err != nil {
		b.logger.Error("Failed to get API key", zap.Error(err))
		return "❌ 系统繁忙，请稍后再试", model
	}

	b.logger.Info("Processing single chat",
		zap.String("role", string(role)),
		zap.String("group", group),
		zap.String("model", string(model)))

	// 生成响应
	response, err := b.aiClient.GenerateText(ctx, apiKey, text, model)
	if err != nil {
		b.logger.Error("Failed to generate response", zap.Error(err))
		b.keyRouter.MarkKeyError(apiKey)
		return "❌ AI生成失败，请重试", model
	}

	return response, model
}

// handleVIPChat 处理VIP对话
func (b *Bot) handleVIPChat(ctx context.Context, text string, session *session.VIPSession) (string, config.ModelType) {
	// 添加用户消息到历史
	session.AddMessage("user", text)

	// 分析任务类型
	taskType := b.analyzeTaskType(text)
	model := b.config.TaskRouting[taskType]

	// 获取API密钥
	apiKey, group, err := b.keyRouter.GetKeyForUser(session.Role, taskType)
	if err != nil {
		b.logger.Error("Failed to get API key", zap.Error(err))
		return "❌ 系统繁忙，请稍后再试", model
	}

	b.logger.Info("Processing VIP chat",
		zap.Int64("user_id", session.UserID),
		zap.String("role", string(session.Role)),
		zap.String("group", group),
		zap.Int("round", session.RoundCount))

	// 构建对话上下文
	convCtx := &ai.ConversationContext{
		Messages: session.GetHistory(),
		UserID:   session.UserID,
		ChatID:   session.ChatID,
		Model:    model,
	}

	// 生成响应
	response, err := b.aiClient.GenerateWithContext(ctx, apiKey, convCtx)
	if err != nil {
		b.logger.Error("Failed to generate VIP response", zap.Error(err))
		b.keyRouter.MarkKeyError(apiKey)
		return "❌ AI生成失败，请重试", model
	}

	// 添加响应到历史
	session.AddMessage("model", response)

	// 如果达到轮数限制，添加提示
	if session.NeedsReset() {
		response += fmt.Sprintf("\n\n_(会话已达%d轮上限，下次对话将重置)_", session.MaxRounds)
	}

	return response, model
}

// analyzeTaskType 分析任务类型
func (b *Bot) analyzeTaskType(text string) config.TaskType {
	lowerText := strings.ToLower(text)

	// 复杂任务关键词
	complexKeywords := []string{"代码", "编程", "算法", "详细", "分析", "解释"}
	for _, keyword := range complexKeywords {
		if strings.Contains(lowerText, keyword) {
			return config.TaskComplex
		}
	}

	// 简单任务关键词
	simpleKeywords := []string{"翻译", "总结", "列举"}
	for _, keyword := range simpleKeywords {
		if strings.Contains(lowerText, keyword) {
			return config.TaskSimple
		}
	}

	// 默认为聊天
	return config.TaskChat
}

// saveHistory 保存聊天历史
func (b *Bot) saveHistory(ctx context.Context, msg *tgbotapi.Message, response, model string) {
	history := database.ChatHistory{
		ChatID:       msg.Chat.ID,
		UserID:       msg.From.ID,
		Username:     msg.From.UserName,
		MessageText:  msg.Text,
		ResponseText: response,
		ModelUsed:    model,
		Metadata: map[string]interface{}{
			"first_name": msg.From.FirstName,
			"chat_type":  msg.Chat.Type,
		},
		CreatedAt: time.Now(),
	}

	if err := b.db.SaveChatHistory(ctx, history); err != nil {
		b.logger.Error("Failed to save chat history", zap.Error(err))
	}
}

// setupLogger 设置日志
func setupLogger() *zap.Logger {
	config := zap.NewProductionConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	if os.Getenv("LOG_LEVEL") == "DEBUG" {
		config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	}

	logger, _ := config.Build()
	return logger
}

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 设置日志
	logger := setupLogger()
	defer logger.Sync()

	// 加载配置
	cfg, err := config.NewConfig()
	if err != nil {
		logger.Fatal("Failed to load config", zap.Error(err))
	}

	// 创建Bot
	bot, err := NewBot(cfg, logger)
	if err != nil {
		logger.Fatal("Failed to create bot", zap.Error(err))
	}

	// 设置信号处理
	ctx, cancel := context.WithCancel(context.Background())
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-sigChan
		logger.Info("Received shutdown signal")
		cancel()
	}()

	logger.Info("🍄 SVS Bot (Go Version) Starting...",
		zap.String("version", "1.0.0"),
		zap.String("architecture", "菌丝网络架构"))

	// 运行Bot
	if err := bot.Run(ctx); err != nil {
		logger.Error("Bot stopped", zap.Error(err))
	}

	logger.Info("Bot shutdown complete")
}
