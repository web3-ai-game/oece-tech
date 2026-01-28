#!/usr/bin/env node

/**
 * 🗣️ 自然语言UI触发器
 * 监听Windsurf对话，自动识别UI相关需求并推荐资源
 */

const fs = require('fs');
const path = require('path');

class NaturalLanguageUITrigger {
  constructor() {
    this.uiKeywords = this.initializeUIKeywords();
    this.scenarioPatterns = this.initializeScenarioPatterns();
    this.responseTemplates = this.initializeResponseTemplates();
    this.conversationHistory = [];
  }

  /**
   * 初始化UI相关关键词和模式
   */
  initializeUIKeywords() {
    return {
      // 组件相关
      components: [
        '按钮', 'button', '卡片', 'card', '弹窗', 'modal', '导航', 'nav', 'navigation',
        '表单', 'form', '输入框', 'input', '下拉', 'select', 'dropdown'
      ],
      
      // 设计相关
      design: [
        'UI', '界面', '设计', 'design', '美化', '样式', 'style', '主题', 'theme',
        '颜色', 'color', '布局', 'layout', '响应式', 'responsive'
      ],
      
      // 酒店业务相关
      hotel: [
        '酒店', 'hotel', '房间', 'room', '预订', 'booking', '客人', 'guest',
        '入住', 'checkin', '退房', 'checkout', '服务', 'service'
      ],
      
      // 功能相关
      features: [
        '仪表板', 'dashboard', '图表', 'chart', '统计', 'stats', '数据', 'data',
        '搜索', 'search', '过滤', 'filter', '排序', 'sort'
      ],
      
      // 游戏娱乐相关
      gaming: [
        '游戏', 'game', '老虎机', 'slot', '娱乐', 'entertainment', '互动', 'interactive'
      ],
      
      // Web3相关
      web3: [
        '区块链', 'blockchain', '加密', 'crypto', '交易', 'trading', 'defi',
        '钱包', 'wallet', 'nft', '代币', 'token'
      ]
    };
  }

  /**
   * 初始化场景识别模式
   */
  initializeScenarioPatterns() {
    return [
      {
        pattern: /需要|想要|希望|能否|可以.*?(按钮|卡片|组件|界面)/gi,
        type: 'component_request',
        keywords: ['components']
      },
      {
        pattern: /美化|优化|改进|设计.*?(界面|UI|页面)/gi,
        type: 'design_enhancement',
        keywords: ['design', 'components']
      },
      {
        pattern: /酒店|房间|预订.*?(管理|系统|界面|功能)/gi,
        type: 'hotel_management',
        keywords: ['hotel', 'components']
      },
      {
        pattern: /仪表板|数据|统计|图表.*?(显示|展示|可视化)/gi,
        type: 'dashboard_request',
        keywords: ['features', 'components']
      },
      {
        pattern: /游戏|娱乐|互动.*?(功能|模块|组件)/gi,
        type: 'gaming_request',
        keywords: ['gaming']
      },
      {
        pattern: /区块链|Web3|加密|交易.*?(界面|功能|组件)/gi,
        type: 'web3_request',
        keywords: ['web3']
      }
    ];
  }

  /**
   * 初始化响应模板
   */
  initializeResponseTemplates() {
    return {
      component_request: {
        intro: "🎨 我在您的UI资源库中找到了相关组件：",
        suggestion: "💡 基于您的需求，我推荐使用：",
        integration: "🔧 集成代码示例："
      },
      design_enhancement: {
        intro: "✨ 为了美化界面，我从您的324+个UI资产中推荐：",
        suggestion: "🎯 这些设计资源最适合您的需求：",
        integration: "🎨 应用方式："
      },
      hotel_management: {
        intro: "🏨 针对酒店管理系统，我推荐这些专业组件：",
        suggestion: "📋 酒店业务相关的UI资源：",
        integration: "🛠️ 酒店管理集成："
      }
    };
  }

  /**
   * 分析自然语言输入
   */
  analyzeNaturalLanguage(text) {
    const analysis = {
      containsUIRequest: false,
      detectedScenarios: [],
      extractedKeywords: [],
      confidenceScore: 0,
      suggestedActions: []
    };

    // 检测场景模式
    for (const pattern of this.scenarioPatterns) {
      if (pattern.pattern.test(text)) {
        analysis.detectedScenarios.push(pattern.type);
        analysis.containsUIRequest = true;
        
        // 提取相关关键词
        for (const keywordGroup of pattern.keywords) {
          analysis.extractedKeywords.push(...this.uiKeywords[keywordGroup]);
        }
      }
    }

    // 计算置信度
    let keywordMatches = 0;
    const allKeywords = Object.values(this.uiKeywords).flat();
    
    for (const keyword of allKeywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        keywordMatches++;
        if (!analysis.extractedKeywords.includes(keyword)) {
          analysis.extractedKeywords.push(keyword);
        }
      }
    }

    analysis.confidenceScore = Math.min(keywordMatches * 10, 100);
    analysis.containsUIRequest = analysis.containsUIRequest || keywordMatches > 0;

    return analysis;
  }

  /**
   * 生成UI资源推荐
   */
  async generateRecommendations(analysis) {
    if (!analysis.containsUIRequest) {
      return null;
    }

    const SmartUIFinder = require('./ui-finder.js');
    const finder = new SmartUIFinder();
    
    const recommendations = {
      scenarios: analysis.detectedScenarios,
      confidence: analysis.confidenceScore,
      resources: [],
      integrationExamples: [],
      nextSteps: []
    };

    // 基于场景生成推荐
    for (const scenario of analysis.detectedScenarios) {
      const scenarioRecs = await this.getScenarioRecommendations(scenario, finder);
      recommendations.resources.push(...scenarioRecs.resources);
      recommendations.integrationExamples.push(...scenarioRecs.examples);
    }

    // 基于关键词搜索
    if (analysis.extractedKeywords.length > 0) {
      const query = analysis.extractedKeywords.slice(0, 3).join(' ');
      const searchResults = await finder.findComponents(query);
      
      recommendations.resources.push(...searchResults.slice(0, 5).map(result => ({
        type: 'search_result',
        path: result.relativePath,
        usage: result.usage,
        score: result.score
      })));
    }

    // 去重并排序
    recommendations.resources = this.deduplicateAndSort(recommendations.resources);
    
    return recommendations;
  }

  /**
   * 获取场景推荐
   */
  async getScenarioRecommendations(scenario, finder) {
    const scenarioMap = {
      'hotel_management': {
        query: 'hotel room booking',
        specific: [
          'ui-kit/base/Card.tsx',
          'digital-assets/icons/hospitality/hotel-amenities.svg',
          'frontend/src/pages/HomePage.tsx'
        ]
      },
      'dashboard_request': {
        query: 'dashboard chart stats',
        specific: [
          'frontend/src/components/Stats/',
          'web3-components/js/charts.js',
          'digital-assets/icons/finance/stock-charts.svg'
        ]
      },
      'design_enhancement': {
        query: 'theme background design',
        specific: [
          'digital-assets/backgrounds/',
          'web3-components/styles/',
          'ui-kit/base/'
        ]
      },
      'gaming_request': {
        query: 'game slot interactive',
        specific: [
          'game-pool/slot-machine.html',
          'digital-assets/casino/',
          'game-pool/airdrop-rush.html'
        ]
      }
    };

    const config = scenarioMap[scenario];
    if (!config) return { resources: [], examples: [] };

    const searchResults = await finder.findComponents(config.query);
    const resources = [
      ...config.specific.map(path => ({
        type: 'scenario_specific',
        path: path,
        usage: this.generateUsageExample(path),
        score: 100
      })),
      ...searchResults.slice(0, 3).map(result => ({
        type: 'scenario_search',
        path: result.relativePath,
        usage: result.usage,
        score: result.score
      }))
    ];

    return { resources, examples: [] };
  }

  /**
   * 生成使用示例
   */
  generateUsageExample(resourcePath) {
    const ext = path.extname(resourcePath);
    const name = path.basename(resourcePath, ext);
    
    if (ext === '.tsx' || ext === '.jsx') {
      return `import { ${name} } from './hotel-ui/${resourcePath}';
      
// 使用组件
<${name} variant="primary" />`;
    } else if (ext === '.svg') {
      return `import ${name}Icon from './hotel-ui/${resourcePath}';

// 作为图标使用  
<img src={${name}Icon} alt="${name}" />`;
    } else {
      return `// 引用资源
import asset from './hotel-ui/${resourcePath}';`;
    }
  }

  /**
   * 去重并排序
   */
  deduplicateAndSort(resources) {
    const seen = new Set();
    const unique = resources.filter(resource => {
      if (seen.has(resource.path)) return false;
      seen.add(resource.path);
      return true;
    });
    
    return unique.sort((a, b) => b.score - a.score).slice(0, 8);
  }

  /**
   * 格式化响应
   */
  formatResponse(recommendations, originalText) {
    if (!recommendations) {
      return null;
    }

    const scenario = recommendations.scenarios[0] || 'component_request';
    const template = this.responseTemplates[scenario] || this.responseTemplates.component_request;
    
    let response = `${template.intro}\n\n`;
    
    recommendations.resources.forEach((resource, index) => {
      response += `**${index + 1}. 📁 ${resource.path}**\n`;
      response += `\`\`\`${this.getLanguageHint(resource.path)}\n${resource.usage}\n\`\`\`\n\n`;
    });

    if (recommendations.confidence < 70) {
      response += `💡 **提示**: 如需更精确的推荐，请尝试：\n`;
      response += `- 使用 \`@ui-search "具体关键词"\`\n`;
      response += `- 或 \`@ui-recommend "具体场景"\`\n\n`;
    }

    response += `🎯 **置信度**: ${recommendations.confidence}%`;
    
    return response;
  }

  /**
   * 获取代码语言提示
   */
  getLanguageHint(filePath) {
    const ext = path.extname(filePath);
    const langMap = {
      '.tsx': 'typescript',
      '.jsx': 'javascript', 
      '.ts': 'typescript',
      '.js': 'javascript',
      '.css': 'css',
      '.svg': 'xml',
      '.html': 'html'
    };
    return langMap[ext] || 'text';
  }

  /**
   * 处理Windsurf对话输入
   */
  async processConversation(message) {
    this.conversationHistory.push({
      timestamp: new Date().toISOString(),
      message: message,
      type: 'user'
    });

    const analysis = this.analyzeNaturalLanguage(message);
    
    if (analysis.containsUIRequest) {
      console.log('🎯 检测到UI相关需求，正在生成推荐...');
      
      const recommendations = await this.generateRecommendations(analysis);
      const response = this.formatResponse(recommendations, message);
      
      if (response) {
        this.conversationHistory.push({
          timestamp: new Date().toISOString(),
          message: response,
          type: 'ui_assistant',
          analysis: analysis,
          recommendations: recommendations
        });
        
        // 保存对话历史
        this.saveConversationHistory();
        
        return response;
      }
    }
    
    return null;
  }

  /**
   * 保存对话历史
   */
  saveConversationHistory() {
    const historyPath = path.join(__dirname, '../.cache/ui-conversation-history.json');
    fs.writeFileSync(historyPath, JSON.stringify(this.conversationHistory, null, 2));
  }
}

// 导出和CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const trigger = new NaturalLanguageUITrigger();
  
  switch (command) {
    case 'test':
      const testMessage = args[1] || "我想美化一下酒店管理界面，需要一些按钮和卡片组件";
      trigger.processConversation(testMessage).then(response => {
        if (response) {
          console.log('\n🎨 自动UI推荐:\n');
          console.log(response);
        } else {
          console.log('❌ 未检测到UI相关需求');
        }
      });
      break;
      
    case 'analyze':
      const analyzeText = args[1] || "帮我设计一个现代化的酒店预订界面";
      const analysis = trigger.analyzeNaturalLanguage(analyzeText);
      console.log('🔍 语言分析结果:');
      console.log(JSON.stringify(analysis, null, 2));
      break;
      
    default:
      console.log(`
🗣️ 自然语言UI触发器

使用方法:
  node natural-language-ui-trigger.js test "测试消息"
  node natural-language-ui-trigger.js analyze "分析文本"

测试示例:
  "我想美化一下酒店管理界面"
  "需要添加一些按钮和卡片组件" 
  "帮我设计一个现代化的仪表板"
  "想要集成一些游戏功能"
      `);
      break;
  }
}

module.exports = NaturalLanguageUITrigger;
