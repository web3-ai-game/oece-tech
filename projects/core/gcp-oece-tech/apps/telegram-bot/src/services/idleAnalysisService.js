/**
 * Idle Analysis Service - 閒置自動分析
 * 
 * 當群組 1 小時無活動時，兩個 Bot 自動分析對話：
 * - BongBong: Gemini 2.0 Flash Lite (語意分析)
 * - Admin: Grok 3 Mini (輿論補充)
 * 
 * 分析結果向量化存入記憶，不發送消息
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import groupMemoryService from './groupMemoryService.js';
import smartMemoryService from './smartMemoryService.js';
import logger from '../utils/logger.js';

// 閒置時間閾值 (毫秒)
const IDLE_THRESHOLD = 60 * 60 * 1000; // 1 小時
const CHECK_INTERVAL = 5 * 60 * 1000;  // 每 5 分鐘檢查一次

class IdleAnalysisService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.lastActivity = new Map();      // groupId -> timestamp
    this.lastAnalysis = new Map();      // groupId -> timestamp
    this.checkTimer = null;
    this.isInitialized = false;
  }

  /**
   * 初始化服務
   */
  async init() {
    try {
      const geminiKey = config.apiKeys.gemini;
      const grokKey = config.apiKeys.grok;

      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        // 使用最便宜的模型
        this.gemini = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-lite',
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        });
      }

      if (grokKey) {
        this.grok = new OpenAI({
          apiKey: grokKey,
          baseURL: 'https://api.x.ai/v1'
        });
      }

      // 啟動定時檢查
      this.startIdleCheck();

      this.isInitialized = true;
      logger.info('IdleAnalysis: Service initialized');
      return true;
    } catch (error) {
      logger.error('IdleAnalysis: Init error:', error);
      return false;
    }
  }

  /**
   * 記錄群組活動
   */
  recordActivity(groupId) {
    this.lastActivity.set(groupId.toString(), Date.now());
  }

  /**
   * 啟動閒置檢查
   */
  startIdleCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    this.checkTimer = setInterval(() => {
      this.checkIdleGroups();
    }, CHECK_INTERVAL);

    logger.info('IdleAnalysis: Idle check started (interval: 5min)');
  }

  /**
   * 檢查閒置群組
   */
  async checkIdleGroups() {
    const now = Date.now();

    for (const [groupId, lastTime] of this.lastActivity.entries()) {
      const idleTime = now - lastTime;
      const lastAnalysisTime = this.lastAnalysis.get(groupId) || 0;
      const timeSinceAnalysis = now - lastAnalysisTime;

      // 如果閒置超過 1 小時，且距離上次分析超過 1 小時
      if (idleTime >= IDLE_THRESHOLD && timeSinceAnalysis >= IDLE_THRESHOLD) {
        logger.info(`IdleAnalysis: Group ${groupId} idle for ${Math.round(idleTime / 60000)} min, starting analysis...`);
        await this.analyzeGroup(groupId);
        this.lastAnalysis.set(groupId, now);
      }
    }
  }

  /**
   * 分析群組對話
   */
  async analyzeGroup(groupId) {
    try {
      // 獲取最近對話
      const recentMessages = await groupMemoryService.getRecentMessages(groupId, 50);
      
      if (!recentMessages || recentMessages.length < 5) {
        logger.debug(`IdleAnalysis: Not enough messages in group ${groupId}`);
        return;
      }

      // 格式化對話
      const conversation = recentMessages.map(m => 
        `${m.userName}: ${m.content}`
      ).join('\n');

      // 並行分析
      const [geminiAnalysis, grokAnalysis] = await Promise.allSettled([
        this.analyzeWithGemini(conversation),
        this.analyzeWithGrok(conversation)
      ]);

      // 合併結果
      const results = {
        gemini: geminiAnalysis.status === 'fulfilled' ? geminiAnalysis.value : null,
        grok: grokAnalysis.status === 'fulfilled' ? grokAnalysis.value : null,
        timestamp: new Date(),
        groupId
      };

      // 存入記憶 (向量化)
      await this.saveAnalysisToMemory(groupId, results);

      logger.info(`IdleAnalysis: Completed for group ${groupId}`);
    } catch (error) {
      logger.error(`IdleAnalysis: Error analyzing group ${groupId}:`, error);
    }
  }

  /**
   * Gemini 分析 (語意、情感、主題)
   */
  async analyzeWithGemini(conversation) {
    if (!this.gemini) return null;

    const prompt = `分析以下群聊對話，提取關鍵信息：

對話內容：
${conversation}

請簡潔輸出：
1. 主要話題 (1-3個)
2. 情感傾向 (正面/中性/負面)
3. 關鍵人物觀點摘要
4. 值得記住的信息點

格式：JSON`;

    try {
      const result = await this.gemini.generateContent(prompt);
      const text = result.response.text();
      
      // 嘗試解析 JSON
      try {
        return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      } catch {
        return { raw: text };
      }
    } catch (error) {
      logger.error('IdleAnalysis: Gemini error:', error.message);
      return null;
    }
  }

  /**
   * Grok 分析 (輿論、補充觀點)
   */
  async analyzeWithGrok(conversation) {
    if (!this.grok) return null;

    try {
      const response = await this.grok.chat.completions.create({
        model: 'grok-3-mini',
        messages: [
          {
            role: 'system',
            content: '你是一個輿論分析師，擅長從對話中發現隱藏的觀點和情緒。'
          },
          {
            role: 'user',
            content: `分析以下群聊對話，補充 Gemini 可能遺漏的觀點：

對話內容：
${conversation}

請簡潔輸出：
1. 隱藏的情緒或擔憂
2. 未明說但暗示的需求
3. 可能的後續話題
4. 建議的回應策略

格式：JSON`
          }
        ],
        temperature: 0.5,
        max_tokens: 512
      });

      const text = response.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      } catch {
        return { raw: text };
      }
    } catch (error) {
      logger.error('IdleAnalysis: Grok error:', error.message);
      return null;
    }
  }

  /**
   * 保存分析結果到記憶
   */
  async saveAnalysisToMemory(groupId, results) {
    try {
      const summary = this.formatAnalysisSummary(results);
      
      // 使用 smartMemoryService 向量化存儲
      await smartMemoryService.storeMemory({
        userId: `group_${groupId}`,
        type: 'idle_analysis',
        content: summary,
        metadata: {
          gemini: results.gemini,
          grok: results.grok,
          timestamp: results.timestamp
        }
      });

      logger.debug(`IdleAnalysis: Saved to memory for group ${groupId}`);
    } catch (error) {
      logger.error('IdleAnalysis: Save to memory error:', error);
    }
  }

  /**
   * 格式化分析摘要
   */
  formatAnalysisSummary(results) {
    let summary = `閒置分析 | ${results.timestamp.toLocaleString()}\n\n`;

    if (results.gemini) {
      summary += `【Gemini 分析】\n`;
      if (results.gemini.raw) {
        summary += results.gemini.raw + '\n';
      } else {
        summary += `主題: ${JSON.stringify(results.gemini['主要話題'] || results.gemini.topics || [])}\n`;
        summary += `情感: ${results.gemini['情感傾向'] || results.gemini.sentiment || '未知'}\n`;
      }
    }

    if (results.grok) {
      summary += `\n【Grok 補充】\n`;
      if (results.grok.raw) {
        summary += results.grok.raw + '\n';
      } else {
        summary += `隱藏情緒: ${results.grok['隱藏的情緒或擔憂'] || results.grok.hiddenEmotions || '無'}\n`;
        summary += `建議策略: ${results.grok['建議的回應策略'] || results.grok.strategy || '無'}\n`;
      }
    }

    return summary;
  }

  /**
   * 手動觸發分析
   */
  async triggerAnalysis(groupId) {
    await this.analyzeGroup(groupId);
    this.lastAnalysis.set(groupId.toString(), Date.now());
  }

  /**
   * 獲取分析狀態
   */
  getStatus() {
    const groups = [];
    const now = Date.now();

    for (const [groupId, lastTime] of this.lastActivity.entries()) {
      const idleMinutes = Math.round((now - lastTime) / 60000);
      const lastAnalysisTime = this.lastAnalysis.get(groupId);
      const analysisMins = lastAnalysisTime ? Math.round((now - lastAnalysisTime) / 60000) : null;

      groups.push({
        groupId,
        idleMinutes,
        lastAnalysisMinutes: analysisMins,
        willAnalyze: idleMinutes >= 60 && (!analysisMins || analysisMins >= 60)
      });
    }

    return {
      initialized: this.isInitialized,
      trackedGroups: groups.length,
      groups
    };
  }

  /**
   * 停止服務
   */
  stop() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
    logger.info('IdleAnalysis: Service stopped');
  }
}

export default new IdleAnalysisService();
