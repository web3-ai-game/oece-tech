# GitHub Actions 部署配置指南

## 必需的 GitHub Secrets

在 GitHub 倉庫設置中添加以下 Secrets（Settings → Secrets and variables → Actions → New repository secret）：

### 1. VPS 連接信息

```bash
# VPS IP 地址或域名
VPS_HOST=your.vps.ip.address

# SSH 用戶名（通常是 root）
VPS_USERNAME=root

# SSH 私鑰
VPS_SSH_KEY=<貼上你的私鑰內容>
```

#### 如何獲取 SSH 私鑰：

在本機（Mac）運行：

```bash
# 生成新的 SSH 密鑰對（如果還沒有）
ssh-keygen -t ed25519 -C "github-actions@deepway-mcp"

# 查看私鑰（複製完整內容到 GitHub Secrets）
cat ~/.ssh/id_ed25519

# 複製公鑰到 VPS
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@your.vps.ip
```

### 2. 通知配置（可選）

#### Slack 通知：

```bash
# Slack Webhook URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

獲取 Slack Webhook：
1. 前往 https://api.slack.com/apps
2. 創建新應用 → Incoming Webhooks
3. 激活 Incoming Webhooks
4. Add New Webhook to Workspace
5. 選擇頻道 → 複製 Webhook URL

#### Telegram 通知：

```bash
# Bot Token（使用現有的 @svskilo_bot）
TELEGRAM_BOT_TOKEN=your-bot-token

# Chat ID（你的 Telegram 用戶 ID）
TELEGRAM_CHAT_ID=your-chat-id
```

獲取 Chat ID：
1. 發送任意消息給你的 Bot
2. 訪問：`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. 找到 `"chat":{"id":123456789}` → 這就是你的 Chat ID

## 使用方法

### 自動部署（推送觸發）

```bash
# 在本機提交代碼
git add .
git commit -m "feat: 新功能"
git push origin main

# GitHub Actions 會自動：
# 1. 測試代碼
# 2. SSH 到 VPS
# 3. 拉取最新代碼
# 4. 重啟 Docker 服務
# 5. 發送通知
```

### 手動部署

1. 前往 GitHub 倉庫
2. Actions → Deploy to VPS
3. Run workflow → Run workflow

## 查看部署狀態

### 在 GitHub：

1. Actions 標籤
2. 點擊最新的 Workflow run
3. 查看每個 Job 的日誌

### 在 VPS：

```bash
# SSH 到 VPS
ssh root@your.vps.ip

# 查看服務狀態
cd ~/deepway-mcp
docker-compose -f docker-compose.prod.yml ps

# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f

# 查看資源使用
docker stats
```

## 故障排除

### 1. SSH 連接失敗

檢查：
- VPS_HOST 是否正確
- VPS_SSH_KEY 是否完整（包含開頭 `-----BEGIN ... KEY-----` 和結尾）
- VPS 防火牆是否開放 22 端口

```bash
# 測試 SSH 連接
ssh -i ~/.ssh/id_ed25519 root@your.vps.ip
```

### 2. Docker 構建失敗

檢查：
- VPS 記憶體是否足夠（2v4g 需要 ~4GB）
- Doppler 環境變量是否正確

```bash
# 手動構建測試
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 3. 服務啟動失敗

檢查日誌：

```bash
docker-compose -f docker-compose.prod.yml logs gemini-router
docker-compose -f docker-compose.prod.yml logs telegram-bots
```

### 4. 健康檢查失敗

```bash
# 測試 Gemini Router
curl http://localhost:5000/health

# 測試 Redis
docker exec redis redis-cli ping

# 測試 PostgreSQL
docker exec postgres pg_isready -U postgres
```

## 優化建議

### 1. 加速構建

使用 Docker Layer Cache：

```yaml
# 在 .github/workflows/deploy.yml 中添加
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

### 2. 藍綠部署

修改部署腳本實現零停機：

```bash
# 啟動新容器（不停止舊容器）
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale gemini-router=2 gemini-router

# 健康檢查通過後，停止舊容器
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale gemini-router=1 gemini-router
```

### 3. 回滾機制

如果部署失敗，自動回滾到上一個版本：

```bash
# 記錄部署前的 commit
PREV_COMMIT=$(git rev-parse HEAD)

# 部署
git pull origin main

# 如果失敗，回滾
if [ $? -ne 0 ]; then
  git reset --hard $PREV_COMMIT
  docker-compose -f docker-compose.prod.yml up -d
fi
```

## 成本優化

使用 GitHub Actions 自帶的運行時間（每月 2000 分鐘免費）：

- 每次部署約 5 分鐘
- 每月可免費部署 400 次
- 超出後按 $0.008/分鐘計費

如果需要更多運行時間，可考慮：
- 使用 Self-hosted Runners（在 VPS 上運行）
- 減少構建頻率（合併多個提交）
