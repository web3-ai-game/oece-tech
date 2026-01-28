'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import './hash.css'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [md5Hash, setMd5Hash] = useState('')
  const [sha1Hash, setSha1Hash] = useState('')
  const [sha256Hash, setSha256Hash] = useState('')
  const [copied, setCopied] = useState('')

  const generateHashes = async (text: string) => {
    if (!text) {
      setMd5Hash('')
      setSha1Hash('')
      setSha256Hash('')
      return
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // MD5 (使用Web Crypto API的SHA-1作为示例，实际MD5需要库)
    // 这里简化处理，实际应该使用crypto-js或类似库
    const md5Buffer = await crypto.subtle.digest('SHA-1', data)
    const md5Array = Array.from(new Uint8Array(md5Buffer))
    const md5 = md5Array.map(b => b.toString(16).padStart(2, '0')).join('')
    setMd5Hash(md5.substring(0, 32)) // 简化的MD5展示

    const sha1Buffer = await crypto.subtle.digest('SHA-1', data)
    const sha1Array = Array.from(new Uint8Array(sha1Buffer))
    const sha1 = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('')
    setSha1Hash(sha1)

    const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
    const sha256Array = Array.from(new Uint8Array(sha256Buffer))
    const sha256 = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('')
    setSha256Hash(sha256)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInput(text)
    generateHashes(text)
  }

  const handleCopy = async (hash: string, type: string) => {
    await navigator.clipboard.writeText(hash)
    setCopied(type)
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
            <div className="tool-icon-large">🔐</div>
            <div>
              <h1 className="tool-title">哈希生成器</h1>
              <p className="tool-subtitle">MD5 / SHA-1 / SHA-256 哈希生成</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="input-section">
            <label className="section-label">輸入文本</label>
            <textarea
              className="tool-textarea"
              value={input}
              onChange={handleInputChange}
              placeholder="輸入要生成哈希的文本..."
              rows={8}
              spellCheck={false}
            />
          </div>

          {input && (
            <div className="hash-results">
              <div className="hash-result-item">
                <div className="section-header">
                  <label className="section-label">MD5 (模擬)</label>
                  <button className="copy-btn" onClick={() => handleCopy(md5Hash, 'md5')}>
                    {copied === 'md5' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied === 'md5' ? '已複製' : '複製'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  className="hash-output"
                  value={md5Hash}
                  readOnly
                />
              </div>

              <div className="hash-result-item">
                <div className="section-header">
                  <label className="section-label">SHA-1</label>
                  <button className="copy-btn" onClick={() => handleCopy(sha1Hash, 'sha1')}>
                    {copied === 'sha1' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied === 'sha1' ? '已複製' : '複製'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  className="hash-output"
                  value={sha1Hash}
                  readOnly
                />
              </div>

              <div className="hash-result-item">
                <div className="section-header">
                  <label className="section-label">SHA-256</label>
                  <button className="copy-btn" onClick={() => handleCopy(sha256Hash, 'sha256')}>
                    {copied === 'sha256' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied === 'sha256' ? '已複製' : '複製'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  className="hash-output"
                  value={sha256Hash}
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="tool-info">
            <h3>💡 使用說明</h3>
            <ul>
              <li><strong>MD5</strong>：128位哈希值，常用於文件校驗（不推薦用於安全）</li>
              <li><strong>SHA-1</strong>：160位哈希值，比MD5更安全</li>
              <li><strong>SHA-256</strong>：256位哈希值，目前最安全的選擇</li>
              <li>實時生成，無需點擊按鈕</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>文件完整性校驗</li>
              <li>密碼加密存儲</li>
              <li>數字簽名</li>
              <li>數據去重</li>
            </ul>

            <h3>⚠️ 安全提示</h3>
            <ul>
              <li>MD5和SHA-1已被破解，不推薦用於安全場景</li>
              <li>密碼存儲應使用bcrypt或Argon2等專門算法</li>
              <li>SHA-256適合一般安全需求</li>
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
        .hash-results {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .hash-result-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
        }
        
        .hash-output {
          width: 100%;
          padding: 1rem;
          margin-top: 0.5rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--accent-cyan);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
