'use client'

import { Eye, Radio, Signal, Wifi, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

// "开天窗" 顶部横幅组件
export function UndergroundBanner() {
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto px-4 pt-4">
        <div className="card-pixel border-pixel-danger bg-pixel-darker/95 backdrop-blur-xl p-3 pointer-events-auto shadow-lg shadow-pixel-danger/20">
          {/* 扫描线动画 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pixel-primary to-transparent animate-scan" />
          </div>
          
          <div className="flex items-center justify-between text-xs font-mono relative z-10">
            {/* 左侧：状态指示 */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-pixel-danger' : 'bg-pixel-danger/50'} transition-all`} />
              <span className="text-pixel-danger font-bold">LIVE</span>
              <span className="text-pixel-light/30">|</span>
              <Signal size={14} className="text-pixel-primary animate-pulse" />
              <span className="text-pixel-accent">ENCRYPTED</span>
            </div>

            {/* 中间：警告信息 */}
            <div className="hidden md:flex items-center gap-2">
              <Eye size={14} className="text-pixel-warning" />
              <span className="text-pixel-warning">UNDERGROUND TECH FORUM</span>
              <span className="text-pixel-light/30">|</span>
              <span className="text-pixel-accent">完全匿名</span>
              <span className="text-pixel-light/30">|</span>
              <span className="text-pixel-secondary">自負風險</span>
            </div>

            {/* 右侧：在线用户 */}
            <div className="flex items-center gap-2">
              <Wifi size={14} className="text-pixel-primary" />
              <span className="text-pixel-light/70">在線:</span>
              <span className="text-pixel-primary font-bold">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// "窥视窗口" 组件
export function PeepingWindow({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="relative">
      {/* 窗口边框 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pixel-primary via-pixel-accent to-pixel-secondary opacity-30 blur-sm animate-pulse" />
      
      <div className="card-pixel border-pixel-primary bg-pixel-darker/90 backdrop-blur-lg relative overflow-hidden">
        {/* 扫描线 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-pixel-primary/50 animate-scan" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-pixel-accent/50 animate-scan" style={{ animationDelay: '1s' }} />
        
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-3 border-b border-pixel-grid">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-pixel-primary animate-pulse" />
            <span className="text-sm font-mono text-pixel-light/70">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-pixel-danger" />
            <div className="w-2 h-2 rounded-full bg-pixel-warning" />
            <div className="w-2 h-2 rounded-full bg-pixel-primary" />
          </div>
        </div>
        
        {/* 内容 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// 神秘警告标签
export function MysteryBadge({ icon: Icon, text, color = 'primary' }: unknown) {
  const colorMap = {
    primary: 'border-pixel-primary text-pixel-primary',
    accent: 'border-pixel-accent text-pixel-accent',
    warning: 'border-pixel-warning text-pixel-warning',
    danger: 'border-pixel-danger text-pixel-danger',
    secondary: 'border-pixel-secondary text-pixel-secondary',
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 border ${colorMap[color]} bg-${color}/5 backdrop-blur-sm font-mono text-xs`}>
      <Icon size={14} />
      <span>{text}</span>
    </div>
  )
}

// 扫描动画容器
export function ScanningContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pixel-primary/10 to-transparent animate-scan pointer-events-none" />
      {children}
    </div>
  )
}

// "REC" 录制指示器
export function RecordingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 border border-pixel-danger bg-pixel-danger/10 backdrop-blur-sm font-mono text-xs animate-pulse">
      <div className="w-2 h-2 rounded-full bg-pixel-danger" />
      <span className="text-pixel-danger font-bold">REC</span>
    </div>
  )
}

// 故障文字效果
export function GlitchText({ text, className = '' }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const glitch = setInterval(() => {
      const random = Math.random()
      if (random > 0.95) {
        const glitched = text.split('').map(char => 
          Math.random() > 0.5 ? char : String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 10) - 5)
        ).join('')
        setDisplayText(glitched)
        setTimeout(() => setDisplayText(text), 100)
      }
    }, 2000)
    return () => clearInterval(glitch)
  }, [text])

  return <span className={className}>{displayText}</span>
}
