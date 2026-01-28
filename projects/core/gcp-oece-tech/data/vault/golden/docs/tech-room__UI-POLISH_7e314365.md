# ✨ GeekSEA UI 打磨方案

## 🎨 设计原则

**移动端优先 + 神秘感 + 极简主义**
- 触摸优化（44x44px最小）
- 快速响应（<100ms）
- 神秘暗黑风格
- 像素化赛博朋克

---

## 📱 移动端UI打磨

### 1. 底部导航栏优化

```tsx
// components/mobile/EnhancedBottomNav.tsx
'use client'

import { Home, MessageSquare, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function EnhancedBottomNav() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  
  const navItems = [
    { icon: Home, label: '首頁', href: '/', color: 'text-pixel-primary' },
    { icon: MessageSquare, label: '論壇', href: '/forum', color: 'text-pixel-accent' },
    { icon: Mail, label: '信箱', href: '/messages', color: 'text-pixel-warning', badge: unreadCount },
    { icon: User, label: '我的', href: '/dashboard', color: 'text-pixel-secondary' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pixel-darker/98 backdrop-blur-xl border-t border-pixel-grid shadow-2xl z-50">
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-pixel-primary to-transparent animate-pulse" />
      </div>
      
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-6 py-2 transition-all active:scale-95"
            >
              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-pixel-primary to-transparent rounded-b-full" />
              )}
              
              {/* 图标 */}
              <div className={`relative ${isActive ? item.color : 'text-pixel-light/40'} transition-colors`}>
                <Icon size={22} className={isActive ? 'drop-shadow-glow' : ''} />
                
                {/* Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pixel-danger text-pixel-darker text-xs flex items-center justify-center rounded-full font-mono animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              
              {/* 标签 */}
              <span className={`text-xs font-mono ${isActive ? item.color : 'text-pixel-light/40'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      
      {/* Home指示器（iOS风格） */}
      <div className="h-1 w-32 mx-auto mb-1 bg-pixel-grid rounded-full" />
    </nav>
  )
}
```

### 2. 卡片动效增强

```tsx
// components/mobile/AnimatedCard.tsx
'use client'

import { useState } from 'react'

export function AnimatedCard({ children, onClick, className = '' }: any) {
  const [pressed, setPressed] = useState(false)
  
  return (
    <div
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      className={`
        card-pixel-glow p-4 cursor-pointer
        transition-all duration-150
        ${pressed ? 'scale-98 opacity-90' : 'scale-100'}
        hover:border-pixel-primary/50
        active:border-pixel-primary
        ${className}
      `}
      style={{
        transform: pressed ? 'scale(0.98) translateY(2px)' : 'scale(1)',
        boxShadow: pressed 
          ? '0 0 20px rgba(0, 255, 136, 0.2)' 
          : '0 0 10px rgba(0, 255, 136, 0.1)'
      }}
    >
      {children}
    </div>
  )
}
```

### 3. 加载状态优化

```tsx
// components/mobile/LoadingStates.tsx

// 骨架屏加载
export function SkeletonPost() {
  return (
    <div className="card-pixel p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pixel-grid" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-pixel-grid rounded w-3/4" />
          <div className="h-3 bg-pixel-grid rounded w-1/2" />
          <div className="flex gap-4 mt-2">
            <div className="h-3 bg-pixel-grid rounded w-12" />
            <div className="h-3 bg-pixel-grid rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

// 加载动画
export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className="border-2 border-pixel-primary border-t-transparent rounded-full animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

// 空状态
export function EmptyState({ icon: Icon, title, description, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-pixel-grid/30 flex items-center justify-center mb-4">
        <Icon size={40} className="text-pixel-light/20" />
      </div>
      <h3 className="text-base text-pixel-light/70 mb-2 font-mono">{title}</h3>
      <p className="text-sm text-pixel-light/50 mb-6">{description}</p>
      {action && (
        <button className="btn-pixel text-sm">{action}</button>
      )}
    </div>
  )
}
```

---

## 🎭 动画效果增强

### 1. 页面切换动画

```tsx
// app/layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 150)
    return () => clearTimeout(timer)
  }, [pathname])
  
  return (
    <div 
      className={`transition-opacity duration-150 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  )
}
```

### 2. 滚动效果

```tsx
// hooks/useScrollAnimation.ts
import { useEffect, useState } from 'react'

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  
  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrollingDown(currentScrollY > lastScrollY)
      lastScrollY = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return { scrollY, isScrollingDown }
}

// 使用示例
export function FloatingHeader() {
  const { isScrollingDown } = useScrollAnimation()
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 transition-transform duration-300 ${
        isScrollingDown ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* 内容 */}
    </header>
  )
}
```

### 3. 手势动画

```tsx
// components/mobile/SwipeableCard.tsx
'use client'

import { useState, useRef } from 'react'

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: any) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const diff = currentX - startX.current
    setOffset(diff)
  }
  
  const handleTouchEnd = () => {
    if (Math.abs(offset) > 100) {
      if (offset > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (offset < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
    setOffset(0)
  }
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${offset}px)`,
        opacity: 1 - Math.abs(offset) / 300
      }}
      className="transition-transform duration-100"
    >
      {children}
    </div>
  )
}
```

---

## 🎨 颜色主题微调

### 暗黑模式增强

```css
/* app/globals.css */

/* 更深的背景，更好的对比度 */
:root {
  --pixel-darker: #0a0e14;      /* 更深 */
  --pixel-dark: #121820;
  --pixel-grid: #1a2332;
  
  /* 更亮的强调色 */
  --pixel-primary: #00ff88;      /* 更亮的绿 */
  --pixel-accent: #00d4ff;       /* 更亮的青 */
  --pixel-warning: #ffcc00;      /* 更亮的黄 */
  --pixel-danger: #ff3366;       /* 更亮的红 */
  
  /* 添加光晕效果 */
  --glow-primary: 0 0 20px rgba(0, 255, 136, 0.5);
  --glow-accent: 0 0 20px rgba(0, 212, 255, 0.5);
  --glow-danger: 0 0 20px rgba(255, 51, 102, 0.5);
}

/* 光晕效果类 */
.drop-shadow-glow {
  filter: drop-shadow(var(--glow-primary));
}

.text-glow-primary {
  text-shadow: var(--glow-primary);
}

.text-glow-accent {
  text-shadow: var(--glow-accent);
}

/* 脉冲光晕 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
  }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

---

## 🔍 细节打磨

### 1. 输入框增强

```tsx
// components/ui/EnhancedInput.tsx
export function EnhancedInput({ label, ...props }: any) {
  const [focused, setFocused] = useState(false)
  
  return (
    <div className="relative">
      <label className={`
        absolute left-4 transition-all duration-200 pointer-events-none
        ${focused || props.value 
          ? '-top-2 text-xs text-pixel-primary bg-pixel-darker px-2' 
          : 'top-3 text-sm text-pixel-light/50'
        }
      `}>
        {label}
      </label>
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full px-4 py-3 bg-pixel-darker 
          border-2 transition-all duration-200
          ${focused 
            ? 'border-pixel-primary shadow-glow-primary' 
            : 'border-pixel-grid'
          }
          rounded-lg outline-none
        `}
      />
    </div>
  )
}
```

### 2. 按钮增强

```tsx
// components/ui/EnhancedButton.tsx
export function EnhancedButton({ children, variant = 'primary', loading, ...props }: any) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-lg font-mono text-sm
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' 
          ? 'bg-pixel-primary text-pixel-darker hover:shadow-glow-primary' 
          : 'border-2 border-pixel-primary text-pixel-primary hover:bg-pixel-primary/10'
        }
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-pixel-darker/80">
          <LoadingSpinner size={16} />
        </div>
      )}
      {children}
    </button>
  )
}
```

### 3. Toast 通知

```tsx
// components/ui/Toast.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const ToastContext = createContext<any>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([])
  
  const showToast = (message: string, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-16 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              card-pixel p-4 min-w-[200px] animate-slide-in-right
              ${toast.type === 'success' ? 'border-pixel-primary' : ''}
              ${toast.type === 'error' ? 'border-pixel-danger' : ''}
            `}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle size={20} className="text-pixel-primary" />}
              {toast.type === 'error' && <XCircle size={20} className="text-pixel-danger" />}
              {toast.type === 'info' && <Info size={20} className="text-pixel-accent" />}
              <span className="text-sm">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
```

---

**UI打磨完成！移动端优先，神秘暗黑风格，流畅交互！** ✨📱🎨
