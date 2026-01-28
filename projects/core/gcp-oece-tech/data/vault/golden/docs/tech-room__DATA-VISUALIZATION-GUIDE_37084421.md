# 📊 數據可視化面板完整指南

## ✅ 已完成的工作

### 1. 核心文件

#### 📄 FREE-API-SOURCES.md（根目錄）
```
完整的50+免費API清單
├── 5個重點推薦API（東南亞優先）
│   ├── Alpha Vantage - 股票/外匯
│   ├── ExchangeRate-API - 匯率
│   ├── CoinGecko - 加密貨幣
│   ├── OpenWeatherMap - 天氣
│   └── NewsAPI - 新聞
│
└── 45+個額外API分類
    ├── 股票金融（12個）
    ├── 加密貨幣（4個）
    ├── 外匯匯率（4個）
    ├── 天氣數據（3個）
    ├── 新聞數據（3個）
    ├── 經濟數據（3個）
    └── 其他（16個）
```

#### 📊 components/tools/DataVisualization.tsx
```tsx
功能:
✅ 4個數據面板切換
  ├── 股票指數（東南亞6個）
  ├── 外匯匯率（東南亞6個）
  ├── 加密貨幣（5個）
  └── 天氣數據（東南亞6個城市）

✅ 假數據展示（等API配置）
✅ 自動刷新功能
✅ 響應式設計
✅ 賽博朋克UI風格
```

#### 🌐 app/tools/data/page.tsx
```tsx
完整工具頁面:
✅ 數據可視化面板集成
✅ 4個API信息卡片
✅ 快速申請指南（4個API）
✅ 環境變量配置說明
✅ 完整文檔鏈接
```

---

## 🚀 快速啟動

### 1. 查看工具頁面（1分鐘）

```bash
# 啟動開發服務器
npm run dev

# 訪問數據可視化頁面
open http://localhost:3000/tools/data
```

當前會看到：
- ✅ 完整的UI界面
- ✅ 假數據展示
- ✅ 4個數據面板切換
- ✅ API申請指南

---

## 📝 申請API步驟

### Phase 1: 核心API（優先申請）

#### 1. Alpha Vantage（10分鐘）

**用途**: 全球股票、外匯數據

**步驟**:
```
1. 訪問: https://www.alphavantage.co/support/#api-key
2. 填寫郵箱（建議用真實郵箱）
3. 立即獲得API Key（無需等待）
4. 複製Key
```

**配置**:
```bash
# .env.local
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=YOUR_KEY_HERE
```

**測試**:
```bash
# 測試API是否工作
curl "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YOUR_KEY"
```

---

#### 2. ExchangeRate-API（10分鐘）

**用途**: 161種貨幣實時匯率

**步驟**:
```
1. 訪問: https://www.exchangerate-api.com
2. 點擊 "Get Free Key"
3. 填寫郵箱並註冊
4. 郵箱確認
5. Dashboard獲取Key
```

**配置**:
```bash
# .env.local
NEXT_PUBLIC_EXCHANGE_RATE_KEY=YOUR_KEY_HERE
```

**測試**:
```bash
curl "https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD"
```

---

#### 3. CoinGecko（0分鐘 - 無需申請）

**用途**: 10000+加密貨幣數據

**特點**:
```
✅ 完全免費
✅ 無需註冊
✅ 無需API Key
✅ 直接使用
```

**測試**:
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
```

---

#### 4. OpenWeatherMap（15分鐘）

**用途**: 全球天氣數據

**步驟**:
```
1. 訪問: https://home.openweathermap.org/users/sign_up
2. 註冊賬號
3. 登入後訪問 API Keys 頁面
4. 複製 Default Key
5. 等待2小時激活（可先配置）
```

**配置**:
```bash
# .env.local
NEXT_PUBLIC_OPENWEATHER_KEY=YOUR_KEY_HERE
```

**測試**（2小時後）:
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Bangkok&appid=YOUR_KEY"
```

---

### Phase 2: 擴展API（可選）

#### 5. NewsAPI（10分鐘）
```
官網: https://newsapi.org/register
用途: 全球新聞數據
免費: 100 requests/day
```

#### 6. Finnhub（10分鐘）
```
官網: https://finnhub.io/register
用途: 美股、外匯數據
免費: 60 calls/minute
```

#### 7. Twelve Data（10分鐘）
```
官網: https://twelvedata.com/pricing
用途: 全球股票數據
免費: 800 requests/day
```

---

## 🔧 實施真實API

### 步驟1: 配置環境變量

創建 `.env.local` 文件：

```bash
# 核心API
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_alpha_vantage_key
NEXT_PUBLIC_EXCHANGE_RATE_KEY=your_exchange_rate_key
NEXT_PUBLIC_OPENWEATHER_KEY=your_openweather_key

# 可選API
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
NEXT_PUBLIC_FINNHUB_KEY=your_finnhub_key
```

### 步驟2: 創建API服務文件

創建 `lib/api-services.ts`:

```typescript
// Alpha Vantage - 股票數據
export async function getStockData(symbol: string) {
  const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data['Global Quote']
  } catch (error) {
    console.error('獲取股票數據失敗:', error)
    return null
  }
}

// ExchangeRate-API - 匯率數據
export async function getForexRates(base: string = 'USD') {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.conversion_rates
  } catch (error) {
    console.error('獲取匯率數據失敗:', error)
    return null
  }
}

// CoinGecko - 加密貨幣（無需Key）
export async function getCryptoData(ids: string[]) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('獲取加密貨幣數據失敗:', error)
    return null
  }
}

// OpenWeatherMap - 天氣數據
export async function getWeatherData(city: string) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('獲取天氣數據失敗:', error)
    return null
  }
}
```

### 步驟3: 修改DataVisualization組件

修改 `components/tools/DataVisualization.tsx`:

```typescript
import { getStockData, getForexRates, getCryptoData, getWeatherData } from '@/lib/api-services'

export function DataVisualization() {
  const [realData, setRealData] = useState(null)
  const [useRealData, setUseRealData] = useState(false)
  
  useEffect(() => {
    // 檢查是否配置了API Key
    const hasApiKeys = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY && 
                       process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY
    
    if (hasApiKeys) {
      setUseRealData(true)
      fetchRealData()
    }
  }, [])
  
  const fetchRealData = async () => {
    // 獲取真實數據
    const stocks = await Promise.all([
      getStockData('SET.BK'),
      getStockData('STI'),
      // ... 其他股票
    ])
    
    const forex = await getForexRates('USD')
    const crypto = await getCryptoData(['bitcoin', 'ethereum', 'binancecoin'])
    const weather = await Promise.all([
      getWeatherData('Bangkok'),
      getWeatherData('Singapore'),
      // ... 其他城市
    ])
    
    setRealData({ stocks, forex, crypto, weather })
  }
  
  // 使用真實數據或假數據
  const data = useRealData && realData ? realData : MOCK_DATA
  
  // ... 其餘組件代碼
}
```

---

## 📊 數據展示優化

### 添加圖表庫

```bash
npm install recharts
```

### 創建折線圖組件

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function StockChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
        <XAxis dataKey="date" stroke="#7c8895" />
        <YAxis stroke="#7c8895" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0a0e14', 
            border: '1px solid #00ff88' 
          }}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#00ff88" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## 🎯 完整功能檢查清單

### 當前狀態（假數據）
- [x] UI界面完成
- [x] 4個數據面板
- [x] 假數據展示
- [x] 響應式設計
- [x] 刷新功能
- [x] API文檔

### Phase 1: 核心API（本週）
- [ ] 申請Alpha Vantage
- [ ] 申請ExchangeRate-API
- [ ] 測試CoinGecko
- [ ] 申請OpenWeatherMap
- [ ] 配置.env.local
- [ ] 創建api-services.ts

### Phase 2: 真實數據（下週）
- [ ] 整合Alpha Vantage
- [ ] 整合ExchangeRate-API
- [ ] 整合CoinGecko
- [ ] 整合OpenWeatherMap
- [ ] 錯誤處理
- [ ] 加載狀態

### Phase 3: 增強功能（2週內）
- [ ] 添加圖表（recharts）
- [ ] 歷史數據查詢
- [ ] 數據緩存
- [ ] 自動刷新
- [ ] 更多API集成

### Phase 4: 完善（1月內）
- [ ] 50+API全部集成
- [ ] 數據對比功能
- [ ] 自定義面板
- [ ] 數據匯出
- [ ] 移動端優化

---

## 🌐 東南亞數據重點

### 股票市場代碼
```
泰國SET: ^SET.BK
新加坡STI: ^STI
馬來西亞KLSE: ^KLSE
印尼JCI: ^JKSE
菲律賓PSE: ^PSEI
越南VN30: ^VN30
```

### 貨幣代碼
```
泰銖: THB
新加坡元: SGD
馬來西亞令吉: MYR
印尼盾: IDR
菲律賓比索: PHP
越南盾: VND
```

### 主要城市
```
Bangkok (曼谷)
Singapore (新加坡)
Kuala Lumpur (吉隆坡)
Jakarta (雅加達)
Manila (馬尼拉)
Hanoi (河內)
```

---

## 🔐 安全注意事項

### API Key安全
```
✅ 使用環境變量
✅ 不要提交到Git
✅ 後端代理請求（生產環境）
✅ 限制請求頻率
```

### 錯誤處理
```typescript
try {
  const data = await fetchAPI()
  return data
} catch (error) {
  console.error('API錯誤:', error)
  // 返回假數據作為備用
  return MOCK_DATA
}
```

### 速率限制
```typescript
// 簡單的速率限制
let lastRequest = 0
const MIN_INTERVAL = 1000 // 1秒

async function rateLimitedFetch(url: string) {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequest
  
  if (timeSinceLastRequest < MIN_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest)
    )
  }
  
  lastRequest = Date.now()
  return fetch(url)
}
```

---

## 📱 訪問頁面

### 開發環境
```
http://localhost:3000/tools/data
```

### 相關頁面
```
工具頁面: /tools
API文檔: /FREE-API-SOURCES.md (下載)
```

---

## 🎉 總結

### 已完成
✅ 完整UI界面  
✅ 50+ API文檔  
✅ 假數據展示  
✅ 申請指南  
✅ 配置說明  

### 下一步
1. 申請4個核心API（35分鐘）
2. 配置.env.local（5分鐘）
3. 創建api-services.ts（30分鐘）
4. 整合真實數據（1小時）
5. 測試和優化（1小時）

### 預計完成時間
**3-4小時即可完成核心功能**

---

**數據可視化面板完成！50+ API · 假數據就緒 · 申請指南詳細！** 📊🌐🚀
