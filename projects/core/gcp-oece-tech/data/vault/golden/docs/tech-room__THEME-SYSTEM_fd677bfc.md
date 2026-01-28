# 全局明暗主题系统

## 核心概念：开灯/关灯切换

实现全局的Light/Dark模式切换，带有平滑过渡动画效果。

---

## 主题配色方案

### Light Mode (开灯)

```css
/* Windows 98 Light Theme */
:root[data-theme="light"] {
  /* 背景色 */
  --bg-primary: #008080;        /* Teal 桌面 */
  --bg-secondary: #C0C0C0;      /* 灰色窗口 */
  --bg-tertiary: #FFFFFF;       /* 白色面板 */
  
  /* 文字色 */
  --text-primary: #000000;      /* 黑色 */
  --text-secondary: #808080;    /* 灰色 */
  --text-tertiary: #FFFFFF;     /* 白色（标题栏） */
  
  /* 边框色 */
  --border-light: #DFDFDF;      /* 高光 */
  --border-dark: #808080;       /* 阴影 */
  --border-black: #000000;      /* 黑边 */
  
  /* Vaporwave Accent */
  --accent-pink: #FF71CE;
  --accent-purple: #B967FF;
  --accent-cyan: #01CDFE;
  --accent-teal: #05FFA1;
}
```

### Dark Mode (关灯)

```css
/* Windows 98 Dark Theme */
:root[data-theme="dark"] {
  /* 背景色 */
  --bg-primary: #0D0221;        /* 深紫黑 */
  --bg-secondary: #1A0E2E;      /* 深紫 */
  --bg-tertiary: #2D1B3D;       /* 中紫 */
  
  /* 文字色 */
  --text-primary: #FFFB96;      /* 浅黄 */
  --text-secondary: #B967FF;    /* 紫色 */
  --text-tertiary: #01CDFE;     /* 青色 */
  
  /* 边框色 */
  --border-light: #B967FF;      /* 紫光 */
  --border-dark: #0D0221;       /* 深影 */
  --border-black: #FF71CE;      /* 粉边 */
  
  /* Vaporwave Accent (更亮) */
  --accent-pink: #FF71CE;
  --accent-purple: #B967FF;
  --accent-cyan: #01CDFE;
  --accent-teal: #05FFA1;
}
```

---

## 主题切换组件

### ThemeToggle.tsx

```tsx
'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 从localStorage读取主题
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={theme === 'light' ? '关灯' : '开灯'}
      title={theme === 'light' ? '关灯模式' : '开灯模式'}
    >
      {/* 灯泡图标 */}
      <div className="lightbulb-container">
        {theme === 'light' ? (
          // 开灯状态
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#FFD700" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
                  stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // 关灯状态
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                  fill="#B967FF" stroke="#01CDFE" strokeWidth="2"/>
          </svg>
        )}
      </div>
      
      {/* 文字标签 */}
      <span className="theme-label">
        {theme === 'light' ? '關燈' : '開燈'}
      </span>
    </button>
  )
}
```

---

## 完整CSS实现

### app/globals.css

```css
/* ==================== 主题切换系统 ==================== */

/* 全局过渡效果 */
* {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

/* Light Theme (开灯) */
:root[data-theme="light"] {
  /* Windows 98 桌面 */
  --bg-desktop: #008080;
  --bg-window: #C0C0C0;
  --bg-panel: #FFFFFF;
  --bg-input: #FFFFFF;
  
  /* 文字 */
  --text-primary: #000000;
  --text-secondary: #808080;
  --text-title: #FFFFFF;
  
  /* 边框 */
  --border-highlight: #FFFFFF;
  --border-light: #DFDFDF;
  --border-shadow: #808080;
  --border-dark: #000000;
  
  /* 标题栏 */
  --title-start: #000080;
  --title-end: #1084D0;
  
  /* Vaporwave */
  --vapor-pink: #FF71CE;
  --vapor-purple: #B967FF;
  --vapor-cyan: #01CDFE;
  --vapor-teal: #05FFA1;
  
  /* 阴影 */
  --shadow-glow: rgba(0, 255, 136, 0.3);
}

/* Dark Theme (关灯) */
:root[data-theme="dark"] {
  /* 深色背景 */
  --bg-desktop: #0D0221;
  --bg-window: #1A0E2E;
  --bg-panel: #2D1B3D;
  --bg-input: #2D1B3D;
  
  /* 发光文字 */
  --text-primary: #FFFB96;
  --text-secondary: #B967FF;
  --text-title: #01CDFE;
  
  /* 霓虹边框 */
  --border-highlight: #FF71CE;
  --border-light: #B967FF;
  --border-shadow: #0D0221;
  --border-dark: #FF71CE;
  
  /* 标题栏渐变（霓虹） */
  --title-start: #FF71CE;
  --title-end: #01CDFE;
  
  /* Vaporwave (更亮) */
  --vapor-pink: #FF71CE;
  --vapor-purple: #B967FF;
  --vapor-cyan: #01CDFE;
  --vapor-teal: #05FFA1;
  
  /* 霓虹发光 */
  --shadow-glow: rgba(255, 113, 206, 0.5);
}

/* ==================== 组件样式 ==================== */

/* 桌面背景 */
.desktop {
  background: var(--bg-desktop);
}

/* Windows 98 窗口 */
.win98-window {
  background: var(--bg-window);
  color: var(--text-primary);
  box-shadow: 
    inset -1px -1px 0 var(--border-dark),
    inset 1px 1px 0 var(--border-light),
    inset -2px -2px 0 var(--border-shadow),
    inset 2px 2px 0 var(--border-highlight);
}

/* 标题栏 */
.win98-title-bar {
  background: linear-gradient(
    to right, 
    var(--title-start), 
    var(--title-end)
  );
  color: var(--text-title);
}

/* 输入框 */
.win98-input {
  background: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--border-shadow) var(--border-highlight) var(--border-highlight) var(--border-shadow);
}

/* 按钮 */
.win98-button {
  background: var(--bg-window);
  color: var(--text-primary);
  box-shadow: 
    inset -1px -1px 0 var(--border-dark),
    inset 1px 1px 0 var(--border-highlight),
    inset -2px -2px 0 var(--border-shadow),
    inset 2px 2px 0 var(--border-light);
}

/* 卡片 */
.card {
  background: var(--bg-panel);
  color: var(--text-primary);
  border-color: var(--border-light);
  box-shadow: 0 4px 20px var(--shadow-glow);
}

/* ==================== 主题切换按钮 ==================== */

.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  
  /* Windows 98 按钮样式 */
  background: var(--bg-window);
  border: 2px solid;
  border-color: var(--border-highlight) var(--border-dark) var(--border-dark) var(--border-highlight);
  padding: 8px 16px;
  
  display: flex;
  align-items: center;
  gap: 8px;
  
  cursor: pointer;
  font-family: "MS Sans Serif", sans-serif;
  font-size: 11px;
  font-weight: bold;
  color: var(--text-primary);
  
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  box-shadow: 0 0 20px var(--shadow-glow);
  transform: translateY(-2px);
}

.theme-toggle-btn:active {
  border-color: var(--border-dark) var(--border-highlight) var(--border-highlight) var(--border-dark);
  transform: translateY(0);
}

/* 灯泡容器 */
.lightbulb-container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 文字标签 */
.theme-label {
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ==================== 暗模式特殊效果 ==================== */

/* 暗模式下的霓虹效果 */
[data-theme="dark"] .neon-text {
  color: var(--vapor-cyan);
  text-shadow: 
    0 0 10px var(--vapor-cyan),
    0 0 20px var(--vapor-cyan),
    0 0 30px var(--vapor-pink);
}

/* 暗模式下的网格 */
[data-theme="dark"] .grid-background {
  background-image: 
    linear-gradient(0deg, rgba(1, 205, 254, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(1, 205, 254, 0.3) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 暗模式下的扫描线 */
[data-theme="dark"] .scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(1, 205, 254, 0.05) 2px,
    rgba(1, 205, 254, 0.05) 4px
  );
  pointer-events: none;
}

/* ==================== 切换动画 ==================== */

/* 页面切换时的淡入淡出 */
.theme-transition {
  animation: themeChange 0.3s ease;
}

@keyframes themeChange {
  0% {
    opacity: 0.8;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 开灯/关灯动画 */
.light-switch {
  animation: lightSwitch 0.5s ease;
}

@keyframes lightSwitch {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.5);
  }
  100% {
    filter: brightness(1);
  }
}
```

---

## React实现（完整）

### components/theme/ThemeProvider.tsx

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    
    // 添加切换动画
    document.body.classList.add('light-switch')
    setTimeout(() => {
      document.body.classList.remove('light-switch')
    }, 500)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

### components/theme/ThemeToggle.tsx

```tsx
'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={theme === 'light' ? '关灯' : '开灯'}
    >
      <div className="lightbulb-container">
        {theme === 'light' ? (
          // 太阳图标（开灯）
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#FFD700" />
            <path 
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
              stroke="#FFD700" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // 月亮图标（关灯）
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
              fill="#B967FF" 
              stroke="#01CDFE" 
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
      <span className="theme-label">
        {theme === 'light' ? '關燈' : '開燈'}
      </span>
    </button>
  )
}
```

---

## 使用方法

### 1. 在layout.tsx中添加Provider

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. 在组件中使用主题

```tsx
import { useTheme } from '@/components/theme/ThemeProvider'

export function MyComponent() {
  const { theme } = useTheme()
  
  return (
    <div className={theme === 'dark' ? 'neon-text' : ''}>
      内容
    </div>
  )
}
```

---

## 特殊效果

### 暗模式专属效果

```tsx
// 霓虹文字
<h1 className="neon-text">技术觉醒</h1>

// 网格背景
<div className="grid-background h-screen" />

// 扫描线效果
<div className="scanlines fixed inset-0 pointer-events-none" />
```

### 按钮位置变体

```css
/* 右上角 */
.theme-toggle-btn {
  top: 20px;
  right: 20px;
}

/* 任务栏内 */
.theme-toggle-btn.in-taskbar {
  position: relative;
  top: auto;
  right: auto;
}
```

---

## 键盘快捷键

```tsx
// 添加键盘快捷键支持
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      toggleTheme()
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [toggleTheme])
```

---

## 实施清单

```
□ 创建 ThemeProvider.tsx
□ 创建 ThemeToggle.tsx
□ 更新 globals.css（添加主题变量）
□ 在 layout.tsx 中集成
□ 测试所有组件在两种模式下的显示
□ 确保 localStorage 正常工作
□ 添加切换动画
□ 测试键盘快捷键
```

---

**主题系统完成！**

**核心功能**:
- 全局开灯/关灯切换
- Windows 98 + Vaporwave双主题
- 平滑过渡动画
- LocalStorage持久化
- 键盘快捷键（Ctrl+L）

**效果**:
- Light: 经典Windows 98
- Dark: Vaporwave霓虹风格

**下一步**: 集成到项目 🌓
