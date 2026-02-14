---
source: PCP_raw_web_app_src_lib_supabase.ts.distilled.md
distilled_at: 2026-02-14T09:23:27.748Z
model: grok-4-1-fast-non-reasoning
---

# Supabase 客戶端初始化與向量操作介面

## 概述

本文件位於前端應用程式的 `lib` 目錄（`web/app/src/lib/supabase.ts`），作為 **Supabase 服務的資料存取層 (DAL)**。其主要用途為：

1. **初始化 Supabase 客戶端** - 建立與 Supabase 後端的穩定連線
2. **提供向量操作介面** - 專門處理與 `vectors` 表的互動，包括資料持久化和向量搜尋

此架構設計讓前端應用程式能**直接與 Supabase 通訊**，無需中間後端服務，在 GCP 項目中替代或輔助自建後端。

## 核心功能

### 1. Supabase 客戶端初始化
```typescript
// 典型初始化模式
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**環境變數需求**：
```
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_專案_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_公開_金鑰
```

### 2. 向量表操作介面
提供與 `vectors` 表的完整 CRUD 操作及向量搜尋功能：

| 操作類型 | 功能描述 | 典型使用場景 |
|---------|---------|-------------|
| **插入** | 儲存向量嵌入與相關中繼資料 | 文檔索引化、內容嵌入 |
| **查詢** | 精確 ID 搜尋 | 單一資源檢索 |
| **向量搜尋** | 相似度匹配 | RAG 檢索、推薦系統 |
| **更新** | 修改向量或中繼資料 | 內容更新 |
| **刪除** | 移除向量記錄 | 資料清理 |

### 3. 架構角色與優勢

```
前端應用程式
       ↓ (直接通訊)
Supabase (DAL)
       ↓
vectors 表 + pgvector 擴充
```

**關鍵優勢**：
- ✅ **無伺服器架構** - 消除後端維護成本
- ✅ **即時向量搜尋** - 利用 Supabase pgvector 支援
- ✅ **資料持久化** - 自動備份與高可用性
- ✅ **安全性** - RLS（Row Level Security）保護
- ✅ **可擴展性** - GCP 託管，自動水平擴展

## 使用範例

### 基本操作
```typescript
// 插入向量
const { data, error } = await supabase
  .from('vectors')
  .insert({
    id: 'doc_123',
    embedding: [0.1, 0.2, 0.3, /* ... 1536維向量 */],
    metadata: { title: '文件標題', content: '文件內容' }
  })

// 向量相似度搜尋
const { data: results } = await supabase.rpc('match_documents', {
  query_embedding: [0.1, 0.2, 0.3, /* 查詢向量 */],
  match_threshold: 0.78,
  match_count: 10
})
```

## 部署考量

### GCP 整合
```
GCP 項目結構：
├── Supabase 專案 (託管向量資料庫)
├── 前端應用 (Vercel/Netlify)
└── 環境變數 (透過 GCP Secret Manager)
```

### 安全性最佳實踐
1. **僅暴露必要環境變數** - 使用 `NEXT_PUBLIC_` 前綴
2. **啟用 RLS** - 表級別存取控制
3. **API 限制** - 設定查詢速率限制
4. **監控** - Supabase Dashboard + GCP Monitoring

## 未來擴展

此 DAL 可輕鬆擴展支援：
- 多表操作（`documents`, `users`, `sessions`）
- 即時訂閱（Realtime）
- 檔案儲存（Storage）
- 邊緣函數（Edge Functions）

本文件作為前端與 Supabase 之間的**單一真相來源**，確保所有向量相關操作的一致性與可維護性。