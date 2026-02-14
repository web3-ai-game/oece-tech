---
source: docs_99-原始文檔歸檔_cline_prompt_template.md
distilled_at: 2026-02-14T09:22:49.050Z
model: grok-4-1-fast-non-reasoning
---

# DEEPWEAY-SMS 知識文檔

## 項目概述

**DEEPWEAY-SMS** 是一個極簡黑客風格的全棧 SMS 管理系統，專為高密度代碼和高效運營設計。採用 Next.js 14 前端 + Go 後端 + Supabase 資料庫 + Gemini AI 智能處理的現代技術棧。

```
┌─────────────────┐    ┌─────────────┐    ┌──────────────────┐
│   Next.js 14    │◄──►│   Supabase   │◄──►│     Go API       │
│  (TypeScript)   │    │  (PostgreSQL │    │  (後端服務)      │
│ Shadcn/UI +     │    │     + Auth)  │    │                  │
│  Gemini AI      │    └─────────────┘    └──────────────────┘
└─────────────────┘                                 ▲
  ▲ GitHub Dark Mode 極簡黑客風格                           │
  └───────────────────────────────────────────────────────┘
                          Gemini AI 智能處理
```

## 核心原則

- **代碼密度優先**：每行代碼必須產生最大價值，無冗餘註解
- **類型安全**：TypeScript (前端) + Go (後端)
- **容錯設計**：所有 API 調用必須有完整錯誤處理
- **組件化 UI**：Shadcn/UI + Tailwind CSS + GitHub Dark Mode

## 技術棧與架構

```
Frontend: Next.js 14.2.3 (App Router) + TypeScript 5.5
Backend: Go 1.23 + Gin 1.10
Database: Supabase (PostgreSQL 16 + Auth)
AI: Google Gemini 2.0 Flash
UI: Shadcn/UI 0.9 + Tailwind CSS 3.4
Style: GitHub Dark Mode (css variables)
```

## 文件結構

```
deepweay-sms/
├── frontend/                 # Next.js 14 前端
│   ├── app/                 # App Router
│   │   ├── dashboard/       # 主控台
│   │   ├── sms/             # SMS 管理
│   │   ├── ai/              # Gemini AI 界面
│   │   └── globals.css      # GitHub Dark 配色
│   ├── components/          # Shadcn/UI 組件
│   ├── lib/                 # Supabase + Gemini 客戶端
│   └── types/               # TypeScript 類型定義
├── backend/                 # Go 後端 API
│   ├── cmd/                 # 入口點
│   ├── internal/            # 業務邏輯
│   │   ├── handlers/        # HTTP 處理器
│   │   ├── models/          # 資料模型
│   │   └── services/        # 業務服務
│   ├── pkg/                 # 共用包
│   └── go.mod               # Go 依賴
└── supabase/                # 資料庫 Schema
```

## 快速部署

```bash
# Clone & Install
git clone <repo> deepweay-sms
cd deepweay-sms

# Frontend
cd frontend
npm install
npm run dev

# Backend (新終端)
cd ../backend
go mod tidy
go run cmd/server/main.go
```

## 核心實現

### 1. 前端配置 (frontend/next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    esmExternals: 'loose'
  }
}

module.exports = nextConfig
```

**新依賴**:
```bash
npm i @supabase/supabase-js @google/generative-ai lucide-react
npm i -D @types/node typescript @types/react @types/react-dom
```

### 2. GitHub Dark Mode 主題 (frontend/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    /* GitHub Dark 配色系統 */
    --gh-bg: 0 0% 14%;
    --gh-fg: 255 255% 80%;
    --gh-border: 0 0% 22%;
    --gh-accent: 210 80% 55%;
  }
  
  .dark {
    --background: 0 0% 14%;
    --foreground: 0 0% 98%;
  }
  
  body {
    @apply bg-gh-bg text-gh-fg border-gh-border;
  }
}
```

### 3. Supabase 客戶端 (frontend/lib/supabase.ts)

```typescript
// 文件路徑: frontend/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function apiCall<T>(fn: Promise<T>): Promise<T> {
  try {
    return await fn
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

### 4. Gemini AI 服務 (frontend/lib/gemini.ts)

```typescript
// 文件路徑: frontend/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function analyzeSMS(content: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `分析這條 SMS: "${content}"
  返回 JSON: {"intent": "string", "urgency": "low|med|high", "category": "string"}`
  
  const result = await model.generateContent(prompt)
  return JSON.parse(await result.response.text())
}
```

### 5. SMS Dashboard 組件 (frontend/app/dashboard/sms/page.tsx)

```tsx
// 文件路徑: frontend/app/dashboard/sms/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analyzeSMS, supabase } from '@/lib'

export default function SMSDashboard() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSMS()
  }, [])

  async function fetchSMS() {
    const { data } = await supabase
      .from('sms_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
  }

  async function handleAnalyze(id: string, content: string) {
    setLoading(true)
    const analysis = await analyzeSMS(content)
    
    await supabase
      .from('sms_messages')
      .update({ analysis })
      .eq('id', id)
    
    fetchSMS()
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gh-fg">SMS Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages.map((msg) => (
          <Card key={msg.id} className="bg-gh-bg/80 border-gh-border">
            <CardHeader>
              <CardTitle className="text-gh-accent">{msg.from}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{msg.content}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => handleAnalyze(msg.id, msg.content)}
                  disabled={loading}
                  className="bg-gh-accent hover:bg-gh-accent/90"
                >
                  AI Analyze
                </Button>
                {msg.analysis && (
                  <span className="text-xs px-2 py-1 bg-gh-border rounded">
                    {msg.analysis.intent}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 6. Go 後端 API (backend/internal/handlers/sms.go)

```go
// 文件路徑: backend/internal/handlers/sms.go
package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/deepweay/backend/internal/models"
)

type SMSHandler struct {
	service *models.SMSService
}

func NewSMSHandler(s *models.SMSService) *SMSHandler {
	return &SMSHandler{service: s}
}

func (h *SMSHandler) ListSMS(c *gin.Context) {
	sms, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sms)
}

func (h *SMSHandler) CreateSMS(c *gin.Context) {
	var req models.SMSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sms, err := h.service.Create(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, sms)
}
```

**Go 依賴**:
```go
// backend/go.mod 新增
require (
    github.com/gin-gonic/gin v1.10.0
    github.com/supabase-community/supabase-go v0.0.0-20240702183419-095f235db0c3
)
```

### 7. Supabase Schema (supabase/migrations/001_create_sms.sql)

```sql
-- 文件路徑: supabase/migrations/001_create_sms.sql
CREATE TABLE sms_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_phone VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sms_from ON sms_messages(from_phone);
CREATE INDEX idx_sms_created_at ON sms_messages(created_at);
```

## 測試用例

### 前端測試 (frontend/__tests__/sms.test.tsx)

```tsx
// npm i -D vitest @testing-library/react jsdom
import { render, screen } from '@testing-library/react'
import SMSDashboard from '@/app/dashboard/sms/page'

test('renders SMS dashboard', () => {
  render(<SMSDashboard />)
  expect(screen.getByText('SMS Dashboard')).toBeInTheDocument()
})
```

### 後端測試 (backend/internal/handlers/sms_test.go)

```go
// 文件路徑: backend/internal/handlers/sms_test.go
func TestListSMS(t *testing.T) {
    h := NewSMSHandler(mockService{})
    w := httptest.NewRecorder()
    c, _ := gin.CreateTestContext(w)
    
    h.ListSMS(c)
    
    assert.Equal(t, http.StatusOK, w.Code)
}
```

## 環境變數

```bash
# .env.local (前端)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# .env (後端)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_key
PORT=8080
```

## 性能指標

```
API Response: < 150ms (P95)
UI Render: < 100ms (TTI)
DB Query: < 50ms (indexed)
AI Analysis: < 2s (Gemini Flash)
```

**部署命令**:
```bash
# Vercel (前端)
vercel --prod

# Render/Docker (後端)
docker build -t deepweay-sms-backend .
docker run -p 8080:8080 deepweay-sms-backend
```

此文檔提供完整的生產級部署藍圖，遵循極簡黑客風格與高密度代碼原則。