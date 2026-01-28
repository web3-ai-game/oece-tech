/**
 * News Compare Service - 新聞 + 輿論對比
 * 
 * 功能:
 * - Gemini 2.5 Flash Lite: 20 條新聞摘要
 * - Grok 3 Mini: 20 條輿論觀點
 * - 合併對比輸出長文
 * 
 * 觸發方式: 菜單按鈕 (無關鍵詞)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

// 新聞分類
const NEWS_CATEGORIES = [
  { id: 'china', name: '📍 大陸政治', count: 6 },
  { id: 'sea', name: '🌏 東南亞', count: 6 },
  { id: 'world', name: '🌍 國際', count: 4 },
  { id: 'special', name: '✨ 特殊', count: 4 }
];

class NewsCompareService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.cache = {
      news: null,
      opinion: null,
      combined: null,
      date: null
    };
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
        this.gemini = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash-preview-05-20',
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096
          }
        });
      }

      if (grokKey) {
        this.grok = new OpenAI({
          apiKey: grokKey,
          baseURL: 'https://api.x.ai/v1'
        });
      }

      this.isInitialized = true;
      logger.info('NewsCompare: Service initialized');
      return true;
    } catch (error) {
      logger.error('NewsCompare: Init error:', error);
      return false;
    }
  }

  /**
   * 獲取今日日期
   */
  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * 檢查緩存是否有效
   */
  isCacheValid() {
    return this.cache.date === this.getToday() && this.cache.combined;
  }

  /**
   * 獲取新聞 (Gemini)
   */
  async fetchNews() {
    if (!this.gemini) {
      throw new Error('Gemini not initialized');
    }

    const today = this.getToday();
    const prompt = `你是專業新聞編輯。請生成今日 (${today}) 的 20 條精選新聞摘要。

## 分類要求
- 📍 大陸政治政策: 6 條 (政策、經濟、房地產)
- 🌏 東南亞對華: 6 條 (泰國、越南、馬來西亞、簽證、旅遊)
- 🌍 國際新聞: 4 條 (美國、歐洲、中東)
- ✨ 特殊專題: 4 條 (科技、醫療、娛樂、玄學)

## 輸出格式 (每條)
[分類] 標題
摘要 (一句話)
---

請確保內容真實、客觀。`;

    try {
      const result = await this.gemini.generateContent(prompt);
      const newsText = result.response.text();
      this.cache.news = newsText;
      logger.info('NewsCompare: Fetched 20 news items');
      return newsText;
    } catch (error) {
      logger.error('NewsCompare: Gemini error:', error);
      throw error;
    }
  }

  /**
   * 獲取輿論 (Grok)
   */
  async fetchOpinion() {
    if (!this.grok) {
      throw new Error('Grok not initialized');
    }

    const today = this.getToday();
    const prompt = `你是犀利的輿論分析師。請生成今日 (${today}) 的 20 條網絡輿論摘要。

## 分類要求
- 🔥 大陸網絡熱議: 6 條
- 🌴 東南亞華人圈: 6 條
- 🌐 國際輿論場: 4 條
- 😂 奇葩/搞笑話題: 4 條

## 輸出格式 (每條)
[分類] 話題
💬 網友說：「觀點摘要」
🌡️ 熱度：🔥🔥🔥
---

風格：幽默、犀利、接地氣。`;

    try {
      const response = await this.grok.chat.completions.create({
        model: 'grok-3-mini',
        messages: [
          { role: 'system', content: '你是幽默犀利的輿論分析師。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      });

      const opinionText = response.choices[0]?.message?.content || '';
      this.cache.opinion = opinionText;
      logger.info('NewsCompare: Fetched 20 opinion items');
      return opinionText;
    } catch (error) {
      logger.error('NewsCompare: Grok error:', error);
      throw error;
    }
  }

  /**
   * 獲取對比報告
   */
  async getCompareReport(forceRefresh = false) {
    const today = this.getToday();

    // 檢查緩存
    if (!forceRefresh && this.isCacheValid()) {
      logger.debug('NewsCompare: Using cached report');
      return this.cache.combined;
    }

    try {
      // 並行獲取
      const [news, opinion] = await Promise.all([
        this.fetchNews(),
        this.fetchOpinion()
      ]);

      // 生成對比報告
      const combined = this.generateCompareReport(news, opinion, today);
      
      // 更新緩存
      this.cache.combined = combined;
      this.cache.date = today;

      return combined;
    } catch (error) {
      logger.error('NewsCompare: Error generating report:', error);
      throw error;
    }
  }

  /**
   * 生成對比報告
   */
  generateCompareReport(news, opinion, date) {
    const header = `📰 *每日新聞 + 輿論對比*
📅 ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *報告說明*
• 📰 新聞來源: Gemini AI (20條)
• 🗣️ 輿論來源: Grok AI (20條)
• ⚖️ 對比分析: 新聞 vs 網友觀點

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const newsSection = `
📰 *新聞摘要*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${news}`;

    const opinionSection = `
🗣️ *輿論風向*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${opinion}`;

    const footer = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *溫馨提示*
新聞僅供參考，輿論代表網友觀點
請獨立思考，理性判斷
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    return header + newsSection + opinionSection + footer;
  }

  /**
   * 分段獲取報告 (避免消息過長)
   */
  async getReportSegments(forceRefresh = false) {
    const report = await this.getCompareReport(forceRefresh);
    
    // 按分隔線分段
    const segments = [];
    const maxLength = 3500; // Telegram 消息限制 4096
    
    let current = '';
    const lines = report.split('\n');
    
    for (const line of lines) {
      if (current.length + line.length + 1 > maxLength) {
        segments.push(current.trim());
        current = line + '\n';
      } else {
        current += line + '\n';
      }
    }
    
    if (current.trim()) {
      segments.push(current.trim());
    }

    return segments;
  }

  /**
   * 獲取新聞菜單
   */
  getNewsMenu() {
    return {
      text: `📰 *新聞中心*

選擇查看內容：`,
      keyboard: [
        [
          { text: '📰 今日新聞', callback_data: 'news_today' },
          { text: '🗣️ 輿論風向', callback_data: 'news_opinion' }
        ],
        [
          { text: '⚖️ 新聞+輿論對比', callback_data: 'news_compare' }
        ],
        [
          { text: '🔄 刷新', callback_data: 'news_refresh' },
          { text: '◀️ 返回', callback_data: 'menu_main' }
        ]
      ]
    };
  }

  /**
   * 獲取分類新聞
   */
  async getNewsByCategory(categoryId) {
    const report = await this.getCompareReport();
    
    // 根據分類過濾 (簡單實現)
    const categoryMap = {
      china: '📍',
      sea: '🌏',
      world: '🌍',
      special: '✨'
    };

    const emoji = categoryMap[categoryId];
    if (!emoji) return report;

    const lines = report.split('\n');
    const filtered = lines.filter(line => 
      line.includes(emoji) || 
      line.startsWith('━') || 
      line.startsWith('📰') ||
      line.startsWith('🗣️')
    );

    return filtered.join('\n');
  }

  /**
   * 獲取服務狀態
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      cacheValid: this.isCacheValid(),
      cacheDate: this.cache.date,
      hasNews: !!this.cache.news,
      hasOpinion: !!this.cache.opinion
    };
  }
}

export default new NewsCompareService();
