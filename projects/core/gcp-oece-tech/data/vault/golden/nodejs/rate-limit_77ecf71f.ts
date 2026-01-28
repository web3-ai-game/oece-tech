// 速率限制模块
import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  interval?: number // 时间窗口（毫秒）
  uniqueTokenPerInterval?: number // 每个时间窗口的最大请求数
}

export function rateLimit(options: RateLimitOptions = {}) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  })

  return {
    check: async (identifier: string, limit: number) => {
      const tokenCount = tokenCache.get(identifier) || []
      const now = Date.now()
      const windowStart = now - (options.interval || 60000)
      
      const requests = tokenCount.filter(timestamp => timestamp > windowStart)
      
      if (requests.length >= limit) {
        return { success: false }
      }
      
      requests.push(now)
      tokenCache.set(identifier, requests)
      
      return { success: true }
    }
  }
}

// 默认实例
export const limiter = rateLimit({
  interval: 60 * 1000, // 1分钟
  uniqueTokenPerInterval: 500,
})
