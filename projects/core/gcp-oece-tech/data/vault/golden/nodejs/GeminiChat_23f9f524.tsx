'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Paperclip, X, Copy } from 'lucide-react'
import './gemini-chat.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

// Gemini 2.5 Flash 支持的格式和限制
const SUPPORTED_FORMATS = {
  images: ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'],
  // 为节约token暂不支持视频和音频
  maxSize: 5 * 1024 * 1024, // 5MB
}

const FILE_TOOLTIP = `支持格式：PNG, JPEG, WEBP, HEIC, HEIF
文件大小：最大 5MB
(為節約 token，暫不支持視頻/音頻)`

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '嘿！我是米斯特周 👋，一個邊旅行邊寫代碼的數位游牧開發者。\n\n剛從曼谷的咖啡館寫完今天的代碼，有什麼技術問題或數位游牧的事想聊的嗎？\n\n📎 支持圖片分析（PNG/JPEG/WEBP，最大5MB）'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // 只在聊天容器内滚动，不影响页面
      const container = messagesEndRef.current.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证文件类型
      if (!SUPPORTED_FORMATS.images.includes(file.type)) {
        alert(`不支持的文件格式！\n${FILE_TOOLTIP}`)
        return
      }
      
      // 验证文件大小
      if (file.size > SUPPORTED_FORMATS.maxSize) {
        alert(`文件過大！\n最大支持 5MB`)
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage = input.trim()
    const userImage = selectedImage
    setInput('')
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage || '(發送了圖片)',
      image: userImage || undefined
    }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          image: userImage
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '抱歉，發生了錯誤。請稍後再試。'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      // 验证文件类型
      if (!SUPPORTED_FORMATS.images.includes(file.type)) {
        alert(`不支持的文件格式！\n${FILE_TOOLTIP}`)
        return
      }
      
      // 验证文件大小
      if (file.size > SUPPORTED_FORMATS.maxSize) {
        alert(`文件過大！\n最大支持 5MB`)
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const renderMessageContent = (content: string) => {
    // 匹配代码块 ```语言\n代码\n```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 添加代码块之前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        })
      }
      
      // 添加代码块
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      })
      
      lastIndex = match.index + match[0].length
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      })
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }]
  }

  return (
    <div className="gemini-chat-container">
      <div className="gemini-chat-header">
        <Bot size={24} className="header-icon" />
        <div className="header-info">
          <h3 className="header-title">米斯特周 (Mr. Zhou)</h3>
          <p className="header-subtitle">數位游牧開發者 · 由 Gemini 2.5 Pro 驅動</p>
        </div>
      </div>

      <div 
        className="gemini-chat-messages"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-icon">
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="message-content">
              {msg.image && (
                <img src={msg.image} alt="上傳的圖片" className="message-image" />
              )}
              {msg.role === 'assistant' ? (
                renderMessageContent(msg.content).map((part, i) => (
                  part.type === 'code' ? (
                    <div key={i} className="code-block-wrapper">
                      <div className="code-block-header">
                        <span className="code-language">{part.language}</span>
                        <button
                          onClick={() => copyCode(part.content)}
                          className="code-copy-btn"
                          title="複製代碼"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <pre className="code-block">
                        <code>{part.content}</code>
                      </pre>
                    </div>
                  ) : (
                    <div key={i}>{part.content}</div>
                  )
                ))
              ) : (
                <div>{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-icon">
              <Bot size={16} />
            </div>
            <div className="message-content">
              <Loader2 size={16} className="loading-spinner" />
              <span>思考中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="預覽" className="preview-image" />
          <button onClick={removeImage} className="remove-image-btn">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="gemini-chat-input">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="image-upload-btn"
          title={FILE_TOOLTIP}
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="輸入訊息 | 📎 上傳/拖入圖片 (最大5MB)"
          disabled={isLoading}
          className="chat-input-field"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || (!input.trim() && !selectedImage)}
          className="chat-send-btn"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
