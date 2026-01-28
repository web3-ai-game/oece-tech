/**
 * 多用户笔记本服务
 * 
 * 功能:
 * - 支持多用户各自的笔记本
 * - 母亲笔记本 / 我的笔记本
 * - 自动摘抄 AI 输出
 * - 知识库积累
 */

import { MongoClient } from 'mongodb';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

// 用户配置
const USER_CONFIG = {
  // 母亲的 Telegram ID（需要配置）
  mother: {
    aliases: ['Leee', 'Cat', '妈', '媽', 'Lee'],
    notebookName: '妈妈的笔记本',
    icon: '👩‍🦳'
  },
  // 你的配置
  zhouwen: {
    aliases: ['周文', 'Zhouwen', 'Zhou'],
    notebookName: '我的笔记本',
    icon: '👨‍💻'
  }
};

class NotebookService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {
      notebooks: null,  // 笔记本元数据
      notes: null,      // 笔记内容
      knowledge: null   // 知识库
    };
    this.connected = false;
  }

  /**
   * 连接数据库
   */
  async connect() {
    if (this.connected) return true;

    try {
      const uri = config.mongodb.uri;
      this.client = new MongoClient(uri);
      await this.client.connect();
      
      this.db = this.client.db(config.mongodb.dbName);
      this.collections.notebooks = this.db.collection('notebooks');
      this.collections.notes = this.db.collection('user_notes');
      this.collections.knowledge = this.db.collection('knowledge_base');

      // 创建索引
      await this.createIndexes();
      
      this.connected = true;
      logger.info('Notebook service connected');
      return true;
    } catch (error) {
      logger.error('Notebook service connection error:', error);
      return false;
    }
  }

  /**
   * 创建索引
   */
  async createIndexes() {
    try {
      await this.collections.notes.createIndex({ oderId: 1 });
      await this.collections.notes.createIndex({ oderId: 1, category: 1 });
      await this.collections.notes.createIndex({ createdAt: -1 });
      await this.collections.notes.createIndex({ 
        title: 'text', 
        content: 'text' 
      });
      
      await this.collections.knowledge.createIndex({ category: 1 });
      await this.collections.knowledge.createIndex({ tags: 1 });
    } catch (error) {
      logger.error('Index creation error:', error);
    }
  }

  /**
   * 识别用户类型
   */
  identifyUser(userName, userId) {
    const lowerName = (userName || '').toLowerCase();
    
    // 检查是否是母亲
    for (const alias of USER_CONFIG.mother.aliases) {
      if (lowerName.includes(alias.toLowerCase())) {
        return { type: 'mother', config: USER_CONFIG.mother, userId };
      }
    }
    
    // 检查是否是周文
    for (const alias of USER_CONFIG.zhouwen.aliases) {
      if (lowerName.includes(alias.toLowerCase())) {
        return { type: 'zhouwen', config: USER_CONFIG.zhouwen, userId };
      }
    }
    
    // 默认返回普通用户
    return { 
      type: 'user', 
      config: { notebookName: '我的笔记', icon: '📝' },
      userId 
    };
  }

  /**
   * 保存笔记
   */
  async saveNote(ownerId, ownerType, note) {
    try {
      const doc = {
        ownerId,
        ownerType,  // 'mother' | 'zhouwen' | 'user'
        title: note.title || '无标题',
        content: note.content,
        category: note.category || 'general',
        tags: note.tags || [],
        source: note.source || 'manual',  // 'manual' | 'auto' | 'ai_output'
        aiModel: note.aiModel || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collections.notes.insertOne(doc);
      logger.info(`Note saved for ${ownerType}: ${note.title}`);
      
      return { 
        success: true, 
        id: result.insertedId,
        ...doc 
      };
    } catch (error) {
      logger.error('Save note error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 保存到母亲的笔记本
   */
  async saveToMotherNotebook(content, options = {}) {
    const { title, category, tags, source, aiModel } = options;
    
    return await this.saveNote('mother', 'mother', {
      title: title || this.generateTitle(content),
      content,
      category: category || 'ai_knowledge',
      tags: tags || this.extractTags(content),
      source: source || 'ai_output',
      aiModel
    });
  }

  /**
   * 保存到我的笔记本
   */
  async saveToMyNotebook(userId, content, options = {}) {
    const { title, category, tags, source, aiModel } = options;
    
    return await this.saveNote(userId, 'zhouwen', {
      title: title || this.generateTitle(content),
      content,
      category: category || 'ai_knowledge',
      tags: tags || this.extractTags(content),
      source: source || 'ai_output',
      aiModel
    });
  }

  /**
   * 获取笔记列表
   */
  async getNotes(ownerId, ownerType, options = {}) {
    const { limit = 20, category, search } = options;
    
    try {
      const query = { ownerType };
      if (ownerId && ownerType !== 'mother') {
        query.ownerId = ownerId;
      }
      if (category) {
        query.category = category;
      }
      
      let cursor;
      if (search) {
        cursor = this.collections.notes.find({
          ...query,
          $text: { $search: search }
        });
      } else {
        cursor = this.collections.notes.find(query);
      }
      
      return await cursor
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Get notes error:', error);
      return [];
    }
  }

  /**
   * 获取母亲的笔记
   */
  async getMotherNotes(options = {}) {
    return await this.getNotes(null, 'mother', options);
  }

  /**
   * 获取我的笔记
   */
  async getMyNotes(userId, options = {}) {
    return await this.getNotes(userId, 'zhouwen', options);
  }

  /**
   * 自动生成标题
   */
  generateTitle(content) {
    if (!content) return '无标题';
    
    // 尝试提取第一行作为标题
    const firstLine = content.split('\n')[0]
      .replace(/^#+\s*/, '')
      .replace(/\*\*/g, '')
      .trim();
    
    if (firstLine.length > 0 && firstLine.length <= 30) {
      return firstLine;
    }
    
    // 截取前20个字符
    return content.substring(0, 20).replace(/\n/g, ' ') + '...';
  }

  /**
   * 自动提取标签
   */
  extractTags(content) {
    const tags = [];
    const lowerContent = content.toLowerCase();
    
    // 签证相关
    if (/签证|visa|移民|入境/.test(lowerContent)) {
      tags.push('签证');
    }
    
    // 养生相关
    if (/养生|健康|中医|穴位|食疗/.test(lowerContent)) {
      tags.push('养生');
    }
    
    // 泰国相关
    if (/泰国|泰铢|曼谷|清迈/.test(lowerContent)) {
      tags.push('泰国');
    }
    
    // 政策相关
    if (/政策|规定|要求|条件/.test(lowerContent)) {
      tags.push('政策');
    }
    
    return tags;
  }

  /**
   * 添加到知识库
   */
  async addToKnowledge(content, options = {}) {
    try {
      const doc = {
        content,
        category: options.category || 'general',
        tags: options.tags || this.extractTags(content),
        source: options.source || 'ai_output',
        aiModel: options.aiModel,
        createdAt: new Date()
      };

      await this.collections.knowledge.insertOne(doc);
      logger.info('Knowledge added:', doc.category);
      return { success: true };
    } catch (error) {
      logger.error('Add knowledge error:', error);
      return { success: false };
    }
  }

  /**
   * 搜索知识库
   */
  async searchKnowledge(query, options = {}) {
    const { limit = 10, category } = options;
    
    try {
      const filter = {};
      if (category) filter.category = category;
      
      return await this.collections.knowledge
        .find({
          ...filter,
          $text: { $search: query }
        })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Search knowledge error:', error);
      return [];
    }
  }

  /**
   * 获取笔记统计
   */
  async getStats(ownerType) {
    try {
      const total = await this.collections.notes.countDocuments({ ownerType });
      const categories = await this.collections.notes.aggregate([
        { $match: { ownerType } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();
      
      return { total, categories };
    } catch (error) {
      logger.error('Get stats error:', error);
      return { total: 0, categories: [] };
    }
  }

  // ==================== Enhanced Features ====================

  /**
   * 获取单条笔记
   */
  async getNoteById(noteId) {
    try {
      const { ObjectId } = await import('mongodb');
      return await this.collections.notes.findOne({ _id: new ObjectId(noteId) });
    } catch (error) {
      logger.error('Get note by id error:', error);
      return null;
    }
  }

  /**
   * 更新笔记
   */
  async updateNote(noteId, updates) {
    try {
      const { ObjectId } = await import('mongodb');
      const result = await this.collections.notes.updateOne(
        { _id: new ObjectId(noteId) },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        }
      );
      return { success: result.modifiedCount > 0 };
    } catch (error) {
      logger.error('Update note error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 删除笔记
   */
  async deleteNote(noteId) {
    try {
      const { ObjectId } = await import('mongodb');
      const result = await this.collections.notes.deleteOne({ _id: new ObjectId(noteId) });
      return { success: result.deletedCount > 0 };
    } catch (error) {
      logger.error('Delete note error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 按分类获取笔记
   */
  async getNotesByCategory(ownerType, category, limit = 20) {
    try {
      return await this.collections.notes
        .find({ ownerType, category })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Get notes by category error:', error);
      return [];
    }
  }

  /**
   * 按标签获取笔记
   */
  async getNotesByTag(ownerType, tag, limit = 20) {
    try {
      return await this.collections.notes
        .find({ ownerType, tags: tag })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error('Get notes by tag error:', error);
      return [];
    }
  }

  /**
   * 获取所有分类
   */
  async getCategories(ownerType) {
    try {
      const categories = await this.collections.notes.aggregate([
        { $match: { ownerType } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
      return categories.map(c => ({ name: c._id, count: c.count }));
    } catch (error) {
      logger.error('Get categories error:', error);
      return [];
    }
  }

  /**
   * 获取所有标签
   */
  async getTags(ownerType) {
    try {
      const tags = await this.collections.notes.aggregate([
        { $match: { ownerType } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
      return tags.map(t => ({ name: t._id, count: t.count }));
    } catch (error) {
      logger.error('Get tags error:', error);
      return [];
    }
  }

  /**
   * 全文搜索笔记
   */
  async searchNotes(ownerType, query, options = {}) {
    const { limit = 20, category } = options;
    
    try {
      const filter = { ownerType };
      if (category) filter.category = category;
      
      // 尝试全文搜索
      const results = await this.collections.notes
        .find({
          ...filter,
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      return results;
    } catch (error) {
      logger.error('Search notes error:', error);
      return [];
    }
  }

  /**
   * 导出笔记为文本
   */
  async exportNotes(ownerType, options = {}) {
    const { format = 'markdown', category } = options;
    
    try {
      const filter = { ownerType };
      if (category) filter.category = category;
      
      const notes = await this.collections.notes
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      
      if (format === 'markdown') {
        return this.formatAsMarkdown(notes);
      } else if (format === 'json') {
        return JSON.stringify(notes, null, 2);
      } else {
        return this.formatAsText(notes);
      }
    } catch (error) {
      logger.error('Export notes error:', error);
      return null;
    }
  }

  /**
   * 格式化为 Markdown
   */
  formatAsMarkdown(notes) {
    let md = `# 笔记导出\n\n`;
    md += `导出时间: ${new Date().toLocaleString()}\n`;
    md += `共 ${notes.length} 条笔记\n\n---\n\n`;
    
    for (const note of notes) {
      md += `## ${note.title}\n\n`;
      md += `- 分类: ${note.category}\n`;
      md += `- 标签: ${note.tags?.join(', ') || '无'}\n`;
      md += `- 创建时间: ${note.createdAt?.toLocaleString()}\n\n`;
      md += `${note.content}\n\n---\n\n`;
    }
    
    return md;
  }

  /**
   * 格式化为纯文本
   */
  formatAsText(notes) {
    let text = `笔记导出 - ${new Date().toLocaleString()}\n`;
    text += `共 ${notes.length} 条笔记\n`;
    text += '='.repeat(50) + '\n\n';
    
    for (const note of notes) {
      text += `【${note.title}】\n`;
      text += `分类: ${note.category} | 标签: ${note.tags?.join(', ') || '无'}\n`;
      text += `${note.content}\n`;
      text += '-'.repeat(50) + '\n\n';
    }
    
    return text;
  }

  /**
   * 获取最近笔记摘要
   */
  async getRecentSummary(ownerType, days = 7) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);
      
      const notes = await this.collections.notes
        .find({ 
          ownerType, 
          createdAt: { $gte: since } 
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      const byCategory = {};
      for (const note of notes) {
        const cat = note.category || 'general';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(note);
      }
      
      return {
        total: notes.length,
        period: `${days}天`,
        byCategory,
        latest: notes.slice(0, 5)
      };
    } catch (error) {
      logger.error('Get recent summary error:', error);
      return { total: 0, byCategory: {}, latest: [] };
    }
  }

  /**
   * 添加标签到笔记
   */
  async addTagToNote(noteId, tag) {
    try {
      const { ObjectId } = await import('mongodb');
      const result = await this.collections.notes.updateOne(
        { _id: new ObjectId(noteId) },
        { 
          $addToSet: { tags: tag },
          $set: { updatedAt: new Date() }
        }
      );
      return { success: result.modifiedCount > 0 };
    } catch (error) {
      logger.error('Add tag error:', error);
      return { success: false };
    }
  }

  /**
   * 移除标签
   */
  async removeTagFromNote(noteId, tag) {
    try {
      const { ObjectId } = await import('mongodb');
      const result = await this.collections.notes.updateOne(
        { _id: new ObjectId(noteId) },
        { 
          $pull: { tags: tag },
          $set: { updatedAt: new Date() }
        }
      );
      return { success: result.modifiedCount > 0 };
    } catch (error) {
      logger.error('Remove tag error:', error);
      return { success: false };
    }
  }

  /**
   * 快速保存（从消息）
   */
  async quickSave(userId, userName, content, source = 'quick_save') {
    const user = this.identifyUser(userName, userId);
    
    return await this.saveNote(userId, user.type, {
      title: this.generateTitle(content),
      content,
      category: 'quick_save',
      tags: ['快速保存'],
      source
    });
  }
}

export default new NotebookService();
