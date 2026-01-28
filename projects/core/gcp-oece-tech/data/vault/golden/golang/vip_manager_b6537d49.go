package session

import (
	"container/list"
	"fmt"
	"sync"
	"time"

	"github.com/svs/telegram-bot/internal/ai"
	"github.com/svs/telegram-bot/internal/config"
	"go.uber.org/zap"
)

// VIPSession VIP会话
type VIPSession struct {
	UserID       int64
	Username     string
	ChatID       int64
	Messages     *list.List // 双向链表存储消息历史
	CreatedAt    time.Time
	LastActiveAt time.Time
	RoundCount   int
	MaxRounds    int
	Role         config.UserRole
	mu           sync.Mutex
}

// NewVIPSession 创建VIP会话
func NewVIPSession(userID int64, username string, chatID int64, role config.UserRole, maxRounds int) *VIPSession {
	return &VIPSession{
		UserID:       userID,
		Username:     username,
		ChatID:       chatID,
		Messages:     list.New(),
		CreatedAt:    time.Now(),
		LastActiveAt: time.Now(),
		RoundCount:   0,
		MaxRounds:    maxRounds,
		Role:         role,
	}
}

// AddMessage 添加消息
func (s *VIPSession) AddMessage(role, content string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Messages.PushBack(ai.Message{
		Role:    role,
		Content: content,
	})

	// 保持最多10条消息（5轮对话）
	if s.Messages.Len() > 10 {
		s.Messages.Remove(s.Messages.Front())
	}

	if role == "user" {
		s.RoundCount++
	}
	s.LastActiveAt = time.Now()
}

// GetHistory 获取历史消息
func (s *VIPSession) GetHistory() []ai.Message {
	s.mu.Lock()
	defer s.mu.Unlock()

	history := make([]ai.Message, 0, s.Messages.Len())
	for e := s.Messages.Front(); e != nil; e = e.Next() {
		if msg, ok := e.Value.(ai.Message); ok {
			history = append(history, msg)
		}
	}
	return history
}

// IsExpired 检查是否过期
func (s *VIPSession) IsExpired(timeoutMinutes int) bool {
	return time.Since(s.LastActiveAt) > time.Duration(timeoutMinutes)*time.Minute
}

// NeedsReset 是否需要重置
func (s *VIPSession) NeedsReset() bool {
	return s.RoundCount >= s.MaxRounds
}

// Reset 重置会话
func (s *VIPSession) Reset() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Messages.Init()
	s.RoundCount = 0
	s.LastActiveAt = time.Now()
}

// VIPManager VIP会话管理器
type VIPManager struct {
	sessions    map[int64]*VIPSession // userID -> session
	vipQueue    *list.List            // VIP队列
	maxVIPs     int
	maxRounds   int
	sessionLock sync.RWMutex
	logger      *zap.Logger
	config      *config.Config
}

// NewVIPManager 创建VIP管理器
func NewVIPManager(cfg *config.Config, logger *zap.Logger) *VIPManager {
	vm := &VIPManager{
		sessions:  make(map[int64]*VIPSession),
		vipQueue:  list.New(),
		maxVIPs:   3,  // 最多3个并发VIP
		maxRounds: 5,  // 每个VIP最多5轮对话
		logger:    logger,
		config:    cfg,
	}

	// 启动清理过期会话的定时器
	go vm.cleanupExpiredSessions()

	return vm
}

// CreateOrGetSession 创建或获取VIP会话
func (vm *VIPManager) CreateOrGetSession(userID int64, username string, chatID int64, role config.UserRole) (*VIPSession, error) {
	vm.sessionLock.Lock()
	defer vm.sessionLock.Unlock()

	// 如果已经是VIP，返回现有会话
	if session, exists := vm.sessions[userID]; exists {
		// 检查是否需要重置
		if session.NeedsReset() {
			session.Reset()
			vm.logger.Info("VIP session reset",
				zap.String("username", username),
				zap.Int64("user_id", userID))
		}
		return session, nil
	}

	// 根据用户角色确定是否可以创建VIP会话
	if !vm.canCreateVIPSession(role) {
		return nil, fmt.Errorf("user role %s cannot create VIP session", role)
	}

	// 检查VIP槽位是否已满
	if vm.vipQueue.Len() >= vm.maxVIPs && role != config.RoleOwner {
		// Owner可以踢掉最老的VIP
		if role == config.RoleOwner {
			vm.removeOldestVIP()
		} else {
			return nil, fmt.Errorf("VIP slots full (%d/%d)", vm.vipQueue.Len(), vm.maxVIPs)
		}
	}

	// 创建新VIP会话
	maxRounds := vm.getMaxRounds(role)
	session := NewVIPSession(userID, username, chatID, role, maxRounds)
	vm.sessions[userID] = session
	vm.vipQueue.PushBack(userID)

	vm.logger.Info("New VIP session created",
		zap.String("username", username),
		zap.Int64("user_id", userID),
		zap.String("role", string(role)),
		zap.Int("vip_count", vm.vipQueue.Len()))

	return session, nil
}

// GetSession 获取会话
func (vm *VIPManager) GetSession(userID int64) *VIPSession {
	vm.sessionLock.RLock()
	defer vm.sessionLock.RUnlock()
	return vm.sessions[userID]
}

// IsVIP 检查是否为VIP
func (vm *VIPManager) IsVIP(userID int64) bool {
	vm.sessionLock.RLock()
	defer vm.sessionLock.RUnlock()
	_, exists := vm.sessions[userID]
	return exists
}

// RemoveSession 移除会话
func (vm *VIPManager) RemoveSession(userID int64) {
	vm.sessionLock.Lock()
	defer vm.sessionLock.Unlock()

	delete(vm.sessions, userID)

	// 从队列中移除
	for e := vm.vipQueue.Front(); e != nil; e = e.Next() {
		if e.Value.(int64) == userID {
			vm.vipQueue.Remove(e)
			break
		}
	}

	vm.logger.Info("VIP session removed",
		zap.Int64("user_id", userID),
		zap.Int("remaining_vips", vm.vipQueue.Len()))
}

// canCreateVIPSession 检查角色是否可以创建VIP会话
func (vm *VIPManager) canCreateVIPSession(role config.UserRole) bool {
	switch role {
	case config.RoleOwner, config.RoleVIP, config.RolePremium:
		return true
	case config.RoleNormal:
		// 普通用户在有空位时可以创建
		return vm.vipQueue.Len() < vm.maxVIPs
	default:
		return false
	}
}

// getMaxRounds 根据角色获取最大轮数
func (vm *VIPManager) getMaxRounds(role config.UserRole) int {
	switch role {
	case config.RoleOwner:
		return 10 // Owner享受更多轮数
	case config.RoleVIP:
		return 7
	case config.RolePremium:
		return 5
	default:
		return 3
	}
}

// removeOldestVIP 移除最老的VIP（为Owner让位）
func (vm *VIPManager) removeOldestVIP() {
	if vm.vipQueue.Len() == 0 {
		return
	}

	oldest := vm.vipQueue.Front()
	if oldest != nil {
		userID := oldest.Value.(int64)
		delete(vm.sessions, userID)
		vm.vipQueue.Remove(oldest)
		vm.logger.Info("Removed oldest VIP to make room",
			zap.Int64("removed_user_id", userID))
	}
}

// cleanupExpiredSessions 清理过期会话
func (vm *VIPManager) cleanupExpiredSessions() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		vm.sessionLock.Lock()
		
		expiredUsers := make([]int64, 0)
		for userID, session := range vm.sessions {
			if session.IsExpired(10) { // 10分钟无活动
				expiredUsers = append(expiredUsers, userID)
			}
		}

		for _, userID := range expiredUsers {
			delete(vm.sessions, userID)
			// 从队列中移除
			for e := vm.vipQueue.Front(); e != nil; e = e.Next() {
				if e.Value.(int64) == userID {
					vm.vipQueue.Remove(e)
					break
				}
			}
		}

		if len(expiredUsers) > 0 {
			vm.logger.Info("Cleaned up expired VIP sessions",
				zap.Int("count", len(expiredUsers)))
		}

		vm.sessionLock.Unlock()
	}
}

// GetStatus 获取状态信息
func (vm *VIPManager) GetStatus() map[string]interface{} {
	vm.sessionLock.RLock()
	defer vm.sessionLock.RUnlock()

	vipList := make([]map[string]interface{}, 0)
	for e := vm.vipQueue.Front(); e != nil; e = e.Next() {
		userID := e.Value.(int64)
		if session, exists := vm.sessions[userID]; exists {
			vipList = append(vipList, map[string]interface{}{
				"user_id":     userID,
				"username":    session.Username,
				"round_count": session.RoundCount,
				"max_rounds":  session.MaxRounds,
				"role":        session.Role,
				"active_time": time.Since(session.LastActiveAt).String(),
			})
		}
	}

	return map[string]interface{}{
		"current_vips": vm.vipQueue.Len(),
		"max_vips":     vm.maxVIPs,
		"vip_list":     vipList,
	}
}
