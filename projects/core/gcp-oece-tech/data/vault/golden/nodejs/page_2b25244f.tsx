'use client'
import Link from 'next/link'
import { Code2, ArrowLeft } from 'lucide-react'
import './tools.css'

const tools = [
  { id: 'base64', name: 'Base64編解碼', desc: '文本與Base64互轉', icon: '🔤' },
  { id: 'url', name: 'URL編解碼', desc: 'URL編碼解碼工具', icon: '🔗' },
  { id: 'json', name: 'JSON格式化', desc: 'JSON美化壓縮驗證', icon: '📋' },
  { id: 'regex', name: '正則測試', desc: '正則表達式測試器', icon: '🎯' },
  { id: 'hash', name: '哈希生成', desc: 'MD5/SHA-1/SHA-256', icon: '🔐' },
  { id: 'timestamp', name: '時間戳轉換', desc: 'Unix時間戳互轉', icon: '⏰' },
  { id: 'color', name: '顏色拾取', desc: 'HEX/RGB/HSL轉換', icon: '🎨' },
  { id: 'uuid', name: 'UUID生成', desc: '通用唯一識別碼', icon: '🆔' },
  { id: 'markdown', name: 'Markdown預覽', desc: '實時Markdown編輯', icon: '📝' },
  { id: 'ascii', name: '圖片轉字符畫', desc: '圖片轉ASCII藝術', icon: '🖼️' },
  { id: 'jwt', name: 'JWT解析', desc: 'JSON Web Token解析', icon: '🎫' },
  { id: 'yaml', name: 'YAML轉換', desc: 'YAML/JSON互轉', icon: '📄' },
  { id: 'diff', name: 'Diff對比', desc: '文本差異對比', icon: '🔍' },
  { id: 'lorem', name: 'Lorem生成', desc: '佔位文本生成', icon: '📰' },
  { id: 'sql', name: 'SQL格式化', desc: 'SQL美化工具', icon: '🗄️' },
  { id: 'wordcount', name: '字數統計', desc: '字符/詞數統計', icon: '📊' },
]

export default function ToolkitsDevelopmentPage() {
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
        <div className="tools-category-header">
          <Link href="/toolkits" className="back-link">
            <ArrowLeft size={20} />
            <span>返回工具包</span>
          </Link>
          <div className="category-info">
            <Code2 className="category-icon-large" size={48} />
            <div>
              <h1 className="category-title">02區 · 開發者工具</h1>
              <p className="category-desc">編碼加密 + 文本處理 + 代碼工具 · 16個工具 · 完全免費</p>
            </div>
          </div>
        </div>

        <div className="tools-grid-compact">
          {tools.map(tool => (
            <Link 
              key={tool.id} 
              href={`/toolkits/development/${tool.id}`}
              className="tool-card-compact"
            >
              <div className="tool-icon-emoji">{tool.icon}</div>
              <div className="tool-info">
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </div>
              <div className="tool-arrow">→</div>
            </Link>
          ))}
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
