import TelegramBot from 'node-telegram-bot-api';
import config from '../../config/index.js';
import aiService from './aiService.js';
import databaseService from './databaseService.js';
import logger from '../utils/logger.js';

/**
 * Telegram Bot服务
 * 处理与家人的互动、写作记录、查询和分析
 */
class BotService {
  constructor() {
    this.bot = null;
    this.conversationHistory = new Map(); // 存储每个用户的对话历史
  }

  /**
   * 初始化Bot
   */
  async init() {
    try {
      this.bot = new TelegramBot(config.telegram.botToken, { polling: true });
      
      // 注册命令处理器
      this.registerCommands();
      
      // 注册消息处理器
      this.registerMessageHandlers();

      logger.info('Telegram Bot initialized successfully');
    } catch (error) {
      logger.error('Error initializing bot:', error);
      throw error;
    }
  }

  /**
   * 注册命令
   */
  registerCommands() {
    // 开始命令
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));

    // 帮助命令
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));

    // 保存写作命令
    this.bot.onText(/\/save (.+)/, (msg, match) => this.handleSave(msg, match));

    // 搜索命令
    this.bot.onText(/\/search (.+)/, (msg, match) => this.handleSearch(msg, match));

    // 最近的写作
    this.bot.onText(/\/recent/, (msg) => this.handleRecent(msg));

    // 统计命令
    this.bot.onText(/\/stats/, (msg) => this.handleStats(msg));

    // 清除对话历史
    this.bot.onText(/\/clear/, (msg) => this.handleClear(msg));

    // 语义搜索命令
    this.bot.onText(/\/find (.+)/, (msg, match) => this.handleSemanticSearch(msg, match));
  }

  /**
   * 注册消息处理器
   */
  registerMessageHandlers() {
    // 处理所有文本消息
    this.bot.on('message', async (msg) => {
      // 語音消息：優先處理
      if (msg.voice) {
        const { handleVoiceMessage } = await import('../handlers/voiceHandler.js');
        await handleVoiceMessage(this.bot, msg);
        return;
      }
      // 忽略命令消息
      if (msg.text && msg.text.startsWith('/')) {
        return;
      }

      await this.handleMessage(msg);
    });

    // 错误处理
    this.bot.on('polling_error', (error) => {
      logger.error('Polling error:', error);
    });
  }

  /**
   * 处理开始命令
   */
  async handleStart(msg) {
    const chatId = msg.chat.id;
    const welcomeMessage = `
👋 欢迎使用智能写作助手！

我是专为您的母亲设计的AI助手，可以帮助：

📝 **记录写作** - 保存日记、随笔、灵感
🔍 **智能搜索** - 快速找到历史内容
💡 **深度分析** - 理解言外之意、潜台词
😄 **轻松娱乐** - 幽默吐槽模式

**使用说明：**
• 直接发送文字与我对话
• 使用 /save 保存重要内容
• 使用 /search 关键词搜索
• 使用 /find 语义智能搜索
• 使用 /recent 查看最近记录
• 使用 /stats 查看统计信息
• 使用 /help 查看完整帮助

开始聊天吧！✨
    `.trim();

    await this.bot.sendMessage(chatId, welcomeMessage);
  }

  /**
   * 处理帮助命令
   */
  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const helpMessage = `
📚 **命令列表**

**基础对话：**
• 直接发送消息 - AI会智能选择最合适的模型回复

**写作管理：**
• \`/save 标题 | 内容\` - 保存写作内容
• \`/recent\` - 查看最近10条记录
• \`/stats\` - 查看写作统计

**搜索功能：**
• \`/search 关键词\` - 关键词搜索
• \`/find 描述\` - 语义智能搜索（找相似内容）

**其他：**
• \`/clear\` - 清除对话历史
• \`/help\` - 显示此帮助信息

**智能模型说明：**
• 🚀 **简单快速** - Gemini 2.5 Flash（默认）
• 🧠 **深度分析** - Gemini 3 Pro（复杂问题）
• 😎 **娱乐喷子** - Grok Beta（轻松吐槽）

系统会根据你的问题自动选择最合适的模型！
    `.trim();

    await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  }

  /**
   * 处理普通消息
   */
  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const username = msg.from.username || null;
    const firstName = msg.from.first_name || '用户';
    const lastName = msg.from.last_name || null;
    const userMessage = msg.text;

    if (!userMessage) return;

    // 检查是否应该回复此消息
    if (!this.shouldReply(msg)) {
      // 仍然记录但不回复
      if (config.bot.enableConversationTracking) {
        await supabaseService.logConversation({
          userId: parseInt(userId),
          username,
          firstName,
          lastName,
          chatId,
          message: userMessage,
          response: null,
          modelUsed: null,
          tokensUsed: 0,
        });
      }
      return;
    }

    try {
      // 发送"正在输入"状态
      await this.bot.sendChatAction(chatId, 'typing');

      // 获取用户记忆（如果启用）
      let userContext = '';
      if (config.bot.enableMemory) {
        const stats = await supabaseService.getUserStats(parseInt(userId));
        if (stats) {
          userContext = `\n[用户信息: ${stats.first_name}, 已对话${stats.total_messages}次]`;
        }
      }

      // 获取对话历史
      const history = this.getConversationHistory(userId);

      // 调用AI服务生成响应
      const result = await aiService.generateResponse(userMessage + userContext, history);

      // 更新对话历史
      this.addToHistory(userId, { role: 'user', content: userMessage });
      this.addToHistory(userId, { role: 'assistant', content: result.response });

      // 构建响应消息
      const displayName = firstName || username || 'User';
      const modelIcon = this.getModelIcon(result.provider, result.modelUsed);
      const responseMessage = `${modelIcon} ${result.response}\n\n👤 ${displayName}\n_模型: ${result.modelUsed} | 原因: ${result.reason}_`;

      // 发送响应
      await this.bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });

    } catch (error) {
      logger.error('Error handling message:', error);
      await this.bot.sendMessage(chatId, '❌ 抱歉，处理您的消息时出现错误。请稍后再试。');
    }
  }

  /**
   * 判断是否应该回复消息
   */
  shouldReply(msg) {
    const mode = config.bot.autoReplyMode;

    // 私聊总是回复
    if (msg.chat.type === 'private') {
      return true;
    }

    // all 模式：回复所有消息
    if (mode === 'all') {
      return true;
    }

    // mention 模式：仅回复 @提及
    if (mode === 'mention') {
      return msg.text && msg.text.includes(`@${this.bot.options.username}`);
    }

    // keyword 模式：检查关键词
    if (mode === 'keyword') {
      const text = msg.text.toLowerCase();
      return config.bot.triggerKeywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
    }

    return false;
  }

  /**
   * 估算 token 数量（粗略）
   */
  estimateTokens(text) {
    // 中文约 1.5 字符/token，英文约 4 字符/token
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }

  /**
   * 处理保存命令
   */
  async handleSave(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name || msg.from.username || '用户';
    const input = match[1];

    try {
      // 解析标题和内容 (格式: /save 标题 | 内容)
      let title, content;
      if (input.includes('|')) {
        [title, content] = input.split('|').map(s => s.trim());
      } else {
        title = '未命名';
        content = input;
      }

      // 保存到数据库
      const writing = await databaseService.saveWriting({
        userId,
        userName,
        title,
        content,
        tags: [],
        category: '日记',
      });

      // 生成向量嵌入并保存
      const embedding = await aiService.generateEmbedding(content);
      await databaseService.saveEmbedding(
        writing._id.toString(),
        userId,
        embedding,
        content
      );

      await this.bot.sendMessage(chatId, `✅ 已保存！\n\n标题: ${title}\n时间: ${writing.createdAt.toLocaleString('zh-CN')}`);

    } catch (error) {
      logger.error('Error saving writing:', error);
      await this.bot.sendMessage(chatId, '❌ 保存失败，请稍后再试。');
    }
  }

  /**
   * 处理关键词搜索
   */
  async handleSearch(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const keyword = match[1];

    try {
      const results = await databaseService.keywordSearch(userId, keyword, 5);

      if (results.length === 0) {
        await this.bot.sendMessage(chatId, `😕 没有找到包含"${keyword}"的内容。`);
        return;
      }

      let message = `🔍 找到 ${results.length} 条相关记录：\n\n`;
      results.forEach((item, index) => {
        const date = item.createdAt.toLocaleDateString('zh-CN');
        const preview = item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '');
        message += `${index + 1}. **${item.title}** (${date})\n${preview}\n\n`;
      });

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      logger.error('Error searching:', error);
      await this.bot.sendMessage(chatId, '❌ 搜索失败，请稍后再试。');
    }
  }

  /**
   * 处理语义搜索
   */
  async handleSemanticSearch(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const query = match[1];

    try {
      await this.bot.sendChatAction(chatId, 'typing');

      // 生成查询向量
      const queryEmbedding = await aiService.generateEmbedding(query);

      // 向量搜索
      const results = await databaseService.vectorSearch(queryEmbedding, userId, 5);

      if (results.length === 0) {
        await this.bot.sendMessage(chatId, `😕 没有找到与"${query}"相似的内容。`);
        return;
      }

      let message = `🎯 智能搜索结果（相似度排序）：\n\n`;
      results.forEach((item, index) => {
        const date = item.createdAt.toLocaleDateString('zh-CN');
        const similarity = (item.similarity * 100).toFixed(1);
        const preview = item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '');
        message += `${index + 1}. **${item.title}** (${date}) - ${similarity}%相似\n${preview}\n\n`;
      });

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      logger.error('Error in semantic search:', error);
      await this.bot.sendMessage(chatId, '❌ 智能搜索失败，请稍后再试。');
    }
  }

  /**
   * 处理最近记录命令
   */
  async handleRecent(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    try {
      const results = await databaseService.getRecentWritings(userId, 10);

      if (results.length === 0) {
        await this.bot.sendMessage(chatId, '📭 还没有任何记录。使用 /save 开始记录吧！');
        return;
      }

      let message = `📚 最近的 ${results.length} 条记录：\n\n`;
      results.forEach((item, index) => {
        const date = item.createdAt.toLocaleDateString('zh-CN');
        const preview = item.content.substring(0, 80) + (item.content.length > 80 ? '...' : '');
        message += `${index + 1}. **${item.title}** (${date})\n${preview}\n\n`;
      });

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      logger.error('Error getting recent writings:', error);
      await this.bot.sendMessage(chatId, '❌ 获取记录失败，请稍后再试。');
    }
  }

  /**
   * 处理统计命令
   */
  async handleStats(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    try {
      const stats = await databaseService.getWritingStats(userId);

      let message = `📊 **写作统计**\n\n`;
      message += `总记录数: ${stats.totalCount}\n`;
      
      if (stats.lastWriting) {
        const lastDate = stats.lastWriting.createdAt.toLocaleString('zh-CN');
        message += `最后记录: ${lastDate}\n`;
      }

      if (stats.categoriesDistribution.length > 0) {
        message += `\n**分类统计：**\n`;
        stats.categoriesDistribution.forEach(cat => {
          message += `• ${cat._id}: ${cat.count} 条\n`;
        });
      }

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      logger.error('Error getting stats:', error);
      await this.bot.sendMessage(chatId, '❌ 获取统计失败，请稍后再试。');
    }
  }

  /**
   * 处理清除历史命令
   */
  async handleClear(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    this.conversationHistory.delete(userId);
    await this.bot.sendMessage(chatId, '🗑️ 对话历史已清除！');
  }

  /**
   * 获取对话历史
   */
  getConversationHistory(userId) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    return this.conversationHistory.get(userId);
  }

  /**
   * 添加到对话历史
   */
  addToHistory(userId, message) {
    const history = this.getConversationHistory(userId);
    history.push(message);

    // 保持历史记录在合理范围内（最多20条）
    if (history.length > 20) {
      history.shift();
    }
  }

  /**
   * 获取模型图标
   */
  getModelIcon(provider, model) {
    if (provider === 'grok') return '😎';
    if (model.includes('3-pro')) return '🧠';
    return '🚀';
  }

  /**
   * 停止Bot
   */
  stop() {
    if (this.bot) {
      this.bot.stopPolling();
      logger.info('Telegram Bot stopped');
    }
  }
}

export default new BotService();
