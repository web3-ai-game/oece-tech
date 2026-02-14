---
source: PCP_raw_web_app_src_app_layout.tsx.distilled.md
distilled_at: 2026-02-14T09:18:50.514Z
model: grok-4-1-fast-non-reasoning
---

# Next.js 根佈局（Root Layout）知識文檔

## 文件概述
**文件名稱**：`PCP_raw_web_app_src_app_layout.tsx.distilled.md`  
**用途**：定義 Next.js 應用程式的**根 HTML 結構**、**語言設定**及**全域 SEO 元資料**。  
**提供者**：資深架構師，提供文件結構導覽與可維護性擴寫建議。

---

## 核心功能與角色

### 1. 根佈局（Root Layout）定義
```
模組位置: src/app/layout.tsx
架構: Next.js App Router (app/ 目錄)
角色: 最頂層佈局，包裹整個前端應用程式
```

**功能清單**：
| 功能 | 描述 |
|------|------|
| **根 HTML 結構** | 定義 `<html>`、`<body>` 及基本 DOM 骨架 |
| **語言設定** | 透過 `lang` 屬性設定全域語言（預設 `zh-TW`） |
| **全域 SEO 元資料** | 設定 `<title>`、`<meta>` 標籤等 SEO 基礎 |
| **全域樣式注入** | 引入全域 CSS 或 Tailwind 樣式表 |
| **字體載入** | 透過 `next/font` 優化字體載入 |

### 2. 技術架構脈絡
```
Next.js App Router 階層結構:
src/app/
├── layout.tsx          ← 根佈局 (本文件)
├── page.tsx           ← 首頁
├── globals.css        ← 全域樣式
├── favicon.ico
└── [其他路由]/
    ├── layout.tsx     ← 中間佈局
    └── page.tsx       ← 頁面
```

**根佈局特性**：
- **唯一性**：應用程式中只能存在一個根 `layout.tsx`
- **強制包裹**：所有頁面都會被此佈局包裹
- **不可省略**：App Router 必備組件

---

## 典型程式碼結構

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Application description for SEO',
  language: 'zh-TW',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### 關鍵元件解析
| 元件 | 作用 | 最佳實踐 |
|------|------|----------|
| `Metadata` 物件 | 全域 SEO 設定 | 集中管理，避免重複 |
| `html lang` 屬性 | 語言設定 | 符合 HTML5 標準，SEO 友善 |
| `next/font` | 字體優化 | 自託管，無佈局偏移 |
| `globals.css` | 全域樣式 | Tailwind 或 CSS Modules |

---

## 可維護性最佳實務（資深架構師建議）

### 1. 文件結構導覽
```
src/
├── app/
│   ├── layout.tsx           # 根佈局
│   ├── metadata.ts         # 獨立 SEO 配置
│   ├── fonts.ts            # 字體配置
│   └── globals.css
├── components/
│   └── layout/             # 可重用佈局組件
└── lib/
    └── seo.ts              # SEO 工具函數
```

### 2. 擴展建議
```tsx
// 分離 Metadata 配置
// src/app/metadata.ts
export const baseMetadata: Metadata = {
  title: {
    template: '%s | Your App',
    default: 'Your App',
  },
  description: 'Default description',
  authors: [{ name: 'Your Team' }],
}

// 條件式語言設定
const getLocale = () => {
  return process.env.NEXT_PUBLIC_LOCALE || 'zh-TW'
}
```

### 3. 維護檢查清單
- [ ] `lang` 屬性與實際內容語言一致
- [ ] `Metadata` 包含 `title`、`description`
- [ ] 字體使用 `next/font`（避免 FOUT/FOIT）
- [ ] 全域樣式無衝突
- [ ] 支援 RTL 語言（若需要）

---

## 常見問題與解決方案

| 問題 | 原因 | 解決方案 |
|------|------|----------|
| 佈局偏移（Layout Shift） | 外部字體未優化 | 使用 `next/font` 自託管 |
| SEO 分數低 | 缺少 meta 標籤 | 完整 `Metadata` 配置 |
| 多語言切換困難 | 硬編碼 `lang` | 動態 `getLocale()` 函數 |
| 樣式衝突 | 全域 CSS 優先級過高 | 使用 CSS Modules 或 Tailwind |

---

**文檔版本**：1.0  
**最後更新**：基於 Next.js 14+ App Router 規範  
**適用版本**：Next.js 13.4+（App Router）