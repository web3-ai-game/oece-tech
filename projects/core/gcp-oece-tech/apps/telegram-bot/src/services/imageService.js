/**
 * 圖片生成服務
 * 
 * 使用 Gemini 2.0 Flash Exp 生成圖片
 * 支持向量記憶增強
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/index.js';
import memoryService from './memoryService.js';
import logger from '../utils/logger.js';

class ImageService {
  constructor() {
    this.gemini = null;
    this.generationHistory = []; // 記錄生成歷史用於學習
  }

  async init() {
    const geminiKey = config.apiKeys.gemini;
    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey);
    }
  }

  /**
   * 生成圖片描述 (由於 Gemini 不直接生成圖片，我們生成詳細描述)
   */
  async generateImageDescription(prompt, userId) {
    if (!this.gemini) {
      throw new Error('Gemini API not initialized');
    }

    // 獲取用戶相關記憶來增強提示
    const memories = await this.getRelevantMemories(userId, prompt);
    const memoryContext = memories.length > 0
      ? `\n\n用戶偏好參考：${memories.map(m => m.content).join('; ')}`
      : '';

    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024
      }
    });

    const fullPrompt = `你是一個專業的圖像描述生成器。請根據以下主題生成一段詳細的圖像描述，用於 AI 繪圖。

主題：${prompt}${memoryContext}

要求：
1. 描述要具體、生動、有畫面感
2. 包含場景、光線、色彩、氛圍
3. 適合母親觀看，溫馨正面
4. 中文描述，約100-150字

請直接輸出描述，不要加任何前綴。`;

    try {
      const result = await model.generateContent(fullPrompt);
      const description = result.response.text();
      
      // 記錄生成歷史
      this.generationHistory.push({
        prompt,
        description,
        timestamp: new Date(),
        userId
      });

      // 保持歷史記錄在合理範圍
      if (this.generationHistory.length > 100) {
        this.generationHistory = this.generationHistory.slice(-50);
      }

      return {
        success: true,
        description,
        prompt
      };
    } catch (error) {
      logger.error('Image description generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 獲取相關記憶 (用於增強生成)
   */
  async getRelevantMemories(userId, prompt) {
    try {
      // 18% 概率調用記憶
      if (Math.random() > 0.18) {
        return [];
      }
      
      const memories = await memoryService.searchMemories(userId, prompt, 2);
      return memories;
    } catch (error) {
      return [];
    }
  }

  /**
   * 生成隨機圖片主題
   */
  getRandomTopic() {
    const topics = [
      // 自然風景
      '晨曦中的山間小屋，炊煙裊裊',
      '秋天的楓葉林，金黃與火紅交織',
      '雨後的荷塘，蜻蜓點水',
      '夕陽下的海邊，漁船歸港',
      '春天的櫻花樹下，花瓣飄落',
      
      // 溫馨場景
      '溫馨的廚房，媽媽在做飯',
      '窗邊的貓咪，曬著暖陽',
      '老人在公園下棋',
      '孩子在放風箏',
      '一家人圍坐吃飯',
      
      // 中國風
      '水墨畫風格的山水',
      '古典園林的亭台樓閣',
      '江南水鄉的小橋流水',
      '茶館裡品茶的老人',
      '書法桌上的筆墨紙硯',
      
      // 美食
      '熱氣騰騰的餃子',
      '精緻的廣式點心',
      '一碗熱湯麵',
      '新鮮出爐的月餅',
      
      // 花卉
      '盛開的牡丹花',
      '清晨帶露的玫瑰',
      '素雅的蘭花',
      '向日葵花田'
    ];
    
    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * 基於用戶歷史生成個性化主題
   */
  async getPersonalizedTopic(userId) {
    // 檢查用戶記憶
    const memories = await memoryService.getRecentMemories(userId, 5);
    
    if (memories.length === 0) {
      return this.getRandomTopic();
    }

    // 從記憶中提取關鍵詞
    const keywords = memories
      .map(m => m.content)
      .join(' ')
      .match(/[\u4e00-\u9fa5]{2,4}/g) || [];

    if (keywords.length === 0) {
      return this.getRandomTopic();
    }

    // 隨機選擇一個關鍵詞作為主題
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // 生成相關主題
    const relatedTopics = [
      `關於「${keyword}」的溫馨畫面`,
      `${keyword}的美好時刻`,
      `充滿${keyword}氛圍的場景`
    ];

    return relatedTopics[Math.floor(Math.random() * relatedTopics.length)];
  }

  /**
   * 獲取生成統計
   */
  getStats() {
    return {
      totalGenerations: this.generationHistory.length,
      recentGenerations: this.generationHistory.slice(-10)
    };
  }
}

export default new ImageService();
