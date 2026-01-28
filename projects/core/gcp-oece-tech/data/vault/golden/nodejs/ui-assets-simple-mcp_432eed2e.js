#!/usr/bin/env node

/**
 * 🎨 UI资产简化版MCP服务器
 * 使用标准stdio协议提供UI资产索引服务
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class SimpleUIAssetsMCP {
  constructor() {
    this.projectRoot = '/Users/svs.loline/Documents/xiangmu/hotel-inistel';
    this.uiAssetsPath = path.join(this.projectRoot, 'hotel-ui');
    this.assetIndex = new Map();
    this.initialized = false;
  }

  async initialize() {
    // 索引UI资产
    await this.indexAssets();
    this.initialized = true;
  }

  async indexAssets() {
    // 索引hotel-ui目录
    const categories = [
      { dir: 'ui-kit', type: 'components' },
      { dir: 'game-pool', type: 'games' },
      { dir: 'digital-assets', type: 'assets' },
      { dir: 'frontend/src', type: 'react' }
    ];

    for (const cat of categories) {
      const catPath = path.join(this.uiAssetsPath, cat.dir);
      if (fs.existsSync(catPath)) {
        this.scanDir(catPath, cat.type);
      }
    }

    // 索引根目录UI文档
    const uiDocs = [
      'UI_ASSETS_INDEX.md',
      'UI_INTEGRATION_GUIDE.md',
      'UI_ASSETS_INDEX_NEW.md',
      'UI_INTEGRATION_GUIDE_NEW.md'
    ];

    for (const doc of uiDocs) {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        this.assetIndex.set(doc, {
          name: doc,
          path: doc,
          type: 'documentation',
          fullPath: docPath
        });
      }
    }
  }

  scanDir(dirPath, type, baseDir = dirPath) {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.')) {
          this.scanDir(fullPath, type, baseDir);
        } else if (item.isFile()) {
          const ext = path.extname(item.name);
          const validExts = ['.tsx', '.jsx', '.js', '.css', '.svg', '.html', '.json', '.md'];
          
          if (validExts.includes(ext)) {
            const relativePath = path.relative(this.projectRoot, fullPath);
            this.assetIndex.set(relativePath, {
              name: item.name,
              path: relativePath,
              type: type,
              fullPath: fullPath
            });
          }
        }
      }
    } catch (err) {
      // 静默处理错误
    }
  }

  async handleRequest(request) {
    if (!this.initialized) {
      await this.initialize();
    }

    const { method, params, id } = request;

    try {
      let result;

      switch (method) {
        case 'initialize':
          result = {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
              resources: {}
            },
            serverInfo: {
              name: 'ui-assets-simple',
              version: '1.0.0'
            }
          };
          break;

        case 'tools/list':
          result = {
            tools: [
              {
                name: 'search_ui_assets',
                description: '搜索UI资产库',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string' }
                  }
                }
              },
              {
                name: 'list_ui_stats',
                description: '列出UI资产统计',
                inputSchema: {
                  type: 'object',
                  properties: {}
                }
              }
            ]
          };
          break;

        case 'tools/call':
          if (params.name === 'search_ui_assets') {
            const query = params.arguments.query.toLowerCase();
            const results = [];
            
            for (const [path, asset] of this.assetIndex.entries()) {
              if (asset.name.toLowerCase().includes(query) || 
                  asset.path.toLowerCase().includes(query)) {
                results.push(asset);
              }
            }

            result = {
              content: [{
                type: 'text',
                text: `找到 ${results.length} 个UI资产:\n` +
                      results.slice(0, 20).map(r => 
                        `• ${r.name} (${r.type}) - ${r.path}`
                      ).join('\n')
              }]
            };
          } else if (params.name === 'list_ui_stats') {
            const stats = {};
            for (const asset of this.assetIndex.values()) {
              stats[asset.type] = (stats[asset.type] || 0) + 1;
            }
            
            result = {
              content: [{
                type: 'text',
                text: `UI资产统计 (共${this.assetIndex.size}个):\n` +
                      Object.entries(stats).map(([type, count]) => 
                        `• ${type}: ${count}个`
                      ).join('\n')
              }]
            };
          }
          break;

        case 'resources/list':
          result = {
            resources: Array.from(this.assetIndex.values()).slice(0, 100).map(asset => ({
              uri: `ui://${asset.path}`,
              name: asset.name,
              mimeType: 'text/plain'
            }))
          };
          break;

        case 'resources/read':
          const uriPath = params.uri.replace('ui://', '');
          const asset = this.assetIndex.get(uriPath);
          if (asset) {
            const content = fs.readFileSync(asset.fullPath, 'utf8');
            result = {
              contents: [{
                uri: params.uri,
                mimeType: 'text/plain',
                text: content.substring(0, 5000) // 限制大小
              }]
            };
          }
          break;

        default:
          throw new Error(`Unknown method: ${method}`);
      }

      return {
        jsonrpc: '2.0',
        id: id,
        result: result
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: id,
        error: {
          code: -32603,
          message: error.message
        }
      };
    }
  }

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    process.stderr.write('🎨 UI资产MCP服务器启动中...\n');

    rl.on('line', async (line) => {
      try {
        const request = JSON.parse(line);
        const response = await this.handleRequest(request);
        console.log(JSON.stringify(response));
      } catch (err) {
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error'
          }
        }));
      }
    });
  }
}

// 启动服务器
if (require.main === module) {
  const server = new SimpleUIAssetsMCP();
  server.run();
}

module.exports = SimpleUIAssetsMCP;
