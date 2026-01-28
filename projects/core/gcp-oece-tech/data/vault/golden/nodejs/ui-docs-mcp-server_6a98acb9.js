#!/usr/bin/env node

/**
 * 📚 UI文档专用MCP服务器
 * 专门索引UI_ASSETS_INDEX.md和UI_INTEGRATION_GUIDE.md
 * 高效、精准、低token消耗
 */

const fs = require('fs');
const path = require('path');

class UIDocumentationMCPServer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.docsIndex = new Map();
    this.initializeIndex();
  }

  /**
   * 初始化文档索引
   */
  initializeIndex() {
    const uiDocs = {
      'UI_ASSETS_INDEX.md': {
        path: path.join(this.projectRoot, 'UI_ASSETS_INDEX.md'),
        type: 'assets_catalog',
        priority: 'high',
        description: '324+个UI资产的完整目录和分类'
      },
      'UI_INTEGRATION_GUIDE.md': {
        path: path.join(this.projectRoot, 'UI_INTEGRATION_GUIDE.md'),
        type: 'integration_guide', 
        priority: 'high',
        description: '使用方法、集成案例和最佳实践'
      }
    };

    for (const [docName, docInfo] of Object.entries(uiDocs)) {
      if (fs.existsSync(docInfo.path)) {
        const content = fs.readFileSync(docInfo.path, 'utf8');
        this.docsIndex.set(docName, {
          ...docInfo,
          content: content,
          sections: this.extractSections(content),
          lastModified: fs.statSync(docInfo.path).mtime,
          keywords: this.extractKeywords(content)
        });
      }
    }

    console.log(`📚 已索引 ${this.docsIndex.size} 个UI文档`);
  }

  /**
   * 提取文档章节
   */
  extractSections(content) {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检测标题
      if (line.startsWith('#')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        
        currentSection = {
          title: line.replace(/^#+\s*/, ''),
          level: line.match(/^#+/)[0].length,
          startLine: i,
          content: '',
          codeBlocks: [],
          examples: []
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
        
        // 提取代码块
        if (line.startsWith('```')) {
          const codeStart = i;
          while (i < lines.length && !lines[++i].startsWith('```')) {
            currentSection.content += lines[i] + '\n';
          }
          currentSection.codeBlocks.push({
            start: codeStart,
            end: i,
            language: lines[codeStart].replace('```', ''),
            code: lines.slice(codeStart + 1, i).join('\n')
          });
        }
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * 提取关键词
   */
  extractKeywords(content) {
    const uiKeywords = [
      // 组件类型
      'button', 'card', 'modal', 'input', 'navigation', 'layout',
      '按钮', '卡片', '弹窗', '导航', '布局',
      
      // 功能场景  
      'hotel', 'dashboard', 'gaming', 'web3', 'authentication',
      '酒店', '仪表板', '游戏', '认证', '管理',
      
      // 技术类型
      'react', 'svg', 'css', 'typescript', 'javascript',
      'tsx', 'jsx', '组件', '样式',
      
      // 资源类型
      'icons', 'backgrounds', 'assets', 'components',
      '图标', '背景', '资产', '组件库'
    ];

    const foundKeywords = [];
    const contentLower = content.toLowerCase();
    
    for (const keyword of uiKeywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    }

    return [...new Set(foundKeywords)];
  }

  /**
   * 智能搜索UI文档
   */
  searchDocuments(query, options = {}) {
    const results = [];
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(' ').filter(term => term.length > 1);

    for (const [docName, docData] of this.docsIndex.entries()) {
      let score = 0;
      const matches = [];

      // 搜索关键词匹配
      for (const keyword of docData.keywords) {
        if (queryTerms.some(term => keyword.toLowerCase().includes(term))) {
          score += 10;
        }
      }

      // 搜索章节标题匹配
      for (const section of docData.sections) {
        const titleLower = section.title.toLowerCase();
        for (const term of queryTerms) {
          if (titleLower.includes(term)) {
            score += 15;
            matches.push({
              type: 'section_title',
              section: section.title,
              content: section.content.substring(0, 200) + '...'
            });
          }
        }

        // 搜索内容匹配
        const contentLower = section.content.toLowerCase();
        for (const term of queryTerms) {
          if (contentLower.includes(term)) {
            score += 5;
            
            // 提取匹配的上下文
            const index = contentLower.indexOf(term);
            const start = Math.max(0, index - 50);
            const end = Math.min(contentLower.length, index + 100);
            const context = section.content.substring(start, end);
            
            matches.push({
              type: 'content_match',
              section: section.title,
              context: '...' + context + '...',
              term: term
            });
          }
        }
      }

      if (score > 0) {
        results.push({
          document: docName,
          type: docData.type,
          score: score,
          matches: matches.slice(0, 3), // 限制匹配数量
          summary: this.generateSummary(docData, queryTerms)
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * 获取特定场景的推荐
   */
  getScenarioRecommendations(scenario) {
    const scenarioMappings = {
      'hotel-management': {
        sections: ['酒店管理专用', '🏨 酒店管理', 'hotel'],
        keywords: ['hotel', 'room', 'booking', '酒店', '房间', '预订']
      },
      'dashboard': {
        sections: ['仪表板', 'dashboard', '数据可视化'],
        keywords: ['dashboard', 'chart', 'stats', '图表', '数据']
      },
      'gaming': {
        sections: ['游戏', 'game', '娱乐'],
        keywords: ['game', 'slot', 'casino', '游戏', '老虎机']
      },
      'components': {
        sections: ['组件', 'component', 'UI组件库'],
        keywords: ['button', 'card', 'modal', '按钮', '组件']
      }
    };

    const mapping = scenarioMappings[scenario];
    if (!mapping) {
      return this.searchDocuments(scenario);
    }

    const query = mapping.keywords.join(' ');
    return this.searchDocuments(query);
  }

  /**
   * 生成摘要
   */
  generateSummary(docData, queryTerms) {
    const relevantSections = docData.sections.filter(section => {
      const sectionLower = (section.title + section.content).toLowerCase();
      return queryTerms.some(term => sectionLower.includes(term));
    });

    if (relevantSections.length === 0) {
      return `来自 ${docData.type} 的相关信息`;
    }

    const topSections = relevantSections.slice(0, 3);
    return `包含: ${topSections.map(s => s.title).join(', ')}`;
  }

  /**
   * 提取具体的使用示例
   */
  extractUsageExamples(docName, query) {
    const docData = this.docsIndex.get(docName);
    if (!docData) return [];

    const examples = [];
    
    for (const section of docData.sections) {
      for (const codeBlock of section.codeBlocks) {
        if (codeBlock.code.toLowerCase().includes(query.toLowerCase())) {
          examples.push({
            section: section.title,
            language: codeBlock.language,
            code: codeBlock.code,
            description: this.extractCodeDescription(section.content, codeBlock.start)
          });
        }
      }
    }

    return examples.slice(0, 5);
  }

  /**
   * 提取代码描述
   */
  extractCodeDescription(sectionContent, codeStart) {
    const lines = sectionContent.split('\n');
    const codeLineIndex = lines.findIndex((line, index) => line.startsWith('```'));
    
    if (codeLineIndex > 0) {
      // 查找代码块前的描述
      for (let i = codeLineIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
          return line;
        }
      }
    }
    
    return '使用示例';
  }

  /**
   * 格式化响应
   */
  formatResponse(results, query) {
    if (results.length === 0) {
      return `❌ 在UI文档中未找到关于 "${query}" 的相关信息`;
    }

    let response = `📚 在UI文档中找到 ${results.length} 个相关结果：\n\n`;

    results.slice(0, 3).forEach((result, index) => {
      response += `**${index + 1}. ${result.document}** (${result.type})\n`;
      response += `📊 相关度: ${result.score}分 | ${result.summary}\n`;
      
      if (result.matches.length > 0) {
        response += `🎯 匹配内容:\n`;
        result.matches.forEach(match => {
          if (match.type === 'section_title') {
            response += `   • 章节: "${match.section}"\n`;
          } else {
            response += `   • ${match.context.replace(/\n/g, ' ')}\n`;
          }
        });
      }
      
      // 添加使用示例
      const examples = this.extractUsageExamples(result.document, query);
      if (examples.length > 0) {
        response += `💻 代码示例:\n\`\`\`${examples[0].language}\n${examples[0].code}\`\`\`\n`;
      }
      
      response += `\n`;
    });

    return response;
  }
}

// CLI接口和服务器模式
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const server = new UIDocumentationMCPServer();
  
  switch (command) {
    case 'search':
      const query = args[1] || 'button hotel';
      const results = server.searchDocuments(query);
      console.log(server.formatResponse(results, query));
      break;
      
    case 'recommend':
      const scenario = args[1] || 'hotel-management';
      const recommendations = server.getScenarioRecommendations(scenario);
      console.log(server.formatResponse(recommendations, scenario));
      break;
      
    case 'server':
      // MCP服务器模式
      console.log('📚 UI文档MCP服务器启动中...');
      // 实现MCP协议监听
      break;
      
    default:
      console.log(`
📚 UI文档专用MCP服务器

使用方法:
  node ui-docs-mcp-server.js search "关键词"     # 搜索UI文档
  node ui-docs-mcp-server.js recommend "场景"   # 场景推荐
  node ui-docs-mcp-server.js server            # 启动MCP服务器

示例:
  node ui-docs-mcp-server.js search "hotel button"
  node ui-docs-mcp-server.js recommend "dashboard"
      `);
      break;
  }
}

module.exports = UIDocumentationMCPServer;
