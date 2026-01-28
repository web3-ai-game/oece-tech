# 🌍 OECE TECH - Orbital Eden | 城市隱士技術平台完整設計文檔

**來源**: https://www.notion.so/54239ed38e3c4352a9e14ea8a4812682
**更新時間**: 2025-11-26

> **項目定位**: 為「城市隱士」打造的數字遊民操作系統
> **核心理念**: 最小化物理依賴,最大化數字自由
> **目標用戶**: 數字遊民、遠程工作者、極簡主義者、獨立開發者

## 🎯 產品願景

### 問題陳述
現代城市人面臨的三大困境:
1. **高房租壓力** - 月薪的 50%+ 用於租房
2. **通勤時間浪費** - 每天 2-3 小時在路上
3. **被動消費習慣** - 被城市生活方式綁架

### OECE 的解決方案
提供一套「遊牧生存工具箱」,幫助用戶:
- 📍 找到可負擔的城市
- 🏠 匹配遠程友好的住宿
- 💼 發現遠程工作機會
- 🧘 連接同類社群
- 📊 追蹤財務健康度

## 🧭 核心功能模塊

### 1. 城市適配引擎 (City Match Engine)

**功能**: AI 驅動的城市推薦系統

#### 輸入參數
```typescript
interface UserProfile {
  budget: number;           // 月預算
  workStyle: string[];      // ['remote', 'hybrid', 'freelance']
  priorities: string[];     // ['低成本', '快網速', '咖啡店多']
  visa_status: string;      // 簽證狀況
  languages: string[];      // 語言能力
  climate_pref: string;     // 氣候偏好
}
```

#### AI 評分算法 (Gemini 2.0 Flash)
```python
def calculate_city_score(city: City, user: UserProfile) -> float:
    """
    綜合評分公式:
    Score = w1*成本指數 + w2*生活質量 + w3*數字基建 + w4*簽證友好度
    """
    
    # 成本指數 (權重 0.4)
    cost_score = (user.budget / city.monthly_cost) * 0.4
    
    # 生活質量 (權重 0.25)
    quality_score = city.safety * 0.1 + city.healthcare * 0.15
    
    # 數字基建 (權重 0.25)
    digital_score = (city.internet_speed / 1000) * 0.25
    
    # 簽證友好度 (權重 0.1)
    visa_score = get_visa_difficulty(city, user.nationality) * 0.1
    
    return cost_score + quality_score + digital_score + visa_score
```

#### 數據源
- **Numbeo**: 生活成本數據
- **Speedtest Global Index**: 網速數據
- **Nomad List API**: 數字遊民數據
- **自建爬蟲**: Reddit r/digitalnomad, 知乎話題

### 2. 遠程工作機會板 (Remote Job Board)

**差異化特點**: 不是又一個 Remote.co,而是「機會雷達」

#### 數據聚合源
| 來源 | 類型 | 更新頻率 |
|------|------|----------|
| Remote.co | 全職遠程 | 每日 |
| AngelList | 創業公司 | 實時 |
| Upwork | 自由職業 | 實時 |
| GitHub Jobs | 技術崗 | 每日 |
| 自建爬蟲 | 中文平台 | 每日 |

#### AI 職位匹配
```typescript
// Gemini 分析用戶技能與職位的匹配度
const analyzeJobFit = async (user: User, job: Job) => {
  const prompt = `
    用戶技能: ${user.skills.join(', ')}
    職位要求: ${job.requirements}
    
    分析匹配度並給出:
    1. 匹配分數 (0-100)
    2. 缺失技能
    3. 學習路線建議
  `;
  
  return await gemini.generateContent(prompt);
}
```

### 3. 極簡財務追蹤器 (Minimal Finance Tracker)

**設計哲學**: 不是複雜的記賬工具,是「財務健康度儀表盤」

#### 核心指標
```
┌─────────────────────────────────────┐
│   🟢 健康度: 82/100                 │
├─────────────────────────────────────┤
│  收入: $3,500/月                    │
│  支出: $1,800/月                    │
│  儲蓄率: 48.5%                      │
│  🔥 連續盈餘: 6個月                  │
└─────────────────────────────────────┘
```

#### 自動分類 (AI 驅動)
```python
# 用 Gemini 自動識別消費類別
transaction = "在 7-11 買了瓶可樂,花了 3.5 USD"

category = gemini.classify(
    transaction,
    categories=['食物', '交通', '住宿', '娛樂', '其他']
)
# Output: '食物'
```

### 4. 社群論壇 (Community Forum)

**定位**: 不是又一個 Facebook Group,是「經驗知識庫」

#### 核心板塊
- 🏙️ **城市評測** - 真實遊民的城市生存報告
- 💼 **接案經驗** - 自由職業者的實戰分享
- 🎒 **裝備清單** - 遊牧必備工具推薦
- 🧘 **心理健康** - 孤獨、焦慮、倦怠的討論
- 🛠️ **技術分享** - 開發者的遠程工具

#### AI 輔助功能
- **智能摘要**: 長帖子自動生成 TL;DR
- **自動翻譯**: 中文↔英文實時翻譯
- **相似帖子推薦**: 基於向量搜索

### 5. 遊牧檔案系統 (Nomad Profile)

**概念**: 類似「數字護照」,記錄遊民的旅程

#### 檔案結構
```typescript
interface NomadProfile {
  user_id: string;
  cities_lived: Array<{
    city: string;
    duration: number;  // 天數
    cost: number;      // 總花費
    rating: number;    // 評分
    note: string;      // 經驗筆記
  }>;
  
  work_history: Array<{
    company: string;
    role: string;
    duration: string;
    income: number;
  }>;
  
  skills: string[];
  achievements: Array<{
    title: string;     // e.g., "在 10 個城市生活過"
    icon: string;
    date: Date;
  }>;
}
```

#### 可視化展示
- 🗺️ **世界地圖** - 標記去過的城市
- 📊 **成本曲線** - 每月支出趨勢
- 🏆 **成就系統** - gamification 元素

## 🎨 設計系統

### 視覺風格: "數字極簡主義"

**核心原則**:
1. 少即是多 - 每個頁面只做一件事
2. 信息密度高 - 避免無用的留白
3. 快速加載 - 圖片延遲加載,優先顯示文字
4. 無干擾 - 無廣告,無彈窗,無自動播放

### 配色方案
```css
:root {
  /* 主色 - 沉穩藍 */
  --primary: #2563eb;
  
  /* 背景 - 極簡灰白 */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  
  /* 文字 - 高對比度 */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  
  /* 強調色 */
  --accent-green: #10b981;  /* 正向數據 */
  --accent-red: #ef4444;    /* 警告 */
  --accent-yellow: #f59e0b; /* 中性提示 */
}
```

### 字體系統
```css
/* 西文 - Inter (Google Fonts) */
font-family: 'Inter', sans-serif;

/* 中文 - 思源黑體 */
font-family: 'Noto Sans SC', sans-serif;

/* 代碼 - JetBrains Mono */
font-family: 'JetBrains Mono', monospace;
```

## 🏗️ 技術架構

### 技術棧選擇

#### 前端
```yaml
框架: Next.js 14 (App Router)
UI庫: TailwindCSS + Shadcn/UI
狀態管理: Zustand (輕量級)
數據獲取: TanStack Query (React Query)
圖表: Recharts
地圖: Mapbox GL JS
```

#### 後端
```yaml
主語言: Go 1.23+
框架: Gin (HTTP) + gRPC (內部服務)
數據庫: PostgreSQL (Supabase)
緩存: Upstash Redis
搜索: Meilisearch (開源替代 Algolia)
AI: Gemini 2.0 Flash (免費層)
```

#### 部署
```yaml
前端: Vercel (免費層)
後端: GCP Cloud Run (按需付費)
數據庫: Supabase (免費層 500MB)
文件存儲: Cloudflare R2 (比 S3 便宜 90%)
CDN: Cloudflare (免費層)
監控: Sentry (免費層)
```

### 數據庫 Schema

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 城市數據表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  cost_index FLOAT,
  internet_speed FLOAT,
  safety_score FLOAT,
  nomad_score FLOAT,
  latitude FLOAT,
  longitude FLOAT,
  data_source TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶城市評測
CREATE TABLE city_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  city_id INT REFERENCES cities(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  duration_days INT,
  total_cost DECIMAL(10,2),
  review_text TEXT,
  pros TEXT[],
  cons TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 遠程職位表
CREATE TABLE remote_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_type TEXT,  -- 'full-time', 'contract', 'freelance'
  salary_range TEXT,
  requirements TEXT[],
  description TEXT,
  apply_url TEXT,
  source TEXT,
  posted_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

-- 論壇帖子表
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  views INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 啟用全文搜索
CREATE INDEX idx_posts_content ON forum_posts USING gin(to_tsvector('english', content));
```

## 🚀 MVP 開發路線圖

### Phase 1: 基礎設施 (Week 1-2)

**Day 1-3: 項目初始化**
- [ ] 創建 GitHub Monorepo
- [ ] Next.js 前端腳手架
- [ ] Go 後端腳手架
- [ ] Supabase 數據庫初始化
- [ ] CI/CD 配置 (GitHub Actions)

**Day 4-7: 認證系統**
- [ ] Supabase Auth 集成
- [ ] 登錄/註冊頁面
- [ ] 用戶 Profile 頁面
- [ ] OAuth (Google/GitHub)

**Day 8-14: 核心 UI 框架**
- [ ] Layout 組件
- [ ] Navigation
- [ ] Dark Mode 支持
- [ ] 響應式設計測試

### Phase 2: 核心功能 (Week 3-6)

**城市匹配引擎 (Week 3)**
- [ ] 爬取 Numbeo 數據
- [ ] 城市評分算法
- [ ] 搜索/篩選界面
- [ ] 城市詳情頁

**論壇系統 (Week 4)**
- [ ] 發帖功能
- [ ] Markdown 編輯器
- [ ] 評論系統
- [ ] 投票機制

**財務追蹤器 (Week 5)**
- [ ] 記賬表單
- [ ] AI 自動分類
- [ ] 儀表盤展示
- [ ] 導出報表

**職位板 (Week 6)**
- [ ] 爬蟲系統 (Remote.co, AngelList)
- [ ] 職位列表頁
- [ ] AI 職位匹配
- [ ] 職位訂閱功能

### Phase 3: AI 增強 (Week 7-8)

**Gemini 集成**
- [ ] 城市推薦對話機器人
- [ ] 自動生成城市報告
- [ ] 論壇帖子智能摘要
- [ ] 職位描述翻譯

### Phase 4: 打磨 & 上線 (Week 9-10)

**性能優化**
- [ ] 圖片壓縮
- [ ] 代碼分割
- [ ] CDN 配置
- [ ] 數據庫索引優化

**上線準備**
- [ ] 安全審計
- [ ] SEO 優化
- [ ] 監控報警
- [ ] 備份策略

## 💰 成本預估

### 月度運營成本 (MVP階段)

| 項目 | 成本 | 說明 |
|------|------|------|
| GCP Cloud Run | $10-30 | 按請求計費 |
| Supabase | $0 | 免費層 |
| Cloudflare R2 | $0-5 | 按使用量 |
| 域名 | $1 | .tech 域名 |
| Gemini API | $0 | 免費層 15 RPM |
| 監控 (Sentry) | $0 | 免費層 |
| **總計** | **$11-36/月** | 極低成本 |

### 收入模式 (未來)

**B2C**:
- 高級會員: $9.99/月
  - 無限 AI 對話
  - 優先推薦職位
  - 專屬社群徽章

**B2B**:
- 企業招聘發布: $99/職位/月
- 城市推廣合作: 定制價格

## 📊 成功指標

### 30天目標
- [ ] 100+ 註冊用戶
- [ ] 20+ 城市評測
- [ ] 50+ 論壇帖子
- [ ] 5+ 成功匹配職位

### 90天目標
- [ ] 1000+ 用戶
- [ ] 10+ 付費用戶
- [ ] 200+ 城市數據覆蓋
- [ ] 日活躍用戶 > 50

## 🔗 參考資源

- **競品**: Nomad List, Remote.co, Indie Hackers
- **設計參考**: Linear, Notion, Arc Browser
- **技術參考**: Next.js Docs, Go by Example

---

**這不僅是產品,更是一種生活方式的宣言。**
**Let's build the operating system for modern nomads.** 🚀
