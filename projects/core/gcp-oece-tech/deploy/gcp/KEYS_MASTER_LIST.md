# 🔐 密鑰主清單 | GCP 雲架構完整配置

> **最後更新**: 2025-11-26
> **用途**: 追蹤所有服務的 API 密鑰和 Token 狀態

---

## 📋 密鑰狀態總覽

| 服務 | 狀態 | 說明 |
|------|------|------|
| Gemini API (免費層) | ✅ 已配置 | 可用於開發 |
| Gemini API (Pro) | ⚠️ 需驗證 | 付費層需確認 |
| OpenRouter | ⚠️ 需配置 | 需從 Doppler 獲取 |
| MongoDB Atlas | ❌ 待獲取 | 需創建帳號和集群 |
| Supabase | ❌ 待獲取 | 需創建項目 |
| Firebase | ❌ 待獲取 | 需初始化項目 |
| Notion | ✅ 已配置 | ntn_391043... |
| GitHub Token | ⚠️ 需驗證 | 用於 CI/CD |
| Doppler | ✅ 已安裝 | 密鑰管理平台 |

---

## 🔑 已有密鑰（可直接使用）

### 1. Gemini API 免費層
```bash
# 已測試可用
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM
GEMINI_FREE_MODEL=gemini-2.5-flash-lite
GEMINI_FAST_MODEL=gemini-2.0-flash-lite

# 速率限制
# - 15 RPM (每分鐘請求數)
# - 250K TPM (每分鐘 Token)
# - 1500 RPD (每日請求)
```

### 2. Notion API
```bash
# 已配置
NOTION_TOKEN=ntn_391043025499CSeV...
# (完整值在環境變量中)
```

---

## ❌ 需要獲取的密鑰

### 1. MongoDB Atlas（免費 M0 集群）
```bash
# 獲取步驟：
# 1. 訪問 https://www.mongodb.com/cloud/atlas
# 2. 創建免費帳號
# 3. 創建 M0 集群（選擇 GCP asia-southeast1）
# 4. 創建數據庫用戶
# 5. 設置網絡訪問（0.0.0.0/0）
# 6. 獲取連接字符串

MONGODB_URI=mongodb+srv://<用戶名>:<密碼>@<集群>.mongodb.net/<數據庫>?retryWrites=true&w=majority
MONGODB_DB_NAME=sms-key-prod
```

### 2. Supabase（免費層）
```bash
# 獲取步驟：
# 1. 訪問 https://app.supabase.com
# 2. 創建新項目（選擇新加坡區域）
# 3. Settings → API 獲取

SUPABASE_URL=https://<項目ID>.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # 公開密鑰
SUPABASE_SERVICE_KEY=eyJhbGc...  # 服務密鑰（保密）
```

### 3. Firebase（免費 Spark 計劃）
```bash
# 獲取步驟：
# 1. 訪問 https://console.firebase.google.com
# 2. 使用現有 GCP 項目 (deep-weay) 或創建新項目
# 3. 添加 Web 應用
# 4. 複製配置

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=<項目ID>.firebaseapp.com
FIREBASE_PROJECT_ID=<項目ID>
FIREBASE_STORAGE_BUCKET=<項目ID>.appspot.com
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Firebase Admin SDK（服務端使用）
# 從 Project Settings → Service Accounts 下載 JSON
FIREBASE_ADMIN_SDK_PATH=./firebase-admin-sdk.json
```

### 4. OpenRouter（備用 AI 路由）
```bash
# 獲取步驟：
# 1. 訪問 https://openrouter.ai
# 2. 登錄/註冊
# 3. API Keys → 創建新密鑰

OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_SITE_URL=https://deepweay.me
```

### 5. GitHub Token（CI/CD 用）
```bash
# 獲取步驟：
# 1. GitHub → Settings → Developer settings
# 2. Personal access tokens → Tokens (classic)
# 3. 生成新 Token，選擇權限：repo, workflow

GITHUB_TOKEN=ghp_...
```

---

## 🔧 快速配置腳本

### 一鍵導出環境變量模板
```bash
# 執行此命令生成 .env.local 模板
cat > /home/svs-main-key/GCP/.env.local << 'EOF'
# ==========================================
# 🔐 本地開發環境變量
# ==========================================

# ===== Gemini API（已配置）=====
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM
GEMINI_FREE_MODEL=gemini-2.5-flash-lite

# ===== MongoDB Atlas（待填入）=====
MONGODB_URI=
MONGODB_DB_NAME=sms-key-prod

# ===== Supabase（待填入）=====
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# ===== Firebase（待填入）=====
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_AUTH_DOMAIN=
FIREBASE_STORAGE_BUCKET=

# ===== OpenRouter 備用（待填入）=====
OPENROUTER_API_KEY=

# ===== 溫度配置（已配置）=====
TEMP_COLD=0.1
TEMP_VECTOR=0.7
TEMP_HOT=1.2
TEMP_DISTILL=0.5

# ===== 服務配置 =====
PORT=8080
NODE_ENV=development
EOF

echo "✅ .env.local 模板已創建"
```

---

## 📱 Firebase 初始化指南

### 步驟 1: 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

### 步驟 2: 登錄 Firebase
```bash
firebase login
```

### 步驟 3: 初始化項目
```bash
cd /home/svs-main-key/GCP
firebase init

# 選擇:
# - Firestore
# - Authentication
# - Hosting (可選)
# - Functions (可選)

# 選擇現有項目: deep-weay
```

### 步驟 4: 獲取配置
```bash
# 方法 1: Firebase Console
# Project Settings → Your apps → Web app → SDK snippet

# 方法 2: 使用 gcloud
gcloud firebase projects:describe deep-weay
```

---

## 🚀 Doppler 密鑰同步

### 將所有密鑰同步到 Doppler
```bash
# 1. 確保已登錄 Doppler
doppler login

# 2. 設置項目
cd /home/svs-main-key/GCP
doppler setup
# 選擇項目: sms-key-platform
# 選擇配置: dev

# 3. 批量上傳密鑰
doppler secrets upload .env.local

# 4. 驗證密鑰
doppler secrets

# 5. 使用 Doppler 運行應用
doppler run -- node server-enhanced.js
```

---

## 📊 服務免費額度對比

| 服務 | 免費額度 | 足夠開發？ |
|------|---------|-----------|
| **MongoDB Atlas M0** | 512MB 存儲 | ✅ 足夠 |
| **Supabase Free** | 500MB + 2GB 傳輸 | ✅ 足夠 |
| **Firebase Spark** | 1GB Firestore, 10k 用戶 | ✅ 足夠 |
| **Cloud Run** | 200萬 請求/月 | ✅ 足夠 |
| **Gemini Free** | 15 RPM, 1500 RPD | ✅ 足夠 |

---

## ✅ 配置完成清單

- [ ] MongoDB Atlas 帳號已創建
- [ ] MongoDB 連接字符串已獲取
- [ ] Supabase 項目已創建
- [ ] Supabase API 密鑰已獲取
- [ ] Firebase 項目已初始化
- [ ] Firebase 配置已獲取
- [ ] OpenRouter API 密鑰已獲取
- [ ] 所有密鑰已同步到 Doppler
- [ ] .env.local 已配置完成
- [ ] 本地測試通過
- [ ] Cloud Run 部署成功

---

**下一步**: 按照上述步驟依次獲取各服務的 API 密鑰，然後運行 `doppler secrets upload .env.local` 同步到 Doppler。

需要幫助獲取任何特定服務的密鑰嗎？
