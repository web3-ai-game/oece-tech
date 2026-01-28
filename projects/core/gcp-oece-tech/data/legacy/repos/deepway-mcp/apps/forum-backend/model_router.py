#!/usr/bin/env python3
"""
模型路由器 - 智能选择最优模型和API Key
"""

import logging
from datetime import datetime, timedelta
from typing import Tuple, Optional
from collections import defaultdict
import asyncio

import google.generativeai as genai

from config import Config, ModelType, TaskType, APIKeyConfig

logger = logging.getLogger(__name__)


class UsageTracker:
    """使用量追踪器"""
    
    def __init__(self):
        # {(model, key, date): count}
        self.daily_usage = defaultdict(int)
        # {(model, key, minute): count}
        self.minute_usage = defaultdict(int)
        self.last_cleanup = datetime.now()
    
    def record(self, model: ModelType, key_name: str):
        """记录一次使用"""
        today = datetime.now().date()
        current_minute = datetime.now().replace(second=0, microsecond=0)
        
        self.daily_usage[(model, key_name, today)] += 1
        self.minute_usage[(model, key_name, current_minute)] += 1
        
        # 定期清理旧数据
        self._cleanup()
    
    def get_daily_count(self, model: ModelType, key_name: str) -> int:
        """获取今日使用次数"""
        today = datetime.now().date()
        return self.daily_usage.get((model, key_name, today), 0)
    
    def get_minute_count(self, model: ModelType, key_name: str) -> int:
        """获取当前分钟使用次数"""
        current_minute = datetime.now().replace(second=0, microsecond=0)
        return self.minute_usage.get((model, key_name, current_minute), 0)
    
    def _cleanup(self):
        """清理过期数据"""
        now = datetime.now()
        if (now - self.last_cleanup).seconds < 3600:  # 每小时清理一次
            return
        
        # 清理分钟级数据（保留最近2分钟）
        cutoff_minute = now - timedelta(minutes=2)
        keys_to_delete = [
            k for k in self.minute_usage.keys()
            if k[2] < cutoff_minute
        ]
        for k in keys_to_delete:
            del self.minute_usage[k]
        
        self.last_cleanup = now


class ModelRouter:
    """模型路由器 - 智能选择模型和Key"""
    
    def __init__(self):
        self.usage_tracker = UsageTracker()
        self.api_keys = Config.API_KEYS
        logger.info("🎯 ModelRouter initialized")
    
    async def route(
        self, 
        task_type: TaskType,
        prefer_backup: bool = False,
        is_owner: bool = False
    ) -> Tuple[ModelType, APIKeyConfig, genai.GenerativeModel]:
        """
        路由到最优模型和Key
        
        Args:
            task_type: 任务类型
            prefer_backup: 是否优先使用备用Key
            is_owner: 是否是所有者 (@svskilo)
            
        Returns:
            (模型类型, API Key配置, Gemini模型实例)
        """
        
        # 1. 根据任务类型和用户身份选择模型
        if is_owner:
            # Owner: 使用主Key，所有模型可用
            model_type = Config.TASK_ROUTING.get(task_type, ModelType.FLASH_LITE)
            prefer_backup = False
        else:
            # 其他用户: 统一使用备用Key的Flash-Lite
            if Config.OTHERS_USE_BACKUP_LITE:
                model_type = ModelType.FLASH_LITE
                prefer_backup = True
            else:
                model_type = Config.TASK_ROUTING.get(task_type, ModelType.FLASH_LITE)
        
        model_config = Config.MODELS[model_type]
        
        # 2. 选择 API Key
        api_key = self._select_api_key(model_type, prefer_backup, force_backup=prefer_backup and not is_owner)
        
        # 3. 检查速率限制
        if not self._check_rate_limit(model_type, api_key.name):
            # 降级策略
            logger.warning(f"⚠️  {model_type.value} rate limit reached, fallback...")
            return await self._fallback_strategy(task_type)
        
        # 4. 创建模型实例
        genai.configure(api_key=api_key.key)
        model = genai.GenerativeModel(model_config.name)
        
        # 5. 记录使用
        self.usage_tracker.record(model_type, api_key.name)
        
        logger.info(
            f"✅ Routed {task_type.value} -> {model_type.value} "
            f"(Key: {api_key.name}, "
            f"Daily: {self.usage_tracker.get_daily_count(model_type, api_key.name)}/{model_config.daily_limit})"
        )
        
        return model_type, api_key, model
    
    def _select_api_key(self, model_type: ModelType, prefer_backup: bool = False, force_backup: bool = False) -> APIKeyConfig:
        """选择 API Key"""
        
        # 强制使用备用Key（其他用户）
        if force_backup:
            backup_keys = [k for k in self.api_keys if not k.is_primary]
            if backup_keys:
                return backup_keys[0]
        
        # 群聊优先使用备用Key
        if prefer_backup:
            backup_keys = [k for k in self.api_keys if not k.is_primary]
            if backup_keys:
                return backup_keys[0]
        
        # 检查主Key配额
        primary_key = next(k for k in self.api_keys if k.is_primary)
        model_config = Config.MODELS[model_type]
        
        daily_count = self.usage_tracker.get_daily_count(model_type, primary_key.name)
        
        # 如果主Key接近限额（80%），切换到备用
        if daily_count >= model_config.daily_limit * Config.RATE_LIMIT_BUFFER:
            logger.warning(f"⚠️  Primary key near limit ({daily_count}/{model_config.daily_limit}), switching to backup")
            backup_keys = [k for k in self.api_keys if not k.is_primary]
            if backup_keys:
                return backup_keys[0]
        
        return primary_key
    
    def _check_rate_limit(self, model_type: ModelType, key_name: str) -> bool:
        """检查速率限制"""
        model_config = Config.MODELS[model_type]
        
        # 检查日限额
        daily_count = self.usage_tracker.get_daily_count(model_type, key_name)
        if daily_count >= model_config.daily_limit:
            logger.warning(f"❌ Daily limit reached: {daily_count}/{model_config.daily_limit}")
            return False
        
        # 检查分钟限额（仅Pro）
        if model_config.minute_limit:
            minute_count = self.usage_tracker.get_minute_count(model_type, key_name)
            if minute_count >= model_config.minute_limit:
                logger.warning(f"❌ Minute limit reached: {minute_count}/{model_config.minute_limit}")
                return False
        
        return True
    
    async def _fallback_strategy(
        self, 
        task_type: TaskType
    ) -> Tuple[ModelType, APIKeyConfig, genai.GenerativeModel]:
        """降级策略"""
        
        # 复杂任务 Pro -> Flash -> Flash-Lite
        if task_type == TaskType.TASK_COMPLEX:
            # 尝试 Flash
            logger.info("🔄 Fallback: Pro -> Flash")
            flash_key = self._select_api_key(ModelType.FLASH, prefer_backup=True)
            if self._check_rate_limit(ModelType.FLASH, flash_key.name):
                genai.configure(api_key=flash_key.key)
                model = genai.GenerativeModel(Config.MODELS[ModelType.FLASH].name)
                self.usage_tracker.record(ModelType.FLASH, flash_key.name)
                return ModelType.FLASH, flash_key, model
            
            # 最后降级到 Flash-Lite
            logger.info("🔄 Fallback: Flash -> Flash-Lite")
            lite_key = self._select_api_key(ModelType.FLASH_LITE)
            genai.configure(api_key=lite_key.key)
            model = genai.GenerativeModel(Config.MODELS[ModelType.FLASH_LITE].name)
            self.usage_tracker.record(ModelType.FLASH_LITE, lite_key.name)
            return ModelType.FLASH_LITE, lite_key, model
        
        # 简单任务 Flash -> Flash-Lite
        elif task_type == TaskType.TASK_SIMPLE:
            logger.info("🔄 Fallback: Flash -> Flash-Lite")
            lite_key = self._select_api_key(ModelType.FLASH_LITE, prefer_backup=True)
            genai.configure(api_key=lite_key.key)
            model = genai.GenerativeModel(Config.MODELS[ModelType.FLASH_LITE].name)
            self.usage_tracker.record(ModelType.FLASH_LITE, lite_key.name)
            return ModelType.FLASH_LITE, lite_key, model
        
        # 默认使用 Flash-Lite
        lite_key = self._select_api_key(ModelType.FLASH_LITE)
        genai.configure(api_key=lite_key.key)
        model = genai.GenerativeModel(Config.MODELS[ModelType.FLASH_LITE].name)
        self.usage_tracker.record(ModelType.FLASH_LITE, lite_key.name)
        return ModelType.FLASH_LITE, lite_key, model
    
    async def wait_for_rate_limit(self, model_type: ModelType):
        """等待速率限制冷却"""
        logger.info(f"⏳ Waiting {Config.COOLDOWN_SECONDS}s for rate limit cooldown...")
        await asyncio.sleep(Config.COOLDOWN_SECONDS)
