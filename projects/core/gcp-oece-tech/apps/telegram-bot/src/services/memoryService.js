/**
 * 記憶服務 - BongBong 的長期記憶系統
 * 
 * 功能:
 * - 對話記錄存儲
 * - 向量記憶索引
 * - 自動摘要存檔
 * - 記憶檢索和引用
 */

import { MongoClient, ObjectId } from 'mongodb';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

class MemoryService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {
      conversations: null,  // 對話記錄
      memories: null,       // 記憶存檔
      embeddings: null,     // 向量嵌入
      notes: null,          // 便簽/筆記
      dailyTasks: null      // 每日任務
    };
    this.messageCounter = new Map(); // userId -> count
  }

  async connect() {
    try {
      const uri = config.mongodb.uri;
      if (!uri) {
        logger.warn('MongoDB URI not configured, memory service disabled');
        return false;
      }
      
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(config.mongodb.dbName || 'sms_tg_bot');
      
      // 初始化集合
      this.collections.conversations = this.db.collection('conversations');
      this.collections.memories = this.db.collection('memories');
      this.collections.embeddings = this.db.collection('embeddings');
      this.collections.notes = this.db.collection('notes');
      this.collections.dailyTasks = this.db.collection('daily_tasks');
      
      // 創建索引
      await this.createIndexes();
      
      logger.info('Memory service connected to MongoDB');
      return true;
    } catch (error) {
      logger.error('Memory service connection error:', error);
      return false;
    }
  }

  async createIndexes() {
    try {
      // 對話記錄索引
      await this.collections.conversations.createIndex({ chatId: 1, timestamp: -1 });
      await this.collections.conversations.createIndex({ userId: 1, timestamp: -1 });
      
      // 記憶索引
      await this.collections.memories.createIndex({ userId: 1, createdAt: -1 });
      await this.collections.memories.createIndex({ type: 1 });
      
      // 向量索引
      await this.collections.embeddings.createIndex({ userId: 1 });
      
      // 便簽索引
      await this.collections.notes.createIndex({ userId: 1, createdAt: -1 });
      await this.collections.notes.createIndex({ title: 'text', content: 'text' });
      
      logger.info('Memory indexes created');
    } catch (error) {
      logger.error('Error creating memory indexes:', error);
    }
  }

  /**
   * 記錄對話
   */
  async logConversation(data) {
    try {
      const { chatId, userId, userName, message, response, model, tokens, memoryRefs } = data;
      
      // 更新消息計數
      const count = (this.messageCounter.get(chatId) || 0) + 1;
      this.messageCounter.set(chatId, count);
      
      const doc = {
        chatId,
        userId,
        userName,
        message,
        response,
        model,
        tokens: tokens || 0,
        memoryRefs: memoryRefs || 0,
        messageNumber: count,
        timestamp: new Date(),
        metadata: {
          messageLength: message?.length || 0,
          responseLength: response?.length || 0
        }
      };
      
      await this.collections.conversations.insertOne(doc);
      
      return { messageNumber: count };
    } catch (error) {
      logger.error('Error logging conversation:', error);
      return { messageNumber: 0 };
    }
  }

  /**
   * 獲取對話歷史
   */
  async getConversationHistory(chatId, limit = 20) {
    try {
      return await this.collections.conversations
        .find({ chatId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting conversation history:', error);
      return [];
    }
  }

  /**
   * 創建記憶存檔點
   */
  async createMemoryCheckpoint(userId, content, type = 'auto') {
    try {
      const doc = {
        userId,
        content,
        type, // 'auto', 'manual', 'summary'
        createdAt: new Date(),
        importance: this.calculateImportance(content)
      };
      
      const result = await this.collections.memories.insertOne(doc);
      logger.info(`Memory checkpoint created for user ${userId}`);
      
      return result.insertedId;
    } catch (error) {
      logger.error('Error creating memory checkpoint:', error);
      return null;
    }
  }

  /**
   * 計算記憶重要性
   */
  calculateImportance(content) {
    let score = 1;
    
    // 關鍵詞加分
    const importantKeywords = ['重要', '記住', '別忘', '提醒', '生日', '紀念', '約定'];
    for (const keyword of importantKeywords) {
      if (content.includes(keyword)) score += 1;
    }
    
    // 長度加分
    if (content.length > 100) score += 0.5;
    if (content.length > 300) score += 0.5;
    
    return Math.min(score, 5);
  }

  /**
   * 搜索記憶
   */
  async searchMemories(userId, query, limit = 5) {
    try {
      // 簡單文本搜索
      const results = await this.collections.memories
        .find({
          userId,
          $text: { $search: query }
        })
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .limit(limit)
        .toArray();
      
      return results;
    } catch (error) {
      // 如果文本索引不存在，使用正則搜索
      try {
        return await this.collections.memories
          .find({
            userId,
            content: { $regex: query, $options: 'i' }
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
      } catch (e) {
        logger.error('Error searching memories:', e);
        return [];
      }
    }
  }

  /**
   * 獲取最近記憶
   */
  async getRecentMemories(userId, limit = 10) {
    try {
      return await this.collections.memories
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting recent memories:', error);
      return [];
    }
  }

  /**
   * 保存便簽
   */
  async saveNote(userId, title, content, tags = []) {
    try {
      const doc = {
        userId,
        title,
        content,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await this.collections.notes.insertOne(doc);
      return { id: result.insertedId, ...doc };
    } catch (error) {
      logger.error('Error saving note:', error);
      return null;
    }
  }

  /**
   * 搜索便簽
   */
  async searchNotes(userId, query, limit = 10) {
    try {
      return await this.collections.notes
        .find({
          userId,
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error searching notes:', error);
      return [];
    }
  }

  /**
   * 獲取所有便簽
   */
  async getAllNotes(userId, limit = 50) {
    try {
      return await this.collections.notes
        .find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting notes:', error);
      return [];
    }
  }

  /**
   * 記錄每日任務完成情況
   */
  async logDailyTask(userId, taskType, completed = true) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await this.collections.dailyTasks.updateOne(
        { userId, date: today, taskType },
        { 
          $set: { completed, completedAt: new Date() },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
      
      return true;
    } catch (error) {
      logger.error('Error logging daily task:', error);
      return false;
    }
  }

  /**
   * 獲取今日任務狀態
   */
  async getTodayTasks(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      return await this.collections.dailyTasks
        .find({ userId, date: today })
        .toArray();
    } catch (error) {
      logger.error('Error getting today tasks:', error);
      return [];
    }
  }

  /**
   * 獲取消息計數
   */
  getMessageCount(chatId) {
    return this.messageCounter.get(chatId) || 0;
  }

  /**
   * 獲取統計信息
   */
  async getStats(userId) {
    try {
      const [conversationCount, memoryCount, noteCount] = await Promise.all([
        this.collections.conversations.countDocuments({ userId }),
        this.collections.memories.countDocuments({ userId }),
        this.collections.notes.countDocuments({ userId })
      ]);
      
      return {
        conversations: conversationCount,
        memories: memoryCount,
        notes: noteCount
      };
    } catch (error) {
      logger.error('Error getting stats:', error);
      return { conversations: 0, memories: 0, notes: 0 };
    }
  }

  /**
   * 關閉連接
   */
  async close() {
    if (this.client) {
      await this.client.close();
      logger.info('Memory service disconnected');
    }
  }
}

export default new MemoryService();
