import { createClient } from 'redis';

/**
 * Redis cache manager
 */
export class CacheManager {
  constructor(options = {}) {
    this.client = null;
    this.connected = false;
    this.options = {
      host: options.host || process.env.REDIS_HOST || 'localhost',
      port: options.port || process.env.REDIS_PORT || 6379,
      password: options.password || process.env.REDIS_PASSWORD || undefined,
      db: options.db || 0,
      ttl: options.ttl || 3600, // Default TTL: 1 hour
    };
  }

  /**
   * Connect to Redis
   */
  async connect() {
    if (this.connected) return;

    try {
      this.client = createClient({
        socket: {
          host: this.options.host,
          port: this.options.port,
        },
        password: this.options.password,
        database: this.options.db,
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.connected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client && this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    if (!this.connected) await this.connect();
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = null) {
    if (!this.connected) await this.connect();
    
    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.options.ttl;
      
      await this.client.setEx(key, expiry, serialized);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Success status
   */
  async delete(key) {
    if (!this.connected) await this.connect();
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Existence status
   */
  async exists(key) {
    if (!this.connected) await this.connect();
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Clear all keys matching pattern
   * @param {string} pattern - Key pattern (e.g., 'user:*')
   * @returns {Promise<number>} Number of keys deleted
   */
  async clear(pattern = '*') {
    if (!this.connected) await this.connect();
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        return keys.length;
      }
      return 0;
    } catch (error) {
      console.error('Cache clear error:', error);
      return 0;
    }
  }

  /**
   * Get cache with fallback to function
   * @param {string} key - Cache key
   * @param {Function} fn - Fallback function to get data
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<any>} Cached or fresh data
   */
  async getOrSet(key, fn, ttl = null) {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  /**
   * Increment counter
   * @param {string} key - Cache key
   * @param {number} amount - Amount to increment (default: 1)
   * @returns {Promise<number>} New value
   */
  async increment(key, amount = 1) {
    if (!this.connected) await this.connect();
    
    try {
      return await this.client.incrBy(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Set expiration on key
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async expire(key, ttl) {
    if (!this.connected) await this.connect();
    
    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }
}

/**
 * Create cache middleware for Express
 * @param {CacheManager} cacheManager - Cache manager instance
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
export function cacheMiddleware(cacheManager, ttl = 300) {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cached = await cacheManager.get(key);
      if (cached) {
        return res.json(cached);
      }

      // Override res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        cacheManager.set(key, data, ttl).catch(console.error);
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

export default { CacheManager, cacheMiddleware };
