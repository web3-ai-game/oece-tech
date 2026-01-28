# Next.js 14 App Router 完全指南

## 課程簡介

Next.js 14 引入了全新的 App Router，這是一個基於 React Server Components 的革命性路由系統。

## 什麼是 App Router？

App Router 是 Next.js 13+ 的新路由系統，提供了：

- 🚀 **伺服器組件優先** - 默認為 Server Components
- 📁 **文件系統路由** - 基於目錄結構
- ⚡ **串流渲染** - 更快的頁面加載
- 🎯 **並行路由** - 同時渲染多個頁面

## 項目結構

```
app/
├── layout.tsx          # 根佈局
├── page.tsx           # 首頁
├── loading.tsx        # 加載狀態
├── error.tsx          # 錯誤處理
└── (routes)/
    ├── about/
    │   └── page.tsx
    └── blog/
        ├── page.tsx
        └── [slug]/
            └── page.tsx
```

## Server Components

默認情況下，所有組件都是 Server Components：

```typescript
// app/page.tsx - Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  
  return (
    <div>
      <h1>數據展示</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

## Client Components

需要交互時使用 'use client'：

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      點擊次數: {count}
    </button>
  )
}
```

## 佈局系統

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <nav>導航欄</nav>
        {children}
        <footer>頁腳</footer>
      </body>
    </html>
  )
}
```

## 動態路由

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  return <h1>文章: {params.slug}</h1>
}
```

## 數據獲取

```typescript
// 伺服器端獲取數據
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    cache: 'no-store', // 不緩存
    // 或
    next: { revalidate: 3600 }, // 每小時重新驗證
  })
  return res.json()
}
```

## 總結

App Router 帶來了全新的開發體驗，充分利用 Server Components 提升性能！🚀
