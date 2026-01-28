#!/usr/bin/env node

/**
 * 🔄 GitHub MCP 自动索引系统
 * 监听GitHub仓库变化，自动重建UI资源索引
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- GitHub integration guard ---
const CACHE_DIR = path.join(__dirname, '../.cache');
const DISABLE_MARK = path.join(CACHE_DIR, 'GITHUB_DISABLED');
const envFlag = process.env.GITHUB_INTEGRATIONS_ENABLED;
const isDisabled = (envFlag && envFlag.toLowerCase() === 'false') || fs.existsSync(DISABLE_MARK);

if (isDisabled) {
  // Provide a no-op export so "require('./auto-index-github-mcp.js')" won't crash
  class NoopIndexer {
    constructor() {}
    start() { console.log('GitHub integrations are disabled. Skipping GitHub MCP auto indexer.'); }
    async manualRebuild() { console.log('GitHub integrations disabled: manualRebuild is a no-op.'); }
    async checkForUpdates() { /* no-op */ }
  }

  if (require.main === module) {
    // Running directly
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log('ℹ️ Detected disabled GitHub integrations. To enable, remove .cache/GITHUB_DISABLED or set GITHUB_INTEGRATIONS_ENABLED=true');
    process.exit(0);
  }

  module.exports = NoopIndexer;
  return; // stop loading the rest of the file
}

class GitHubMCPAutoIndexer {
  constructor() {
    this.repoPath = path.join(__dirname, '../hotel-ui');
    this.indexPath = path.join(__dirname, '../UI_ASSETS_INDEX.md');
    this.configPath = path.join(__dirname, '../.windsurf/ui-assets-mcp-config.json');
    this.lastCommitHash = null;
    this.watchInterval = 30000; // 30秒检查一次
  }

  /**
   * 启动自动监听系统
   */
  start() {
    console.log('🚀 启动GitHub MCP自动索引系统...');
    
    // 初始化
    this.updateLastCommitHash();
    
    // 定时检查更新
    setInterval(() => {
      this.checkForUpdates();
    }, this.watchInterval);
    
    // 监听关键词触发
    this.setupKeywordHooks();
    
    console.log('✅ 自动索引系统已启动');
    console.log(`📊 检查间隔: ${this.watchInterval / 1000}秒`);
    console.log('🔍 支持关键词触发: @ui-search, @ui-update, @ui-rebuild');
  }

  /**
   * 检查GitHub仓库更新
   */
  async checkForUpdates() {
    try {
      // 拉取最新更新
      const currentDir = process.cwd();
      process.chdir(this.repoPath);
      
      const fetchResult = execSync('git fetch origin main', { encoding: 'utf8', stdio: 'pipe' });
      const currentHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const remoteHash = execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim();
      
      process.chdir(currentDir);
      
      if (currentHash !== remoteHash) {
        console.log('🔄 检测到GitHub仓库更新...');
        await this.pullAndRebuild();
      }
      
    } catch (error) {
      console.warn('⚠️ 检查更新失败:', error.message);
    }
  }

  /**
   * 拉取更新并重建索引
   */
  async pullAndRebuild() {
    try {
      const currentDir = process.cwd();
      process.chdir(this.repoPath);
      
      // 拉取最新代码
      execSync('git pull origin main', { encoding: 'utf8' });
      const newHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      
      process.chdir(currentDir);
      
      console.log(`📦 已更新到提交: ${newHash.substring(0, 8)}`);
      
      // 重建索引
      await this.rebuildIndex();
      
      // 更新配置
      await this.updateMCPConfig();
      
      console.log('✅ 索引重建完成');
      
    } catch (error) {
      console.error('❌ 更新失败:', error.message);
    }
  }

  /**
   * 重建完整索引
   */
  async rebuildIndex() {
    console.log('🔨 重建UI资源索引...');
    
    const SmartUIFinder = require('./ui-finder.js');
    const finder = new SmartUIFinder();
    
    // 扫描所有文件
    const categories = Object.keys(finder.categories);
    const allAssets = {};
    
    for (const category of categories) {
      const categoryPath = path.join(this.repoPath, finder.categories[category].path);
      if (fs.existsSync(categoryPath)) {
        const files = await finder.scanDirectory(categoryPath, finder.categories[category].extensions);
        allAssets[category] = files.map(file => ({
          path: path.relative(this.repoPath, file),
          name: path.basename(file),
          category: category,
          lastModified: fs.statSync(file).mtime
        }));
      }
    }
    
    // 生成新的索引文档
    await this.generateIndexDocument(allAssets);
    
    // 创建索引缓存
    const cacheData = {
      lastUpdated: new Date().toISOString(),
      totalFiles: Object.values(allAssets).reduce((sum, files) => sum + files.length, 0),
      categories: Object.keys(allAssets).length,
      assets: allAssets
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../.cache/ui-assets-index.json'),
      JSON.stringify(cacheData, null, 2)
    );
  }

  /**
   * 生成索引文档
   */
  async generateIndexDocument(assets) {
    const totalFiles = Object.values(assets).reduce((sum, files) => sum + files.length, 0);
    
    let content = `# 🎨 UI数字资产库自动索引

> **最后更新**: ${new Date().toLocaleString('zh-CN')}  
> **总文件数**: ${totalFiles}  
> **GitHub仓库**: https://github.com/svsbeta/hotel-ui  
> **自动同步**: ✅ 已启用

## 📊 资源统计

`;

    for (const [category, files] of Object.entries(assets)) {
      content += `### ${category.toUpperCase()} (${files.length}个文件)\n`;
      content += `\`\`\`\n`;
      files.slice(0, 10).forEach(file => {
        content += `${file.path}\n`;
      });
      if (files.length > 10) {
        content += `... 还有 ${files.length - 10} 个文件\n`;
      }
      content += `\`\`\`\n\n`;
    }

    content += `
## 🔍 快速搜索

\`\`\`bash
# 搜索组件
node scripts/ui-finder.js search "关键词"

# 获取推荐
node scripts/ui-finder.js recommend "场景"

# 触发更新
echo "@ui-rebuild" | node scripts/auto-index-github-mcp.js
\`\`\`

---
*此文档由自动索引系统生成*
`;

    fs.writeFileSync(this.indexPath, content);
  }

  /**
   * 设置关键词钩子
   */
  setupKeywordHooks() {
    const keywords = ['@ui-search', '@ui-update', '@ui-rebuild', '@ui-sync'];
    
    // 监听stdin输入
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        
        if (keywords.some(keyword => input.includes(keyword))) {
          this.handleKeywordTrigger(input);
        }
      });
    }
    
    // 监听文件触发器
    const triggerFile = path.join(__dirname, '../.trigger-ui-update');
    fs.watchFile(triggerFile, (curr, prev) => {
      if (curr.mtime > prev.mtime) {
        console.log('📂 检测到文件触发器');
        this.pullAndRebuild();
      }
    });
  }

  /**
   * 处理关键词触发
   */
  async handleKeywordTrigger(input) {
    console.log(`🎯 关键词触发: ${input}`);
    
    if (input.includes('@ui-rebuild') || input.includes('@ui-update')) {
      await this.pullAndRebuild();
    } else if (input.includes('@ui-search')) {
      const query = input.replace('@ui-search', '').trim();
      if (query) {
        execSync(`node scripts/ui-finder.js search "${query}"`, { stdio: 'inherit' });
      }
    } else if (input.includes('@ui-sync')) {
      await this.checkForUpdates();
    }
  }

  /**
   * 更新MCP配置
   */
  async updateMCPConfig() {
    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      config.last_updated = new Date().toISOString();
      config.auto_sync_enabled = true;
      
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.warn('⚠️ 更新MCP配置失败:', error.message);
    }
  }

  /**
   * 更新最后提交哈希
   */
  updateLastCommitHash() {
    try {
      const currentDir = process.cwd();
      process.chdir(this.repoPath);
      this.lastCommitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      process.chdir(currentDir);
    } catch (error) {
      console.warn('⚠️ 无法获取Git信息');
    }
  }

  /**
   * 手动触发重建
   */
  async manualRebuild() {
    console.log('🔄 手动触发重建索引...');
    await this.rebuildIndex();
    await this.updateMCPConfig();
  }
}

// CLI接口
if (require.main === module) {
  const indexer = new GitHubMCPAutoIndexer();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  // 确保缓存目录存在
  const cacheDir = path.join(__dirname, '../.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  switch (command) {
    case 'start':
      indexer.start();
      break;
    case 'rebuild':
      indexer.manualRebuild().then(() => {
        console.log('✅ 重建完成');
        process.exit(0);
      });
      break;
    case 'check':
      indexer.checkForUpdates().then(() => {
        console.log('✅ 检查完成');
        process.exit(0);
      });
      break;
    default:
      console.log(`
🔄 GitHub MCP 自动索引系统

使用方法:
  node auto-index-github-mcp.js start    # 启动监听
  node auto-index-github-mcp.js rebuild  # 手动重建
  node auto-index-github-mcp.js check    # 检查更新
  
关键词触发:
  @ui-search "关键词"  # 搜索组件
  @ui-rebuild         # 重建索引
  @ui-update          # 更新并重建
  @ui-sync           # 检查同步
      `);
      break;
  }
}

module.exports = GitHubMCPAutoIndexer;
