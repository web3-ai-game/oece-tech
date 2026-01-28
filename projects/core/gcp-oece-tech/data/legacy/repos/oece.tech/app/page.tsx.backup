import Link from 'next/link'
import { Shield, UserX, BookOpen, Code2, Zap, Globe2, ArrowRight, Cpu, Bot, TrendingUp, Cloud, FileText, Lock, Package, Languages, LogIn, UserPlus, Key, Brain, Binary, Skull, Twitter, Youtube, Github, Mail, MessageSquare, Send, MessageCircle, Facebook } from 'lucide-react'
import { getSeries } from './lib/getTutorials'
import GeminiChat from './components/GeminiChat'

export default function Home() {
  const allSeries = getSeries()
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="pixel-logo">OECE.TECH</div>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <Link href="/">首頁</Link>
            <Link href="/tutorials">教學</Link>
            <Link href="/journey">旅程</Link>
            <Link href="https://youtube.com/@yourchannel" target="_blank" rel="noopener">YouTube</Link>
          </nav>
          <div className="header-actions">
            <Link href="/toolkits" className="header-action-btn toolkit-btn">
              <Package size={18} />
              <span>工具包</span>
            </Link>
            <button className="header-action-btn lang-btn">
              <Languages size={18} />
              <span>EN</span>
            </button>
            <Link href="/login" className="header-action-btn login-btn">
              <LogIn size={18} />
              <span>登錄</span>
            </Link>
            <Link href="/register" className="header-action-btn register-btn">
              <UserPlus size={18} />
              <span>註冊</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          <div className="hero-glitch">
            <h1 className="hero-title" data-text="邊旅行邊寫程式">
              邊旅行邊寫程式
            </h1>
          </div>
          <p className="hero-subtitle">
            從大廠開發者到數位游牧 | 在路上寫程式的漂流日記
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">國家</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">編碼</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">遠端</span>
            </div>
          </div>
        </section>

        {/* 我的故事 - 獨立區域 */}
        <section className="story-section">
          <div className="story-section-header">
            <BookOpen className="story-section-icon" size={48} />
            <div className="story-section-info">
              <h2 className="story-section-title">我的故事</h2>
              <p className="story-section-subtitle">從大廠開發者到數位游牧的轉型日記</p>
            </div>
          </div>
          <div className="story-grid">
            <Link href="/tutorials/story-01-from-developer-to-nomad" className="story-featured-card">
              <div className="story-badge">最新</div>
              <h3 className="story-card-title">從大廠開發者到數位游牧：第一週的三個血淚教訓</h3>
              <p className="story-card-excerpt">
                離開舒適圈的第一週，我學到了三個關於遠端工作和自我管理的硬核教訓...
              </p>
              <div className="story-card-footer">
                <span className="story-date">2024-10-23</span>
                <ArrowRight size={20} className="story-arrow" />
              </div>
            </Link>
            <div className="story-upcoming">
              <p className="upcoming-title">更多故事即將推出</p>
              <ul className="upcoming-list">
                <li>第二週：找到屬於自己的工作節奏</li>
                <li>第三週：建立遠端社交網絡</li>
                <li>第四週：財務管理與稅務規劃</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 三个特色卡片 - 教学卡片更宽 */}
        <section className="feature-cards-section">
          <div className="feature-card card-tutorials wide-card">
            <div className="feature-card-icon">📚</div>
            <h3 className="feature-card-title">最新教學</h3>
            <p className="feature-card-desc">來自實際開發經驗的技術指南和教程</p>
            <Link href="/tutorials" className="feature-card-btn">
              瀏覽教學 →
            </Link>
          </div>
          
          <div className="feature-card card-journey">
            <div className="feature-card-icon">🌍</div>
            <h3 className="feature-card-title">旅程更新</h3>
            <p className="feature-card-desc">環遊世界寫程式的故事和經驗</p>
            <Link href="/journey" className="feature-card-btn">
              閱讀故事 →
            </Link>
          </div>
          
          <div className="feature-card card-tweets">
            <div className="feature-card-icon">🔔</div>
            <h3 className="feature-card-title">最新動態</h3>
            <p className="feature-card-desc">Twitter動態將整合在這裡，來自@youraccount的實時更新</p>
            <a href="https://twitter.com/youraccount" target="_blank" rel="noopener" className="feature-card-btn">
              關注 X →
            </a>
          </div>
        </section>

        {/* 免費工具預覽卡片 */}
        <section className="free-tool-preview">
          <div className="free-tool-header">
            <Zap className="free-tool-icon" size={32} />
            <div className="free-tool-info">
              <h3 className="free-tool-title">🚀 免費常用工具</h3>
              <p className="free-tool-subtitle">Pro版工具免費體驗 · 無需註冊</p>
            </div>
          </div>
          <div className="free-tool-content">
            <div className="tool-item">
              <Globe2 size={24} className="tool-item-icon" />
              <div className="tool-item-info">
                <h4 className="tool-item-title">IP 位置查詢</h4>
                <p className="tool-item-desc">查看您的公網IP、地理位置、ISP信息</p>
              </div>
              <Link href="/toolkits/network/ip-check" className="tool-item-btn">
                立即使用 →
              </Link>
            </div>
            <div className="tool-item">
              <UserX size={24} className="tool-item-icon" />
              <div className="tool-item-info">
                <h4 className="tool-item-title">匿名程度檢測</h4>
                <p className="tool-item-desc">檢測您的瀏覽器指紋、WebRTC泄漏</p>
              </div>
              <Link href="/toolkits/security/privacy-check" className="tool-item-btn">
                立即使用 →
              </Link>
            </div>
            <div className="tool-item">
              <Lock size={24} className="tool-item-icon" />
              <div className="tool-item-info">
                <h4 className="tool-item-title">DNS 泄漏檢測</h4>
                <p className="tool-item-desc">檢測您的DNS請求是否泄漏真實位置</p>
              </div>
              <Link href="/toolkits/security/dns-leak" className="tool-item-btn">
                立即使用 →
              </Link>
            </div>
          </div>
        </section>

        {/* 米斯特周 AI 聊天助手 */}
        <section className="gemini-chat-section">
          <div className="gemini-section-header">
            <Bot className="gemini-section-icon" size={32} />
            <div className="gemini-section-info">
              <h3 className="gemini-section-title">💬 與米斯特周聊天</h3>
              <p className="gemini-section-subtitle">數位游牧開發者 · 由 Gemini 2.5 Pro 驅動 · 免費使用</p>
            </div>
          </div>
          <GeminiChat />
        </section>

        {/* 工具包预览目录 */}
        <section className="toolkits-preview-section">
          <div className="toolkits-preview-header">
            <Package className="toolkits-preview-icon" size={48} />
            <div className="toolkits-preview-info">
              <h2 className="toolkits-preview-title">開發者工具包</h2>
              <p className="toolkits-preview-subtitle">70個精選工具 · 50個免費 + 20個專業版</p>
            </div>
            <Link href="/toolkits" className="toolkits-view-all">
              查看全部工具 →
            </Link>
          </div>

          <div className="toolkits-grid">
            <Link href="/toolkits/security" className="toolkit-zone zone-premium">
              <div className="zone-badge">需註冊</div>
              <Shield className="zone-icon" size={40} />
              <h3 className="zone-title">01區 · 核心技術棧</h3>
              <p className="zone-desc">滲透安防 + 匿名化工具</p>
              <div className="zone-stats">
                <span className="stat">10個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat premium">專業版</span>
              </div>
              <ul className="zone-tools-list">
                <li>端口掃描器 · 子域名枚舉</li>
                <li>漏洞數據庫 · 哈希破解</li>
                <li>VPN測試 · DNS泄漏檢測</li>
              </ul>
            </Link>

            <Link href="/toolkits/development" className="toolkit-zone zone-free">
              <div className="zone-badge free">免費</div>
              <Code2 className="zone-icon" size={40} />
              <h3 className="zone-title">02區 · 開發者工具</h3>
              <p className="zone-desc">編碼加密 + 文本處理 + 代碼工具</p>
              <div className="zone-stats">
                <span className="stat">15個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat free-badge">完全免費</span>
              </div>
              <ul className="zone-tools-list">
                <li>Base64 · JWT解析 · JSON格式化</li>
                <li>Markdown預覽 · 正則測試</li>
                <li>SQL格式化 · CSS壓縮</li>
              </ul>
            </Link>

            <Link href="/toolkits/nomad" className="toolkit-zone zone-free">
              <div className="zone-badge free">免費</div>
              <Globe2 className="zone-icon" size={40} />
              <h3 className="zone-title">03區 · 數字游民</h3>
              <p className="zone-desc">旅行辦公必備工具集</p>
              <div className="zone-stats">
                <span className="stat">10個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat free-badge">完全免費</span>
              </div>
              <ul className="zone-tools-list">
                <li>時區轉換 · 簽證計算器</li>
                <li>匯率轉換 · 生活成本對比</li>
                <li>共享辦公地圖 · 航班追蹤</li>
              </ul>
            </Link>

            <Link href="/toolkits/api" className="toolkit-zone zone-free">
              <div className="zone-badge free">免費</div>
              <Zap className="zone-icon" size={40} />
              <h3 className="zone-title">04區 · API/網絡</h3>
              <p className="zone-desc">API測試 + 網絡診斷工具</p>
              <div className="zone-stats">
                <span className="stat">10個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat free-badge">完全免費</span>
              </div>
              <ul className="zone-tools-list">
                <li>Webhook測試 · cURL生成器</li>
                <li>DNS查詢 · SSL證書檢查</li>
                <li>IP查詢 · QR碼生成</li>
              </ul>
            </Link>

            <Link href="/toolkits/media" className="toolkit-zone zone-free">
              <div className="zone-badge free">免費</div>
              <FileText className="zone-icon" size={40} />
              <h3 className="zone-title">05區 · 圖像/媒體</h3>
              <p className="zone-desc">圖片處理 + 格式轉換</p>
              <div className="zone-stats">
                <span className="stat">5個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat free-badge">完全免費</span>
              </div>
              <ul className="zone-tools-list">
                <li>圖片壓縮 · 格式轉換</li>
                <li>顏色拾取 · SVG優化</li>
                <li>Favicon生成器</li>
              </ul>
            </Link>

            <Link href="/toolkits/darkweb" className="toolkit-zone zone-dark">
              <div className="zone-badge dark">專業會員</div>
              <Skull className="zone-icon" size={40} />
              <h3 className="zone-title">06區 · 暗黑系列</h3>
              <p className="zone-desc">高級信息收集 + 社交聚合</p>
              <div className="zone-stats">
                <span className="stat">20個工具</span>
                <span className="stat-divider">·</span>
                <span className="stat dark-badge">Pro專屬</span>
              </div>
              <ul className="zone-tools-list">
                <li>社交聚合 · 郵箱挖掘</li>
                <li>域名歷史 · GitHub掃描</li>
                <li>SQL注入檢測 · 暗網監控</li>
              </ul>
            </Link>
          </div>

          <div className="toolkits-tech-stack">
            <p className="tech-stack-label">技術棧</p>
            <div className="tech-stack-badges">
              <span className="tech-badge">Next.js 15</span>
              <span className="tech-badge">Cloudflare Workers</span>
              <span className="tech-badge">D1 Database</span>
              <span className="tech-badge">Clerk Auth</span>
              <span className="tech-badge">R2 Storage</span>
            </div>
          </div>
        </section>

        {/* 免費教學 - 5個系列 */}
        <section className="home-series-section">
          {allSeries.map((series, index) => (
            <div key={series.id} className={`home-series-block series-${series.color}`}>
              <div className="home-series-header">
                <span className="home-series-icon">{series.icon}</span>
                <div className="home-series-info">
                  <h2 className="home-series-title">{series.id}系列 · {series.name}</h2>
                  <p className="home-series-desc">{series.description}</p>
                </div>
                <div className="home-series-count">
                  <span className="count-num">{series.tutorials.length}</span>
                  <span className="count-label">篇教學</span>
                </div>
              </div>
              
              {series.tutorials.length > 0 ? (
                <div className="home-tutorial-list">
                  {series.tutorials.map(tutorial => (
                    <Link
                      key={tutorial.slug}
                      href={`/tutorials/${tutorial.slug}`}
                      className="home-tutorial-item"
                    >
                      <span className="tutorial-num">{tutorial.seriesNumber}</span>
                      <span className="tutorial-name">{tutorial.title}</span>
                      <ArrowRight size={16} className="tutorial-arrow-icon" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="home-tutorial-empty">
                  <p>即將推出...</p>
                </div>
              )}
              
              <Link href="/tutorials" className="view-all-btn">
                查看全部 {series.name} →
              </Link>
            </div>
          ))}
        </section>

        {/* 三个特色卡片 */}
        <section className="feature-cards-section">
          <div className="feature-card card-tutorials">
            <div className="feature-card-icon">📚</div>
            <h3 className="feature-card-title">Latest Tutorials</h3>
            <p className="feature-card-desc">Technical guides and tutorials from real-world development experiences</p>
            <Link href="/tutorials" className="feature-card-btn">
              Browse Tutorials →
            </Link>
          </div>
          
          <div className="feature-card card-journey">
            <div className="feature-card-icon">🌍</div>
            <h3 className="feature-card-title">Journey Updates</h3>
            <p className="feature-card-desc">Stories and experiences from coding around the world</p>
            <Link href="/journey" className="feature-card-btn">
              Read Stories →
            </Link>
          </div>
          
          <div className="feature-card card-tweets">
            <div className="feature-card-icon">🔔</div>
            <h3 className="feature-card-title">Latest Tweets</h3>
            <p className="feature-card-desc">Twitter feed will be integrated here. Real-time updates from @youraccount</p>
            <a href="https://twitter.com/youraccount" target="_blank" rel="noopener" className="feature-card-btn">
              Follow on X →
            </a>
          </div>
        </section>

        {/* 專業內容 - 需要註冊 */}
        <section className="premium-section">
          <div className="premium-header">
            <Lock className="premium-icon" size={40} />
            <h2 className="premium-title">專業內容</h2>
            <p className="premium-subtitle">註冊後解鎖更多深度教學</p>
          </div>
          <div className="premium-grid">
            <div className="premium-card">
              <Shield className="premium-card-icon" size={40} />
              <h3>滲透安防</h3>
              <p>Kali Linux、滲透測試、安全加固</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
            
            <div className="premium-card">
              <UserX className="premium-card-icon" size={40} />
              <h3>匿名化</h3>
              <p>Tor、VPN、數位足跡清除</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
            
            <div className="premium-card">
              <Key className="premium-card-icon" size={40} />
              <h3>密碼學</h3>
              <p>加密算法、區塊鏈、零知識證明</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
            
            <div className="premium-card">
              <Brain className="premium-card-icon" size={40} />
              <h3>社會工程學</h3>
              <p>人性弱點、心理學、信息收集</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
            
            <div className="premium-card">
              <Binary className="premium-card-icon" size={40} />
              <h3>逆向工程</h3>
              <p>反編譯、破解分析、二進制安全</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
            
            <div className="premium-card">
              <Zap className="premium-card-icon" size={40} />
              <h3>灰色科普</h3>
              <p>技術邊界、法律與道德探討</p>
              <button className="premium-button">註冊解鎖</button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">about.sh</span>
            </div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> cat about.txt</p>
              <p className="terminal-text">
                前大廠開發者，現數位游牧。
                一邊探索世界，一邊構建軟體。
                分享教學、經驗和沿途學到的教訓。
              </p>
              <p className="terminal-text">
                🔧 技術棧: 全端開發、DevOps、AI/ML
                <br/>
                📍 當前位置: [載入中...]
                <br/>
                🎯 使命: 證明你可以在任何地方寫程式
              </p>
              <p><span className="prompt">$</span> <span className="cursor">_</span></p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>聯絡方式</h3>
            <div className="social-links">
              <a href="https://twitter.com/youraccount" target="_blank" rel="noopener" className="social-icon" title="X/Twitter">
                <Twitter size={22} />
              </a>
              <a href="https://youtube.com/@yourchannel" target="_blank" rel="noopener" className="social-icon" title="YouTube">
                <Youtube size={22} />
              </a>
              <a href="https://github.com/youraccount" target="_blank" rel="noopener" className="social-icon" title="GitHub">
                <Github size={22} />
              </a>
              <a href="https://t.me/youraccount" target="_blank" rel="noopener" className="social-icon" title="Telegram">
                <Send size={22} />
              </a>
              <a href="https://wa.me/yourphone" target="_blank" rel="noopener" className="social-icon" title="WhatsApp">
                <MessageCircle size={22} />
              </a>
              <a href="https://facebook.com/yourpage" target="_blank" rel="noopener" className="social-icon" title="Facebook">
                <Facebook size={22} />
              </a>
              <a href="https://line.me/ti/p/~yourid" target="_blank" rel="noopener" className="social-icon" title="LINE">
                <MessageSquare size={22} />
              </a>
              <a href="https://join.slack.com/t/yourworkspace/shared_invite/xxxxx" target="_blank" rel="noopener" className="social-icon" title="Slack社群">
                <MessageSquare size={22} strokeWidth={2.5} />
              </a>
              <a href="mailto:contact@oece.tech" className="social-icon" title="Email">
                <Mail size={22} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>探索</h3>
            <div className="footer-links">
              <Link href="/tutorials">教學</Link>
              <Link href="/journey">旅程</Link>
              <Link href="/toolkits">工具包</Link>
              <Link href="/about">關於</Link>
            </div>
          </div>
          <div className="footer-section">
            <h3>技術中心</h3>
            <p className="footer-desc">
              教學、經驗和連接的中心樞紐。
              使用Next.js + Cloudflare構建。
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>
    </div>
  )
}
