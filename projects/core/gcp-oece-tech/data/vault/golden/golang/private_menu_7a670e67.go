package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

// PrivateMenu 私聊菜单系统
type PrivateMenu struct {
	bot         *tgbotapi.BotAPI
	redis       *redis.Client
	ownerID     int64
	dataTracker *DataTracker
}

// 创建私聊菜单
func NewPrivateMenu(bot *tgbotapi.BotAPI, redis *redis.Client, ownerID int64) *PrivateMenu {
	return &PrivateMenu{
		bot:         bot,
		redis:       redis,
		ownerID:     ownerID,
		dataTracker: NewDataTracker(redis),
	}
}

// 处理私聊消息 - 返回true表示已处理，false表示需要AI处理
func (pm *PrivateMenu) HandlePrivateMessage(message *tgbotapi.Message) bool {
	// 只处理Owner的命令和关键词
	if message.From.ID != pm.ownerID {
		// 非Owner私聊交给AI处理
		return false
	}

	// Owner的命令处理
	if message.IsCommand() {
		switch message.Command() {
		case "start", "menu":
			pm.showMainMenu(message.Chat.ID)
		case "help":
			pm.showHelpMenu(message.Chat.ID)
		case "stats":
			pm.showStatistics(message.Chat.ID)
		case "report":
			pm.generateReport(message.Chat.ID)
		case "users":
			pm.showUserAnalysis(message.Chat.ID)
		case "keywords":
			pm.showKeywordAnalysis(message.Chat.ID)
		case "trends":
			pm.showTrends(message.Chat.ID)
		case "config":
			pm.showConfig(message.Chat.ID)
		case "export":
			pm.exportData(message.Chat.ID)
		case "alert":
			pm.configureAlerts(message.Chat.ID)
		default:
			pm.showMainMenu(message.Chat.ID)
		}
		return true // 命令已处理
	}
	
	// Owner的中文关键词处理
	handled := pm.handleChineseKeywords(message)
	return handled // 返回是否已处理
}

// 显示主菜单
func (pm *PrivateMenu) showMainMenu(chatID int64) {
	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("📊 实时统计", "cmd:stats"),
			tgbotapi.NewInlineKeyboardButtonData("📈 趋势分析", "cmd:trends"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("👥 用户分析", "cmd:users"),
			tgbotapi.NewInlineKeyboardButtonData("🔤 关键词云", "cmd:keywords"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("📋 生成报告", "cmd:report"),
			tgbotapi.NewInlineKeyboardButtonData("💾 导出数据", "cmd:export"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("⚙️ 系统配置", "cmd:config"),
			tgbotapi.NewInlineKeyboardButtonData("🔔 告警设置", "cmd:alert"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("🚀 高级功能", "cmd:advanced"),
			tgbotapi.NewInlineKeyboardButtonData("🆘 帮助", "cmd:help"),
		),
	)

	text := `
🤖 *小爱同学控制面板* 🎮

欢迎回来，Master！我是你的专属AI助手。

📊 *今日概况*
├ 总调用: %d/80次
├ 群组活跃: %d个
├ 用户活跃: %d人
└ 响应时间: %dms

🔥 *热门功能*
├ 数据分析与报告
├ 用户行为追踪
├ 智能告警系统
└ 自动化任务

请选择功能：
`
	stats := pm.dataTracker.GetTodayStats()
	msg := tgbotapi.NewMessage(chatID, fmt.Sprintf(text,
		stats.TotalCalls,
		stats.ActiveGroups,
		stats.ActiveUsers,
		stats.AvgResponseTime,
	))
	msg.ParseMode = "Markdown"
	msg.ReplyMarkup = keyboard
	pm.bot.Send(msg)
}

// 显示统计数据
func (pm *PrivateMenu) showStatistics(chatID int64) {
	stats := pm.dataTracker.GetDetailedStats()
	
	text := fmt.Sprintf(`
📊 *实时统计数据* (更新时间: %s)

*=== 今日数据 ===*
📞 总调用次数: %d/80 (%.1f%%)
👥 活跃用户数: %d
💬 群组消息: %d
📱 私聊消息: %d
⏱ 平均响应: %dms

*=== 用户排行榜 TOP5 ===*
%s

*=== 群组活跃度 TOP5 ===*
%s

*=== 功能使用统计 ===*
🔍 关键词触发: %d次 (%.1f%%)
@ @提及触发: %d次 (%.1f%%)
🎯 命中率: %.1f%%

*=== API使用情况 ===*
🔑 Gemini Keys: %d个活跃
⚡ 成功率: %.1f%%
❌ 失败次数: %d
🔄 切换次数: %d

*=== 系统负载 ===*
💾 内存使用: %dMB
🖥 CPU占用: %.1f%%
📡 网络延迟: %dms
🔥 QPS: %.2f
`,
		time.Now().Format("15:04:05"),
		stats.TodayStats.TotalCalls, float64(stats.TodayStats.TotalCalls)/80*100,
		stats.TodayStats.ActiveUsers,
		stats.TodayStats.GroupMessages,
		stats.TodayStats.PrivateMessages,
		stats.TodayStats.AvgResponseTime,
		formatUserRanking(stats.TopUsers),
		formatGroupRanking(stats.TopGroups),
		stats.TriggerStats.KeywordTriggers, stats.TriggerStats.KeywordPercent,
		stats.TriggerStats.MentionTriggers, stats.TriggerStats.MentionPercent,
		stats.TriggerStats.HitRate,
		stats.APIStats.ActiveKeys,
		stats.APIStats.SuccessRate,
		stats.APIStats.FailedCalls,
		stats.APIStats.KeySwitches,
		stats.SystemStats.MemoryMB,
		stats.SystemStats.CPUPercent,
		stats.SystemStats.NetworkLatency,
		stats.SystemStats.QPS,
	)

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	
	// 添加刷新按钮
	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("🔄 刷新", "cmd:stats:refresh"),
			tgbotapi.NewInlineKeyboardButtonData("📈 查看趋势", "cmd:trends"),
			tgbotapi.NewInlineKeyboardButtonData("🔙 返回", "cmd:menu"),
		),
	)
	msg.ReplyMarkup = keyboard
	
	pm.bot.Send(msg)
}

// 生成分析报告
func (pm *PrivateMenu) generateReport(chatID int64) {
	report := pm.dataTracker.GenerateReport()
	
	text := fmt.Sprintf(`
📋 *智能分析报告*
生成时间: %s

*一、执行摘要*
%s

*二、用户行为分析*
%s

*三、使用模式识别*
%s

*四、异常检测*
%s

*五、优化建议*
%s

*六、预测分析*
%s

*七、关键指标*
%s

---
📊 报告评分: %.1f/10
💡 健康度: %s
🎯 建议优先级: %s
`,
		time.Now().Format("2006-01-02 15:04:05"),
		report.ExecutiveSummary,
		report.UserBehavior,
		report.UsagePatterns,
		report.AnomalyDetection,
		report.Recommendations,
		report.Predictions,
		report.KeyMetrics,
		report.Score,
		report.HealthStatus,
		report.Priority,
	)

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	
	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("📤 导出PDF", "cmd:report:pdf"),
			tgbotapi.NewInlineKeyboardButtonData("📧 发送邮件", "cmd:report:email"),
			tgbotapi.NewInlineKeyboardButtonData("🔙 返回", "cmd:menu"),
		),
	)
	msg.ReplyMarkup = keyboard
	
	pm.bot.Send(msg)
}

// 用户分析
func (pm *PrivateMenu) showUserAnalysis(chatID int64) {
	analysis := pm.dataTracker.GetUserAnalysis()
	
	text := fmt.Sprintf(`
👥 *用户深度分析*

*=== 用户画像 ===*
%s

*=== 活跃时段分布 ===*
%s

*=== 使用偏好 ===*
%s

*=== 用户分层 ===*
🔥 超级用户: %d人 (%.1f%%)
💎 VIP用户: %d人 (%.1f%%)
⭐ 活跃用户: %d人 (%.1f%%)
👤 普通用户: %d人 (%.1f%%)
😴 沉睡用户: %d人 (%.1f%%)

*=== 留存分析 ===*
次日留存: %.1f%%
7日留存: %.1f%%
30日留存: %.1f%%

*=== 用户价值 ===*
ARPU: %.2f
LTV: %.2f
付费转化: %.1f%%
`,
		formatUserProfiles(analysis.Profiles),
	trends := pm.dataTracker.GetTrends()
	
	// 生成趋势图表（ASCII艺术）
	chart := generateTrendChart(trends.HourlyData)
	
	text := fmt.Sprintf(`
📈 *趋势分析与预测*

*24小时趋势图*
\`\`\`
%s
\`\`\`

*=== 关键趋势 ===*
📊 日增长率: %+.1f%%
📈 周增长率: %+.1f%%
📉 峰值时段: %s
🔻 低谷时段: %s

*=== 预测分析 ===*
明日预测: %d次 (±%d)
本周预测: %d次
本月预测: %d次

*=== 异常告警 ===*
%s

*=== 智能建议 ===*
%s
`,
		chart,
		trends.DayGrowth,
		trends.WeekGrowth,
		trends.PeakHour,
		trends.LowHour,
		trends.TomorrowPrediction, trends.PredictionError,
		trends.WeekPrediction,
		trends.MonthPrediction,
		formatAlerts(trends.Alerts),
		formatSuggestions(trends.Suggestions),
	)

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	pm.bot.Send(msg)
}

// 关键词分析
func (pm *PrivateMenu) showKeywordAnalysis(chatID int64) {
	keywords := pm.dataTracker.GetKeywordAnalysis()
	
	// 生成词云（文字版）
	wordCloud := generateWordCloud(keywords.TopKeywords)
	
	text := fmt.Sprintf(`
🔤 *关键词云图*

%s

*=== TOP 20 热词 ===*
%s

*=== 新增热词 ===*
%s

*=== 话题聚类 ===*
%s

*=== 情感分析 ===*
😊 正面: %.1f%%
😐 中性: %.1f%%
😔 负面: %.1f%%

*=== 语言分布 ===*
🇨🇳 简体中文: %.1f%%
🇹🇼 繁体中文: %.1f%%
🇬🇧 英文: %.1f%%
🌍 其他: %.1f%%
`,
		wordCloud,
		formatKeywordList(keywords.TopKeywords),
		formatNewKeywords(keywords.NewKeywords),
		formatTopicClusters(keywords.Topics),
		keywords.Sentiment.Positive,
		keywords.Sentiment.Neutral,
		keywords.Sentiment.Negative,
		keywords.Language.SimplifiedChinese,
		keywords.Language.TraditionalChinese,
		keywords.Language.English,
		keywords.Language.Other,
	)

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	pm.bot.Send(msg)
}

// 高级功能菜单
func (pm *PrivateMenu) showAdvancedMenu(chatID int64) {
	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("🧠 AI模型切换", "cmd:model"),
			tgbotapi.NewInlineKeyboardButtonData("🔑 Keys管理", "cmd:keys"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("📡 Webhook配置", "cmd:webhook"),
			tgbotapi.NewInlineKeyboardButtonData("🗄 数据库管理", "cmd:database"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("🚨 紧急模式", "cmd:emergency"),
			tgbotapi.NewInlineKeyboardButtonData("🔧 系统维护", "cmd:maintenance"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("📝 日志查看", "cmd:logs"),
			tgbotapi.NewInlineKeyboardButtonData("🔍 调试模式", "cmd:debug"),
		),
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("🔙 返回主菜单", "cmd:menu"),
		),
	)

	text := `
🚀 *高级功能控制*

这里是系统核心控制区域，请谨慎操作！

*可用功能：*
• AI模型切换 - 切换不同的AI模型
• Keys管理 - 管理API密钥池
• Webhook配置 - 配置回调地址
• 数据库管理 - 备份/恢复/优化
• 紧急模式 - 限流/降级/熔断
• 系统维护 - 更新/重启/清理
• 日志查看 - 实时日志流
• 调试模式 - 开发者选项
`

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	msg.ReplyMarkup = keyboard
	pm.bot.Send(msg)
}

// 处理按钮回调
func (pm *PrivateMenu) HandleCallback(callback *tgbotapi.CallbackQuery) {
	// 只处理Owner的回调
	if callback.From.ID != pm.ownerID {
		return
	}

	// 解析命令
	parts := strings.Split(callback.Data, ":")
	if len(parts) < 2 || parts[0] != "cmd" {
		return
	}

	switch parts[1] {
	case "menu":
		pm.showMainMenu(callback.Message.Chat.ID)
	case "stats":
		if len(parts) > 2 && parts[2] == "refresh" {
			pm.showStatistics(callback.Message.Chat.ID)
			pm.bot.Send(tgbotapi.NewCallback(callback.ID, "数据已刷新"))
		} else {
			pm.showStatistics(callback.Message.Chat.ID)
		}
	case "trends":
		pm.showTrends(callback.Message.Chat.ID)
	case "users":
		pm.showUserAnalysis(callback.Message.Chat.ID)
	case "keywords":
		pm.showKeywordAnalysis(callback.Message.Chat.ID)
	case "report":
		pm.generateReport(callback.Message.Chat.ID)
	case "config":
		pm.showConfig(callback.Message.Chat.ID)
	case "advanced":
		pm.showAdvancedMenu(callback.Message.Chat.ID)
	case "help":
		pm.showHelp(callback.Message.Chat.ID)
	}

	// 响应回调
	pm.bot.Send(tgbotapi.NewCallback(callback.ID, ""))
}

// 配置管理
func (pm *PrivateMenu) showConfig(chatID int64) {
	config := pm.dataTracker.GetConfig()
	
	text := fmt.Sprintf(`
⚙️ *系统配置*

*=== 基础配置 ===*
📞 每日限额: %d次
⏰ 重置时间: %s
🔄 会话超时: %d分钟
💬 最大轮数: %d轮

*=== AI配置 ===*
🤖 当前模型: %s
🌡 Temperature: %.1f
📝 Max Tokens: %d
🔑 API Keys: %d个

*=== 功能开关 ===*
关键词触发: %s
@提及触发: %s
私聊模式: %s
群组模式: %s
数据收集: %s
自动报告: %s

*=== 告警阈值 ===*
CPU告警: >%.1f%%
内存告警: >%dMB
失败率告警: >%.1f%%
响应时间告警: >%dms
`,
		config.DailyLimit,
		config.ResetTime,
		config.SessionTimeout,
		config.MaxRounds,
		config.AIModel,
		config.Temperature,
		config.MaxTokens,
		config.APIKeyCount,
		boolToEmoji(config.Features.KeywordTrigger),
		boolToEmoji(config.Features.MentionTrigger),
		boolToEmoji(config.Features.PrivateChat),
		boolToEmoji(config.Features.GroupChat),
		boolToEmoji(config.Features.DataCollection),
		boolToEmoji(config.Features.AutoReport),
		config.Alerts.CPUThreshold,
		config.Alerts.MemoryThreshold,
		config.Alerts.FailureRateThreshold,
		config.Alerts.ResponseTimeThreshold,
	)

	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		tgbotapi.NewInlineKeyboardRow(
			tgbotapi.NewInlineKeyboardButtonData("✏️ 修改配置", "cmd:config:edit"),
			tgbotapi.NewInlineKeyboardButtonData("💾 保存配置", "cmd:config:save"),
			tgbotapi.NewInlineKeyboardButtonData("🔙 返回", "cmd:menu"),
		),
	)

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	msg.ReplyMarkup = keyboard
	pm.bot.Send(msg)
}

// 显示帮助
func (pm *PrivateMenu) showHelp(chatID int64) {
	text := `
🆘 *帮助文档*

*命令列表：*
/menu - 显示主菜单
/stats - 查看统计数据
/report - 生成分析报告
/users - 用户分析
/keywords - 关键词分析
/trends - 趋势预测
/config - 系统配置
/export - 导出数据
/alert - 告警设置

*快捷键：*
• 按钮点击 - 直接操作
• 左右滑动 - 切换页面
• 上下滚动 - 查看更多

*数据说明：*
• 所有数据实时更新
• 报告每小时自动生成
• 历史数据保留30天
• 支持导出Excel/PDF

*高级功能：*
需要特殊权限才能访问
包含系统底层控制选项
请谨慎使用避免误操作

*问题反馈：*
如遇到问题请直接私聊描述
系统会自动记录错误日志
`

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	pm.bot.Send(msg)
}

// 辅助函数
func boolToEmoji(b bool) string {
	if b {
		return "✅ 开启"
	}
	return "❌ 关闭"
}

func formatUserRanking(users []UserRank) string {
	var result []string
	for i, u := range users {
		emoji := ""
		switch i {
		case 0:
			emoji = "🥇"
		case 1:
			emoji = "🥈"
		case 2:
			emoji = "🥉"
		default:
			emoji = fmt.Sprintf("%d.", i+1)
		}
		result = append(result, fmt.Sprintf("%s @%s (%d次)", emoji, u.Username, u.Count))
	}
	return strings.Join(result, "\n")
}

func formatGroupRanking(groups []GroupRank) string {
	var result []string
	for i, g := range groups {
		emoji := ""
		switch i {
		case 0:
			emoji = "🥇"
		case 1:
			emoji = "🥈"
		case 2:
			emoji = "🥉"
		default:
			emoji = fmt.Sprintf("%d.", i+1)
		}
		result = append(result, fmt.Sprintf("%s %s (%d条)", emoji, g.Title, g.Messages))
	}
	return strings.Join(result, "\n")
}

// 中文关键词处理系统 - 返回true表示已匹配关键词并处理
func (pm *PrivateMenu) handleChineseKeywords(message *tgbotapi.Message) bool {
	text := strings.TrimSpace(message.Text)
	
	// 定义Owner专属关键词映射
	keywordActions := map[string]func(int64){
		// 菜单相关
		"菜单":   pm.showMainMenu,
		"开始":   pm.showMainMenu,
		"主菜单": pm.showMainMenu,
		"控制台": pm.showMainMenu,
		"面板":   pm.showMainMenu,
		
		// 帮助相关
		"帮助":   pm.showHelpMenu,
		"说明":   pm.showHelpMenu,
		"指令":   pm.showHelpMenu,
		"使用":   pm.showHelpMenu,
		"教程":   pm.showHelpMenu,
		
		// 统计相关
		"统计":   pm.showStatistics,
		"数据":   pm.showStatistics,
		"报表":   pm.showStatistics,
		"概况":   pm.showStatistics,
		
		// 分析相关
		"分析":   pm.showUserAnalysis,
		"用户":   pm.showUserAnalysis,
		"趋势":   pm.showTrends,
		"关键词": pm.showKeywordAnalysis,
		
		// 报告相关
		"报告":   pm.generateReport,
		"总结":   pm.generateReport,
		"汇总":   pm.generateReport,
		
		// 配置相关
		"配置":   pm.showConfig,
		"设置":   pm.showConfig,
		"系统":   pm.showConfig,
		
		// 导出相关
		"导出":   pm.exportData,
		"备份":   pm.exportData,
		"下载":   pm.exportData,
		
		// 告警相关
		"告警":   pm.configureAlerts,
		"警报":   pm.configureAlerts,
		"通知":   pm.configureAlerts,
	}
	
	// 检查是否为单个关键词
	if action, exists := keywordActions[text]; exists {
		action(message.Chat.ID)
		return true // 已处理关键词
	}
	
	// 如果不是关键词，返回false让AI路由系统处理
	return false
}

// 显示帮助菜单
func (pm *PrivateMenu) showHelpMenu(chatID int64) {
	text := `
💡 *小爱同学使用说明* 📖

🎮 *基本操作*
├ 私聊直接发消息 → 小爱立即回复
├ 群聊需要@小爱 或 使用关键词
└ Owner享有无限配额和特权

🔧 *命令列表*
├ /help - 显示此帮助
├ /menu - 打开控制面板
├ /stats - 查看实时统计
├ /report - 生成分析报告
├ /users - 用户行为分析
└ /config - 系统配置

🎯 *中文关键词* (仅Owner私聊)
*菜单控制：*
├ 菜单、开始、主菜单、控制台、面板

*帮助说明：*
├ 帮助、说明、指令、使用、教程

*数据统计：*
├ 统计、数据、报表、概况

*分析功能：*
├ 分析、用户、趋势、关键词

*报告生成：*
├ 报告、总结、汇总

*系统配置：*
├ 配置、设置、系统

*数据管理：*
├ 导出、备份、下载

*告警设置：*
├ 告警、警报、通知

💝 *小爱2.0特色功能*
├ 🎭 智能场景识别
├ 💕 撒娇可爱人格
├ 🧠 永久记忆系统
├ 📚 爽文故事生成
├ 🌙 深夜亲密模式
└ 💬 超长情感回复

🎪 *场景模式*
├ 调情模式 → 害羞撒娇
├ 故事模式 → 3000字爽文
├ 任务模式 → 专业高效
├ 亲密模式 → 深度交流
└ 创意模式 → 天马行空

⚡ *快速开始*
1. 私聊发送 "菜单" → 打开控制面板
2. 私聊发送 "统计" → 查看数据概况
3. 私聊发送 "帮助" → 显示此说明
4. 直接聊天 → 享受AI女友陪伴

🔥 *高级功能*
├ 实时数据监控
├ 用户行为分析
├ 智能趋势预测
├ 关键词云图
├ 自动告警系统
└ 数据导出备份

💡 *使用技巧*
├ 深夜聊天更亲密
├ 表白会增加好感度
├ 夸奖会让小爱害羞
├ 私聊享受专属待遇
└ 记忆系统永不遗忘

🆘 *问题反馈*
遇到问题请直接私聊描述，系统会自动记录并处理。

---
💕 "主人，人家会一直陪在你身边的哦~"
`

	msg := tgbotapi.NewMessage(chatID, text)
	msg.ParseMode = "Markdown"
	pm.bot.Send(msg)
}
