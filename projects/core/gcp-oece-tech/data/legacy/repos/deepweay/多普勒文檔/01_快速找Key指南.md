# 🔑 API Key 快速查找指南

> **最後更新**: 2025-11-16  
> **目的**: 直達主題,5分鐘找到任何服務的 API Key

---

## 📋 已配置服務速查表

| 服務 | 登錄地址 | Key 位置 | Key 命名 |
|------|---------|---------|---------|
| **OpenRouter** | [platform.openrouter.ai](https://platform.openrouter.ai) | Settings → API Keys | `OPENROUTER_*` |
| **xAI (Grok)** | [console.x.ai](https://console.x.ai) | API Keys | `XAI_*` |
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com) | Get API Key | `GEMINI_*` |
| **Supabase** | [app.supabase.com](https://app.supabase.com) | Project Settings → API | `SUPABASE_*` |
| **Upstash Redis** | [console.upstash.com](https://console.upstash.com) | Database → Details | `UPSTASH_*`, `REDIS_URL` |
| **MongoDB Atlas** | [cloud.mongodb.com](https://cloud.mongodb.com) | Database → Connect | `MONGODB_*` |
| **DevCycle** | [app.devcycle.com](https://app.devcycle.com) | Environments & Keys | `DEVCYCLE_*` |
| **Resend** | [resend.com/api-keys](https://resend.com/api-keys) | API Keys | `RESEND_API_KEY` |
| **Algolia** | [algolia.com/account/api-keys](https://algolia.com/account/api-keys) | API Keys | `ALGOLIA_*` |
| **GitHub** | [github.com/settings/tokens](https://github.com/settings/tokens) | Developer → PAT | `GITHUB_TOKEN` |
| **Datadog** | [app.datadoghq.com](https://app.datadoghq.com) | Org Settings → API Keys | `DATADOG_API_KEY` |
| **Sentry** | [sentry.io/settings](https://sentry.io/settings) | Projects → Client Keys | `SENTRY_DSN` |
| **Honeybadger** | [app.honeybadger.io](https://app.honeybadger.io) | Projects → Settings | `HONEYBADGER_API_KEY` |
| **Doppler** | [dashboard.doppler.com](https://dashboard.doppler.com) | Projects → Tokens | `DOPPLER_TOKEN` |

---

## 🎯 核心服務詳細查找步驟

### 1️⃣ DevCycle (功能開關)

**URL**: [app.devcycle.com/org_gtLAknQ0tU6vX8Kh/settings/deep-weary/environments](https://app.devcycle.com/org_gtLAknQ0tU6vX8Kh/settings/deep-weary/environments)

**步驟**:
```
1. 登錄 → 選擇項目 "deep-weary"
2. 左側菜單 → "Environments & Keys"
3. 看到 4 個環境:
   - Development (開發)
   - Staging (預發)
   - Production (生產)
   - VPS (自定義)
4. 每個環境有 3 種 Key:
   - Client: 瀏覽器前端用
   - Mobile: iOS/Android 用
   - Server: 後端 Node.js/Python 用
```

**Doppler 變量**:
```bash
# 開發環境
DEVCYCLE_DEV_CLIENT=dvc_client_3c25f1f5_b400_4843_b65f_e9ba1d942272_0eec170
DEVCYCLE_DEV_MOBILE=dvc_mobile_d5829208_03ca_4ccb_b20f_3475d72e6e78_76626c2f
DEVCYCLE_DEV_SERVER=dvc_server_8c44e4e3_a978_47a5_ab77_fad0fd45750f_ec784fc

# 預發環境
DEVCYCLE_STAGING_CLIENT=dvc_client_e9e78cef_ad9f_4833_809f_c7ccbf994dc2_fd80c58
DEVCYCLE_STAGING_MOBILE=dvc_mobile_372ea5ab_b039_4522_8989_cf9acf14cfca_0e0ec42
DEVCYCLE_STAGING_SERVER=dvc_server_23a9d74f_022d_4a47_8b7b_3b2740465219_b6c050b

# 生產環境
DEVCYCLE_PROD_CLIENT=dvc_client_7f498f8f_f912_4d44_aa4a_d4d9bb71a28d8_3fc8540
DEVCYCLE_PROD_MOBILE=dvc_mobile_7f3e9749_5903_4cc6_b452_51e368121319_a8e48c4
DEVCYCLE_PROD_SERVER=dvc_server_6a2baaca_9c81_42fa_ae38_6df719eac7dc_98e93ae

# VPS 環境
DEVCYCLE_VPS_CLIENT=dvc_client_7c7d65d2_367e_4499_8896_5746daf973a3_d6cabaa
DEVCYCLE_VPS_MOBILE=dvc_mobile_98293642_5fb6_4362_8662_027f2afc05b6c_8ad0db3
DEVCYCLE_VPS_SERVER=dvc_server_b05e47a3_8a07_4330b_acfa_04405ad8681bb3_4eb5da8
```

---

### 2️⃣ OpenRouter (AI API 聚合)

**URL**: [platform.openrouter.ai/keys](https://platform.openrouter.ai/keys)

**步驟**:
```
1. 登錄 → 右上角頭像
2. Settings → API Keys
3. 點擊 "Create New Key"
4. 複製 sk-or-v1-... 開頭的 Key
```

**查詢餘額**:
```bash
curl https://openrouter.ai/api/v1/auth/key \
  -H "Authorization: Bearer $OPENROUTER_NEW_1"
```

**Doppler 變量**:
```bash
OPENROUTER_NEW_1=sk-or-v1-... (餘額 $1111)
OPENROUTER_OLION=sk-or-v1-... (無限額度)
```

---

### 3️⃣ Upstash Redis

**URL**: [console.upstash.com/redis](https://console.upstash.com/redis)

**步驟**:
```
1. 登錄 → 選擇數據庫 "diverse-bat-37571"
2. Details 標籤頁
3. 複製 3 個配置:
   - REST URL
   - REST Token
   - Redis URL (完整連接字串)
```

**Doppler 變量**:
```bash
UPSTASH_REDIS_REST_URL=https://diverse-bat-37571.upstash.io
UPSTASH_REDIS_REST_TOKEN=AZLDAAIncDJ...
REDIS_URL=rediss://default:AZL...@diverse-bat-37571.upstash.io:6379
```

---

### 4️⃣ MongoDB Atlas

**URL**: [cloud.mongodb.com](https://cloud.mongodb.com)

**步驟**:
```
1. 登錄 → 選擇集群 "svs-mcp"
2. 點擊 "Connect"
3. 選擇 "Connect your application"
4. 複製連接字串 (mongodb+srv://...)
5. 替換 <db_password> 為實際密碼
```

**Doppler 變量**:
```bash
MONGODB_URI=mongodb+srv://svs-mcp:<db_password>@svs-mcp.6nddk.mongodb.net/?appName=svs-mcp
MONGODB_PASSWORD=Nn334455!
```

---

### 5️⃣ Supabase

**URL**: [app.supabase.com](https://app.supabase.com)

**步驟**:
```
1. 登錄 → 選擇項目
2. Project Settings → API
3. 複製:
   - Project URL
   - anon public (公開 Key)
   - service_role (服務端 Key,保密!)
```

**Doppler 變量**:
```bash
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (保密)
```

---

### 6️⃣ Resend (郵件)

**URL**: [resend.com/api-keys](https://resend.com/api-keys)

**步驟**:
```
1. 登錄 → API Keys
2. 點擊 "Create API Key"
3. 名稱: deepway-production
4. 權限: Sending access
5. 複製 re_... 開頭的 Key
```

**Doppler 變量**:
```bash
RESEND_API_KEY=re_TSnXmDTx_G1okr3C25froNfbSoZPBsVEh
```

---

### 7️⃣ Google Gemini

**URL**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

**步驟**:
```
1. 登錄 Google 帳號
2. 點擊 "Get API Key"
3. 創建新 Key 或複製現有 Key
4. 複製 AIza... 開頭的 Key
```

**測試 Key**:
```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=$GEMINI_NEW_1"
```

**Doppler 變量**:
```bash
GEMINI_NEW_1=AIzaSyC...
# 共 19 個 Gemini Keys (GEMINI_1 到 GEMINI_18 + GEMINI_NEW_1)
```

---

### 8️⃣ xAI Grok

**URL**: [console.x.ai/team](https://console.x.ai/team)

**步驟**:
```
1. 登錄 X (Twitter) 帳號
2. 進入 Console → API Keys
3. 點擊 "Create new key"
4. 複製 xai-... 開頭的 Key
```

**測試 Key**:
```bash
curl https://api.x.ai/v1/models \
  -H "Authorization: Bearer $XAI_OICC_KEY"
```

**Doppler 變量**:
```bash
XAI_OICC_KEY=xai-...
XAI_2=xai-...
```

---

## 🚀 快速命令

### 查看所有 Doppler Keys
```bash
cd /mnt/volume_sgp1_01/deepway-mcp
doppler secrets --only-names
```

### 搜索特定服務的 Keys
```bash
doppler secrets | grep -i "devcycle"
doppler secrets | grep -i "openrouter"
doppler secrets | grep -i "gemini"
```

### 添加新 Key 到 Doppler
```bash
doppler secrets set SERVICE_NAME="your-api-key-here"
```

### 批量添加多個 Keys
```bash
doppler secrets set \
  KEY1="value1" \
  KEY2="value2" \
  KEY3="value3"
```

---

## 📝 Key 命名規則

```
格式: {服務名}_{用途}_{環境}

範例:
- OPENROUTER_NEW_1        (OpenRouter 新 Key #1)
- GEMINI_1                (Gemini Key #1)
- DEVCYCLE_DEV_CLIENT     (DevCycle 開發環境客戶端)
- SUPABASE_ANON_KEY       (Supabase 公開 Key)
- MONGODB_URI             (MongoDB 連接字串)
```

---

## ⚠️ 安全注意事項

**絕不公開的 Keys** ⛔:
- `SUPABASE_SERVICE_ROLE_KEY` - 完全數據庫權限
- `OPENROUTER_*` - 有餘額的 API Keys
- `MONGODB_PASSWORD` - 數據庫密碼
- `*_SERVER` - 所有後端 Server Keys

**可以公開的 Keys** ✅:
- `SUPABASE_ANON_KEY` - 僅限 RLS 允許的操作
- `DEVCYCLE_*_CLIENT` - 前端 Feature Flags
- `NEXT_PUBLIC_*` - Next.js 公開環境變量

---

## 🎯 下次找 Key 只需 3 步

1. **打開這個文檔** → 查速查表
2. **點擊對應 URL** → 直達服務後台
3. **複製 Key** → `doppler secrets set ...`

完成! 🎉
