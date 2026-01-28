# 🚀 完整開發環境設置指南

## 📋 目錄
1. [MongoDB Atlas 設置](#1-mongodb-atlas-設置)
2. [Supabase Vector Database 設置](#2-supabase-vector-database-設置)
3. [Firebase 免費層設置](#3-firebase-免費層設置)
4. [GCP 環境變量配置](#4-gcp-環境變量配置)
5. [容器化配置](#5-容器化配置)
6. [Google Cloud Run 部署](#6-google-cloud-run-部署)
7. [開發流程](#7-開發流程)

---

## 1. MongoDB Atlas 設置

### 步驟 1: 創建 MongoDB Atlas 帳號
```bash
# 訪問 MongoDB Atlas
# https://www.mongodb.com/cloud/atlas

# 創建免費集群 (M0 Sandbox)
# - 512MB 存儲
# - 共享 RAM
# - 免費永久使用
```

### 步驟 2: 配置集群
```bash
# 1. 選擇雲服務商: Google Cloud
# 2. 選擇區域: asia-southeast1 (新加坡)
# 3. 集群名稱: sms-key-cluster
```

### 步驟 3: 創建數據庫用戶
```bash
# Database Access → Add New Database User
# Username: sms-key-admin
# Password: [生成強密碼]
# 權限: Atlas Admin
```

### 步驟 4: 設置網絡訪問
```bash
# Network Access → Add IP Address
# 選擇: Allow Access from Anywhere (0.0.0.0/0)
# 或添加 GCP Cloud Run 的出口 IP
```

### 步驟 5: 獲取連接字符串
```bash
# Clusters → Connect → Connect your application
# Driver: Node.js 5.0 or later
# 複製連接字符串，替換 <password> 和 <dbname>
```

---

## 2. Supabase Vector Database 設置

### 步驟 1: 創建 Supabase 項目
```bash
# 訪問 Supabase
# https://app.supabase.com

# 創建新項目
# - 項目名稱: sms-key-vectors
# - 數據庫密碼: [強密碼]
# - 區域: Southeast Asia (Singapore)
# - 計劃: Free tier
```

### 步驟 2: 啟用 pgvector 擴展
```sql
-- 在 Supabase SQL Editor 執行
CREATE EXTENSION IF NOT EXISTS vector;

-- 創建向量表
CREATE TABLE vectors (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建向量索引
CREATE INDEX ON vectors USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 步驟 3: 獲取 API 憑證
```bash
# Settings → API
# 複製:
# - Project URL
# - anon/public key
# - service_role key (保密)
```

---

## 3. Firebase 免費層設置

### 步驟 1: 創建 Firebase 項目
```bash
# 訪問 Firebase Console
# https://console.firebase.google.com

# 創建項目或使用現有 GCP 項目
# 項目名稱: deep-weay
```

### 步驟 2: 啟用服務
```bash
# 免費層包含:
# ✅ Authentication (10k 用戶/月)
# ✅ Firestore (1GB 存儲, 50k 讀取/日)
# ✅ Cloud Functions (125k 調用/月)
# ✅ Hosting (10GB 存儲, 360MB/日傳輸)
# ✅ Storage (5GB 存儲, 1GB/日下載)
```

### 步驟 3: 配置 Authentication
```javascript
// 啟用登錄方法
// Authentication → Sign-in method
// - Email/Password
// - Google
// - Anonymous (可選)
```

### 步驟 4: 初始化 Firestore
```javascript
// Firestore Database → Create Database
// 模式: Production mode
// 位置: asia-southeast1
```

### 步驟 5: 獲取配置
```javascript
// Project Settings → General → Your apps → Web app
// 複製 Firebase 配置對象
```

---

## 4. GCP 環境變量配置

### 方法 1: Secret Manager (推薦)
```bash
# 創建密鑰
gcloud secrets create mongodb-uri --data-file=- <<< "your-mongodb-uri"
gcloud secrets create supabase-key --data-file=- <<< "your-supabase-key"
gcloud secrets create firebase-config --data-file=- <<< "your-firebase-config"

# 授予 Cloud Run 訪問權限
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:your-service-account@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 方法 2: Cloud Run 環境變量
```bash
# 部署時設置
gcloud run deploy sms-key-vector-jet \
  --set-env-vars="MONGODB_URI=mongodb+srv://..." \
  --set-env-vars="SUPABASE_URL=https://..." \
  --set-env-vars="FIREBASE_API_KEY=..."
```

### 方法 3: .env 文件加密
```bash
# 使用 gcloud kms 加密
gcloud kms encrypt \
  --key=env-key \
  --keyring=app-secrets \
  --location=global \
  --plaintext-file=.env.production \
  --ciphertext-file=.env.production.enc
```

---

## 5. 容器化配置

### 更新 package.json
```bash
cd /home/svs-main-key/GCP
npm install mongodb @supabase/supabase-js firebase dotenv cors helmet compression
npm install --save-dev @types/node nodemon
```

### 優化 Dockerfile
```dockerfile
# 多階段構建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 8080
USER node
CMD ["node", "server.js"]
```

---

## 6. Google Cloud Run 部署

### 步驟 1: 構建容器
```bash
# 本地構建
docker build -t sms-key-vector-jet .

# 標記鏡像
docker tag sms-key-vector-jet gcr.io/deep-weay/sms-key-vector-jet

# 推送到 GCR
docker push gcr.io/deep-weay/sms-key-vector-jet
```

### 步驟 2: 部署到 Cloud Run
```bash
gcloud run deploy sms-key-vector-jet \
  --image=gcr.io/deep-weay/sms-key-vector-jet \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars-from-file=.env.production
```

### 步驟 3: 配置自定義域名
```bash
# 映射域名
gcloud run domain-mappings create \
  --service=sms-key-vector-jet \
  --domain=api.deepweay.me \
  --region=asia-southeast1

# 更新 DNS 記錄 (在域名註冊商)
# Type: CNAME
# Name: api
# Value: ghs.googlehosted.com
```

---

## 7. 開發流程

### 本地開發
```bash
# 1. 設置環境變量
cp .env.production .env.local
# 編輯 .env.local 填入實際值

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 測試 API
curl http://localhost:8080/health
```

### CI/CD 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - id: auth
        uses: google-github-actions/auth@v0
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Deploy
        run: |
          gcloud run deploy sms-key-vector-jet \
            --source . \
            --region asia-southeast1
```

---

## 📊 成本估算

### 免費層限制
| 服務 | 免費額度 | 估算使用 |
|------|---------|----------|
| MongoDB Atlas | 512MB | 足夠 10萬 文檔 |
| Supabase | 500MB + 2GB 傳輸 | 足夠 50萬 向量 |
| Firebase | 見上述列表 | 開發足夠 |
| Cloud Run | 200萬 請求/月 | 開發綽綽有餘 |

### 預估月成本
- **開發階段**: 0 THB (全免費層)
- **生產階段**: ~500 THB/月 (如超出免費層)

---

## 🔐 安全最佳實踐

1. **密鑰管理**
   - 使用 Secret Manager
   - 定期輪換密鑰
   - 不要提交到 Git

2. **網絡安全**
   - 啟用 HTTPS
   - 配置 CORS
   - 使用 VPC 連接器

3. **訪問控制**
   - IAM 最小權限
   - API Key 認證
   - Rate limiting

---

## 🚀 快速啟動命令

```bash
# 本地開發
npm run dev

# 構建容器
npm run docker:build

# 部署到 Cloud Run
npm run deploy

# 查看日誌
gcloud run logs read --service=sms-key-vector-jet

# 監控
gcloud monitoring dashboards create --config-from-file=monitoring.json
```

---

準備好開始了嗎？讓我們一步步設置！ 🔥
