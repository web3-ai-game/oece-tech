# 📓 Notion 數據庫集成指南

## 🎯 概述

GeekSEA 首頁已經準備好對接 Notion 數據庫，所有教程數據可以從 Notion 同步。

---

## 📊 需要的 Notion 數據庫結構

### 1. 教程數據庫 (Tutorials Database)

**屬性結構**:
```
- 標題 (Title) - 教程名稱
- 分類 (Select) - Web3, 前端, 後端, 設計, 工具, 數據科學
- 難度 (Select) - Beginner, Intermediate, Advanced
- 時長 (Number) - 分鐘數
- 學生數 (Number) - 學習人數
- 評分 (Number) - 1-5 分
- 標籤 (Multi-select) - 技術標籤
- 內容 (Text/Markdown) - 教程正文
- 狀態 (Select) - 草稿, 已發布, 熱門
- 創建日期 (Date)
- 更新日期 (Date)
```

### 2. 學習路徑數據庫 (Learning Paths)

**屬性結構**:
```
- 路徑名稱 (Title)
- 步驟數 (Number)
- 預計時長 (Text) - 如 "3個月"
- 等級 (Select) - Beginner, Intermediate, Advanced
- 技能列表 (Multi-select)
- 相關教程 (Relation) - 關聯到教程數據庫
```

### 3. 技術棧數據庫 (Tech Stack)

**屬性結構**:
```
- 名稱 (Title)
- 圖標 (Text/Emoji)
- 顏色代碼 (Text)
- 順序 (Number)
```

---

## 🔌 集成方式

### 方式 1: Notion API (推薦)

#### 步驟 1: 獲取 Notion API Key

1. 訪問 https://www.notion.so/my-integrations
2. 創建新集成
3. 獲取 Internal Integration Token
4. 將 token 添加到 `.env.local`

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID_TUTORIALS=xxxxxxxxxxxxx
NOTION_DATABASE_ID_PATHS=xxxxxxxxxxxxx
NOTION_DATABASE_ID_TECH=xxxxxxxxxxxxx
```

#### 步驟 2: 安裝 Notion SDK

```bash
npm install @notionhq/client
```

#### 步驟 3: 創建 Notion 客戶端

```typescript
// lib/notion.ts
import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 獲取熱門教程
export async function getFeaturedTutorials() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID_TUTORIALS!,
    filter: {
      property: '狀態',
      select: {
        equals: '熱門',
      },
    },
    sorts: [
      {
        property: '學生數',
        direction: 'descending',
      },
    ],
    page_size: 3,
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties['標題'].title[0]?.plain_text || '',
    category: page.properties['分類'].select?.name || '',
    difficulty: page.properties['難度'].select?.name || '',
    duration: `${page.properties['時長'].number || 0} 分鐘`,
    students: page.properties['學生數'].number || 0,
    rating: page.properties['評分'].number || 0,
    tags: page.properties['標籤'].multi_select.map((tag: any) => tag.name),
  }))
}

// 獲取所有教程分類
export async function getTutorialCategories() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID_TUTORIALS!,
  })

  // 統計每個分類的教程數量
  const categories: Record<string, any> = {}
  
  response.results.forEach((page: any) => {
    const category = page.properties['分類'].select?.name
    if (category) {
      if (!categories[category]) {
        categories[category] = {
          title: category,
          count: 0,
          tags: new Set(),
        }
      }
      categories[category].count++
      page.properties['標籤'].multi_select.forEach((tag: any) => {
        categories[category].tags.add(tag.name)
      })
    }
  })

  return Object.values(categories).map((cat: any) => ({
    ...cat,
    tags: Array.from(cat.tags),
  }))
}

// 獲取學習路徑
export async function getLearningPaths() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID_PATHS!,
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties['路徑名稱'].title[0]?.plain_text || '',
    steps: page.properties['步驟數'].number || 0,
    duration: page.properties['預計時長'].rich_text[0]?.plain_text || '',
    level: page.properties['等級'].select?.name || '',
    skills: page.properties['技能列表'].multi_select.map((s: any) => s.name),
  }))
}
```

#### 步驟 4: 修改首頁為 Server Component

```typescript
// app/page.tsx
import { getFeaturedTutorials, getLearningPaths, getTutorialCategories } from '@/lib/notion'

export const revalidate = 3600 // 每小時重新驗證一次

export default async function HomePage() {
  // 從 Notion 獲取數據
  const featuredTutorials = await getFeaturedTutorials()
  const learningPaths = await getLearningPaths()
  const tutorialCategories = await getTutorialCategories()

  return (
    // ... 使用真實數據渲染
  )
}
```

---

### 方式 2: Notion Export + JSON (簡單)

#### 步驟 1: 從 Notion 導出數據

1. 在 Notion 中選擇數據庫
2. 點擊 "..." > Export > Markdown & CSV
3. 解壓文件

#### 步驟 2: 轉換為 JSON

創建腳本 `scripts/notion-to-json.js`:

```javascript
const fs = require('fs')
const path = require('path')

// 讀取 Notion 導出的 CSV
function convertNotionCSV() {
  // CSV 轉 JSON 邏輯
  const tutorials = []
  
  // 寫入 data/tutorials.json
  fs.writeFileSync(
    path.join(__dirname, '../data/tutorials.json'),
    JSON.stringify(tutorials, null, 2)
  )
}

convertNotionCSV()
```

#### 步驟 3: 使用 JSON 數據

```typescript
// app/page.tsx
import tutorialsData from '@/data/tutorials.json'

export default function HomePage() {
  const featuredTutorials = tutorialsData
    .filter(t => t.status === 'featured')
    .slice(0, 3)

  return (
    // ... 使用數據
  )
}
```

---

## 🔄 自動同步方案

### GitHub Actions 定時同步

創建 `.github/workflows/sync-notion.yml`:

```yaml
name: Sync Notion Data

on:
  schedule:
    - cron: '0 */6 * * *'  # 每 6 小時同步一次
  workflow_dispatch:  # 手動觸發

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Sync Notion Data
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
        run: node scripts/sync-notion.js
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/
          git commit -m "chore: sync notion data" || exit 0
          git push
```

---

## 📝 Notion 數據庫模板

### 教程數據庫示例

| 標題 | 分類 | 難度 | 時長 | 學生數 | 評分 | 標籤 | 狀態 |
|------|------|------|------|--------|------|------|------|
| Solidity 智能合約完全指南 | Web3 | Advanced | 120 | 1337 | 4.9 | Solidity, Smart Contract | 熱門 |
| Next.js 14 App Router | 前端 | Intermediate | 90 | 2048 | 4.8 | Next.js, React | 熱門 |
| 像素藝術設計入門 | 設計 | Beginner | 60 | 892 | 4.7 | Pixel Art, Design | 已發布 |

---

## 🎯 推薦集成順序

1. ✅ **階段 1**: 使用靜態數據（當前已完成）
2. 🔄 **階段 2**: Notion Export + JSON（簡單，適合快速開始）
3. 🚀 **階段 3**: Notion API 實時同步（專業，適合生產環境）
4. 🎨 **階段 4**: 添加緩存層（Redis/Vercel KV）

---

## 💡 最佳實踐

### 1. 緩存策略
```typescript
// 使用 Next.js 緩存
export const revalidate = 3600 // 1 小時

// 或使用 Redis
import { redis } from '@/lib/redis'

export async function getCachedTutorials() {
  const cached = await redis.get('tutorials')
  if (cached) return JSON.parse(cached)
  
  const tutorials = await getFeaturedTutorials()
  await redis.set('tutorials', JSON.stringify(tutorials), 'EX', 3600)
  return tutorials
}
```

### 2. 錯誤處理
```typescript
export async function getFeaturedTutorials() {
  try {
    const response = await notion.databases.query({...})
    return parseNotionData(response)
  } catch (error) {
    console.error('Notion API error:', error)
    // 返回靜態數據作為後備
    return fallbackTutorials
  }
}
```

### 3. 增量更新
```typescript
// 只同步最近更新的內容
const lastSync = await getLastSyncTime()
const response = await notion.databases.query({
  filter: {
    property: '更新日期',
    date: {
      after: lastSync,
    },
  },
})
```

---

## 📚 相關資源

- [Notion API 文檔](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## 🎉 開始集成

**推薦流程**:
1. 先在 Notion 創建數據庫並填充內容
2. 使用 Notion Export 測試數據轉換
3. 確認無誤後實現 Notion API 集成
4. 添加自動同步和緩存

**當前狀態**: ✅ 首頁已準備好，數據結構已定義，隨時可以對接！
