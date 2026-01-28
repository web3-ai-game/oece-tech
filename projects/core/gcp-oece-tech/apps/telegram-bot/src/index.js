import config from '../config/index.js';
import dualBotService from './services/dualBotService.js';
import memoryService from './services/memoryService.js';
import groupMemoryService from './services/groupMemoryService.js';
import logger from './utils/logger.js';

/**
 * BongBong + Avatar 雙 Bot 主入口
 */
class App {
  async start() {
    try {
      logger.info('🎭 Starting BongBong + Avatar Dual Bot System...');
      logger.info(`Environment: ${config.app.nodeEnv}`);

      // 檢查必要配置
      this.checkConfig();

      // 初始化雙 Bot
      logger.info('Initializing Dual Bot System...');
      await dualBotService.init();

      logger.info('✅ Dual Bot System started successfully!');
      logger.info('🤖 BongBong: @qitiandashengqianqian_bot');
      if (process.env.TELEGRAM_BOT_TOKEN_AVATAR) {
        logger.info('🤖 Avatar: @svs_notion_bot');
      }
      logger.info('📡 Listening for messages...');

      // 優雅退出處理
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  checkConfig() {
    const required = [
      { key: 'telegram.botToken', value: config.telegram.botToken },
      { key: 'apiKeys.gemini', value: config.apiKeys.gemini }
    ];

    for (const { key, value } of required) {
      if (!value) {
        logger.error(`Missing required config: ${key}`);
        throw new Error(`Missing required config: ${key}`);
      }
    }

    // Avatar token 是可選的
    if (process.env.TELEGRAM_BOT_TOKEN_AVATAR) {
      logger.info('✅ Avatar bot token found');
    } else {
      logger.warn('⚠️ Avatar bot token not found, running in single bot mode');
    }

    logger.info('✅ Configuration validated');
  }

  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      try {
        dualBotService.stop();
        await memoryService.close();
        await groupMemoryService.close();
        logger.info('Shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// 啟動應用
const app = new App();
app.start();
