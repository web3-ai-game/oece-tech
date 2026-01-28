"""
消息收集器主程序
从各个平台收集消息并推送到路由器
"""
import asyncio
import logging
import os
import sys
import json
from datetime import datetime
from redis import Redis
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class BaseCollector:
    """基础收集器"""
    
    def __init__(self, platform_name: str):
        self.platform_name = platform_name
        self.redis_client = Redis(
            host=os.getenv('REDIS_HOST', 'redis'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            decode_responses=True
        )
        self.queue_name = 'raw_messages'
        self.is_running = False
        
        logger.info(f"{platform_name} 收集器初始化")
    
    async def start(self):
        """启动收集器"""
        self.is_running = True
        logger.info(f"{self.platform_name} 收集器已启动")
        
        while self.is_running:
            try:
                messages = await self.collect_messages()
                
                if messages:
                    for msg in messages:
                        self.push_message(msg)
                    logger.info(f"{self.platform_name}: 收集了 {len(messages)} 条消息")
                
                # 轮询间隔
                await asyncio.sleep(30)
                
            except Exception as e:
                logger.error(f"{self.platform_name} 收集错误: {str(e)}")
                await asyncio.sleep(10)
    
    async def collect_messages(self):
        """收集消息 - 子类实现"""
        return []
    
    def push_message(self, message: dict):
        """推送消息到队列"""
        try:
            formatted_message = {
                'id': message.get('id', str(datetime.now().timestamp())),
                'platform': self.platform_name,
                'sender': message.get('sender', 'unknown'),
                'content': message.get('content', ''),
                'timestamp': message.get('timestamp', datetime.now().isoformat()),
                'metadata': message.get('metadata', {}),
                'raw': message
            }
            
            self.redis_client.rpush(
                self.queue_name,
                json.dumps(formatted_message)
            )
            
        except Exception as e:
            logger.error(f"推送消息失败: {str(e)}")


class NotionCollector(BaseCollector):
    """Notion收集器"""
    
    def __init__(self):
        super().__init__('Notion')
        self.api_key = os.getenv('NOTION_API_KEY')
        # TODO: 初始化Notion客户端
    
    async def collect_messages(self):
        """从Notion收集消息"""
        # TODO: 实现Notion API调用
        logger.debug("Notion收集器: 暂未实现")
        return []


class SlackCollector(BaseCollector):
    """Slack收集器"""
    
    def __init__(self):
        super().__init__('Slack')
        self.bot_token = os.getenv('SLACK_BOT_TOKEN')
        # TODO: 初始化Slack客户端
    
    async def collect_messages(self):
        """从Slack收集消息"""
        # TODO: 实现Slack API调用
        logger.debug("Slack收集器: 暂未实现")
        return []


class TelegramCollector(BaseCollector):
    """Telegram收集器"""
    
    def __init__(self):
        super().__init__('Telegram')
        # TODO: 初始化Telegram客户端
    
    async def collect_messages(self):
        """从Telegram收集消息"""
        # 注意: Telegram通过Bot本身收集，这里可以是频道/群组监控
        logger.debug("Telegram收集器: 暂未实现")
        return []


async def main():
    """启动所有收集器"""
    logger.info("初始化消息收集器...")
    
    # 创建收集器实例
    collectors = []
    
    # 根据环境变量启用不同的收集器
    if os.getenv('NOTION_API_KEY'):
        collectors.append(NotionCollector())
        logger.info("✓ Notion收集器已启用")
    
    if os.getenv('SLACK_BOT_TOKEN'):
        collectors.append(SlackCollector())
        logger.info("✓ Slack收集器已启用")
    
    # 可以继续添加其他平台收集器
    
    if not collectors:
        logger.warning("没有启用任何收集器，请配置相应的API密钥")
        # 创建一个演示收集器
        demo_collector = BaseCollector('Demo')
        collectors.append(demo_collector)
        logger.info("✓ Demo收集器已启用（仅用于测试）")
    
    # 并行运行所有收集器
    logger.info(f"启动 {len(collectors)} 个收集器...")
    await asyncio.gather(*[collector.start() for collector in collectors])

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("收集器已停止")
