'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'
import './json.css'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setError('')
    } catch (e: any) {
      setError(`錯誤：${e.message}`)
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (e: any) {
      setError(`錯誤：${e.message}`)
      setOutput('')
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
    setError('')
  }

  const handleExample = () => {
    const example = {
      name: "張三",
      age: 25,
      skills: ["JavaScript", "React", "Node.js"],
      address: {
        city: "台北",
        country: "台灣"
      },
      active: true
    }
    setInput(JSON.stringify(example))
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
            <div className="tool-icon-large">📋</div>
            <div>
              <h1 className="tool-title">JSON 格式化</h1>
              <p className="tool-subtitle">JSON美化、壓縮、驗證工具</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="tool-controls">
            <div className="mode-switch">
              <button className="mode-btn active" onClick={handleFormat}>
                <Maximize2 size={16} />
                美化格式
              </button>
              <button className="mode-btn" onClick={handleMinify}>
                <Minimize2 size={16} />
                壓縮
              </button>
              <button className="mode-btn" onClick={handleExample}>
                示例數據
              </button>
            </div>
            <div className="action-buttons">
              <select 
                value={indent} 
                onChange={(e) => setIndent(Number(e.target.value))}
                className="indent-select"
              >
                <option value={2}>縮進: 2空格</option>
                <option value={4}>縮進: 4空格</option>
                <option value={8}>縮進: Tab</option>
              </select>
              <button className="action-btn secondary" onClick={handleClear}>
                清空
              </button>
            </div>
          </div>

          <div className="tool-workspace">
            <div className="input-section">
              <label className="section-label">輸入 JSON</label>
              <textarea
                className="tool-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "示例", "value": 123}'
                rows={15}
                spellCheck={false}
              />
            </div>

            <div className="output-section">
              <div className="section-header">
                <label className="section-label">
                  {error ? '錯誤信息' : '格式化結果'}
                </label>
                {output && !error && (
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? '已複製' : '複製'}</span>
                  </button>
                )}
              </div>
              <textarea
                className={`tool-textarea output ${error ? 'error' : ''}`}
                value={error || output}
                readOnly
                placeholder="格式化結果將顯示在這裡..."
                rows={15}
                spellCheck={false}
              />
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 功能特點</h3>
            <ul>
              <li><strong>智能格式化</strong>：自動美化JSON結構，提高可讀性</li>
              <li><strong>壓縮功能</strong>：移除所有空白，最小化文件大小</li>
              <li><strong>語法驗證</strong>：實時檢測JSON格式錯誤</li>
              <li><strong>自定義縮進</strong>：支持2/4空格或Tab縮進</li>
            </ul>
            
            <h3>📌 使用場景</h3>
            <ul>
              <li>API響應數據查看</li>
              <li>配置文件編輯</li>
              <li>數據結構調試</li>
              <li>日誌分析</li>
            </ul>

            <h3>⚡ 快捷鍵</h3>
            <ul>
              <li><strong>Ctrl+Enter</strong>：格式化</li>
              <li><strong>Ctrl+K</strong>：清空</li>
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
