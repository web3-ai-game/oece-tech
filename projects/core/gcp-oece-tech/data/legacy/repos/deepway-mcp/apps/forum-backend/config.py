#!/usr/bin/env python3
"""
配置管理模块
"""

import os
from enum import Enum
from dataclasses import dataclass
from typing import Optional

class ModelType(Enum):
    """模型类型"""
    FLASH_LITE = "gemini-2.0-flash-exp"  # 每日1000次
    FLASH = "gemini-2.5-flash"            # 每日250次  
    PRO = "gemini-2.5-pro"                # 每日50次，每分钟2次


class TaskType(Enum):
    """任务类型"""
    CHAT = "chat"              # 闲聊
    GROUP = "group"            # 群聊
    TASK_SIMPLE = "simple"     # 普通任务
    TASK_COMPLEX = "complex"   # 复杂任务


@dataclass
class ModelConfig:
    """模型配置"""
    name: str
    daily_limit: int
    minute_limit: Optional[int] = None
    priority: int = 0
    

@dataclass
class APIKeyConfig:
    """API Key 配置"""
    key: str
    name: str
    is_primary: bool = False


class Config:
    """全局配置"""
    
    # Telegram Bot
    TELEGRAM_TOKEN = os.getenv('TELEGRAM_BOT_SVSKILO_TOKEN')
    TELEGRAM_BOT_NAME = os.getenv('TELEGRAM_BOT_SVSKILO_NAME', 'svskilo_bot')
    
    # Owner ID (svskilo账号)
    OWNER_USERNAME = 'svskilo'
    OWNER_ID = None  # 将在运行时从username获取
    
    # Gemini API Keys
    GEMINI_KEY_PRIMARY = os.getenv('SVSKILO_BOT_GEMINI_PRIMARY') or os.getenv('GEMINI_API_KEY')
    GEMINI_KEY_BACKUP = os.getenv('SVSKILO_BOT_GEMINI_BACKUP') or os.getenv('GEMINI_API_KEY_3')
    
    # API Keys 列表
    API_KEYS = [
        APIKeyConfig(
            key=GEMINI_KEY_PRIMARY,
            name="PRIMARY",
            is_primary=True
        ),
        APIKeyConfig(
            key=GEMINI_KEY_BACKUP,
            name="BACKUP",
            is_primary=False
        ),
    ]
    
    # 模型配置
    MODELS = {
        ModelType.FLASH_LITE: ModelConfig(
            name="gemini-2.0-flash-exp",
            daily_limit=1000,
            priority=0  # 最高优先级
        ),
        ModelType.FLASH: ModelConfig(
            name="gemini-2.5-flash",
            daily_limit=250,
            priority=1
        ),
        ModelType.PRO: ModelConfig(
            name="gemini-2.5-pro",
            daily_limit=50,
            minute_limit=2,
            priority=2
        ),
    }
    
    # 任务路由规则
    TASK_ROUTING = {
        TaskType.CHAT: ModelType.FLASH_LITE,
        TaskType.GROUP: ModelType.FLASH_LITE,
        TaskType.TASK_SIMPLE: ModelType.FLASH,
        TaskType.TASK_COMPLEX: ModelType.PRO,
    }
    
    # 路由策略：
    # - Owner (@svskilo): 使用 KEY_1 所有模型 (Pro/Flash/Flash-Lite)
    # - Other users: 使用 KEY_3 的 Flash-Lite 模型
    OWNER_USE_PRIMARY_KEY = True  # Owner使用主Key
    OTHERS_USE_BACKUP_LITE = True  # 其他用户使用备用Key的Lite模型
    
    # 群聊关键词触发设置
    MAX_CONCURRENT_USERS = 5  # 最多同时服务5个用户
    MAX_CHAT_HISTORY_PER_USER = 5  # 每个用户保存5条聊天记录
    
    # Supabase (优先使用Service Role Key，降级到Anon Key)
    SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY = (
        os.getenv('SUPABASE_SERVICE_ROLE_KEY') or 
        os.getenv('SUPABASE_KEY') or
        os.getenv('SUPABASE_ANON_KEY') or
        os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    )
    
    # Redis (可选)
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    
    # 速率限制
    RATE_LIMIT_BUFFER = 0.8  # 使用80%配额时开始降级
    COOLDOWN_SECONDS = 30     # 速率限制冷却时间
    
    # 日志
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    @classmethod
    def validate(cls):
        """验证配置"""
        if not cls.TELEGRAM_TOKEN:
            raise ValueError("TELEGRAM_TOKEN is required")
        
        if not cls.GEMINI_KEY_PRIMARY:
            raise ValueError("GEMINI_KEY_PRIMARY is required")
        
        if cls.SUPABASE_URL and not cls.SUPABASE_KEY:
            raise ValueError("SUPABASE_KEY is required when SUPABASE_URL is set")
        
        return True


# 验证配置
Config.validate()
