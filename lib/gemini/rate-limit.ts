// 🚦 IP 限流系统（使用 Upstash Redis）

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { GEMINI_MODELS, GeminiModelKey } from './config';

// 初始化 Upstash Redis
let redis: Redis | null = null;
let rateLimiters: Map<GeminiModelKey, Ratelimit> = new Map();

// 懒加载 Redis（避免 Build Time 错误）
function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error('Upstash Redis credentials missing');
    }

    redis = new Redis({ url, token });
  }

  return redis;
}

/**
 * 获取模型的限流器
 */
function getRateLimiter(model: GeminiModelKey): Ratelimit {
  if (rateLimiters.has(model)) {
    return rateLimiters.get(model)!;
  }

  const config = GEMINI_MODELS[model];

  // 如果是无限模型，返回一个宽松的限流器
  if (config.rateLimit.rpm === Infinity) {
    const limiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10000, '1 m'), // 超高限制
      analytics: false
    });

    rateLimiters.set(model, limiter);
    return limiter;
  }

  // 正常限流（基于每分钟请求数）
  const limiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(config.rateLimit.rpm, '1 m'),
    analytics: true,
    prefix: `ratelimit:gemini:${model}`
  });

  rateLimiters.set(model, limiter);
  return limiter;
}

/**
 * 检查 IP 是否被限流
 * @param ip - 用户 IP 地址
 * @param model - Gemini 模型
 * @returns { success: boolean, remaining: number, reset: number }
 */
export async function checkRateLimit(
  ip: string,
  model: GeminiModelKey
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  try {
    const limiter = getRateLimiter(model);
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    return {
      success,
      remaining,
      reset,
      limit
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);

    // 降级策略：限流失败时允许通过（Beta 阶段）
    return {
      success: true,
      remaining: 5,
      reset: Date.now() + 60000,
      limit: 5
    };
  }
}

/**
 * 获取剩余请求次数
 */
export async function getRemainingRequests(
  ip: string,
  model: GeminiModelKey
): Promise<number> {
  const result = await checkRateLimit(ip, model);
  return result.remaining;
}
