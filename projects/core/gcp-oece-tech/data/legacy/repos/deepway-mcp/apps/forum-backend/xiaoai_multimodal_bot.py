#!/usr/bin/env python3
"""
小爱同学多模态Telegram Bot
支持文本对话和图像生成
"""

import os
import logging
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dual_router_system import DualRouterSystem, MultimodalXiaoAi

# 配置日志
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# 环境变量
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN', 'YOUR_BOT_TOKEN')
OWNER_USERNAME = os.getenv('OWNER_USERNAME', 'SVSAI')

# 初始化双路由系统
router_system = DualRouterSystem()
xiaoai = MultimodalXiaoAi(router_system)


class XiaoAiBot:
    """小爱同学Bot"""
    
    def __init__(self):
        self.stats = {
            "total_messages": 0,
            "text_messages": 0,
            "image_requests": 0,
            "errors": 0
        }
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """启动命令"""
        user = update.effective_user
        welcome_msg = f"""
👋 你好 {user.first_name}！我是小爱同学！

🎯 我能做什么：
• 💬 智能对话
• 🎨 生成图像（说"画"、"生成图"等）
• 🔄 多模态理解

📝 使用方式：
1. 直接发消息跟我聊天
2. 说"画个猫咪"让我生成图像
3. @提到我让我参与群聊

🚀 技术架构：
• 双路由器 + 四工作组
• 29个API Keys智能调度
• 支持50+用户同时使用

试试跟我说话吧！
"""
        await update.message.reply_text(welcome_msg)
    
    async def status(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """状态命令"""
        status = router_system.get_status()
        
        msg = f"""
📊 系统状态

🔧 路由器状态:
"""
        for router_id, router_info in status["routers"].items():
            msg += f"\n{router_id}:"
            msg += f"\n  管理组: {', '.join(router_info['managed_groups'])}"
            msg += f"\n  使用量: {router_info['total_usage']}"
        
        msg += "\n\n📦 工作组状态:"
        for group_id, group_info in status["groups"].items():
            msg += f"\n{group_id}:"
            msg += f" {group_info['available']}/{group_info['size']} 可用"
            msg += f", 已用 {group_info['usage']}"
        
        msg += f"\n\n📈 使用统计:"
        msg += f"\n总消息: {self.stats['total_messages']}"
        msg += f"\n文本: {self.stats['text_messages']}"
        msg += f"\n图像: {self.stats['image_requests']}"
        msg += f"\n错误: {self.stats['errors']}"
        
        await update.message.reply_text(msg)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """处理消息"""
        message = update.message
        user_id = str(message.from_user.id)
        text = message.text
        
        # 检查是否在群组中
        if message.chat.type in ['group', 'supergroup']:
            # 群组中需要@或回复才响应
            bot_username = context.bot.username
            mentioned = f"@{bot_username}" in text
            is_reply = message.reply_to_message and message.reply_to_message.from_user.id == context.bot.id
            
            if not (mentioned or is_reply):
                return  # 不响应
            
            # 移除@mention
            text = text.replace(f"@{bot_username}", "").strip()
        
        self.stats["total_messages"] += 1
        
        # 显示"正在输入"
        await message.chat.send_action("typing")
        
        try:
            # 处理消息
            result = xiaoai.process_message(user_id, text)
            
            if "error" in result:
                await message.reply_text(f"❌ 抱歉，出错了: {result['error']}")
                self.stats["errors"] += 1
                return
            
            if result["type"] == "text":
                # 文本回复
                self.stats["text_messages"] += 1
                await message.reply_text(result["content"])
                
            elif result["type"] == "image":
                # 图像生成
                self.stats["image_requests"] += 1
                
                # 尝试发送图像
                # 注意：实际的图像数据需要根据API返回格式处理
                await message.reply_text(
                    f"🎨 图像生成完成！\n"
                    f"(路由: {result['router']}, 组: {result['group']})\n\n"
                    f"注：图像生成功能需要进一步集成API响应格式"
                )
                
                # TODO: 根据实际API返回的图像格式发送
                # if "image_url" in result["data"]:
                #     await message.reply_photo(result["data"]["image_url"])
                # elif "image_base64" in result["data"]:
                #     # 处理base64图像
                #     pass
        
        except Exception as e:
            logger.error(f"处理消息出错: {e}")
            self.stats["errors"] += 1
            await message.reply_text(f"❌ 处理消息时出错: {str(e)}")
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """帮助命令"""
        help_text = """
🤖 小爱同学使用指南

📝 基本对话：
直接发送消息即可聊天

🎨 图像生成：
• "画一个可爱的猫咪"
• "生成图：美丽的风景"
• "出图：赛博朋克城市"

💡 关键词：
画、生成图、出图、picture、image、draw

👥 群聊使用：
• @小爱同学 你好
• 回复小爱的消息继续对话

🎯 特性：
• 智能上下文（保留3轮对话）
• 自动检测图像请求
• 双路由器负载均衡
• 支持50+用户

命令：
/start - 开始使用
/status - 查看系统状态
/help - 显示帮助
"""
        await update.message.reply_text(help_text)


def main():
    """主函数"""
    print("🚀 启动小爱同学多模态Bot...")
    print("=" * 60)
    
    # 创建Application
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    
    # 创建Bot实例
    bot = XiaoAiBot()
    
    # 注册处理器
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("status", bot.status))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    # 启动Bot
    print("✅ Bot启动成功!")
    print("📊 双路由器四组架构已就绪")
    print("🎨 多模态功能已启用")
    print()
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
