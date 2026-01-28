#!/usr/bin/env node

/**
 * 🌊 Windsurf关键词触发MCP服务器
 * 深度集成Windsurf编辑器，智能响应关键词触发
 */

const fs = require('fs');
const path = require('path');

class WindsurfKeywordMCP {
  constructor() {
    this.basePath = path.join(__dirname, '../hotel-ui');
    this.contextFile = path.join(__dirname, '../.windsurf/ui-context.json');
    this.keywordMap = this.initializeKeywordMap();
    this.smartCache = new Map();
  }

  /**
   * 初始化关键词映射
   */
  initializeKeywordMap() {
    return {
      // UI组件关键词
      'button': ['ui-kit/base/Button.tsx', 'digital-assets/game-ui/components/skill-button.svg'],
      'card': ['ui-kit/base/Card.tsx', 'digital-assets/finance-ui/liquidity-pool-card.svg'],
      'modal': ['ui-kit/base/Modal.tsx', 'frontend/src/components/Modal.tsx'],
      'nav': ['ui-kit/layout/Navigation.tsx', 'frontend/src/components/Layout/Navbar.tsx'],
      
      // 酒店管理关键词
      'hotel': ['digital-assets/icons/hospitality/', 'frontend/src/pages/HomePage.tsx'],
      'room': ['digital-assets/icons/hospitality/room-types.svg'],
      'booking': ['frontend/src/pages/TicketPage.tsx'],
      
      // 游戏关键词
      'game': ['game-pool/', 'digital-assets/casino/'],
      'slot': ['game-pool/slot-machine.html', 'digital-assets/casino/slot-machine.svg'],
      'casino': ['digital-assets/casino/', 'game-pool/'],
      
      // Web3关键词
      'defi': ['web3-components/js/defi.js', 'web3-components/styles/defi.css'],
      'trading': ['web3-components/js/trading.js', 'web3-components/styles/trading.css'],
      'crypto': ['digital-assets/icons/finance/crypto-coins.svg'],
      
      // 样式关键词
      'theme': ['web3-components/styles/', 'frontend/src/'],
      'background': ['digital-assets/backgrounds/'],
      'icon': ['digital-assets/icons/']
    };
  }

  /**
   * MCP服务器主方法
   */
  async handleMCPRequest(method, params) {
    switch (method) {
      case 'ui_search':
        return await this.smartSearch(params.query, params.context);
      
      case 'ui_recommend':
        return await this.smartRecommend(params.scenario, params.context);
      
      case 'ui_autocomplete':
        return await this.autoComplete(params.input, params.position);
      
      case 'ui_context_analyze':
        return await this.analyzeContext(params.code, params.filePath);
      
      case 'ui_integrate':
        return await this.generateIntegration(params.component, params.context);
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  /**
   * 智能搜索 - 基于上下文和关键词
   */
  async smartSearch(query, context = {}) {
    const { currentFile, cursorPosition, selectedText } = context;
    
    // 分析当前文件类型和上下文
    const fileType = this.detectFileType(currentFile);
    const keywords = query.toLowerCase().split(' ');
    
    // 智能匹配
    const matches = [];
    
    for (const keyword of keywords) {
      if (this.keywordMap[keyword]) {
        const resources = this.keywordMap[keyword];
        for (const resource of resources) {
          const score = this.calculateContextScore(resource, fileType, context);
          matches.push({
            resource,
            score,
            usage: this.generateUsageCode(resource, fileType),
            integration: this.generateIntegrationSteps(resource, currentFile)
          });
        }
      }
    }
    
    // 按评分排序
    matches.sort((a, b) => b.score - a.score);
    
    return {
      query,
      totalResults: matches.length,
      results: matches.slice(0, 8),
      suggestions: this.generateSearchSuggestions(keywords, context)
    };
  }

  /**
   * 智能推荐 - 基于场景和文件上下文
   */
  async smartRecommend(scenario, context = {}) {
    const { currentFile, openFiles, projectStructure } = context;
    
    const scenarioMap = {
      'hotel-management': {
        components: ['ui-kit/base/Card.tsx', 'ui-kit/base/Button.tsx'],
        icons: ['digital-assets/icons/hospitality/hotel-amenities.svg'],
        pages: ['frontend/src/pages/HomePage.tsx'],
        priority: ['functionality', 'ui', 'icons']
      },
      'dashboard': {
        components: ['frontend/src/components/Stats/', 'ui-kit/layout/Grid.tsx'],
        charts: ['web3-components/js/charts.js'],
        icons: ['digital-assets/icons/finance/stock-charts.svg'],
        priority: ['data', 'visualization', 'layout']
      },
      'authentication': {
        components: ['frontend/src/components/Auth/', 'ui-kit/base/Input.tsx'],
        pages: ['frontend/src/pages/LoginPage.tsx'],
        priority: ['security', 'forms', 'validation']
      },
      'gaming': {
        games: ['game-pool/slot-machine.html', 'game-pool/airdrop-rush.html'],
        assets: ['digital-assets/casino/', 'digital-assets/gaming/'],
        priority: ['interaction', 'animation', 'assets']
      }
    };
    
    const recommendations = scenarioMap[scenario];
    if (!recommendations) {
      return { error: `未知场景: ${scenario}` };
    }
    
    // 基于上下文调整推荐优先级
    const contextualRecommendations = this.adjustRecommendationsByContext(
      recommendations, 
      context
    );
    
    return {
      scenario,
      recommendations: contextualRecommendations,
      integrationGuide: this.generateIntegrationGuide(scenario, context),
      nextSteps: this.generateNextSteps(scenario, context)
    };
  }

  /**
   * 自动补全
   */
  async autoComplete(input, position) {
    const beforeCursor = input.substring(0, position);
    const afterCursor = input.substring(position);
    
    // 检测导入语句
    const importMatch = beforeCursor.match(/import\s+.*from\s+['"](.*)$/);
    if (importMatch) {
      const partialPath = importMatch[1];
      return this.completeImportPath(partialPath);
    }
    
    // 检测组件使用
    const componentMatch = beforeCursor.match(/<(\w+)$/);
    if (componentMatch) {
      const partialComponent = componentMatch[1];
      return this.completeComponentName(partialComponent);
    }
    
    return { suggestions: [] };
  }

  /**
   * 分析代码上下文
   */
  async analyzeContext(code, filePath) {
    const analysis = {
      fileType: this.detectFileType(filePath),
      imports: this.extractImports(code),
      components: this.extractComponents(code),
      uiPatterns: this.detectUIPatterns(code),
      missingDependencies: [],
      optimizationSuggestions: []
    };
    
    // 检查是否使用了UI资源库
    const usingUILibrary = analysis.imports.some(imp => 
      imp.includes('./hotel-ui/') || imp.includes('@ui/')
    );
    
    if (!usingUILibrary) {
      analysis.optimizationSuggestions.push({
        type: 'use_ui_library',
        message: '考虑使用UI资源库中的组件',
        action: 'search_alternatives'
      });
    }
    
    // 检查缺失的导入
    analysis.missingDependencies = this.findMissingDependencies(code, analysis);
    
    return analysis;
  }

  /**
   * 生成集成代码
   */
  async generateIntegration(componentPath, context) {
    const fileType = context.fileType || 'tsx';
    const component = path.basename(componentPath, path.extname(componentPath));
    
    const integrations = {
      tsx: this.generateReactIntegration(componentPath, component, context),
      jsx: this.generateReactIntegration(componentPath, component, context),
      css: this.generateCSSIntegration(componentPath, context),
      html: this.generateHTMLIntegration(componentPath, context)
    };
    
    return {
      componentPath,
      integration: integrations[fileType] || integrations.tsx,
      additionalFiles: this.getRequiredAdditionalFiles(componentPath),
      setupInstructions: this.generateSetupInstructions(componentPath)
    };
  }

  /**
   * 生成React集成代码
   */
  generateReactIntegration(componentPath, componentName, context) {
    const importPath = `./hotel-ui/${componentPath}`;
    const isStyled = componentPath.includes('.svg') || componentPath.includes('.css');
    
    if (isStyled) {
      return {
        import: `import ${componentName}Icon from '${importPath}';`,
        usage: `<img src={${componentName}Icon} alt="${componentName}" />`,
        styled: `<div style={{ backgroundImage: \`url(\${${componentName}Icon})\` }} />`
      };
    } else {
      return {
        import: `import { ${componentName} } from '${importPath}';`,
        usage: `<${componentName} variant="primary" />`,
        props: this.generateTypicalProps(componentName)
      };
    }
  }

  /**
   * 计算上下文评分
   */
  calculateContextScore(resource, fileType, context) {
    let score = 5; // 基础分
    
    // 文件类型匹配加分
    if (resource.endsWith('.tsx') && fileType === 'react') score += 10;
    if (resource.endsWith('.css') && fileType === 'style') score += 10;
    if (resource.endsWith('.svg') && context.needsIcon) score += 8;
    
    // 上下文相关性
    if (context.currentFile && context.currentFile.includes('hotel')) {
      if (resource.includes('hospitality')) score += 15;
    }
    
    if (context.selectedText) {
      const selected = context.selectedText.toLowerCase();
      if (resource.toLowerCase().includes(selected)) score += 12;
    }
    
    return score;
  }

  /**
   * 检测文件类型
   */
  detectFileType(filePath) {
    if (!filePath) return 'unknown';
    
    const ext = path.extname(filePath);
    const typeMap = {
      '.tsx': 'react',
      '.jsx': 'react', 
      '.ts': 'typescript',
      '.js': 'javascript',
      '.css': 'style',
      '.scss': 'style',
      '.html': 'html',
      '.md': 'markdown'
    };
    
    return typeMap[ext] || 'unknown';
  }

  /**
   * 启动MCP服务器
   */
  startServer() {
    console.log('🌊 启动Windsurf关键词触发MCP服务器...');
    
    // 创建上下文文件
    this.updateContextFile({
      serverStarted: new Date().toISOString(),
      keywordCount: Object.keys(this.keywordMap).length,
      status: 'active'
    });
    
    // 设置进程信号处理
    process.on('SIGINT', () => {
      console.log('\n👋 MCP服务器停止');
      this.updateContextFile({ status: 'stopped' });
      process.exit(0);
    });
    
    console.log('✅ MCP服务器已启动');
    console.log(`📊 支持 ${Object.keys(this.keywordMap).length} 个关键词`);
    console.log('🔍 可用方法: ui_search, ui_recommend, ui_autocomplete, ui_context_analyze');
  }

  /**
   * 更新上下文文件
   */
  updateContextFile(data) {
    const contextDir = path.dirname(this.contextFile);
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
    }
    
    let context = {};
    if (fs.existsSync(this.contextFile)) {
      try {
        context = JSON.parse(fs.readFileSync(this.contextFile, 'utf8'));
      } catch (error) {
        // 忽略解析错误
      }
    }
    
    Object.assign(context, data);
    fs.writeFileSync(this.contextFile, JSON.stringify(context, null, 2));
  }
}

// CLI接口和测试
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const mcpServer = new WindsurfKeywordMCP();
  
  switch (command) {
    case 'start':
      mcpServer.startServer();
      break;
      
    case 'test-search':
      const query = args[1] || 'button hotel';
      mcpServer.smartSearch(query, {
        currentFile: 'src/components/HotelRoom.tsx',
        fileType: 'react'
      }).then(result => {
        console.log('🔍 搜索结果:');
        console.log(JSON.stringify(result, null, 2));
      });
      break;
      
    case 'test-recommend':
      const scenario = args[1] || 'hotel-management';
      mcpServer.smartRecommend(scenario, {
        currentFile: 'src/pages/Dashboard.tsx'
      }).then(result => {
        console.log('💡 推荐结果:');
        console.log(JSON.stringify(result, null, 2));
      });
      break;
      
    default:
      console.log(`
🌊 Windsurf关键词触发MCP服务器

使用方法:
  node windsurf-keyword-mcp.js start           # 启动MCP服务器
  node windsurf-keyword-mcp.js test-search    # 测试搜索功能
  node windsurf-keyword-mcp.js test-recommend # 测试推荐功能

MCP方法:
  ui_search         # 智能搜索UI组件
  ui_recommend      # 场景化推荐
  ui_autocomplete   # 自动补全
  ui_context_analyze # 上下文分析
  ui_integrate      # 生成集成代码
      `);
      break;
  }
}

module.exports = WindsurfKeywordMCP;
