/**
 * 群聊共享記憶服務
 * 
 * 功能:
 * - 跨用戶上下文記憶
 * - 單獨備份每個用戶的記憶
 * - 合體上下文搜索
 * - 向量記憶學習用戶風格
 */

import { MongoClient } from 'mongodb';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

class GroupMemoryService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {
      groupMessages: null,    // 群聊消息記錄
      userProfiles: null,     // 用戶畫像
      styleVectors: null,     // 風格向量
      sharedContext: null     // 共享上下文
    };
    this.lastActivityTime = new Map(); // groupId -> timestamp
  }

  async connect() {
    try {
      const uri = config.mongodb.uri;
      if (!uri) {
        logger.warn('MongoDB URI not configured');
        return false;
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(config.mongodb.dbName || 'sms_tg_bot');

      // 初始化集合
      this.collections.groupMessages = this.db.collection('group_messages');
      this.collections.userProfiles = this.db.collection('user_profiles');
      this.collections.styleVectors = this.db.collection('style_vectors');
      this.collections.sharedContext = this.db.collection('shared_context');

      // 創建索引
      await this.createIndexes();

      logger.info('Group memory service connected');
      return true;
    } catch (error) {
      logger.error('Group memory connection error:', error);
      return false;
    }
  }

  async createIndexes() {
    try {
      // 群消息索引
      await this.collections.groupMessages.createIndex({ groupId: 1, timestamp: -1 });
      await this.collections.groupMessages.createIndex({ groupId: 1, userId: 1 });
      await this.collections.groupMessages.createIndex({ content: 'text' });

      // 用戶畫像索引
      await this.collections.userProfiles.createIndex({ oduserId: 1 }, { unique: true });

      // 風格向量索引
      await this.collections.styleVectors.createIndex({ userId: 1 });

      logger.info('Group memory indexes created');
    } catch (error) {
      logger.error('Error creating group memory indexes:', error);
    }
  }

  /**
   * 記錄群消息
   */
  async logGroupMessage(data) {
    const { groupId, userId, userName, content, isBot, botName } = data;

    try {
      const doc = {
        groupId,
        userId,
        userName,
        content,
        isBot: isBot || false,
        botName: botName || null,
        timestamp: new Date(),
        metadata: {
          contentLength: content?.length || 0,
          hasEmoji: /[\u{1F600}-\u{1F64F}]/u.test(content || ''),
          wordCount: (content || '').split(/\s+/).length
        }
      };

      await this.collections.groupMessages.insertOne(doc);

      // 更新最後活動時間
      this.lastActivityTime.set(groupId, Date.now());

      // 如果是真人消息，更新用戶畫像
      if (!isBot && userId) {
        await this.updateUserProfile(userId, userName, content);
      }

      return true;
    } catch (error) {
      logger.error('Error logging group message:', error);
      return false;
    }
  }

  /**
   * 更新用戶畫像 (用於學習說話風格)
   */
  async updateUserProfile(userId, userName, content) {
    try {
      // 分析內容特徵
      const features = this.analyzeContentFeatures(content);

      await this.collections.userProfiles.updateOne(
        { oduserId: userId },
        {
          $set: {
            userName,
            lastActive: new Date()
          },
          $inc: {
            messageCount: 1,
            totalLength: content?.length || 0,
            'features.emojiCount': features.emojiCount,
            'features.punctuationCount': features.punctuationCount
          },
          $push: {
            recentMessages: {
              $each: [{ content, timestamp: new Date() }],
              $slice: -50  // 保留最近50條
            }
          },
          $addToSet: {
            vocabulary: { $each: features.words.slice(0, 20) }
          }
        },
        { upsert: true }
      );
    } catch (error) {
      logger.error('Error updating user profile:', error);
    }
  }

  /**
   * 分析內容特徵
   */
  analyzeContentFeatures(content) {
    if (!content) return { words: [], emojiCount: 0, punctuationCount: 0 };

    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu;
    const punctuationRegex = /[。，！？、；：""''（）【】《》]/g;

    const emojis = content.match(emojiRegex) || [];
    const punctuation = content.match(punctuationRegex) || [];
    const words = content.match(/[\u4e00-\u9fa5]{2,4}/g) || [];

    return {
      words,
      emojiCount: emojis.length,
      punctuationCount: punctuation.length,
      avgSentenceLength: content.length / Math.max(1, (content.match(/[。！？]/g) || []).length)
    };
  }

  /**
   * 獲取群聊歷史 (合體上下文)
   */
  async getGroupHistory(groupId, limit = 50) {
    try {
      return await this.collections.groupMessages
        .find({ groupId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting group history:', error);
      return [];
    }
  }

  /**
   * 獲取特定用戶在群裡的消息
   */
  async getUserMessagesInGroup(groupId, userId, limit = 30) {
    try {
      return await this.collections.groupMessages
        .find({ groupId, userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Error getting user messages:', error);
      return [];
    }
  }

  /**
   * 搜索群聊記憶 (跨用戶)
   */
  async searchGroupMemory(groupId, query, limit = 10) {
    try {
      // 文本搜索
      const results = await this.collections.groupMessages
        .find({
          groupId,
          $text: { $search: query }
        })
        .sort({ score: { $meta: 'textScore' }, timestamp: -1 })
        .limit(limit)
        .toArray();

      return results;
    } catch (error) {
      // 回退到正則搜索
      try {
        return await this.collections.groupMessages
          .find({
            groupId,
            content: { $regex: query, $options: 'i' }
          })
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray();
      } catch (e) {
        logger.error('Error searching group memory:', e);
        return [];
      }
    }
  }

  /**
   * 獲取用戶畫像
   */
  async getUserProfile(userId) {
    try {
      return await this.collections.userProfiles.findOne({ oduserId: userId });
    } catch (error) {
      logger.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * 獲取用戶說話風格 (用於模仿)
   */
  async getUserStyle(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return null;

      const recentMessages = profile.recentMessages || [];
      const vocabulary = profile.vocabulary || [];

      // 計算平均特徵
      const avgLength = profile.totalLength / Math.max(1, profile.messageCount);
      const emojiRate = profile.features?.emojiCount / Math.max(1, profile.messageCount);

      return {
        avgMessageLength: avgLength,
        emojiUsageRate: emojiRate,
        commonWords: vocabulary.slice(0, 30),
        recentExamples: recentMessages.slice(-10).map(m => m.content),
        messageCount: profile.messageCount
      };
    } catch (error) {
      logger.error('Error getting user style:', error);
      return null;
    }
  }

  /**
   * 檢查群是否空閒
   */
  isGroupIdle(groupId, idleMinutes = 60) {
    const lastActivity = this.lastActivityTime.get(groupId);
    if (!lastActivity) return true;

    const idleMs = idleMinutes * 60 * 1000;
    return Date.now() - lastActivity > idleMs;
  }

  /**
   * 獲取最後活動時間
   */
  getLastActivityTime(groupId) {
    return this.lastActivityTime.get(groupId) || 0;
  }

  /**
   * 獲取隨機歷史話題 (用於閒聊)
   */
  async getRandomTopic(groupId, excludeBot = true) {
    try {
      const query = { groupId };
      if (excludeBot) {
        query.isBot = { $ne: true };
      }

      const count = await this.collections.groupMessages.countDocuments(query);
      if (count === 0) return null;

      const randomSkip = Math.floor(Math.random() * Math.max(0, count - 10));
      const messages = await this.collections.groupMessages
        .find(query)
        .skip(randomSkip)
        .limit(5)
        .toArray();

      return messages[Math.floor(Math.random() * messages.length)];
    } catch (error) {
      logger.error('Error getting random topic:', error);
      return null;
    }
  }

  /**
   * 關閉連接
   */
  async close() {
    if (this.client) {
      await this.client.close();
      logger.info('Group memory service disconnected');
    }
  }
}

export default new GroupMemoryService();
