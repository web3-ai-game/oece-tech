import { MongoClient } from 'mongodb';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

/**
 * MongoDB数据库服务 - 处理写作内容的存储和向量搜索
 */
class DatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {
      writings: null,
      embeddings: null,
    };
  }

  /**
   * 连接数据库
   */
  async connect() {
    try {
      this.client = new MongoClient(config.mongodb.uri);
      await this.client.connect();
      this.db = this.client.db(config.mongodb.dbName);
      
      // 初始化集合
      this.collections.writings = this.db.collection(config.mongodb.collections.writings);
      this.collections.embeddings = this.db.collection(config.mongodb.collections.embeddings);

      // 创建索引
      await this.createIndexes();

      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * 创建必要的索引
   */
  async createIndexes() {
    try {
      // 写作内容索引
      await this.collections.writings.createIndex({ userId: 1, createdAt: -1 });
      await this.collections.writings.createIndex({ tags: 1 });
      await this.collections.writings.createIndex({ title: 'text', content: 'text' });

      // 向量嵌入索引（用于向量搜索）
      await this.collections.embeddings.createIndex({ writingId: 1 });
      await this.collections.embeddings.createIndex({ userId: 1 });

      logger.info('Database indexes created');
    } catch (error) {
      logger.error('Error creating indexes:', error);
    }
  }

  /**
   * 保存写作内容
   * @param {Object} writingData
   * @returns {Promise<Object>}
   */
  async saveWriting(writingData) {
    try {
      const document = {
        userId: writingData.userId,
        userName: writingData.userName,
        title: writingData.title || '未命名',
        content: writingData.content,
        tags: writingData.tags || [],
        category: writingData.category || '日记',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: writingData.metadata || {},
      };

      const result = await this.collections.writings.insertOne(document);
      return { ...document, _id: result.insertedId };
    } catch (error) {
      logger.error('Error saving writing:', error);
      throw error;
    }
  }

  /**
   * 保存向量嵌入
   * @param {string} writingId
   * @param {string} userId
   * @param {Array} embedding
   * @param {string} text
   */
  async saveEmbedding(writingId, userId, embedding, text) {
    try {
      const document = {
        writingId,
        userId,
        embedding,
        text,
        createdAt: new Date(),
      };

      await this.collections.embeddings.insertOne(document);
    } catch (error) {
      logger.error('Error saving embedding:', error);
      throw error;
    }
  }

  /**
   * 向量相似度搜索
   * @param {Array} queryEmbedding - 查询向量
   * @param {string} userId - 用户ID
   * @param {number} limit - 返回结果数量
   * @returns {Promise<Array>}
   */
  async vectorSearch(queryEmbedding, userId, limit = 5) {
    try {
      // 获取用户的所有嵌入
      const embeddings = await this.collections.embeddings
        .find({ userId })
        .toArray();

      // 计算余弦相似度
      const similarities = embeddings.map(doc => ({
        writingId: doc.writingId,
        text: doc.text,
        similarity: this.cosineSimilarity(queryEmbedding, doc.embedding),
      }));

      // 按相似度排序并筛选
      const results = similarities
        .filter(item => item.similarity >= config.vector.similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      // 获取完整的写作内容
      const writingIds = results.map(r => r.writingId);
      const writings = await this.collections.writings
        .find({ _id: { $in: writingIds } })
        .toArray();

      // 合并结果
      return results.map(result => {
        const writing = writings.find(w => w._id.toString() === result.writingId);
        return {
          ...writing,
          similarity: result.similarity,
        };
      });
    } catch (error) {
      logger.error('Error in vector search:', error);
      throw error;
    }
  }

  /**
   * 计算余弦相似度
   * @param {Array} vecA
   * @param {Array} vecB
   * @returns {number}
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 关键词搜索写作内容
   * @param {string} userId
   * @param {string} keyword
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async keywordSearch(userId, keyword, limit = 10) {
    try {
      return await this.collections.writings
        .find({
          userId,
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { content: { $regex: keyword, $options: 'i' } },
            { tags: { $regex: keyword, $options: 'i' } },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error in keyword search:', error);
      throw error;
    }
  }

  /**
   * 获取最近的写作内容
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecentWritings(userId, limit = 10) {
    try {
      return await this.collections.writings
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting recent writings:', error);
      throw error;
    }
  }

  /**
   * 按日期范围获取写作内容
   * @param {string} userId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  async getWritingsByDateRange(userId, startDate, endDate) {
    try {
      return await this.collections.writings
        .find({
          userId,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      logger.error('Error getting writings by date range:', error);
      throw error;
    }
  }

  /**
   * 获取写作统计
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getWritingStats(userId) {
    try {
      const totalCount = await this.collections.writings.countDocuments({ userId });
      
      const recentWritings = await this.collections.writings
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      const categories = await this.collections.writings
        .aggregate([
          { $match: { userId } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
        ])
        .toArray();

      return {
        totalCount,
        lastWriting: recentWritings[0] || null,
        categoriesDistribution: categories,
      };
    } catch (error) {
      logger.error('Error getting writing stats:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   */
  async close() {
    if (this.client) {
      await this.client.close();
      logger.info('MongoDB connection closed');
    }
  }
}

export default new DatabaseService();
