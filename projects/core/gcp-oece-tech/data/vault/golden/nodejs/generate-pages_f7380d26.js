#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 要生成的页面列表
const pages = [
  // 工具页面
  { name: 'toolkits', title: '工具包', description: '精选开发工具包合集' },
  { name: 'login', title: '登录', description: '用户登录' },
  { name: 'register', title: '注册', description: '用户注册' },
  { name: 'profile', title: '个人中心', description: '用户个人信息管理' },
  { name: 'journey', title: '旅程', description: '数字游民的环球旅程' },
  
  // 专业内容页面
  { name: 'security', title: '渗透安防', description: 'Kali Linux、渗透测试、安全加固' },
  { name: 'anonymous', title: '匿名化', description: 'Tor、VPN、数位足跡清除' },
  { name: 'cryptography', title: '密码学', description: '加密算法、区块链、零知识证明' },
  { name: 'social-engineering', title: '社会工程学', description: '人性弱点、心理学、信息收集' },
  { name: 'reverse-engineering', title: '逆向工程', description: '反编译、破解分析、二进制安全' },
  { name: 'grey-area', title: '灰色科普', description: '技术边界、法律与道德探讨' },
  
  // 系列详情页
  { name: 'series/01-core-tech', title: '01系列：核心技术栈', description: '全端开发环境、CI/CD、资料库、安全实战' },
  { name: 'series/02-ai-tools', title: '02系列：AI工具链', description: 'JetBrains AI、GitLab Duo、Claude实战' },
  { name: 'series/03-dev-ip', title: '03系列：开发者转型IP', description: '技术博主、YouTube、内容变现' },
  { name: 'series/04-cloud-infra', title: '04系列：云端基建', description: 'GCP、DO、Cloudflare、监控告警' },
  { name: 'series/05-content-automation', title: '05系列：内容生产自动化', description: 'Markdown、AI写作、SEO优化' },
  
  // 工具包分类页面
  { name: 'toolkits/development', title: '开发工具', description: 'IDE、编辑器、调试工具' },
  { name: 'toolkits/devops', title: 'DevOps工具', description: 'CI/CD、容器化、监控告警' },
  { name: 'toolkits/security', title: '安全工具', description: '渗透测试、漏洞扫描、加密工具' },
  { name: 'toolkits/ai', title: 'AI工具', description: 'AI编程助手、代码生成、自动化' },
  { name: 'toolkits/productivity', title: '效率工具', description: '时间管理、笔记、协作工具' },
  
  // 资源页面
  { name: 'resources', title: '资源中心', description: '精选开发资源和学习材料' },
  { name: 'blog', title: '博客', description: '技术文章和思考' },
  { name: 'about', title: '关于', description: '关于OECE.TECH' },
  { name: 'contact', title: '联系方式', description: '联系我们' },
  { name: 'privacy', title: '隐私政策', description: '用户隐私保护政策' },
  { name: 'terms', title: '服务条款', description: '使用条款和协议' },
  
  // 搜索和标签
  { name: 'search', title: '搜索', description: '全站内容搜索' },
  { name: 'tags', title: '标签', description: '按标签浏览内容' },
  
  // 错误页面
  { name: '404', title: '404 - 页面未找到', description: '您访问的页面不存在' },
  { name: '500', title: '500 - 服务器错误', description: '服务器内部错误' },
  
  // Dashboard页面
  { name: 'dashboard', title: '控制台', description: '用户控制台' },
  { name: 'dashboard/settings', title: '设置', description: '账户设置' },
  { name: 'dashboard/bookmarks', title: '书签', description: '收藏的文章' },
  { name: 'dashboard/progress', title: '学习进度', description: '学习进度追踪' },
  
  // API文档
  { name: 'api', title: 'API文档', description: 'OECE.TECH API文档' },
  { name: 'api/auth', title: '认证API', description: '用户认证接口' },
  { name: 'api/tutorials', title: '教程API', description: '教程数据接口' },
  
  // 社区页面
  { name: 'community', title: '社区', description: '开发者社区' },
  { name: 'community/discussions', title: '讨论区', description: '技术讨论' },
  { name: 'community/showcase', title: '作品展示', description: '社区作品' },
  
  // 订阅和通知
  { name: 'subscribe', title: '订阅', description: '订阅更新通知' },
  { name: 'notifications', title: '通知', description: '系统通知' },
  
  // Sitemap和RSS
  { name: 'sitemap', title: '网站地图', description: '全站内容导航' },
  { name: 'rss', title: 'RSS订阅', description: 'RSS内容订阅' },
  
  // 赞助和支持
  { name: 'sponsor', title: '赞助支持', description: '支持OECE.TECH发展' },
  { name: 'donate', title: '捐赠', description: '捐赠支持' },
  
  // 统计和分析
  { name: 'stats', title: '数据统计', description: '网站数据分析' },
  { name: 'analytics', title: '分析报告', description: '内容分析' },
];

const pageTemplate = (page) => `export default function ${toPascalCase(page.name)}Page() {
  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <a href="/" className="pixel-logo">OECE.TECH</a>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <a href="/">首頁</a>
            <a href="/tutorials">教學</a>
            <a href="/journey">旅程</a>
            <a href="https://youtube.com/@yourchannel" target="_blank" rel="noopener">YouTube</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <h1 className="page-title">{page.title}</h1>
          <p className="page-subtitle">{page.description}</p>
        </div>

        <div className="content-area">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">${page.name}.tsx</span>
            </div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> ls ${page.name}/</p>
              <p className="terminal-text">即將推出...</p>
              <p className="terminal-text">敬請期待！</p>
              <p><span className="prompt">$</span> <span className="cursor">_</span></p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>
    </div>
  )
}
`;

function toPascalCase(str) {
  return str
    .split(/[-/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function createPage(page) {
  const appDir = path.join(process.cwd(), 'app');
  const pagePath = path.join(appDir, page.name);
  const pageFile = path.join(pagePath, 'page.tsx');

  // 创建目录
  if (!fs.existsSync(pagePath)) {
    fs.mkdirSync(pagePath, { recursive: true });
  }

  // 写入页面文件
  fs.writeFileSync(pageFile, pageTemplate(page));
  console.log(`✅ Created: ${page.name}/page.tsx`);
}

// 生成所有页面
console.log('🚀 开始生成页面...\n');
pages.forEach(createPage);
console.log(`\n✨ 完成！共生成 ${pages.length} 个页面`);
