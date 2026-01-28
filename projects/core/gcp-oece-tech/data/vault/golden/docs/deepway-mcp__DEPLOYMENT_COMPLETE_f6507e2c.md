# VPS 部署配置完成總結

## 🎉 所有配置文件已生成

**生成時間**: 2025年1月

**目標**: 從 4v8g VPS ($28/月) 降級到 2v4g VPS ($12/月)，同時優化本機開發體驗（M3 Pro 18GB RAM 使用率從 80% 降至 50%）

---

## 📁 生成的配置文件

### 1. VPS 生產環境配置

#### `docker-compose.prod.yml`
- **用途**: 2v4g VPS 優化的 Docker Compose 配置
- **服務分配**:
  ```
  Gemini Router:    1GB    (CPU: 0.5核)
  PostgreSQL:       1GB    (CPU: 1核)
  Telegram Bots:    768MB  (CPU: 0.5核)
  Redis:            512MB  (CPU: 0.25核)
  Datadog Agent:    512MB  (CPU: 0.25核)
  Nginx:            128MB  (CPU: 0.25核)
  -----------------------------------
  總計:             ~3.9GB / 4GB
  ```
- **特性**:
  - ✅ 所有服務都有健康檢查
  - ✅ Redis 配置 LRU 緩存策略
  - ✅ PostgreSQL 數據持久化
  - ✅ Datadog 完整監控集成
  - ✅ Nginx 反向代理和負載均衡

#### `docker/nginx/nginx.conf`
- **用途**: Nginx 反向代理配置
- **特性**:
  - ✅ HTTP → HTTPS 自動重定向
  - ✅ SSL/TLS 1.2/1.3 支持
  - ✅ Gzip 壓縮（節省帶寬）
  - ✅ API 限流保護（Gemini 100 req/min）
  - ✅ CORS 頭部配置
  - ✅ 靜態資源緩存（1年）
  - ✅ 健康檢查端點 `/health`

### 2. 本機開發配置

#### `apps/web/.env.local.example`
- **用途**: 本機開發環境變量模板
- **配置思路**:
  - 數據庫、Redis、Gemini Router → 指向 VPS（減少本機負擔）
  - Next.js Web 應用 → 本機運行（使用 Windsurf 編輯）
  - 可選：安裝 Postgres.app 和 Redis（Homebrew）用於完全離線開發

- **支持的服務**:
  ```bash
  # VPS 服務
  DATABASE_URL=postgresql://...@vps-ip:5432/deepway
  REDIS_URL=redis://vps-ip:6379
  GEMINI_ROUTER_URL=http://vps-ip:5000

  # 本機替代方案
  DATABASE_URL=postgresql://localhost:5432/deepway  # Postgres.app
  REDIS_URL=redis://localhost:6379                  # brew install redis
  ```

### 3. 自動化部署

#### `.github/workflows/deploy.yml`
- **用途**: GitHub Actions 自動化部署工作流
- **觸發條件**:
  - 推送到 `main` 分支
  - 手動觸發（workflow_dispatch）

- **部署流程**:
  1. **Build Job** (Ubuntu Runner):
     - ✅ 檢出代碼
     - ✅ 安裝 Node.js 20
     - ✅ npm install
     - ✅ TypeScript 類型檢查
     - ✅ 運行測試（如果有）

  2. **Deploy Job** (SSH 到 VPS):
     - ✅ SSH 連接到 VPS
     - ✅ Git pull 最新代碼
     - ✅ Doppler 同步環境變量
     - ✅ Docker Compose 重建服務
     - ✅ 健康檢查（Gemini Router, Redis, PostgreSQL）
     - ✅ 顯示服務狀態和資源使用

  3. **Notify Job** (可選):
     - ✅ Slack 通知（需配置 `SLACK_WEBHOOK_URL`）
     - ✅ Telegram 通知（需配置 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`）

- **必需的 GitHub Secrets**:
  ```
  VPS_HOST              # VPS IP 地址
  VPS_USERNAME          # SSH 用戶名（通常是 root）
  VPS_SSH_KEY           # SSH 私鑰
  SLACK_WEBHOOK_URL     # Slack 通知（可選）
  TELEGRAM_BOT_TOKEN    # Telegram 通知（可選）
  TELEGRAM_CHAT_ID      # Telegram 聊天 ID（可選）
  ```

#### `docs/GITHUB_ACTIONS_SETUP.md`
- **用途**: GitHub Actions 設置詳細指南
- **內容**:
  - ✅ 如何生成和配置 SSH 密鑰
  - ✅ GitHub Secrets 設置步驟
  - ✅ Slack/Telegram 通知配置
  - ✅ 手動部署觸發方法
  - ✅ 故障排除指南
  - ✅ 優化建議（Docker Layer Cache、藍綠部署、回滾機制）

### 4. VPS 遷移腳本

#### `scripts/migrate-to-2v4g.sh`
- **用途**: 從 4v8g VPS 遷移到 2v4g VPS
- **特性**:
  - ✅ 完整的數據備份（PostgreSQL, Redis, Docker Volumes）
  - ✅ Doppler 配置備份
  - ✅ 自動部署新配置
  - ✅ 數據恢復和驗證
  - ✅ 健康檢查（三個核心服務）
  - ✅ 彩色終端輸出

- **遷移步驟**:
  1. 備份 PostgreSQL 數據（pg_dump）
  2. 備份 Redis 數據（dump.rdb）
  3. 備份 Docker Volumes
  4. 導出 Doppler 配置
  5. 停止舊服務
  6. 清理舊數據
  7. 拉取最新代碼
  8. 部署 2v4g 配置
  9. 恢復數據
  10. 驗證服務健康

- **使用方法**:
  ```bash
  # 在 VPS 上運行
  cd ~/deepway-mcp
  ./scripts/migrate-to-2v4g.sh
  ```

### 5. 混合開發策略文檔

#### `DEVELOPMENT_STRATEGY.md`
- **用途**: 完整的混合本機+VPS 開發策略
- **內容**:
  - ✅ 用戶情況分析（M3 Pro 18GB @ 80%，Windsurf 主力工具）
  - ✅ 3種部署方案對比
  - ✅ RAM 優化方案（80% → 50%）
  - ✅ VPS 成本對比（$28 → $12，節省 57%）
  - ✅ 本機開發工作流（Postgres.app, Redis, 原生工具）
  - ✅ VPS 服務配置（Gemini Router, Telegram Bots, Datadog）
  - ✅ 遷移時間表（2週計劃）
  - ✅ Windsurf 優化設置
  - ✅ Datadog 監控配置

---

## 🚀 下一步行動

### 步驟 1: 設置 GitHub Actions（5分鐘）

1. **生成 SSH 密鑰**（如果還沒有）:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@deepway-mcp"
   ```

2. **複製公鑰到 VPS**:
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub root@your.vps.ip
   ```

3. **在 GitHub 添加 Secrets**:
   - 前往: `https://github.com/web3-ai-game/deepway-mcp/settings/secrets/actions`
   - 添加:
     - `VPS_HOST`: VPS IP 地址
     - `VPS_USERNAME`: `root`
     - `VPS_SSH_KEY`: 私鑰內容（`cat ~/.ssh/id_ed25519`）

4. **測試自動部署**:
   ```bash
   git commit --allow-empty -m "test: GitHub Actions 部署測試"
   git push origin main
   ```
   - 查看: `https://github.com/web3-ai-game/deepway-mcp/actions`

### 步驟 2: 配置本機開發環境（10分鐘）

#### 方案 A: 完全本機（推薦，減少 RAM 壓力）

```bash
# 1. 安裝 Postgres.app
brew install --cask postgres

# 2. 安裝 Redis
brew install redis
brew services start redis

# 3. 創建本機環境變量
cd ~/Documents/Git/deepway-mcp/apps/web
cp .env.local.example .env.local

# 4. 編輯 .env.local（使用本機服務）
# DATABASE_URL=postgresql://postgres@localhost:5432/deepway
# REDIS_URL=redis://localhost:6379

# 5. 啟動 Web 應用
npm run dev
```

#### 方案 B: 混合模式（VPS 數據庫 + 本機 Web）

```bash
# 1. 創建環境變量
cd ~/Documents/Git/deepway-mcp/apps/web
cp .env.local.example .env.local

# 2. 編輯 .env.local（指向 VPS）
# DATABASE_URL=postgresql://postgres:your-password@your.vps.ip:5432/deepway
# REDIS_URL=redis://your.vps.ip:6379
# GEMINI_ROUTER_URL=http://your.vps.ip:5000

# 3. 啟動 Web 應用
npm run dev
```

### 步驟 3: VPS 遷移（30分鐘 - 下個月1號前）

```bash
# 1. SSH 到當前 4v8g VPS
ssh root@your.vps.ip

# 2. 運行遷移腳本
cd ~/deepway-mcp
./scripts/migrate-to-2v4g.sh

# 3. 等待完成（約 15-20 分鐘）
# 腳本會自動：
# - 備份所有數據
# - 部署新配置
# - 恢復數據
# - 驗證健康

# 4. 驗證服務
docker-compose -f docker-compose.prod.yml ps
docker stats

# 5. 測試功能
curl http://localhost:5000/health  # Gemini Router
# 測試 Telegram Bots
# 測試網站訪問
```

### 步驟 4: 移除本機 Docker Desktop（可選，節省 2GB RAM）

```bash
# 1. 備份重要容器數據（如果有）

# 2. 卸載 Docker Desktop
# 系統偏好設定 → Docker → Uninstall

# 3. 清理殘留文件
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker

# 4. 檢查 RAM 使用（應該降低到 50% 左右）
```

### 步驟 5: 配置監控（可選）

#### Datadog（你已訂閱）

VPS 上 Datadog Agent 已在 `docker-compose.prod.yml` 中配置，只需添加 API Key：

```bash
# 在 Doppler 添加
doppler secrets set DATADOG_API_KEY your-datadog-api-key --project deepway-mcp --config dev
```

#### Sentry（你已訂閱）

本機 Web 應用添加 Sentry：

```bash
# 在 apps/web/.env.local 添加
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

---

## 📊 成本和性能對比

### 月度成本

| 項目 | 當前 (4v8g) | 優化後 (2v4g) | 節省 |
|------|------------|--------------|------|
| VPS | $28 | $12 | -$16 (-57%) |
| Doppler | $0 (免費層) | $0 | $0 |
| Datadog | $15 | $15 | $0 |
| Sentry | $26 | $26 | $0 |
| **總計** | **$69** | **$53** | **-$16/月** |

**年度節省**: $192

### RAM 使用對比

| 環境 | 當前 | 優化後 | 改善 |
|------|------|--------|------|
| **Mac M3 Pro** | 14.4GB / 18GB (80%) | 9GB / 18GB (50%) | -5.4GB (-30%) |
| **VPS** | 4.5GB / 8GB (56%) | 3.9GB / 4GB (97%) | +0.6GB 利用率提升 |

### 性能預期

- ✅ **本機開發**: 移除 Docker Desktop 後，Windsurf + Next.js 流暢運行
- ✅ **VPS 服務**: Gemini Router 響應時間 < 100ms（25個 API Keys 輪詢）
- ✅ **網絡延遲**: 泰國 → 新加坡 VPS: 30-50ms（可接受）
- ✅ **數據庫查詢**: PostgreSQL 1GB RAM 足夠小型應用（< 1000 並發）

---

## 🔒 安全檢查清單

### VPS 安全

- [ ] SSH 密鑰認證（禁用密碼登錄）
- [ ] 防火牆配置（僅開放 22, 80, 443）
- [ ] Fail2ban 防暴力破解
- [ ] 定期系統更新（`apt update && apt upgrade`）
- [ ] Docker 容器隔離（網絡、資源限制）
- [ ] Nginx 限流配置（防 DDoS）
- [ ] SSL/TLS 證書（Let's Encrypt）

### 環境變量安全

- [ ] Doppler 環境變量加密存儲
- [ ] `.env` 文件添加到 `.gitignore`
- [ ] GitHub Secrets 僅在 Actions 中訪問
- [ ] 定期輪換敏感密鑰（每 90 天）
- [ ] 使用 Service Role Keys（不要用個人 API Keys）

### 監控和告警

- [ ] Datadog 設置告警（CPU > 80%, RAM > 90%）
- [ ] Sentry 錯誤通知（Telegram 集成）
- [ ] Uptime 監控（healthchecks.io 或 UptimeRobot）
- [ ] 日誌聚合（Datadog Logs）

---

## 📚 相關文檔

- [DEVELOPMENT_STRATEGY.md](./DEVELOPMENT_STRATEGY.md) - 混合開發策略詳解
- [GITHUB_ACTIONS_SETUP.md](./docs/GITHUB_ACTIONS_SETUP.md) - GitHub Actions 設置指南
- [VPS_15_DAYS_PLAN.md](./VPS_15_DAYS_PLAN.md) - VPS 使用方案建議
- [DEV_SETUP_COMPLETE.md](./DEV_SETUP_COMPLETE.md) - 開發環境設置完成報告
- [QUICKSTART.md](./QUICKSTART.md) - 快速開發參考

---

## 🆘 故障排除

### 問題 1: GitHub Actions 部署失敗

**症狀**: SSH 連接超時或拒絕

**解決方案**:
```bash
# 測試 SSH 連接
ssh -v root@your.vps.ip

# 檢查防火牆
sudo ufw status

# 確保 22 端口開放
sudo ufw allow 22
```

### 問題 2: VPS 內存不足

**症狀**: 服務重啟或 OOM (Out of Memory)

**解決方案**:
```bash
# 查看內存使用
free -h
docker stats

# 減少服務數量或調整限制
# 編輯 docker-compose.prod.yml
# 降低 mem_limit 或停止非關鍵服務
```

### 問題 3: Gemini Router 無響應

**症狀**: `/health` 端點返回 500 或超時

**解決方案**:
```bash
# 查看日誌
docker-compose -f docker-compose.prod.yml logs gemini-router

# 檢查 Gemini API Keys
doppler secrets get GEMINI_API_KEYS --project deepway-mcp --config dev

# 重啟服務
docker-compose -f docker-compose.prod.yml restart gemini-router
```

### 問題 4: 本機 RAM 仍然過高

**症狀**: 移除 Docker 後 RAM 使用仍 > 70%

**解決方案**:
```bash
# 檢查進程
top -o MEM

# 關閉不必要的應用
# 重啟 Windsurf（釋放緩存）

# 清理 Node.js 緩存
npm cache clean --force

# 清理 Next.js 構建
cd apps/web
rm -rf .next
```

---

## ✅ 最終檢查

在開始遷移前，確認以下事項：

- [ ] 已閱讀 `DEVELOPMENT_STRATEGY.md`
- [ ] 已生成並配置 SSH 密鑰
- [ ] 已在 GitHub 添加所需的 Secrets
- [ ] 已在本機測試 `.env.local` 配置
- [ ] 已在 VPS 備份當前數據（`/root/vps-backup-*`）
- [ ] 已了解遷移腳本的執行流程
- [ ] 已準備好回滾方案（保留 4v8g VPS 至少 7 天）
- [ ] 已測試 GitHub Actions 自動部署（允許空提交）

---

**祝部署順利！** 🎊

如有問題，參考文檔或聯繫技術支持。

---

**生成者**: GitHub Copilot  
**版本**: 1.0  
**最後更新**: 2025年1月
