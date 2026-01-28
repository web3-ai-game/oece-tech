#!/usr/bin/env python3
"""
双Key轮替路由器 - 优化响应速度
"""

import logging
import asyncio
from datetime import datetime
from typing import Optional, Tuple
from enum import Enum
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from config import Config

logger = logging.getLogger(__name__)

class ModelType(Enum):
    """模型类型"""
    FLASH_LITE = "gemini-2.0-flash-lite"
    FLASH = "gemini-2.0-flash"
    FLASH_EXP = "gemini-2.0-flash-exp"
    PRO = "gemini-1.5-pro"

class KeyPool:
    """Key池管理"""
    
    def __init__(self):
        # 双Key配置 - 都用flash-lite做快速响应
        self.keys = [
            {
                'name': 'KEY_1',
                'key': Config.GEMINI_KEY_PRIMARY,
                'models': [ModelType.FLASH_LITE, ModelType.FLASH, ModelType.FLASH_EXP, ModelType.PRO],
                'usage': {'daily': 0, 'hourly': 0},
                'last_used': None
            },
            {
                'name': 'KEY_2', 
                'key': Config.GEMINI_KEY_BACKUP,
                'models': [ModelType.FLASH_LITE],
                'usage': {'daily': 0, 'hourly': 0},
                'last_used': None
            }
        ]
        
        # 轮替索引
        self.round_robin_index = 0
        
        # 初始化模型
        self._init_models()
        
        logger.info(f"🔄 DualKeyRouter initialized with {len(self.keys)} keys")
    
    def _init_models(self):
        """初始化所有模型"""
        for key_config in self.keys:
            genai.configure(api_key=key_config['key'])
            
            # 为每个key配置模型
            key_config['model_instances'] = {}
            for model_type in key_config['models']:
                try:
                    if model_type == ModelType.FLASH_LITE:
                        model = genai.GenerativeModel(
                            model_name="gemini-2.0-flash-lite",
                            generation_config={
                                "temperature": 0.7,
                                "top_p": 0.8,
                                "top_k": 40,
                                "max_output_tokens": 8192,
                            },
                            safety_settings={
                                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                            }
                        )
                    elif model_type == ModelType.FLASH:
                        model = genai.GenerativeModel(
                            model_name="gemini-2.0-flash",
                            generation_config={
                                "temperature": 0.7,
                                "top_p": 0.8,
                                "top_k": 40,
                                "max_output_tokens": 8192,
                            }
                        )
                    elif model_type == ModelType.FLASH_EXP:
                        model = genai.GenerativeModel(
                            model_name="gemini-2.0-flash-exp",
                            generation_config={
                                "temperature": 0.7,
                                "top_p": 0.8,
                                "top_k": 40,
                                "max_output_tokens": 8192,
                            }
                        )
                    elif model_type == ModelType.PRO:
                        model = genai.GenerativeModel(
                            model_name="gemini-1.5-pro",
                            generation_config={
                                "temperature": 0.7,
                                "top_p": 0.8,
                                "top_k": 40,
                                "max_output_tokens": 8192,
                            }
                        )
                    
                    key_config['model_instances'][model_type] = model
                    logger.info(f"✅ {key_config['name']} initialized {model_type.value}")
                    
                except Exception as e:
                    logger.error(f"❌ Failed to init {model_type.value} for {key_config['name']}: {e}")
    
    def get_available_key(self, model_type: ModelType, is_owner: bool = False) -> Optional[dict]:
        """
        获取可用Key
        
        Args:
            model_type: 需要的模型类型
            is_owner: 是否为Owner
            
        Returns:
            Key配置或None
        """
        # Owner可以使用所有模型，其他人只能用flash-lite
        if not is_owner and model_type != ModelType.FLASH_LITE:
            model_type = ModelType.FLASH_LITE
        
        # 轮替选择Key
        for i in range(len(self.keys)):
            key_index = (self.round_robin_index + i) % len(self.keys)
            key_config = self.keys[key_index]
            
            # 检查模型是否支持
            if model_type in key_config['models']:
                # 检查使用量限制
                daily_limit = 1000 if model_type == ModelType.FLASH_LITE else 50
                if key_config['usage']['daily'] < daily_limit:
                    self.round_robin_index = (key_index + 1) % len(self.keys)
                    return key_config
        
        # 如果都满了，返回第一个可用的
        for key_config in self.keys:
            if model_type in key_config['models']:
                return key_config
        
        return None
    
    def generate_response(self, prompt: str, model_type: ModelType, is_owner: bool = False) -> Tuple[str, dict]:
        """
        生成响应
        
        Args:
            prompt: 输入提示
            model_type: 模型类型
            is_owner: 是否为Owner
            
        Returns:
            (响应文本, 使用的key信息)
        """
        key_config = self.get_available_key(model_type, is_owner)
        if not key_config:
            raise Exception("No available key for model generation")
        
        model = key_config['model_instances'].get(model_type)
        if not model:
            raise Exception(f"Model {model_type.value} not available for key {key_config['name']}")
        
        try:
            # 生成响应
            response = model.generate_content(prompt)
            response_text = response.text
            
            # 更新使用量
            key_config['usage']['daily'] += 1
            key_config['last_used'] = datetime.now()
            
            logger.info(f"✅ Generated response via {key_config['name']} ({model_type.value})")
            
            return response_text, {
                'key_name': key_config['name'],
                'model_type': model_type.value,
                'daily_usage': key_config['usage']['daily']
            }
            
        except Exception as e:
            logger.error(f"❌ Generation failed with {key_config['name']}: {e}")
            # 尝试下一个key
            return self._fallback_generate(prompt, model_type, is_owner)
    
    def _fallback_generate(self, prompt: str, model_type: ModelType, is_owner: bool = False) -> Tuple[str, dict]:
        """降级生成"""
        # 降级到flash-lite
        if model_type != ModelType.FLASH_LITE:
            return self.generate_response(prompt, ModelType.FLASH_LITE, is_owner)
        
        raise Exception("All keys failed")

class DualKeyRouter:
    """双Key路由器主类"""
    
    def __init__(self):
        self.key_pool = KeyPool()
    
    def route_and_generate(self, message: str, is_group: bool, is_owner: bool) -> Tuple[str, dict]:
        """
        路由并生成响应
        
        Args:
            message: 用户消息
            is_group: 是否群聊
            is_owner: 是否Owner
            
        Returns:
            (响应文本, 路由信息)
        """
        # 构建基础提示
        base_prompt = """你是小爱同学，一个智能、友好、像菌丝网络一样连接一切的AI助手。

请用自然、友好的语调回复用户。如果是群聊，保持简洁；如果是私聊，可以更详细。

用户消息: {message}

小爱:"""
        
        # 策略1: 所有人都用flash-lite快速响应
        if is_group or not is_owner:
            model_type = ModelType.FLASH_LITE
            prompt = base_prompt.format(message=message)
            
        # 策略2: Owner单聊用高级模型
        else:
            # 先用flash-lite快速迎接
            if len(message) < 50:  # 短消息用lite
                model_type = ModelType.FLASH_LITE
                prompt = base_prompt.format(message=message)
            else:  # 长消息或复杂任务用高级模型
                model_type = ModelType.FLASH_EXP  # 或PRO
                prompt = """你是小爱同学，一个强大的AI助手。

请详细分析用户的需求并提供专业的解决方案。你可以：
- 分析复杂问题
- 提供代码示例
- 设计系统架构
- 回答技术问题

用户消息: {message}

小爱:""".format(message=message)
        
        # 生成响应
        response_text, key_info = self.key_pool.generate_response(
            prompt, model_type, is_owner
        )
        
        # 记录路由信息
        route_info = {
            'is_group': is_group,
            'is_owner': is_owner,
            'model_used': key_info['model_type'],
            'key_used': key_info['key_name'],
            'daily_usage': key_info['daily_usage']
        }
        
        return response_text, route_info
