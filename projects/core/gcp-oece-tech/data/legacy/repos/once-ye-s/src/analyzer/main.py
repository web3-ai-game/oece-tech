"""
AI分析器主程序
使用Gemini 2.5 Flash进行消息分析
"""
import asyncio
import logging
import os
import sys
from datetime import datetime, timedelta
import json
import google.generativeai as genai
from redis import Redis
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class GeminiAnalyzer:
    """Gemini AI分析器"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
        self.max_calls_per_day = int(os.getenv('GEMINI_MAX_CALLS_PER_DAY', 1000))
        self.polling_interval = int(os.getenv('POLLING_INTERVAL', 30))
        
        # 配置Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(self.model_name)
        
        # Redis连接
        self.redis_client = Redis(
            host=os.getenv('REDIS_HOST', 'redis'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            decode_responses=True
        )
        
        # 速率限制
        self.calls_today = 0
        self.last_reset = datetime.now()
        
        logger.info(f"Gemini分析器初始化完成 - 模型: {self.model_name}")
    
    def check_rate_limit(self):
        """检查速率限制"""
        if datetime.now() - self.last_reset > timedelta(days=1):
            self.calls_today = 0
            self.last_reset = datetime.now()
            logger.info("API调用计数器已重置")
        
        if self.calls_today >= self.max_calls_per_day:
            logger.warning(f"已达到每日API调用限制: {self.max_calls_per_day}")
            return False
        return True
    
    async def analyze_message(self, message: dict) -> dict:
        """分析消息"""
        if not self.check_rate_limit():
            return {
                'success': False,
                'error': 'Rate limit exceeded'
            }
        
        try:
            prompt = f"""
            请分析以下消息，提供详细的洞察：
            
            来源平台: {message.get('platform', 'unknown')}
            发送者: {message.get('sender', 'unknown')}
            时间: {message.get('timestamp', 'unknown')}
            内容: {message.get('content', '')}
            
            请以JSON格式返回分析结果，包含：
            1. category: 消息类别
            2. importance: 重要性评分（1-10）
            3. sentiment: 情感分析
            4. summary: 消息摘要
            5. tags: 相关标签
            6. suggested_action: 建议的行动
            7. response_suggestion: 回复建议
            """
            
            response = self.model.generate_content(prompt)
            self.calls_today += 1
            
            logger.info(f"分析完成 - 调用: {self.calls_today}/{self.max_calls_per_day}")
            
            result = self._parse_response(response.text)
            result['success'] = True
            result['message_id'] = message.get('id')
            
            return result
            
        except Exception as e:
            logger.error(f"分析错误: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _parse_response(self, response_text: str) -> dict:
        """解析AI响应"""
        try:
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                json_text = response_text[json_start:json_end].strip()
            else:
                json_text = response_text.strip()
            
            return json.loads(json_text)
        except:
            return {
                'raw_response': response_text,
                'category': 'unknown',
                'importance': 5,
                'sentiment': 'neutral',
                'summary': response_text[:100] + '...',
                'tags': [],
                'suggested_action': 'review',
                'response_suggestion': None
            }
    
    async def process_queue(self):
        """处理消息队列"""
        while True:
            try:
                # 从队列获取消息
                message_json = self.redis_client.lpop('message_queue')
                
                if message_json:
                    message = json.loads(message_json)
                    logger.info(f"处理消息: {message.get('id')}")
                    
                    # 分析消息
                    result = await self.analyze_message(message)
                    
                    # 保存结果
                    result_key = f"analysis:{message.get('id')}"
                    self.redis_client.setex(
                        result_key,
                        86400,  # 24小时过期
                        json.dumps(result)
                    )
                    
                    logger.info(f"分析结果已保存: {result_key}")
                
                else:
                    # 队列为空，等待
                    await asyncio.sleep(self.polling_interval)
                    
            except Exception as e:
                logger.error(f"处理队列错误: {str(e)}")
                await asyncio.sleep(5)

async def main():
    """启动分析器"""
    if not os.getenv('GEMINI_API_KEY'):
        logger.error("请设置GEMINI_API_KEY环境变量！")
        return
    
    analyzer = GeminiAnalyzer()
    logger.info("开始处理消息队列...")
    
    await analyzer.process_queue()

if __name__ == '__main__':
    asyncio.run(main())
