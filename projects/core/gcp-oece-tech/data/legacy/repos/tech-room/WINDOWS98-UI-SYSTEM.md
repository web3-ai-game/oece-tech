# 💻 Windows 98 UI系统设计

## 🎨 核心设计理念

```
Windows 98经典元素:
- 灰色窗口背景 (#C0C0C0)
- 凸起/凹陷边框
- 任务栏风格
- 经典按钮
- 窗口标题栏
- 像素化字体
```

---

## 🎨 配色方案

### Windows 98经典配色

```css
:root {
  /* 主要颜色 */
  --win98-gray: #C0C0C0;          /* 窗口背景 */
  --win98-dark-gray: #808080;      /* 阴影 */
  --win98-light-gray: #DFDFDF;     /* 高光 */
  --win98-white: #FFFFFF;          /* 边框高光 */
  --win98-black: #000000;          /* 边框阴影 */
  
  /* 标题栏渐变 */
  --win98-blue-start: #000080;     /* 深蓝 */
  --win98-blue-end: #1084D0;       /* 浅蓝 */
  
  /* 桌面 */
  --win98-teal: #008080;           /* 经典桌面色 */
  
  /* 按钮状态 */
  --win98-btn-face: #C0C0C0;
  --win98-btn-shadow: #808080;
  --win98-btn-highlight: #FFFFFF;
  --win98-btn-dark-shadow: #000000;
  
  /* 文字 */
  --win98-text: #000000;
  --win98-text-disabled: #808080;
  
  /* 选中 */
  --win98-highlight: #000080;
  --win98-highlight-text: #FFFFFF;
}
```

---

## 📦 核心组件CSS

### 1. Windows 98边框

```css
/* 经典3D边框效果 */
.win98-border {
  border-style: solid;
  border-width: 2px;
  border-color: var(--win98-white) var(--win98-black) var(--win98-black) var(--win98-white);
  background: var(--win98-gray);
}

/* 凹陷效果（输入框） */
.win98-inset {
  border-style: solid;
  border-width: 2px;
  border-color: var(--win98-black) var(--win98-white) var(--win98-white) var(--win98-black);
  background: white;
}

/* 凸起效果（按钮） */
.win98-outset {
  border-style: solid;
  border-width: 2px;
  border-color: var(--win98-white) var(--win98-black) var(--win98-black) var(--win98-white);
  box-shadow: inset 1px 1px 0 var(--win98-light-gray), inset -1px -1px 0 var(--win98-dark-gray);
}
```

### 2. Windows 98按钮

```css
.win98-button {
  min-width: 75px;
  padding: 4px 12px;
  font-family: "MS Sans Serif", "Microsoft Sans Serif", sans-serif;
  font-size: 11px;
  background: var(--win98-btn-face);
  color: var(--win98-text);
  border: none;
  outline: 1px dotted transparent;
  outline-offset: -4px;
  
  /* 3D边框 */
  box-shadow: 
    inset -1px -1px 0 var(--win98-btn-dark-shadow),
    inset 1px 1px 0 var(--win98-btn-highlight),
    inset -2px -2px 0 var(--win98-btn-shadow),
    inset 2px 2px 0 var(--win98-white);
  
  cursor: pointer;
}

.win98-button:hover {
  filter: brightness(1.05);
}

.win98-button:active {
  /* 按下效果 */
  box-shadow: 
    inset 1px 1px 0 var(--win98-btn-dark-shadow),
    inset -1px -1px 0 var(--win98-btn-highlight),
    inset 2px 2px 0 var(--win98-btn-shadow),
    inset -2px -2px 0 var(--win98-white);
  padding: 5px 11px 3px 13px;
}

.win98-button:focus {
  outline: 1px dotted var(--win98-text);
}

.win98-button:disabled {
  color: var(--win98-text-disabled);
  text-shadow: 1px 1px 0 var(--win98-white);
}
```

### 3. Windows 98窗口

```css
.win98-window {
  background: var(--win98-gray);
  box-shadow: 
    inset -1px -1px 0 var(--win98-black),
    inset 1px 1px 0 var(--win98-light-gray),
    inset -2px -2px 0 var(--win98-dark-gray),
    inset 2px 2px 0 var(--win98-white);
  padding: 2px;
}

/* 窗口标题栏 */
.win98-title-bar {
  background: linear-gradient(
    to right,
    var(--win98-blue-start),
    var(--win98-blue-end)
  );
  color: white;
  padding: 3px 4px;
  font-family: "MS Sans Serif", sans-serif;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 标题栏按钮 */
.win98-title-button {
  width: 16px;
  height: 14px;
  background: var(--win98-gray);
  border: none;
  box-shadow: 
    inset -1px -1px 0 var(--win98-black),
    inset 1px 1px 0 var(--win98-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  cursor: pointer;
  margin-left: 2px;
}

.win98-title-button:active {
  box-shadow: 
    inset 1px 1px 0 var(--win98-black),
    inset -1px -1px 0 var(--win98-white);
}

/* 窗口内容区 */
.win98-window-body {
  background: var(--win98-gray);
  padding: 8px;
  margin: 2px;
  border: 2px solid;
  border-color: var(--win98-dark-gray) var(--win98-white) var(--win98-white) var(--win98-dark-gray);
}
```

### 4. 输入框

```css
.win98-input {
  padding: 4px;
  font-family: "MS Sans Serif", sans-serif;
  font-size: 11px;
  background: white;
  border: 2px solid;
  border-color: var(--win98-dark-gray) var(--win98-white) var(--win98-white) var(--win98-dark-gray);
  outline: none;
}

.win98-input:focus {
  outline: 1px dotted var(--win98-text);
  outline-offset: -3px;
}
```

### 5. 任务栏

```css
.win98-taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--win98-gray);
  border-top: 2px solid var(--win98-white);
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 9999;
}

.win98-start-button {
  height: 22px;
  padding: 0 4px 0 2px;
  font-family: "MS Sans Serif", sans-serif;
  font-size: 11px;
  font-weight: bold;
  background: var(--win98-gray);
  border: none;
  box-shadow: 
    inset -1px -1px 0 var(--win98-black),
    inset 1px 1px 0 var(--win98-white),
    inset -2px -2px 0 var(--win98-dark-gray),
    inset 2px 2px 0 var(--win98-light-gray);
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.win98-start-button:active {
  box-shadow: 
    inset 1px 1px 0 var(--win98-black),
    inset -1px -1px 0 var(--win98-white);
  padding: 1px 3px 0 3px;
}
```

---

## 🔧 React组件实现

### Window组件

```tsx
// components/win98/Window.tsx
'use client'

interface WindowProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
  width?: number
  height?: number
}

export function Win98Window({ 
  title, 
  children, 
  onClose,
  width = 400,
  height = 300 
}: WindowProps) {
  return (
    <div 
      className="win98-window" 
      style={{ width, minHeight: height }}
    >
      {/* 标题栏 */}
      <div className="win98-title-bar">
        <span>{title}</span>
        <div className="flex gap-0.5">
          <button className="win98-title-button">_</button>
          <button className="win98-title-button">□</button>
          <button 
            className="win98-title-button" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* 内容区 */}
      <div className="win98-window-body">
        {children}
      </div>
    </div>
  )
}
```

### Button组件

```tsx
// components/win98/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Win98Button({ 
  children, 
  onClick, 
  disabled, 
  type = 'button' 
}: ButtonProps) {
  return (
    <button
      type={type}
      className="win98-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### Input组件

```tsx
// components/win98/Input.tsx
interface InputProps {
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  name?: string
}

export function Win98Input({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  name
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      className="win98-input notranslate"
    />
  )
}
```

---

## 🎯 首页改版示例

```tsx
// app/page.tsx (Windows 98风格)
'use client'

import { Win98Window } from '@/components/win98/Window'
import { Win98Button } from '@/components/win98/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-win98-teal p-4">
      {/* 主窗口 */}
      <Win98Window title="技术觉醒平台 - OECE.TECH" width={800}>
        <div className="space-y-4">
          {/* Hero */}
          <div className="bg-white p-4 border-2 border-win98-inset">
            <h1 className="font-bold text-lg mb-2">
              欢迎来到技术觉醒平台
            </h1>
            <p className="text-sm">
              从躺平到自由的技术路径 | 数字游民的技术基地
            </p>
          </div>
          
          {/* 快速入口 */}
          <div className="grid grid-cols-3 gap-2">
            <Win98Button>快速赚钱</Win98Button>
            <Win98Button>技能学习</Win98Button>
            <Win98Button>数字游民</Win98Button>
          </div>
          
          {/* 数据统计 */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '已觉醒', value: '3847' },
              { label: '月入$3K+', value: '482' },
              { label: '数字游民', value: '156' },
              { label: '成功案例', value: '689' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-2 border-2 border-win98-inset text-center">
                <div className="font-bold">{stat.value}</div>
                <div className="text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Win98Window>
      
      {/* 任务栏 */}
      <div className="win98-taskbar">
        <button className="win98-start-button">
          <span className="text-xs">🪟</span>
          <span>开始</span>
        </button>
      </div>
    </div>
  )
}
```

---

## 🎨 完整CSS文件

```css
/* app/win98.css */

@layer components {
  /* Windows 98基础样式 */
  .win98-border {
    border: 2px solid;
    border-color: #DFDFDF #000000 #000000 #DFDFDF;
    background: #C0C0C0;
  }
  
  .win98-inset {
    border: 2px solid;
    border-color: #000000 #DFDFDF #DFDFDF #000000;
    background: white;
  }
  
  .win98-window {
    background: #C0C0C0;
    box-shadow: 
      inset -1px -1px 0 #000000,
      inset 1px 1px 0 #DFDFDF,
      inset -2px -2px 0 #808080,
      inset 2px 2px 0 #FFFFFF;
    padding: 2px;
  }
  
  .win98-title-bar {
    background: linear-gradient(to right, #000080, #1084D0);
    color: white;
    padding: 3px 4px;
    font-family: "MS Sans Serif", sans-serif;
    font-size: 11px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .win98-title-button {
    width: 16px;
    height: 14px;
    background: #C0C0C0;
    border: none;
    box-shadow: 
      inset -1px -1px 0 #000000,
      inset 1px 1px 0 #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    cursor: pointer;
    margin-left: 2px;
  }
  
  .win98-window-body {
    background: #C0C0C0;
    padding: 8px;
    margin: 2px;
  }
  
  .win98-button {
    min-width: 75px;
    padding: 4px 12px;
    font-family: "MS Sans Serif", sans-serif;
    font-size: 11px;
    background: #C0C0C0;
    color: #000000;
    border: none;
    box-shadow: 
      inset -1px -1px 0 #000000,
      inset 1px 1px 0 #FFFFFF,
      inset -2px -2px 0 #808080,
      inset 2px 2px 0 #DFDFDF;
    cursor: pointer;
  }
  
  .win98-button:active {
    box-shadow: 
      inset 1px 1px 0 #000000,
      inset -1px -1px 0 #FFFFFF;
    padding: 5px 11px 3px 13px;
  }
  
  .win98-input {
    padding: 4px;
    font-family: "MS Sans Serif", sans-serif;
    font-size: 11px;
    background: white;
    border: 2px solid;
    border-color: #808080 #FFFFFF #FFFFFF #808080;
  }
  
  .win98-taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 28px;
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    display: flex;
    align-items: center;
    padding: 2px;
    z-index: 9999;
  }
  
  .win98-start-button {
    height: 22px;
    padding: 0 4px 0 2px;
    font-family: "MS Sans Serif", sans-serif;
    font-size: 11px;
    font-weight: bold;
    background: #C0C0C0;
    border: none;
    box-shadow: 
      inset -1px -1px 0 #000000,
      inset 1px 1px 0 #FFFFFF,
      inset -2px -2px 0 #808080,
      inset 2px 2px 0 #DFDFDF;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
}

/* 桌面背景 */
.bg-win98-teal {
  background-color: #008080;
}
```

---

**Windows 98 UI系统完成！** 💻✨

**核心特色**:
- 🎨 经典Windows 98外观
- 📦 完整组件库
- 🔧 React组件封装
- 💾 怀旧复古风格
- 🖱️ 真实3D效果

**下一步**: 应用到所有页面 🚀
