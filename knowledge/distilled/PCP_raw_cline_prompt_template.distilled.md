---
source: PCP_raw_cline_prompt_template.md
distilled_at: 2026-02-14T09:23:08.524Z
model: grok-4-1-fast-non-reasoning
---

# DEEPWEAY-SMS 知識文檔

## 項目概覽

**DEEPWEAY-SMS** 是一個極簡黑客風格的全棧 SMS 管理系統，由全棧架構師開發。採用 GitHub Dark Mode 美學，提供高密度代碼實現，專注核心功能無冗餘。

```
技術棧: Next.js 14 (TypeScript) + Go + Supabase + Gemini AI
部署: Vercel (前端) + Fly.io (後端)
風格: 極簡黑客風格 (純黑背景 + 霓虹綠文字)
```

## 核心原則

1. **代碼密度優先** - 每行代碼必須產生業務價值
2. **類型安全** - TypeScript (前端) + Go structs (後端)
3. **容錯設計** - 所有 API 調用必須有錯誤處理 + 重試邏輯
4. **組件化** - UI 全使用 Shadcn/UI + Tailwind CSS

## 文件結構

```
DEEPWEAY-SMS/
├── app/                 # Next.js 14 App Router
├── components/          # Shadcn/UI 組件
├── lib/                 # 工具函數 + API clients
├── supabase/            # Supabase 客戶端
├── backend/             # Go 後端 API
├── tests/               # 核心功能測試
└── PCP_raw_cline_prompt_template.md  # 本文件
```

## 依賴清單

### 前端 (package.json)
```json
{
  "dependencies": {
    "next": "14.0.4",
    "@supabase/supabase-js": "^2.39.7",
    "@google/generative-ai": "^0.24.2",
    "shadcn-ui": "latest",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "axios": "^1.6.2"
  }
}
```

### 後端 (go.mod)
```go
module deepweay-sms/backend

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/supabase-community/supabase-go v0.2.2
    google.golang.org/genproto/googleapis/ai v0.0.0-20231116162425-ff01148a658f
    github.com/joho/godotenv v1.5.1
)
```

## 核心代碼實現

### 1. 前端 API Client
**文件路徑**: `lib/api-client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function sendSMS(phone: string, message: string): Promise<{ success: boolean; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('sms_queue')
      .insert({ phone, message, status: 'pending' })
      .select('id')
      .single();
    
    if (error) throw error;
    
    // 觸發 Go 後端處理
    await fetch('/api/sms/process', {
      method: 'POST',
      body: JSON.stringify({ id: data.id }),
    });
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('SMS Send Error:', error);
    return { success: false };
  }
}
```

### 2. Go 後端 SMS 處理器
**文件路徑**: `backend/main.go`

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type SMSQueue struct {
    ID     string `json:"id"`
    Phone  string `json:"phone"`
    Message string `json:"message"`
    Status string `json:"status"`
}

func processSMS(c *gin.Context) {
    var req SMSQueue
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Supabase 更新狀態
    // 實際 SMS 發送邏輯 (Twilio/Vonage)
    
    c.JSON(http.StatusOK, gin.H{"success": true, "sms_id": req.ID})
}

func main() {
    r := gin.Default()
    r.POST("/sms/process", processSMS)
    r.Run(":8080")
}
```

### 3. Gemini AI 智能回復
**文件路徑**: `lib/gemini-client.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSMSReply(context: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `生成簡短 SMS 回復: ${context}`;
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    return '收到，稍後回復';
  }
}
```

### 4. 主 UI 組件
**文件路徑**: `components/SMSInput.tsx`

```tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendSMS } from '@/lib/api-client';
import { useState } from 'react';

export function SMSInput() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const result = await sendSMS(phone, message);
    if (result.success) alert('SMS 已發送');
  };

  return (
    <div className="space-y-2 p-4 border border-green-500/30 rounded-lg bg-black/50">
      <Input 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        placeholder="13800138000"
        className="bg-black/50 border-green-500/50 text-green-400"
      />
      <Input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        placeholder="簡短訊息..."
        className="bg-black/50 border-green-500/50 text-green-400"
      />
      <Button onClick={handleSend} className="w-full bg-green-900/50 hover:bg-green-800/50 border-green-500">
        🚀 SEND SMS
      </Button>
    </div>
  );
}
```

## 測試用例

### 1. SMS 發送測試
**文件路徑**: `tests/sms.test.ts`

```typescript
import { sendSMS } from '../lib/api-client';

test('should send SMS successfully', async () => {
  const result = await sendSMS('13800138000', 'Test message');
  expect(result.success).toBe(true);
});
```

### 2. Go API 測試
**文件路徑**: `backend/sms_test.go`

```go
func TestProcessSMS(t *testing.T) {
    req := SMSQueue{ID: "test-123", Phone: "13800138000", Message: "test"}
    // 模擬請求處理
    // assert status updated
}
```

## 部署指令

```bash
# 前端
npm run build && vercel deploy

# 後端
go build -o sms-backend
flyctl deploy
```

## 配置變量

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_gemini_key
SUPABASE_SERVICE_KEY=your_service_key
```

**文件結束**: `PCP_raw_cline_prompt_template.md`