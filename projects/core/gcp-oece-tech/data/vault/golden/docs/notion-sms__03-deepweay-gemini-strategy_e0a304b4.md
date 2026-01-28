# ⚡ DeepWeay.me - Gemini免費層終極榨取策略

**來源**: https://www.notion.so/187576b95ff34fbab6e4d120d82c5aea
**更新時間**: 2025-11-26

**重要信息**:
- 伺服器 IP: 134.209.142.24
- 域名: deepweay.me

## 📊 Gemini免費層真實限制表

### 🚨 重要發現: Live API "無限制"是假的

根據最新搜索結果(2025-11):
- 有1M TPM限制 (1百萬tokens/分鐘)
- 動態限流 (高峰期500-1000次/天)
- 實驗性模型更嚴格 (3-4次就429錯誤)
- 不適合生產環境

### 真實可用模型限制表

| 模型 | RPM | TPM | RPD | 實際可用性 | 推薦場景 |
|------|-----|-----|-----|-----------|----------|
| gemini-2.5-flash-lite | 15 | 250K | 1K | ⭐⭐⭐⭐⭐ | 主力 - 翻譯/簡單工具 |
| gemini-2.5-flash | 10-15 | 2.25M | 2.5K | ⭐⭐⭐⭐⭐ | 次主力 - AI工具/Bot |
| gemini-2.5-pro | 5 | 250K | 100 | ⭐⭐⭐ | 高級功能 - 深度分析 |
| gemini-2.0-flash-live | ? | 1M | ? | ⭐⭐ | ❌ 測試用,別依賴 |

### 🎯 結論

**可靠生產級**:
1. Flash-Lite (1K/天) → 翻譯、簡單對話
2. Flash (2.5K/天) → AI工具、TG Bot
3. Pro (100/天) → 高級付費功能

## 🎯 AI工具開發優先級矩陣

### 階段1: 速贏工具(1-2天開發) - 使用Flash-Lite

| 優先級 | 工具名稱 | 調用模型 | 預估調用/天 | 開發時間 |
|--------|----------|----------|------------|----------|
| P0 | BBS自動翻譯 | Flash-Lite | 100 | 4h |
| P0 | 簡易旅行規劃 | Flash-Lite | 100 | 6h |
| P1 | 簽證對比器 | Flash-Lite | 50 | 8h |
| P1 | 生活成本計算 | Flash-Lite | 50 | 6h |

**總計: 300次/天 << 1K限制 ✅**

### 階段2: 中級工具(3-5天開發) - 使用Flash

| 優先級 | 工具名稱 | 調用模型 | 預估調用/天 | 開發時間 |
|--------|----------|----------|------------|----------|
| P2 | TG Bot對話 | Flash | 200次 | 2天 |
| P2 | 路線規劃助手 | Flash | 100次 | 1.5天 |
| P3 | 住宿推薦引擎 | Flash | 50次 | 1.5天 |

**總計: 350次/天 << 2.5K限制 ✅**

### 階段3: 高級功能(付費限定) - 使用Pro

| 優先級 | 工具名稱 | 調用模型 | 預估調用/天 | 定價 |
|--------|----------|----------|------------|------|
| P4 | 深度市場分析 | Pro | 20次 | $5/次 |
| P4 | 多國政策對比 | Pro | 10次 | $10/次 |
| P5 | 長期趨勢預測 | Pro | 5次 | $20/次 |

**總計: 35次/天 << 100限制 ✅**

## 🔧 Windsurf開發命令塊

### 命令塊0: 項目初始化

```markdown
## 任務: 創建Gemini服務層

**目標**: 在deepweay.me項目中創建統一的Gemini API調用層

**步驟**:
1. 創建 /src/lib/gemini/ 目錄
2. 創建 client.ts - 初始化所有模型客戶端
3. 創建 rate-limiter.ts - 速率限制器
4. 創建 types.ts - TypeScript類型定義

**代碼框架**:
```typescript
// src/lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiLite = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite'
});

export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

export const geminiPro = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro'
});
```

### 命令塊1: BBS自動翻譯(P0)

```markdown
## 任務: 實現BBS帖子自動翻譯

**模型**: gemini-2.5-flash-lite
**位置**: /src/lib/gemini/translation-queue.ts
**API Route**: /src/app/api/bbs/translate/route.ts

**功能需求**:
1. 用戶發帖後,異步翻譯繁中↔英文
2. 使用隊列系統,避免超過15 RPM
3. 存儲雙語版本到Supabase
4. 前端可切換語言顯示
```

### 命令塊2: 簡易旅行規劃工具(P0)

```markdown
## 任務: 創建AI旅行規劃工具

**模型**: gemini-2.5-flash-lite
**位置**: /src/app/tools/trip-planner/page.tsx
**API**: /src/app/api/ai/trip-planner/route.ts

**輸入參數**:
- 目的地(城市)
- 天數(1-30天)
- 預算(USD)
- 興趣標籤(文化/美食/冒險/工作空間)

**輸出內容**:
- 每日行程建議
- 住宿推薦(含價格範圍)
- 餐廳推薦
- 交通建議
- 預算分解
```

## 💰 收費模塊設計

### 三層用戶體系

| 等級 | 月費 | Gemini配額 | 功能權限 |
|------|------|-----------|----------|
| Guest | $0 | Flash-Lite共享池 | 基礎工具(限3次/天) |
| Free | $0 | Flash-Lite共享池 | 所有工具(限10次/天) + BBS |
| PRO | $9.99 | Pro專屬 | 無限基礎工具 + Pro功能 |

### Pro專屬功能(使用Gemini Pro)

**功能1: 深度市場分析($5/次 或 包月)**

每次調用消耗:
- Gemini Pro: 1次 (~30K tokens)
- 日限制: Pro用戶總共20次/天

**功能2: 多國政策對比(包月$99)**

適合場景:
- 移民顧問
- 簽證服務商
- 數字游民規劃師

配額:
- 無限基礎工具
- 100次Pro分析/月
- 優先響應

## 🏗️ 項目文件夾結構

```
deepweay-project/
├── README.md
├── DEVELOPMENT.md
├── docs/                    # 📚 項目文檔
│   ├── api/                # API接口文檔
│   ├── architecture/       # 架構設計文檔
│   └── prompts/           # AI Prompt模板庫
├── src/                    # 💻 源代碼主目錄
│   ├── app/               # Next.js 15 App Router
│   │   ├── (auth)/       # 🔐 認證路由組
│   │   ├── (dashboard)/  # 📊 用戶面板路由組
│   │   ├── tools/        # 🛠️ AI工具頁面
│   │   ├── bbs/          # 💬 BBS論壇
│   │   └── api/          # 🔌 API路由
│   ├── lib/              # 📚 核心庫與工具
│   │   ├── gemini/      # Gemini API集成
│   │   ├── supabase/    # Supabase集成
│   │   └── utils/       # 通用工具函數
│   └── components/       # 🧩 React組件
├── telegram-bot/         # 🤖 Telegram Bot
└── scripts/             # 🔧 腳本工具
```

## 📈 使用量監控

### 每日檢查清單

**工具**: Google AI Studio → Usage & Billing

**監控指標**:
- Flash-Lite: 使用量 / 1K
- Flash: 使用量 / 2.5K
- Pro: 使用量 / 100

**預警閾值**:
- 🟢 <70%: 正常
- 🟡 70-90%: 注意
- 🔴 >90%: 限流或升級

### 自動限流策略

```typescript
// src/lib/gemini/usage-monitor.ts
export async function checkQuota(model: 'lite' | 'flash' | 'pro') {
  const usage = await getUsageFromDB();
  
  const limits = {
    lite: 1000,
    flash: 2500,
    pro: 100
  };
  
  if (usage[model] >= limits[model] * 0.9) {
    return { allowed: false, message: 'Daily limit approaching' };
  }
  
  return { allowed: true };
}
```

## 🚀 下一步行動

### 本周任務(2025-11-05 → 11-11)

**Day 1-2**:
- [ ] 設置Windsurf MCP連接Notion
- [ ] 創建Gemini服務層(命令塊0)
- [ ] 實現BBS翻譯(命令塊1)

**Day 3-4**:
- [ ] 創建旅行規劃工具(命令塊2)
- [ ] 本地測試所有功能

**Day 5-7**:
- [ ] Git推送 → 自動部署
- [ ] 生產環境測試
- [ ] 邀請10個測試用戶

---

**最後更新**: 2025-11-05 20:30
