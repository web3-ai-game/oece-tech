#!/usr/bin/env python3
"""
🍄 Gemini 2.5 Flash Lite 智能轮询器
用于处理25k连环桶请求，保证高速响应
"""

import os
import time
import random
import asyncio
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import aiohttp
import redis.asyncio as redis
from dataclasses import dataclass
import json
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('GeminiRouter')

@dataclass
class APIKey:
    """API密钥配置"""
    key: str
    rpm_limit: int = 10  # 每分钟请求限制
    tpm_limit: int = 4000000  # 每分钟token限制
    daily_limit: int = 1500  # 每日请求限制
    last_used: float = 0
    request_count: int = 0
    daily_count: int = 0
    cooldown: float = 0.2  # 冷却时间(秒)
    is_healthy: bool = True
    error_count: int = 0
    
    def can_use(self) -> bool:
        """检查是否可以使用该密钥"""
        if not self.is_healthy:
            return False
        if time.time() - self.last_used < self.cooldown:
            return False
        if self.daily_count >= self.daily_limit:
            return False
        return True
    
    def use(self):
        """标记密钥已使用"""
        self.last_used = time.time()
        self.request_count += 1
        self.daily_count += 1

class GeminiRouter:
    """Gemini API智能路由器"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        # 模型配置
        self.models = [
            "gemini-2.5-flash-8b-latest",  # 最轻量，适合简单对话
            "gemini-2.5-flash-latest",      # 标准版，平衡性能
            "gemini-2.5-flash-002",         # 稳定版
        ]
        
        # 从环境变量加载API密钥
        api_keys_str = os.getenv('GEMINI_API_KEYS', '')
        self.api_keys: List[APIKey] = []
        for key in api_keys_str.split(','):
            if key.strip():
                self.api_keys.append(APIKey(key=key.strip()))
        
        # 轮询配置
        self.current_key_index = 0
        self.current_model_index = 0
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        
        # Redis连接
        self.redis_url = redis_url
        self.redis_client: Optional[redis.Redis] = None
        
        # 速率限制
        self.max_rpm = 8333  # 25k / 3分钟
        self.request_window = []  # 请求时间窗口
        
        # 缓存配置
        self.cache_ttl = 300  # 5分钟缓存
        
        logger.info(f"初始化完成: {len(self.api_keys)}个密钥, {len(self.models)}个模型")

    async def connect_redis(self):
        """连接Redis"""
        try:
            self.redis_client = await redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            await self.redis_client.ping()
            logger.info("Redis连接成功")
        except Exception as e:
            logger.warning(f"Redis连接失败: {e}, 使用内存缓存")
            self.redis_client = None

    def get_cache_key(self, prompt: str, model: str) -> str:
        """生成缓存键"""
        content = f"{model}:{prompt}"
        return f"gemini:cache:{hashlib.md5(content.encode()).hexdigest()}"

    async def get_cached_response(self, prompt: str, model: str) -> Optional[str]:
        """获取缓存的响应"""
        if not self.redis_client:
            return None
        
        try:
            cache_key = self.get_cache_key(prompt, model)
            cached = await self.redis_client.get(cache_key)
            if cached:
                logger.info(f"缓存命中: {cache_key[:20]}...")
                return cached
        except Exception as e:
            logger.error(f"读取缓存失败: {e}")
        
        return None

    async def cache_response(self, prompt: str, model: str, response: str):
        """缓存响应"""
        if not self.redis_client:
            return
        
        try:
            cache_key = self.get_cache_key(prompt, model)
            await self.redis_client.setex(cache_key, self.cache_ttl, response)
            logger.info(f"缓存保存: {cache_key[:20]}...")
        except Exception as e:
            logger.error(f"保存缓存失败: {e}")

    def check_rate_limit(self) -> bool:
        """检查速率限制"""
        now = time.time()
        # 清理1分钟前的请求记录
        self.request_window = [t for t in self.request_window if now - t < 60]
        
        # 检查是否超过限制
        if len(self.request_window) >= self.max_rpm:
            logger.warning(f"速率限制: {len(self.request_window)}/{self.max_rpm} rpm")
            return False
        
        self.request_window.append(now)
        return True

    def get_next_key(self) -> Optional[APIKey]:
        """获取下一个可用的API密钥（轮询策略）"""
        attempts = 0
        total_keys = len(self.api_keys)
        
        while attempts < total_keys:
            key = self.api_keys[self.current_key_index]
            self.current_key_index = (self.current_key_index + 1) % total_keys
            
            if key.can_use():
                return key
            
            attempts += 1
        
        # 如果所有密钥都不可用，找冷却时间最短的
        if self.api_keys:
            return min(self.api_keys, key=lambda k: k.last_used if k.is_healthy else float('inf'))
        
        return None

    def get_next_model(self) -> str:
        """获取下一个模型（轮询策略）"""
        model = self.models[self.current_model_index]
        self.current_model_index = (self.current_model_index + 1) % len(self.models)
        return model

    async def call_gemini_api(
        self,
        prompt: str,
        api_key: APIKey,
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Optional[str]:
        """调用Gemini API"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key.key
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "topP": 0.95,
                "topK": 40
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'candidates' in data and data['candidates']:
                            content = data['candidates'][0].get('content', {})
                            parts = content.get('parts', [])
                            if parts:
                                return parts[0].get('text', '')
                    else:
                        error_text = await response.text()
                        logger.error(f"API错误 {response.status}: {error_text}")
                        
                        # 处理特定错误
                        if response.status == 429:  # 速率限制
                            api_key.cooldown = min(api_key.cooldown * 2, 10)
                        elif response.status >= 500:  # 服务器错误
                            api_key.error_count += 1
                            if api_key.error_count >= 5:
                                api_key.is_healthy = False
                                logger.warning(f"密钥标记为不健康: {api_key.key[:10]}...")
        
        except asyncio.TimeoutError:
            logger.error(f"请求超时: {model}")
            api_key.error_count += 1
        except Exception as e:
            logger.error(f"请求异常: {e}")
            api_key.error_count += 1
        
        return None

    async def process_request(
        self,
        prompt: str,
        use_cache: bool = True,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        retry_count: int = 3
    ) -> Dict[str, Any]:
        """处理请求（带重试和降级）"""
        start_time = time.time()
        
        # 检查速率限制
        if not self.check_rate_limit():
            await asyncio.sleep(1)  # 等待1秒
        
        # 选择模型
        model = self.get_next_model()
        
        # 检查缓存
        if use_cache:
            cached = await self.get_cached_response(prompt, model)
            if cached:
                self.successful_requests += 1
                return {
                    "success": True,
                    "response": cached,
                    "model": model,
                    "cached": True,
                    "latency": time.time() - start_time
                }
        
        # 重试逻辑
        last_error = None
        for attempt in range(retry_count):
            # 获取可用密钥
            api_key = self.get_next_key()
            if not api_key:
                logger.error("没有可用的API密钥")
                await asyncio.sleep(1)
                continue
            
            # 等待冷却
            if not api_key.can_use():
                wait_time = api_key.cooldown - (time.time() - api_key.last_used)
                if wait_time > 0:
                    await asyncio.sleep(wait_time)
            
            # 调用API
            logger.info(f"尝试 {attempt+1}/{retry_count}: {model} with key {api_key.key[:10]}...")
            response = await self.call_gemini_api(
                prompt, api_key, model, temperature, max_tokens
            )
            
            api_key.use()
            
            if response:
                # 成功
                self.successful_requests += 1
                self.total_requests += 1
                
                # 缓存响应
                if use_cache:
                    await self.cache_response(prompt, model, response)
                
                # 恢复密钥健康状态
                if not api_key.is_healthy and api_key.error_count == 0:
                    api_key.is_healthy = True
                    logger.info(f"密钥恢复健康: {api_key.key[:10]}...")
                
                return {
                    "success": True,
                    "response": response,
                    "model": model,
                    "cached": False,
                    "attempts": attempt + 1,
                    "latency": time.time() - start_time
                }
            else:
                last_error = f"Model {model} failed"
                # 切换到下一个模型
                model = self.get_next_model()
        
        # 所有尝试失败
        self.failed_requests += 1
        self.total_requests += 1
        
        return {
            "success": False,
            "error": last_error or "All attempts failed",
            "attempts": retry_count,
            "latency": time.time() - start_time
        }

    async def get_stats(self) -> Dict[str, Any]:
        """获取统计信息"""
        healthy_keys = sum(1 for k in self.api_keys if k.is_healthy)
        total_daily = sum(k.daily_count for k in self.api_keys)
        
        return {
            "total_requests": self.total_requests,
            "successful": self.successful_requests,
            "failed": self.failed_requests,
            "success_rate": self.successful_requests / max(1, self.total_requests),
            "healthy_keys": healthy_keys,
            "total_keys": len(self.api_keys),
            "models": self.models,
            "current_rpm": len(self.request_window),
            "max_rpm": self.max_rpm,
            "daily_usage": total_daily,
            "daily_limit": sum(k.daily_limit for k in self.api_keys)
        }

    async def reset_daily_limits(self):
        """重置每日限制（应该每天调用一次）"""
        for key in self.api_keys:
            key.daily_count = 0
            key.error_count = 0
            if key.error_count < 3:
                key.is_healthy = True
        logger.info("每日限制已重置")

    async def health_check(self) -> bool:
        """健康检查"""
        # 检查是否有健康的密钥
        healthy_keys = [k for k in self.api_keys if k.is_healthy]
        if not healthy_keys:
            logger.error("没有健康的API密钥！")
            return False
        
        # 检查Redis连接
        if self.redis_client:
            try:
                await self.redis_client.ping()
            except:
                logger.warning("Redis连接丢失，尝试重连...")
                await self.connect_redis()
        
        return True

# 使用示例
async def main():
    """测试路由器"""
    # 初始化路由器
    router = GeminiRouter()
    await router.connect_redis()
    
    # 测试请求
    test_prompts = [
        "你好，介绍一下自己",
        "今天天气怎么样？",
        "讲一个笑话",
        "什么是人工智能？",
        "推荐一部电影"
    ]
    
    # 并发处理请求
    tasks = []
    for prompt in test_prompts * 5:  # 25个请求
        tasks.append(router.process_request(prompt))
    
    results = await asyncio.gather(*tasks)
    
    # 打印结果
    success_count = sum(1 for r in results if r['success'])
    print(f"\n成功率: {success_count}/{len(results)}")
    
    # 打印统计
    stats = await router.get_stats()
    print(f"\n统计信息:")
    print(json.dumps(stats, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())
