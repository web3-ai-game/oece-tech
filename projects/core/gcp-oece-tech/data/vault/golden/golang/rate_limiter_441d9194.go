package main

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type RateLimiter struct {
	redis   *redis.Client
	ownerID int64
}

func NewRateLimiter(redis *redis.Client, ownerID int64) *RateLimiter {
	return &RateLimiter{
		redis:   redis,
		ownerID: ownerID,
	}
}

// 检查配额
func (rl *RateLimiter) CheckQuota(userID int64) (bool, error) {
	// Owner无限制
	if userID == rl.ownerID {
		return true, nil
	}

	// 获取今日使用量
	date := time.Now().Format("2006-01-02")
	key := fmt.Sprintf("quota:%d:%s", userID, date)
	ctx := context.Background()

	count, err := rl.redis.Get(ctx, key).Int()
	if err == redis.Nil {
		count = 0
	} else if err != nil {
		return false, err
	}

	// 检查限制 (每天80次 - 群组和私聊总共)
	if count >= 80 {
		remaining := 24 - time.Now().Hour()
		return false, fmt.Errorf("今日配额已用完(80次)，%d小时后重置", remaining)
	}

	return true, nil
}

// 增加使用计数
func (rl *RateLimiter) IncrementUsage(userID int64) error {
	// Owner不计数
	if userID == rl.ownerID {
		return nil
	}

	date := time.Now().Format("2006-01-02")
	key := fmt.Sprintf("quota:%d:%s", userID, date)
	ctx := context.Background()

	// 递增
	rl.redis.Incr(ctx, key)

	// 设置过期时间 (24小时)
	rl.redis.Expire(ctx, key, 24*time.Hour)

	return nil
}

// 获取剩余配额
func (rl *RateLimiter) GetRemainingQuota(userID int64) int {
	if userID == rl.ownerID {
		return -1 // 无限制
	}

	date := time.Now().Format("2006-01-02")
	key := fmt.Sprintf("quota:%d:%s", userID, date)
	ctx := context.Background()

	count, err := rl.redis.Get(ctx, key).Int()
	if err != nil {
		count = 0
	}

	remaining := 80 - count
	if remaining < 0 {
		remaining = 0
	}

	return remaining
}
