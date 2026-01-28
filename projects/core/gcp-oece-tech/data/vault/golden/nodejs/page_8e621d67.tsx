'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import './timestamp.css'

export default function TimestampConverter() {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [timestamp, setTimestamp] = useState('')
  const [datetime, setDatetime] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ts = e.target.value
    setTimestamp(ts)
    if (ts) {
      const num = parseInt(ts)
      const date = new Date(num.toString().length === 10 ? num * 1000 : num)
      setDatetime(date.toISOString().slice(0, 16))
    }
  }

  const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value
    setDatetime(dt)
    if (dt) {
      const ts = new Date(dt).getTime()
      setTimestamp(ts.toString())
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (ts: number) => {
    const date = new Date(ts)
    return {
      iso: date.toISOString(),
      local: date.toLocaleString('zh-TW'),
      utc: date.toUTCString(),
      unix: Math.floor(ts / 1000)
    }
  }

  const current = formatDate(currentTime)

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
            <div className="tool-icon-large">⏰</div>
            <div>
              <h1 className="tool-title">時間戳轉換器</h1>
              <p className="tool-subtitle">Unix時間戳與日期時間互轉</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="current-time-card">
            <div className="current-time-header">
              <Clock size={24} />
              <h3>當前時間</h3>
            </div>
            <div className="time-display">
              <div className="time-item">
                <span className="time-label">Unix時間戳 (ms)</span>
                <div className="time-value-row">
                  <code>{currentTime}</code>
                  <button className="copy-btn-small" onClick={() => handleCopy(currentTime.toString())}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="time-item">
                <span className="time-label">Unix時間戳 (s)</span>
                <div className="time-value-row">
                  <code>{current.unix}</code>
                  <button className="copy-btn-small" onClick={() => handleCopy(current.unix.toString())}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="time-item">
                <span className="time-label">本地時間</span>
                <code>{current.local}</code>
              </div>
              <div className="time-item">
                <span className="time-label">ISO 8601</span>
                <code>{current.iso}</code>
              </div>
            </div>
          </div>

          <div className="converter-section">
            <div className="converter-card">
              <label className="section-label">時間戳轉日期</label>
              <input
                type="text"
                className="converter-input"
                value={timestamp}
                onChange={handleTimestampChange}
                placeholder="輸入時間戳（毫秒或秒）"
              />
              {timestamp && (
                <div className="result-display">
                  <code>{formatDate(parseInt(timestamp.length === 10 ? timestamp + '000' : timestamp)).local}</code>
                </div>
              )}
            </div>

            <div className="converter-card">
              <label className="section-label">日期轉時間戳</label>
              <input
                type="datetime-local"
                className="converter-input"
                value={datetime}
                onChange={handleDatetimeChange}
              />
              {datetime && (
                <div className="result-display">
                  <code>{timestamp}</code>
                  <button className="copy-btn" onClick={() => handleCopy(timestamp)}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 使用說明</h3>
            <ul>
              <li><strong>Unix時間戳</strong>：從1970年1月1日 00:00:00 UTC開始的毫秒數</li>
              <li><strong>支持格式</strong>：10位秒級時間戳和13位毫秒級時間戳</li>
              <li><strong>實時更新</strong>：當前時間每秒自動刷新</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>API調試和日誌分析</li>
              <li>數據庫時間字段處理</li>
              <li>前後端時間同步</li>
              <li>定時任務設置</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>

      <style jsx>{`
        .current-time-card {
          background: var(--bg-secondary);
          border: 2px solid var(--accent-cyan);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .current-time-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: var(--accent-cyan);
        }
        
        .current-time-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .time-display {
          display: grid;
          gap: 1rem;
        }
        
        .time-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .time-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .time-value-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .time-item code {
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--accent-cyan);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          flex: 1;
        }
        
        .copy-btn-small {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .copy-btn-small:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }
        
        .converter-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .converter-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
        }
        
        .converter-input {
          width: 100%;
          padding: 1rem;
          margin-top: 0.75rem;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
        }
        
        .converter-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
        }
        
        .result-display {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .result-display code {
          flex: 1;
          color: var(--accent-pink);
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .converter-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
