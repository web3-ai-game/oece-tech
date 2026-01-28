/**
 * Creative Writing Service - AI-Powered Content Creation
 * 
 * Features:
 * - Writing Assistant (drafts, outlines, editing)
 * - Story Continuation (narrative generation)
 * - Inspiration Generator (prompts, ideas)
 * - Content Expansion (elaborate on ideas)
 * - Style Transfer (rewrite in different styles)
 * 
 * Models:
 * - Gemini 2.5 Pro: High-quality creative writing
 * - Gemini 2.5 Flash: Quick drafts and ideas
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/index.js';
import logger from '../utils/logger.js';
import notebookService from './notebookService.js';

// Creative writing prompts and templates
const CREATIVE_PROMPTS = {
  writing: {
    outline: `你是一位专业的写作顾问。请为以下主题创建一个详细的写作大纲：

主题：{topic}

要求：
1. 提供清晰的结构（开头、主体、结尾）
2. 每个部分包含2-3个要点
3. 建议适合的写作风格
4. 给出字数建议`,

    draft: `你是一位优秀的写作助手。请根据以下要求撰写初稿：

主题/要求：{topic}

写作要求：
1. 语言流畅自然
2. 结构清晰
3. 内容充实
4. 适当使用修辞手法`,

    polish: `你是一位资深编辑。请润色以下文字，使其更加精炼优美：

原文：
{content}

润色要求：
1. 保持原意不变
2. 优化语言表达
3. 修正语法错误
4. 增强可读性`,

    expand: `你是一位创意写作专家。请扩写以下内容，使其更加丰富详细：

原文：
{content}

扩写要求：
1. 增加细节描写
2. 丰富情感表达
3. 添加适当的例子或比喻
4. 保持原有风格`
  },

  story: {
    continue: `你是一位故事大师。请续写以下故事：

故事开头：
{content}

续写要求：
1. 保持原有风格和人物性格
2. 情节发展自然合理
3. 增加适当的悬念或转折
4. 续写约300-500字`,

    ending: `你是一位故事大师。请为以下故事写一个精彩的结局：

故事内容：
{content}

结局要求：
1. 与前文呼应
2. 出人意料又合情合理
3. 给读者留下深刻印象`,

    character: `你是一位角色设计专家。请为以下故事设定创建一个有深度的角色：

故事背景：
{content}

角色要求：
1. 详细的外貌描写
2. 性格特点和成长背景
3. 动机和目标
4. 与其他角色的关系`
  },

  inspire: {
    random: `你是一位创意灵感大师。请提供5个独特的创作灵感：

类型偏好：{type}

要求：
1. 每个灵感包含一句话概述
2. 简要说明可以发展的方向
3. 灵感要新颖有趣
4. 适合不同水平的创作者`,

    prompt: `你是一位写作导师。请根据以下关键词生成一个详细的写作提示：

关键词：{keywords}

提示要求：
1. 包含场景设定
2. 主要人物描述
3. 核心冲突或问题
4. 可能的发展方向`,

    brainstorm: `你是一位头脑风暴专家。请围绕以下主题进行创意发散：

主题：{topic}

要求：
1. 提供至少10个相关创意点
2. 包含不同角度和维度
3. 标注每个创意的可行性
4. 建议最有潜力的3个方向`
  }
};

// Writing style templates
const STYLE_TEMPLATES = {
  formal: '正式、专业、严谨',
  casual: '轻松、口语化、亲切',
  literary: '文学性、优美、富有诗意',
  humorous: '幽默、风趣、轻松愉快',
  dramatic: '戏剧性、紧张、情感强烈',
  minimalist: '简洁、精炼、留白',
  descriptive: '细腻、描写丰富、画面感强'
};

class CreativeService {
  constructor() {
    this.genAI = null;
    this.proModel = null;
    this.flashModel = null;
    this.isInitialized = false;
    
    // User creative sessions
    this.sessions = new Map();
    
    // Creative history for context
    this.history = new Map();
  }

  /**
   * Initialize the service
   */
  async init() {
    try {
      this.genAI = new GoogleGenerativeAI(config.apiKeys.gemini);
      
      // Pro model for high-quality creative writing
      this.proModel = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-pro-preview-06-05',
        generationConfig: {
          temperature: 0.9,  // Higher creativity
          topP: 0.95,
          maxOutputTokens: 4096
        }
      });
      
      // Flash model for quick drafts
      this.flashModel = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-preview-05-20',
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 2048
        }
      });
      
      this.isInitialized = true;
      logger.info('Creative service initialized');
      return true;
    } catch (error) {
      logger.error('Creative service init error:', error);
      return false;
    }
  }

  /**
   * Start a creative session
   */
  startSession(userId, type) {
    this.sessions.set(userId, {
      type,
      startedAt: new Date(),
      drafts: [],
      currentDraft: null
    });
    return this.sessions.get(userId);
  }

  /**
   * Get or create session
   */
  getSession(userId) {
    return this.sessions.get(userId);
  }

  /**
   * End session and optionally save
   */
  async endSession(userId, save = false) {
    const session = this.sessions.get(userId);
    if (!session) return null;

    if (save && session.currentDraft) {
      await this.saveDraft(userId, session.currentDraft);
    }

    this.sessions.delete(userId);
    return session;
  }

  // ==================== Writing Assistant ====================

  /**
   * Generate writing outline
   */
  async generateOutline(topic, options = {}) {
    try {
      const prompt = CREATIVE_PROMPTS.writing.outline.replace('{topic}', topic);
      const result = await this.proModel.generateContent(prompt);
      const outline = result.response.text();
      
      logger.info('Creative: Generated outline for:', topic.substring(0, 30));
      return {
        success: true,
        type: 'outline',
        content: outline,
        topic
      };
    } catch (error) {
      logger.error('Generate outline error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate draft
   */
  async generateDraft(topic, options = {}) {
    try {
      const { style = 'casual', length = 'medium' } = options;
      
      let prompt = CREATIVE_PROMPTS.writing.draft.replace('{topic}', topic);
      prompt += `\n\n风格：${STYLE_TEMPLATES[style] || style}`;
      prompt += `\n长度：${length === 'short' ? '300字左右' : length === 'long' ? '1000字以上' : '500字左右'}`;
      
      const result = await this.proModel.generateContent(prompt);
      const draft = result.response.text();
      
      logger.info('Creative: Generated draft');
      return {
        success: true,
        type: 'draft',
        content: draft,
        topic,
        style
      };
    } catch (error) {
      logger.error('Generate draft error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Polish/edit content
   */
  async polishContent(content, options = {}) {
    try {
      const prompt = CREATIVE_PROMPTS.writing.polish.replace('{content}', content);
      const result = await this.proModel.generateContent(prompt);
      const polished = result.response.text();
      
      logger.info('Creative: Polished content');
      return {
        success: true,
        type: 'polish',
        original: content,
        content: polished
      };
    } catch (error) {
      logger.error('Polish content error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Expand content
   */
  async expandContent(content, options = {}) {
    try {
      const prompt = CREATIVE_PROMPTS.writing.expand.replace('{content}', content);
      const result = await this.proModel.generateContent(prompt);
      const expanded = result.response.text();
      
      logger.info('Creative: Expanded content');
      return {
        success: true,
        type: 'expand',
        original: content,
        content: expanded
      };
    } catch (error) {
      logger.error('Expand content error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Story Continuation ====================

  /**
   * Continue a story
   */
  async continueStory(storyStart, options = {}) {
    try {
      const { style = 'literary', length = 'medium' } = options;
      
      let prompt = CREATIVE_PROMPTS.story.continue.replace('{content}', storyStart);
      prompt += `\n\n风格：${STYLE_TEMPLATES[style] || style}`;
      
      const result = await this.proModel.generateContent(prompt);
      const continuation = result.response.text();
      
      logger.info('Creative: Continued story');
      return {
        success: true,
        type: 'story_continue',
        original: storyStart,
        content: continuation
      };
    } catch (error) {
      logger.error('Continue story error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate story ending
   */
  async generateEnding(story, options = {}) {
    try {
      const prompt = CREATIVE_PROMPTS.story.ending.replace('{content}', story);
      const result = await this.proModel.generateContent(prompt);
      const ending = result.response.text();
      
      logger.info('Creative: Generated ending');
      return {
        success: true,
        type: 'story_ending',
        content: ending
      };
    } catch (error) {
      logger.error('Generate ending error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create character
   */
  async createCharacter(background, options = {}) {
    try {
      const prompt = CREATIVE_PROMPTS.story.character.replace('{content}', background);
      const result = await this.proModel.generateContent(prompt);
      const character = result.response.text();
      
      logger.info('Creative: Created character');
      return {
        success: true,
        type: 'character',
        content: character
      };
    } catch (error) {
      logger.error('Create character error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Inspiration Generator ====================

  /**
   * Generate random inspiration
   */
  async getInspiration(type = '任意类型') {
    try {
      const prompt = CREATIVE_PROMPTS.inspire.random.replace('{type}', type);
      const result = await this.flashModel.generateContent(prompt);
      const inspiration = result.response.text();
      
      logger.info('Creative: Generated inspiration');
      return {
        success: true,
        type: 'inspiration',
        content: inspiration
      };
    } catch (error) {
      logger.error('Get inspiration error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate writing prompt from keywords
   */
  async generatePrompt(keywords) {
    try {
      const prompt = CREATIVE_PROMPTS.inspire.prompt.replace('{keywords}', keywords);
      const result = await this.flashModel.generateContent(prompt);
      const writingPrompt = result.response.text();
      
      logger.info('Creative: Generated prompt from keywords');
      return {
        success: true,
        type: 'prompt',
        keywords,
        content: writingPrompt
      };
    } catch (error) {
      logger.error('Generate prompt error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Brainstorm ideas
   */
  async brainstorm(topic) {
    try {
      const prompt = CREATIVE_PROMPTS.inspire.brainstorm.replace('{topic}', topic);
      const result = await this.flashModel.generateContent(prompt);
      const ideas = result.response.text();
      
      logger.info('Creative: Brainstormed ideas for:', topic);
      return {
        success: true,
        type: 'brainstorm',
        topic,
        content: ideas
      };
    } catch (error) {
      logger.error('Brainstorm error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Draft Management ====================

  /**
   * Save draft to notebook
   */
  async saveDraft(userId, draft) {
    try {
      const result = await notebookService.saveToMyNotebook(userId, draft.content, {
        title: draft.title || `创作草稿 - ${new Date().toLocaleDateString()}`,
        category: 'creative',
        tags: ['创作', draft.type || 'draft'],
        source: 'creative_service'
      });
      
      logger.info('Creative: Saved draft to notebook');
      return result;
    } catch (error) {
      logger.error('Save draft error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's creative history
   */
  async getCreativeHistory(userId, limit = 10) {
    try {
      const notes = await notebookService.getNotes(userId, 'zhouwen', {
        category: 'creative',
        limit
      });
      return notes;
    } catch (error) {
      logger.error('Get creative history error:', error);
      return [];
    }
  }

  // ==================== Style Transfer ====================

  /**
   * Rewrite in different style
   */
  async rewriteInStyle(content, targetStyle) {
    try {
      const styleDesc = STYLE_TEMPLATES[targetStyle] || targetStyle;
      
      const prompt = `你是一位风格转换专家。请将以下内容改写成${styleDesc}的风格：

原文：
${content}

要求：
1. 保持核心信息不变
2. 完全转换为目标风格
3. 语言自然流畅`;

      const result = await this.proModel.generateContent(prompt);
      const rewritten = result.response.text();
      
      logger.info('Creative: Rewrote in style:', targetStyle);
      return {
        success: true,
        type: 'style_transfer',
        original: content,
        style: targetStyle,
        content: rewritten
      };
    } catch (error) {
      logger.error('Rewrite in style error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available styles
   */
  getAvailableStyles() {
    return Object.entries(STYLE_TEMPLATES).map(([key, desc]) => ({
      id: key,
      name: key,
      description: desc
    }));
  }
}

export default new CreativeService();
