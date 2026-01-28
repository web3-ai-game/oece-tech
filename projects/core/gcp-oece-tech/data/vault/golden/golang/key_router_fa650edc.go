package router

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/svs/telegram-bot/internal/config"
	"go.uber.org/zap"
)

// KeyUsage Key使用统计
type KeyUsage struct {
	DailyCount  int
	RPMTimes    []time.Time
	LastUsed    time.Time
	ErrorCount  int
	IsBlacklist bool
	BlacklistAt time.Time
	mu          sync.Mutex
}

// KeyRouter API密钥路由器
type KeyRouter struct {
	config   *config.Config
	logger   *zap.Logger
	keyUsage map[string]*KeyUsage
	mu       sync.RWMutex
}

// NewKeyRouter 创建密钥路由器
func NewKeyRouter(cfg *config.Config, logger *zap.Logger) *KeyRouter {
	kr := &KeyRouter{
		config:   cfg,
		logger:   logger,
		keyUsage: make(map[string]*KeyUsage),
	}

	// 初始化所有Key的使用统计
	for _, group := range cfg.KeyGroups {
		for _, key := range group.Keys {
			kr.keyUsage[key] = &KeyUsage{
				RPMTimes: make([]time.Time, 0),
			}
		}
	}

	// 启动定时重置任务
	go kr.dailyReset()
	go kr.cleanupBlacklist()

	return kr
}

// GetKeyForUser 根据用户角色获取合适的Key
func (kr *KeyRouter) GetKeyForUser(userRole config.UserRole, taskType config.TaskType) (string, string, error) {
	kr.mu.RLock()
	defer kr.mu.RUnlock()

	// 根据用户角色选择合适的密钥组
	var eligibleGroups []config.KeyGroupConfig
	for _, group := range kr.config.KeyGroups {
		if kr.isGroupEligible(group, userRole) {
			eligibleGroups = append(eligibleGroups, group)
		}
	}

	if len(eligibleGroups) == 0 {
		return "", "", fmt.Errorf("no eligible key groups for role %s", userRole)
	}

	// 随机选择一个组
	group := eligibleGroups[rand.Intn(len(eligibleGroups))]

	// 在组内随机选择可用的Key
	availableKeys := kr.getAvailableKeysFromGroup(group)
	if len(availableKeys) == 0 {
		return "", "", fmt.Errorf("no available keys in group %s", group.Name)
	}

	key := availableKeys[rand.Intn(len(availableKeys))]

	// 标记Key使用
	if err := kr.markKeyUsed(key); err != nil {
		return "", "", err
	}

	kr.logger.Info("Key selected",
		zap.String("group", group.Name),
		zap.String("role", string(userRole)),
		zap.String("key", key[:20]+"..."))

	return key, group.Name, nil
}

// GetRouterKey 获取路由器Key（用于负载均衡）
func (kr *KeyRouter) GetRouterKey() string {
	routers := make([]string, 0, len(kr.config.RouterKeys))
	for _, key := range kr.config.RouterKeys {
		routers = append(routers, key)
	}
	
	if len(routers) == 0 {
		return ""
	}
	
	return routers[rand.Intn(len(routers))]
}

// isGroupEligible 检查密钥组是否适合用户角色
func (kr *KeyRouter) isGroupEligible(group config.KeyGroupConfig, userRole config.UserRole) bool {
	// 角色优先级匹配
	switch userRole {
	case config.RoleOwner:
		return group.Role == config.RoleOwner || group.Role == config.RoleVIP
	case config.RoleVIP:
		return group.Role == config.RoleVIP || group.Role == config.RolePremium
	case config.RolePremium:
		return group.Role == config.RolePremium || group.Role == config.RoleNormal
	case config.RoleNormal:
		return group.Role == config.RoleNormal || group.Role == config.RoleGuest
	case config.RoleGuest:
		return group.Role == config.RoleGuest
	default:
		return group.Role == config.RoleGuest
	}
}

// getAvailableKeysFromGroup 获取组内可用的Keys
func (kr *KeyRouter) getAvailableKeysFromGroup(group config.KeyGroupConfig) []string {
	var available []string

	for _, key := range group.Keys {
		usage := kr.keyUsage[key]
		if kr.isKeyAvailable(usage, group.RPMLimit) {
			available = append(available, key)
		}
	}

	// 打乱顺序以实现随机负载均衡
	rand.Shuffle(len(available), func(i, j int) {
		available[i], available[j] = available[j], available[i]
	})

	return available
}

// isKeyAvailable 检查Key是否可用
func (kr *KeyRouter) isKeyAvailable(usage *KeyUsage, rpmLimit int) bool {
	usage.mu.Lock()
	defer usage.mu.Unlock()

	// 检查黑名单
	if usage.IsBlacklist {
		// 黑名单1小时后自动解除
		if time.Since(usage.BlacklistAt) > time.Hour {
			usage.IsBlacklist = false
			usage.ErrorCount = 0
		} else {
			return false
		}
	}

	// 清理60秒前的RPM记录
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

	// 检查日限额（保守使用30%）
	model := kr.config.Models[config.ModelFlashLite] // 默认模型
	dailyLimit := int(float64(model.DailyLimit) * 0.3)
	if usage.DailyCount >= dailyLimit {
		return false
	}

	// 冷却时间检查
	if !usage.LastUsed.IsZero() && time.Since(usage.LastUsed) < 10*time.Second {
		return false
	}

	return true
}

// markKeyUsed 标记Key已使用
func (kr *KeyRouter) markKeyUsed(key string) error {
	usage, exists := kr.keyUsage[key]
	if !exists {
		return fmt.Errorf("key not found in usage map")
	}

	usage.mu.Lock()
	defer usage.mu.Unlock()

	usage.DailyCount++
	usage.RPMTimes = append(usage.RPMTimes, time.Now())
	usage.LastUsed = time.Now()

	return nil
}

// MarkKeyError 标记Key出错
func (kr *KeyRouter) MarkKeyError(key string) {
	usage, exists := kr.keyUsage[key]
	if !exists {
		return
	}

	usage.mu.Lock()
	defer usage.mu.Unlock()

	usage.ErrorCount++

	// 错误3次拉黑1小时
	if usage.ErrorCount >= 3 {
		usage.IsBlacklist = true
		usage.BlacklistAt = time.Now()
		kr.logger.Warn("Key blacklisted due to errors",
			zap.String("key", key[:20]+"..."),
			zap.Int("error_count", usage.ErrorCount))
	}
}

// dailyReset 每日重置计数器
func (kr *KeyRouter) dailyReset() {
	for {
		// 计算到明天0点的时间
		now := time.Now()
		next := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, now.Location())
		duration := next.Sub(now)

		time.Sleep(duration)

		kr.mu.Lock()
		for _, usage := range kr.keyUsage {
			usage.mu.Lock()
			usage.DailyCount = 0
			usage.RPMTimes = make([]time.Time, 0)
			usage.mu.Unlock()
		}
		kr.mu.Unlock()

		kr.logger.Info("Daily counters reset")
	}
}

// cleanupBlacklist 定期清理黑名单
func (kr *KeyRouter) cleanupBlacklist() {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		kr.mu.RLock()
		for key, usage := range kr.keyUsage {
			usage.mu.Lock()
			if usage.IsBlacklist && time.Since(usage.BlacklistAt) > time.Hour {
				usage.IsBlacklist = false
				usage.ErrorCount = 0
				kr.logger.Info("Key removed from blacklist",
					zap.String("key", key[:20]+"..."))
			}
			usage.mu.Unlock()
		}
		kr.mu.RUnlock()
	}
}

// GetStatus 获取路由器状态
func (kr *KeyRouter) GetStatus() map[string]interface{} {
	kr.mu.RLock()
	defer kr.mu.RUnlock()

	totalKeys := 0
	availableKeys := 0
	blacklistedKeys := 0

	for _, usage := range kr.keyUsage {
		totalKeys++
		if usage.IsBlacklist {
			blacklistedKeys++
		} else if kr.isKeyAvailable(usage, 10) {
			availableKeys++
		}
	}

	groupStatus := make(map[string]map[string]int)
	for name, group := range kr.config.KeyGroups {
		status := map[string]int{
			"total":     len(group.Keys),
			"available": 0,
		}
		for _, key := range group.Keys {
			if usage := kr.keyUsage[key]; kr.isKeyAvailable(usage, group.RPMLimit) {
				status["available"]++
			}
		}
		groupStatus[name] = status
	}

	return map[string]interface{}{
		"total_keys":       totalKeys,
		"available_keys":   availableKeys,
		"blacklisted_keys": blacklistedKeys,
		"groups":           groupStatus,
	}
}
