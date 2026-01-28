#!/usr/bin/env python3
"""
数据库管理模块 - Supabase集成
"""

import logging
from datetime import datetime
from typing import Optional, List, Dict
from supabase import create_client, Client

from config import Config

logger = logging.getLogger(__name__)


class Database:
    """数据库管理器"""
    
    def __init__(self):
        if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
            logger.warning("⚠️  Supabase not configured, using in-memory storage")
            self.client = None
            self.memory_storage = {
                'chat_history': [],
                'user_registry': {}
            }
        else:
            self.client: Client = create_client(
                Config.SUPABASE_URL,
                Config.SUPABASE_KEY
            )
            logger.info("✅ Supabase client initialized")
    
    async def save_chat_history(
        self,
        chat_id: int,
        user_id: int,
        username: str,
        message_text: str,
        response_text: str,
        model_used: str,
        metadata: Optional[Dict] = None
    ) -> bool:
        """
        保存聊天记录
        
        Args:
            chat_id: 聊天ID
            user_id: 用户ID
            username: 用户名
            message_text: 用户消息
            response_text: Bot响应
            model_used: 使用的模型
            metadata: 额外元数据
        """
        try:
            data = {
                'chat_id': chat_id,
                'user_id': user_id,
                'username': username,
                'message_text': message_text,
                'response_text': response_text,
                'model_used': model_used,
                'metadata': metadata or {},
                'created_at': datetime.now().isoformat()
            }
            
            if self.client:
                result = self.client.table('chat_history').insert(data).execute()
                logger.info(f"💾 Saved chat history for user {user_id}")
                return True
            else:
                # 内存存储
                self.memory_storage['chat_history'].append(data)
                # 只保留最近1000条
                if len(self.memory_storage['chat_history']) > 1000:
                    self.memory_storage['chat_history'] = \
                        self.memory_storage['chat_history'][-1000:]
                return True
                
        except Exception as e:
            logger.error(f"❌ Failed to save chat history: {e}")
            return False
    
    async def get_user_history(
        self,
        user_id: int,
        limit: int = 5
    ) -> List[Dict]:
        """
        获取用户聊天历史（最近N条）
        
        Args:
            user_id: 用户ID
            limit: 返回数量
            
        Returns:
            聊天记录列表
        """
        try:
            if self.client:
                result = self.client.table('chat_history') \
                    .select('*') \
                    .eq('user_id', user_id) \
                    .order('created_at', desc=True) \
                    .limit(limit) \
                    .execute()
                return result.data
            else:
                # 从内存获取
                user_chats = [
                    chat for chat in self.memory_storage['chat_history']
                    if chat['user_id'] == user_id
                ]
                return sorted(
                    user_chats,
                    key=lambda x: x['created_at'],
                    reverse=True
                )[:limit]
                
        except Exception as e:
            logger.error(f"❌ Failed to get user history: {e}")
            return []
    
    async def register_user(
        self,
        user_id: int,
        username: str,
        first_name: str,
        chat_id: int,
        triggered_by_keyword: str
    ) -> bool:
        """
        注册触发关键词的用户
        
        Args:
            user_id: 用户ID
            username: 用户名
            first_name: 名字
            chat_id: 聊天ID
            triggered_by_keyword: 触发的关键词
        """
        try:
            data = {
                'user_id': user_id,
                'username': username,
                'first_name': first_name,
                'chat_id': chat_id,
                'triggered_by_keyword': triggered_by_keyword,
                'trigger_count': 1,
                'last_triggered_at': datetime.now().isoformat(),
                'created_at': datetime.now().isoformat()
            }
            
            if self.client:
                # 尝试更新或插入
                existing = self.client.table('user_registry') \
                    .select('*') \
                    .eq('user_id', user_id) \
                    .eq('chat_id', chat_id) \
                    .execute()
                
                if existing.data:
                    # 更新触发次数
                    self.client.table('user_registry') \
                        .update({
                            'trigger_count': existing.data[0]['trigger_count'] + 1,
                            'last_triggered_at': datetime.now().isoformat()
                        }) \
                        .eq('user_id', user_id) \
                        .eq('chat_id', chat_id) \
                        .execute()
                else:
                    # 插入新记录
                    self.client.table('user_registry').insert(data).execute()
                
                logger.info(f"📝 Registered user {username} ({user_id})")
                return True
            else:
                # 内存存储
                key = f"{user_id}_{chat_id}"
                if key in self.memory_storage['user_registry']:
                    self.memory_storage['user_registry'][key]['trigger_count'] += 1
                    self.memory_storage['user_registry'][key]['last_triggered_at'] = datetime.now().isoformat()
                else:
                    self.memory_storage['user_registry'][key] = data
                return True
                
        except Exception as e:
            logger.error(f"❌ Failed to register user: {e}")
            return False
    
    async def get_user_info(
        self,
        user_id: int,
        chat_id: int
    ) -> Optional[Dict]:
        """获取用户注册信息"""
        try:
            if self.client:
                result = self.client.table('user_registry') \
                    .select('*') \
                    .eq('user_id', user_id) \
                    .eq('chat_id', chat_id) \
                    .execute()
                return result.data[0] if result.data else None
            else:
                key = f"{user_id}_{chat_id}"
                return self.memory_storage['user_registry'].get(key)
                
        except Exception as e:
            logger.error(f"❌ Failed to get user info: {e}")
            return None
    
    async def get_active_users_count(self, chat_id: int) -> int:
        """获取聊天中活跃用户数（有聊天记录的）"""
        try:
            if self.client:
                result = self.client.table('chat_history') \
                    .select('user_id') \
                    .eq('chat_id', chat_id) \
                    .execute()
                unique_users = set(chat['user_id'] for chat in result.data)
                return len(unique_users)
            else:
                unique_users = set(
                    chat['user_id'] 
                    for chat in self.memory_storage['chat_history']
                    if chat['chat_id'] == chat_id
                )
                return len(unique_users)
                
        except Exception as e:
            logger.error(f"❌ Failed to get active users count: {e}")
            return 0


# SQL表结构（在Supabase中创建）
SQL_SCHEMA = """
-- 聊天历史表
CREATE TABLE IF NOT EXISTS chat_history (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(255),
    message_text TEXT,
    response_text TEXT,
    model_used VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_chat_id ON chat_history(chat_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);

-- 用户注册表
CREATE TABLE IF NOT EXISTS user_registry (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    chat_id BIGINT NOT NULL,
    triggered_by_keyword VARCHAR(100),
    trigger_count INTEGER DEFAULT 1,
    last_triggered_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, chat_id)
);

CREATE INDEX idx_user_registry_user_id ON user_registry(user_id);
CREATE INDEX idx_user_registry_chat_id ON user_registry(chat_id);
"""
