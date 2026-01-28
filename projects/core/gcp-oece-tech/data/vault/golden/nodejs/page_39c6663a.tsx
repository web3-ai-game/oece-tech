'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import './uuid.css'

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [copied, setCopied] = useState('')
  const [version, setVersion] = useState<'v4' | 'v1'>('v4')

  const generateUUID = () => {
    if (version === 'v4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    } else {
      // 简化的v1实现
      const now = Date.now()
      const randomPart = Math.random().toString(16).substring(2, 15)
      return `${now.toString(16)}-1xxx-${randomPart}-xxxx`.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16)
      })
    }
  }

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID())
    setUuids(newUuids)
  }

  const handleCopy = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopied(`uuid-${index}`)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(''), 2000)
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
            <div className="tool-icon-large">🆔</div>
            <div>
              <h1 className="tool-title">UUID 生成器</h1>
              <p className="tool-subtitle">通用唯一識別碼生成工具</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="uuid-controls">
            <div className="control-group">
              <label className="section-label">UUID版本</label>
              <div className="mode-switch">
                <button 
                  className={`mode-btn ${version === 'v4' ? 'active' : ''}`}
                  onClick={() => setVersion('v4')}
                >
                  Version 4 (隨機)
                </button>
                <button 
                  className={`mode-btn ${version === 'v1' ? 'active' : ''}`}
                  onClick={() => setVersion('v1')}
                >
                  Version 1 (時間戳)
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="section-label">生成數量</label>
              <div className="count-controls">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="count-slider"
                />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="count-input"
                />
              </div>
            </div>

            <button className="action-btn primary" onClick={handleGenerate}>
              <RefreshCw size={18} />
              生成 UUID
            </button>
          </div>

          {uuids.length > 0 && (
            <div className="uuid-results">
              <div className="results-header">
                <h4>生成結果 ({uuids.length}個)</h4>
                <button className="copy-btn" onClick={handleCopyAll}>
                  {copied === 'all' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied === 'all' ? '已複製全部' : '複製全部'}</span>
                </button>
              </div>
              
              <div className="uuid-list">
                {uuids.map((uuid, index) => (
                  <div key={index} className="uuid-item">
                    <span className="uuid-index">#{index + 1}</span>
                    <code className="uuid-value">{uuid}</code>
                    <button 
                      className="copy-btn-small" 
                      onClick={() => handleCopy(uuid, index)}
                    >
                      {copied === `uuid-${index}` ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tool-info">
            <h3>💡 UUID版本說明</h3>
            <ul>
              <li><strong>Version 4</strong>：基於隨機數生成，最常用的版本</li>
              <li><strong>Version 1</strong>：基於時間戳和MAC地址（簡化實現）</li>
              <li>UUID格式：8-4-4-4-12（共36個字符）</li>
              <li>碰撞概率極低，適合分佈式系統</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>數據庫主鍵生成</li>
              <li>分佈式系統ID</li>
              <li>會話標識符</li>
              <li>臨時文件命名</li>
              <li>API請求追蹤</li>
            </ul>

            <h3>⚡ 特點</h3>
            <ul>
              <li>全局唯一性保證</li>
              <li>無需中心化協調</li>
              <li>支持批量生成</li>
              <li>一鍵複製所有結果</li>
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
        .uuid-controls {
          background: var(--bg-secondary);
          border: 2px solid var(--accent-cyan);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .count-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .count-slider {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: var(--bg-tertiary);
          outline: none;
        }
        
        .count-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-cyan);
          cursor: pointer;
        }
        
        .count-input {
          width: 80px;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 1rem;
          text-align: center;
        }
        
        .count-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
        }
        
        .uuid-results {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .results-header h4 {
          margin: 0;
          color: var(--accent-cyan);
          font-size: 1.1rem;
        }
        
        .uuid-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .uuid-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        
        .uuid-item:hover {
          background: rgba(0, 255, 249, 0.05);
        }
        
        .uuid-index {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: var(--accent-pink);
          min-width: 40px;
        }
        
        .uuid-value {
          flex: 1;
          color: var(--accent-cyan);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          word-break: break-all;
        }
        
        .copy-btn-small {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .copy-btn-small:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }
        
        @media (max-width: 768px) {
          .uuid-value {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}
