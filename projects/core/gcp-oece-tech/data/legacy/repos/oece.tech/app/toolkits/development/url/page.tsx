'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import './url.css'

export default function URLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch (error) {
      setOutput('錯誤：無效的URL編碼')
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

  const handleExample = () => {
    if (mode === 'encode') {
      setInput('https://example.com/搜索?關鍵字=測試&頁碼=1')
    } else {
      setInput('https://example.com/%E6%90%9C%E7%B4%A2?%E9%97%9C%E9%8D%B5%E5%AD%97=%E6%B8%AC%E8%A9%A6&%E9%A0%81%E7%A2%BC=1')
    }
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
            <div className="tool-icon-large">🔗</div>
            <div>
              <h1 className="tool-title">URL 編解碼</h1>
              <p className="tool-subtitle">URL編碼和解碼工具</p>
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
              <button className="action-btn secondary" onClick={handleExample}>
                示例
              </button>
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
                {mode === 'encode' ? '原始URL' : 'URL編碼'}
              </label>
              <textarea
                className="tool-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 
                  '輸入要編碼的URL...\n例如：https://example.com/搜索?查詢=中文' : 
                  '輸入URL編碼...\n例如：https%3A%2F%2Fexample.com'
                }
                rows={10}
              />
            </div>

            <div className="output-section">
              <div className="section-header">
                <label className="section-label">
                  {mode === 'encode' ? 'URL編碼結果' : '解碼結果'}
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
              <li><strong>編碼模式</strong>：將URL中的特殊字符轉換為%編碼</li>
              <li><strong>解碼模式</strong>：將URL編碼還原為可讀文本</li>
              <li>支持中文和所有特殊字符</li>
              <li>符合RFC 3986標準</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>URL參數處理</li>
              <li>API請求構建</li>
              <li>查詢字符串處理</li>
              <li>鏈接分享和跳轉</li>
            </ul>

            <h3>⚠️ 注意事項</h3>
            <ul>
              <li>編碼會將空格轉為 %20</li>
              <li>某些字符（如 / ? # &）在URL中有特殊含義</li>
              <li>編碼只處理參數值，不處理整個URL結構</li>
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
