/**
 * 智能模型路由器 v3.0
 * 
 * 改進:
 * - 基於語義分析而非簡單字數
 * - 排除昂貴模型
 * - 75% Gemini / 25% Grok (減少 Grok 調用)
 * - 向量記憶引用
 */

import { AVAILABLE_MODELS, TASK_MODEL_MAP } from '../../config/models.js';
import logger from '../utils/logger.js';

// 排除的昂貴模型 (絕對不使用)
const EXCLUDED_MODEL_LIST = [
  'grok-4-0709',      // $3/$15 太貴
  'grok-3',           // $3/$15 太貴
  'grok-2-vision-1212', // $2/$10
  'grok-2-1212',      // $2/$10
  'grok-code-fast-1', // 不寫代碼
  'grok-4-1-fast-reasoning' // 容易限流
];

// 模型回退鏈
export const MODEL_FALLBACK_CHAIN = {
  // Gemini 回退鏈
  'gemini-2.5-pro': ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'],
  'gemini-2.5-flash': ['gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-exp'],
  'gemini-2.0-flash': ['gemini-2.5-flash-lite', 'gemini-2.0-flash-exp'],
  
  // Grok 回退鏈 (便宜的優先)
  'grok-4-fast-non-reasoning': ['grok-3-mini', 'gemini-2.5-flash'],
  'grok-3-mini': ['grok-4-fast-non-reasoning', 'gemini-2.5-flash'],
  
  // 默認回退
  'default': ['gemini-2.5-flash', 'gemini-2.0-flash', 'grok-3-mini']
};

class SmartRouter {
  constructor() {
    // 使用計數器 (用於平衡 50/30/20 比例)
    this.usageCounter = {
      gemini: 0,
      grok: 0,
      total: 0
    };
    
    // 語義關鍵詞庫
    this.semanticPatterns = {
      // 複雜推理 -> Gemini Pro
      reasoning: {
        keywords: [
          '為什麼', '怎麼理解', '分析', '深入', '言外之意', '潛台詞',
          '背後含義', '人際關係', '複雜', '矛盾', '兩難', '選擇',
          '比較', '優缺點', '利弊', '建議', '該怎麼辦'
        ],
        patterns: [
          /如何.*理解/,
          /什麼.*意思/,
          /為什麼.*會/,
          /怎麼.*看待/,
          /.*和.*哪個好/,
          /.*還是.*/
        ],
        weight: 3
      },
      
      // 養生醫學 -> Gemini Pro/Flash
      health: {
        keywords: [
          '養生', '中醫', '西醫', '穴位', '經絡', '氣血', '陰陽',
          '五行', '藥材', '食療', '調理', '症狀', '治療', '預防',
          '保健', '健康', '疾病', '藥物', '副作用', '禁忌',
          '胃', '肝', '腎', '心', '肺', '脾', '膽', '腸',
          '頭痛', '失眠', '便秘', '反酸', '幽門螺桿菌'
        ],
        patterns: [
          /.*痛.*怎麼辦/,
          /.*吃什麼好/,
          /.*能不能吃/,
          /.*有什麼.*功效/
        ],
        weight: 2.5
      },
      
      // 情緒支持 -> Grok Fast
      emotional: {
        keywords: [
          '難過', '開心', '煩', '累', '壓力', '焦慮', '擔心',
          '害怕', '生氣', '委屈', '孤獨', '想念', '感動',
          '心情', '情緒', '感覺', '覺得'
        ],
        patterns: [
          /我.*感覺/,
          /我.*覺得/,
          /好.*啊/,
          /真的.*嗎/
        ],
        weight: 2
      },
      
      // 幽默娛樂 -> Grok Mini
      humor: {
        keywords: [
          '搞笑', '笑話', '段子', '吐槽', '噴', '娛樂', '有趣',
          '好玩', '無聊', '打發時間', '聊聊', '隨便說說'
        ],
        patterns: [
          /來個.*笑話/,
          /說點.*有趣/,
          /逗.*開心/
        ],
        weight: 2
      },
      
      // 寫作創作 -> Gemini Pro
      writing: {
        keywords: [
          '寫', '作文', '文章', '故事', '小說', '詩', '散文',
          '擴寫', '續寫', '改寫', '潤色', '修改', '創作',
          '靈感', '構思', '大綱', '開頭', '結尾'
        ],
        patterns: [
          /幫我寫/,
          /怎麼寫/,
          /寫.*關於/
        ],
        weight: 2.5
      },
      
      // 算命玄學 -> Gemini Pro
      fortune: {
        keywords: [
          '算命', '運勢', '星座', '塔羅', '八字', '風水',
          '吉凶', '預測', '未來', '命運', '緣分', '桃花'
        ],
        patterns: [
          /今天.*運勢/,
          /.*會.*嗎/
        ],
        weight: 2
      },
      
      // 生活常識 -> Gemini Flash
      lifestyle: {
        keywords: [
          '怎麼做', '如何', '方法', '技巧', '竅門', '小常識',
          '生活', '日常', '實用', '冷知識'
        ],
        patterns: [
          /怎麼.*做/,
          /如何.*好/,
          /有什麼.*方法/
        ],
        weight: 1.5
      },
      
      // 簡單對話 -> Gemini Flash / Grok Fast
      casual: {
        keywords: [
          '你好', '嗨', '早', '晚安', '謝謝', '好的', '嗯',
          '哦', '是嗎', '真的', '然後呢'
        ],
        patterns: [
          /^.{1,10}$/,  // 很短的消息
          /^(hi|hello|hey)/i
        ],
        weight: 1
      }
    };
  }

  /**
   * 分析消息並選擇最佳模型
   */
  async route(message, context = {}) {
    const analysis = this.analyzeMessage(message);
    const selectedModel = this.selectModel(analysis, context);
    
    // 更新使用計數
    this.updateUsageCounter(selectedModel.provider);
    
    return {
      model: selectedModel.model,
      modelId: selectedModel.modelId,
      provider: selectedModel.provider,
      reason: selectedModel.reason,
      analysis: analysis,
      icon: selectedModel.icon
    };
  }

  /**
   * 語義分析消息
   */
  analyzeMessage(message) {
    const scores = {};
    const text = message.toLowerCase();
    
    for (const [category, config] of Object.entries(this.semanticPatterns)) {
      let score = 0;
      
      // 關鍵詞匹配
      for (const keyword of config.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += config.weight;
        }
      }
      
      // 正則匹配
      for (const pattern of config.patterns) {
        if (pattern.test(text)) {
          score += config.weight * 1.5;
        }
      }
      
      scores[category] = score;
    }
    
    // 找出最高分類別
    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    const topCategory = sortedCategories[0][0];
    const topScore = sortedCategories[0][1];
    
    // 計算複雜度
    const complexity = this.calculateComplexity(message, scores);
    
    return {
      category: topCategory,
      score: topScore,
      allScores: scores,
      complexity: complexity,
      messageLength: message.length,
      hasQuestion: message.includes('?') || message.includes('？'),
      hasMultipleQuestions: (message.match(/[?？]/g) || []).length > 1
    };
  }

  /**
   * 計算複雜度
   */
  calculateComplexity(message, scores) {
    let complexity = 0;
    
    // 長度因素
    if (message.length > 100) complexity += 1;
    if (message.length > 300) complexity += 1;
    
    // 多個高分類別 = 複雜
    const highScoreCategories = Object.values(scores).filter(s => s > 2).length;
    complexity += highScoreCategories * 0.5;
    
    // 特定高複雜度類別
    if (scores.reasoning > 3) complexity += 2;
    if (scores.health > 3) complexity += 1.5;
    if (scores.writing > 3) complexity += 1.5;
    
    return Math.min(complexity, 5); // 最高5分
  }

  /**
   * 選擇模型
   */
  selectModel(analysis, context) {
    const { category, complexity, score } = analysis;
    
    // 檢查是否需要強制使用特定模型
    if (context.forceModel) {
      return this.getModelInfo(context.forceModel, '用戶指定');
    }
    
    // 根據類別和複雜度選擇
    let modelKey;
    let reason;
    
    // 高複雜度 -> Gemini Pro
    if (complexity >= 3) {
      modelKey = 'gemini.pro';
      reason = '深度分析';
    }
    // 養生醫學 -> Gemini Pro (重要話題)
    else if (category === 'health' && score > 2) {
      modelKey = 'gemini.pro';
      reason = '養生醫學';
    }
    // 寫作創作 -> Gemini Pro
    else if (category === 'writing' && score > 2) {
      modelKey = 'gemini.pro';
      reason = '寫作輔導';
    }
    // 複雜推理 -> Gemini Pro
    else if (category === 'reasoning' && score > 2) {
      modelKey = 'gemini.pro';
      reason = '複雜推理';
    }
    // 情緒支持 -> Grok Fast
    else if (category === 'emotional') {
      modelKey = 'grok.fast';
      reason = '情緒支持';
    }
    // 幽默娛樂 -> Grok Mini
    else if (category === 'humor') {
      modelKey = 'grok.mini';
      reason = '幽默娛樂';
    }
    // 算命玄學 -> Gemini Pro (需要深度)
    else if (category === 'fortune') {
      modelKey = 'gemini.pro';
      reason = '玄學分析';
    }
    // 默認 -> 根據比例選擇
    else {
      modelKey = this.selectByRatio();
      reason = '日常對話';
    }
    
    return this.getModelInfo(modelKey, reason);
  }

  /**
   * 根據 75/25 比例選擇 (減少 Grok 調用)
   */
  selectByRatio() {
    const { gemini, grok, total } = this.usageCounter;
    
    if (total === 0) return 'gemini.flash';
    
    const grokRatio = grok / total;
    
    // 目標: Gemini 75%, Grok 25%
    if (grokRatio < 0.25) {
      // 只有 25% 機會用 Grok
      return Math.random() < 0.25 ? 'grok.mini' : 'gemini.flash';
    } else {
      return 'gemini.flash'; // 默認 Gemini
    }
  }

  /**
   * 獲取模型信息
   */
  getModelInfo(modelKey, reason) {
    const [provider, type] = modelKey.split('.');
    const modelConfig = AVAILABLE_MODELS[provider]?.[type];
    
    if (!modelConfig) {
      // 回退到默認
      return {
        model: 'Gemini 2.5 Flash',
        modelId: 'gemini-2.5-flash',
        provider: 'gemini',
        reason: reason,
        icon: '⚡'
      };
    }
    
    return {
      model: modelConfig.name,
      modelId: modelConfig.id,
      provider: provider,
      reason: reason,
      icon: modelConfig.icon
    };
  }

  /**
   * 更新使用計數
   */
  updateUsageCounter(provider) {
    this.usageCounter.total++;
    if (provider === 'gemini') {
      this.usageCounter.gemini++;
    } else if (provider === 'grok') {
      this.usageCounter.grok++;
    }
    
    // 每100次重置，避免數字過大
    if (this.usageCounter.total >= 100) {
      this.usageCounter = {
        gemini: Math.round(this.usageCounter.gemini / 2),
        grok: Math.round(this.usageCounter.grok / 2),
        total: 50
      };
    }
  }

  /**
   * 檢查模型是否被排除
   */
  isExcluded(modelId) {
    return EXCLUDED_MODEL_LIST.includes(modelId);
  }

  /**
   * 獲取回退模型列表
   */
  getFallbackModels(modelId) {
    return MODEL_FALLBACK_CHAIN[modelId] || MODEL_FALLBACK_CHAIN['default'];
  }

  /**
   * 獲取使用統計
   */
  getStats() {
    const { gemini, grok, total } = this.usageCounter;
    return {
      total,
      gemini: { count: gemini, ratio: total ? (gemini / total * 100).toFixed(1) + '%' : '0%' },
      grok: { count: grok, ratio: total ? (grok / total * 100).toFixed(1) + '%' : '0%' }
    };
  }
}

export default new SmartRouter();
