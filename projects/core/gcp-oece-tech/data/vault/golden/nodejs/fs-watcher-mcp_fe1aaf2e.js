#!/usr/bin/env node

/**
 * 📁 文件系统监听MCP自动索引
 * 监听本地文件变化，实时更新UI索引
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// GitHub integration guard (so watcher can run without GitHub dependencies)
const CACHE_DIR = path.join(__dirname, '../.cache');
const DISABLE_MARK = path.join(CACHE_DIR, 'GITHUB_DISABLED');
const envFlag = process.env.GITHUB_INTEGRATIONS_ENABLED;
const GITHUB_DISABLED = (envFlag && envFlag.toLowerCase() === 'false') || fs.existsSync(DISABLE_MARK);

class FileSystemMCPWatcher {
  constructor() {
    this.watchPath = path.join(__dirname, '../hotel-ui');
    this.indexPath = path.join(__dirname, '../UI_ASSETS_INDEX.md');
    this.keywordPatterns = [
      /@ui-search\s+["']([^"']+)["']/g,
      /@ui-find\s+(\S+)/g,
      /@ui-update/g,
      /@ui-rebuild/g
    ];
    this.debounceTime = 2000; // 2秒防抖
    this.rebuildTimeout = null;
  }

  /**
   * 启动文件系统监听
   */
  start() {
    console.log('👀 启动文件系统监听器...');
    
    // 监听UI资源目录
    const watcher = chokidar.watch(this.watchPath, {
      ignored: [/(^|[\/\\])\../, /node_modules/, /\.git/],
      persistent: true,
      ignoreInitial: true
    });

    // 文件变化事件
    watcher
      .on('add', (filePath) => this.onFileChange('add', filePath))
      .on('change', (filePath) => this.onFileChange('change', filePath))
      .on('unlink', (filePath) => this.onFileChange('delete', filePath))
      .on('addDir', (dirPath) => this.onDirChange('add', dirPath))
      .on('unlinkDir', (dirPath) => this.onDirChange('delete', dirPath));

    // 监听项目文件中的关键词
    this.watchProjectFiles();

    console.log(`✅ 文件监听已启动: ${this.watchPath}`);
    console.log('🔍 支持关键词: @ui-search, @ui-find, @ui-update, @ui-rebuild');
  }

  /**
   * 监听项目文件中的关键词触发
   */
  watchProjectFiles() {
    const projectWatcher = chokidar.watch([
      path.join(__dirname, '../src/**/*.{js,jsx,ts,tsx}'),
      path.join(__dirname, '../*.md'),
      path.join(__dirname, '../*.js')
    ], {
      ignored: /node_modules/,
      persistent: true
    });

    projectWatcher.on('change', (filePath) => {
      this.scanFileForKeywords(filePath);
    });
  }

  /**
   * 扫描文件中的关键词
   */
  async scanFileForKeywords(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const pattern of this.keywordPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          await this.handleKeywordMatch(match, filePath);
        }
      }
    } catch (error) {
      // 忽略读取错误
    }
  }

  /**
   * 处理关键词匹配
   */
  async handleKeywordMatch(match, filePath) {
    const fullMatch = match[0];
    const query = match[1];
    
    console.log(`🎯 在 ${path.basename(filePath)} 中检测到: ${fullMatch}`);
    
    if (fullMatch.includes('@ui-search') && query) {
      await this.executeSearch(query);
    } else if (fullMatch.includes('@ui-find') && query) {
      await this.executeFind(query);
    } else if (fullMatch.includes('@ui-update') || fullMatch.includes('@ui-rebuild')) {
      await this.scheduleRebuild();
    }
  }

  /**
   * 执行搜索
   */
  async executeSearch(query) {
    console.log(`🔍 执行搜索: ${query}`);
    
    try {
      const { execSync } = require('child_process');
      const result = execSync(`node scripts/ui-finder.js search "${query}"`, {
        encoding: 'utf8',
        cwd: path.dirname(__dirname)
      });
      
      // 将结果写入临时文件供IDE查看
      const resultsPath = path.join(__dirname, '../.cache/last-search-results.md');
      fs.writeFileSync(resultsPath, `# 搜索结果: ${query}\n\n\`\`\`\n${result}\n\`\`\``);
      
    } catch (error) {
      console.error('❌ 搜索执行失败:', error.message);
    }
  }

  /**
   * 执行查找
   */
  async executeFind(keyword) {
    console.log(`🎯 执行查找: ${keyword}`);
    
    const SmartUIFinder = require('./ui-finder.js');
    const finder = new SmartUIFinder();
    const results = await finder.findComponents(keyword);
    
    if (results.length > 0) {
      console.log(`✅ 找到 ${results.length} 个匹配项`);
      results.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.relativePath}`);
      });
    }
  }

  /**
   * 文件变化处理
   */
  onFileChange(event, filePath) {
    const relativePath = path.relative(this.watchPath, filePath);
    const ext = path.extname(filePath);
    
    if (['.tsx', '.jsx', '.svg', '.css', '.html', '.js', '.ts'].includes(ext)) {
      console.log(`📝 ${event}: ${relativePath}`);
      this.scheduleRebuild();
    }
  }

  /**
   * 目录变化处理
   */
  onDirChange(event, dirPath) {
    const relativePath = path.relative(this.watchPath, dirPath);
    console.log(`📁 ${event} dir: ${relativePath}`);
    this.scheduleRebuild();
  }

  /**
   * 计划重建索引（防抖）
   */
  scheduleRebuild() {
    if (this.rebuildTimeout) {
      clearTimeout(this.rebuildTimeout);
    }
    
    this.rebuildTimeout = setTimeout(() => {
      this.rebuildIndex();
    }, this.debounceTime);
  }

  /**
   * 重建索引
   */
  async rebuildIndex() {
    console.log('🔄 重建UI资源索引...');

    try {
      if (GITHUB_DISABLED) {
        console.log('ℹ️ GitHub integrations disabled. Skipping remote sync; generating local index placeholder.');
        const placeholder = `# 🎨 UI数字资产库自动索引 (本地占位)\n\n> GitHub 集成已禁用。若需启用，请删除 .cache/GITHUB_DISABLED 或设置环境变量 GITHUB_INTEGRATIONS_ENABLED=true 然后重新运行。\n`;
        fs.writeFileSync(this.indexPath, placeholder);
      } else {
        const GitHubMCPAutoIndexer = require('./auto-index-github-mcp.js');
        const indexer = new GitHubMCPAutoIndexer();
        await indexer.manualRebuild();
      }

      console.log('✅ 索引重建完成');

      // 通知MCP服务器更新
      this.notifyMCPServer();

    } catch (error) {
      console.error('❌ 索引重建失败:', error.message);
    }
  }

  /**
   * 通知MCP服务器更新
   */
  notifyMCPServer() {
    const notificationFile = path.join(__dirname, '../.cache/mcp-update-notification.json');
    const notification = {
      timestamp: new Date().toISOString(),
      event: 'index_rebuilt',
      message: 'UI资源索引已更新'
    };
    
    fs.writeFileSync(notificationFile, JSON.stringify(notification, null, 2));
  }
}

// 确保chokidar依赖
const checkDependencies = () => {
  try {
    require('chokidar');
  } catch (error) {
    console.log('📦 安装依赖: npm install chokidar');
    const { execSync } = require('child_process');
    execSync('npm install chokidar', { stdio: 'inherit' });
  }
};

// CLI接口
if (require.main === module) {
  checkDependencies();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  const watcher = new FileSystemMCPWatcher();
  
  switch (command) {
    case 'start':
      watcher.start();
      
      // 保持进程运行
      console.log('按 Ctrl+C 停止监听');
      process.on('SIGINT', () => {
        console.log('\n👋 停止文件监听');
        process.exit(0);
      });
      break;
      
    case 'test':
      // 测试关键词扫描
      const testFile = args[1] || path.join(__dirname, '../README.md');
      watcher.scanFileForKeywords(testFile);
      break;
      
    default:
      console.log(`
📁 文件系统监听MCP自动索引

使用方法:
  node fs-watcher-mcp.js start  # 启动文件监听
  node fs-watcher-mcp.js test   # 测试关键词扫描

支持的关键词触发:
  @ui-search "button card"  # 在文件中写入此关键词自动搜索
  @ui-find component        # 查找特定组件
  @ui-update               # 更新索引
  @ui-rebuild              # 重建索引

示例在React文件中使用:
  // @ui-search "hotel button"
  import Button from './hotel-ui/...';
      `);
      break;
  }
}

module.exports = FileSystemMCPWatcher;
