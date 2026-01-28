'use client'

import { useState } from 'react'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  node?: any
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  // 提取语言类型
  const language = className?.replace('language-', '') || 'text'
  
  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, '')
    
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  return (
    <>
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="複製程式碼"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>已複製!</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>複製</span>
            </>
          )}
        </button>
      </div>
      <code className={className}>{children}</code>
    </>
  )
}
