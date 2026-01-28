'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import '../base64/base64.css'
import './regex.css'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<RegExpMatchArray[] | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches(null)
      setError('')
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const allMatches: RegExpMatchArray[] = []
      
      if (flags.includes('g')) {
        let match
        const regex = new RegExp(pattern, flags)
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push(match)
          if (match.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        const match = testString.match(regex)
        if (match) allMatches.push(match)
      }
      
      setMatches(allMatches.length > 0 ? allMatches : null)
      setError('')
    } catch (e: any) {
      setError(e.message)
      setMatches(null)
    }
  }, [pattern, flags, testString])

  const handleCopyPattern = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${flags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    { name: '郵箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', test: 'test@example.com, user@domain.co.uk' },
    { name: '手機號', pattern: '09\\d{8}', test: '0912345678, 0987654321' },
    { name: 'URL', pattern: 'https?://[^\\s]+', test: 'Visit https://oece.tech and http://example.com' },
    { name: 'IP地址', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', test: '192.168.1.1, 10.0.0.1' },
  ]

  const loadExample = (ex: typeof examples[0]) => {
    setPattern(ex.pattern)
    setTestString(ex.test)
    setFlags('g')
  }

  const getHighlightedText = () => {
    if (!matches || matches.length === 0) return testString

    let result = testString
    let offset = 0

    matches.forEach((match, i) => {
      const start = match.index! + offset
      const end = start + match[0].length
      const replacement = `<mark class="match-highlight">${match[0]}</mark>`
      result = result.substring(0, start) + replacement + result.substring(end)
      offset += replacement.length - match[0].length
    })

    return result
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
            <div className="tool-icon-large">🎯</div>
            <div>
              <h1 className="tool-title">正則表達式測試器</h1>
              <p className="tool-subtitle">實時測試和驗證正則表達式</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="regex-pattern-section">
            <div className="pattern-input-group">
              <span className="pattern-slash">/</span>
              <input
                type="text"
                className="pattern-input"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="輸入正則表達式..."
                spellCheck={false}
              />
              <span className="pattern-slash">/</span>
              <input
                type="text"
                className="flags-input"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="flags"
                maxLength={5}
              />
              {pattern && (
                <button className="copy-btn" onClick={handleCopyPattern}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              )}
            </div>
            {error && <div className="regex-error">{error}</div>}
            <div className="flags-help">
              <span>標誌: </span>
              <code>g</code>=全局 
              <code>i</code>=忽略大小寫 
              <code>m</code>=多行 
              <code>s</code>=dotAll 
              <code>u</code>=unicode
            </div>
          </div>

          <div className="regex-examples">
            <h4>常用示例：</h4>
            <div className="example-buttons">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  className="example-btn"
                  onClick={() => loadExample(ex)}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          <div className="regex-test-section">
            <label className="section-label">測試文本</label>
            <textarea
              className="tool-textarea"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="輸入要測試的文本..."
              rows={8}
              spellCheck={false}
            />
          </div>

          {testString && (
            <div className="regex-result-section">
              <div className="section-header">
                <label className="section-label">
                  匹配結果 {matches && `(${matches.length}個)`}
                </label>
              </div>
              <div className="highlighted-text" 
                   dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
              />
            </div>
          )}

          {matches && matches.length > 0 && (
            <div className="matches-detail">
              <h4>匹配詳情：</h4>
              {matches.map((match, i) => (
                <div key={i} className="match-item">
                  <span className="match-index">#{i + 1}</span>
                  <code className="match-value">{match[0]}</code>
                  <span className="match-position">位置: {match.index}</span>
                  {match.length > 1 && (
                    <div className="match-groups">
                      分組: {match.slice(1).map((g, j) => (
                        <code key={j}>${j + 1}: {g}</code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="tool-info">
            <h3>💡 功能特點</h3>
            <ul>
              <li><strong>實時測試</strong>：輸入即測試，即時查看匹配結果</li>
              <li><strong>高亮顯示</strong>：匹配內容自動高亮標記</li>
              <li><strong>分組捕獲</strong>：顯示所有捕獲分組</li>
              <li><strong>常用示例</strong>：內置郵箱、電話、URL等常用模式</li>
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
