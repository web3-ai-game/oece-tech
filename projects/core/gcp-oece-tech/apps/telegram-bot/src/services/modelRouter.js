import config from '../../config/index.js';

/**
 * 智能模型路由器
 * 根据问题的字数长短和逻辑复杂程度自动选择合适的AI模型
 */
class ModelRouter {
  constructor() {
    this.wordThreshold = config.router.wordThreshold;
    this.complexityKeywords = config.router.complexityKeywords;
    this.roastKeywords = config.router.roastKeywords;
  }

  /**
   * 分析文本并选择合适的模型
   * 經濟策略: Gemini 贈金支撐，Grok 3/4 太貴不用
   * @param {string} text - 用户输入的文本
   * @returns {Object} - { model: string, provider: string, reason: string }
   */
  selectModel(text) {
    const fastModel = config.models.fast;       // gemini-2.5-flash-preview
    const bestModel = config.models.best;       // gemini-2.5-pro-preview
    const defaultModel = config.models.default; // gemini-2.5-flash-preview

    if (!text) {
      return {
        model: defaultModel,
        provider: 'gemini',
        reason: '默認快速 (Gemini 2.5 Flash)',
      };
    }

    // 1. 算命/玄學/感情分析 → 用最好的模型 (需要深度理解)
    if (this.isFortuneQuery(text)) {
      return {
        model: config.app.fortune || bestModel,
        provider: 'gemini',
        reason: '🔮 算命/玄學/感情 - Gemini 2.5 Pro',
      };
    }

    // 2. 情緒價值/傾訴/聊天 → 快速響應 (共情)
    if (this.needsEmotionalSupport(text)) {
      return {
        model: config.app.emotional || fastModel,
        provider: 'gemini',
        reason: '💝 情緒支持 - Gemini 2.5 Flash',
      };
    }

    // 3. 娱乐/吐槽模式 → 快速幽默
    if (this.isRoastMode(text)) {
      return {
        model: config.models.roast || fastModel,
        provider: 'gemini',
        reason: '😎 娱乐模式 - Gemini 2.5 Flash',
      };
    }

    // 4. 醫療/養生/中醫 → 快速但準確
    if (this.isMedicalQuery(text)) {
      return {
        model: config.app.medical || fastModel,
        provider: 'gemini',
        reason: '🏥 醫療養生 - Gemini 2.5 Flash',
      };
    }

    // 5. 複雜分析/結構化輸出 → 最好的模型
    if (this.isComplexQuery(text) || this.needsStructuredOutput(text)) {
      return {
        model: config.app.complex || bestModel,
        provider: 'gemini',
        reason: '🧠 深度分析 - Gemini 2.5 Pro',
      };
    }

    // 6. 默認快速響應
    return {
      model: defaultModel,
      provider: 'gemini',
      reason: '⚡ 快速響應 - Gemini 2.5 Flash',
    };
  }

  /**
   * 算命/玄學/感情分析 判定 - 需要深度理解和創意
   */
  isFortuneQuery(text) {
    const fortuneKeywords = [
      // 算命/玄學
      '算命', '占卜', '塔罗', '星座', '运势', '命理', '八字', '紫微', '风水', '面相', '手相',
      '生肖', '属相', '本命年', '太岁', '吉凶', '卦象', '周易', '易经', '玄学',
      // 感情/關係
      '感情', '爱情', '恋爱', '分手', '复合', '暧昧', '追求', '表白', '异地恋', '婚姻',
      '男朋友', '女朋友', '老公', '老婆', '伴侣', '对象', '相亲', '脱单',
      '他是不是', '她是不是', '喜欢我', '爱我', '在乎我', '想我',
      // 人生/命運
      '命运', '前世', '今生', '缘分', '桃花', '姻缘', '贵人', '小人',
    ];
    return fortuneKeywords.some(k => text.includes(k));
  }

  /**
   * 醫療/養生/中醫 判定
   */
  isMedicalQuery(text) {
    const medicalKeywords = [
      '中医', '養生', '保健', '食疗', '草药', '艾灸', '按摩', '理疗', '经络', '体质', '调理',
      '医学', '診斷', '症狀', '治療', '藥方', '處方', '藥材', '穴位', '推拿'
    ];
    // 短詞且含醫療/養生關鍵詞
    const wordCount = this.getWordCount(text);
    return wordCount <= 60 && medicalKeywords.some(k => text.includes(k));
  }

  /**
   * 判断是否触发喷子模式
   * @param {string} text
   * @returns {boolean}
   */
  isRoastMode(text) {
    return this.roastKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * 判断是否需要情绪价值支持 (Grok 擅长)
   * @param {string} text
   * @returns {boolean}
   */
  needsEmotionalSupport(text) {
    const emotionalKeywords = [
      '感觉', '心情', '累了', '开心', '难过', '焦虑', '压力', '烦',
      '怎么看', '怎么想', '看法', '评价', '感想', '印象',
      '聊天', '说说', '讲讲', '分享', '倾诉',
    ];
    
    // 包含情绪词汇
    if (emotionalKeywords.some(keyword => text.includes(keyword))) {
      return true;
    }

    // 语气词较多 (表示口语化、情绪化)
    const toneMarkers = (text.match(/[啊呢吧哦哈嘛呀哎唉额嗯]/g) || []).length;
    if (toneMarkers >= 2) {
      return true;
    }

    return false;
  }

  /**
   * 判断是否需要结构化/规则化输出 (Gemini 擅长)
   * @param {string} text
   * @returns {boolean}
   */
  needsStructuredOutput(text) {
    const structuredKeywords = [
      '步骤', '流程', '方法', '如何', '怎么做', '教程', '指南',
      '列出', '总结', '归纳', '整理', '分析', '对比',
      '计划', '方案', '建议', '规则', '要求', '标准',
      '代码', '程序', '算法', '公式', '计算',
    ];

    return structuredKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * 判断是否为复杂问题
   * @param {string} text
   * @returns {boolean}
   */
  isComplexQuery(text) {
    // 1. 字数超过阈值
    const wordCount = this.getWordCount(text);
    if (wordCount > this.wordThreshold) {
      return true;
    }

    // 2. 包含复杂度关键词
    if (this.complexityKeywords.some(keyword => text.includes(keyword))) {
      return true;
    }

    // 3. 多个问号（表示多重问题）
    const questionMarks = (text.match(/[?？]/g) || []).length;
    if (questionMarks >= 2) {
      return true;
    }

    // 4. 逻辑复杂度检测（包含多个逻辑连接词）
    const logicKeywords = ['因为', '所以', '但是', '然而', '虽然', '尽管', '如果', '那么', '并且', '或者'];
    const logicCount = logicKeywords.filter(keyword => text.includes(keyword)).length;
    if (logicCount >= 3) {
      return true;
    }

    return false;
  }

  /**
   * 计算文本字数（中英文混合）
   * @param {string} text
   * @returns {number}
   */
  getWordCount(text) {
    // 中文字符
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    // 英文单词
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  }

  /**
   * 获取模型选择的详细信息
   * @param {string} text
   * @returns {Object}
   */
  getModelInfo(text) {
    const selection = this.selectModel(text);
    const wordCount = this.getWordCount(text);

    return {
      ...selection,
      textInfo: {
        wordCount,
        isComplex: this.isComplexQuery(text),
        isRoast: this.isRoastMode(text),
      },
    };
  }
}

export default new ModelRouter();
