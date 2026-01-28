/**
 * 視覺服務 - Gemini 多模態圖片分析
 * 
 * 功能:
 * - 詳細識別圖片內容
 * - 多角度分析 (物體、場景、文字、情緒、藝術風格等)
 * - 支持多種圖片格式
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

class VisionService {
  constructor() {
    this.gemini = null;
    this.initialized = false;
  }

  /**
   * 初始化
   */
  init() {
    const geminiKey = config.apiKeys.gemini;
    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey);
      this.initialized = true;
      logger.info('Vision service initialized');
    }
    return this.initialized;
  }

  /**
   * 分析圖片 - 全方位詳細分析
   */
  async analyzeImage(imageUrl, context = '') {
    if (!this.initialized) {
      this.init();
    }

    if (!this.gemini) {
      return { success: false, error: 'Gemini not initialized' };
    }

    try {
      // 下載圖片
      const imageData = await this.downloadImage(imageUrl);
      if (!imageData) {
        return { success: false, error: 'Failed to download image' };
      }

      // 使用 Gemini 2.5 Flash 進行多模態分析
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      });

      const prompt = `請對這張圖片進行全方位詳細分析。

## 分析維度

### 1. 基本識別
- 圖片類型 (照片/截圖/插畫/表情包等)
- 主要內容描述
- 場景/背景

### 2. 細節分析
- 人物 (如有): 數量、表情、動作、穿著
- 物體: 識別所有可見物體
- 文字 (如有): 完整轉錄並翻譯
- 顏色/光線/構圖

### 3. 深度解讀
- 情緒/氛圍
- 可能的背景故事
- 文化/社會含義 (如適用)
- 如果是表情包/梗圖: 解釋梗的含義

### 4. 有趣發現
- 任何有趣或值得注意的細節
- 隱藏的彩蛋或細節

${context ? `\n用戶補充說明: ${context}` : ''}

請用中文回覆，格式清晰，有趣但專業。`;

      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64
          }
        }
      ]);

      const analysis = result.response.text().trim();

      return {
        success: true,
        analysis,
        mimeType: imageData.mimeType
      };

    } catch (error) {
      logger.error('Vision analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 快速識別 - 簡短版本
   */
  async quickRecognize(imageUrl) {
    if (!this.initialized) {
      this.init();
    }

    if (!this.gemini) {
      return { success: false, error: 'Gemini not initialized' };
    }

    try {
      const imageData = await this.downloadImage(imageUrl);
      if (!imageData) {
        return { success: false, error: 'Failed to download image' };
      }

      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 300
        }
      });

      const prompt = '用一句話描述這張圖片的主要內容，簡潔有趣。';

      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64
          }
        }
      ]);

      return {
        success: true,
        description: result.response.text().trim()
      };

    } catch (error) {
      logger.error('Quick recognize error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 下載圖片並轉換為 base64
   */
  async downloadImage(url) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const base64 = Buffer.from(response.data).toString('base64');
      const contentType = response.headers['content-type'] || 'image/jpeg';

      return {
        base64,
        mimeType: contentType
      };
    } catch (error) {
      logger.error('Download image error:', error);
      return null;
    }
  }
}

export default new VisionService();
