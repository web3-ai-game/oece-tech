#!/usr/bin/env python3
"""Gemini API Key 池管理器 - 支持多層級路由和智能限流"""
import os, time, redis, json
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTier(Enum):
    FLASH_LITE = "gemini-2.5-flash-lite"
    PRO = "gemini-2.5-pro"
    FLASH = "gemini-2.5-flash"

@dataclass
class ModelConfig:
    name: str
    rpm_limit: int
    tpm_limit: int
    rpd_limit: int

@dataclass
class KeyStats:
    key_name: str
    rpm_used: int = 0
    tpm_used: int = 0
    rpd_used: int = 0
    last_reset_minute: int = 0
    last_reset_day: str = ""

class GeminiKeyPool:
    MODEL_CONFIGS = {
        ModelTier.FLASH_LITE: ModelConfig("gemini-2.5-flash-lite", 15, 250000, 1000),
        ModelTier.PRO: ModelConfig("gemini-2.5-pro", 2, 125000, 50),
        ModelTier.FLASH: ModelConfig("gemini-2.5-flash", 10, 250000, 250)
    }
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.flash_lite_keys = self._load_keys("GEMINI_API_KEYS")
        self.pro_keys = self._load_keys("GEMINI_KEY_PRIMARY,GEMINI_KEY_BACKUP")
        self.flash_keys = self._load_keys("GEMINI_GROUP_B_KEY_2,GEMINI_GROUP_B_KEY_3")
        logger.info(f"✅ Flash-Lite: {len(self.flash_lite_keys)}, Pro: {len(self.pro_keys)}, Flash: {len(self.flash_keys)}")
    
    def _load_keys(self, keys_str: str) -> List[str]:
        if "," in keys_str:
            return [os.getenv(k.strip(), "") for k in keys_str.split(",") if os.getenv(k.strip())]
        val = os.getenv(keys_str, "")
        return [k.strip() for k in val.split(",") if k.strip()] if val else []
    
    def get_key(self, tier: ModelTier) -> Tuple[Optional[str], Optional[str]]:
        keys = self.flash_lite_keys if tier == ModelTier.FLASH_LITE else (self.pro_keys if tier == ModelTier.PRO else self.flash_keys)
        if not keys: return None, None
        config = self.MODEL_CONFIGS[tier]
        for i, key in enumerate(keys):
            key_name = f"{tier.value}_key_{i}"
            if self._check_rate_limit(key_name, config):
                return key, key_name
        return None, None
    
    def _check_rate_limit(self, key_name: str, config: ModelConfig) -> bool:
        now, current_minute, current_day = int(time.time()), int(time.time()) // 60, time.strftime("%Y-%m-%d")
        stats_data = self.redis_client.get(f"gemini:stats:{key_name}")
        stats = KeyStats(**json.loads(stats_data)) if stats_data else KeyStats(key_name=key_name)
        if stats.last_reset_minute != current_minute: stats.rpm_used, stats.tpm_used, stats.last_reset_minute = 0, 0, current_minute
        if stats.last_reset_day != current_day: stats.rpd_used, stats.last_reset_day = 0, current_day
        return stats.rpm_used < config.rpm_limit and stats.rpd_used < config.rpd_limit
    
    def record_usage(self, key_name: str, tokens_used: int = 100):
        now, current_minute, current_day = int(time.time()), int(time.time()) // 60, time.strftime("%Y-%m-%d")
        stats_key = f"gemini:stats:{key_name}"
        stats_data = self.redis_client.get(stats_key)
        stats = KeyStats(**json.loads(stats_data)) if stats_data else KeyStats(key_name=key_name)
        if stats.last_reset_minute != current_minute: stats.rpm_used, stats.tpm_used, stats.last_reset_minute = 1, tokens_used, current_minute
        else: stats.rpm_used, stats.tpm_used = stats.rpm_used + 1, stats.tpm_used + tokens_used
        if stats.last_reset_day != current_day: stats.rpd_used, stats.last_reset_day = 1, current_day
        else: stats.rpd_used += 1
        self.redis_client.setex(stats_key, 86400, json.dumps(asdict(stats)))

_pool_instance = None
def get_key_pool(redis_url: str = None) -> GeminiKeyPool:
    global _pool_instance
    if _pool_instance is None:
        _pool_instance = GeminiKeyPool(redis_url or os.getenv("REDIS_URL", "redis://redis:6379"))
    return _pool_instance
