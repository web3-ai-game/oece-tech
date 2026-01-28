#!/usr/bin/env node

/**
 * 🎨 UI资产专用MCP服务器
 * 精确索引hotel-ui目录和根目录UI文档
 * 为UI升级提供智能推荐和快速定位
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs').promises;
const path = require('path');

class UIAssetsMCPServer {
  constructor() {
    this.projectRoot = '/Users/svs.loline/Documents/xiangmu/hotel-inistel';
    this.uiAssetsPath = path.join(this.projectRoot, 'hotel-ui');
    this.assetIndex = new Map();
  }

  async initialize() {
    console.error('🎨 初始化UI资产索引...');
    await this.indexUIAssets();
    await this.indexUIDocuments();
    console.error(`✅ 已索引 ${this.assetIndex.size} 个UI资产`);
  }

  async indexUIAssets() {
    const categories = {
      'ui-kit': {
        path: path.join(this.uiAssetsPath, 'ui-kit'),
        type: 'components',
        description: '基础UI组件库'
      },
      'game-pool': {
        path: path.join(this.uiAssetsPath, 'game-pool'),
        type: 'games',
        description: 'HTML5游戏模块'
      },
      'digital-assets': {
        path: path.join(this.uiAssetsPath, 'digital-assets'),
        type: 'assets',
        description: 'SVG图标和背景资源'
      },
      'frontend': {
        path: path.join(this.uiAssetsPath, 'frontend', 'src'),
        type: 'react',
        description: 'React组件和页面'
      }
    };

    for (const [category, info] of Object.entries(categories)) {
      try {
        await this.scanDirectory(info.path, category, info.type);
      } catch (error) {
        console.error(`⚠️ 无法索引 ${category}: ${error.message}`);
      }
    }
  }

  async scanDirectory(dirPath, category, type) {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          await this.scanDirectory(fullPath, category, type);
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          const validExts = ['.tsx', '.jsx', '.js', '.css', '.svg', '.html', '.json'];
          
          if (validExts.includes(ext)) {
            const relativePath = path.relative(this.projectRoot, fullPath);
            const assetInfo = {
              name: item.name,
              path: relativePath,
              fullPath: fullPath,
              category: category,
              type: type,
              extension: ext,
              keywords: this.extractKeywords(item.name)
            };
            
            this.assetIndex.set(relativePath, assetInfo);
          }
        }
      }
    } catch (error) {
      // 静默处理不存在的目录
    }
  }

  async indexUIDocuments() {
    const uiDocs = [
      'UI_ASSETS_INDEX.md',
      'UI_INTEGRATION_GUIDE.md',
      'UI_ASSETS_INDEX_NEW.md',
      'UI_INTEGRATION_GUIDE_NEW.md'
    ];

    for (const docName of uiDocs) {
      const docPath = path.join(this.projectRoot, docName);
      try {
        const content = await fs.readFile(docPath, 'utf8');
        const relativePath = docName;
        
        this.assetIndex.set(relativePath, {
          name: docName,
          path: relativePath,
          fullPath: docPath,
          category: 'documentation',
          type: 'markdown',
          extension: '.md',
          keywords: this.extractDocKeywords(content),
          sections: this.extractSections(content)
        });
      } catch (error) {
        // 文档可能不存在
      }
    }
  }

  extractKeywords(filename) {
    const keywords = [];
    const name = filename.replace(/\.[^/.]+$/, '').toLowerCase();
    
    // 分解驼峰和下划线
    const parts = name.split(/[-_]|(?=[A-Z])/).map(p => p.toLowerCase());
    keywords.push(...parts);
    
    // 添加特定关键词
    if (name.includes('button')) keywords.push('按钮', 'btn');
    if (name.includes('card')) keywords.push('卡片', 'panel');
    if (name.includes('modal')) keywords.push('弹窗', 'dialog');
    if (name.includes('hotel')) keywords.push('酒店', '房间');
    if (name.includes('game')) keywords.push('游戏', '娱乐');
    
    return [...new Set(keywords)];
  }

  extractDocKeywords(content) {
    const keywords = [];
    const patterns = [
      /hotel|酒店/gi,
      /button|按钮/gi,
      /card|卡片/gi,
      /game|游戏/gi,
      /component|组件/gi,
      /ui|界面/gi,
      /dashboard|仪表板/gi
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        keywords.push(pattern.source.replace(/[|\\]/g, ' ').toLowerCase());
      }
    });
    
    return keywords;
  }

  extractSections(content) {
    const sections = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.startsWith('#')) {
        sections.push({
          title: line.replace(/^#+\s*/, ''),
          line: index + 1,
          level: line.match(/^#+/)[0].length
        });
      }
    });
    
    return sections;
  }

  setupHandlers(server) {
    // 工具：搜索UI资产
    server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'search_ui_assets',
          description: '搜索UI资产库中的组件、游戏、SVG等资源',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '搜索关键词（支持中英文）'
              },
              category: {
                type: 'string',
                enum: ['all', 'components', 'games', 'assets', 'react', 'documentation'],
                description: '资产类别'
              }
            },
            required: ['query']
          }
        },
        {
          name: 'get_ui_asset',
          description: '获取特定UI资产的详细信息和内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '资产的相对路径'
              }
            },
            required: ['path']
          }
        },
        {
          name: 'list_ui_categories',
          description: '列出所有UI资产类别和统计',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    // 工具调用处理
    server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'search_ui_assets':
          return await this.searchAssets(args.query, args.category || 'all');
        
        case 'get_ui_asset':
          return await this.getAssetDetails(args.path);
        
        case 'list_ui_categories':
          return await this.listCategories();
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // 资源列表
    server.setRequestHandler('resources/list', async () => ({
      resources: Array.from(this.assetIndex.values()).map(asset => ({
        uri: `ui-asset://${asset.path}`,
        name: asset.name,
        mimeType: this.getMimeType(asset.extension),
        description: `${asset.category} - ${asset.type}`
      }))
    }));

    // 资源读取
    server.setRequestHandler('resources/read', async (request) => {
      const uri = request.params.uri;
      const path = uri.replace('ui-asset://', '');
      const asset = this.assetIndex.get(path);
      
      if (!asset) {
        throw new Error(`Asset not found: ${path}`);
      }
      
      const content = await fs.readFile(asset.fullPath, 'utf8');
      
      return {
        contents: [{
          uri: uri,
          mimeType: this.getMimeType(asset.extension),
          text: content
        }]
      };
    });
  }

  async searchAssets(query, category) {
    const results = [];
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/);
    
    for (const [path, asset] of this.assetIndex.entries()) {
      if (category !== 'all' && asset.type !== category) {
        continue;
      }
      
      let score = 0;
      
      // 匹配文件名
      if (asset.name.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // 匹配关键词
      for (const term of queryTerms) {
        if (asset.keywords && asset.keywords.some(k => k.includes(term))) {
          score += 5;
        }
      }
      
      // 匹配路径
      if (asset.path.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      if (score > 0) {
        results.push({
          ...asset,
          score: score
        });
      }
    }
    
    // 排序并限制结果数量
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, 20);
    
    return {
      content: [{
        type: 'text',
        text: this.formatSearchResults(topResults, query)
      }]
    };
  }

  formatSearchResults(results, query) {
    if (results.length === 0) {
      return `❌ 未找到与 "${query}" 相关的UI资产`;
    }
    
    let output = `🎨 找到 ${results.length} 个UI资产：\n\n`;
    
    const grouped = {};
    results.forEach(asset => {
      if (!grouped[asset.category]) {
        grouped[asset.category] = [];
      }
      grouped[asset.category].push(asset);
    });
    
    for (const [category, assets] of Object.entries(grouped)) {
      output += `\n📁 **${category}** (${assets.length}个)\n`;
      assets.forEach(asset => {
        output += `  • ${asset.name} - ${asset.path}\n`;
        if (asset.sections && asset.sections.length > 0) {
          output += `    章节: ${asset.sections.slice(0, 3).map(s => s.title).join(', ')}\n`;
        }
      });
    }
    
    return output;
  }

  async getAssetDetails(assetPath) {
    const asset = this.assetIndex.get(assetPath);
    
    if (!asset) {
      return {
        content: [{
          type: 'text',
          text: `❌ 未找到资产: ${assetPath}`
        }]
      };
    }
    
    try {
      const content = await fs.readFile(asset.fullPath, 'utf8');
      const preview = content.substring(0, 500);
      
      return {
        content: [{
          type: 'text',
          text: `📄 **${asset.name}**\n` +
                `📁 类别: ${asset.category}\n` +
                `🏷️ 类型: ${asset.type}\n` +
                `📍 路径: ${asset.path}\n` +
                `🔤 扩展名: ${asset.extension}\n` +
                `🔑 关键词: ${asset.keywords ? asset.keywords.join(', ') : '无'}\n\n` +
                `📝 预览:\n\`\`\`${asset.extension.substring(1)}\n${preview}...\n\`\`\``
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ 无法读取资产内容: ${error.message}`
        }]
      };
    }
  }

  async listCategories() {
    const stats = {};
    
    for (const asset of this.assetIndex.values()) {
      const key = `${asset.category} (${asset.type})`;
      if (!stats[key]) {
        stats[key] = {
          count: 0,
          extensions: new Set()
        };
      }
      stats[key].count++;
      stats[key].extensions.add(asset.extension);
    }
    
    let output = '📊 **UI资产库统计**\n\n';
    output += `总计: ${this.assetIndex.size} 个资产\n\n`;
    
    for (const [category, info] of Object.entries(stats)) {
      output += `📁 ${category}: ${info.count} 个文件\n`;
      output += `   支持格式: ${Array.from(info.extensions).join(', ')}\n`;
    }
    
    return {
      content: [{
        type: 'text',
        text: output
      }]
    };
  }

  getMimeType(extension) {
    const mimeTypes = {
      '.js': 'application/javascript',
      '.jsx': 'text/jsx',
      '.tsx': 'text/tsx',
      '.css': 'text/css',
      '.html': 'text/html',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
      '.md': 'text/markdown'
    };
    return mimeTypes[extension] || 'text/plain';
  }

  async run() {
    await this.initialize();
    
    const server = new Server({
      name: 'ui-assets-server',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });
    
    this.setupHandlers(server);
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('🚀 UI资产MCP服务器已启动');
  }
}

// 启动服务器
if (require.main === module) {
  const server = new UIAssetsMCPServer();
  server.run().catch(error => {
    console.error('服务器错误:', error);
    process.exit(1);
  });
}

module.exports = UIAssetsMCPServer;
