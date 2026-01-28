#!/usr/bin/env python3
"""
关键词检测模块 - 小爱同学触发系统
"""

import logging
import re
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


class KeywordDetector:
    """关键词检测器"""
    
    # 关键词定义：简体、繁体、英文
    KEYWORDS = {
        '管理员': ['管理员', '管理員', 'admin', 'administrator', 'moderator'],
        '小爱同学': ['小爱同学', '小愛同學', 'xiaoai', 'xiao ai', 'little love']
    }
    
    # 所有关键词展平
    ALL_KEYWORDS = []
    for category, keywords in KEYWORDS.items():
        ALL_KEYWORDS.extend(keywords)
    
    def __init__(self):
        logger.info(f"🔍 KeywordDetector initialized with {len(self.ALL_KEYWORDS)} keywords")
    
    def detect(self, message: str) -> Optional[Tuple[str, str]]:
        """
        检测消息中是否包含关键词
        
        Args:
            message: 用户消息
            
        Returns:
            (category, matched_keyword) 或 None
        """
        message_lower = message.lower()
        
        for category, keywords in self.KEYWORDS.items():
            for keyword in keywords:
                # 不区分大小写匹配
                if keyword.lower() in message_lower:
                    logger.info(f"🎯 Keyword detected: '{keyword}' (category: {category})")
                    return (category, keyword)
        
        return None
    
    def should_respond(
        self,
        message: str,
        is_group: bool,
        active_users_count: int,
        max_concurrent_users: int = 5
    ) -> bool:
        """
        判断是否应该响应
        
        Args:
            message: 消息内容
            is_group: 是否群聊
            active_users_count: 当前活跃用户数
            max_concurrent_users: 最大并发用户数
            
        Returns:
            是否应该响应
        """
        # 检测关键词
        detected = self.detect(message)
        
        if not detected:
            return False
        
        # 群聊中检查并发用户限制
        if is_group and active_users_count >= max_concurrent_users:
            logger.warning(
                f"⚠️  Max concurrent users ({max_concurrent_users}) reached, "
                f"ignoring keyword trigger"
            )
            return False
        
        return True
    
    def get_trigger_message(self, keyword: str, username: str) -> str:
        """
        生成触发回复消息
        
        Args:
            keyword: 触发的关键词
            username: 用户名
            
        Returns:
            回复消息
        """
        messages = {
            '管理员': [
                f"📢 @{username} 您好！我是小爱同学，有什么可以帮您的吗？",
                f"👋 @{username} 管理员在此！有什么问题随时问我～",
                f"✨ @{username} 收到！小爱随时待命！"
            ],
            '小爱同学': [
                f"🍄 @{username} 在呢！像菌丝一样，我总是在线的～",
                f"💚 @{username} 小爱来啦！有什么可以帮您的吗？",
                f"🤖 @{username} 您叫我？我在！"
            ]
        }
        
        # 根据关键词找到分类
        category = None
        for cat, keywords in self.KEYWORDS.items():
            if any(kw.lower() == keyword.lower() for kw in keywords):
                category = cat
                break
        
        if category and category in messages:
            import random
            return random.choice(messages[category])
        
        return f"👋 @{username} 您好！我是小爱同学，有什么可以帮您的吗？"
