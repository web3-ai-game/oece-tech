/**
 * BongBong Telegram Bot 服務 v2.0
 * 
 * 功能:
 * - 互動菜單系統
 * - 智能對話
 * - 記憶管理
 * - 多模態生成
 * - 每日任務
 */

import TelegramBot from 'node-telegram-bot-api';
import config from '../../config/index.js';
import { BONGBONG_PERSONA } from '../../config/bongbong.js';
import bongbongService from './bongbongService.js';
import memoryService from './memoryService.js';
import menuService, { MAIN_MENU, QUICK_ACTIONS } from './menuService.js';
import newsService from './newsService.js';
import imageService from './imageService.js';
import { handleVoiceMessage } from '../handlers/voiceHandlerV2.js';
import { detectKeyword, isDrawRequest, isNewsRequest, extractDrawPrompt } from '../utils/keywords.js';
import logger from '../utils/logger.js';

class BotServiceV2 {
  constructor() {
    this.bot = null;
    this.conversationHistory = new Map();
    this.userStates = new Map(); // 用戶狀態機
    this.videoQuota = new Map(); // 視頻配額 userId -> { date, count }
  }

  /**
   * 初始化 Bot
   */
  async init() {
    try {
      const token = config.telegram.botToken;
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN not configured');
      }

      this.bot = new TelegramBot(token, { polling: true });
      
      // 初始化 BongBong 服務
      await bongbongService.init();
      
      // 初始化新聞和圖片服務
      await newsService.init();
      await imageService.init();
      
      // 註冊處理器
      this.registerCommands();
      this.registerCallbackHandlers();
      this.registerMessageHandlers();

      logger.info('🎭 BongBong Bot initialized successfully');
      return true;
    } catch (error) {
      logger.error('Bot init error:', error);
      throw error;
    }
  }

  /**
   * 註冊命令
   */
  registerCommands() {
    // /start - 顯示主菜單
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    
    // /menu - 顯示主菜單
    this.bot.onText(/\/menu/, (msg) => this.showMainMenu(msg.chat.id));
    
    // /help - 幫助
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
    
    // /save - 保存內容
    this.bot.onText(/\/save(?:\s+(.+))?/, (msg, match) => this.handleSave(msg, match));
    
    // /notes - 查看便簽
    this.bot.onText(/\/notes/, (msg) => this.handleNotes(msg));
    
    // /memory - 記憶管理
    this.bot.onText(/\/memory/, (msg) => this.handleMemory(msg));
    
    // /stats - 統計
    this.bot.onText(/\/stats/, (msg) => this.handleStats(msg));
    
    // /task - 今日任務
    this.bot.onText(/\/task/, (msg) => this.handleDailyTask(msg));
    
    // /news - 每日新聞
    this.bot.onText(/\/news/, (msg) => this.handleNews(msg));
    
    // /draw - 畫畫
    this.bot.onText(/\/draw(?:\s+(.+))?/, (msg, match) => this.handleDraw(msg, match));
  }

  /**
   * 註冊回調處理器 (菜單按鈕)
   */
  registerCallbackHandlers() {
    this.bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;
      const data = query.data;
      const userId = query.from.id.toString();

      try {
        // 回應回調
        await this.bot.answerCallbackQuery(query.id);

        // 菜單導航
        if (data.startsWith('menu_')) {
          await this.handleMenuNavigation(chatId, messageId, data);
        }
        // 聊天模式
        else if (data.startsWith('chat_')) {
          await this.handleChatMode(chatId, userId, data);
        }
        // 便簽操作
        else if (data.startsWith('notes_')) {
          await this.handleNotesAction(chatId, userId, data);
        }
        // 創作工具
        else if (data.startsWith('creative_')) {
          await this.handleCreativeAction(chatId, userId, data);
        }
        // 圖片生成
        else if (data.startsWith('image_')) {
          await this.handleImageAction(chatId, userId, data);
        }
        // 視頻生成
        else if (data.startsWith('video_')) {
          await this.handleVideoAction(chatId, userId, data);
        }
        // 腦力訓練
        else if (data.startsWith('brain_')) {
          await this.handleBrainAction(chatId, userId, data);
        }
        // 養生專區
        else if (data.startsWith('health_')) {
          await this.handleHealthAction(chatId, userId, data);
        }
        // 遊戲
        else if (data.startsWith('game_')) {
          await this.handleGameAction(chatId, userId, data);
        }
        // 設置
        else if (data.startsWith('settings_')) {
          await this.handleSettingsAction(chatId, userId, data);
        }
        // 記憶管理
        else if (data.startsWith('memory_')) {
          await this.handleMemoryAction(chatId, userId, data);
        }
        // 快捷操作
        else if (data.startsWith('quick_')) {
          await this.handleQuickAction(chatId, userId, messageId, data);
        }

      } catch (error) {
        logger.error('Callback error:', error);
        await this.bot.sendMessage(chatId, '❌ 操作失敗，請重試');
      }
    });
  }

  /**
   * 註冊消息處理器
   */
  registerMessageHandlers() {
    this.bot.on('message', async (msg) => {
      // 跳過命令
      if (msg.text?.startsWith('/')) return;
      
      // 語音消息
      if (msg.voice) {
        await handleVoiceMessage(this.bot, msg);
        return;
      }
      
      // 圖片消息
      if (msg.photo) {
        await this.handlePhoto(msg);
        return;
      }
      
      // 文本消息
      if (msg.text) {
        await this.handleMessage(msg);
      }
    });

    // 錯誤處理
    this.bot.on('polling_error', (error) => {
      logger.error('Polling error:', error.message);
    });
  }

  /**
   * 處理 /start
   */
  async handleStart(msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || '朋友';

    const welcomeText = `🎭 *歡迎，${userName}！*

我是 *BongBong*，你的全能 AI 助手。

${this.getRandomGreeting()}

點擊下方按鈕開始探索吧！`;

    await this.bot.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: MAIN_MENU.keyboard
      }
    });
  }

  /**
   * 顯示主菜單
   */
  async showMainMenu(chatId) {
    await menuService.sendMenu(this.bot, chatId, 'main');
  }

  /**
   * 處理菜單導航
   */
  async handleMenuNavigation(chatId, messageId, data) {
    const menuName = data.replace('menu_', '');
    await menuService.updateMenu(this.bot, chatId, messageId, menuName);
  }

  /**
   * 處理普通消息
   */
  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name || '用戶';
    const text = msg.text;

    try {
      // 檢測關鍵詞 (支持簡繁體)
      const keyword = detectKeyword(text);
      if (keyword) {
        await this.handleKeywordAction(chatId, userId, keyword, text);
        return;
      }

      // 檢測新聞請求
      if (isNewsRequest(text)) {
        await this.handleNews(msg);
        return;
      }

      // 檢測畫畫請求
      if (isDrawRequest(text)) {
        const prompt = extractDrawPrompt(text);
        await this.handleDrawRequest(chatId, userId, prompt);
        return;
      }

      // 發送輸入狀態
      await this.bot.sendChatAction(chatId, 'typing');

      // 獲取對話歷史
      const history = this.getHistory(userId);

      // 生成回覆
      const result = await bongbongService.generateResponse(text, {
        userId,
        chatId,
        userName,
        history
      });

      // 更新歷史
      this.addToHistory(userId, { role: 'user', content: text });
      this.addToHistory(userId, { role: 'assistant', content: result.response });

      // 構建回覆消息
      const responseText = `${result.icon} ${result.response}

${result.dashboard}`;

      // 發送回覆 (帶快捷按鈕)
      await this.bot.sendMessage(chatId, responseText, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💾 保存', callback_data: 'quick_save' },
              { text: '🔄 重新生成', callback_data: 'quick_regenerate' }
            ],
            [
              { text: '📋 菜單', callback_data: 'menu_main' }
            ]
          ]
        }
      });

    } catch (error) {
      logger.error('Message handling error:', error);
      await this.bot.sendMessage(chatId, 
        `❌ 抱歉，處理消息時出現錯誤。\n\n錯誤信息: ${error.message}\n\n請稍後再試或聯繫管理員。`
      );
    }
  }

  /**
   * 處理聊天模式選擇
   */
  async handleChatMode(chatId, userId, data) {
    const mode = data.replace('chat_', '');
    
    const modeMessages = {
      fast: '⚡ 已切換到快速問答模式。直接發消息給我吧！',
      deep: '🧠 已切換到深度分析模式。我會更仔細地思考你的問題。',
      humor: '😎 已切換到幽默模式。準備好接受我的冷笑話了嗎？',
      emotional: '💝 已切換到情感支持模式。有什麼想說的都可以告訴我。',
      fortune: '🔮 已切換到玄學模式。讓我看看你的運勢...',
      knowledge: '📚 已切換到知識問答模式。問我任何問題！'
    };

    // 設置用戶狀態
    this.userStates.set(userId, { mode, timestamp: Date.now() });

    await this.bot.sendMessage(chatId, modeMessages[mode] || '已切換模式');
  }

  /**
   * 處理腦力訓練
   */
  async handleBrainAction(chatId, userId, data) {
    const action = data.replace('brain_', '');

    switch (action) {
      case 'teaser':
        await this.sendBrainTeaser(chatId, userId);
        break;
      case 'picture':
        await this.sendPictureGame(chatId);
        break;
      case 'daily':
        await this.showDailyTasks(chatId, userId);
        break;
      default:
        await menuService.sendMenu(this.bot, chatId, 'brain');
    }
  }

  /**
   * 發送腦筋急轉彎
   */
  async sendBrainTeaser(chatId, userId) {
    const teasers = BONGBONG_PERSONA.dailyTaskTemplates.brainTeaser;
    const teaser = teasers[Math.floor(Math.random() * teasers.length)];
    
    await this.bot.sendMessage(chatId, teaser);
    
    // 記錄任務
    await memoryService.logDailyTask(userId, 'brainTeaser');
  }

  /**
   * 處理養生專區
   */
  async handleHealthAction(chatId, userId, data) {
    const action = data.replace('health_', '');

    switch (action) {
      case 'tip':
        const tips = BONGBONG_PERSONA.dailyTaskTemplates.healthTip;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        await this.bot.sendMessage(chatId, tip);
        break;
      case 'symptom':
        await this.bot.sendMessage(chatId, '請描述你的症狀，我來幫你分析：');
        this.userStates.set(userId, { mode: 'health_symptom', timestamp: Date.now() });
        break;
      default:
        await menuService.sendMenu(this.bot, chatId, 'health');
    }
  }

  /**
   * 處理便簽操作
   */
  async handleNotesAction(chatId, userId, data) {
    const action = data.replace('notes_', '');

    switch (action) {
      case 'new':
        await this.bot.sendMessage(chatId, '📝 請輸入便簽內容（格式：標題 | 內容）：');
        this.userStates.set(userId, { mode: 'notes_new', timestamp: Date.now() });
        break;
      case 'list':
        const notes = await memoryService.getAllNotes(userId, 10);
        if (notes.length === 0) {
          await this.bot.sendMessage(chatId, '📭 還沒有便簽，點擊「新建便簽」開始記錄吧！');
        } else {
          let text = '📋 *你的便簽*\n\n';
          notes.forEach((note, i) => {
            const date = note.createdAt.toLocaleDateString('zh-CN');
            text += `${i + 1}. *${note.title}* (${date})\n${note.content.substring(0, 50)}...\n\n`;
          });
          await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        }
        break;
      case 'search':
        await this.bot.sendMessage(chatId, '🔍 請輸入搜索關鍵詞：');
        this.userStates.set(userId, { mode: 'notes_search', timestamp: Date.now() });
        break;
      default:
        await menuService.sendMenu(this.bot, chatId, 'notes');
    }
  }

  /**
   * 處理記憶操作
   */
  async handleMemoryAction(chatId, userId, data) {
    const action = data.replace('memory_', '');

    switch (action) {
      case 'checkpoint':
        // 獲取最近對話並創建存檔
        const history = this.getHistory(userId);
        if (history.length > 0) {
          const content = history.slice(-5).map(h => h.content).join('\n');
          const result = await bongbongService.createMemoryCheckpoint(userId, content);
          if (result.success) {
            await this.bot.sendMessage(chatId, `💾 記憶存檔點已創建！\n\n摘要: ${result.summary}`);
          } else {
            await this.bot.sendMessage(chatId, '❌ 創建存檔失敗');
          }
        } else {
          await this.bot.sendMessage(chatId, '📭 沒有對話記錄可以存檔');
        }
        break;
      case 'list':
        const memories = await memoryService.getRecentMemories(userId, 10);
        if (memories.length === 0) {
          await this.bot.sendMessage(chatId, '📭 還沒有記憶存檔');
        } else {
          let text = '💾 *記憶存檔*\n\n';
          memories.forEach((m, i) => {
            const date = m.createdAt.toLocaleDateString('zh-CN');
            text += `${i + 1}. (${date}) ${m.content.substring(0, 50)}...\n`;
          });
          await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        }
        break;
      default:
        await menuService.sendMenu(this.bot, chatId, 'memory');
    }
  }

  /**
   * 處理快捷操作
   */
  async handleQuickAction(chatId, userId, messageId, data) {
    const action = data.replace('quick_', '');

    switch (action) {
      case 'save':
        // 獲取被回覆的消息內容
        const history = this.getHistory(userId);
        if (history.length > 0) {
          const lastResponse = history[history.length - 1];
          await memoryService.saveNote(userId, '對話記錄', lastResponse.content, ['auto-save']);
          await this.bot.sendMessage(chatId, '✅ 已保存到便簽！');
        }
        break;
      case 'regenerate':
        // 重新生成上一條回覆
        const userHistory = this.getHistory(userId);
        if (userHistory.length >= 2) {
          const lastUserMessage = userHistory[userHistory.length - 2];
          if (lastUserMessage.role === 'user') {
            await this.bot.sendChatAction(chatId, 'typing');
            const result = await bongbongService.generateResponse(lastUserMessage.content, {
              userId,
              chatId,
              history: userHistory.slice(0, -2)
            });
            await this.bot.sendMessage(chatId, `🔄 ${result.icon} ${result.response}\n\n${result.dashboard}`, {
              parse_mode: 'Markdown'
            });
          }
        }
        break;
    }
  }

  /**
   * 處理 /save 命令
   */
  async handleSave(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const input = match?.[1];

    if (!input) {
      await this.bot.sendMessage(chatId, '請提供要保存的內容：\n格式：/save 標題 | 內容');
      return;
    }

    let title, content;
    if (input.includes('|')) {
      [title, content] = input.split('|').map(s => s.trim());
    } else {
      title = '快速筆記';
      content = input;
    }

    const note = await memoryService.saveNote(userId, title, content);
    if (note) {
      await this.bot.sendMessage(chatId, `✅ 已保存！\n\n📝 標題: ${title}\n⏰ 時間: ${note.createdAt.toLocaleString('zh-CN')}`);
    } else {
      await this.bot.sendMessage(chatId, '❌ 保存失敗');
    }
  }

  /**
   * 處理 /stats 命令
   */
  async handleStats(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const stats = await memoryService.getStats(userId);
    const usage = bongbongService.getUsageStats();

    const text = `📊 *BongBong 統計*

💬 對話記錄: ${stats.conversations}
💾 記憶存檔: ${stats.memories}
📝 便簽數量: ${stats.notes}

🤖 *模型使用比例*
• Gemini: ${usage.routing.gemini.ratio}
• Grok: ${usage.routing.grok.ratio}

📈 *Token 使用*
• 輸入: ${usage.tokens.input}
• 輸出: ${usage.tokens.output}`;

    await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  /**
   * 獲取隨機問候語
   */
  getRandomGreeting() {
    const greetings = BONGBONG_PERSONA.responseTemplates.greeting;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * 獲取對話歷史
   */
  getHistory(userId) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    return this.conversationHistory.get(userId);
  }

  /**
   * 添加到歷史
   */
  addToHistory(userId, message) {
    const history = this.getHistory(userId);
    history.push(message);
    if (history.length > 20) {
      history.shift();
    }
  }

  /**
   * 處理幫助
   */
  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const helpText = `🎭 *BongBong 使用指南*

*基本操作*
• 直接發消息即可對話
• 點擊菜單按鈕選擇功能
• 無需記住任何指令！

*快捷命令*
• /start - 顯示主菜單
• /menu - 打開菜單
• /save - 保存內容
• /notes - 查看便簽
• /stats - 查看統計
• /task - 今日任務

*特色功能*
• 🧠 智能對話 - 自動選擇最佳模型
• 💾 記憶系統 - 記住重要的事
• 🎨 創作工具 - 寫作、圖片、視頻
• 🌿 養生專區 - 中西醫健康建議
• 🧩 腦力訓練 - 保持大腦活力

有問題隨時問我！`;

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  /**
   * 處理每日任務
   */
  async handleDailyTask(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    await this.showDailyTasks(chatId, userId);
  }

  /**
   * 顯示每日任務
   */
  async showDailyTasks(chatId, userId) {
    const tasks = await memoryService.getTodayTasks(userId);
    const completedTypes = tasks.filter(t => t.completed).map(t => t.taskType);

    const taskList = [
      { type: 'brainTeaser', name: '🧩 腦筋急轉彎', completed: completedTypes.includes('brainTeaser') },
      { type: 'pictureGame', name: '🖼️ 看圖說話', completed: completedTypes.includes('pictureGame') },
      { type: 'healthTip', name: '🌿 養生小貼士', completed: completedTypes.includes('healthTip') }
    ];

    let text = '📋 *今日任務*\n\n';
    taskList.forEach(task => {
      const status = task.completed ? '✅' : '⬜';
      text += `${status} ${task.name}\n`;
    });

    const completed = taskList.filter(t => t.completed).length;
    text += `\n進度: ${completed}/${taskList.length}`;

    await this.bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧩 做腦筋急轉彎', callback_data: 'brain_teaser' },
            { text: '🌿 看養生貼士', callback_data: 'health_tip' }
          ]
        ]
      }
    });
  }

  /**
   * 處理新聞請求
   */
  async handleNews(msg) {
    const chatId = msg.chat.id;
    
    try {
      await this.bot.sendMessage(chatId, '📰 正在獲取今日新聞，請稍候...');
      await this.bot.sendChatAction(chatId, 'typing');
      
      const news = await newsService.getDailyNews();
      
      // 分段發送 (Telegram 消息長度限制)
      const chunks = this.splitMessage(news, 4000);
      for (const chunk of chunks) {
        await this.bot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
      }
      
      // 發送輿論摘要按鈕
      await this.bot.sendMessage(chatId, '想看輿論摘要嗎？', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🗣️ 查看輿論摘要', callback_data: 'news_opinion' }]
          ]
        }
      });
    } catch (error) {
      logger.error('News error:', error);
      await this.bot.sendMessage(chatId, `❌ 獲取新聞失敗: ${error.message}`);
    }
  }

  /**
   * 處理畫畫請求
   */
  async handleDraw(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const prompt = match?.[1] || null;
    
    await this.handleDrawRequest(chatId, userId, prompt);
  }

  /**
   * 處理畫畫請求 (內部)
   */
  async handleDrawRequest(chatId, userId, prompt) {
    try {
      await this.bot.sendMessage(chatId, '🎨 正在創作中，請稍候...');
      await this.bot.sendChatAction(chatId, 'typing');
      
      // 如果沒有提示詞，使用個性化或隨機主題
      const finalPrompt = prompt || await imageService.getPersonalizedTopic(userId);
      
      const result = await imageService.generateImageDescription(finalPrompt, userId);
      
      if (result.success) {
        const response = `🎨 *畫作描述*

📝 *主題*: ${finalPrompt}

🖼️ *畫面描述*:
${result.description}

━━━━━━━━━━━━━━━━━━━━
💡 這是 AI 生成的畫面描述，可以用來想象或作為繪畫參考。`;

        await this.bot.sendMessage(chatId, response, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔄 換一個', callback_data: 'image_random' },
                { text: '💾 保存', callback_data: 'quick_save' }
              ]
            ]
          }
        });
      } else {
        await this.bot.sendMessage(chatId, `❌ 創作失敗: ${result.error}`);
      }
    } catch (error) {
      logger.error('Draw error:', error);
      await this.bot.sendMessage(chatId, `❌ 創作失敗: ${error.message}`);
    }
  }

  /**
   * 處理關鍵詞動作
   */
  async handleKeywordAction(chatId, userId, keyword, originalText) {
    switch (keyword.action) {
      case 'news':
        await this.handleNews({ chat: { id: chatId } });
        break;
      case 'draw':
        const prompt = extractDrawPrompt(originalText);
        await this.handleDrawRequest(chatId, userId, prompt);
        break;
      case 'menu':
        await this.showMainMenu(chatId);
        break;
      case 'health':
        await menuService.sendMenu(this.bot, chatId, 'health');
        break;
      case 'games':
        await menuService.sendMenu(this.bot, chatId, 'games');
        break;
      case 'sudoku':
        await this.bot.sendMessage(chatId, '🔢 數獨遊戲請點擊下方按鈕打開：', {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎮 打開數獨', web_app: { url: 'https://your-domain.com/webapp/' } }
            ]]
          }
        });
        break;
      case 'gomoku':
        await this.bot.sendMessage(chatId, '⚫ 五子棋遊戲請點擊下方按鈕打開：', {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎮 打開五子棋', web_app: { url: 'https://your-domain.com/webapp/' } }
            ]]
          }
        });
        break;
      case 'brainTeaser':
        await this.sendBrainTeaser(chatId, userId);
        break;
      case 'notes':
        await menuService.sendMenu(this.bot, chatId, 'notes');
        break;
      case 'memory':
        await menuService.sendMenu(this.bot, chatId, 'memory');
        break;
      case 'stats':
        await this.handleStats({ chat: { id: chatId }, from: { id: userId } });
        break;
      case 'help':
        await this.handleHelp({ chat: { id: chatId } });
        break;
      case 'dailyTask':
        await this.showDailyTasks(chatId, userId);
        break;
      case 'fortune':
        await this.handleFortune(chatId, userId);
        break;
      default:
        // 未知關鍵詞，正常處理
        break;
    }
  }

  /**
   * 處理運勢請求
   */
  async handleFortune(chatId, userId) {
    await this.bot.sendChatAction(chatId, 'typing');
    
    const result = await bongbongService.generateResponse('幫我算一下今天的運勢，包括事業、感情、健康，用幽默的方式說', {
      userId,
      chatId,
      history: []
    });
    
    await this.bot.sendMessage(chatId, `🔮 *今日運勢*\n\n${result.response}\n\n${result.dashboard}`, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * 分割長消息
   */
  splitMessage(text, maxLength = 4000) {
    const chunks = [];
    let current = '';
    
    const lines = text.split('\n');
    for (const line of lines) {
      if (current.length + line.length + 1 > maxLength) {
        chunks.push(current);
        current = line;
      } else {
        current += (current ? '\n' : '') + line;
      }
    }
    
    if (current) {
      chunks.push(current);
    }
    
    return chunks;
  }

  /**
   * 處理圖片消息
   */
  async handlePhoto(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🖼️ 收到圖片！你想讓我做什麼？', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📝 描述圖片', callback_data: 'photo_describe' },
            { text: '🎨 藝術風格化', callback_data: 'photo_stylize' }
          ]
        ]
      }
    });
  }

  /**
   * 停止 Bot
   */
  stop() {
    if (this.bot) {
      this.bot.stopPolling();
      logger.info('BongBong Bot stopped');
    }
  }
}

export default new BotServiceV2();
