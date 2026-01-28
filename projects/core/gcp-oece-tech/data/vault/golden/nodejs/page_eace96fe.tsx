'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import './base64.css'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch (error) {
      setOutput('錯誤：無效的輸入')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

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
            <Link href="/toolkits">工具包</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="tool-page-header">
          <Link href="/toolkits/development" className="back-link">
            <ArrowLeft size={20} />
            <span>返回開發者工具</span>
          </Link>
          <div className="tool-title-section">
            <div className="tool-icon-large">🔤</div>
            <div>
              <h1 className="tool-title">Base64 編解碼</h1>
              <p className="tool-subtitle">文本與Base64格式互相轉換</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="tool-controls">
            <div className="mode-switch">
              <button 
                className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
                onClick={() => setMode('encode')}
              >
                編碼 (Encode)
              </button>
              <button 
                className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
                onClick={() => setMode('decode')}
              >
                解碼 (Decode)
              </button>
            </div>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={handleConvert}>
                轉換
              </button>
              <button className="action-btn secondary" onClick={handleClear}>
                清空
              </button>
            </div>
          </div>

          <div className="tool-workspace">
            <div className="input-section">
              <label className="section-label">
                {mode === 'encode' ? '原始文本' : 'Base64編碼'}
              </label>
              <textarea
                className="tool-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? '輸入要編碼的文本...' : '輸入Base64編碼...'}
                rows={10}
              />
            </div>

            <div className="output-section">
              <div className="section-header">
                <label className="section-label">
                  {mode === 'encode' ? 'Base64編碼' : '解碼結果'}
                </label>
                {output && (
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? '已複製' : '複製'}</span>
                  </button>
                )}
              </div>
              <textarea
                className="tool-textarea output"
                value={output}
                readOnly
                placeholder="轉換結果將顯示在這裡..."
                rows={10}
              />
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 使用說明</h3>
            <ul>
              <li><strong>編碼模式</strong>：將普通文本轉換為Base64格式</li>
              <li><strong>解碼模式</strong>：將Base64格式還原為原始文本</li>
              <li>支持中文和特殊字符</li>
              <li>自動處理UTF-8編碼</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>數據傳輸編碼</li>
              <li>URL參數加密</li>
              <li>郵件附件編碼</li>
              <li>API請求/響應處理</li>
            </ul>
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
