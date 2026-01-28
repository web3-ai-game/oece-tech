export default function CommunityPage() {
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
          <h1 className="page-title">Community</h1>
          <p className="page-subtitle">即將推出...</p>
        </div>

        <div className="content-area">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">community.tsx</span>
            </div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> ls community/</p>
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
