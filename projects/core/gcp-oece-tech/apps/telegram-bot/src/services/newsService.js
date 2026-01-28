/**
 * 每日新聞服務
 * 
 * 功能:
 * - Gemini Pro 搜索全網新聞摘要 (每日1次)
 * - Grok Mini 輿論摘要 (每日1次)
 * - 30條新聞 + Telegram 鏈接
 * 
 * 分類比例:
 * - 大陸政治政策小道消息: 30%
 * - 東南亞對華政策/遊客新聞: 30%
 * - 國際新聞: 20%
 * - 特殊 (娛樂/科技/醫療/玄學/宇宙): 20%
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import memoryService from './memoryService.js';
import logger from '../utils/logger.js';

class NewsService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.lastNewsUpdate = null;
    this.cachedNews = null;
    this.cachedOpinion = null;
  }

  async init() {
    const geminiKey = config.apiKeys.gemini;
    const grokKey = config.apiKeys.grok;

    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey);
    }
    if (grokKey) {
      this.grok = new OpenAI({
        apiKey: grokKey,
        baseURL: 'https://api.x.ai/v1'
      });
    }
  }

  /**
   * 獲取每日新聞摘要 (Gemini Pro)
   */
  async getDailyNews(forceRefresh = false) {
    const today = new Date().toISOString().split('T')[0];
    
    // 檢查緩存
    if (!forceRefresh && this.cachedNews && this.lastNewsUpdate === today) {
      return this.cachedNews;
    }

    if (!this.gemini) {
      throw new Error('Gemini API not initialized');
    }

    const model = this.gemini.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    });

    const prompt = `你是一個專業的新聞編輯。請根據今天 (${today}) 的最新新聞，生成一份精選新聞摘要。

## 要求
1. 總共30條新聞摘要
2. 每條包含：標題、一句話摘要、相關 Telegram 頻道或新聞源鏈接
3. 按以下比例分類：

### 📍 大陸政治政策 (9條, 30%)
- 政策動向、官方聲明、小道消息
- 經濟政策、房地產、金融

### 🌏 東南亞對華新聞 (9條, 30%)
- 泰國、越南、馬來西亞、新加坡等對華政策
- 中國遊客相關新聞
- 簽證、旅遊、投資政策

### 🌍 國際新聞 (6條, 20%)
- 美國、歐洲、中東重大事件
- 國際關係、地緣政治

### ✨ 特殊專題 (6條, 20%)
- 娛樂八卦
- 新科技發現
- 醫療健康突破
- 玄學/宇宙學有趣發現

## 輸出格式
使用以下格式，方便在 Telegram 中顯示：

📰 *BongBong 每日新聞* | ${today}

━━━━━━━━━━━━━━━━━━━━
📍 *大陸政治政策*
━━━━━━━━━━━━━━━━━━━━

1️⃣ *標題*
   摘要內容
   🔗 [來源](鏈接)

(以此類推...)

請確保內容真實、客觀、有價值。`;

    try {
      const result = await model.generateContent(prompt);
      const newsText = result.response.text();
      
      // 緩存結果
      this.cachedNews = newsText;
      this.lastNewsUpdate = today;
      
      // 存入記憶
      await memoryService.createMemoryCheckpoint('system', `每日新聞 ${today}`, 'news');
      
      logger.info(`Daily news generated for ${today}`);
      return newsText;
    } catch (error) {
      logger.error('Error generating daily news:', error);
      throw error;
    }
  }

  /**
   * 獲取輿論摘要 (Grok Mini)
   */
  async getOpinionSummary(forceRefresh = false) {
    const today = new Date().toISOString().split('T')[0];
    
    // 檢查緩存
    if (!forceRefresh && this.cachedOpinion && this.lastNewsUpdate === today) {
      return this.cachedOpinion;
    }

    if (!this.grok) {
      throw new Error('Grok API not initialized');
    }

    const prompt = `你是一個犀利的輿論分析師。請根據今天 (${today}) 的熱點事件，生成一份輿論摘要大全。

## 要求
1. 總共30條輿論摘要
2. 每條包含：話題、網友觀點摘要、熱度指數 (🔥)
3. 風格：幽默、犀利、接地氣

## 分類比例
- 大陸網絡熱議: 30%
- 東南亞華人圈討論: 30%
- 國際輿論場: 20%
- 奇葩/搞笑/玄學話題: 20%

## 輸出格式

🗣️ *BongBong 輿論風向* | ${today}

━━━━━━━━━━━━━━━━━━━━
🔥 *大陸網絡熱議*
━━━━━━━━━━━━━━━━━━━━

1️⃣ *話題標題*
   💬 網友說：「觀點摘要」
   🌡️ 熱度：🔥🔥🔥🔥

(以此類推...)

請用幽默但不失深度的方式呈現。`;

    try {
      const response = await this.grok.chat.completions.create({
        model: 'grok-3-mini',
        messages: [
          { role: 'system', content: '你是一個幽默犀利的輿論分析師，擅長用接地氣的方式總結網絡熱點。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      });

      const opinionText = response.choices[0]?.message?.content || '';
      
      // 緩存結果
      this.cachedOpinion = opinionText;
      
      logger.info(`Opinion summary generated for ${today}`);
      return opinionText;
    } catch (error) {
      logger.error('Error generating opinion summary:', error);
      throw error;
    }
  }

  /**
   * 獲取完整每日播報
   */
  async getDailyBroadcast() {
    try {
      const [news, opinion] = await Promise.all([
        this.getDailyNews(),
        this.getOpinionSummary()
      ]);

      return {
        news,
        opinion,
        combined: `${news}\n\n${'═'.repeat(30)}\n\n${opinion}`
      };
    } catch (error) {
      logger.error('Error getting daily broadcast:', error);
      throw error;
    }
  }

  /**
   * 檢查是否需要更新
   */
  needsUpdate() {
    const today = new Date().toISOString().split('T')[0];
    return this.lastNewsUpdate !== today;
  }

  /**
   * 獲取新聞目錄索引
   */
  async getNewsIndex() {
    const news = await this.getDailyNews();
    
    // 提取標題生成目錄
    const lines = news.split('\n');
    const titles = lines.filter(line => line.match(/^\d️⃣|^[1-9]\./));
    
    const index = `📑 *今日新聞目錄*\n\n${titles.slice(0, 30).join('\n')}\n\n輸入「報新聞」或「报新闻」查看完整內容`;
    
    return index;
  }
}

export default new NewsService();
