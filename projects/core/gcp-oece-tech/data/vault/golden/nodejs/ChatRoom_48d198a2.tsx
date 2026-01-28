'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Users, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [onlineCount] = useState(Math.floor(Math.random() * 15) + 5)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const welcome: Message = {
      id: Date.now().toString(),
      text: '👋 嗨！我是米斯特周的AI助手。想聊聊數位游牧生活、技術問題還是旅行經驗？',
      sender: 'ai',
      timestamp: Date.now()
    }
    setMessages([welcome])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, type: 'chat' })
      })

      const data = await res.json()

      if (res.ok) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data.text,
          sender: 'ai',
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, aiMsg])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ ' + (error instanceof Error ? error.message : '發送失敗，請重試'),
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <div className="chatroom-title">
          <Bot size={20} />
          <span>即時聊天</span>
        </div>
        <div className="chatroom-online">
          <Users size={16} />
          <span>{onlineCount} 人在線</span>
        </div>
      </div>

      <div className="chatroom-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('zh-TW', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message ai">
            <div className="message-avatar">
              <Bot size={18} />
            </div>
            <div className="message-content">
              <div className="message-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatroom-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="輸入消息... (Enter發送)"
          maxLength={500}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send size={18} />
        </button>
      </div>

      <style jsx>{`
        .chatroom-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          border: 1px solid rgba(0, 255, 157, 0.2);
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 255, 157, 0.1);
        }

        .chatroom-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(0, 255, 157, 0.05);
          border-bottom: 1px solid rgba(0, 255, 157, 0.2);
        }

        .chatroom-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00ff9d;
          font-weight: 600;
          font-size: 16px;
        }

        .chatroom-online {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 14px;
        }

        .chatroom-messages {
          height: 400px;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chatroom-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chatroom-messages::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 157, 0.3);
          border-radius: 3px;
        }

        .chat-message {
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease;
        }

        .chat-message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-message.ai .message-avatar {
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          color: #000;
        }

        .chat-message.user .message-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }

        .message-content {
          max-width: 70%;
        }

        .chat-message.user .message-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .message-text {
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .chat-message.ai .message-text {
          background: rgba(0, 255, 157, 0.1);
          color: #e0e0e0;
          border: 1px solid rgba(0, 255, 157, 0.2);
        }

        .chat-message.user .message-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }

        .message-time {
          font-size: 11px;
          color: #666;
          margin-top: 4px;
          padding: 0 4px;
        }

        .message-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: rgba(0, 255, 157, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 157, 0.2);
        }

        .message-typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff9d;
          animation: typing 1.4s infinite;
        }

        .message-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .message-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-10px); opacity: 1; }
        }

        .chatroom-input {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(0, 255, 157, 0.2);
        }

        .chatroom-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 157, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s;
        }

        .chatroom-input input:focus {
          outline: none;
          border-color: #00ff9d;
          background: rgba(255, 255, 255, 0.08);
        }

        .chatroom-input button {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          color: #000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .chatroom-input button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 157, 0.4);
        }

        .chatroom-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .chatroom-messages {
            height: 300px;
          }
          .message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  )
}
