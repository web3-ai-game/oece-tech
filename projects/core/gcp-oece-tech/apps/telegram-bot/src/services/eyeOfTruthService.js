/**
 * 真實之眼服務 - 多模型交叉驗證
 * 
 * 流程:
 * 1. Gemini 2.5 Pro (低溫 0.3) - 嚴謹分析
 * 2. Grok 3 Mini (高溫 1.35) - 擴散質疑
 * 3. Gemini 2.5 Flash (中溫 0.5) - 綜合總結
 * 
 * 直接使用 Gemini API + Grok API，不用 OpenRouter
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import { AVATAR_PERSONA } from '../../config/avatar.js';
import groupMemoryService from './groupMemoryService.js';
import logger from '../utils/logger.js';

class EyeOfTruthService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.initialized = false;
  }

  /**
   * 初始化
   */
  init() {
    // Gemini API - 直接使用
    const geminiKey = config.apiKeys.gemini;
    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey);
      logger.info('Eye of Truth: Gemini API initialized');
    }

    // Grok API - 直接使用
    const grokKey = config.apiKeys.grok;
    if (grokKey) {
      this.grok = new OpenAI({
        apiKey: grokKey,
        baseURL: 'https://api.x.ai/v1'
      });
      logger.info('Eye of Truth: Grok API initialized');
    }

    this.initialized = this.gemini && this.grok;
    return this.initialized;
  }

  /**
   * 檢查是否觸發真實之眼
   */
  shouldTrigger(message) {
    const keywords = AVATAR_PERSONA.eyeOfTruth.triggerKeywords;
    return keywords.some(kw => message.includes(kw));
  }

  /**
   * 執行真實之眼驗證
   */
  async verify(question, context = '') {
    if (!this.initialized) {
      this.init();
    }

    if (!this.gemini || !this.grok) {
      return { success: false, error: 'API not initialized' };
    }

    const eyeConfig = AVATAR_PERSONA.eyeOfTruth;
    
    try {
      logger.info('🔮 Eye of Truth activated');

      // 獲取向量記憶作為參考
      let memoryContext = '';
      try {
        const memories = await groupMemoryService.searchGroupMemories('all', question, 5);
        if (memories.length > 0) {
          memoryContext = '\n\n[相關記憶]\n' + memories.map(m => `- ${m.content}`).join('\n');
        }
      } catch (e) {
        logger.warn('Memory search failed:', e.message);
      }

      // Step 1: Gemini Pro 嚴謹分析 (低溫 0.3)
      const geminiAnalysis = await this.callGeminiPro(question, context + memoryContext);
      logger.info('✅ Gemini Pro analysis complete');

      // Step 2: Grok Mini 高溫質疑 (1.35)
      const grokChallenge = await this.callGrokMini(question, geminiAnalysis, context);
      logger.info('✅ Grok Mini challenge complete');

      // Step 3: Gemini Flash 總結 (0.5)
      const flashSummary = await this.callGeminiFlash(question, geminiAnalysis, grokChallenge);
      logger.info('✅ Flash summary complete');

      // 計算可信度
      const confidence = this.calculateConfidence(geminiAnalysis, grokChallenge, flashSummary);

      // 格式化輸出
      const output = eyeConfig.outputFormat
        .replace('{geminiAnalysis}', geminiAnalysis)
        .replace('{grokChallenge}', grokChallenge)
        .replace('{flashSummary}', flashSummary)
        .replace('{confidence}', confidence);

      // 記錄到向量庫
      await this.logVerification(question, output, confidence);

      return {
        success: true,
        output,
        details: {
          geminiAnalysis,
          grokChallenge,
          flashSummary,
          confidence
        }
      };

    } catch (error) {
      logger.error('Eye of Truth error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gemini 2.5 Pro - 嚴謹分析 (低溫)
   */
  async callGeminiPro(question, context) {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.3,  // 低溫，嚴謹
        maxOutputTokens: 500
      }
    });

    const prompt = `你是一個嚴謹的分析師。請對以下問題進行客觀、理性的分析。

問題：${question}

${context ? `背景信息：${context}` : ''}

要求：
1. 基於事實和邏輯分析
2. 指出可能的問題或風險
3. 給出初步結論
4. 保持簡潔，不超過200字`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }

  /**
   * Grok 3 Mini - 高溫質疑 (1.35)
   */
  async callGrokMini(question, geminiAnalysis, context) {
    const response = await this.grok.chat.completions.create({
      model: 'grok-3-mini',  // 便宜的 Grok (<$5/M)
      messages: [
        {
          role: 'system',
          content: `你是一個魔鬼代言人，專門質疑和挑戰觀點。你的任務是找出分析中的漏洞、偏見或遺漏。
          
風格：犀利、直接、不留情面，但有理有據。`
        },
        {
          role: 'user',
          content: `原問題：${question}

Gemini Pro 的分析：
${geminiAnalysis}

請質疑這個分析：
1. 找出可能的漏洞或偏見
2. 提出反面觀點
3. 指出遺漏的考慮因素
4. 保持簡潔，不超過200字`
        }
      ],
      temperature: 1.35,  // 高溫，擴散思考
      max_tokens: 500
    });

    return response.choices[0]?.message?.content?.trim() || '無法生成質疑';
  }

  /**
   * Gemini 2.5 Flash - 綜合總結
   */
  async callGeminiFlash(question, geminiAnalysis, grokChallenge) {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300
      }
    });

    const prompt = `你是一個公正的總結者。請綜合以下兩個觀點，給出最終結論。

原問題：${question}

分析觀點：
${geminiAnalysis}

質疑觀點：
${grokChallenge}

要求：
1. 綜合兩方觀點
2. 給出平衡的結論
3. 指出最可能的答案
4. 保持簡潔，不超過150字`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }

  /**
   * 計算可信度
   */
  calculateConfidence(analysis, challenge, summary) {
    // 簡單的可信度計算
    let confidence = 70; // 基礎可信度

    // 如果分析和質疑有共識，提高可信度
    const analysisKeywords = analysis.split(/\s+/).filter(w => w.length > 2);
    const challengeKeywords = challenge.split(/\s+/).filter(w => w.length > 2);
    const overlap = analysisKeywords.filter(w => challengeKeywords.includes(w)).length;
    
    if (overlap > 5) confidence += 10;
    if (overlap > 10) confidence += 10;

    // 如果總結明確，提高可信度
    if (summary.includes('確定') || summary.includes('可以確認')) confidence += 5;
    if (summary.includes('不確定') || summary.includes('難以判斷')) confidence -= 10;

    return Math.min(95, Math.max(30, confidence));
  }

  /**
   * 記錄驗證結果到向量庫
   */
  async logVerification(question, output, confidence) {
    try {
      await groupMemoryService.logGroupMessage({
        groupId: 'eye_of_truth',
        userId: 'system',
        userName: '真實之眼',
        content: `問題: ${question}\n\n結果: ${output}\n\n可信度: ${confidence}%`,
        isBot: true,
        botName: 'eye_of_truth',
        metadata: { type: 'verification', confidence }
      });
    } catch (e) {
      logger.warn('Failed to log verification:', e.message);
    }
  }
}

export default new EyeOfTruthService();
