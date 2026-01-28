export default function NotFound() {
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
          <h1 className="page-title">404 - 頁面未找到</h1>
          <p className="page-subtitle">抱歉，您訪問的頁面不存在</p>
        </div>

        <div className="content-area">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">404.tsx</span>
            </div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> ls 404/</p>
              <p className="terminal-text">頁面不存在...</p>
              <p className="terminal-text">返回<a href="/">首頁</a></p>
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
