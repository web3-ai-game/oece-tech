/**
 * Notion Sync Service - TG Chat History to Notion
 * 
 * Features:
 * - 30 messages trigger sync
 * - 100 messages trigger compression
 * - User messages: full copy
 * - AI messages: summarized
 * - Vector memory dual storage
 */

import { Client } from '@notionhq/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

class NotionSyncService {
  constructor() {
    this.notion = null;
    this.genAI = null;
    // Pre-configured database ID (created via MCP)
    this.databaseId = process.env.NOTION_TG_CHAT_DB_ID || '2c2b81f6-ba45-8108-b90e-e7ebeb7195c3';
    this.messageBuffer = [];
    this.syncThreshold = 30;      // Sync every 30 messages
    this.compressThreshold = 100; // Compress every 100 messages
    this.totalMessages = 0;
    this.isInitialized = false;
  }

  /**
   * Initialize Notion client
   */
  async initialize() {
    try {
      const notionToken = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
      
      if (!notionToken) {
        logger.warn('NotionSync: No API key found, service disabled');
        return false;
      }

      this.notion = new Client({ auth: notionToken });
      this.genAI = new GoogleGenerativeAI(config.apiKeys.gemini);
      
      // Find or create database
      await this.findOrCreateDatabase();
      
      this.isInitialized = true;
      logger.info('NotionSync: Service initialized');
      return true;
    } catch (error) {
      logger.error('NotionSync: Initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Verify database exists
   */
  async findOrCreateDatabase() {
    try {
      // Database ID is pre-configured, just verify it exists
      if (this.databaseId) {
        const db = await this.notion.databases.retrieve({ database_id: this.databaseId });
        logger.info(`NotionSync: Database verified: ${db.title?.[0]?.plain_text || this.databaseId}`);
        return;
      }

      logger.warn('NotionSync: No database ID configured');
      
    } catch (error) {
      logger.error('NotionSync: Database verification failed:', error.message);
      this.databaseId = null; // Disable sync if database not found
    }
  }

  /**
   * Add message to buffer
   * @param {Object} message - Message object
   */
  async addMessage(message) {
    if (!this.isInitialized) return;

    const record = {
      speaker: message.isBot ? 'bot' : 'user',
      userId: message.userId || 'unknown',
      userName: message.userName || 'Unknown',
      content: message.content,
      action: message.action || 'chat',
      semantic: '', // Will be filled by AI
      timestamp: new Date().toISOString(),
      vectorRef: message.vectorRef || null
    };

    this.messageBuffer.push(record);
    this.totalMessages++;

    // Check thresholds
    if (this.messageBuffer.length >= this.syncThreshold) {
      await this.triggerSync();
    }

    if (this.totalMessages >= this.compressThreshold) {
      await this.triggerCompression();
    }
  }

  /**
   * Trigger sync to Notion (every 30 messages)
   */
  async triggerSync() {
    if (!this.databaseId || this.messageBuffer.length === 0) return;

    logger.info(`NotionSync: Syncing ${this.messageBuffer.length} messages...`);

    try {
      // Process messages with AI for semantic analysis
      const processedMessages = await this.processMessagesWithAI(this.messageBuffer);

      // Batch insert to Notion
      for (const msg of processedMessages) {
        await this.insertToNotion(msg);
        await this.sleep(100); // Rate limiting
      }

      logger.info(`NotionSync: Synced ${processedMessages.length} messages`);
      this.messageBuffer = []; // Clear buffer

    } catch (error) {
      logger.error('NotionSync: Sync failed:', error.message);
    }
  }

  /**
   * Trigger compression (every 100 messages)
   */
  async triggerCompression() {
    logger.info('NotionSync: Triggering compression...');

    try {
      // Use Gemini 2.5 Pro for high-quality summarization
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

      const prompt = `请对以下聊天记录进行智能压缩摘要：

要求：
1. 保留所有重要信息和关键决策
2. 用户的原话尽量保留
3. AI的回复压缩为要点
4. 保持时间线清晰
5. 输出格式：Markdown

聊天记录：
${this.formatMessagesForSummary()}

请输出压缩后的摘要：`;

      const result = await model.generateContent(prompt);
      const summary = result.response.text();

      // Insert summary as a special record
      await this.insertToNotion({
        speaker: 'system',
        userId: 'compression',
        userName: 'System',
        content: summary,
        action: 'compression',
        semantic: `Compressed ${this.totalMessages} messages`,
        timestamp: new Date().toISOString()
      });

      this.totalMessages = 0; // Reset counter
      logger.info('NotionSync: Compression complete');

    } catch (error) {
      logger.error('NotionSync: Compression failed:', error.message);
    }
  }

  /**
   * Process messages with AI for semantic analysis
   */
  async processMessagesWithAI(messages) {
    try {
      // Use Flash Lite for cheap semantic analysis
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

      const processed = [];
      
      for (const msg of messages) {
        // User messages: full copy
        if (msg.speaker === 'user') {
          msg.semantic = await this.analyzeIntent(model, msg.content);
          processed.push(msg);
          continue;
        }

        // Bot messages: summarize if long
        if (msg.content.length > 500) {
          const summaryPrompt = `用一句话概括以下AI回复的核心内容：\n${msg.content}`;
          const result = await model.generateContent(summaryPrompt);
          msg.content = `[摘要] ${result.response.text().trim()}`;
        }
        
        msg.semantic = 'ai_response';
        processed.push(msg);
      }

      return processed;

    } catch (error) {
      logger.error('NotionSync: AI processing failed:', error.message);
      return messages; // Return original if AI fails
    }
  }

  /**
   * Analyze user intent
   */
  async analyzeIntent(model, content) {
    try {
      const prompt = `分析以下用户消息的意图，用2-3个关键词描述：\n"${content}"`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch {
      return 'unknown';
    }
  }

  /**
   * Insert record to Notion database
   */
  async insertToNotion(record) {
    if (!this.databaseId) return;

    try {
      await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Speaker': {
            select: { name: record.speaker }
          },
          'User ID': {
            rich_text: [{ text: { content: record.userId } }]
          },
          'User Name': {
            rich_text: [{ text: { content: record.userName } }]
          },
          'Content': {
            title: [{ text: { content: record.content.substring(0, 2000) } }]
          },
          'Action': {
            select: { name: record.action }
          },
          'Semantic': {
            rich_text: [{ text: { content: record.semantic || '' } }]
          },
          'Timestamp': {
            date: { start: record.timestamp }
          },
          'Vector Ref': {
            rich_text: [{ text: { content: record.vectorRef || '' } }]
          }
        }
      });
    } catch (error) {
      logger.error('NotionSync: Insert failed:', error.message);
    }
  }

  /**
   * Format messages for summary
   */
  formatMessagesForSummary() {
    return this.messageBuffer.map(m => 
      `[${m.timestamp}] ${m.speaker === 'user' ? m.userName : 'Bot'}: ${m.content}`
    ).join('\n');
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      databaseId: this.databaseId,
      bufferSize: this.messageBuffer.length,
      totalMessages: this.totalMessages,
      nextSync: this.syncThreshold - this.messageBuffer.length,
      nextCompress: this.compressThreshold - this.totalMessages
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const notionSyncService = new NotionSyncService();
export default notionSyncService;
