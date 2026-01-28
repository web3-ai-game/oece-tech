#!/usr/bin/env node

/**
 * 🎨 智能UI资源查找工具
 * 精确索引和快速查找UI数字资产库中的组件
 */

const fs = require('fs');
const path = require('path');

class SmartUIFinder {
  constructor() {
    this.basePath = path.join(__dirname, '../hotel-ui');
    this.cache = new Map();
    this.categories = this.loadCategories();
  }

  loadCategories() {
    return {
      components: {
        path: 'ui-kit/',
        keywords: ['button', 'card', 'modal', 'input', 'navigation', 'layout'],
        extensions: ['.tsx', '.jsx', '.ts', '.js']
      },
      react: {
        path: 'frontend/src/components/',
        keywords: ['auth', 'hero', 'features', 'stats', 'testimonials'],
        extensions: ['.tsx', '.jsx']
      },
      assets: {
        path: 'digital-assets/',
        keywords: ['icons', 'backgrounds', 'svg', 'hospitality', 'gaming', 'finance'],
        extensions: ['.svg', '.png', '.jpg']
      },
      games: {
        path: 'game-pool/',
        keywords: ['slot', 'airdrop', 'predict', 'casino', 'interactive'],
        extensions: ['.html', '.js']
      },
      web3: {
        path: 'web3-components/',
        keywords: ['trading', 'defi', 'crypto', 'charts', 'algorithms'],
        extensions: ['.js', '.css']
      }
    };
  }

  /**
   * 智能搜索UI组件
   * @param {string} query - 搜索关键词
   * @param {string} category - 分类过滤
   * @returns {Array} 匹配的组件列表
   */
  async findComponents(query, category = null) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    const categories = category ? [category] : Object.keys(this.categories);
    
    for (const cat of categories) {
      const categoryPath = path.join(this.basePath, this.categories[cat].path);
      if (!fs.existsSync(categoryPath)) continue;
      
      const files = await this.scanDirectory(categoryPath, this.categories[cat].extensions);
      
      for (const file of files) {
        const score = this.calculateRelevanceScore(file, searchTerms, this.categories[cat].keywords);
        if (score > 0) {
          results.push({
            file: file,
            category: cat,
            score: score,
            relativePath: path.relative(this.basePath, file),
            usage: this.generateUsageExample(file, cat)
          });
        }
      }
    }
    
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  /**
   * 递归扫描目录
   */
  async scanDirectory(dir, extensions) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          files.push(...await this.scanDirectory(fullPath, extensions));
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`无法访问目录: ${dir}`);
    }
    
    return files;
  }

  /**
   * 计算相关性评分
   */
  calculateRelevanceScore(filePath, searchTerms, categoryKeywords) {
    let score = 0;
    const fileName = path.basename(filePath).toLowerCase();
    const dirName = path.dirname(filePath).toLowerCase();
    
    // 文件名匹配
    for (const term of searchTerms) {
      if (fileName.includes(term)) score += 10;
      if (dirName.includes(term)) score += 5;
    }
    
    // 分类关键词匹配
    for (const keyword of categoryKeywords) {
      if (fileName.includes(keyword) || dirName.includes(keyword)) {
        score += 3;
      }
    }
    
    return score;
  }

  /**
   * 生成使用示例
   */
  generateUsageExample(filePath, category) {
    const relativePath = path.relative(this.basePath, filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    
    switch (ext) {
      case '.tsx':
      case '.jsx':
        return `import { ${baseName} } from './hotel-ui/${relativePath}';
        
// 使用组件
<${baseName} variant="primary" />`;
        
      case '.svg':
        return `import ${baseName}Icon from './hotel-ui/${relativePath}';

// 作为图标使用
<img src={${baseName}Icon} alt="${baseName}" />`;
        
      case '.css':
        return `@import './hotel-ui/${relativePath}';

/* 或在React中 */
import './hotel-ui/${relativePath}';`;
        
      case '.html':
        return `<!-- 嵌入HTML游戏 -->
<iframe 
  src="./hotel-ui/${relativePath}" 
  width="800" 
  height="600"
  frameborder="0">
</iframe>`;
        
      default:
        return `// 引用资源
import asset from './hotel-ui/${relativePath}';`;
    }
  }

  /**
   * 按用途推荐组件
   */
  getRecommendations(purpose) {
    const recommendations = {
      'hotel-management': [
        'ui-kit/base/Card.tsx',
        'ui-kit/base/Button.tsx',
        'digital-assets/icons/hospitality/',
        'frontend/src/components/Layout/Navbar.tsx'
      ],
      'dashboard': [
        'frontend/src/components/Stats/',
        'digital-assets/icons/finance/stock-charts.svg',
        'web3-components/js/charts.js'
      ],
      'authentication': [
        'frontend/src/components/Auth/',
        'frontend/src/pages/LoginPage.tsx',
        'ui-kit/base/Input.tsx'
      ],
      'gaming': [
        'game-pool/slot-machine.html',
        'digital-assets/casino/',
        'game-pool/airdrop-rush.html'
      ]
    };
    
    return recommendations[purpose] || [];
  }

  /**
   * 生成集成报告
   */
  generateIntegrationReport() {
    const report = {
      总资源数: 0,
      分类统计: {},
      热门组件: [],
      集成建议: {}
    };
    
    // 这里可以添加统计逻辑
    return report;
  }
}

// CLI接口
if (require.main === module) {
  const finder = new SmartUIFinder();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 智能UI资源查找工具

使用方法:
  node ui-finder.js search "关键词"           # 搜索组件
  node ui-finder.js recommend "hotel-management" # 获取推荐
  node ui-finder.js list                        # 列出所有分类
  
示例:
  node ui-finder.js search "button card"
  node ui-finder.js recommend "dashboard"
    `);
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'search':
      const query = args[1];
      if (!query) {
        console.error('请提供搜索关键词');
        process.exit(1);
      }
      
      finder.findComponents(query).then(results => {
        console.log(`\n🔍 搜索结果: "${query}"\n`);
        
        if (results.length === 0) {
          console.log('未找到匹配的组件');
          return;
        }
        
        results.forEach((result, index) => {
          console.log(`${index + 1}. 📁 ${result.relativePath}`);
          console.log(`   分类: ${result.category} | 评分: ${result.score}`);
          console.log(`   使用示例:`);
          console.log(result.usage.split('\n').map(line => '   ' + line).join('\n'));
          console.log('');
        });
      });
      break;
      
    case 'recommend':
      const purpose = args[1];
      const recommendations = finder.getRecommendations(purpose);
      
      console.log(`\n💡 ${purpose} 推荐组件:\n`);
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ./hotel-ui/${rec}`);
      });
      break;
      
    case 'list':
      console.log('\n📂 可用分类:\n');
      Object.keys(finder.categories).forEach(cat => {
        console.log(`• ${cat}: ${finder.categories[cat].path}`);
      });
      break;
      
    default:
      console.error('未知命令:', command);
      process.exit(1);
  }
}

module.exports = SmartUIFinder;
