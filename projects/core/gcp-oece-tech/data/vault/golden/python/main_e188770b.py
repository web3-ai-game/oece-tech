"""
消息路由器主程序
负责消息的路由和队列管理
"""
import asyncio
import logging
import os
import sys
import json
from redis import Redis
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class MessageRouter:
    """消息路由器"""
    
    def __init__(self):
        self.redis_client = Redis(
            host=os.getenv('REDIS_HOST', 'redis'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            decode_responses=True
        )
        self.input_queue = 'raw_messages'
        self.output_queue = 'message_queue'
        
        logger.info("消息路由器初始化完成")
    
    async def route_message(self, message: dict):
        """路由单条消息"""
        try:
            # 验证消息格式
            if not self._validate_message(message):
                logger.warning(f"消息格式无效: {message}")
                return
            
            # 添加路由信息
            message['routed_at'] = str(asyncio.get_event_loop().time())
            message['status'] = 'pending_analysis'
            
            # 推送到分析队列
            self.redis_client.rpush(
                self.output_queue,
                json.dumps(message)
            )
            
            logger.info(f"消息已路由: {message['platform']} - {message['id']}")
            
        except Exception as e:
            logger.error(f"路由失败: {str(e)}")
    
    def _validate_message(self, message: dict) -> bool:
        """验证消息格式"""
        required_fields = ['id', 'platform', 'content', 'timestamp']
        return all(field in message for field in required_fields)
    
    async def process_incoming(self):
        """处理incoming消息"""
        while True:
            try:
                # 从原始消息队列获取
                message_json = self.redis_client.lpop(self.input_queue)
                
                if message_json:
                    message = json.loads(message_json)
                    await self.route_message(message)
                else:
                    await asyncio.sleep(1)
                    
            except Exception as e:
                logger.error(f"处理incoming错误: {str(e)}")
                await asyncio.sleep(5)
    
    def get_queue_stats(self):
        """获取队列统计"""
        return {
            'raw_messages': self.redis_client.llen(self.input_queue),
            'pending_analysis': self.redis_client.llen(self.output_queue)
        }

async def main():
    """启动路由器"""
    router = MessageRouter()
    logger.info("开始处理消息路由...")
    
    # 定期输出统计
    async def print_stats():
        while True:
            stats = router.get_queue_stats()
            logger.info(f"队列统计: {stats}")
            await asyncio.sleep(60)
    
    # 并行运行
    await asyncio.gather(
        router.process_incoming(),
        print_stats()
    )

if __name__ == '__main__':
    asyncio.run(main())
