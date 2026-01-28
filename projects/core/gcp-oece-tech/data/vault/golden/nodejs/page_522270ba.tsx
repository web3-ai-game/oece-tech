import Link from 'next/link'
import { Shield, Code2, Globe2, Zap, FileText, Skull, Package, ArrowRight } from 'lucide-react'
import './toolkits.css'

export default function ToolkitsPage() {
  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Link href="/" className="pixel-logo">OECE.TECH</Link>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <Link href="/">首頁</Link>
            <Link href="/tutorials">教學</Link>
            <Link href="/journey">旅程</Link>
            <Link href="/toolkits">工具包</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="toolkits-page-header">
          <Package className="toolkits-page-icon" size={64} />
          <h1 className="toolkits-page-title">開發者工具包</h1>
          <p className="toolkits-page-subtitle">70個精選工具 · 50個免費 + 20個專業版</p>
          <div className="toolkits-stats">
            <div className="stat-box">
              <span className="stat-value">6</span>
              <span className="stat-label">工具區</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">70</span>
              <span className="stat-label">總工具數</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">50</span>
              <span className="stat-label">免費工具</span>
            </div>
          </div>
        </div>

        <div className="toolkits-directory">
          <Link href="/toolkits/security" className="toolkit-zone-large zone-premium">
            <div className="zone-badge">需註冊</div>
            <Shield className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">01區 · 核心技術棧</h2>
            <p className="zone-desc-large">滲透安防 + 匿名化工具</p>
            <div className="zone-stats-large">
              <span>10個工具</span>
              <span className="divider">·</span>
              <span className="premium-tag">專業版</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">端口掃描器</div>
              <div className="tool-tag">子域名枚舉</div>
              <div className="tool-tag">目錄爆破</div>
              <div className="tool-tag">漏洞查詢</div>
              <div className="tool-tag">哈希破解</div>
              <div className="tool-tag">VPN測試</div>
              <div className="tool-tag">代理生成</div>
              <div className="tool-tag">DNS檢測</div>
              <div className="tool-tag">指紋分析</div>
              <div className="tool-tag">Tor查詢</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link href="/toolkits/development" className="toolkit-zone-large zone-free">
            <div className="zone-badge free">免費</div>
            <Code2 className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">02區 · 開發者工具</h2>
            <p className="zone-desc-large">編碼加密 + 文本處理 + 代碼工具</p>
            <div className="zone-stats-large">
              <span>15個工具</span>
              <span className="divider">·</span>
              <span className="free-tag">完全免費</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">Base64編解碼</div>
              <div className="tool-tag">URL編解碼</div>
              <div className="tool-tag">JWT解析</div>
              <div className="tool-tag">JSON格式化</div>
              <div className="tool-tag">YAML轉換</div>
              <div className="tool-tag">MD5生成</div>
              <div className="tool-tag">AES加密</div>
              <div className="tool-tag">Markdown預覽</div>
              <div className="tool-tag">正則測試</div>
              <div className="tool-tag">Diff對比</div>
              <div className="tool-tag">Lorem生成</div>
              <div className="tool-tag">字數統計</div>
              <div className="tool-tag">SQL格式化</div>
              <div className="tool-tag">CSS壓縮</div>
              <div className="tool-tag">JS混淆</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link href="/toolkits/nomad" className="toolkit-zone-large zone-free">
            <div className="zone-badge free">免費</div>
            <Globe2 className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">03區 · 數字游民</h2>
            <p className="zone-desc-large">旅行辦公必備工具集</p>
            <div className="zone-stats-large">
              <span>10個工具</span>
              <span className="divider">·</span>
              <span className="free-tag">完全免費</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">時區轉換</div>
              <div className="tool-tag">簽證計算</div>
              <div className="tool-tag">匯率轉換</div>
              <div className="tool-tag">生活成本對比</div>
              <div className="tool-tag">機場WiFi</div>
              <div className="tool-tag">SIM卡比較</div>
              <div className="tool-tag">共享辦公</div>
              <div className="tool-tag">航班追蹤</div>
              <div className="tool-tag">護照排名</div>
              <div className="tool-tag">簽證清單</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link href="/toolkits/api" className="toolkit-zone-large zone-free">
            <div className="zone-badge free">免費</div>
            <Zap className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">04區 · API/網絡</h2>
            <p className="zone-desc-large">API測試 + 網絡診斷工具</p>
            <div className="zone-stats-large">
              <span>10個工具</span>
              <span className="divider">·</span>
              <span className="free-tag">完全免費</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">HTTP狀態碼</div>
              <div className="tool-tag">Webhook測試</div>
              <div className="tool-tag">cURL生成</div>
              <div className="tool-tag">API模擬</div>
              <div className="tool-tag">CORS測試</div>
              <div className="tool-tag">DNS查詢</div>
              <div className="tool-tag">SSL證書</div>
              <div className="tool-tag">IP查詢</div>
              <div className="tool-tag">UA解析</div>
              <div className="tool-tag">QR生成</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link href="/toolkits/media" className="toolkit-zone-large zone-free">
            <div className="zone-badge free">免費</div>
            <FileText className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">05區 · 圖像/媒體</h2>
            <p className="zone-desc-large">圖片處理 + 格式轉換</p>
            <div className="zone-stats-large">
              <span>5個工具</span>
              <span className="divider">·</span>
              <span className="free-tag">完全免費</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">圖片壓縮</div>
              <div className="tool-tag">格式轉換</div>
              <div className="tool-tag">顏色拾取</div>
              <div className="tool-tag">SVG優化</div>
              <div className="tool-tag">Favicon生成</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>

          <Link href="/toolkits/darkweb" className="toolkit-zone-large zone-dark">
            <div className="zone-badge dark">專業會員</div>
            <Skull className="zone-icon-large" size={40} />
            <h2 className="zone-title-large">06區 · 暗黑系列</h2>
            <p className="zone-desc-large">高級信息收集 + 社交聚合</p>
            <div className="zone-stats-large">
              <span>20個工具</span>
              <span className="divider">·</span>
              <span className="dark-tag">Pro專屬</span>
            </div>
            <div className="tools-preview">
              <div className="tool-tag">社交聚合</div>
              <div className="tool-tag">郵箱挖掘</div>
              <div className="tool-tag">域名歷史</div>
              <div className="tool-tag">GitHub掃描</div>
              <div className="tool-tag">SQL檢測</div>
              <div className="tool-tag">暗網監控</div>
              <div className="tool-tag">數據泄露查詢</div>
              <div className="tool-tag">威脅情報</div>
              <div className="tool-tag">子域接管</div>
              <div className="tool-tag">端口指紋</div>
              <div className="tool-tag">+ 10個更多工具</div>
            </div>
            <div className="zone-arrow">
              <ArrowRight size={24} />
            </div>
          </Link>
        </div>

        <div className="toolkits-footer-cta">
          <h3>準備好開始了嗎？</h3>
          <p>免費註冊即可使用50個工具，升級Pro解鎖全部70個工具</p>
          <div className="cta-buttons">
            <Link href="/register" className="cta-btn primary">免費註冊</Link>
            <Link href="/pricing" className="cta-btn secondary">查看定價</Link>
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
