import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import config from '../../config/index.js';
import modelRouter from './modelRouter.js';
import logger from '../utils/logger.js';

/**
 * AI服务 - 统一管理Gemini和Grok API调用
 */
class AIService {
  constructor() {
    // 初始化Gemini
    this.genAI = new GoogleGenerativeAI(config.apiKeys.gemini);
    
    // Grok API配置
    this.grokApiUrl = 'https://api.x.ai/v1/chat/completions';
    this.grokApiKey = config.apiKeys.grok;
  }

  /**
   * 生成AI响应（智能路由）
   * @param {string} userMessage - 用户消息
   * @param {Array} conversationHistory - 对话历史
   * @returns {Promise<Object>} - { response: string, modelUsed: string, reason: string }
   */
  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // 使用智能路由器选择模型
      const modelInfo = modelRouter.getModelInfo(userMessage);
      logger.info(`Model selected: ${modelInfo.model} (${modelInfo.reason})`);

      let response;
      if (modelInfo.provider === 'gemini') {
        response = await this.callGemini(userMessage, conversationHistory, modelInfo.model);
      } else if (modelInfo.provider === 'grok') {
        // 緊急方案：暫停 Grok，統一回退 Gemini
        const fallbackModel = config.app.complex || 'gemini-1.5-pro';
        logger.warn('Grok 暫停使用，改用 Gemini 路由');
        response = await this.callGemini(userMessage, conversationHistory, fallbackModel);
      }

      return {
        response,
        modelUsed: modelInfo.model,
        provider: modelInfo.provider,
        reason: modelInfo.reason,
        textInfo: modelInfo.textInfo,
      };
    } catch (error) {
      logger.error('Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * 调用Gemini API
   * @param {string} userMessage
   * @param {Array} conversationHistory
   * @param {string} modelName
   * @returns {Promise<string>}
   */
  async callGemini(userMessage, conversationHistory, modelName) {
    try {
      const model = this.genAI.getGenerativeModel({ model: modelName });

      // 构建对话历史
      const history = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      logger.error(`Gemini API error (${modelName}):`, error);
      // 若 Gemini 2.5 Flash 調用失敗，回退到 Gemini 1.5 Pro
      const isGemini25 = String(modelName).toLowerCase() === 'gemini-2.5-flash';
      if (isGemini25) {
        const fallback = config.app.complex || 'gemini-1.5-pro';
        logger.warn(`Gemini 2.5 Flash 调用失败，回退到 ${fallback}`);
        const model = this.genAI.getGenerativeModel({ model: fallback });
        const chat = model.startChat({ history: [], generationConfig: { temperature: 0.9, maxOutputTokens: 8192 } });
        const result = await chat.sendMessage(userMessage);
        return result.response.text();
      }
      throw new Error(`Gemini调用失败: ${error.message}`);
    }
  }

  /**
   * 调用Grok API (xAI)
   * @param {string} userMessage
   * @param {Array} conversationHistory
   * @param {string} modelName
   * @returns {Promise<string>}
   */
  async callGrok(userMessage, conversationHistory, modelName) {
    try {
      const messages = [
        {
          role: 'system',
          content: '你是一个富有同理心和情绪价值的AI助手。你擅长:\n1. 理解用户的情绪和感受\n2. 提供温暖、幽默的回应\n3. 用轻松诙谐的方式化解压力\n4. 给予情感支持和鼓励\n保持真诚、友善,但也可以适度犀利和有趣。',
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
        },
      ];

      const response = await axios.post(
        this.grokApiUrl,
        {
          model: modelName,
          messages,
          temperature: 1.0,
          max_tokens: 4096,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.grokApiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error(`Grok API error (${modelName}):`, error.response?.data || error.message);
      throw new Error(`Grok调用失败: ${error.message}`);
    }
  }

  /**
   * 生成文本向量嵌入（用于向量搜索）
   * @param {string} text
   * @returns {Promise<Array>}
   */
  async generateEmbedding(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      logger.error('Error generating embedding:', error);
      throw error;
    }
  }
}

export default new AIService();
