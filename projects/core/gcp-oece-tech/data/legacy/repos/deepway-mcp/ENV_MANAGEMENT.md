# 環境變量管理指南

## 📋 目錄

- [Doppler 同步](#doppler-同步)
- [本機開發模式](#本機開發模式)
- [VPS 容器化模式](#vps-容器化模式)
- [Gemini API 密鑰管理](#gemini-api-密鑰管理)
- [三方同步工作流](#三方同步工作流)

## 📁 文件說明

| 文件 | 變量數 | 說明 | 推薦場景 |
|------|--------|------|----------|
| `.env.minimal` | 19個 | 精簡版，只保留核心功能 | ✅ **新項目推薦** |
| `.env.organized` | 59個 | 完整版，所有服務分類整理 | 需要完整功能 |
| `.env` | 75個 | 當前使用的配置（48 基礎 + 27 Gemini） | Doppler 同步 |
| `manage-env.sh` | - | 環境管理腳本 | 快速切換配置 |

## 🚀 快速開始

### 方法 1: 使用管理腳本（推薦）

```bash
./manage-env.sh
```

腳本會引導您：
- 選擇配置版本
- 自動備份當前配置
- 查看配置對比
- 從 Doppler 同步

### 方法 2: 手動切換

```bash
# 使用精簡版（推薦）
cp .env.minimal .env

# 或使用完整版
cp .env.organized .env
```

## 📊 配置對比

### 精簡版 (.env.minimal) - 19 個變量

**包含服務：**
- ✅ Supabase 數據庫（免費）
- ✅ Gemini AI（免費）
- ✅ Sentry 錯誤追蹤（免費）
- ✅ GitHub 集成
- ✅ 基本安全配置

**優點：**
- 配置簡單，易於管理
- 所有服務都有免費層級
- 適合小型項目和快速開發

**月成本：** $0 （全部使用免費服務）

### 完整版 (.env.organized) - 59 個變量

**額外包含：**
- 多個 AI 服務（OpenAI, Anthropic, OpenRouter）
- 3 個 Telegram Bots
- 高級監控（Datadog, Honeybadger）
- 開發工具（Notion, Deepnote, PoEditor）
- DigitalOcean 雲服務

**優點：**
- 功能完整，服務豐富
- 有備用服務保證可用性
- 適合大型項目

**月成本：** $50-200+ （視使用量）

## 🎯 推薦配置

### 真菌社區項目（deepway-mcp）

**階段 1: 開發初期** ← 您在這裡
```bash
使用：.env.minimal
理由：快速開發，零成本，功能足夠
```

**階段 2: 用戶增長**
```bash
使用：.env.minimal + 按需添加
添加：OpenAI (提升 AI 質量)
添加：Datadog (性能監控)
```

**階段 3: 規模化**

```bash
使用：.env.organized
理由：需要完整監控和備用服務
```

## Doppler 同步

### 當前配置

- **項目**: `deepway-mcp`
- **配置**: `dev`
- **總密鑰數**: 75 個（48 基礎 + 27 Gemini）

### 同步 Gemini 密鑰到 Doppler

```bash
./scripts/sync-gemini-keys-to-doppler.sh
```

這會上傳 27 個 Gemini 相關密鑰：
- 2 個 Router Leaders
- 23 個 Work Group Keys（分 4 組）
- 1 個合併的 `GEMINI_API_KEYS`（逗號分隔）
- 1 個 Router 策略配置

### 下載環境變量到本機

```bash
doppler secrets download --no-file --format env > .env
```

## 本機開發模式

### 💡 為什麼本機不用 Docker？

**RAM 資源考量：**
- Docker Desktop on macOS 基礎佔用：~2GB
- 5 個容器運行：~1.8GB
- **總計：~3.8GB** 對於 8GB RAM 的 Mac 壓力較大

**本機原生開發優勢：**
- ✅ 零 Docker 開銷
- ✅ 直接使用系統 Node.js/Python
- ✅ 熱重載更快
- ✅ 調試更方便
- ✅ 可單獨啟動需要的服務

### 啟動本機開發

```bash
./scripts/dev-local.sh
```

選項：
1. 只啟動 Web (Next.js) - 佔用 ~200MB
2. 只啟動 Telegram Bot - 佔用 ~150MB
3. 只啟動 Forum Backend - 佔用 ~150MB
4. 全部啟動（多終端）- 總計 ~500MB

### 手動啟動單個服務

**Web 前端：**

```bash
cd apps/web
npm install
npm run dev
# 訪問 http://localhost:3000
```

**Telegram Bot：**

```bash
cd apps/telegram-bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python multi_bot_v3.py
```

**Forum Backend：**

```bash
cd apps/forum-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python bot.py
```

## VPS 容器化模式

### 🐳 為什麼 VPS 用 Docker？

**生產環境優勢：**
- ✅ 隔離性：服務互不干擾
- ✅ 資源限制：防止單個服務佔用過多資源
- ✅ 易部署：一鍵啟動所有服務
- ✅ 可擴展：容易水平擴展
- ✅ 監控：Nginx 統一入口，便於日誌分析

**VPS 配置：**
- 2vCPU / 4GB RAM
- 外部卷掛載：`/mnt/volume_sgp1_01/`

### VPS 部署

```bash
./scripts/deploy.sh
```

自動執行：
1. 本機 Git commit & push
2. SSH 到 VPS
3. Pull 最新代碼
4. 從 Doppler 同步 .env
5. Docker Compose 重建容器

### 容器資源分配

| 服務 | CPU 限制 | 記憶體限制 | 實際佔用 |
|------|---------|-----------|---------|
| Nginx | 0.25 | 128MB | ~32MB |
| Web | 0.5 | 512MB | ~384MB |
| Bot | 0.5 | 512MB | ~256MB |
| PostgreSQL | 0.5 | 768MB | ~512MB |
| Redis | 0.25 | 256MB | ~128MB |
| **總計** | **2.0** | **2176MB** | **~1.8GB** |

剩餘 ~2.2GB 供系統使用。

## Gemini API 密鑰管理

### 密鑰分組策略

**Router Leaders（優先級最高）：**
- `GEMINI_ROUTER_LEADER_1`
- `GEMINI_ROUTER_LEADER_2`

**Work Groups（負載均衡）：**
- Group A: 6 keys
- Group B: 6 keys
- Group C: 6 keys
- Group D: 5 keys

### 使用方式

**方式 1：使用分組密鑰（推薦）**

```python
# 在 Python 代碼中
import os

leader_1 = os.getenv('GEMINI_ROUTER_LEADER_1')
leader_2 = os.getenv('GEMINI_ROUTER_LEADER_2')
group_a_keys = [
    os.getenv(f'GEMINI_GROUP_A_KEY_{i}') 
    for i in range(1, 7)
]
```

**方式 2：使用合併密鑰**

```python
all_keys = os.getenv('GEMINI_API_KEYS').split(',')
# 25 個密鑰的列表
```

### 速率限制

- 每個 Key：10 RPM（每分鐘請求數）
- 總計：250 RPM（25 keys × 10）
- 每日配額：~360,000 請求（25 keys × 15k/天）

### Router 策略

```bash
GEMINI_ROUTER_STRATEGY=priority
GEMINI_MAX_RPM_PER_KEY=10
```

優先級路由：
1. 先用 Router Leaders
2. Leaders 超限時，輪詢 Work Groups
3. 組內 Round-robin 負載均衡

## 三方同步工作流

### 本機 → GitHub → VPS

```
本機開發（Native）
    ↓ git push
GitHub（源碼倉庫）
    ↓ VPS git pull
VPS（Docker容器）
```

**開發流程：**

```bash
# 1. 本機開發（不用 Docker）
./scripts/dev-local.sh

# 2. 測試通過後提交
git add .
git commit -m "✨ 新功能"
git push origin main

# 3. 部署到 VPS（用 Docker）
./scripts/deploy.sh
```

## 常見問題

### Q: 本機必須使用 Docker 嗎？

A: 不必須。本機推薦原生開發（Native），更省資源。VPS 才用 Docker。

### Q: Doppler 密鑰如何同步？

A: 本機和 VPS 都用 `doppler secrets download` 下載，確保一致。

### Q: 為什麼有 25 個 Gemini 密鑰？

A: 免費版每個 Key 有速率限制，多 Key 輪詢可以突破限制。

### Q: 可以只啟動一個服務嗎？

A: 可以。用 `dev-local.sh` 選擇單個服務，或手動進入 `apps/*/` 啟動。

### Q: VPS 如何更新代碼？

A: 執行 `./scripts/deploy.sh` 自動 Git pull + Docker rebuild。

## 🔧 Doppler 管理

### 查看當前配置

```bash
# 查看項目和環境
doppler setup

# 列出所有變量
doppler secrets
```

### 上傳精簡配置到 Doppler

```bash
# 將精簡版上傳到 Doppler（清理雲端配置）
doppler secrets upload .env.minimal
```

⚠️ **注意**: 這會覆蓋 Doppler 中的配置

### 創建新的 Doppler 配置

推薦為這個項目創建獨立配置：

```bash
# 創建新配置
doppler configs create deepway-dev --project svs-api-key-all

# 切換到新配置
doppler setup --config deepway-dev

# 上傳精簡配置
doppler secrets upload .env.minimal
```

## 📋 環境變量清單

### 必需配置（不能刪除）

```bash
# 數據庫
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# 安全
JWT_SECRET
SESSION_SECRET

# AI
GEMINI_API_KEY
```

### 可選配置

| 服務 | 環境變量 | 免費額度 | 月成本 |
|------|----------|----------|--------|
| OpenAI | `OPENAI_API_KEY` | $5 試用 | $10-50 |
| Datadog | `DD_API_KEY`, `DD_APP_KEY` | 14天試用 | $15+ |
| Telegram Bot | `TELEGRAM_BOT_*` | 完全免費 | $0 |
| DigitalOcean | `DO_API_KEY` | $200 試用 | $5+ |

## 🔄 同步策略

### 本地 → Doppler

```bash
# 上傳當前配置
doppler secrets upload .env
```

### Doppler → 本地

```bash
# 下載最新配置
doppler secrets download --no-file --format env > .env
```

### 自動同步

在 `.bashrc` 或 `.zshrc` 添加：

```bash
alias env-sync='doppler secrets download --no-file --format env > .env'
alias env-push='doppler secrets upload .env'
```

## 🛡️ 安全建議

1. **永遠不要提交 `.env` 到 Git**
   ```bash
   # 確保在 .gitignore 中
   echo ".env*" >> .gitignore
   echo "!.env.example" >> .gitignore
   ```

2. **定期輪換密鑰**
   - JWT_SECRET: 每 90 天
   - API Keys: 每 180 天

3. **使用 Doppler 管理敏感信息**
   - 團隊成員通過 Doppler 獲取密鑰
   - 不通過消息傳遞密鑰

4. **生產環境使用獨立密鑰**
   ```bash
   # 為生產環境創建單獨配置
   doppler configs create deepway-prd --project svs-api-key-all
   ```

## 📞 常見問題

### Q: 如何知道我需要哪些環境變量？

A: 從 `.env.minimal` 開始，運行項目時如果缺少變量會報錯，再從 `.env.organized` 添加。

### Q: Doppler 中的變量太多了怎麼辦？

A: 
1. 使用 `manage-env.sh` 選擇精簡版
2. 運行 `doppler secrets upload .env.minimal` 覆蓋雲端配置
3. 或創建新的 Doppler 配置專門給這個項目

### Q: 如何區分開發和生產環境？

A:
```bash
# 開發環境
doppler setup --config dev

# 生產環境
doppler setup --config prd
```

### Q: 可以刪除 Telegram Bot 相關變量嗎？

A: 可以！如果項目不需要 Telegram 機器人功能，完全可以刪除所有 `TELEGRAM_BOT_*` 變量。

## 🎓 學習資源

- [Doppler 官方文檔](https://docs.doppler.com/)
- [環境變量最佳實踐](https://12factor.net/config)
- [Supabase 環境配置](https://supabase.com/docs/guides/getting-started/local-development)

---

**需要幫助？** 運行 `./manage-env.sh` 使用交互式管理工具
