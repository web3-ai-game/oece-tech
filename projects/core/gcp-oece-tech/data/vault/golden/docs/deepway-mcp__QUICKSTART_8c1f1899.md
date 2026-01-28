# 開發快速參考

## 🚀 本機開發（推薦）

### 為什麼本機不用 Docker？

**資源對比：**
```
Docker 模式:
- Docker Desktop: ~2GB
- 5 個容器: ~1.8GB
- 總計: ~3.8GB ❌ (對 8GB RAM Mac 壓力大)

原生開發模式:
- 單個服務: ~150-200MB
- 總計: ~500MB ✅ (省 85% RAM)
```

### 一鍵啟動

```bash
./scripts/dev-local.sh
```

選擇要啟動的服務：
1. Web (Next.js 論壇) - 200MB
2. Telegram Bot - 150MB  
3. Forum Backend - 150MB
4. 全部（多終端） - 500MB

### 手動啟動

**Web 前端：**
```bash
cd apps/web
npm install
npm run dev
# http://localhost:3000
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

## 🐳 VPS 部署（容器化）

### 為什麼 VPS 用 Docker？

**生產環境優勢：**
- ✅ 服務隔離，互不干擾
- ✅ 資源限制，防止爆內存
- ✅ 一鍵部署，易於管理
- ✅ Nginx 統一入口，便於監控

### 自動部署

```bash
./scripts/deploy.sh
```

執行流程：
1. 本機 Git commit & push
2. SSH 連接 VPS
3. Pull 最新代碼
4. Doppler 同步 .env
5. Docker Compose 重建容器

### VPS 容器資源

| 服務 | CPU | 記憶體 | 實際佔用 |
|------|-----|--------|---------|
| Nginx | 0.25 | 128MB | 32MB |
| Web | 0.5 | 512MB | 384MB |
| Bot | 0.5 | 512MB | 256MB |
| PostgreSQL | 0.5 | 768MB | 512MB |
| Redis | 0.25 | 256MB | 128MB |
| **總計** | 2.0 | 2176MB | ~1.8GB |

VPS 配置：2vCPU / 4GB RAM，剩餘 ~2.2GB

## 🔑 環境變量管理

### 同步 Gemini 密鑰到 Doppler

```bash
./scripts/sync-gemini-keys-to-doppler.sh
```

上傳內容：
- 2 Router Leaders（優先級最高）
- 23 Work Group Keys（4 組負載均衡）
- 1 合併密鑰（GEMINI_API_KEYS）
- 2 Router 配置

### 下載環境變量

```bash
doppler secrets download --no-file --format env > .env
```

當前配置：
- 項目：`deepway-mcp`
- 配置：`dev`
- 總數：75 個變量（48 基礎 + 27 Gemini）

### Gemini API 密鑰策略

**分組架構：**
```
Router Leaders (2 keys)
    └─ 優先使用，速率 10 RPM/key
    
Work Groups (23 keys)
    ├─ Group A: 6 keys
    ├─ Group B: 6 keys
    ├─ Group C: 6 keys
    └─ Group D: 5 keys
```

**總速率限制：**
- 每個 Key：10 RPM
- 總計：250 RPM（25 keys × 10）
- 每日配額：~360,000 請求

**路由策略：**
1. 先用 Router Leaders
2. Leaders 超限 → 輪詢 Work Groups
3. 組內 Round-robin 負載均衡

## 🔄 三方同步工作流

```
┌─────────────┐
│  本機開發   │ (原生，無 Docker)
│  Mac/Linux  │
└──────┬──────┘
       │ git push
       ↓
┌─────────────┐
│   GitHub    │ (源碼倉庫)
│   Private   │
└──────┬──────┘
       │ git pull
       ↓
┌─────────────┐
│     VPS     │ (容器化部署)
│  2vCPU/4GB  │
└─────────────┘
```

**開發流程：**
```bash
# 1. 本機開發
./scripts/dev-local.sh

# 2. 測試通過
git add .
git commit -m "✨ 新功能"
git push origin main

# 3. 部署到 VPS
./scripts/deploy.sh
```

## 📦 Monorepo 結構

```
deepway-mcp/
├── apps/
│   ├── web/              # Next.js 論壇前端
│   ├── telegram-bot/     # Telegram 機器人 (3個)
│   └── forum-backend/    # 論壇後端 API
├── packages/
│   ├── shared/           # 共享代碼
│   └── config/           # 共享配置
├── docker/
│   └── docker-compose.yml  # VPS 容器編排
└── scripts/
    ├── dev-local.sh                      # 本機開發
    ├── deploy.sh                         # VPS 部署
    └── sync-gemini-keys-to-doppler.sh   # 同步密鑰
```

## 🤖 Telegram 機器人

| Bot | Token 變量 | 功能 |
|-----|-----------|------|
| @svskilo_bot | TELEGRAM_BOT_TOKEN | 主機器人 |
| @svslovea_bot | TELEGRAM_LOVE_BOT_TOKEN | 愛情顧問 |
| @svsinst_bot | TELEGRAM_INST_BOT_TOKEN | 即時通訊 |

## 🛠️ 常用命令

### 本機開發
```bash
# 啟動單個服務
./scripts/dev-local.sh

# 同步環境變量
doppler secrets download --no-file --format env > .env

# 查看 Doppler 配置
doppler secrets
```

### VPS 部署
```bash
# 一鍵部署
./scripts/deploy.sh

# 手動部署
git push origin main
ssh user@vps
cd /mnt/volume_sgp1_01/deepway-mcp
git pull
doppler secrets download --no-file --format env > .env
cd docker
docker-compose up -d --build
```

### Git 操作
```bash
# 查看狀態
git status

# 提交代碼
git add .
git commit -m "描述"
git push origin main

# 查看分支
git branch -a
```

## ❓ 常見問題

**Q: 本機必須用 Docker 嗎？**  
A: 不必須。本機推薦原生開發（Native），省 RAM。VPS 才用 Docker。

**Q: 如何切換環境變量？**  
A: 用 `./manage-env.sh` 或 `doppler secrets download`。

**Q: Gemini 密鑰如何工作？**  
A: 25 個密鑰輪詢使用，突破單 Key 速率限制（10 RPM → 250 RPM）。

**Q: 本機開發需要啟動所有服務嗎？**  
A: 不需要。可以只啟動正在開發的服務，減少資源佔用。

**Q: VPS 如何更新代碼？**  
A: 執行 `./scripts/deploy.sh` 自動化部署，或手動 SSH 登錄後 `git pull`。

**Q: Docker 容器如何查看日誌？**  
A: `docker-compose logs -f <service_name>`（如 `web`、`bot`）。

**Q: 如何停止本機服務？**  
A: 終端按 `Ctrl+C`，或關閉終端窗口。

**Q: Doppler 配置如何備份？**  
A: `doppler secrets download --format json > backup.json`。

## 📚 更多文檔

- [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) - 環境變量詳細管理
- [README.md](./README.md) - 項目總覽
- [apps/telegram-bot/README.md](./apps/telegram-bot/README.md) - Bot 詳細文檔
- [apps/forum-backend/README.md](./apps/forum-backend/README.md) - Backend 文檔

## 🎯 下一步

1. ✅ **本機測試**: `./scripts/dev-local.sh` 啟動服務
2. ✅ **環境同步**: `./scripts/sync-gemini-keys-to-doppler.sh`
3. ⏳ **VPS 部署**: `./scripts/deploy.sh` 部署到生產
4. ⏳ **監控配置**: 設置 Sentry/Datadog 監控
5. ⏳ **CI/CD**: GitHub Actions 自動化部署
