/**
 * 智能分段输出服务
 * 
 * 功能:
 * - 将长文本按知识点切分
 * - 每段添加迷你按钮（保存/复制）
 * - 支持多用户笔记本
 */

import logger from '../utils/logger.js';

// 分段标记
const SEGMENT_MARKERS = [
  /^#{1,3}\s+/m,           // Markdown 标题
  /^###?\s+/m,             // ### 或 ##
  /^\*\*[^*]+\*\*/m,       // **粗体标题**
  /^[-•]\s+\*\*/m,         // 列表项粗体
  /^\d+\.\s+\*\*/m,        // 数字列表粗体
  /^[📋🔍✅⚠️💡📊🛂👴💎📅❓🆓]/m,  // Emoji 开头
];

class SegmentService {
  constructor() {
    // 临时存储分段内容（用于保存按钮回调）
    this.segmentCache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30分钟过期
  }

  /**
   * 将长文本切分为知识点段落
   */
  splitIntoSegments(text) {
    if (!text || text.length < 200) {
      return [{ content: text, type: 'single' }];
    }

    const segments = [];
    const lines = text.split('\n');
    let currentSegment = [];
    let currentTitle = '';

    for (const line of lines) {
      // 检测是否是新段落开始
      const isNewSection = this.isNewSection(line);
      
      if (isNewSection && currentSegment.length > 0) {
        // 保存当前段落
        segments.push({
          title: currentTitle || this.extractTitle(currentSegment[0]),
          content: currentSegment.join('\n').trim(),
          type: 'section'
        });
        currentSegment = [];
        currentTitle = this.extractTitle(line);
      }
      
      currentSegment.push(line);
    }

    // 保存最后一个段落
    if (currentSegment.length > 0) {
      segments.push({
        title: currentTitle || '内容',
        content: currentSegment.join('\n').trim(),
        type: 'section'
      });
    }

    // 如果只有一个段落且太长，按字数切分
    if (segments.length === 1 && segments[0].content.length > 1000) {
      return this.splitByLength(segments[0].content);
    }

    return segments;
  }

  /**
   * 检测是否是新段落开始
   */
  isNewSection(line) {
    if (!line || line.trim().length === 0) return false;
    
    // 检测 Markdown 标题
    if (/^#{1,3}\s+/.test(line)) return true;
    
    // 检测粗体标题行
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) return true;
    
    // 检测 Emoji 开头的标题
    if (/^[📋🔍✅⚠️💡📊🛂👴💎📅❓🆓📌🏥💊🍵🧘]/.test(line)) return true;
    
    return false;
  }

  /**
   * 提取标题
   */
  extractTitle(line) {
    if (!line) return '内容';
    
    // 移除 Markdown 标记
    let title = line
      .replace(/^#{1,3}\s+/, '')
      .replace(/\*\*/g, '')
      .replace(/^[-•]\s+/, '')
      .trim();
    
    // 截取前20个字符
    if (title.length > 20) {
      title = title.substring(0, 20) + '...';
    }
    
    return title || '内容';
  }

  /**
   * 按长度切分
   */
  splitByLength(text, maxLength = 800) {
    const segments = [];
    const paragraphs = text.split(/\n\n+/);
    let current = [];
    let currentLength = 0;

    for (const para of paragraphs) {
      if (currentLength + para.length > maxLength && current.length > 0) {
        segments.push({
          title: this.extractTitle(current[0]),
          content: current.join('\n\n').trim(),
          type: 'chunk'
        });
        current = [];
        currentLength = 0;
      }
      current.push(para);
      currentLength += para.length;
    }

    if (current.length > 0) {
      segments.push({
        title: this.extractTitle(current[0]),
        content: current.join('\n\n').trim(),
        type: 'chunk'
      });
    }

    return segments;
  }

  /**
   * 生成带迷你按钮的消息
   * @param {string} text - 原始文本
   * @param {string} chatId - 聊天ID
   * @param {object} options - 选项
   */
  async generateSegmentedMessages(text, chatId, options = {}) {
    const { motherUserId, myUserId } = options;
    const segments = this.splitIntoSegments(text);
    const messages = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentId = this.cacheSegment(segment.content, chatId);
      
      // 构建消息
      const message = {
        text: segment.content,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: this.buildMiniButtons(segmentId, i, segments.length, options)
        }
      };
      
      messages.push(message);
    }

    return messages;
  }

  /**
   * 构建迷你按钮
   */
  buildMiniButtons(segmentId, index, total, options = {}) {
    const { showMotherSave = true, showMySave = true } = options;
    const buttons = [];
    
    // 第一行：保存按钮
    const saveRow = [];
    
    if (showMotherSave) {
      saveRow.push({ 
        text: '💾 存妈', 
        callback_data: `seg_save_mom_${segmentId}` 
      });
    }
    
    if (showMySave) {
      saveRow.push({ 
        text: '💾 存我', 
        callback_data: `seg_save_me_${segmentId}` 
      });
    }
    
    // 添加复制提示（Telegram 不支持真正复制，用提示代替）
    saveRow.push({ 
      text: '📋', 
      callback_data: `seg_copy_${segmentId}` 
    });
    
    if (saveRow.length > 0) {
      buttons.push(saveRow);
    }

    return buttons;
  }

  /**
   * 缓存段落内容
   */
  cacheSegment(content, chatId) {
    const id = `${chatId}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    this.segmentCache.set(id, {
      content,
      chatId,
      createdAt: Date.now()
    });
    
    // 清理过期缓存
    this.cleanExpiredCache();
    
    return id;
  }

  /**
   * 获取缓存的段落
   */
  getSegment(segmentId) {
    const cached = this.segmentCache.get(segmentId);
    if (!cached) return null;
    
    if (Date.now() - cached.createdAt > this.cacheExpiry) {
      this.segmentCache.delete(segmentId);
      return null;
    }
    
    return cached;
  }

  /**
   * 清理过期缓存
   */
  cleanExpiredCache() {
    const now = Date.now();
    for (const [id, data] of this.segmentCache.entries()) {
      if (now - data.createdAt > this.cacheExpiry) {
        this.segmentCache.delete(id);
      }
    }
  }

  /**
   * 生成简洁的仪表盘（单行）
   */
  buildCompactDashboard(data) {
    const { model, tokens } = data;
    const time = new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `\n───\n📊 ${model} | ${tokens}t | ${time}`;
  }
}

export default new SegmentService();
