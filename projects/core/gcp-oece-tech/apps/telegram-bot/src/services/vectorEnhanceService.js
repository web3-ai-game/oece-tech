/**
 * Vector Enhance Service - 向量增強服務
 * 
 * 功能:
 * - 每 50 句用戶輸入自動總結存入向量庫
 * - BongBong 回覆時 50% 機率引用向量庫資源
 * - 資源太少時不作為參考
 * - 可自動擴展思維方向寫入向量庫
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/index.js';
import smartMemoryService from './smartMemoryService.js';
import logger from '../utils/logger.js';

// 配置
const SUMMARY_THRESHOLD = 50;  // 每 50 句總結一次
const REFERENCE_PROBABILITY = 0.5;  // 50% 機率引用
const MIN_VECTOR_COUNT = 10;  // 最少向量數量才引用

class VectorEnhanceService {
  constructor() {
    this.gemini = null;
    this.messageCounters = new Map();  // groupId -> count
    this.messageBuffers = new Map();   // groupId -> messages[]
    this.isInitialized = false;
  }

  /**
   * 初始化
   */
  async init() {
    try {
      const geminiKey = config.apiKeys.gemini;
      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        this.gemini = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-lite',  // 最便宜的模型
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        });
      }

      this.isInitialized = true;
      logger.info('VectorEnhance: Service initialized');
      return true;
    } catch (error) {
      logger.error('VectorEnhance: Init error:', error);
      return false;
    }
  }

  /**
   * 記錄用戶消息
   */
  async recordMessage(groupId, userId, userName, content) {
    const key = groupId.toString();
    
    // 初始化計數器和緩衝區
    if (!this.messageCounters.has(key)) {
      this.messageCounters.set(key, 0);
      this.messageBuffers.set(key, []);
    }

    // 添加到緩衝區
    const buffer = this.messageBuffers.get(key);
    buffer.push({
      userId,
      userName,
      content,
      timestamp: new Date()
    });

    // 增加計數
    const count = this.messageCounters.get(key) + 1;
    this.messageCounters.set(key, count);

    // 達到閾值，觸發總結
    if (count >= SUMMARY_THRESHOLD) {
      logger.info(`VectorEnhance: Threshold reached for group ${key}, summarizing...`);
      await this.summarizeAndStore(key);
      
      // 重置
      this.messageCounters.set(key, 0);
      this.messageBuffers.set(key, []);
    }
  }

  /**
   * 總結並存入向量庫
   */
  async summarizeAndStore(groupId) {
    const buffer = this.messageBuffers.get(groupId);
    if (!buffer || buffer.length === 0) return;

    try {
      // 格式化對話
      const conversation = buffer.map(m => 
        `${m.userName}: ${m.content}`
      ).join('\n');

      // 使用 Gemini 總結
      const summary = await this.generateSummary(conversation);
      if (!summary) return;

      // 存入向量庫
      await smartMemoryService.storeMemory({
        userId: `group_${groupId}`,
        type: 'conversation_summary',
        content: summary.text,
        metadata: {
          topics: summary.topics,
          keyPoints: summary.keyPoints,
          messageCount: buffer.length,
          timeRange: {
            start: buffer[0].timestamp,
            end: buffer[buffer.length - 1].timestamp
          }
        }
      });

      logger.info(`VectorEnhance: Stored summary for group ${groupId}`);
    } catch (error) {
      logger.error('VectorEnhance: Summarize error:', error);
    }
  }

  /**
   * 生成總結
   */
  async generateSummary(conversation) {
    if (!this.gemini) return null;

    const prompt = `分析以下群聊對話，提取關鍵信息：

對話內容：
${conversation}

請輸出 JSON 格式：
{
  "text": "一段話總結對話重點",
  "topics": ["話題1", "話題2"],
  "keyPoints": ["要點1", "要點2", "要點3"],
  "sentiment": "正面/中性/負面",
  "actionItems": ["待辦事項（如有）"]
}`;

    try {
      const result = await this.gemini.generateContent(prompt);
      const text = result.response.text();
      
      // 解析 JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { text, topics: [], keyPoints: [] };
    } catch (error) {
      logger.error('VectorEnhance: Generate summary error:', error);
      return null;
    }
  }

  /**
   * 獲取向量引用（50% 機率）
   */
  async getVectorReference(groupId, query) {
    // 50% 機率決定是否引用
    if (Math.random() > REFERENCE_PROBABILITY) {
      logger.debug('VectorEnhance: Skipped reference (probability)');
      return null;
    }

    try {
      // 搜索相關向量
      const results = await smartMemoryService.searchMemory({
        userId: `group_${groupId}`,
        query,
        limit: 5
      });

      // 檢查向量數量
      if (!results || results.length < MIN_VECTOR_COUNT / 5) {
        logger.debug('VectorEnhance: Not enough vectors, skipping reference');
        return null;
      }

      // 格式化引用
      const references = results.map(r => {
        if (r.metadata?.keyPoints) {
          return r.metadata.keyPoints.join('、');
        }
        return r.content?.substring(0, 100);
      }).filter(Boolean);

      if (references.length === 0) return null;

      return {
        hasReference: true,
        content: references.join('\n'),
        count: results.length
      };
    } catch (error) {
      logger.error('VectorEnhance: Get reference error:', error);
      return null;
    }
  }

  /**
   * 增強回覆（添加向量引用）
   */
  async enhanceResponse(groupId, userMessage, baseResponse) {
    const reference = await this.getVectorReference(groupId, userMessage);
    
    if (!reference) {
      return {
        response: baseResponse,
        enhanced: false
      };
    }

    // 構建增強提示
    const enhancePrompt = `基於以下歷史記憶，優化回覆：

原始回覆：
${baseResponse}

相關記憶：
${reference.content}

要求：
- 自然融入歷史記憶中的相關信息
- 不要生硬引用，要自然過渡
- 保持原回覆的語氣和風格
- 如果記憶不相關，保持原回覆`;

    try {
      if (!this.gemini) {
        return { response: baseResponse, enhanced: false };
      }

      const result = await this.gemini.generateContent(enhancePrompt);
      const enhanced = result.response.text();

      return {
        response: enhanced,
        enhanced: true,
        referenceCount: reference.count
      };
    } catch (error) {
      logger.error('VectorEnhance: Enhance error:', error);
      return { response: baseResponse, enhanced: false };
    }
  }

  /**
   * 手動添加知識到向量庫
   */
  async addKnowledge(groupId, content, topics = []) {
    try {
      await smartMemoryService.storeMemory({
        userId: `group_${groupId}`,
        type: 'manual_knowledge',
        content,
        metadata: {
          topics,
          addedAt: new Date(),
          source: 'manual'
        }
      });

      logger.info(`VectorEnhance: Added manual knowledge for group ${groupId}`);
      return true;
    } catch (error) {
      logger.error('VectorEnhance: Add knowledge error:', error);
      return false;
    }
  }

  /**
   * 獲取向量庫統計
   */
  async getStats(groupId) {
    try {
      const stats = await smartMemoryService.getStats(`group_${groupId}`);
      return {
        totalVectors: stats?.count || 0,
        lastSummary: stats?.lastUpdate,
        currentBuffer: this.messageBuffers.get(groupId.toString())?.length || 0,
        threshold: SUMMARY_THRESHOLD,
        referenceProbability: REFERENCE_PROBABILITY
      };
    } catch (error) {
      return {
        totalVectors: 0,
        currentBuffer: this.messageBuffers.get(groupId.toString())?.length || 0,
        threshold: SUMMARY_THRESHOLD
      };
    }
  }

  /**
   * 強制總結當前緩衝區
   */
  async forceSummarize(groupId) {
    const key = groupId.toString();
    const buffer = this.messageBuffers.get(key);
    
    if (!buffer || buffer.length < 5) {
      return { success: false, message: '緩衝區消息太少' };
    }

    await this.summarizeAndStore(key);
    
    // 重置
    this.messageCounters.set(key, 0);
    this.messageBuffers.set(key, []);

    return { success: true, message: `已總結 ${buffer.length} 條消息` };
  }
}

export default new VectorEnhanceService();
