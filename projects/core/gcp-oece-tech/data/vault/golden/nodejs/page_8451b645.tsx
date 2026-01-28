'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Eye, FileText } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../base64/base64.css'
import './markdown.css'

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  const exampleMarkdown = `# Markdown 示例

## 這是二級標題

### 三級標題

**粗體文本** 和 *斜體文本*

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

- 無序列表項 1
- 無序列表項 2
  - 嵌套項

1. 有序列表項 1
2. 有序列表項 2

> 這是一個引用塊

[鏈接示例](https://oece.tech)

| 表頭1 | 表頭2 |
|-------|-------|
| 單元格1 | 單元格2 |
`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLoadExample = () => {
    setMarkdown(exampleMarkdown)
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
            <div className="tool-icon-large">📝</div>
            <div>
              <h1 className="tool-title">Markdown 預覽器</h1>
              <p className="tool-subtitle">實時Markdown編輯和預覽</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="markdown-controls">
            <div className="action-buttons">
              <button className="action-btn secondary" onClick={handleLoadExample}>
                <FileText size={18} />
                載入示例
              </button>
              <button className="action-btn secondary" onClick={() => setMarkdown('')}>
                清空
              </button>
              {markdown && (
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? '已複製' : '複製Markdown'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="markdown-workspace">
            <div className="markdown-editor-section">
              <div className="editor-header">
                <FileText size={18} />
                <label className="section-label">Markdown 編輯器</label>
              </div>
              <textarea
                className="markdown-textarea"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在這裡輸入 Markdown 文本...&#10;&#10;支持：&#10;- 標題 (# ## ###)&#10;- 粗體 (**文本**)&#10;- 斜體 (*文本*)&#10;- 代碼塊&#10;- 列表&#10;- 鏈接&#10;- 圖片&#10;- 表格"
                spellCheck={false}
              />
            </div>

            <div className="markdown-preview-section">
              <div className="preview-header">
                <Eye size={18} />
                <label className="section-label">實時預覽</label>
              </div>
              <div className="markdown-preview">
                {markdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <div className="preview-placeholder">
                    <p>預覽將顯示在這裡...</p>
                    <p>開始在左側編輯器輸入 Markdown 文本</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 支持的語法</h3>
            <ul>
              <li><strong>標題</strong>：# H1, ## H2, ### H3</li>
              <li><strong>粗體</strong>：**文本** 或 __文本__</li>
              <li><strong>斜體</strong>：*文本* 或 _文本_</li>
              <li><strong>代碼</strong>：`行內代碼` 或 ```代碼塊```</li>
              <li><strong>列表</strong>：- 無序列表, 1. 有序列表</li>
              <li><strong>鏈接</strong>：[文本](URL)</li>
              <li><strong>引用</strong>：{'>'} 引用文本</li>
              <li><strong>表格</strong>：GFM表格語法</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>README文檔編寫</li>
              <li>技術博客草稿</li>
              <li>文檔預覽</li>
              <li>Markdown學習</li>
            </ul>

            <h3>⚡ 特點</h3>
            <ul>
              <li>實時預覽，所見即所得</li>
              <li>支持GitHub Flavored Markdown (GFM)</li>
              <li>語法高亮</li>
              <li>一鍵複製Markdown源碼</li>
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
