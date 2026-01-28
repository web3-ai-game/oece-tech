/**
 * 签证咨询服务 - 母亲专用
 * 
 * 功能:
 * - 泰国签证政策查询
 * - 签证类型比较
 * - 移民政策解读
 * - 深度分析 (Gemini 2.5 Pro)
 * 
 * 触发: 关键词「签证」「visa」「移民」「入境」「续签」
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

// 签证相关关键词
export const VISA_KEYWORDS = [
  '签证', '簽證', 'visa', 'VISA',
  '移民', '入境', '出境', '续签', '續簽',
  '落地签', '落地簽', '免签', '免簽',
  '工作签', '工作簽', '养老签', '養老簽',
  '精英签', '精英簽', 'elite',
  '泰国签证', '泰國簽證',
  '长期签', '長期簽', 'LTR',
  '90天', '60天', '30天',
  '延期', '过期', '過期'
];

// 泰国签证知识库
const THAILAND_VISA_KB = {
  types: {
    tourist: {
      name: '旅游签证',
      duration: '60天，可延期30天',
      cost: '约1000泰铢',
      requirements: '护照、照片、机票、酒店预订'
    },
    visa_on_arrival: {
      name: '落地签',
      duration: '15天（中国公民免费至2025年底）',
      cost: '免费（优惠期）',
      requirements: '护照、照片、回程机票、住宿证明、现金10000泰铢'
    },
    visa_exemption: {
      name: '免签入境',
      duration: '中国公民60天（2024年3月起永久免签）',
      cost: '免费',
      requirements: '护照有效期6个月以上'
    },
    non_immigrant_o: {
      name: 'Non-O 签证（养老/陪伴）',
      duration: '90天，可延期1年',
      cost: '约2000泰铢',
      requirements: '50岁以上，银行存款80万泰铢或月收入6.5万泰铢'
    },
    elite: {
      name: '精英签证',
      duration: '5-20年',
      cost: '60万-200万泰铢',
      requirements: '无犯罪记录，支付会员费'
    },
    ltr: {
      name: 'LTR 长期居留签证',
      duration: '10年',
      cost: '约5万泰铢',
      requirements: '高收入人士/退休人士/远程工作者/专业人才'
    }
  },
  latest_policies: [
    '2024年3月1日起，中国公民赴泰永久免签60天',
    '落地签免费政策延长至2025年底',
    '精英签证新增Flexible One选项',
    'LTR签证持有者可享受17%个人所得税优惠'
  ]
};

class VisaService {
  constructor() {
    this.gemini = null;
    this.grok = null;
    this.initialized = false;
  }

  /**
   * 初始化
   */
  async init() {
    try {
      const geminiKey = config.gemini?.apiKey || config.apiKeys?.gemini;
      const grokKey = config.grok?.apiKey || config.apiKeys?.grok;

      if (geminiKey) {
        this.gemini = new GoogleGenerativeAI(geminiKey);
        logger.info('Visa Service: Gemini initialized');
      }

      if (grokKey) {
        this.grok = new OpenAI({
          apiKey: grokKey,
          baseURL: 'https://api.x.ai/v1'
        });
        logger.info('Visa Service: Grok initialized');
      }

      this.initialized = true;
      return true;
    } catch (error) {
      logger.error('Visa Service init error:', error);
      return false;
    }
  }

  /**
   * 检测是否是签证相关问题
   */
  isVisaQuery(text) {
    const lowerText = text.toLowerCase();
    return VISA_KEYWORDS.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
  }

  /**
   * 处理签证咨询 - 完全使用 Grok
   * 
   * 模型分配策略:
   * - Grok: 签证咨询、思维联想、深度分析（燃烧 token）
   * - Gemini 2.5 Flash: 长上下文处理
   * - Gemini 2.5 Flash-Lite: 向量记忆、廉价任务
   */
  async handleVisaQuery(question, userName = '') {
    logger.info(`Visa query from ${userName}: ${question}`);

    try {
      // 完全使用 Grok 处理签证问题
      const analysis = await this.analyzeWithGrok(question, userName);
      
      return {
        success: true,
        response: analysis.response,
        expandedQuestions: analysis.expandedQuestions || [],
        model: 'Grok-3',
        mode: 'visa_consultation'
      };
    } catch (error) {
      logger.error('Visa query error:', error);
      
      // 回退到基础回答
      return {
        success: false,
        response: this.getBasicVisaInfo(question),
        model: 'fallback',
        mode: 'visa_consultation'
      };
    }
  }

  /**
   * 使用 Grok 完整处理签证问题
   */
  async analyzeWithGrok(question, userName) {
    if (!this.grok) {
      throw new Error('Grok not initialized');
    }

    const knowledgeBase = JSON.stringify(THAILAND_VISA_KB, null, 2);

    const response = await this.grok.chat.completions.create({
      model: 'grok-3-mini',
      messages: [
        {
          role: 'system',
          content: `你是泰国签证和移民政策专家。请用**简体中文**详细回答用户的签证问题。

## 泰国签证知识库
${knowledgeBase}

## 回答要求
1. **语言**: 必须使用简体中文
2. **格式**: 使用 Markdown 格式（标题、列表、表格）
3. **深度**: 详细分析，给出具体建议
4. **实用**: 包含费用、材料、时间等实用信息
5. **时效**: 注明政策的时效性

## 回答结构
### 📋 问题概述
[简要说明]

### 🔍 详细分析
[深入分析]

### ✅ 建议方案
[具体建议]

### ⚠️ 注意事项
[重要提醒]`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    });

    const text = response.choices[0]?.message?.content || '';
    
    // 提取扩展问题
    const expandedQuestions = this.extractRelatedQuestions(text);

    return {
      response: text,
      expandedQuestions
    };
  }

  /**
   * 提取相关问题
   */
  extractRelatedQuestions(text) {
    const questions = [];
    // 简单提取可能的相关问题
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.includes('？') && line.length < 50) {
        questions.push(line.replace(/^[-•\d.]\s*/, '').trim());
      }
    }
    return questions.slice(0, 3);
  }

  /**
   * Grok 扩散关键词
   */
  async expandWithGrok(question) {
    if (!this.grok) {
      return [question];
    }

    try {
      const response = await this.grok.chat.completions.create({
        model: 'grok-3-mini',
        messages: [
          {
            role: 'system',
            content: `你是签证问题分析专家。用户问了一个关于泰国签证的问题。
请扩散思考，生成3-5个相关的深入问题，帮助全面分析这个问题。

输出格式（JSON数组）:
["问题1", "问题2", "问题3"]

只输出JSON，不要其他内容。`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const text = response.choices[0]?.message?.content || '[]';
      try {
        return JSON.parse(text);
      } catch {
        return [question];
      }
    } catch (error) {
      logger.error('Grok expand error:', error.message);
      return [question];
    }
  }

  /**
   * Gemini 2.5 Pro 深度分析
   */
  async analyzeWithGeminiPro(originalQuestion, expandedQuestions) {
    if (!this.gemini) {
      return this.getBasicVisaInfo(originalQuestion);
    }

    // 使用可用的 Gemini Pro 模型
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.0-flash',  // 稳定可用的模型
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192  // 长文输出
      }
    });

    const knowledgeBase = JSON.stringify(THAILAND_VISA_KB, null, 2);
    const questions = expandedQuestions.join('\n- ');

    const prompt = `你是泰国签证和移民政策专家。请用**简体中文**回答以下问题。

## 用户原始问题
${originalQuestion}

## 相关扩展问题
- ${questions}

## 泰国签证知识库
\`\`\`json
${knowledgeBase}
\`\`\`

## 回答要求
1. **语言**: 必须使用简体中文
2. **格式**: 使用 Markdown 格式，包含标题、列表、表格
3. **深度**: 详细分析，不要敷衍
4. **实用**: 给出具体建议和注意事项
5. **时效**: 注明政策的时效性

## 回答结构
### 📋 问题概述
[简要说明问题]

### 🔍 详细分析
[深入分析各个方面]

### 📊 签证类型对比（如适用）
| 类型 | 时长 | 费用 | 要求 |
|------|------|------|------|
| ... | ... | ... | ... |

### ✅ 建议方案
[具体建议]

### ⚠️ 注意事项
[重要提醒]

### 📅 最新政策
[相关最新政策]

请开始回答：`;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      logger.error('Gemini Pro analysis error:', error.message);
      return this.getBasicVisaInfo(originalQuestion);
    }
  }

  /**
   * 基础签证信息（回退用）
   */
  getBasicVisaInfo(question) {
    const lowerQ = question.toLowerCase();
    
    let response = `## 🛂 泰国签证咨询\n\n`;
    
    if (lowerQ.includes('免签') || lowerQ.includes('免簽')) {
      response += `### 中国公民免签政策\n\n`;
      response += `- **生效日期**: 2024年3月1日起永久生效\n`;
      response += `- **停留时长**: 60天\n`;
      response += `- **入境要求**: 护照有效期6个月以上\n`;
      response += `- **可延期**: 可在泰国境内延期30天\n\n`;
    }
    
    if (lowerQ.includes('落地签') || lowerQ.includes('落地簽')) {
      response += `### 落地签政策\n\n`;
      response += `- **费用**: 免费（优惠期至2025年底）\n`;
      response += `- **停留时长**: 15天\n`;
      response += `- **所需材料**: 护照、照片、回程机票、住宿证明\n`;
      response += `- **现金要求**: 10,000泰铢或等值货币\n\n`;
    }
    
    if (lowerQ.includes('养老') || lowerQ.includes('養老') || lowerQ.includes('退休')) {
      response += `### 养老签证 (Non-O)\n\n`;
      response += `- **年龄要求**: 50岁以上\n`;
      response += `- **资金要求**: 银行存款80万泰铢 或 月收入6.5万泰铢\n`;
      response += `- **有效期**: 90天，可延期1年\n`;
      response += `- **每90天需报到一次\n\n`;
    }
    
    if (lowerQ.includes('精英') || lowerQ.includes('elite')) {
      response += `### 精英签证\n\n`;
      response += `- **有效期**: 5-20年\n`;
      response += `- **费用**: 60万-200万泰铢\n`;
      response += `- **优势**: 无需续签、VIP服务、机场接送\n\n`;
    }
    
    response += `### ⚠️ 注意事项\n\n`;
    response += `- 政策可能随时变化，建议出行前确认最新信息\n`;
    response += `- 可咨询泰国大使馆或官方网站\n`;
    response += `- 建议提前准备好所有材料\n`;
    
    return response;
  }

  /**
   * 获取签证类型列表
   */
  getVisaTypes() {
    return THAILAND_VISA_KB.types;
  }

  /**
   * 获取最新政策
   */
  getLatestPolicies() {
    return THAILAND_VISA_KB.latest_policies;
  }
}

export default new VisaService();
