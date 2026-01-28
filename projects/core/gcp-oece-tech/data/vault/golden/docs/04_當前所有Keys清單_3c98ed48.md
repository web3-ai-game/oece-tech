# 📦 當前 Doppler 所有 Keys 清單

> **最後更新**: 2025-11-16  
> **總計**: 107 個環境變量

---

## 🤖 AI API Keys (29個)

### OpenRouter (5個)
```bash
OPENROUTER_NEW_1           # $1111 餘額
OPENROUTER_OLION           # 無限額度
OPENROUTER_2               # $4.73 餘額
OPENROUTER_3               # 無限額度
OPENROUTER_4               # 無限額度
```

### Google Gemini (19個)
```bash
GEMINI_1 到 GEMINI_18      # 舊 Keys (~1900 req/min)
GEMINI_NEW_1               # 新 Key (Gemini 2.5 支持)
```

### xAI Grok (2個)
```bash
XAI_OICC_KEY               # Grok-4 + Code-fast-1
XAI_2                      # Grok-4 + Code-fast-1
```

### Claude 代理 (2個)
```bash
KILO_API_KEY               # Kilo Cloud API Key
KILO_JWT_TOKEN             # JWT 有效至 2030-01-01
```

---

## 💾 數據庫 Keys (11個)

### Supabase (3個)
```bash
SUPABASE_URL               # Project URL
SUPABASE_ANON_KEY          # 公開 Key (前端安全)
SUPABASE_SERVICE_ROLE_KEY  # ⚠️ 服務端 Key (保密!)
```

### MongoDB Atlas (2個)
```bash
MONGODB_URI                # 連接字串 (含佔位符)
MONGODB_PASSWORD           # 數據庫密碼
```

### Upstash Redis (3個)
```bash
UPSTASH_REDIS_REST_URL     # REST API URL
UPSTASH_REDIS_REST_TOKEN   # REST Token
REDIS_URL                  # 完整連接字串 (rediss://)
```

### PostgreSQL (3個)
```bash
POSTGRES_URL               # 主連接字串
POSTGRES_USER              # 用戶名
POSTGRES_PASSWORD          # 密碼
```

---

## 🛠️ 開發工具 Keys (15個)

### DevCycle (12個)
```bash
# 開發環境
DEVCYCLE_DEV_CLIENT        # 前端 Feature Flags
DEVCYCLE_DEV_MOBILE        # 移動端
DEVCYCLE_DEV_SERVER        # 後端

# 預發環境
DEVCYCLE_STAGING_CLIENT
DEVCYCLE_STAGING_MOBILE
DEVCYCLE_STAGING_SERVER

# 生產環境
DEVCYCLE_PROD_CLIENT
DEVCYCLE_PROD_MOBILE
DEVCYCLE_PROD_SERVER

# VPS 環境
DEVCYCLE_VPS_CLIENT
DEVCYCLE_VPS_MOBILE
DEVCYCLE_VPS_SERVER
```

### GitHub (2個)
```bash
GITHUB_TOKEN               # Personal Access Token
GITHUB_CLIENT_SECRET       # OAuth App Secret
```

### Bootstrap Studio (1個)
```bash
BOOTSTRAP_STUDIO_LICENSE   # 授權碼
```

---

## 📊 監控 & 錯誤追蹤 (6個)

### Datadog (2個)
```bash
DATADOG_API_KEY            # API Key
DATADOG_APP_KEY            # Application Key
```

### Sentry (2個)
```bash
SENTRY_DSN                 # Data Source Name
SENTRY_AUTH_TOKEN          # 認證 Token
```

### Honeybadger (2個)
```bash
HONEYBADGER_API_KEY        # API Key
HONEYBADGER_ENV            # 環境名稱 (production)
```

---

## 📧 郵件服務 (3個)

### Resend (1個)
```bash
RESEND_API_KEY             # re_TSnXmDTx... (最新)
```

### SMTP (2個)
```bash
SMTP_HOST                  # 郵件服務器地址
SMTP_PASSWORD              # SMTP 密碼
```

---

## 🔍 搜索服務 (3個)

### Algolia (3個)
```bash
ALGOLIA_APP_ID             # Application ID
ALGOLIA_API_KEY            # Search-Only API Key
ALGOLIA_ADMIN_KEY          # ⚠️ Admin API Key (保密!)
```

---

## 🤖 Telegram Bots (12個)

```bash
# Bot Tokens
TELEGRAM_BOT_1_TOKEN       # 主 Bot
TELEGRAM_BOT_2_TOKEN       # 副 Bot
TELEGRAM_BOT_3_TOKEN       # 測試 Bot
TELEGRAM_BOT_SVCS11D_TOKEN # 特殊用途 Bot

# Bot 配置
TELEGRAM_WEBHOOK_URL       # Webhook 地址
TELEGRAM_CHAT_ID           # 群組 ID
TELEGRAM_ADMIN_ID          # 管理員 ID
```

---

## 🌐 Next.js 應用 (20個)

```bash
# 基礎配置
NEXT_PUBLIC_APP_URL        # 應用 URL
NEXT_PUBLIC_API_URL        # API 端點
NEXTAUTH_SECRET            # NextAuth 密鑰
NEXTAUTH_URL               # NextAuth URL

# OAuth 配置
GOOGLE_CLIENT_ID           # Google OAuth
GOOGLE_CLIENT_SECRET
GITHUB_ID                  # GitHub OAuth
GITHUB_SECRET
DISCORD_CLIENT_ID          # Discord OAuth
DISCORD_CLIENT_SECRET

# 功能開關
NEXT_PUBLIC_ENABLE_AI      # 啟用 AI 功能
NEXT_PUBLIC_ENABLE_FORUM   # 啟用論壇
```

---

## 🔐 安全 & 認證 (6個)

```bash
JWT_SECRET                 # JWT 簽名密鑰
SESSION_SECRET             # Session 加密密鑰
ENCRYPTION_KEY             # 通用加密 Key
API_KEY                    # 內部 API Key
WEBHOOK_SECRET             # Webhook 驗證密鑰
```

---

## 📈 統計

```bash
# 按類別統計
AI API Keys:        29 個
數據庫 Keys:        11 個
開發工具 Keys:      15 個
監控追蹤 Keys:      6 個
郵件服務 Keys:      3 個
搜索服務 Keys:      3 個
Telegram Bots:      12 個
Next.js 配置:       20 個
安全認證 Keys:      6 個
其他配置:           2 個
─────────────────────────
總計:              107 個
```

---

## 🔒 安全等級分類

### 🔴 絕密 (Never Expose!)
```bash
SUPABASE_SERVICE_ROLE_KEY  # 完全數據庫控制權
MONGODB_PASSWORD           # 數據庫密碼
OPENROUTER_*               # 有餘額的 Keys
ALGOLIA_ADMIN_KEY          # 完全控制權
JWT_SECRET                 # 認證密鑰
ENCRYPTION_KEY             # 加密密鑰
*_SERVER                   # 所有後端 Keys
```

### 🟡 限制公開 (Client-Side Safe with RLS)
```bash
SUPABASE_ANON_KEY          # Supabase 公開 Key (有 RLS 保護)
NEXT_PUBLIC_*              # Next.js 公開變量
DEVCYCLE_*_CLIENT          # 前端 Feature Flags
DEVCYCLE_*_MOBILE          # 移動端 Keys
```

### 🟢 可公開 (Public Info)
```bash
SUPABASE_URL               # Project URL
NEXT_PUBLIC_APP_URL        # 應用地址
ALGOLIA_APP_ID             # Application ID
```

---

## 🎯 快速查詢命令

```bash
# 查看所有 Keys
doppler secrets --only-names

# 按服務過濾
doppler secrets | grep "GEMINI"
doppler secrets | grep "DEVCYCLE"
doppler secrets | grep "OPENROUTER"
doppler secrets | grep "SUPABASE"

# 統計數量
doppler secrets --only-names | wc -l
```

---

**定期更新**: 每次添加新 Key 後記得更新這個清單! 📝
