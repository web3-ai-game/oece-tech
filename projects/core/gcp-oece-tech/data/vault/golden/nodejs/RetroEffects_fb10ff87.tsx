'use client'

import { useEffect, useState } from 'react'

// CRT扫描线效果
export function CRTScanlines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="scanline-effect" />
      <style jsx>{`
        .scanline-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 255, 136, 0.03) 51%
          );
          background-size: 100% 4px;
          animation: scanline 8s linear infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  )
}

// CRT屏幕弯曲效果
export function CRTCurvature() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div className="crt-curvature" />
      <style jsx>{`
        .crt-curvature {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }
      `}</style>
    </div>
  )
}

// 像素化边框装饰
export function PixelBorders() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pixel-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" fill="#00ff88" opacity="0.3" />
            <rect x="4" y="4" width="4" height="4" fill="#00ff88" opacity="0.3" />
          </pattern>
        </defs>
        
        {/* 四角像素化装饰 */}
        <rect x="0" y="0" width="100" height="100" fill="url(#pixel-pattern)" />
        <rect x="0" y="0" width="100" height="4" fill="#00ff88" opacity="0.5" />
        <rect x="0" y="0" width="4" height="100" fill="#00ff88" opacity="0.5" />
        
        <g transform="translate(100%, 0)">
          <rect x="-100" y="0" width="100" height="100" fill="url(#pixel-pattern)" />
          <rect x="-100" y="0" width="100" height="4" fill="#00ff88" opacity="0.5" />
          <rect x="-4" y="0" width="4" height="100" fill="#00ff88" opacity="0.5" />
        </g>
        
        <g transform="translate(0, 100%)">
          <rect x="0" y="-100" width="100" height="100" fill="url(#pixel-pattern)" />
          <rect x="0" y="-4" width="100" height="4" fill="#00ff88" opacity="0.5" />
          <rect x="0" y="-100" width="4" height="100" fill="#00ff88" opacity="0.5" />
        </g>
        
        <g transform="translate(100%, 100%)">
          <rect x="-100" y="-100" width="100" height="100" fill="url(#pixel-pattern)" />
          <rect x="-100" y="-4" width="100" height="4" fill="#00ff88" opacity="0.5" />
          <rect x="-4" y="-100" width="4" height="100" fill="#00ff88" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}

// 老式电脑启动文字
export function BootSequence() {
  const [lines, setLines] = useState<string[]>([])
  const [show, setShow] = useState(true)
  
  useEffect(() => {
    const bootLines = [
      '> SYSTEM BOOT...',
      '> LOADING OECE.TECH...',
      '> INITIALIZING ANONYMOUS PROTOCOL...',
      '> CONNECTING TO UNDERGROUND NETWORK...',
      '> [OK] SYSTEM READY',
    ]
    
    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setLines(prev => [...prev, bootLines[currentLine]])
        currentLine++
      } else {
        clearInterval(interval)
        setTimeout(() => setShow(false), 1000)
      }
    }, 300)
    
    return () => clearInterval(interval)
  }, [])
  
  if (!show) return null
  
  return (
    <div className="fixed inset-0 bg-pixel-darker z-[100] flex items-center justify-center">
      <div className="font-mono text-pixel-primary space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="pixel-blink text-lg">
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

// 8-bit风格图标
export function PixelIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    user: '👤',
    book: '📚',
    coin: '🪙',
    chat: '💬',
    fire: '🔥',
    star: '⭐',
    lock: '🔒',
    eye: '👁️'
  }
  
  return (
    <span className="inline-block pixel-perfect text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
      {icons[type] || '•'}
    </span>
  )
}

// 复古按钮样式
interface RetroButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function RetroButton({ children, variant = 'primary', onClick }: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 font-mono text-sm uppercase tracking-wider
        border-4 transition-all
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
        ${variant === 'primary' 
          ? 'bg-pixel-primary text-pixel-darker border-pixel-darker' 
          : 'bg-transparent text-pixel-primary border-pixel-primary'
        }
      `}
    >
      {children}
    </button>
  )
}

// 复古卡片
interface RetroCardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function RetroCard({ children, title, className = '' }: RetroCardProps) {
  return (
    <div className={`
      border-4 border-pixel-primary bg-pixel-darker
      shadow-[8px_8px_0px_0px_rgba(0,255,136,0.3)]
      ${className}
    `}>
      {title && (
        <div className="bg-pixel-primary text-pixel-darker px-4 py-2 font-mono font-bold text-sm uppercase border-b-4 border-pixel-darker">
          {title}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

// 像素化分隔线
export function PixelDivider() {
  return (
    <div className="flex items-center gap-2 my-6">
      <div className="flex-1 h-1 bg-pixel-primary" style={{ 
        background: 'repeating-linear-gradient(90deg, #00ff88 0px, #00ff88 8px, transparent 8px, transparent 16px)' 
      }} />
      <div className="w-3 h-3 bg-pixel-primary rotate-45" />
      <div className="flex-1 h-1 bg-pixel-primary" style={{ 
        background: 'repeating-linear-gradient(90deg, #00ff88 0px, #00ff88 8px, transparent 8px, transparent 16px)' 
      }} />
    </div>
  )
}

// 老式LED数字
export function LEDNumber({ value }: { value: number | string }) {
  return (
    <span className="font-mono text-pixel-primary bg-pixel-darker px-3 py-1 border-2 border-pixel-grid" style={{
      textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88',
      fontVariantNumeric: 'tabular-nums'
    }}>
      {value}
    </span>
  )
}

// 8-bit进度条
export function PixelProgressBar({ value, max = 100 }: { value: number, max?: number }) {
  const percentage = (value / max) * 100
  const blocks = Math.floor(percentage / 10)
  
  return (
    <div className="flex gap-1 items-center">
      <div className="flex gap-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-6 border-2 ${
              i < blocks 
                ? 'bg-pixel-primary border-pixel-primary' 
                : 'bg-pixel-darker border-pixel-grid'
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-sm text-pixel-primary ml-2">
        {Math.round(percentage)}%
      </span>
    </div>
  )
}

// 复古标签
interface RetroTagProps {
  children: React.ReactNode
  color?: 'primary' | 'accent' | 'warning' | 'danger'
}

export function RetroTag({ children, color = 'primary' }: RetroTagProps) {
  const colors: Record<string, string> = {
    primary: 'bg-pixel-primary text-pixel-darker border-pixel-darker',
    accent: 'bg-pixel-accent text-pixel-darker border-pixel-darker',
    warning: 'bg-pixel-warning text-pixel-darker border-pixel-darker',
    danger: 'bg-pixel-danger text-pixel-darker border-pixel-darker'
  }
  
  return (
    <span className={`
      inline-block px-3 py-1 text-xs font-mono font-bold uppercase
      border-2 ${colors[color]}
      shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
    `}>
      {children}
    </span>
  )
}

// DOS风格窗口
interface DOSWindowProps {
  title: string
  children: React.ReactNode
}

export function DOSWindow({ title, children }: DOSWindowProps) {
  return (
    <div className="border-4 border-pixel-primary bg-pixel-darker shadow-[8px_8px_0px_0px_rgba(0,255,136,0.3)]">
      {/* 标题栏 */}
      <div className="bg-pixel-primary text-pixel-darker px-3 py-2 flex items-center justify-between border-b-4 border-pixel-darker">
        <span className="font-mono font-bold text-sm uppercase">{title}</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-pixel-darker border-2 border-pixel-darker" />
          <div className="w-4 h-4 bg-pixel-darker border-2 border-pixel-darker" />
          <div className="w-4 h-4 bg-pixel-darker border-2 border-pixel-darker" />
        </div>
      </div>
      {/* 内容 */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  )
}
