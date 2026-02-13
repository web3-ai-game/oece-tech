---
distilled_by: grok-4-0709
mode: B
target_category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/QUICK_START_GUIDE.md.distilled
---
part: 2
---

## 2. 分步式設置流程

### 2.1 帳戶創建與初始配置

背景：雲服務帳戶創建是開發流程的起點，源自於身份驗證和資源分配的需要。原理基於 OAuth 和 API 密鑰管理，確保安全訪問。

展開：首先，註冊 MongoDB Atlas 帳戶，創建叢集 (cluster) 並設定 IP 白名單。實例：選擇 M0 免費層級，配置為共享叢集，允許從本地 IP 連接。

代碼範例1：MongoDB Atlas 連接字串生成 (使用 Node.js)

```javascript
// 安裝 MongoDB 驅動程式
npm install mongodb

// 連接範例
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI; // 從環境變量讀取
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
connect(); // 呼叫連接函數
```

### 2.2 環境變量配置

背景：環境變量源自 Unix 系統，現廣泛用於雲開發以分離配置與程式碼。原理是透過 .env 檔案或雲端設定注入變量，提升可移植性。

展開：配置如 `SUPABASE_URL` 和 `SUPABASE_KEY`，用於 Supabase 連接。實例：在專案根目錄創建 .env 檔案，加入變量並使用 dotenv 套件載入。

代碼範例2：.env 檔案範例與載入

```bash
# .env 檔案
MONGODB_URI=***REDACTED***
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
FIREBASE_API_KEY=your-firebase-key
```

```javascript
// 使用 dotenv 載入
require('dotenv').config();
console.log('Supabase URL:', process.env.SUPABASE_URL); // 存取變量
```

### 2.3 依賴安裝與數據庫初始化

背景：依賴管理是現代開發的核心，npm 等工具自2010年起普及。原理基於模組化，確保相容性。

展開：安裝如 mongoose (for MongoDB) 和 @supabase/supabase-js。初始化數據庫涉及創建集合和索引。實例：為用戶資料創建 MongoDB 集合。

代碼範例3：Supabase 初始化與查詢

```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function initDB() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error('Error:', error);
  else console.log('Users:', data);
}
initDB(); // 初始化並查詢
```

### 2.4 本地測試與驗證

背景：本地測試源自敏捷開發，強調迭代驗證。原理是模擬生產環境，及早發現問題。

展開：使用 curl 測試 API 端點，如健康檢查。實例：測試 MongoDB 連接是否成功。

代碼範例4：本地 API 測試命令

```bash
# 健康檢查
curl http://localhost:3000/health

# API 測試：假設有 /api/users 端點
curl -X GET http://localhost:3000/api/users -H "Authorization: Bearer your-token"
```

| 測試類型 | 命令 | 預期輸出 | 常見錯誤 |
|----------|------|----------|----------|
| 健康檢查 | curl /health | {"status": "ok"} | 連接拒絕 (port 問題) |
| API 驗證 | curl /api/test | JSON 資料 | 401 未授權 |

### 2.5 Cloud Run 部署

背景：Cloud Run 是 GCP 的無伺服器平台，自2019年推出，允許容器化部署。原理基於 Docker 和 Kubernetes，自動擴展。

展開：建置 Docker 映像並部署到 Cloud Run。實例：設定服務帳戶並配置環境變量。

代碼範例5：Dockerfile 範例

```dockerfile
# 使用 Node.js 基礎映像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 複製應用程式碼
COPY . .

# 暴露端口
EXPOSE 3000

# 啟動命令
CMD ["npm", "start"] // 假設 start script 為 node server.js
```

### 2.6 部署檢查與維護

背景：部署後維護是 DevOps 的延伸，強調監控。原理涉及日誌分析和自動化工具。

展開：使用 GCP Console 檢查日誌，提供故障排除。

代碼範例6：Cloud Run 部署命令

```bash
# 建置並推送映像
gcloud builds submit --tag gcr.io/your-project/app

# 部署到 Cloud Run
gcloud run deploy your-service --image gcr.io/your-project/app --platform managed
```
