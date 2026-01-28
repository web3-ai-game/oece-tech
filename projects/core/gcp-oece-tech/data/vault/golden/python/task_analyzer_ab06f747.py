#!/usr/bin/env python3
"""
任务识别模块 - 使用 Flash-Lite 快速分析用户意图
"""

import logging
from dataclasses import dataclass
from typing import Optional, List
import google.generativeai as genai

from config import Config, TaskType, ModelType

logger = logging.getLogger(__name__)


@dataclass
class TaskIntent:
    """任务意图"""
    task_type: TaskType
    confidence: float  # 0.0 - 1.0
    keywords: List[str]
    urgency: str  # 'low', 'medium', 'high'
    reasoning: str
    

class TaskAnalyzer:
    """任务识别器 - 核心大脑"""
    
    def __init__(self):
        self.model_name = ModelType.FLASH_LITE.value
        self.api_key = Config.GEMINI_KEY_PRIMARY
        
        # 配置 Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(self.model_name)
        
        logger.info(f"🧠 TaskAnalyzer initialized with {self.model_name}")
    
    async def analyze(self, message: str, is_group: bool = False) -> TaskIntent:
        """
        分析用户消息，识别任务类型
        
        Args:
            message: 用户消息
            is_group: 是否来自群聊
            
        Returns:
            TaskIntent: 任务意图
        """
        
        # 群聊消息直接识别
        if is_group:
            return TaskIntent(
                task_type=TaskType.GROUP,
                confidence=1.0,
                keywords=[],
                urgency='low',
                reasoning='Group message'
            )
        
        # 使用 Gemini 分析
        try:
            prompt = f"""分析以下用户消息，判断其类型和意图。

用户消息: "{message}"

请按以下格式返回JSON（不要包含其他文字）:
{{
    "type": "chat|simple|complex",
    "confidence": 0.0-1.0,
    "keywords": ["关键词1", "关键词2"],
    "urgency": "low|medium|high",
    "reasoning": "判断理由"
}}

分类标准:
- chat: 闲聊、问候、简单问答
- simple: 普通任务，如查询、简单操作
- complex: 复杂任务，包含"发布"、"改造"、"重构"、"设计"、"架构"等词

直接返回JSON，不要其他内容:"""

            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # 清理可能的 markdown 代码块标记
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
            
            # 解析 JSON
            import json
            result = json.loads(result_text)
            
            # 映射类型
            type_map = {
                'chat': TaskType.CHAT,
                'simple': TaskType.TASK_SIMPLE,
                'complex': TaskType.TASK_COMPLEX
            }
            
            task_type = type_map.get(result['type'], TaskType.CHAT)
            
            intent = TaskIntent(
                task_type=task_type,
                confidence=result['confidence'],
                keywords=result['keywords'],
                urgency=result['urgency'],
                reasoning=result['reasoning']
            )
            
            logger.info(f"✅ Analyzed: {message[:30]}... -> {task_type.value} ({intent.confidence:.2f})")
            return intent
            
        except Exception as e:
            logger.error(f"❌ Analysis failed: {e}")
            # 降级到简单规则
            return self._simple_classify(message)
    
    def _simple_classify(self, message: str) -> TaskIntent:
        """简单规则分类（降级方案）"""
        message_lower = message.lower()
        
        # 复杂任务关键词
        complex_keywords = ['发布', '改造', '重构', '设计', '架构', '实现', '开发', 'deploy', 'refactor', 'design']
        
        # 简单任务关键词
        simple_keywords = ['查询', '搜索', '看看', '帮我', 'search', 'find', 'show']
        
        if any(kw in message_lower for kw in complex_keywords):
            task_type = TaskType.TASK_COMPLEX
            confidence = 0.7
        elif any(kw in message_lower for kw in simple_keywords):
            task_type = TaskType.TASK_SIMPLE
            confidence = 0.6
        else:
            task_type = TaskType.CHAT
            confidence = 0.5
        
        return TaskIntent(
            task_type=task_type,
            confidence=confidence,
            keywords=[],
            urgency='medium',
            reasoning='Simple rule-based classification'
        )
