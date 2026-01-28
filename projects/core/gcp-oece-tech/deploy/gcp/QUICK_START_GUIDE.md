# 🚀 快速開始指南 - 完整開發環境設置

## 📋 設置清單

### 第 1 步：MongoDB Atlas（5分鐘）
```bash
# 1. 創建免費帳號
https://www.mongodb.com/cloud/atlas

# 2. 創建 M0 免費集群
- 選擇: Google Cloud (asia-southeast1)
- 集群名稱: sms-key-cluster

# 3. 獲取連接字符串
# 格式: mongodb+srv://username:password@cluster.mongodb.net/database
```

### 第 2 步：Supabase（5分鐘）
```bash
# 1. 創建免費項目
https://app.supabase.com

# 2. 選擇新加坡區域
- 項目名稱: sms-key-vectors
- 密碼: [強密碼]

# 3. 獲取 API Keys
Settings → API → 複製 URL 和 service_role key
```

### 第 3 步：Firebase（3分鐘）
```bash
# 1. 使用現有 GCP 項目
https://console.firebase.google.com

# 2. 啟用 Authentication 和 Firestore

# 3. 獲取配置
Project Settings → Your apps → Web app
```

### 第 4 步：配置環境變量（2分鐘）
```bash
# 複製並編輯環境變量文件
cp .env.production .env.local

# 編輯 .env.local，填入實際值
nano .env.local

# 必須設置的變量：
# - MONGODB_URI
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
```

### 第 5 步：安裝依賴（1分鐘）
```bash
cd /home/svs-main-key/GCP
npm install
```

### 第 6 步：初始化數據庫（3分鐘）
```bash
# MongoDB 初始化
node scripts/setup-mongodb.js

# Supabase 初始化（複製 SQL 到 Dashboard 執行）
node scripts/setup-supabase.js
```

### 第 7 步：本地測試（1分鐘）
```bash
# 啟動開發服務器
npm run dev

# 測試健康檢查
curl http://localhost:8080/health

# 測試 API
curl -X POST http://localhost:8080/api/jet/cold \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello World"}'
```

### 第 8 步：部署到 Cloud Run（5分鐘）
```bash
# 確保 Docker 已安裝
docker --version

# 執行部署腳本
chmod +x deploy-to-cloudrun.sh
./deploy-to-cloudrun.sh

# 或使用快速部署
npm run deploy:quick
```

---

## 🔥 快速測試命令

### 測試向量生成和保存
```bash
curl -X POST http://localhost:8080/api/vectors/save \
  -H "Content-Type: application/json" \
  -d '{
    "content": "這是一個測試向量",
    "metadata": {"category": "test"}
  }'
```

### 測試向量搜索
```bash
curl -X POST http://localhost:8080/api/vectors/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "測試",
    "limit": 5
  }'
```

### 查看 MongoDB 統計
```bash
curl http://localhost:8080/api/mongodb/stats
```

### 查看系統狀態
```bash
curl http://localhost:8080/api/stats
```

---

## 📊 環境變量說明

### 核心配置
| 變量 | 說明 | 示例值 |
|------|------|--------|
| MONGODB_URI | MongoDB 連接字符串 | mongodb+srv://... |
| SUPABASE_URL | Supabase 項目 URL | https://xxx.supabase.co |
| SUPABASE_SERVICE_KEY | Supabase 服務密鑰 | eyJhbGc... |

### Gemini API 配置
| 變量 | 說明 | 默認值 |
|------|------|--------|
| GEMINI_FREE_KEY | Gemini API 密鑰 | AIzaSyD... |
| GEMINI_FREE_MODEL | 使用的模型 | gemini-2.5-flash-lite |

### 溫度策略
| 變量 | 說明 | 值 |
|------|------|-----|
| TEMP_COLD | 低溫切割 | 0.1 |
| TEMP_VECTOR | 向量噴射 | 0.7 |
| TEMP_HOT | 高溫擴散 | 1.2 |
| TEMP_DISTILL | 蒸餾半截 | 0.5 |

---

## 🚀 部署檢查清單

- [ ] MongoDB Atlas 配置完成
- [ ] Supabase 表和函數創建完成
- [ ] Firebase 項目配置完成
- [ ] 環境變量設置完成
- [ ] 本地測試通過
- [ ] Docker 鏡像構建成功
- [ ] Cloud Run 部署成功
- [ ] 健康檢查通過

---

## 📝 常用命令速查

```bash
# 開發
npm run dev                    # 啟動開發服務器
npm test                       # 運行測試

# Docker
npm run docker:build           # 構建鏡像
npm run docker:run            # 本地運行容器

# 部署
npm run deploy                # 完整部署流程
npm run deploy:quick          # 快速部署
npm run logs                  # 查看 Cloud Run 日誌

# 數據庫
npm run mongodb:setup         # MongoDB 初始化
npm run supabase:setup        # Supabase 初始化

# PM2
pm2 start server-enhanced.js  # PM2 啟動
pm2 logs                      # 查看日誌
pm2 restart all              # 重啟所有進程
```

---

## 🔧 故障排除

### 問題：MongoDB 連接失敗
```bash
# 檢查連接字符串
echo $MONGODB_URI

# 確認 IP 白名單
# MongoDB Atlas → Network Access → Add IP (0.0.0.0/0)
```

### 問題：Supabase 向量搜索失敗
```bash
# 確認 pgvector 擴展已啟用
# Supabase Dashboard → SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

### 問題：Cloud Run 部署失敗
```bash
# 檢查 Docker
docker info

# 檢查 gcloud 配置
gcloud config list

# 啟用必要的 API
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## 💰 成本控制

### 免費層限額
- **MongoDB Atlas M0**: 512MB 存儲，永久免費
- **Supabase Free**: 500MB 數據庫，2GB 傳輸
- **Firebase Spark**: 詳見 Firebase 定價頁
- **Cloud Run**: 200萬 請求/月免費

### 預估成本
- **開發階段**: 0 THB（全部使用免費層）
- **小規模生產**: ~200-500 THB/月
- **中等規模**: ~1000-2000 THB/月

---

## 📞 需要幫助？

1. 查看詳細文檔: `DEVELOPMENT_SETUP.md`
2. 查看部署報告: `DEPLOYMENT_COMPLETE.md`
3. 查看系統日誌: `pm2 logs`

---

**準備好了嗎？讓我們開始吧！** 🔥
