'use client'

import { useState } from 'react'
import { Sparkles, Brain, MessageCircle, Loader2 } from 'lucide-react'

interface AIToolCardProps {
  icon: React.ReactNode
  title: string
  description: string
  type: 'translator' | 'coder' | 'writer'
}

export default function AIToolCard({ icon, title, description, type }: AIToolCardProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const prompts = {
    translator: '你是专业翻译，将以下内容翻译成流畅的英文，保持原意：',
    coder: '你是代码助手，帮我优化或解释以下代码（50字内简洁回复）：',
    writer: '你是文案大师，帮我润色以下文字，使其更专业有吸引力（100字内）：'
  }

  const handleSubmit = async () => {
    if (!input.trim() || loading) return

    const lastUse = localStorage.getItem(`aitool_${type}_last`)
    const now = Date.now()
    
    if (lastUse && now - parseInt(lastUse) < 10000) {
      alert('請等待10秒後再試')
      return
    }

    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `${prompts[type]}\n\n${input}`,
          type: 'chat'
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setOutput(data.text)
        localStorage.setItem(`aitool_${type}_last`, now.toString())
      } else {
        setOutput('❌ ' + data.error)
      }
    } catch (error) {
      setOutput('❌ 服務暫時不可用')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-tool-card">
      <div className="tool-card-header">
        <div className="tool-icon">{icon}</div>
        <div className="tool-info">
          <h4 className="tool-title">{title}</h4>
          <p className="tool-desc">{description}</p>
        </div>
      </div>

      <div className="tool-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入內容..."
          maxLength={500}
          rows={3}
          disabled={loading}
        />
        <button 
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="tool-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin" />
              處理中...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI 處理
            </>
          )}
        </button>
      </div>

      {output && (
        <div className="tool-output">
          <div className="output-label">結果：</div>
          <div className="output-text">{output}</div>
        </div>
      )}

      <style jsx>{`
        .ai-tool-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(0, 255, 157, 0.3);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .ai-tool-card:hover {
          border-color: #00ff9d;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 255, 157, 0.2);
        }

        .tool-card-header {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .tool-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #000;
        }

        .tool-info {
          flex: 1;
        }

        .tool-title {
          font-size: 18px;
          font-weight: 700;
          color: #00ff9d;
          margin-bottom: 6px;
        }

        .tool-desc {
          font-size: 13px;
          color: #aaa;
          line-height: 1.4;
        }

        .tool-input-area {
          margin-bottom: 16px;
        }

        .tool-input-area textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 157, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 12px;
          transition: all 0.3s;
        }

        .tool-input-area textarea:focus {
          outline: none;
          border-color: #00ff9d;
          background: rgba(255, 255, 255, 0.08);
        }

        .tool-input-area textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tool-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tool-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 157, 0.4);
        }

        .tool-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .tool-output {
          background: rgba(0, 255, 157, 0.05);
          border: 1px solid rgba(0, 255, 157, 0.2);
          border-radius: 8px;
          padding: 16px;
        }

        .output-label {
          font-size: 12px;
          color: #00ff9d;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .output-text {
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        @media (max-width: 768px) {
          .ai-tool-card {
            padding: 20px;
          }

          .tool-card-header {
            gap: 12px;
          }

          .tool-icon {
            width: 40px;
            height: 40px;
          }

          .tool-title {
            font-size: 16px;
          }

          .tool-desc {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
