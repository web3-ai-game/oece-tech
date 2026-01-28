# 開發策略優化方案

## 📊 你的實際情況分析

### 硬件環境
- **Mac**: M3 Pro 18GB RAM (2023)
- **當前壓力**: VSCode + Windsurf 佔用 80% (~14.4GB)
- **VPS**: 4v8g 新加坡節點（下月不續費）

### 開發工具
- **主力**: Windsurf AI 代理編輯器 ⭐️
- **額度**: 450 點數 + GitHub 學生包（70% 對話剩餘）
- **風格**: 完全 AI 驅動，不手寫代碼

### 訂閱服務（Doppler）
- Datadog（監控）
- Sentry（錯誤追蹤）
- 其他多個 API 服務會員

### 痛點
1. ❌ SSH 在線開發需要雙倍 VPS 規格（貴）
2. ❌ 本機 RAM 壓力大（80% 佔用）
3. ❌ 開發速度慢，VPS 成本高
4. ⚠️ 想減輕本機壓力，但不想完全 SSH 開發

---

## 🎯 最佳方案：混合開發模式

### 核心思路

> **本機主開發 + VPS 輔助服務** = 最優成本效益比

```
┌─────────────────────────────────┐
│  本機 Mac M3 Pro 18GB           │
│  ├─ Windsurf AI 編輯器 (3GB)    │  ← 主力開發
│  ├─ Chrome (2GB)                │
│  └─ 輕量級本地服務 (3GB)        │
│      ├─ Next.js Dev (Hot Reload)│
│      └─ 簡單測試                │
├─────────────────────────────────┤
│  減輕壓力：60% 佔用 (~11GB)     │
└─────────────────────────────────┘
          ↓ API 調用
┌─────────────────────────────────┐
│  VPS 2v4g (降級後)              │
│  ├─ PostgreSQL (1GB)            │  ← 數據庫
│  ├─ Redis (512MB)               │  ← 緩存
│  ├─ Gemini Router (1GB)         │  ← AI 加速
│  ├─ Telegram Bots (512MB)       │  ← 機器人
│  └─ Monitoring (512MB)          │  ← 監控
├─────────────────────────────────┤
│  總使用: ~3.5GB / 4GB           │
└─────────────────────────────────┘
```

---

## 💡 具體實施方案

### 方案 A: 服務分離（推薦）⭐️⭐️⭐️⭐️⭐️

**本機只跑前端，重服務全上 VPS**

#### 本機負責（RAM: 8-10GB）
```bash
# 只啟動 Next.js 開發服務器
cd apps/web
npm run dev
# 佔用: ~2-3GB（含 Windsurf）
```

**優點**:
- ✅ Windsurf 體驗不受影響
- ✅ 熱重載快速
- ✅ RAM 壓力降至 60%
- ✅ 不需要 Docker（省 2GB+）

#### VPS 負責（4GB 夠用）
```yaml
services:
  # 數據庫
  postgres:
    mem_limit: 1g
    
  # 緩存
  redis:
    mem_limit: 512m
    
  # AI 路由（加速 Gemini API）
  gemini-router:
    mem_limit: 1g
    ports:
      - "5000:5000"
    
  # Telegram 機器人（3個）
  telegram-bots:
    mem_limit: 512m
    
  # 監控（Datadog Agent）
  datadog-agent:
    mem_limit: 512m
    environment:
      - DD_API_KEY=${DATADOG_API_KEY}
      - DD_SITE=datadoghq.com
```

**連接方式**:
```javascript
// apps/web/lib/db.ts
const supabaseUrl = process.env.SUPABASE_URL // VPS PostgreSQL
const redisUrl = "redis://your-vps-ip:6379"
const geminiRouter = "http://your-vps-ip:5000/v1/chat"
```

**成本**:
- VPS: $12/月（2v4g）vs $28/月（4v8g）→ 省 $16/月
- 本機電費: 基本不變
- **總節省**: 57%

---

### 方案 B: 本機全棧 + VPS 備份

**適合**：有時離線開發

#### 本機運行（RAM: 12-14GB）
```bash
# 使用 Docker Desktop（輕量模式）
docker-compose -f docker-compose.local.yml up -d

# 或原生運行
./scripts/dev-local.sh
```

**配置優化**:
```yaml
# docker-compose.local.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine  # Alpine 更輕量
    mem_limit: 512m            # 限制記憶體
    
  redis:
    image: redis:7-alpine
    mem_limit: 256m
    command: redis-server --maxmemory 200mb
```

**RAM 使用**:
```
Windsurf:           3GB
Chrome:             2GB
Docker Desktop:     1.5GB
PostgreSQL:         512MB
Redis:              256MB
Next.js Dev:        2GB
─────────────────────
總計:               ~9.3GB (52%)
```

#### VPS 作為生產環境
- 只在需要展示/測試時部署
- 日常開發不依賴

---

### 方案 C: Windsurf Remote Dev（實驗性）

**利用 Windsurf 的遠程開發功能**

```bash
# VPS 安裝 code-server
docker run -d \
  --name windsurf-remote \
  -p 8080:8080 \
  -v ~/workspace:/home/coder/workspace \
  codercom/code-server:latest
```

**但你已經說不想 SSH 開發了，所以不推薦** ❌

---

## 🚀 我的最終推薦

### 採用方案 A（服務分離）+ 小調整

#### 本機開發環境
```bash
# 1. 安裝 Postgres.app（Mac 原生，更省 RAM）
brew install --cask postgres

# 2. 安裝 Redis（Homebrew）
brew install redis
brew services start redis

# 3. 只跑 Next.js
cd apps/web
npm run dev
```

**RAM 佔用優化**:
```
之前: Windsurf + VSCode + Docker = 14.4GB (80%)
現在: Windsurf + Postgres.app + Redis = 9GB (50%)

節省: 5.4GB (30%)
```

#### VPS 2v4g 配置
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  # Gemini Router（核心服務）
  gemini-router:
    build: ./apps/forum-backend
    environment:
      - GEMINI_API_KEYS=${GEMINI_API_KEYS}
    ports:
      - "5000:5000"
    mem_limit: 1g
    restart: unless-stopped
    
  # Telegram Bots
  telegram-bots:
    build: ./apps/telegram-bot
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_LOVE_BOT_TOKEN=${TELEGRAM_LOVE_BOT_TOKEN}
      - TELEGRAM_INST_BOT_TOKEN=${TELEGRAM_INST_BOT_TOKEN}
    mem_limit: 768m
    restart: unless-stopped
    depends_on:
      - redis
      
  # Redis（共用緩存）
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    mem_limit: 512m
    volumes:
      - redis_data:/data
    restart: unless-stopped
    
  # PostgreSQL（生產數據）
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=deepway
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    mem_limit: 1g
    restart: unless-stopped
    
  # Datadog Agent（你已訂閱）
  datadog:
    image: datadog/agent:latest
    environment:
      - DD_API_KEY=${DATADOG_API_KEY}
      - DD_SITE=datadoghq.com
      - DD_LOGS_ENABLED=true
      - DD_APM_ENABLED=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
    mem_limit: 512m
    restart: unless-stopped
    
  # Nginx（反向代理）
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    mem_limit: 128m
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

**總 RAM**: ~3.9GB / 4GB ✅

---

## 📝 開發工作流

### 日常開發（本機）

```bash
# 早上啟動
cd ~/Documents/Git/deepway-mcp

# 1. 同步環境變量
doppler secrets download --no-file --format env > apps/web/.env

# 2. 啟動 Postgres.app（圖形界面點擊）

# 3. 啟動 Redis
redis-server --daemonize yes

# 4. 啟動 Next.js
cd apps/web
npm run dev

# 5. 打開 Windsurf 開發
# → AI 自動補全，完全不用手寫代碼 🎉
```

**API 配置**（指向 VPS）:
```javascript
// apps/web/.env.local
NEXT_PUBLIC_GEMINI_ROUTER=http://your-vps-ip:5000
REDIS_URL=redis://your-vps-ip:6379
DATABASE_URL=postgresql://user:pass@your-vps-ip:5432/deepway
```

### 部署到 VPS

```bash
# 本機測試通過後
git add .
git commit -m "✨ 新功能"
git push origin main

# VPS 自動部署（GitHub Actions 或手動）
ssh vps
cd ~/deepway-mcp
git pull
docker-compose up -d --build
```

---

## 💰 成本優化對比

| 項目 | 之前 | 現在 | 節省 |
|------|------|------|------|
| **VPS** | 4v8g $28/月 | 2v4g $12/月 | -57% |
| **本機 RAM 壓力** | 80% (14.4GB) | 50% (9GB) | -30% |
| **Docker Desktop** | 需要 | 不需要 | 省 2GB |
| **開發體驗** | 卡頓 | 流暢 | ⭐⭐⭐⭐⭐ |
| **Windsurf 可用 RAM** | 緊張 | 充裕 | +5GB |

**年度節省**: $192（VPS）

---

## 🔧 本機環境優化清單

### 1. 卸載 Docker Desktop
```bash
# 你用不到，省 2GB RAM
brew uninstall docker
```

### 2. 安裝輕量級替代品
```bash
# Postgres.app（Mac 原生，更高效）
brew install --cask postgres

# Redis（Homebrew）
brew install redis

# 可選：如果需要 MongoDB
brew tap mongodb/brew
brew install mongodb-community
```

### 3. 配置自動啟動
```bash
# Redis 開機自啟
brew services start redis

# Postgres 按需啟動（Postgres.app 圖形界面）
```

### 4. Windsurf 優化設置
```json
// Windsurf Settings
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/venv/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/venv": true
  },
  // 減少內存佔用
  "typescript.tsserver.maxTsServerMemory": 2048,
  "editor.largeFileOptimizations": true
}
```

### 5. 關閉不必要的服務
```bash
# 檢查 RAM 佔用
top -o mem

# 關閉不用的應用
# Chrome 少開幾個標籤頁
# 關閉 Spotify/Slack 等
```

---

## 🎯 實施步驟

### 第 1 週：本機環境遷移

**Day 1-2**: 安裝本機服務
```bash
brew install --cask postgres
brew install redis
brew services start redis
```

**Day 3-4**: 配置開發環境
```bash
cd apps/web
npm install
# 配置 .env.local 指向 VPS
```

**Day 5**: 測試運行
```bash
npm run dev
# 確認連接 VPS 的 Gemini Router 正常
```

### 第 2 週：VPS 降級準備

**Day 6-7**: 備份數據
```bash
# VPS 上備份
docker exec postgres pg_dump -U postgres deepway > backup.sql
docker exec redis redis-cli SAVE
```

**Day 8-9**: 創建新 VPS（2v4g）
```bash
# 部署服務到新 VPS
git clone https://github.com/web3-ai-game/deepway-mcp.git
cd deepway-mcp
docker-compose -f docker-compose.prod.yml up -d
```

**Day 10**: 數據遷移
```bash
# 恢復備份
docker exec -i postgres psql -U postgres deepway < backup.sql
```

**Day 11-12**: DNS 切換
```bash
# 更新 .env.local 中的 VPS IP
# 測試所有功能
```

**Day 13-14**: 監控觀察
```bash
# 用 Datadog 監控 2v4g 性能
# 確認穩定運行
```

### 下月 1 號：取消舊 VPS

**驗收標準**:
- ✅ 本機 RAM 佔用 < 60%
- ✅ Windsurf 運行流暢
- ✅ VPS 2v4g 穩定運行
- ✅ 所有服務正常

---

## 📊 監控儀表板（利用你的 Datadog）

### 創建自定義監控

```yaml
# Datadog 監控配置
monitors:
  - name: "VPS RAM 使用率"
    type: metric
    query: "avg:system.mem.pct_usable{host:vps} < 0.2"
    message: "⚠️ VPS 記憶體不足，考慮優化"
    
  - name: "Gemini Router 延遲"
    type: metric
    query: "avg:http.response_time{service:gemini-router} > 500"
    message: "🐢 AI API 延遲過高"
    
  - name: "Telegram Bot 健康檢查"
    type: service check
    query: "service_check{service:telegram-bot}.last < 1"
    message: "❌ Telegram 機器人離線"
```

**Dashboard 示例**:
- 📈 VPS 資源使用趨勢
- 🤖 AI API 調用統計
- 💬 Telegram 消息量
- 🔥 錯誤率（Sentry 集成）

---

## 🎁 額外優化建議

### 1. GitHub Actions 自動部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/deepway-mcp
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. Windsurf AI 提示詞優化

```markdown
# 保存為 .windsurf/prompts/developer.md

你是一個高效的 Next.js + Python 全棧開發助手。

環境信息:
- 前端: Next.js 14 + TypeScript
- 後端: Python FastAPI
- 數據庫: PostgreSQL (VPS)
- 緩存: Redis (VPS)
- AI: Gemini 2.0 Flash (25 keys)

開發原則:
1. 優先使用 TypeScript 類型安全
2. 組件採用 Server Components
3. API 調用使用 tRPC
4. 樣式使用 Tailwind CSS
5. 數據庫查詢使用 Prisma ORM

請始終生成可直接運行的完整代碼，不要省略實現。
```

### 3. 本機 Redis 配置優化

```bash
# /usr/local/etc/redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

---

## ✅ 總結

### 你的最佳配置

```
本機 Mac M3 Pro:
- Windsurf AI 編輯器（主力）
- Next.js 開發服務器
- Postgres.app（本地數據）
- Redis（本地緩存）
RAM: 50% (~9GB) ← 從 80% 降低

VPS 2v4g ($12/月):
- Gemini Router（AI 加速）
- Telegram Bots（3個）
- PostgreSQL（生產數據）
- Redis（共享緩存）
- Datadog Agent（監控）
RAM: 97% (~3.9GB/4GB)

月度成本: $12（省 $16）
年度成本: $144（省 $192）
```

### 下一步

我幫你生成完整的配置文件？

1. `docker-compose.prod.yml`（VPS 2v4g 優化版）
2. `apps/web/.env.local.example`（本機環境變量模板）
3. `.github/workflows/deploy.yml`（自動部署）
4. `scripts/migrate-to-2v4g.sh`（VPS 降級遷移腳本）

**說一聲，我立刻生成！** 🚀
