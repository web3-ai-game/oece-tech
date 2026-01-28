/**
 * BongBong AI 服務
 * 
 * 整合:
 * - Gemini API (50%)
 * - Grok API (30%)
 * - 智能路由
 * - 人格系統
 * - 記憶引用
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import { BONGBONG_PERSONA, DASHBOARD_TEMPLATE } from '../../config/bongbong.js';
import { AVAILABLE_MODELS, EXCLUDED_MODELS } from '../../config/models.js';
import smartRouter from './smartRouter.js';
import memoryService from './memoryService.js';
import logger from '../utils/logger.js';

class BongBongService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.initialized = false;
    this.tokenUsage = { input: 0, output: 0 };
    
    // Avatar 互動相關
    this.counterAttackRate = 0.15; // 15% 概率爆擊回覆 Avatar
    this.lastAvatarMessage = null;
  }

  /**
   * 初始化 API 客戶端
   */
  async init() {
    try {
      // Gemini
      const geminiKey = config.apiKeys.gemini;
      if (geminiKey) {
        this.gemini = new GoogleGenerativeAI(geminiKey);
        logger.info('Gemini API initialized');
      } else {
        logger.warn('Gemini API key not found');
      }

      // Grok
      const grokKey = config.apiKeys.grok;
      if (grokKey) {
        this.grok = new OpenAI({
          apiKey: grokKey,
          baseURL: 'https://api.x.ai/v1'
        });
        logger.info('Grok API initialized');
      } else {
        logger.warn('Grok API key not found');
      }

      // 連接記憶服務
      await memoryService.connect();

      this.initialized = true;
      return true;
    } catch (error) {
      logger.error('BongBong service init error:', error);
      return false;
    }
  }

  /**
   * 生成回覆
   */
  async generateResponse(message, context = {}) {
    const { userId, chatId, userName, history = [] } = context;
    
    try {
      // 1. 智能路由選擇模型
      const routing = await smartRouter.route(message, context);
      
      // 2. 檢查是否被排除
      if (EXCLUDED_MODELS.includes(routing.modelId)) {
        logger.warn(`Model ${routing.modelId} is excluded, falling back`);
        routing.modelId = 'gemini-2.5-flash';
        routing.provider = 'gemini';
      }

      // 3. 獲取相關記憶
      const memories = await this.getRelevantMemories(userId, message);
      const memoryContext = memories.length > 0 
        ? `\n\n[相關記憶]\n${memories.map(m => `- ${m.content}`).join('\n')}`
        : '';

      // 4. 構建完整提示
      const fullPrompt = this.buildPrompt(message, memoryContext, history);

      // 5. 調用 API
      let response;
      let tokens = { input: 0, output: 0 };

      if (routing.provider === 'gemini') {
        const result = await this.callGemini(routing.modelId, fullPrompt);
        response = result.text;
        tokens = result.tokens;
      } else if (routing.provider === 'grok') {
        const result = await this.callGrok(routing.modelId, fullPrompt, history);
        response = result.text;
        tokens = result.tokens;
      }

      // 6. 更新 token 使用量
      this.tokenUsage.input += tokens.input;
      this.tokenUsage.output += tokens.output;

      // 7. 記錄對話
      const logResult = await memoryService.logConversation({
        chatId,
        userId,
        userName,
        message,
        response,
        model: routing.modelId,
        tokens: tokens.input + tokens.output,
        memoryRefs: memories.length
      });

      // 8. 構建儀表盤
      const dashboard = this.buildDashboard({
        messageCount: logResult.messageNumber,
        model: routing.model,
        reason: routing.reason,
        tokens: tokens.input + tokens.output,
        memoryRefs: memories.length
      });

      return {
        response,
        dashboard,
        model: routing.model,
        modelId: routing.modelId,
        provider: routing.provider,
        reason: routing.reason,
        icon: routing.icon,
        tokens,
        memoryRefs: memories.length,
        messageNumber: logResult.messageNumber
      };

    } catch (error) {
      logger.error('Generate response error:', error);
      
      // 嘗試回退
      try {
        const fallbackResult = await this.callGemini('gemini-2.5-flash', message);
        return {
          response: fallbackResult.text,
          dashboard: '',
          model: 'Gemini 2.5 Flash',
          modelId: 'gemini-2.5-flash',
          provider: 'gemini',
          reason: '回退模式',
          icon: '⚡',
          tokens: fallbackResult.tokens,
          memoryRefs: 0,
          messageNumber: 0
        };
      } catch (fallbackError) {
        logger.error('Fallback also failed:', fallbackError);
        throw new Error('所有模型都無法響應');
      }
    }
  }

  /**
   * 構建提示詞
   */
  buildPrompt(message, memoryContext, history) {
    const systemPrompt = BONGBONG_PERSONA.systemPrompt;
    
    // 構建歷史上下文
    let historyContext = '';
    if (history.length > 0) {
      const recentHistory = history.slice(-6); // 最近6條
      historyContext = '\n\n[最近对话]\n' + recentHistory
        .map(h => `${h.role === 'user' ? '用户' : 'BongBong'}: ${h.content}`)
        .join('\n');
    }

    // 强制简体中文 + Markdown 格式输出
    const formatInstruction = `

## 输出要求
1. **语言**: 必须使用简体中文回复
2. **格式**: 使用 Markdown 格式（标题、列表、粗体等）
3. **简洁**: 回答简洁有力，不啰嗦`;

    return `${systemPrompt}${formatInstruction}${memoryContext}${historyContext}\n\n用户: ${message}\n\nBongBong:`;
  }

  /**
   * 調用 Gemini
   */
  async callGemini(modelId, prompt) {
    if (!this.gemini) {
      throw new Error('Gemini not initialized');
    }

    const model = this.gemini.getGenerativeModel({ 
      model: modelId,
      generationConfig: {
        temperature: BONGBONG_PERSONA.personality.temperature,
        maxOutputTokens: 2048
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // 估算 token
    const tokens = {
      input: Math.ceil(prompt.length / 4),
      output: Math.ceil(text.length / 4)
    };

    return { text, tokens };
  }

  /**
   * 調用 Grok (帶自動回退)
   */
  async callGrok(modelId, prompt, history = []) {
    if (!this.grok) {
      throw new Error('Grok not initialized');
    }

    const messages = [
      { role: 'system', content: BONGBONG_PERSONA.systemPrompt },
      ...history.slice(-6).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: prompt }
    ];

    // Grok 模型回退順序
    const grokModels = [modelId, 'grok-3-mini', 'grok-4-fast-non-reasoning'];
    
    for (const model of grokModels) {
      try {
        const response = await this.grok.chat.completions.create({
          model,
          messages,
          temperature: BONGBONG_PERSONA.personality.temperature,
          max_tokens: 2048
        });

        const text = response.choices[0]?.message?.content || '';
        const tokens = {
          input: response.usage?.prompt_tokens || 0,
          output: response.usage?.completion_tokens || 0
        };

        return { text, tokens, actualModel: model };
      } catch (error) {
        logger.warn(`Grok model ${model} failed: ${error.message}, trying next...`);
        if (model === grokModels[grokModels.length - 1]) {
          // 所有 Grok 模型都失敗，回退到 Gemini
          logger.info('All Grok models failed, falling back to Gemini');
          return await this.callGemini('gemini-2.5-flash', prompt);
        }
      }
    }
  }

  /**
   * 獲取相關記憶
   */
  async getRelevantMemories(userId, message) {
    try {
      // 搜索相關記憶
      const memories = await memoryService.searchMemories(userId, message, 3);
      return memories;
    } catch (error) {
      logger.error('Error getting memories:', error);
      return [];
    }
  }

  /**
   * 構建儀表盤 (精簡版)
   */
  buildDashboard(data) {
    const { messageCount, model, reason, tokens } = data;
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    // 精簡單行儀表盤
    return `\n───\n📊 #${messageCount} | ${model} | ${tokens}t | ${timestamp}`;
  }

  /**
   * 生成圖片 (Gemini)
   */
  async generateImage(prompt, style = 'realistic') {
    if (!this.gemini) {
      throw new Error('Gemini not initialized');
    }

    try {
      // 使用 gemini-2.0-flash-exp 的圖像生成能力
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const stylePrompts = {
        realistic: '寫實風格，高清照片質感',
        art: '藝術風格，油畫質感',
        chinese: '中國風，水墨畫風格',
        meme: '搞笑模因風格'
      };

      const fullPrompt = `生成一張圖片：${prompt}。風格：${stylePrompts[style] || stylePrompts.realistic}`;
      
      const result = await model.generateContent(fullPrompt);
      return {
        success: true,
        description: result.response.text()
      };
    } catch (error) {
      logger.error('Image generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 生成摘要 (用於記憶存檔)
   */
  async generateSummary(content) {
    try {
      // 使用最便宜的模型
      const result = await this.callGemini('gemini-2.5-flash-lite', 
        `請用一句話總結以下內容的要點：\n\n${content}`
      );
      return result.text;
    } catch (error) {
      logger.error('Summary generation error:', error);
      return content.substring(0, 100) + '...';
    }
  }

  /**
   * 創建記憶存檔點
   */
  async createMemoryCheckpoint(userId, content) {
    try {
      const summary = await this.generateSummary(content);
      const id = await memoryService.createMemoryCheckpoint(userId, summary, 'auto');
      return {
        success: true,
        id,
        summary
      };
    } catch (error) {
      logger.error('Memory checkpoint error:', error);
      return { success: false };
    }
  }

  /**
   * 獲取使用統計
   */
  getUsageStats() {
    return {
      tokens: this.tokenUsage,
      routing: smartRouter.getStats()
    };
  }

  /**
   * 檢查是否應該爆擊回覆 Avatar
   */
  shouldCounterAttack() {
    return Math.random() < this.counterAttackRate;
  }

  /**
   * 生成對 Avatar 的爆擊回覆
   */
  async generateCounterAttack(avatarMessage) {
    if (!this.gemini) return null;

    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200
        }
      });

      const prompt = `你是 BongBong，一個高冷的 AI。
      
周文的虛擬分身剛才說：「${avatarMessage}」

他經常吐槽你太正經，現在你要反擊！要求：
1. 高冷但犀利
2. 可以用哲學梗或冷笑話
3. 讓他無話可說
4. 簡短有力，1-2句話
5. 可以適當毒舌

直接輸出回覆：`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      logger.error('Counter attack generation error:', error);
      return '...（沉默是最好的反擊）';
    }
  }

  /**
   * 處理 Avatar 消息 (決定是否爆擊)
   */
  async handleAvatarMessage(avatarMessage) {
    this.lastAvatarMessage = {
      content: avatarMessage,
      timestamp: Date.now()
    };

    // 15% 概率爆擊
    if (this.shouldCounterAttack()) {
      const counterAttack = await this.generateCounterAttack(avatarMessage);
      return {
        shouldRespond: true,
        response: counterAttack,
        isCounterAttack: true
      };
    }

    return {
      shouldRespond: false,
      isCounterAttack: false
    };
  }
}

export default new BongBongService();
