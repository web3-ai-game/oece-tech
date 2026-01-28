/**
 * 雙 Bot 協調服務
 * 
 * 協調 BongBong 和 Avatar (周文虛擬分身) 的互動
 * 
 * 互動模式:
 * 1. BongBong 回覆後，Avatar 接話 (3秒延遲)
 * 2. Avatar 接話後，BongBong 15% 概率爆擊
 * 3. 群聊空閒1小時，觸發閒聊
 * 4. 每90分鐘一次閒聊 (2輪4回合)
 * 5. 每日一次吹捧周文老師
 */

import TelegramBot from 'node-telegram-bot-api';
import config from '../../config/index.js';
import { BONGBONG_PERSONA } from '../../config/bongbong.js';
import { AVATAR_PERSONA } from '../../config/avatar.js';
import bongbongService from './bongbongService.js';
import avatarService from './avatarService.js';
import groupMemoryService from './groupMemoryService.js';
import memoryService from './memoryService.js';
import menuService, { MAIN_MENU } from './menuService.js';
import newsService from './newsService.js';
import imageService from './imageService.js';
import visionService from './visionService.js';
import visaService, { VISA_KEYWORDS } from './visaService.js';
import segmentService from './segmentService.js';
import notebookService from './notebookService.js';
import smartMemoryService from './smartMemoryService.js';
import notionSyncService from './notionSyncService.js';
import creativeService from './creativeService.js';
import idleAnalysisService from './idleAnalysisService.js';
import newsCompareService from './newsCompareService.js';
import vectorEnhanceService from './vectorEnhanceService.js';
import { handleVoiceMessage } from '../handlers/voiceHandlerV2.js';
import { detectKeyword, isDrawRequest, isNewsRequest, extractDrawPrompt } from '../utils/keywords.js';
import { formatAIOutput, formatDashboard, formatVisaResponse } from '../utils/formatter.js';
import logger from '../utils/logger.js';

class DualBotService {
  constructor() {
    this.bongbongBot = null;
    this.avatarBot = null;
    this.initialized = false;
    
    // 群聊追蹤
    this.activeGroups = new Set();
    this.conversationHistory = new Map();
    
    // 計時器
    this.idleTimers = new Map();
    this.dailyPraiseTimer = null;
    
    // 待處理操作 (便簽、搜索等)
    this.pendingAction = new Map();
  }

  /**
   * 初始化雙 Bot
   */
  async init() {
    try {
      const bongbongToken = config.telegram.botToken;
      const avatarToken = process.env.TELEGRAM_BOT_TOKEN_AVATAR;

      if (!bongbongToken) {
        throw new Error('BongBong token not configured');
      }

      // 初始化 BongBong Bot
      this.bongbongBot = new TelegramBot(bongbongToken, { polling: true });
      await bongbongService.init();
      
      // 初始化 Avatar Bot
      if (avatarToken) {
        await avatarService.init(avatarToken);
        this.avatarBot = avatarService.bot;
        
        // 設置 Avatar 消息回調
        avatarService.setOnAvatarMessage(this.handleAvatarSpoke.bind(this));
      } else {
        logger.warn('Avatar token not configured, running in single bot mode');
      }

      // 初始化其他服務
      await groupMemoryService.connect();
      await newsService.init();
      await imageService.init();
      visionService.init();
      await visaService.init();  // 签证咨询服务
      await notebookService.connect();  // 多用户笔记本
      await smartMemoryService.init();  // 智能记忆系统
      await notionSyncService.initialize();  // Notion 同步服务
      await creativeService.init();  // 创作服务
      await idleAnalysisService.init();  // 闲置分析服务
      await newsCompareService.init();  // 新闻对比服务
      await vectorEnhanceService.init();  // 向量增强服务

      // 註冊處理器
      this.registerBongBongHandlers();
      
      // 啟動定時任務
      this.startScheduledTasks();

      this.initialized = true;
      logger.info('🎭 Dual Bot Service initialized');
      logger.info('  - BongBong: @qitiandashengqianqian_bot');
      if (avatarToken) {
        logger.info('  - Avatar: @svs_notion_bot');
      }
      
      return true;
    } catch (error) {
      logger.error('Dual bot init error:', error);
      throw error;
    }
  }

  /**
   * 註冊 BongBong 處理器
   */
  registerBongBongHandlers() {
    // 命令處理
    this.bongbongBot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bongbongBot.onText(/\/menu/, (msg) => this.showMainMenu(msg.chat.id));
    this.bongbongBot.onText(/\/help/, (msg) => this.handleHelp(msg));
    this.bongbongBot.onText(/\/news/, (msg) => this.handleNews(msg));
    this.bongbongBot.onText(/\/draw(?:\s+(.+))?/, (msg, match) => this.handleDraw(msg, match));
    this.bongbongBot.onText(/\/stats/, (msg) => this.handleStats(msg));
    this.bongbongBot.onText(/\/task/, (msg) => this.handleDailyTask(msg));

    // 消息處理
    this.bongbongBot.on('message', async (msg) => {
      if (msg.text?.startsWith('/')) return;

      const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
      
      // 記錄群聊
      if (isGroup) {
        this.activeGroups.add(msg.chat.id.toString());
        this.resetIdleTimer(msg.chat.id);
      }

      // 語音消息
      if (msg.voice) {
        await handleVoiceMessage(this.bongbongBot, msg);
        return;
      }

      // 圖片消息
      if (msg.photo) {
        await this.handlePhotoMessage(msg);
        return;
      }

      // 文本消息
      if (msg.text) {
        await this.handleBongBongMessage(msg);
      }
    });

    // 回調處理
    this.bongbongBot.on('callback_query', async (query) => {
      await this.handleCallback(query);
    });

    // 錯誤處理
    this.bongbongBot.on('polling_error', (error) => {
      logger.error('BongBong polling error:', error.message);
    });
  }

  /**
   * 處理 BongBong 消息
   */
  async handleBongBongMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name || '用戶';
    const text = msg.text;
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

    try {
      // 檢查是否有待處理操作 (便簽、搜索等)
      const handled = await this.handlePendingAction(userId, chatId, text);
      if (handled) return;

      // 記錄到群記憶
      if (isGroup) {
        await groupMemoryService.logGroupMessage({
          groupId: chatId.toString(),
          userId,
          userName,
          content: text,
          isBot: false
        });
        
        // 記錄群組活動 (閒置分析用)
        idleAnalysisService.recordActivity(chatId);
        
        // 記錄到向量增強服務 (每 50 句總結)
        vectorEnhanceService.recordMessage(chatId, userId, userName, text);
        
        // 同步到 Notion (用户消息全量复制)
        notionSyncService.addMessage({
          isBot: false,
          userId,
          userName,
          content: text,
          action: 'chat'
        }).catch(err => logger.debug('Notion sync error:', err.message));
      }

      // 注意: 已移除關鍵詞觸發，所有功能通過菜單按鈕觸發
      // 保留 /menu 命令作為入口

      // 發送輸入狀態
      await this.bongbongBot.sendChatAction(chatId, 'typing');

      // 獲取上下文
      let history = [];
      if (isGroup) {
        const groupHistory = await groupMemoryService.getGroupHistory(chatId.toString(), 20);
        history = groupHistory.reverse().map(m => ({
          role: m.isBot ? 'assistant' : 'user',
          content: `${m.userName}: ${m.content}`
        }));
      } else {
        history = this.getHistory(userId);
      }

      // 生成回覆
      const result = await bongbongService.generateResponse(text, {
        userId,
        chatId,
        userName,
        history
      });

      // 向量增強回覆 (50% 機率引用向量庫)
      let finalResponse = result.response;
      if (isGroup) {
        const enhanced = await vectorEnhanceService.enhanceResponse(
          chatId, 
          text, 
          result.response
        );
        if (enhanced.enhanced) {
          finalResponse = enhanced.response;
          logger.debug(`VectorEnhance: Response enhanced with ${enhanced.referenceCount} references`);
        }
      }

      // 構建回覆 (精簡儀表盤)
      const responseText = `${finalResponse}${result.dashboard}`;

      // 發送回覆 (帶精簡菜單按鈕)
      const sentMessage = await this.bongbongBot.sendMessage(chatId, responseText, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📋', callback_data: 'menu_main' },
              { text: '💾', callback_data: 'quick_save' },
              { text: '🔄', callback_data: 'quick_regenerate' }
            ]
          ]
        }
      });

      // 記錄 BongBong 的回覆
      if (isGroup) {
        await groupMemoryService.logGroupMessage({
          groupId: chatId.toString(),
          userId: 'bongbong',
          userName: 'BongBong',
          content: finalResponse,
          isBot: true,
          botName: 'qitiandashengqianqian_bot'
        });
        
        // 同步到 Notion (AI消息摘要)
        notionSyncService.addMessage({
          isBot: true,
          userId: 'bongbong',
          userName: 'BongBong',
          content: finalResponse,
          action: 'chat'
        }).catch(err => logger.debug('Notion sync error:', err.message));

        // 取消 Avatar 自動接話（碎碎念效果不好）
        // if (this.avatarBot) {
        //   setTimeout(() => {
        //     avatarService.respondToBongBong(chatId, result.response, sentMessage.message_id);
        //   }, AVATAR_PERSONA.triggers.afterBongBongDelay);
        // }
      }

      // 更新歷史
      if (!isGroup) {
        this.addToHistory(userId, { role: 'user', content: text });
        this.addToHistory(userId, { role: 'assistant', content: result.response });
      }

    } catch (error) {
      logger.error('BongBong message error:', error);
      await this.bongbongBot.sendMessage(chatId, `❌ 處理消息時出錯: ${error.message}`);
    }
  }

  /**
   * 處理 Avatar 說話後的回調
   */
  async handleAvatarSpoke(chatId, avatarMessage, messageId) {
    // 檢查是否應該爆擊回覆
    const counterResult = await bongbongService.handleAvatarMessage(avatarMessage);
    
    if (counterResult.shouldRespond && counterResult.response) {
      // 延遲後爆擊回覆
      setTimeout(async () => {
        try {
          // 嘗試回覆，如果失敗就直接發送
          try {
            await this.bongbongBot.sendMessage(chatId, `🎯 ${counterResult.response}`, {
              reply_to_message_id: messageId
            });
          } catch (replyError) {
            if (replyError.message?.includes('message to be replied not found')) {
              await this.bongbongBot.sendMessage(chatId, `🎯 ${counterResult.response}`);
            } else {
              throw replyError;
            }
          }

          // 記錄到群記憶
          await groupMemoryService.logGroupMessage({
            groupId: chatId.toString(),
            userId: 'bongbong',
            userName: 'BongBong',
            content: counterResult.response,
            isBot: true,
            botName: 'qitiandashengqianqian_bot'
          });

          logger.info(`BongBong counter-attacked in group ${chatId}`);
        } catch (error) {
          logger.error('Counter attack send error:', error.message);
        }
      }, 2000);
    }
  }

  /**
   * 重置空閒計時器
   */
  resetIdleTimer(chatId) {
    const groupId = chatId.toString();
    
    if (this.idleTimers.has(groupId)) {
      clearTimeout(this.idleTimers.get(groupId));
    }

    // 1小時後觸發閒聊
    const timer = setTimeout(() => {
      this.triggerIdleChat(chatId);
    }, AVATAR_PERSONA.triggers.idleTriggerMinutes * 60 * 1000);

    this.idleTimers.set(groupId, timer);
  }

  /**
   * 觸發閒聊
   */
  async triggerIdleChat(chatId) {
    if (!this.avatarBot) return;

    const groupId = chatId.toString();
    
    // 檢查是否真的空閒
    if (!groupMemoryService.isGroupIdle(groupId, AVATAR_PERSONA.triggers.idleTriggerMinutes)) {
      return;
    }

    logger.info(`Triggering idle chat in group ${groupId}`);

    try {
      // 2輪4回合閒聊
      for (let round = 0; round < AVATAR_PERSONA.triggers.idleChatRounds; round++) {
        // 獲取隨機話題
        const randomTopic = await groupMemoryService.getRandomTopic(groupId);
        
        // Avatar 開場或擴展話題
        let avatarMsg;
        if (randomTopic && Math.random() > 0.5) {
          avatarMsg = await avatarService.expandTopic(chatId, randomTopic.content);
        } else {
          avatarMsg = await avatarService.generateAvatarResponse(chatId, '', 'idle');
          if (avatarMsg) {
            await this.avatarBot.sendMessage(chatId, avatarMsg);
            await groupMemoryService.logGroupMessage({
              groupId,
              userId: 'avatar',
              userName: '周文 (虛擬)',
              content: avatarMsg,
              isBot: true,
              botName: 'svs_notion_bot'
            });
          }
        }

        // 等待 BongBong 回覆
        await this.sleep(5000);

        // BongBong 回覆
        if (avatarMsg) {
          const bongbongResponse = await bongbongService.generateResponse(
            `周文說：${avatarMsg}`,
            { userId: 'idle_chat', chatId, history: [] }
          );

          if (bongbongResponse.response) {
            const sent = await this.bongbongBot.sendMessage(chatId, 
              `${bongbongResponse.icon} ${bongbongResponse.response}`
            );

            await groupMemoryService.logGroupMessage({
              groupId,
              userId: 'bongbong',
              userName: 'BongBong',
              content: bongbongResponse.response,
              isBot: true,
              botName: 'qitiandashengqianqian_bot'
            });

            // Avatar 可能接話
            setTimeout(() => {
              avatarService.respondToBongBong(chatId, bongbongResponse.response, sent.message_id);
            }, 3000);
          }
        }

        // 等待下一輪
        await this.sleep(30000);
      }

    } catch (error) {
      logger.error('Idle chat error:', error);
    }
  }

  /**
   * 啟動定時任務
   */
  startScheduledTasks() {
    // 每日吹捧檢查 (每小時檢查一次)
    this.dailyPraiseTimer = setInterval(() => {
      this.checkDailyPraise();
    }, 60 * 60 * 1000);

    // 立即檢查一次
    setTimeout(() => this.checkDailyPraise(), 10000);
  }

  /**
   * 檢查每日吹捧
   */
  async checkDailyPraise() {
    if (!this.avatarBot) return;

    const now = new Date();
    const hour = now.getHours();
    
    // 在上午10點到下午6點之間隨機觸發
    if (hour >= 10 && hour <= 18) {
      for (const groupId of this.activeGroups) {
        await avatarService.triggerDailyPraise(parseInt(groupId));
      }
    }
  }

  /**
   * 處理 /start
   */
  async handleStart(msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || '朋友';
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

    if (isGroup) {
      this.activeGroups.add(chatId.toString());
    }

    const welcomeText = `🎭 *歡迎，${userName}！*

我是 *BongBong*，你的全能 AI 助手。

${isGroup ? '在群裡，我會和周文的虛擬分身一起陪你聊天！' : '有什麼需要幫忙的嗎？'}

點擊下方按鈕開始探索吧！`;

    await this.bongbongBot.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: MAIN_MENU.keyboard
      }
    });
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
        await this.handleDraw({ chat: { id: chatId }, from: { id: userId } }, [null, extractDrawPrompt(originalText)]);
        break;
      case 'menu':
        await this.showMainMenu(chatId);
        break;
      case 'health':
        await menuService.sendMenu(this.bongbongBot, chatId, 'health');
        break;
      case 'games':
        await menuService.sendMenu(this.bongbongBot, chatId, 'games');
        break;
      case 'brainTeaser':
        await this.sendBrainTeaser(chatId, userId);
        break;
      case 'fortune':
        await this.handleFortune(chatId, userId);
        break;
      default:
        break;
    }
  }

  /**
   * 處理圖片消息 - Gemini 多模態分析
   */
  async handlePhotoMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name || '用戶';
    const caption = msg.caption || '';
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

    try {
      // 發送處理中狀態
      await this.bongbongBot.sendChatAction(chatId, 'typing');
      const processingMsg = await this.bongbongBot.sendMessage(chatId, '🔍 正在分析圖片...');

      // 獲取最大尺寸的圖片
      const photo = msg.photo[msg.photo.length - 1];
      const file = await this.bongbongBot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${config.telegram.botToken}/${file.file_path}`;

      // 使用 Vision 服務分析
      const result = await visionService.analyzeImage(fileUrl, caption);

      // 刪除處理中消息
      try {
        await this.bongbongBot.deleteMessage(chatId, processingMsg.message_id);
      } catch (e) {}

      if (result.success) {
        // 分段發送分析結果
        const chunks = this.splitMessage(result.analysis, 4000);
        for (const chunk of chunks) {
          await this.bongbongBot.sendMessage(chatId, 
            `📸 *圖片分析*\n\n${chunk}`,
            { parse_mode: 'Markdown' }
          );
        }

        // 記錄到群記憶
        if (isGroup) {
          await groupMemoryService.logGroupMessage({
            groupId: chatId.toString(),
            userId,
            userName,
            content: `[圖片] ${caption || '(無說明)'}\n分析: ${result.analysis.substring(0, 500)}...`,
            isBot: false,
            metadata: { type: 'image', hasCaption: !!caption }
          });
        }
      } else {
        await this.bongbongBot.sendMessage(chatId, `❌ 圖片分析失敗: ${result.error}`);
      }

      logger.info(`Photo analyzed for user ${userId}`);

    } catch (error) {
      logger.error('Photo handler error:', error);
      await this.bongbongBot.sendMessage(chatId, `❌ 處理圖片時出錯: ${error.message}`);
    }
  }

  /**
   * 處理新聞
   */
  async handleNews(msg) {
    const chatId = msg.chat.id;
    
    try {
      await this.bongbongBot.sendMessage(chatId, '📰 正在獲取今日新聞...');
      await this.bongbongBot.sendChatAction(chatId, 'typing');
      
      const news = await newsService.getDailyNews();
      const chunks = this.splitMessage(news, 4000);
      
      for (const chunk of chunks) {
        await this.bongbongBot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      logger.error('News error:', error);
      await this.bongbongBot.sendMessage(chatId, `❌ 獲取新聞失敗: ${error.message}`);
    }
  }

  /**
   * 處理畫畫
   */
  async handleDraw(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id?.toString() || 'unknown';
    const prompt = match?.[1] || null;

    try {
      await this.bongbongBot.sendMessage(chatId, '🎨 正在創作...');
      await this.bongbongBot.sendChatAction(chatId, 'typing');
      
      const finalPrompt = prompt || await imageService.getPersonalizedTopic(userId);
      const result = await imageService.generateImageDescription(finalPrompt, userId);
      
      if (result.success) {
        await this.bongbongBot.sendMessage(chatId, 
          `🎨 *畫作描述*\n\n📝 *主題*: ${finalPrompt}\n\n🖼️ ${result.description}`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await this.bongbongBot.sendMessage(chatId, `❌ 創作失敗: ${result.error}`);
      }
    } catch (error) {
      logger.error('Draw error:', error);
      await this.bongbongBot.sendMessage(chatId, `❌ 創作失敗: ${error.message}`);
    }
  }

  /**
   * 處理統計
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
• Grok: ${usage.routing.grok.ratio}`;

    await this.bongbongBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  /**
   * 處理運勢
   */
  async handleFortune(chatId, userId) {
    await this.bongbongBot.sendChatAction(chatId, 'typing');
    
    const result = await bongbongService.generateResponse(
      '幫我算一下今天的運勢，包括事業、感情、健康，用幽默的方式說',
      { userId, chatId, history: [] }
    );
    
    await this.bongbongBot.sendMessage(chatId, 
      `🔮 *今日運勢*\n\n${result.response}`,
      { parse_mode: 'Markdown' }
    );
  }

  /**
   * 發送腦筋急轉彎
   */
  async sendBrainTeaser(chatId, userId) {
    const teasers = BONGBONG_PERSONA.dailyTaskTemplates.brainTeaser;
    const teaser = teasers[Math.floor(Math.random() * teasers.length)];
    await this.bongbongBot.sendMessage(chatId, teaser);
    await memoryService.logDailyTask(userId, 'brainTeaser');
  }

  /**
   * 處理每日任務
   */
  async handleDailyTask(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    
    const tasks = await memoryService.getTodayTasks(userId);
    const completedTypes = tasks.filter(t => t.completed).map(t => t.taskType);

    let text = '📋 *今日任務*\n\n';
    const taskList = [
      { type: 'brainTeaser', name: '🧩 腦筋急轉彎', completed: completedTypes.includes('brainTeaser') },
      { type: 'healthTip', name: '🌿 養生小貼士', completed: completedTypes.includes('healthTip') },
      { type: 'chat', name: '💬 和 BongBong 聊天', completed: completedTypes.includes('chat') }
    ];

    taskList.forEach(task => {
      text += `${task.completed ? '✅' : '⬜'} ${task.name}\n`;
    });

    await this.bongbongBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  /**
   * 處理幫助
   */
  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const helpText = `🎭 *BongBong 使用指南*

*快捷關鍵詞* (支持簡繁體)
• 報新聞/报新闻 - 每日新聞
• 畫畫/画画 - 生成圖片
• 養生/养生 - 養生專區
• 算命/運勢 - 今日運勢

*命令*
• /start - 開始
• /menu - 菜單
• /news - 新聞
• /draw - 畫畫
• /stats - 統計
• /task - 每日任務

*群聊特色*
• 周文虛擬分身會接話
• 空閒時自動閒聊
• 跨用戶記憶共享`;

    await this.bongbongBot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  /**
   * 處理回調
   */
  async handleCallback(query) {
    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();
    const userName = query.from.first_name || '用户';
    const data = query.data;
    const messageId = query.message.message_id;

    await this.bongbongBot.answerCallbackQuery(query.id);

    // ===== 菜單導航 =====
    if (data.startsWith('menu_')) {
      const menuName = data.replace('menu_', '');
      await menuService.updateMenu(this.bongbongBot, chatId, messageId, menuName);
      return;
    }

    // ===== 聊天模式 =====
    if (data.startsWith('chat_')) {
      const mode = data.replace('chat_', '');
      switch (mode) {
        case 'fast':
          await this.bongbongBot.sendMessage(chatId, '🚀 *快速問答模式*\n\n直接發送你的問題，我會快速回答！', { parse_mode: 'Markdown' });
          break;
        case 'deep':
          await this.bongbongBot.sendMessage(chatId, '🧠 *深度分析模式*\n\n發送複雜問題，我會詳細分析！', { parse_mode: 'Markdown' });
          break;
        case 'humor':
          await this.bongbongBot.sendMessage(chatId, '😎 *幽默模式*\n\n來聊點輕鬆的吧！', { parse_mode: 'Markdown' });
          break;
        case 'emotional':
          await this.bongbongBot.sendMessage(chatId, '💝 *情感支持模式*\n\n有什麼煩心事可以跟我說。', { parse_mode: 'Markdown' });
          break;
        case 'fortune':
          await this.handleFortune(chatId, userId);
          break;
        case 'knowledge':
          await this.bongbongBot.sendMessage(chatId, '📚 *知識問答模式*\n\n問我任何知識問題！', { parse_mode: 'Markdown' });
          break;
        case 'fullpower':
          await this.bongbongBot.sendMessage(chatId, 
            `🔥 *全火力模式啟動*\n\n這是深度分析模式，用於複雜問題：\n\n• Gemini Pro 嚴謹分析\n• Grok Mini 擴散思考\n• 語意分析決定 token 用量\n\n發送你的問題，我會全力分析！`, 
            { parse_mode: 'Markdown' }
          );
          break;
      }
      return;
    }

    // ===== 記事本 =====
    if (data.startsWith('notes_')) {
      const action = data.replace('notes_', '');
      switch (action) {
        case 'new':
          this.pendingAction.set(userId, { type: 'note_new', chatId });
          await this.bongbongBot.sendMessage(chatId, '📝 *新建便簽*\n\n請發送你要記錄的內容，格式：\n`標題 | 內容`\n\n例如：`購物清單 | 牛奶、麵包、雞蛋`', { parse_mode: 'Markdown' });
          break;
        case 'list':
          await this.showNotesList(chatId, userId);
          break;
        case 'search':
          this.pendingAction.set(userId, { type: 'note_search', chatId });
          await this.bongbongBot.sendMessage(chatId, '🔍 *搜索筆記*\n\n發送關鍵詞搜索你的筆記。', { parse_mode: 'Markdown' });
          break;
        case 'save_chat':
          await this.saveCurrentChat(chatId, userId);
          break;
      }
      return;
    }

    // ===== 創作工具 =====
    if (data.startsWith('creative_')) {
      const action = data.replace('creative_', '');
      await this.handleCreativeCallback(chatId, userId, userName, action, messageId);
      return;
    }

    // ===== 新聞中心 =====
    if (data.startsWith('news_')) {
      const action = data.replace('news_', '');
      await this.handleNewsCallback(chatId, userId, action, messageId);
      return;
    }

    // ===== 圖片生成 =====
    if (data.startsWith('image_')) {
      const style = data.replace('image_', '');
      await this.bongbongBot.sendMessage(chatId, `🎨 *${style} 風格*\n\n發送你想畫的內容描述。`, { parse_mode: 'Markdown' });
      return;
    }

    // ===== 腦力訓練 =====
    if (data.startsWith('brain_')) {
      const action = data.replace('brain_', '');
      switch (action) {
        case 'teaser':
          await this.sendBrainTeaser(chatId, userId);
          break;
        case 'memory':
          await this.bongbongBot.sendMessage(chatId, '🧠 *記憶訓練*\n\n(功能開發中...)', { parse_mode: 'Markdown' });
          break;
        case 'logic':
          await this.bongbongBot.sendMessage(chatId, '🔢 *邏輯推理*\n\n(功能開發中...)', { parse_mode: 'Markdown' });
          break;
        case 'word':
          await this.bongbongBot.sendMessage(chatId, '📝 *文字遊戲*\n\n(功能開發中...)', { parse_mode: 'Markdown' });
          break;
      }
      return;
    }

    // ===== 養生專區 =====
    if (data.startsWith('health_')) {
      const action = data.replace('health_', '');
      switch (action) {
        case 'symptom':
          await this.bongbongBot.sendMessage(chatId, '🏥 *症狀查詢*\n\n描述你的症狀，我會給出建議。\n\n⚠️ 僅供參考，如有不適請就醫。', { parse_mode: 'Markdown' });
          break;
        case 'medicine':
          await this.bongbongBot.sendMessage(chatId, '💊 *藥物諮詢*\n\n告訴我藥物名稱，我會查詢相關信息。', { parse_mode: 'Markdown' });
          break;
        case 'food':
          await this.bongbongBot.sendMessage(chatId, '🍵 *食療養生*\n\n告訴我你的體質或症狀，我推薦食療方案。', { parse_mode: 'Markdown' });
          break;
        case 'tip':
          await this.bongbongBot.sendMessage(chatId, '💡 *今日養生小貼士*\n\n多喝水，早睡早起，保持心情愉快！', { parse_mode: 'Markdown' });
          break;
      }
      return;
    }

    // ===== 遊戲 =====
    if (data.startsWith('game_')) {
      const game = data.replace('game_', '');
      await this.bongbongBot.sendMessage(chatId, `🎮 **${game} 游戏**\n\n(功能开发中...)`, { parse_mode: 'Markdown' });
      return;
    }

    // ===== 🛂 签证咨询 =====
    if (data.startsWith('visa_')) {
      const action = data.replace('visa_', '');
      await this.handleVisaCallback(chatId, userId, userName, action, messageId);
      return;
    }

    // ===== 設置 =====
    if (data.startsWith('settings_')) {
      const setting = data.replace('settings_', '');
      if (setting === 'memory') {
        await menuService.updateMenu(this.bongbongBot, chatId, messageId, 'memory');
      } else {
        await this.bongbongBot.sendMessage(chatId, `⚙️ *${setting} 設置*\n\n(功能開發中...)`, { parse_mode: 'Markdown' });
      }
      return;
    }

    // ===== 快捷操作 =====
    if (data.startsWith('quick_')) {
      const action = data.replace('quick_', '');
      switch (action) {
        case 'save':
          await this.bongbongBot.sendMessage(chatId, '💾 已保存！');
          break;
        case 'regenerate':
          await this.bongbongBot.sendMessage(chatId, '🔄 重新生成中...');
          break;
      }
      return;
    }

    // ===== 分段保存 =====
    if (data.startsWith('seg_')) {
      await this.handleSegmentCallback(chatId, userId, data, messageId);
      return;
    }

    // ===== 笔记本操作 =====
    if (data.startsWith('notes_')) {
      await this.handleNotesCallback(chatId, userId, data, messageId);
      return;
    }

    // ===== 记忆统计 =====
    if (data === 'memory_stats') {
      await this.showMemoryStats(chatId);
      return;
    }
  }

  /**
   * 显示记忆统计
   */
  async showMemoryStats(chatId) {
    try {
      const stats = await smartMemoryService.getStats();
      
      let text = `📊 **智能记忆统计**\n\n`;
      text += `📝 总记忆数: ${stats.totalMemories}\n`;
      text += `📓 自动笔记: ${stats.autoNotes}\n\n`;
      
      if (Object.keys(stats.byCategory).length > 0) {
        text += `**按分类:**\n`;
        for (const [cat, count] of Object.entries(stats.byCategory)) {
          text += `• ${cat}: ${count}\n`;
        }
      }
      
      await this.bongbongBot.sendMessage(chatId, text, { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🏠 返回菜单', callback_data: 'menu_main' }
          ]]
        }
      });
    } catch (error) {
      logger.error('ShowMemoryStats error:', error);
      await this.bongbongBot.sendMessage(chatId, '❌ 获取统计失败');
    }
  }

  /**
   * 顯示主菜單
   */
  async showMainMenu(chatId) {
    await menuService.sendMenu(this.bongbongBot, chatId, 'main');
  }

  // 輔助方法
  getHistory(userId) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    return this.conversationHistory.get(userId);
  }

  addToHistory(userId, message) {
    const history = this.getHistory(userId);
    history.push(message);
    if (history.length > 20) history.shift();
  }

  splitMessage(text, maxLength = 4000) {
    const chunks = [];
    let current = '';
    for (const line of text.split('\n')) {
      if (current.length + line.length + 1 > maxLength) {
        chunks.push(current);
        current = line;
      } else {
        current += (current ? '\n' : '') + line;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🛂 处理签证咨询（母亲专用）
   */
  async handleVisaQuery(chatId, userId, userName, question) {
    try {
      // 发送处理中提示（简体中文）
      const processingMsg = await this.bongbongBot.sendMessage(
        chatId, 
        '🛂 **签证咨询模式启动**\n\n正在深度分析您的问题，请稍候...\n\n_使用 Grok-3 深度思考中..._',
        { parse_mode: 'Markdown' }
      );

      // 调用签证服务
      const result = await visaService.handleVisaQuery(question, userName);
      
      // 格式化输出（简体中文 + Markdown）
      let response = formatAIOutput(result.response);
      
      // 添加扩展问题
      if (result.expandedQuestions && result.expandedQuestions.length > 0) {
        response = formatVisaResponse(response, result.expandedQuestions);
      }
      
      // 添加仪表盘
      const dashboard = formatDashboard({
        messageCount: 0,
        model: result.model,
        tokens: 0,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      });
      
      response += dashboard;

      // 删除处理中消息
      try {
        await this.bongbongBot.deleteMessage(chatId, processingMsg.message_id);
      } catch (e) {
        // 忽略删除失败
      }

      // 分段发送，每段带保存按钮
      const segments = segmentService.splitIntoSegments(response);
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const segmentId = segmentService.cacheSegment(segment.content, chatId);
        
        // 构建迷你按钮 - 每段都有保存/复制/扩展
        const buttons = [
          [
            { text: '💾 存妈', callback_data: `seg_mom_${segmentId}` },
            { text: '💾 存我', callback_data: `seg_me_${segmentId}` },
            { text: '📋', callback_data: `seg_copy_${segmentId}` },
            { text: '🔍', callback_data: `seg_expand_${segmentId}` }
          ]
        ];
        
        // 最后一段添加导航按钮
        if (i === segments.length - 1) {
          buttons.push([
            { text: '📋 更多签证问题', callback_data: 'visa_more' },
            { text: '🏠 返回菜单', callback_data: 'menu_main' }
          ]);
        }
        
        await this.bongbongBot.sendMessage(chatId, segment.content, { 
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
        
        // 段落间短暂延迟
        if (i < segments.length - 1) {
          await this.sleep(300);
        }
      }

      // 记录到群记忆
      await groupMemoryService.logGroupMessage({
        groupId: chatId.toString(),
        userId: 'bongbong',
        userName: 'BongBong',
        content: `[签证咨询] ${question.substring(0, 50)}...`,
        isBot: true,
        botName: 'qitiandashengqianqian_bot'
      });

      // 🧠 自动添加到智能记忆（后台静默执行，不阻塞）
      smartMemoryService.smartSave(response, {
        userId,
        userName,
        source: 'visa_consultation'
      }).catch(e => logger.error('Auto memory save error:', e));

      logger.info(`Visa query handled for ${userName}: ${question.substring(0, 50)}...`);
    } catch (error) {
      logger.error('Visa query error:', error);
      await this.bongbongBot.sendMessage(
        chatId,
        '❌ **签证咨询出错**\n\n请稍后重试，或直接描述您的签证问题。',
        { parse_mode: 'Markdown' }
      );
    }
  }

  /**
   * 🛂 处理签证菜单回调
   */
  async handleVisaCallback(chatId, userId, userName, action, messageId) {
    const visaQuestions = {
      free: '中国公民去泰国免签政策是什么？可以停留多久？需要什么材料？',
      arrival: '泰国落地签怎么办理？需要什么材料？费用多少？',
      retirement: '泰国养老签证怎么申请？需要什么条件？存款要求是多少？',
      elite: '泰国精英签证是什么？费用多少？有什么优势？',
      latest: '泰国最新的签证政策有哪些变化？2024年有什么新规定？',
      more: '请问还有什么签证相关的问题我可以帮您解答？',
      ask: null  // 自由提问模式
    };

    if (action === 'ask') {
      // 设置待处理操作
      this.pendingAction.set(userId, { type: 'visa_ask', chatId });
      await this.bongbongBot.sendMessage(
        chatId,
        '🛂 **自由提问模式**\n\n请直接输入您的签证问题，我会为您详细解答。\n\n例如：\n- 我想在泰国长期居住，有什么签证选择？\n- 养老签证和精英签证哪个更适合我？\n- 签证快到期了怎么续签？',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const question = visaQuestions[action];
    if (question) {
      await this.handleVisaQuery(chatId, userId, userName, question);
    }
  }

  /**
   * 处理分段保存回调
   */
  async handleSegmentCallback(chatId, userId, data, messageId) {
    // 解析: seg_mom_xxx 或 seg_me_xxx 或 seg_copy_xxx 或 seg_expand_xxx
    const parts = data.split('_');
    if (parts.length < 3) return;
    
    const action = parts[1];  // mom, me, copy, expand
    const segmentId = parts.slice(2).join('_');
    
    // 获取缓存的内容
    const cached = segmentService.getSegment(segmentId);
    if (!cached) {
      try {
        await this.bongbongBot.sendMessage(chatId, '⏰ 内容已过期，请重新查询');
      } catch (e) {}
      return;
    }
    
    switch (action) {
      case 'mom':
        // 保存到母亲笔记本 + 智能分析
        const momAnalysis = await smartMemoryService.smartSave(cached.content, {
          userId: 'mother',
          userName: '妈妈',
          source: 'ai_output'
        });
        
        const momResult = await notebookService.saveToMotherNotebook(cached.content, {
          source: 'ai_output',
          category: momAnalysis.analysis?.category || 'ai_knowledge',
          tags: momAnalysis.analysis?.tags || []
        });
        
        if (momResult.success) {
          const tags = momAnalysis.analysis?.tags?.join(', ') || '';
          await this.bongbongBot.sendMessage(chatId, 
            `✅ 已保存到 **妈妈的笔记本**\n📂 分类: ${momAnalysis.analysis?.category || '知识'}\n🏷️ 标签: ${tags || '无'}`, 
            { parse_mode: 'Markdown' }
          );
        }
        break;
        
      case 'me':
        // 保存到我的笔记本 + 智能分析
        const meAnalysis = await smartMemoryService.smartSave(cached.content, {
          userId,
          userName: '我',
          source: 'ai_output'
        });
        
        const meResult = await notebookService.saveToMyNotebook(userId, cached.content, {
          source: 'ai_output',
          category: meAnalysis.analysis?.category || 'ai_knowledge',
          tags: meAnalysis.analysis?.tags || []
        });
        
        if (meResult.success) {
          const tags = meAnalysis.analysis?.tags?.join(', ') || '';
          await this.bongbongBot.sendMessage(chatId, 
            `✅ 已保存到 **我的笔记本**\n📂 分类: ${meAnalysis.analysis?.category || '知识'}\n🏷️ 标签: ${tags || '无'}`, 
            { parse_mode: 'Markdown' }
          );
        }
        break;
        
      case 'copy':
        // 发送纯文本方便复制
        await this.bongbongBot.sendMessage(chatId, 
          `📋 **复制内容**\n\n\`\`\`\n${cached.content.substring(0, 3000)}\n\`\`\`\n\n_长按上方代码块可复制_`, 
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'expand':
        // 扩展搜索 - 触发智能记忆并搜索相关内容
        await this.handleExpandSearch(chatId, userId, cached.content);
        break;
    }
  }

  /**
   * 扩展搜索 - 智能分析并记忆
   */
  async handleExpandSearch(chatId, userId, content) {
    try {
      await this.bongbongBot.sendChatAction(chatId, 'typing');
      
      // 提取关键词进行搜索
      const keywords = content.substring(0, 100).replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').trim();
      
      // 扩展搜索并自动记忆
      const searchResult = await smartMemoryService.expandSearch(keywords, {
        userId,
        autoMemorize: true
      });
      
      // 构建响应
      let response = `🔍 **扩展搜索结果**\n\n`;
      response += `📝 关键词: ${keywords.substring(0, 30)}...\n\n`;
      
      if (searchResult.results.length > 0) {
        response += `**找到 ${searchResult.results.length} 条相关记忆:**\n`;
        searchResult.results.slice(0, 5).forEach((r, i) => {
          response += `${i + 1}. ${r.summary || r.content?.substring(0, 50)}...\n`;
        });
      } else {
        response += `_暂无相关记忆_\n`;
      }
      
      if (searchResult.recommendations.length > 0) {
        response += `\n**💡 相关推荐:**\n`;
        searchResult.recommendations.forEach((r, i) => {
          response += `• ${r}\n`;
        });
      }
      
      response += `\n✅ 已自动记忆本次内容`;
      
      await this.bongbongBot.sendMessage(chatId, response, { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '📊 查看统计', callback_data: 'memory_stats' },
            { text: '🏠 返回菜单', callback_data: 'menu_main' }
          ]]
        }
      });
    } catch (error) {
      logger.error('ExpandSearch error:', error);
      await this.bongbongBot.sendMessage(chatId, '❌ 扩展搜索失败');
    }
  }

  /**
   * 处理笔记本回调
   */
  async handleNotesCallback(chatId, userId, data, messageId) {
    const action = data.replace('notes_', '');
    
    switch (action) {
      case 'mother':
        // 显示母亲的笔记
        const momNotes = await notebookService.getMotherNotes({ limit: 10 });
        await this.showNotesListFormatted(chatId, momNotes, '👩‍🦳 妈妈的笔记本');
        break;
        
      case 'mine':
        // 显示我的笔记
        const myNotes = await notebookService.getMyNotes(userId, { limit: 10 });
        await this.showNotesListFormatted(chatId, myNotes, '👨‍💻 我的笔记本');
        break;
        
      case 'new':
        this.pendingAction.set(userId, { type: 'note_new', chatId });
        await this.bongbongBot.sendMessage(chatId, '📝 **新建笔记**\n\n请发送内容，格式：\n`标题 | 内容`\n\n例如：`购物清单 | 牛奶、面包、鸡蛋`', { parse_mode: 'Markdown' });
        break;
        
      case 'list':
        await menuService.updateMenu(this.bongbongBot, chatId, messageId, 'notes');
        break;
        
      case 'search':
        this.pendingAction.set(userId, { type: 'note_search', chatId });
        await this.bongbongBot.sendMessage(chatId, '🔍 **搜索笔记**\n\n请输入关键词搜索', { parse_mode: 'Markdown' });
        break;
    }
  }

  /**
   * 格式化显示笔记列表
   */
  async showNotesListFormatted(chatId, notes, title) {
    if (!notes || notes.length === 0) {
      await this.bongbongBot.sendMessage(chatId, `${title}\n\n📭 还没有笔记`, { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '➕ 新建笔记', callback_data: 'notes_new' },
            { text: '◀️ 返回', callback_data: 'menu_notes' }
          ]]
        }
      });
      return;
    }
    
    let text = `${title}\n\n`;
    notes.forEach((note, i) => {
      const date = new Date(note.createdAt).toLocaleDateString('zh-CN');
      const tags = note.tags?.length > 0 ? ` [${note.tags.join(', ')}]` : '';
      text += `${i + 1}. **${note.title}**${tags}\n   ${note.content.substring(0, 40)}...\n   📅 ${date}\n\n`;
    });
    
    await this.bongbongBot.sendMessage(chatId, text, { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '➕ 新建', callback_data: 'notes_new' },
          { text: '🔍 搜索', callback_data: 'notes_search' },
          { text: '◀️ 返回', callback_data: 'menu_notes' }
        ]]
      }
    });
  }

  /**
   * 顯示便簽列表
   */
  async showNotesList(chatId, userId) {
    try {
      const notes = await memoryService.getAllNotes(userId, 10);
      
      if (notes.length === 0) {
        await this.bongbongBot.sendMessage(chatId, '📋 *你的便簽*\n\n還沒有任何便簽，點擊「新建便簽」創建一個吧！', { parse_mode: 'Markdown' });
        return;
      }
      
      let text = '📋 *你的便簽*\n\n';
      notes.forEach((note, i) => {
        const date = new Date(note.createdAt).toLocaleDateString('zh-TW');
        text += `${i + 1}. *${note.title}*\n   ${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}\n   📅 ${date}\n\n`;
      });
      
      await this.bongbongBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Error showing notes list:', error);
      await this.bongbongBot.sendMessage(chatId, '❌ 獲取便簽失敗');
    }
  }

  /**
   * 保存當前對話
   */
  async saveCurrentChat(chatId, userId) {
    try {
      const history = this.getHistory(userId);
      if (history.length === 0) {
        await this.bongbongBot.sendMessage(chatId, '❌ 沒有可保存的對話');
        return;
      }
      
      const content = history.map(h => `${h.role === 'user' ? '我' : 'BongBong'}: ${h.content}`).join('\n');
      const title = `對話記錄 ${new Date().toLocaleDateString('zh-TW')}`;
      
      await memoryService.saveNote(userId, title, content, ['對話', '自動保存']);
      await this.bongbongBot.sendMessage(chatId, '💾 *對話已保存*\n\n已保存最近的對話記錄到便簽。', { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Error saving chat:', error);
      await this.bongbongBot.sendMessage(chatId, '❌ 保存失敗');
    }
  }

  /**
   * 處理待處理操作
   */
  async handlePendingAction(userId, chatId, text) {
    const action = this.pendingAction.get(userId);
    if (!action) return false;
    
    this.pendingAction.delete(userId);
    
    switch (action.type) {
      case 'note_new':
        // 解析標題和內容
        const parts = text.split('|').map(s => s.trim());
        const title = parts[0] || '無標題';
        const content = parts.slice(1).join('|') || parts[0];
        
        const note = await memoryService.saveNote(userId, title, content);
        if (note) {
          await this.bongbongBot.sendMessage(chatId, `✅ *便簽已保存*\n\n📌 *${title}*\n${content}`, { parse_mode: 'Markdown' });
        } else {
          await this.bongbongBot.sendMessage(chatId, '❌ 保存失敗，請重試');
        }
        return true;
        
      case 'note_search':
        const results = await memoryService.searchNotes(userId, text);
        if (results.length === 0) {
          await this.bongbongBot.sendMessage(chatId, `🔍 **搜索结果**\n\n没有找到包含「${text}」的便签`, { parse_mode: 'Markdown' });
        } else {
          let resultText = `🔍 **搜索结果** (${results.length})\n\n`;
          results.forEach((note, i) => {
            resultText += `${i + 1}. **${note.title}**\n   ${note.content.substring(0, 50)}...\n\n`;
          });
          await this.bongbongBot.sendMessage(chatId, resultText, { parse_mode: 'Markdown' });
        }
        return true;
        
      case 'visa_ask':
        // 签证自由提问
        const userName = '用户';  // 从 context 获取
        await this.handleVisaQuery(chatId, userId, userName, text);
        return true;
        
      case 'creative_writing':
      case 'creative_story':
      case 'creative_expand':
        // 创作输入
        await this.handleCreativeInput(userId, chatId, text, action.type);
        return true;
    }
    
    return false;
  }

  // ==================== 创作功能 ====================

  /**
   * 处理创作回调
   */
  async handleCreativeCallback(chatId, userId, userName, action, messageId) {
    switch (action) {
      case 'writing':
        // 写作助手
        this.pendingAction.set(userId, { type: 'creative_writing', chatId });
        await this.bongbongBot.sendMessage(chatId, 
          `✍️ *写作助手*\n\n选择写作类型：\n\n1️⃣ 发送主题 → 生成大纲\n2️⃣ 发送 \`草稿:主题\` → 生成初稿\n3️⃣ 发送 \`润色:内容\` → 润色文字\n4️⃣ 发送 \`扩写:内容\` → 扩展内容\n\n例如：\n• \`草稿:一封给妈妈的信\`\n• \`润色:今天天气很好我很开心\``,
          { 
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '◀️ 返回创作工具', callback_data: 'menu_creative' }
              ]]
            }
          }
        );
        break;

      case 'story':
        // 故事续写
        this.pendingAction.set(userId, { type: 'creative_story', chatId });
        await this.bongbongBot.sendMessage(chatId,
          `📖 *故事续写*\n\n发送故事开头，我来帮你续写！\n\n也可以：\n• 发送 \`结局:故事内容\` → 生成结局\n• 发送 \`角色:背景设定\` → 创建角色\n\n例如：\n_从前有座山，山里有座庙..._`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '◀️ 返回创作工具', callback_data: 'menu_creative' }
              ]]
            }
          }
        );
        break;

      case 'inspire':
        // 灵感激发
        await this.bongbongBot.sendMessage(chatId, '💡 *正在激发灵感...*', { parse_mode: 'Markdown' });
        const inspiration = await creativeService.getInspiration();
        if (inspiration.success) {
          await this.bongbongBot.sendMessage(chatId,
            `💡 *创作灵感*\n\n${inspiration.content}`,
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '🔄 换一批', callback_data: 'creative_inspire' },
                    { text: '💾 保存', callback_data: 'creative_save_inspire' }
                  ],
                  [{ text: '◀️ 返回', callback_data: 'menu_creative' }]
                ]
              }
            }
          );
        } else {
          await this.bongbongBot.sendMessage(chatId, '❌ 灵感生成失败，请重试');
        }
        break;

      case 'expand':
        // 扩写润色
        this.pendingAction.set(userId, { type: 'creative_expand', chatId });
        await this.bongbongBot.sendMessage(chatId,
          `📝 *扩写润色*\n\n发送你想扩写或润色的内容。\n\n我会帮你：\n• 增加细节描写\n• 丰富情感表达\n• 优化语言表达`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '◀️ 返回创作工具', callback_data: 'menu_creative' }
              ]]
            }
          }
        );
        break;

      case 'image':
        await menuService.updateMenu(this.bongbongBot, chatId, messageId, 'image');
        break;

      case 'video':
        await menuService.updateMenu(this.bongbongBot, chatId, messageId, 'video');
        break;

      case 'save_inspire':
        // 保存灵感到笔记
        await this.bongbongBot.sendMessage(chatId, '💾 灵感已保存到笔记本！');
        break;

      default:
        await this.bongbongBot.sendMessage(chatId, '🔨 *功能开发中...*', { parse_mode: 'Markdown' });
    }
  }

  /**
   * 处理创作输入
   */
  async handleCreativeInput(userId, chatId, text, actionType) {
    try {
      await this.bongbongBot.sendMessage(chatId, '✨ *正在创作中...*', { parse_mode: 'Markdown' });
      
      let result;
      
      if (actionType === 'creative_writing') {
        // 解析写作指令
        if (text.startsWith('草稿:') || text.startsWith('草稿：')) {
          const topic = text.replace(/^草稿[:：]/, '').trim();
          result = await creativeService.generateDraft(topic);
        } else if (text.startsWith('润色:') || text.startsWith('润色：')) {
          const content = text.replace(/^润色[:：]/, '').trim();
          result = await creativeService.polishContent(content);
        } else if (text.startsWith('扩写:') || text.startsWith('扩写：')) {
          const content = text.replace(/^扩写[:：]/, '').trim();
          result = await creativeService.expandContent(content);
        } else {
          // 默认生成大纲
          result = await creativeService.generateOutline(text);
        }
      } else if (actionType === 'creative_story') {
        // 解析故事指令
        if (text.startsWith('结局:') || text.startsWith('结局：')) {
          const story = text.replace(/^结局[:：]/, '').trim();
          result = await creativeService.generateEnding(story);
        } else if (text.startsWith('角色:') || text.startsWith('角色：')) {
          const background = text.replace(/^角色[:：]/, '').trim();
          result = await creativeService.createCharacter(background);
        } else {
          // 默认续写故事
          result = await creativeService.continueStory(text);
        }
      } else if (actionType === 'creative_expand') {
        result = await creativeService.expandContent(text);
      }

      if (result && result.success) {
        // 分段发送长内容
        const content = result.content;
        if (content.length > 3000) {
          const chunks = this.splitContent(content, 3000);
          for (let i = 0; i < chunks.length; i++) {
            await this.bongbongBot.sendMessage(chatId, 
              i === 0 ? `✨ *创作完成* (${i+1}/${chunks.length})\n\n${chunks[i]}` : chunks[i],
              { parse_mode: 'Markdown' }
            );
          }
        } else {
          await this.bongbongBot.sendMessage(chatId,
            `✨ *创作完成*\n\n${content}`,
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '💾 保存', callback_data: 'notes_save_creative' },
                    { text: '📝 继续创作', callback_data: `creative_${actionType.replace('creative_', '')}` }
                  ],
                  [{ text: '◀️ 返回菜单', callback_data: 'menu_creative' }]
                ]
              }
            }
          );
        }
        
        // 保存到创作历史
        creativeService.saveDraft(userId, {
          type: result.type,
          content: result.content,
          title: `创作 - ${new Date().toLocaleDateString()}`
        });
      } else {
        await this.bongbongBot.sendMessage(chatId, `❌ 创作失败: ${result?.error || '未知错误'}`);
      }
    } catch (error) {
      logger.error('Creative input error:', error);
      await this.bongbongBot.sendMessage(chatId, '❌ 创作过程出错，请重试');
    }
  }

  /**
   * 分割长内容
   */
  splitContent(content, maxLength) {
    const chunks = [];
    let remaining = content;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      
      // 尝试在段落处分割
      let splitIndex = remaining.lastIndexOf('\n\n', maxLength);
      if (splitIndex === -1 || splitIndex < maxLength / 2) {
        splitIndex = remaining.lastIndexOf('\n', maxLength);
      }
      if (splitIndex === -1 || splitIndex < maxLength / 2) {
        splitIndex = maxLength;
      }
      
      chunks.push(remaining.substring(0, splitIndex));
      remaining = remaining.substring(splitIndex).trim();
    }
    
    return chunks;
  }

  // ==================== 新聞功能 ====================

  /**
   * 處理新聞回調
   */
  async handleNewsCallback(chatId, userId, action, messageId) {
    try {
      switch (action) {
        case 'today':
          // 今日新聞
          await this.bongbongBot.sendMessage(chatId, '📰 *正在獲取今日新聞...*', { parse_mode: 'Markdown' });
          const segments = await newsCompareService.getReportSegments();
          for (let i = 0; i < Math.min(segments.length, 3); i++) {
            await this.bongbongBot.sendMessage(chatId, segments[i], { parse_mode: 'Markdown' });
          }
          break;

        case 'opinion':
          // 輿論風向
          await this.bongbongBot.sendMessage(chatId, '🗣️ *正在分析輿論風向...*', { parse_mode: 'Markdown' });
          const opinion = await newsCompareService.fetchOpinion();
          const opinionChunks = this.splitContent(opinion, 3500);
          for (const chunk of opinionChunks) {
            await this.bongbongBot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
          }
          break;

        case 'compare':
          // 新聞 + 輿論對比
          await this.bongbongBot.sendMessage(chatId, '⚖️ *正在生成對比報告...*\n\n這可能需要一點時間...', { parse_mode: 'Markdown' });
          const report = await newsCompareService.getReportSegments(true);
          for (const segment of report) {
            await this.bongbongBot.sendMessage(chatId, segment, { parse_mode: 'Markdown' });
          }
          await this.bongbongBot.sendMessage(chatId, '✅ 報告生成完成！', {
            reply_markup: {
              inline_keyboard: [[
                { text: '🔄 刷新', callback_data: 'news_refresh' },
                { text: '◀️ 返回', callback_data: 'menu_main' }
              ]]
            }
          });
          break;

        case 'refresh':
          // 強制刷新
          await this.bongbongBot.sendMessage(chatId, '🔄 *正在刷新新聞...*', { parse_mode: 'Markdown' });
          const refreshed = await newsCompareService.getReportSegments(true);
          for (const segment of refreshed) {
            await this.bongbongBot.sendMessage(chatId, segment, { parse_mode: 'Markdown' });
          }
          break;

        default:
          await menuService.updateMenu(this.bongbongBot, chatId, messageId, 'news');
      }
    } catch (error) {
      logger.error('News callback error:', error);
      await this.bongbongBot.sendMessage(chatId, `❌ 新聞獲取失敗: ${error.message}`);
    }
  }

  /**
   * 停止
   */
  stop() {
    if (this.bongbongBot) {
      this.bongbongBot.stopPolling();
    }
    avatarService.stop();
    idleAnalysisService.stop();
    
    for (const timer of this.idleTimers.values()) {
      clearTimeout(timer);
    }
    if (this.dailyPraiseTimer) {
      clearInterval(this.dailyPraiseTimer);
    }
    
    logger.info('Dual bot service stopped');
  }
}

export default new DualBotService();
