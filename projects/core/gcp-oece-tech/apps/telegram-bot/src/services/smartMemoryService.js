/**
 * 智能记忆服务 - AI 驱动的自动化记忆系统
 * 
 * 功能:
 * - 自动分析内容重要性
 * - 向量化存储和检索
 * - 智能关联推荐
 * - 自动摘抄到笔记本
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MongoClient } from 'mongodb';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

class SmartMemoryService {
  constructor() {
    this.gemini = null;
    this.client = null;
    this.db = null;
    this.collections = {
      memories: null,      // 记忆存储
      vectors: null,       // 向量索引
      knowledge: null,     // 知识库
      autoNotes: null      // 自动笔记
    };
    this.connected = false;
  }

  /**
   * 初始化
   */
  async init() {
    try {
      // 初始化 Gemini
      const geminiKey = config.gemini?.apiKey || config.apiKeys?.gemini;
      if (geminiKey) {
        this.gemini = new GoogleGenerativeAI(geminiKey);
        logger.info('SmartMemory: Gemini initialized');
      }

      // 连接 MongoDB
      const uri = config.mongodb.uri;
      this.client = new MongoClient(uri);
      await this.client.connect();
      
      this.db = this.client.db(config.mongodb.dbName);
      this.collections.memories = this.db.collection('smart_memories');
      this.collections.vectors = this.db.collection('memory_vectors');
      this.collections.knowledge = this.db.collection('knowledge_base');
      this.collections.autoNotes = this.db.collection('auto_notes');

      // 创建索引
      await this.createIndexes();
      
      this.connected = true;
      logger.info('SmartMemory service initialized');
      return true;
    } catch (error) {
      logger.error('SmartMemory init error:', error);
      return false;
    }
  }

  /**
   * 创建索引
   */
  async createIndexes() {
    try {
      await this.collections.memories.createIndex({ category: 1 });
      await this.collections.memories.createIndex({ importance: -1 });
      await this.collections.memories.createIndex({ createdAt: -1 });
      await this.collections.memories.createIndex({ 
        content: 'text', 
        summary: 'text',
        tags: 'text'
      });
      
      await this.collections.autoNotes.createIndex({ ownerId: 1 });
      await this.collections.autoNotes.createIndex({ ownerType: 1 });
      await this.collections.autoNotes.createIndex({ autoSaved: 1 });
    } catch (error) {
      logger.error('SmartMemory index error:', error);
    }
  }

  /**
   * 分析内容重要性和类别
   * 使用 Gemini 2.5 Flash-Lite（廉价模型）自动添加记忆向量
   */
  async analyzeContent(content, context = {}) {
    if (!this.gemini) {
      return this.basicAnalysis(content);
    }

    try {
      // 使用廉价模型进行向量记忆分析
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.0-flash',  // 廉价稳定模型
        generationConfig: {
          temperature: 0.2,  // 低温度，更确定性
          maxOutputTokens: 512  // 减少 token 消耗
        }
      });

      const prompt = `分析以下内容，返回 JSON 格式：

内容：
${content.substring(0, 2000)}

上下文：${context.source || '对话'}

请返回：
{
  "importance": 1-10,  // 重要性评分
  "category": "签证|养生|知识|对话|其他",
  "summary": "一句话摘要",
  "tags": ["标签1", "标签2"],
  "shouldAutoSave": true/false,  // 是否值得自动保存
  "keyPoints": ["要点1", "要点2"],  // 关键知识点
  "relatedTopics": ["相关话题"]
}

只返回 JSON，不要其他内容。`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // 解析 JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.basicAnalysis(content);
    } catch (error) {
      logger.error('Content analysis error:', error.message);
      return this.basicAnalysis(content);
    }
  }

  /**
   * 基础分析（回退）
   */
  basicAnalysis(content) {
    const lowerContent = content.toLowerCase();
    
    // 检测类别
    let category = '其他';
    let importance = 5;
    const tags = [];
    
    if (/签证|visa|移民|入境|续签/.test(lowerContent)) {
      category = '签证';
      importance = 8;
      tags.push('签证', '泰国');
    } else if (/养生|健康|中医|穴位|食疗/.test(lowerContent)) {
      category = '养生';
      importance = 7;
      tags.push('养生', '健康');
    } else if (/政策|规定|要求|条件|费用/.test(lowerContent)) {
      category = '知识';
      importance = 7;
      tags.push('政策');
    }
    
    return {
      importance,
      category,
      summary: content.substring(0, 50) + '...',
      tags,
      shouldAutoSave: importance >= 7,
      keyPoints: [],
      relatedTopics: []
    };
  }

  /**
   * 智能保存 - 自动分析并决定是否保存
   */
  async smartSave(content, options = {}) {
    const { userId, userName, source, forceAnalyze = false } = options;
    
    // 分析内容
    const analysis = await this.analyzeContent(content, { source });
    
    // 决定是否自动保存
    if (!analysis.shouldAutoSave && !forceAnalyze) {
      return { saved: false, reason: 'importance_low', analysis };
    }

    try {
      const doc = {
        content,
        userId,
        userName,
        source: source || 'ai_output',
        analysis,
        importance: analysis.importance,
        category: analysis.category,
        summary: analysis.summary,
        tags: analysis.tags,
        keyPoints: analysis.keyPoints,
        autoSaved: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collections.memories.insertOne(doc);
      
      logger.info(`SmartMemory saved: ${analysis.category} (importance: ${analysis.importance})`);
      
      return { 
        saved: true, 
        id: result.insertedId,
        analysis 
      };
    } catch (error) {
      logger.error('SmartSave error:', error);
      return { saved: false, error: error.message };
    }
  }

  /**
   * 扩展搜索 - 搜索并自动记忆
   */
  async expandSearch(query, options = {}) {
    const { userId, autoMemorize = true } = options;
    
    try {
      // 1. 搜索现有记忆
      const existingMemories = await this.searchMemories(query);
      
      // 2. 如果启用自动记忆，分析查询并保存
      if (autoMemorize) {
        await this.smartSave(query, {
          userId,
          source: 'search_query'
        });
      }
      
      // 3. 生成相关推荐
      const recommendations = await this.generateRecommendations(query, existingMemories);
      
      return {
        query,
        results: existingMemories,
        recommendations,
        totalFound: existingMemories.length
      };
    } catch (error) {
      logger.error('ExpandSearch error:', error);
      return { query, results: [], recommendations: [] };
    }
  }

  /**
   * 搜索记忆
   */
  async searchMemories(query, options = {}) {
    const { limit = 10, category } = options;
    
    try {
      const filter = {};
      if (category) filter.category = category;
      
      const results = await this.collections.memories
        .find({
          ...filter,
          $text: { $search: query }
        })
        .sort({ importance: -1, createdAt: -1 })
        .limit(limit)
        .toArray();
      
      return results;
    } catch (error) {
      logger.error('SearchMemories error:', error);
      return [];
    }
  }

  /**
   * 生成相关推荐
   */
  async generateRecommendations(query, existingResults) {
    if (!this.gemini || existingResults.length === 0) {
      return [];
    }

    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 512
        }
      });

      const context = existingResults.map(r => r.summary || r.content.substring(0, 100)).join('\n');
      
      const prompt = `基于以下查询和已有内容，推荐3个相关话题：

查询：${query}

已有内容：
${context}

返回 JSON 数组：["话题1", "话题2", "话题3"]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      logger.error('GenerateRecommendations error:', error.message);
      return [];
    }
  }

  /**
   * 自动保存到笔记本
   */
  async autoSaveToNotebook(content, ownerType, options = {}) {
    const analysis = await this.analyzeContent(content);
    
    if (!analysis.shouldAutoSave) {
      return { saved: false, reason: 'not_important_enough' };
    }

    try {
      const doc = {
        ownerType,  // 'mother' | 'zhouwen'
        content,
        title: analysis.summary,
        category: analysis.category,
        tags: analysis.tags,
        keyPoints: analysis.keyPoints,
        importance: analysis.importance,
        autoSaved: true,
        source: options.source || 'ai_auto',
        createdAt: new Date()
      };

      await this.collections.autoNotes.insertOne(doc);
      
      logger.info(`AutoNote saved for ${ownerType}: ${analysis.summary}`);
      
      return { saved: true, analysis };
    } catch (error) {
      logger.error('AutoSaveToNotebook error:', error);
      return { saved: false, error: error.message };
    }
  }

  /**
   * 获取用户的自动笔记
   */
  async getAutoNotes(ownerType, options = {}) {
    const { limit = 20, category } = options;
    
    try {
      const filter = { ownerType };
      if (category) filter.category = category;
      
      return await this.collections.autoNotes
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('GetAutoNotes error:', error);
      return [];
    }
  }

  /**
   * 获取知识统计
   */
  async getStats() {
    try {
      const total = await this.collections.memories.countDocuments();
      const byCategory = await this.collections.memories.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();
      
      const autoNotes = await this.collections.autoNotes.countDocuments();
      
      return {
        totalMemories: total,
        byCategory: byCategory.reduce((acc, c) => {
          acc[c._id] = c.count;
          return acc;
        }, {}),
        autoNotes
      };
    } catch (error) {
      logger.error('GetStats error:', error);
      return { totalMemories: 0, byCategory: {}, autoNotes: 0 };
    }
  }
}

export default new SmartMemoryService();
