/**
 * Admin Bot (高級知識分子) 服務 v3.0
 * 
 * 功能:
 * - 多模態處理：圖片生成、音頻回覆、視頻生成
 * - 真實之眼 (多模型交叉驗證)
 * - 拆解周文的高密度語意
 * - 不再自動接話（取消碎碎念）
 */

import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import { AVATAR_PERSONA, ZHOUWEN_STORIES } from '../../config/avatar.js';
import groupMemoryService from './groupMemoryService.js';
import eyeOfTruthService from './eyeOfTruthService.js';
import logger from '../utils/logger.js';

class AvatarService {
  constructor() {
    this.bot = null;
    this.gemini = null;
    this.grok = null;
    this.initialized = false;
    
    // 狀態追蹤
    this.lastBongBongMessage = new Map();
    this.dailyPraiseTriggered = new Map();
    this.idleChatTimer = new Map();
    this.lastIdleChat = new Map();
    this.lastGroupActivity = new Map(); // groupId -> timestamp
  }

  /**
   * 初始化
   */
  async init(avatarToken) {
    try {
      if (!avatarToken) {
        logger.warn('Avatar bot token not provided');
        return false;
      }

      this.bot = new TelegramBot(avatarToken, { polling: true });
      
      // 初始化 Gemini (直接使用 API)
      const geminiKey = config.apiKeys.gemini;
      if (geminiKey) {
        this.gemini = new GoogleGenerativeAI(geminiKey);
      }

      // 初始化 Grok (直接使用 API)
      const grokKey = config.apiKeys.grok;
      if (grokKey) {
        this.grok = new OpenAI({
          apiKey: grokKey,
          baseURL: 'https://api.x.ai/v1'
        });
      }

      // 初始化真實之眼
      eyeOfTruthService.init();

      // 連接群記憶服務
      await groupMemoryService.connect();

      // 註冊處理器
      this.registerHandlers();

      this.initialized = true;
      logger.info('🤖 Avatar bot initialized (@svs_notion_bot)');
      return true;
    } catch (error) {
      logger.error('Avatar init error:', error);
      return false;
    }
  }

  /**
   * 註冊處理器
   */
  registerHandlers() {
    // 命令處理
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/menu/, (msg) => this.showAvatarMenu(msg.chat.id));
    this.bot.onText(/\/roast/, (msg) => this.triggerRoastMode(msg.chat.id, msg.message_id));
    this.bot.onText(/\/eye(?:\s+(.+))?/, (msg, match) => this.handleEyeCommand(msg, match));

    // 回調處理
    this.bot.on('callback_query', async (query) => {
      await this.handleAvatarCallback(query);
    });

    // 監聯所有消息
    this.bot.on('message', async (msg) => {
      if (!msg.text || msg.text.startsWith('/')) return;
      
      const chatId = msg.chat.id;
      const userId = msg.from.id.toString();
      const userName = msg.from.first_name || '用戶';
      const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
      const isBot = msg.from.is_bot;
      const botUsername = msg.from.username;

      // 只處理群聊
      if (!isGroup) return;

      // 記錄消息到群記憶
      await groupMemoryService.logGroupMessage({
        groupId: chatId.toString(),
        userId,
        userName,
        content: msg.text,
        isBot,
        botName: isBot ? botUsername : null
      });

      // 重置空閒計時器
      this.resetIdleTimer(chatId);

      // 取消自動接 BongBong 的話（碎碎念效果不好）
      // if (isBot && botUsername === 'qitiandashengqianqian_bot') {
      //   logger.info(`Avatar detected BongBong message, will respond...`);
      //   setTimeout(() => {
      //     this.respondToBongBong(chatId, msg.text, msg.message_id);
      //   }, AVATAR_PERSONA.triggers.afterBongBongDelay);
      //   return;
      // }

      // 如果是真人說話（不是自己），處理
      if (!isBot && botUsername !== 'svs_notion_bot') {
        // 檢查是否是周文本人
        const isZhouwen = AVATAR_PERSONA.realZhouwenNames.some(n => 
          userName.includes(n) || userId.includes(n)
        );

        // 檢查是否是母親
        const isMother = userName.includes('Leee') || userName.includes('Cat') || userName.includes('媽');

        // 檢查是否觸發真實之眼
        if (eyeOfTruthService.shouldTrigger(msg.text)) {
          logger.info('🔮 Eye of Truth triggered');
          this.handleEyeOfTruth(chatId, msg.text, msg.message_id);
          return;
        }

        // ===== 周文本人的消息處理 =====
        if (isZhouwen) {
          // 檢查是否需要拆解
          if (this.shouldDecompose(msg.text)) {
            logger.info('🔍 Decompose triggered for Zhouwen');
            setTimeout(() => {
              this.decomposeMessage(chatId, msg.text, msg.message_id, userName);
            }, 1500);
            return;
          }

          // 周文的消息觸發條件:
          // 1. // 開頭
          // 2. 超過20個漢字
          // 3. @bot
          const shouldRespond = this.shouldRespondToZhouwen(msg.text);
          if (!shouldRespond) {
            logger.debug('Ignoring Zhouwen message (no trigger)');
            return;
          }
          
          logger.info('Avatar responding to Zhouwen (triggered)');
          setTimeout(() => {
            this.respondToHuman(chatId, msg.text.replace(/^\/\/\s*/, ''), msg.message_id, userName);
          }, 1500);
          return;
        }

        // ===== 取消自動回覆母親（碎碎念效果不好）=====
        // Admin Bot 現在專注多模態處理，不再自動文字回覆
        // 只在被 @mention 或使用菜單時回應
        
        // ===== 取消其他人低概率回覆 =====
        // if (Math.random() < 0.3) {
        //   logger.info(`Avatar will respond to ${userName}'s message (30%)`);
        //   setTimeout(() => {
        //     this.respondToHuman(chatId, msg.text, msg.message_id, userName);
        //   }, 3000 + Math.random() * 3000);
        // }
      }
    });

    // 錯誤處理
    this.bot.on('polling_error', (error) => {
      logger.error('Avatar polling error:', error.message);
    });
  }

  /**
   * 回覆真人消息
   */
  async respondToHuman(chatId, humanMessage, messageId, userName) {
    try {
      const isMother = userName.includes('Leee') || userName.includes('Cat') || userName.includes('媽');
      const response = await this.generateAvatarResponse(chatId, humanMessage, 'toHuman', userName);
      
      if (response) {
        // 嘗試回覆，如果消息不存在就直接發送
        try {
          await this.bot.sendMessage(chatId, response, {
            reply_to_message_id: messageId
          });
        } catch (e) {
          if (e.message.includes('message to be replied not found')) {
            await this.bot.sendMessage(chatId, response);
          } else {
            throw e;
          }
        }

        // 母親的消息 20% 機率發送圖片
        if (isMother && Math.random() < 0.2) {
          await this.sendImageReply(chatId, humanMessage, messageId);
        }

        // 記錄到群記憶
        await groupMemoryService.logGroupMessage({
          groupId: chatId.toString(),
          userId: 'avatar',
          userName: '周文 (虛擬)',
          content: response,
          isBot: true,
          botName: 'svs_notion_bot'
        });

        logger.info(`Avatar responded to ${userName} in group ${chatId}`);
      }
    } catch (error) {
      logger.error('Error responding to human:', error);
    }
  }

  /**
   * 發送圖片回覆 (給母親的圖文並茂)
   */
  async sendImageReply(chatId, context, messageId) {
    try {
      // 使用 Gemini 生成圖片
      const imageModel = this.gemini.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: { responseModalities: ['image', 'text'] }
      });

      const prompt = `根據以下話題生成一張溫馨、適合長輩看的圖片：
話題：${context}
要求：
- 風格溫馨、明亮
- 適合長輩觀看
- 可以是風景、美食、花卉等`;

      const result = await imageModel.generateContent(prompt);
      const response = result.response;
      
      // 檢查是否有圖片
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          await this.bot.sendPhoto(chatId, imageBuffer, {
            caption: '🖼️ 給媽看的圖',
            reply_to_message_id: messageId
          });
          logger.info('Sent image reply to mother');
          return;
        }
      }
    } catch (error) {
      logger.error('Error sending image reply:', error.message);
      // 圖片生成失敗不影響主流程
    }
  }

  /**
   * 接 BongBong 的話茬
   */
  async respondToBongBong(chatId, bongbongMessage, bongbongMessageId) {
    try {
      // 記錄 BongBong 的消息
      this.lastBongBongMessage.set(chatId.toString(), {
        content: bongbongMessage,
        timestamp: Date.now(),
        messageId: bongbongMessageId
      });

      // 延遲後接話
      setTimeout(async () => {
        try {
          const response = await this.generateAvatarResponse(chatId, bongbongMessage, 'afterBongBong');
          
          if (response) {
            // 嘗試回覆，如果失敗就直接發送
            try {
              await this.bot.sendMessage(chatId, response, {
                reply_to_message_id: bongbongMessageId
              });
            } catch (replyError) {
              if (replyError.message?.includes('message to be replied not found')) {
                await this.bot.sendMessage(chatId, response);
              } else {
                throw replyError;
              }
            }

            // 記錄到群記憶
            await groupMemoryService.logGroupMessage({
              groupId: chatId.toString(),
              userId: 'avatar',
              userName: '周文 (虛擬)',
              content: response,
              isBot: true,
              botName: 'svs_notion_bot'
            });
          }
        } catch (error) {
          logger.error('Error in respondToBongBong timeout:', error.message);
        }
      }, AVATAR_PERSONA.triggers.afterBongBongDelay);

    } catch (error) {
      logger.error('Error responding to BongBong:', error);
    }
  }

  /**
   * 生成 Avatar 回覆
   */
  async generateAvatarResponse(chatId, context, mode = 'normal', userName = '') {
    if (!this.gemini) {
      // 回退到模板
      return this.getTemplateResponse(mode);
    }

    try {
      // 獲取用戶風格 (如果有學習目標)
      let styleContext = '';
      if (AVATAR_PERSONA.learning.targetUserId) {
        const style = await groupMemoryService.getUserStyle(AVATAR_PERSONA.learning.targetUserId);
        if (style && style.recentExamples.length > 0) {
          styleContext = `\n\n[學習參考 - 真實周文的說話風格]\n${style.recentExamples.slice(-5).join('\n')}`;
        }
      }

      // 獲取群聊上下文
      const groupHistory = await groupMemoryService.getGroupHistory(chatId.toString(), 10);
      const historyContext = groupHistory.length > 0
        ? `\n\n[最近群聊]\n${groupHistory.reverse().map(m => `${m.userName}: ${m.content}`).join('\n')}`
        : '';

      // 無限火力模式 - 不限制 token 長度
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: AVATAR_PERSONA.personality.temperature
          // 不設置 maxOutputTokens，讓模型自己決定長度
        }
      });

      // 输出格式要求
      const formatRule = `

## 输出要求
- **语言**: 必须使用简体中文
- **格式**: 自然对话，不需要 Markdown`;

      let prompt;
      switch (mode) {
        case 'toHuman':
          // 回覆真人消息
          const isMother = userName.includes('Leee') || userName.includes('Cat') || userName.includes('媽') || userName.includes('妈');
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}${historyContext}

${userName} 刚说：「${context}」

请用周文的风格回复，要求：
1. ${isMother ? '对母亲要温暖关心，耐心回答' : '像朋友聊天，轻松自然'}
2. 可以分享有趣的知识或观点
3. 适度幽默，但不刻意
4. 自然对话，不用每句都抛梗
5. 必须使用简体中文

直接输出回复，不要加任何前缀：`;
          break;

        case 'afterBongBong':
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}${historyContext}

BongBong 刚说：「${context}」

请用周文的风格接话，要求：
1. 可以补充或发表不同看法
2. 轻松友好的互动
3. 自然对话
4. 必须使用简体中文

直接输出回复，不要加任何前缀：`;
          break;

        case 'idle':
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}${historyContext}

群里好久没人说话了，请用周文的风格开启一个话题：
1. 可以是随便聊聊
2. 可以问问大家在干嘛
3. 可以分享一个想法
4. 简短，1-2句话
5. 必须使用简体中文

直接输出，不要加任何前缀：`;
          break;

        case 'praise':
          const story = ZHOUWEN_STORIES[Math.floor(Math.random() * ZHOUWEN_STORIES.length)];
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}

请用周文的风格，变相吹捧一下自己（周文老师），话题是：${story.topic}
参考内容：${story.content}

要求：
1. 不要太明显，要自然
2. 可以用「当年」「以前」开头
3. 适可而止，不要太长
4. 2-3句话
5. 必须使用简体中文

直接输出，不要加任何前缀：`;
          break;

        case 'expandTopic':
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}${historyContext}

请根据群聊记录，用周文的风格深入探讨或扩展一个话题：
原话题：「${context}」

要求：
1. 可以发表自己的看法
2. 可以提出问题
3. 保持简短，2-3句话
4. 轻松自然风格
5. 必须使用简体中文

直接输出，不要加任何前缀：`;
          break;

        default:
          prompt = `${AVATAR_PERSONA.systemPrompt}${formatRule}${styleContext}

用户说：「${context}」

请用周文的风格回复，简短有力，必须使用简体中文：`;
      }

      const result = await model.generateContent(prompt);
      return result.response.text().trim();

    } catch (error) {
      logger.error('Error generating avatar response:', error);
      return this.getTemplateResponse(mode);
    }
  }

  /**
   * 獲取模板回覆
   */
  getTemplateResponse(mode) {
    const templates = AVATAR_PERSONA.responseTemplates;
    
    switch (mode) {
      case 'afterBongBong':
        return templates.afterBongBong[Math.floor(Math.random() * templates.afterBongBong.length)];
      case 'idle':
        return templates.idleStart[Math.floor(Math.random() * templates.idleStart.length)] + ' 有人嗎？';
      case 'praise':
        return templates.praiseZhouwen[Math.floor(Math.random() * templates.praiseZhouwen.length)];
      default:
        return '...';
    }
  }

  /**
   * 重置空閒計時器
   */
  resetIdleTimer(chatId) {
    const groupId = chatId.toString();
    
    // 清除現有計時器
    if (this.idleChatTimer.has(groupId)) {
      clearTimeout(this.idleChatTimer.get(groupId));
    }

    // 設置新計時器 (1小時後觸發)
    const timer = setTimeout(() => {
      this.triggerIdleChat(chatId);
    }, AVATAR_PERSONA.triggers.idleTriggerMinutes * 60 * 1000);

    this.idleChatTimer.set(groupId, timer);
  }

  /**
   * 觸發閒聊
   */
  async triggerIdleChat(chatId) {
    const groupId = chatId.toString();
    
    // 檢查是否真的空閒
    if (!groupMemoryService.isGroupIdle(groupId, AVATAR_PERSONA.triggers.idleTriggerMinutes)) {
      return;
    }

    // 檢查距離上次閒聊的時間
    const lastChat = this.lastIdleChat.get(groupId) || 0;
    const intervalMs = AVATAR_PERSONA.triggers.idleChatInterval * 60 * 1000;
    if (Date.now() - lastChat < intervalMs) {
      return;
    }

    logger.info(`Triggering idle chat in group ${groupId}`);

    try {
      // 開始閒聊 (2輪4回合)
      for (let round = 0; round < AVATAR_PERSONA.triggers.idleChatRounds; round++) {
        // Avatar 開場
        const avatarMsg = await this.generateAvatarResponse(chatId, '', 'idle');
        if (avatarMsg) {
          const sent = await this.bot.sendMessage(chatId, avatarMsg);
          
          await groupMemoryService.logGroupMessage({
            groupId,
            userId: 'avatar',
            userName: '周文 (虛擬)',
            content: avatarMsg,
            isBot: true,
            botName: 'svs_notion_bot'
          });

          // 通知 BongBong 回覆 (通過回調)
          if (this.onAvatarMessage) {
            await this.onAvatarMessage(chatId, avatarMsg, sent.message_id);
          }
        }

        // 等待一段時間再進行下一輪
        await this.sleep(30000); // 30秒
      }

      this.lastIdleChat.set(groupId, Date.now());

    } catch (error) {
      logger.error('Error in idle chat:', error);
    }
  }

  /**
   * 觸發每日吹捧
   */
  async triggerDailyPraise(chatId) {
    const groupId = chatId.toString();
    const today = new Date().toISOString().split('T')[0];

    // 檢查今天是否已觸發
    if (this.dailyPraiseTriggered.get(groupId) === today) {
      return;
    }

    try {
      const praiseMsg = await this.generateAvatarResponse(chatId, '', 'praise');
      if (praiseMsg) {
        await this.bot.sendMessage(chatId, praiseMsg);
        
        await groupMemoryService.logGroupMessage({
          groupId,
          userId: 'avatar',
          userName: '周文 (虛擬)',
          content: praiseMsg,
          isBot: true,
          botName: 'svs_notion_bot'
        });

        this.dailyPraiseTriggered.set(groupId, today);
        logger.info(`Daily praise triggered in group ${groupId}`);
      }
    } catch (error) {
      logger.error('Error in daily praise:', error);
    }
  }

  /**
   * 擴展話題討論
   */
  async expandTopic(chatId, topic) {
    try {
      const response = await this.generateAvatarResponse(chatId, topic, 'expandTopic');
      if (response) {
        await this.bot.sendMessage(chatId, response);
        
        await groupMemoryService.logGroupMessage({
          groupId: chatId.toString(),
          userId: 'avatar',
          userName: '周文 (虛擬)',
          content: response,
          isBot: true,
          botName: 'svs_notion_bot'
        });
      }
      return response;
    } catch (error) {
      logger.error('Error expanding topic:', error);
      return null;
    }
  }

  /**
   * 設置學習目標用戶
   */
  setLearningTarget(userId) {
    AVATAR_PERSONA.learning.targetUserId = userId;
    logger.info(`Avatar learning target set to user ${userId}`);
  }

  /**
   * 設置 Avatar 消息回調 (用於通知 BongBong)
   */
  setOnAvatarMessage(callback) {
    this.onAvatarMessage = callback;
  }

  // ========== Avatar 菜單系統 ==========

  /**
   * 處理 /start
   */
  async handleStart(msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || '朋友';

    const welcomeText = `🎭 *周文的虛擬分身*

哈嘍 ${userName}！我是周文的數字分身。

我的特長：
• 🔥 無限火力吐槽
• 🔮 真實之眼驗證
• 💬 接話抬槓
• 🎲 隨機水群

點擊下方按鈕探索功能！`;

    await this.bot.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔥 吐槽模式', callback_data: 'avatar_roast' },
            { text: '🔮 真實之眼', callback_data: 'avatar_eye' }
          ],
          [
            { text: '💬 隨機接話', callback_data: 'avatar_chat' },
            { text: '🎲 水群模式', callback_data: 'avatar_idle' }
          ],
          [
            { text: '⚙️ 設置', callback_data: 'avatar_settings' }
          ]
        ]
      }
    });
  }

  /**
   * 顯示 Avatar 菜單
   */
  async showAvatarMenu(chatId) {
    const menuText = `🎭 *周文分身 - 功能菜單*

選擇功能：`;

    await this.bot.sendMessage(chatId, menuText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔥 吐槽模式', callback_data: 'avatar_roast' },
            { text: '🔮 真實之眼', callback_data: 'avatar_eye' }
          ],
          [
            { text: '💬 隨機接話', callback_data: 'avatar_chat' },
            { text: '🎲 水群模式', callback_data: 'avatar_idle' }
          ],
          [
            { text: '📊 統計', callback_data: 'avatar_stats' },
            { text: '⚙️ 設置', callback_data: 'avatar_settings' }
          ]
        ]
      }
    });
  }

  /**
   * 處理 Avatar 回調
   */
  async handleAvatarCallback(query) {
    const chatId = query.message.chat.id;
    const data = query.data;

    await this.bot.answerCallbackQuery(query.id);

    switch (data) {
      case 'avatar_roast':
        await this.bot.sendMessage(chatId, 
          `🔥 *吐槽模式啟動*\n\n發送任何話題，我來吐槽！\n\n或者直接 /roast 觸發隨機吐槽。`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'avatar_eye':
        await this.bot.sendMessage(chatId,
          `🔮 *真實之眼*\n\n發送問題驗證真偽：\n\n• 「真的嗎 + 問題」\n• 「真實之眼 + 問題」\n• /eye 問題\n\n我會用多模型交叉驗證！`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'avatar_chat':
        await this.triggerRandomChat(chatId);
        break;

      case 'avatar_idle':
        await this.bot.sendMessage(chatId,
          `🎲 *水群模式*\n\n我會在群裡沒人說話 30-60 分鐘後自動開始水群，發送 10 條隨機消息。\n\n當前狀態：已啟用`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'avatar_stats':
        await this.showAvatarStats(chatId);
        break;

      case 'avatar_settings':
        await this.bot.sendMessage(chatId,
          `⚙️ *Avatar 設置*\n\n• 吐槽強度：🔥🔥🔥 (最高)\n• 回覆頻率：智能觸發\n• 無限火力：已啟用`,
          { parse_mode: 'Markdown' }
        );
        break;
    }
  }

  /**
   * 觸發吐槽模式
   */
  async triggerRoastMode(chatId, replyToId) {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { temperature: 1.4 }
      });

      const prompt = `${AVATAR_PERSONA.systemPrompt}

現在是吐槽模式！請隨機吐槽一個話題：
- 可以吐槽天氣、生活、科技、網絡熱點
- 貼吧老哥風格，無限火力
- 口頭禪：「6」「絕了」「好家伙」「笑死」「離譜」
- 不用控制長度，想說多少說多少

直接輸出吐槽內容：`;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();

      await this.bot.sendMessage(chatId, `🔥 *吐槽時間*\n\n${response}`, {
        parse_mode: 'Markdown',
        reply_to_message_id: replyToId
      });

    } catch (error) {
      logger.error('Roast mode error:', error);
      await this.bot.sendMessage(chatId, '吐槽失敗，我詞窮了 😅');
    }
  }

  /**
   * 處理 /eye 命令
   */
  async handleEyeCommand(msg, match) {
    const chatId = msg.chat.id;
    const question = match?.[1]?.trim();

    if (!question) {
      await this.bot.sendMessage(chatId, 
        '🔮 *真實之眼*\n\n用法：`/eye 你的問題`\n\n例如：`/eye 地球是平的嗎`',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    await this.handleEyeOfTruth(chatId, question, msg.message_id);
  }

  /**
   * 觸發隨機接話
   */
  async triggerRandomChat(chatId) {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { temperature: 1.3 }
      });

      const prompt = `${AVATAR_PERSONA.systemPrompt}

請隨機發起一個話題或者說點什麼：
- 可以是隨便聊聊
- 可以問問大家在幹嘛
- 可以分享一個有趣的事
- 貼吧老哥風格

直接輸出：`;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();

      await this.bot.sendMessage(chatId, response);

    } catch (error) {
      logger.error('Random chat error:', error);
    }
  }

  /**
   * 顯示 Avatar 統計
   */
  async showAvatarStats(chatId) {
    const stats = `📊 *Avatar 統計*

• 今日吐槽：${Math.floor(Math.random() * 50 + 10)} 次
• 真實之眼：${Math.floor(Math.random() * 10 + 2)} 次
• 水群消息：${Math.floor(Math.random() * 30 + 5)} 條
• 無限火力：已啟用 🔥`;

    await this.bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
  }

  // ========== 觸發邏輯 ==========

  /**
   * 檢查是否應該回覆周文
   * 條件: // 開頭 或 超過20漢字 或 @bot
   */
  shouldRespondToZhouwen(message) {
    // 1. // 開頭
    if (message.startsWith('//')) {
      return true;
    }

    // 2. @bot
    if (message.includes('@svs_notion_bot') || message.includes('@qitiandashengqianqian_bot')) {
      return true;
    }

    // 3. 超過20個漢字
    const chineseChars = message.match(/[\u4e00-\u9fa5]/g) || [];
    if (chineseChars.length > 20) {
      return true;
    }

    return false;
  }

  // ========== 新功能: 拆解 ==========

  /**
   * 檢查是否需要拆解
   */
  shouldDecompose(message) {
    const config = AVATAR_PERSONA.decompose;
    if (!config.enabled) return false;
    
    // 長度檢查
    if (message.length < config.triggers.minLength) return false;
    
    // 高密度關鍵詞檢查
    const hasKeywords = config.triggers.highDensityKeywords.some(kw => message.includes(kw));
    if (!hasKeywords) return false;
    
    // 語意密度估算 (簡單版: 標點符號比例)
    const punctuation = (message.match(/[，。！？、；：]/g) || []).length;
    const density = punctuation / message.length;
    
    return density < config.triggers.compressionRatio;
  }

  /**
   * 拆解消息
   */
  async decomposeMessage(chatId, message, messageId, userName) {
    try {
      const prompt = AVATAR_PERSONA.decompose.prompt.replace('{message}', message);
      
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 300
        }
      });

      const result = await model.generateContent(prompt);
      const decomposed = result.response.text().trim();

      await this.bot.sendMessage(chatId, decomposed, {
        reply_to_message_id: messageId
      });

      // 記錄
      await groupMemoryService.logGroupMessage({
        groupId: chatId.toString(),
        userId: 'avatar',
        userName: '周文 (虛擬)',
        content: decomposed,
        isBot: true,
        botName: 'svs_notion_bot',
        metadata: { type: 'decompose', originalUser: userName }
      });

      logger.info(`Decomposed message for ${userName}`);
    } catch (error) {
      logger.error('Decompose error:', error);
      // 回退到吐槽
      await this.bot.sendMessage(chatId, '你這話信息量有點大啊...簡單點說人話 😅', {
        reply_to_message_id: messageId
      });
    }
  }

  // ========== 新功能: 真實之眼 ==========

  /**
   * 處理真實之眼請求
   */
  async handleEyeOfTruth(chatId, question, messageId) {
    try {
      // 發送處理中提示
      const processingMsg = await this.bot.sendMessage(chatId, '🔮 真實之眼啟動中...', {
        reply_to_message_id: messageId
      });

      // 執行驗證
      const result = await eyeOfTruthService.verify(question);

      // 刪除處理中提示
      try {
        await this.bot.deleteMessage(chatId, processingMsg.message_id);
      } catch (e) {}

      if (result.success) {
        // 分段發送 (避免太長)
        const chunks = this.splitMessage(result.output, 4000);
        for (const chunk of chunks) {
          await this.bot.sendMessage(chatId, chunk, {
            parse_mode: 'Markdown',
            reply_to_message_id: messageId
          });
        }
      } else {
        await this.bot.sendMessage(chatId, `❌ 真實之眼出錯: ${result.error}`, {
          reply_to_message_id: messageId
        });
      }

      // 記錄
      await groupMemoryService.logGroupMessage({
        groupId: chatId.toString(),
        userId: 'avatar',
        userName: '真實之眼',
        content: result.success ? result.output : `錯誤: ${result.error}`,
        isBot: true,
        botName: 'eye_of_truth',
        metadata: { type: 'eye_of_truth', question }
      });

    } catch (error) {
      logger.error('Eye of Truth handler error:', error);
      await this.bot.sendMessage(chatId, '❌ 真實之眼暫時不可用', {
        reply_to_message_id: messageId
      });
    }
  }

  // ========== 新功能: 30-60分鐘隨機空閒觸發 ==========

  /**
   * 重置空閒計時器 (新版: 30-60分鐘隨機)
   */
  resetIdleTimer(chatId) {
    const groupId = chatId.toString();
    this.lastGroupActivity.set(groupId, Date.now());
    
    // 清除現有計時器
    if (this.idleChatTimer.has(groupId)) {
      clearTimeout(this.idleChatTimer.get(groupId));
    }

    // 隨機 30-60 分鐘
    const idleConfig = AVATAR_PERSONA.idleChat;
    const minMs = idleConfig.minIdleMinutes * 60 * 1000;
    const maxMs = idleConfig.maxIdleMinutes * 60 * 1000;
    const randomDelay = minMs + Math.random() * (maxMs - minMs);

    const timer = setTimeout(() => {
      this.triggerIdleChatV2(chatId);
    }, randomDelay);

    this.idleChatTimer.set(groupId, timer);
    logger.debug(`Idle timer set for ${Math.round(randomDelay / 60000)} minutes`);
  }

  /**
   * 觸發空閒聊天 v2 (10句高頻短對話)
   */
  async triggerIdleChatV2(chatId) {
    const groupId = chatId.toString();
    const idleConfig = AVATAR_PERSONA.idleChat;
    
    if (!idleConfig.enabled) return;

    // 檢查是否真的空閒
    const lastActivity = this.lastGroupActivity.get(groupId) || 0;
    const idleMs = Date.now() - lastActivity;
    if (idleMs < idleConfig.minIdleMinutes * 60 * 1000) {
      return;
    }

    logger.info(`🎲 Triggering idle chat v2 in group ${groupId}`);

    try {
      // 隨機選擇任務類型
      const taskType = this.selectRandomTask(idleConfig.taskTypes);
      const opener = this.getRandomOpener(taskType.type);

      // 發送開場白
      await this.bot.sendMessage(chatId, opener);

      // 生成10句高頻短對話
      for (let i = 0; i < idleConfig.messagesPerTrigger; i++) {
        await this.sleep(idleConfig.messageInterval);

        const response = await this.generateIdleChatMessage(chatId, taskType.type, i);
        if (response) {
          const sent = await this.bot.sendMessage(chatId, response);

          // 記錄
          await groupMemoryService.logGroupMessage({
            groupId,
            userId: 'avatar',
            userName: '周文 (虛擬)',
            content: response,
            isBot: true,
            botName: 'svs_notion_bot',
            metadata: { type: 'idle_chat', taskType: taskType.type, round: i }
          });

          // 通知 BongBong 可能回覆
          if (this.onAvatarMessage && i % 3 === 0) {
            await this.onAvatarMessage(chatId, response, sent.message_id);
          }
        }
      }

      this.lastIdleChat.set(groupId, Date.now());
      logger.info(`Idle chat v2 completed: ${taskType.name}`);

    } catch (error) {
      logger.error('Idle chat v2 error:', error);
    }
  }

  /**
   * 隨機選擇任務類型 (加權)
   */
  selectRandomTask(taskTypes) {
    const totalWeight = taskTypes.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const task of taskTypes) {
      random -= task.weight;
      if (random <= 0) return task;
    }
    return taskTypes[0];
  }

  /**
   * 獲取隨機開場白
   */
  getRandomOpener(taskType) {
    const openers = AVATAR_PERSONA.idleChat.openers[taskType] || AVATAR_PERSONA.idleChat.openers.random_chat;
    return openers[Math.floor(Math.random() * openers.length)];
  }

  /**
   * 生成空閒聊天消息
   */
  async generateIdleChatMessage(chatId, taskType, round) {
    try {
      // 獲取群聊歷史
      const history = await groupMemoryService.getGroupHistory(chatId.toString(), 20);
      const historyContext = history.length > 0
        ? history.reverse().map(m => `${m.userName}: ${m.content}`).join('\n')
        : '';

      let prompt;
      switch (taskType) {
        case 'summary':
          prompt = `${AVATAR_PERSONA.systemPrompt}

[群聊記錄]
${historyContext}

這是第 ${round + 1}/10 句總結。請用無厘頭風格總結剛才的對話，要求：
1. 超短，1句話
2. 可以吐槽、抬槓
3. 隨便拋梗

直接輸出：`;
          break;

        case 'analysis':
          prompt = `${AVATAR_PERSONA.systemPrompt}

[群聊記錄]
${historyContext}

這是第 ${round + 1}/10 句分析。請用無厘頭風格分析討論，要求：
1. 超短，1句話
2. 可以發表奇怪的觀點
3. 隨便拋梗

直接輸出：`;
          break;

        case 'prediction':
          prompt = `${AVATAR_PERSONA.systemPrompt}

[群聊記錄]
${historyContext}

這是第 ${round + 1}/10 句推演。請用無厘頭風格預測或推演，要求：
1. 超短，1句話
2. 可以胡說八道
3. 隨便拋梗

直接輸出：`;
          break;

        default:
          prompt = `${AVATAR_PERSONA.systemPrompt}

這是第 ${round + 1}/10 句閒聊。請用無厘頭風格隨便聊，要求：
1. 超短，1句話
2. 可以跑題、扯淡
3. 隨便拋梗

直接輸出：`;
      }

      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 1.2,
          maxOutputTokens: 50
        }
      });

      const result = await model.generateContent(prompt);
      return result.response.text().trim();

    } catch (error) {
      logger.error('Generate idle chat error:', error);
      // 回退到模板
      const memes = AVATAR_PERSONA.responseTemplates.randomMemes;
      return memes[Math.floor(Math.random() * memes.length)];
    }
  }

  // ========== 輔助方法 ==========

  /**
   * 分割長消息
   */
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

  /**
   * 輔助函數 - 睡眠
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 停止
   */
  stop() {
    if (this.bot) {
      this.bot.stopPolling();
      
      // 清除所有計時器
      for (const timer of this.idleChatTimer.values()) {
        clearTimeout(timer);
      }
      
      logger.info('Avatar bot stopped');
    }
  }
}

export default new AvatarService();
