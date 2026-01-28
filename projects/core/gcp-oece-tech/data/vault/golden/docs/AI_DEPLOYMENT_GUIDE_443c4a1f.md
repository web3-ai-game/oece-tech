# 🤖 AI 機讀部署指南

**目標 VPS**: 68.183.239.153 (4v8g, Ubuntu 24.04, 全新系統)  
**使用期限**: 2周（至12月1日）  
**部署方式**: SSH + VS Code Remote  
**最終目標**: 全自動化一鍵部署

---

## 🚀 快速部署（一鍵執行）

```bash
# 在 VPS 上執行此命令即可完成所有部署
cd /mnt/volume_sgp1_01/deepway-mcp
chmod +x deploy-all.sh
./deploy-all.sh
```

**部署時間**: 約 15-20 分鐘（取決於網絡速度）

---

## 📦 部署包內容

```
vps-deploy/
├── AI_DEPLOYMENT_GUIDE.md          # 本文件（AI 機讀指南）
├── CHAT_HISTORY.md                 # 完整聊天記錄
├── deploy-all.sh                   # 一鍵部署腳本
├── setup-system.sh                 # 系統初始化
├── setup-docker.sh                 # Docker 安裝
├── setup-doppler.sh                # Doppler CLI 安裝
├── setup-nginx.sh                  # Nginx 安裝和配置
├── setup-services.sh               # 啟動所有服務
├── .env.production                 # 生產環境變量（完整版）
├── docker-compose.yml              # Docker Compose 配置
├── nginx/                          # Nginx 配置文件
│   ├── nginx.conf
│   └── sites-available/
│       └── deepway.conf
├── apps/                           # 應用代碼
│   ├── web/                        # Next.js (不含 node_modules)
│   ├── telegram-bot/               # Telegram Bots (不含 venv)
│   └── forum-backend/              # Forum Backend (不含 venv)
├── prisma/                         # 數據庫 Schema
├── scripts/                        # 工具腳本
└── docs/                           # 文檔
```

---

## 🔧 系統需求和依賴清單

### 必需系統包

```bash
# 系統更新和基礎工具
apt update && apt upgrade -y
apt install -y curl wget git vim htop build-essential

# Docker 和 Docker Compose
# （腳本會自動安裝最新版本）

# Nginx（反向代理）
# （腳本會自動安裝）

# Doppler CLI（環境變量管理）
# （腳本會自動安裝）

# Node.js 20（Next.js）
# （通過 nvm 安裝）

# Python 3.13（Telegram Bots）
# （系統自帶 Python 3.12，使用 pyenv 安裝 3.13）
```

### Python 依賴（47 + 66 = 113 個包）

```bash
# Telegram Bot 依賴
python-telegram-bot>=20.0
aiohttp>=3.9.0
redis>=5.0.0
supabase>=2.0.0
python-dotenv>=1.0.0
requests>=2.31.0
loguru>=0.7.0

# Forum Backend 額外依賴
google-generativeai>=0.3.0
fastapi>=0.104.0
uvicorn>=0.24.0
```

### Node.js 依賴（958 個包）

```bash
# Next.js 和相關依賴
next@14.0.0
react@18.2.0
tailwindcss@3.3.0
@prisma/client@5.0.0
# ... 其他 954 個包（package.json 中列出）
```

---

## 🎯 部署步驟詳解

### 步驟 1: 系統初始化（setup-system.sh）

```bash
#!/bin/bash
# 更新系統
apt update && apt upgrade -y

# 安裝基礎工具
apt install -y \
  curl wget git vim htop \
  build-essential software-properties-common \
  ca-certificates gnupg lsb-release

# 配置時區（新加坡）
timedatectl set-timezone Asia/Singapore

# 配置防火牆
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 5000  # Gemini Router
ufw allow 6379  # Redis
ufw allow 5432  # PostgreSQL
ufw --force enable

# 配置 swap（8GB）
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**預期結果**: 系統更新完成，防火牆配置完成，swap 啟用

### 步驟 2: Docker 安裝（setup-docker.sh）

```bash
#!/bin/bash
# 添加 Docker 官方 GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 Docker 倉庫
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

# 安裝 Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 啟動 Docker
systemctl enable docker
systemctl start docker

# 驗證安裝
docker --version
docker compose version
```

**預期結果**: Docker 和 Docker Compose 安裝完成

### 步驟 3: Doppler 安裝（setup-doppler.sh）

```bash
#!/bin/bash
# 安裝 Doppler CLI
curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" > /etc/apt/sources.list.d/doppler-cli.list

apt update
apt install -y doppler

# 驗證安裝
doppler --version
```

**Doppler 登錄（需要手動）**:

```bash
# 登錄 Doppler（會打開瀏覽器）
doppler login

# 配置項目
cd /mnt/volume_sgp1_01/deepway-mcp
doppler setup --project deepway-mcp --config dev
```

**預期結果**: Doppler CLI 安裝完成，等待手動登錄

### 步驟 4: Nginx 安裝和配置（setup-nginx.sh）

```bash
#!/bin/bash
# 安裝 Nginx
apt install -y nginx

# 複製配置文件
cp nginx/nginx.conf /etc/nginx/nginx.conf
cp nginx/sites-available/deepway.conf /etc/nginx/sites-available/

# 啟用站點
ln -sf /etc/nginx/sites-available/deepway.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 測試配置
nginx -t

# 重啟 Nginx
systemctl restart nginx
systemctl enable nginx
```

**預期結果**: Nginx 安裝並配置完成

### 步驟 5: Node.js 和 Python 環境（自動）

```bash
# 安裝 Node.js 20（通過 nvm）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 安裝 Python 3.13（通過 pyenv）
curl https://pyenv.run | bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc
pyenv install 3.13
pyenv global 3.13
```

### 步驟 6: 安裝依賴（setup-services.sh）

```bash
#!/bin/bash
cd /mnt/volume_sgp1_01/deepway-mcp

# 安裝 Next.js 依賴
echo "📦 安裝 Next.js 依賴..."
cd apps/web
npm install
cd ../..

# 安裝 Telegram Bot 依賴
echo "📦 安裝 Telegram Bot 依賴..."
cd apps/telegram-bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ../..

# 安裝 Forum Backend 依賴
echo "📦 安裝 Forum Backend 依賴..."
cd apps/forum-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ../..

# 同步 Doppler 環境變量
echo "🔑 同步 Doppler 環境變量..."
doppler secrets download --project deepway-mcp --config dev > .env
```

### 步驟 7: 啟動所有服務

```bash
#!/bin/bash
cd /mnt/volume_sgp1_01/deepway-mcp

# 啟動 Docker Compose 服務
docker compose up -d

# 顯示服務狀態
docker compose ps

# 顯示資源使用
docker stats --no-stream
```

---

## 🔍 健康檢查和驗證

### 自動健康檢查腳本

```bash
#!/bin/bash
echo "🏥 健康檢查..."

# Gemini Router
if curl -sf http://localhost:5000/health > /dev/null; then
  echo "✅ Gemini Router 健康"
else
  echo "❌ Gemini Router 異常"
fi

# Redis
if docker exec redis redis-cli ping > /dev/null 2>&1; then
  echo "✅ Redis 健康"
else
  echo "❌ Redis 異常"
fi

# PostgreSQL（Supabase）
if curl -sf ${SUPABASE_URL}/rest/v1/ \
  -H "apikey: ${SUPABASE_KEY}" > /dev/null 2>&1; then
  echo "✅ Supabase 健康"
else
  echo "❌ Supabase 異常"
fi

# Nginx
if curl -sf http://localhost/health > /dev/null; then
  echo "✅ Nginx 健康"
else
  echo "❌ Nginx 異常"
fi

# Datadog Agent
if docker exec datadog-agent datadog-agent status > /dev/null 2>&1; then
  echo "✅ Datadog Agent 健康"
else
  echo "❌ Datadog Agent 異常"
fi
```

---

## 🐛 常見問題和解決方案

### 問題 1: Doppler 登錄失敗

**症狀**: `doppler login` 無法打開瀏覽器

**解決方案**:
```bash
# 使用 Token 登錄
doppler configure set token YOUR_DOPPLER_TOKEN
```

獲取 Token: https://dashboard.doppler.com/workplace/tokens

### 問題 2: Docker 內存不足

**症狀**: 容器啟動失敗或頻繁重啟

**解決方案**:
```bash
# 清理未使用的鏡像
docker system prune -af

# 調整服務內存限制
# 編輯 docker-compose.yml 中的 mem_limit
```

### 問題 3: Nginx 配置錯誤

**症狀**: `nginx -t` 報錯

**解決方案**:
```bash
# 查看詳細錯誤
nginx -t

# 常見問題：
# 1. 端口被佔用 -> netstat -tuln | grep :80
# 2. 配置文件語法錯誤 -> 檢查 nginx.conf
```

### 問題 4: Python 依賴安裝失敗

**症狀**: `pip install` 報編譯錯誤

**解決方案**:
```bash
# 安裝編譯依賴
apt install -y python3-dev libpq-dev

# 使用二進制包
pip install --only-binary :all: psycopg2-binary
```

### 問題 5: Node.js 內存溢出

**症狀**: `npm install` 失敗或卡住

**解決方案**:
```bash
# 增加 Node.js 內存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 清理緩存後重試
npm cache clean --force
npm install
```

---

## 📊 服務配置詳情

### Docker Compose 服務列表

```yaml
services:
  gemini-router:      # Gemini AI 路由（1.5GB）
  telegram-bots:      # 3個 Telegram Bots（1GB）
  redis:              # 緩存服務（512MB）
  postgres:           # PostgreSQL（1.5GB）- 備用，主要用 Supabase
  datadog:            # Datadog 監控（512MB）
  nginx:              # 反向代理（256MB）
  sentry-relay:       # Sentry 錯誤追蹤（512MB）- 可選

總計: ~5.8GB / 8GB（留 2.2GB 給系統和 Swap）
```

### Doppler 環境變量（75個 Keys）

**分類**:

1. **Gemini API Keys** (27個):
   - `GEMINI_ROUTER_LEADER_1`, `GEMINI_ROUTER_LEADER_2`
   - `GEMINI_WORK_KEY_01` ~ `GEMINI_WORK_KEY_23`
   - `GEMINI_API_KEYS` (合併)
   - `GEMINI_ROUTER_STRATEGY`

2. **Telegram Bots** (3個):
   - `TELEGRAM_BOT_TOKEN` (@svskilo_bot)
   - `TELEGRAM_LOVE_BOT_TOKEN` (@svslovea_bot)
   - `TELEGRAM_INST_BOT_TOKEN` (@svsinst_bot)

3. **Supabase** (3個):
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Datadog** (3個):
   - `DATADOG_API_KEY`
   - `DATADOG_APP_KEY`
   - `DATADOG_SITE`

5. **Sentry** (3個):
   - `SENTRY_DSN`
   - `SENTRY_AUTH_TOKEN`
   - `SENTRY_ORG`

6. **GitHub** (2個):
   - `GITHUB_TOKEN`
   - `GITHUB_OAUTH_SECRET`

7. **其他服務** (34個):
   - DigitalOcean Spaces
   - Redis URL
   - NextAuth Secret
   - 等等...

---

## 🔄 VS Code SSH 開發流程

### 1. 安裝 VS Code Remote SSH 擴展

本機操作:
```bash
# 在 VS Code 中安裝擴展
code --install-extension ms-vscode-remote.remote-ssh
```

### 2. 配置 SSH 連接

編輯 `~/.ssh/config`:
```
Host deepway-vps
  HostName 68.183.239.153
  User root
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 60
  ServerAliveCountMax 3
```

### 3. 連接到 VPS

1. 按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Win)
2. 輸入 `Remote-SSH: Connect to Host`
3. 選擇 `deepway-vps`
4. VS Code 會自動安裝遠程服務器組件

### 4. 打開項目文件夾

連接後:
```
File → Open Folder → /mnt/volume_sgp1_01/deepway-mcp
```

### 5. 安裝遠程擴展

在 VPS 上推薦安裝:
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Docker (ms-azuretools.vscode-docker)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

---

## 💬 聊天記錄同步方案

### 方案 1: 通過文檔文件（當前使用）

**聊天記錄已保存在**:
- `CHAT_HISTORY.md` - 完整對話記錄（包含所有上下文）

**使用方式**:
```bash
# SSH 到 VPS 後，在 VS Code 中打開
/mnt/volume_sgp1_01/deepway-mcp/vps-deploy/CHAT_HISTORY.md

# 或使用命令行查看
cat CHAT_HISTORY.md | less
```

### 方案 2: GitHub Copilot 聊天歷史

**限制**: GitHub Copilot 聊天記錄儲存在本機，無法直接同步到 VPS

**替代方案**:

1. **使用 Workspace Context**（推薦）:
   - 所有配置和文檔都在項目中
   - SSH 連接後，Copilot 可以讀取項目文件獲得上下文
   - 使用 `@workspace` 詢問項目相關問題

2. **Windsurf AI 編輯器**（你的主力工具）:
   - Windsurf 也支持 SSH Remote 開發
   - 聊天記錄可能綁定到項目而非本機
   - 切換到 VPS 後可以繼續對話

3. **手動導出聊天記錄**（本次已完成）:
   - 已將完整對話保存到 `CHAT_HISTORY.md`
   - 包含所有技術決策、配置說明、問題解決方案

### 方案 3: 使用 AI 指令文件（本文件）

**本文件（AI_DEPLOYMENT_GUIDE.md）的作用**:
- 🤖 專為 AI 助手設計，包含完整部署上下文
- 📋 所有配置、腳本、命令都有詳細說明
- 🔍 包含常見問題和解決方案
- 🚀 可以直接複製命令執行

**使用方式**:
```bash
# SSH 連接後，在聊天中輸入:
"請閱讀 /mnt/volume_sgp1_01/deepway-mcp/vps-deploy/AI_DEPLOYMENT_GUIDE.md"

# 或者直接詢問:
"根據 AI_DEPLOYMENT_GUIDE.md 的內容，幫我部署 XXX 服務"
```

---

## 🎓 GitHub 學生包建議（2024-2025 最新）

### 必開通的 AI 和開發工具

#### 🤖 AI 開發工具

1. **GitHub Copilot** ⭐⭐⭐⭐⭐
   - 免費期限: 學生期間無限制
   - 價值: $10/月 → $0
   - 用途: AI 代碼補全、聊天助手
   - 狀態: ✅ 已使用（450 credits + 70% 對話剩餘）

2. **Tabnine Pro** ⭐⭐⭐⭐
   - 免費期限: 1年
   - 價值: $12/月 → $0
   - 用途: AI 代碼補全（支持更多語言）
   - 建議: Copilot 的備選方案

3. **Pieces for Developers** ⭐⭐⭐⭐
   - 免費期限: 1年 Pro
   - 價值: $10/月 → $0
   - 用途: AI 代碼片段管理、上下文保存
   - 建議: 很適合保存你的聊天記錄和代碼片段

#### ☁️ 雲服務和主機

4. **DigitalOcean** ⭐⭐⭐⭐⭐
   - 免費額度: $200 credits (1年有效)
   - 用途: VPS 主機（你正在用的）
   - 建議: 可以用來支付 2v4g VPS ($12/月 × 16個月)

5. **Microsoft Azure** ⭐⭐⭐⭐
   - 免費額度: $100 credits
   - 用途: 雲服務、AI APIs
   - 建議: 可用於備份服務器或 Azure OpenAI

6. **Heroku** ⭐⭐⭐
   - 免費額度: 1年 Hobby Dyno
   - 價值: $84/年
   - 用途: 快速部署 Web 應用
   - 建議: 適合測試環境

#### 🗄️ 數據庫和存儲

7. **MongoDB Atlas** ⭐⭐⭐⭐
   - 免費額度: $200 credits
   - 用途: NoSQL 數據庫
   - 建議: 如果需要文檔數據庫可以用

8. **Supabase** ⭐⭐⭐⭐⭐
   - 免費層級: Pro 功能部分免費
   - 用途: PostgreSQL + Auth + Storage
   - 狀態: ✅ 已使用

9. **Cloudflare** ⭐⭐⭐⭐
   - 免費層級: Workers + R2 存儲
   - 用途: CDN、DNS、邊緣計算
   - 建議: 用於加速網站和存儲靜態資源

#### 🛠️ 開發工具

10. **JetBrains IDE** ⭐⭐⭐⭐⭐
    - 免費期限: 學生期間無限制
    - 包含: PyCharm, WebStorm, IntelliJ IDEA
    - 價值: $249/年 → $0
    - 建議: PyCharm 很適合 Python 開發

11. **GitKraken Pro** ⭐⭐⭐
    - 免費期限: 1年
    - 價值: $60/年
    - 用途: Git GUI 客戶端
    - 建議: 如果喜歡圖形化 Git 工具

12. **Termius** ⭐⭐⭐⭐
    - 免費期限: 學生期間
    - 用途: SSH 客戶端（跨平台）
    - 建議: 比系統自帶的 SSH 更好用

#### 📊 監控和分析

13. **Datadog** ⭐⭐⭐⭐⭐
    - 免費期限: Pro 版本 2年
    - 價值: $360/年 → $0
    - 狀態: ✅ 已訂閱並使用
    - 建議: 保持使用，很強大的監控工具

14. **Sentry** ⭐⭐⭐⭐⭐
    - 免費額度: 500k events/月
    - 價值: $26/月 → $0
    - 狀態: ✅ 已訂閱
    - 建議: 錯誤追蹤必備

15. **LogDNA (Mezmo)** ⭐⭐⭐
    - 免費期限: 50GB/月
    - 用途: 日誌聚合
    - 建議: 配合 Datadog 使用

#### 🎨 設計和生產力

16. **Figma** ⭐⭐⭐⭐
    - 免費層級: 教育版
    - 用途: UI/UX 設計
    - 建議: 設計網站界面必備

17. **Notion** ⭐⭐⭐⭐
    - 免費層級: Plus 版本
    - 用途: 筆記、項目管理
    - 建議: 用來整理開發文檔

18. **~~Canva Pro~~** ❌ 已移除
    - 狀態: 2023年移除出學生包
    - 替代: 使用免費版或 Figma

#### 🔒 安全和域名

19. **Namecheap** ⭐⭐⭐⭐
    - 免費: 1年 .me 域名 + SSL
    - 價值: $20
    - 建議: 用於 deepway.me 域名

20. **1Password** ⭐⭐⭐⭐
    - 免費期限: 學生期間
    - 價值: $36/年
    - 建議: 管理所有 API Keys 和密碼

#### 📚 學習資源

21. **Frontend Masters** ⭐⭐⭐⭐⭐
    - 免費期限: 6個月
    - 價值: $234
    - 建議: 高質量前端課程

22. **Educative** ⭐⭐⭐⭐
    - 免費期限: 6個月
    - 建議: 系統設計和算法課程

### 🚫 已移除或不推薦的服務

- ❌ **Canva Pro** - 2023年移除
- ❌ **Bootstrap Studio** - 2024年移除
- ⚠️ **Stripe** - 僅適用於美國學生
- ⚠️ **SendGrid** - 免費額度已大幅減少

### 💡 使用建議

**優先級排序**:

**必開（⭐⭐⭐⭐⭐）**:
1. GitHub Copilot（你在用）
2. DigitalOcean $200 credits（支付 VPS）
3. Datadog（你在用）
4. Sentry（你在用）
5. JetBrains IDE（PyCharm for Python）

**推薦開通（⭐⭐⭐⭐）**:
6. Microsoft Azure（備用服務器 + AI APIs）
7. Cloudflare（CDN 加速）
8. Supabase（你在用）
9. Figma（設計界面）
10. Namecheap（deepway.me 域名）

**可選（⭐⭐⭐）**:
11. Pieces（代碼片段管理）
12. Termius（SSH 客戶端）
13. MongoDB Atlas（備用數據庫）

**節省成本計算**:
```
GitHub Copilot:    $120/年
DigitalOcean:      $200 credits
Datadog:           $360/年
JetBrains:         $249/年
Sentry:            $312/年
Azure:             $100 credits
1Password:         $36/年
----------------------------
總計:              $1,377/年 價值
```

---

## 🔐 安全最佳實踐

### SSH 密鑰管理

```bash
# 生成新的 SSH 密鑰（如果需要）
ssh-keygen -t ed25519 -C "vps-deploy@deepway-mcp"

# 設置權限
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# 禁用密碼登錄（僅密鑰）
# 編輯 /etc/ssh/sshd_config
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin prohibit-password

# 重啟 SSH 服務
systemctl restart sshd
```

### 防火牆配置

```bash
# UFW 基礎配置
ufw default deny incoming
ufw default allow outgoing

# 允許必要端口
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# 僅本地訪問（可選）
ufw allow from 127.0.0.1 to any port 5000  # Gemini Router
ufw allow from 127.0.0.1 to any port 6379  # Redis
ufw allow from 127.0.0.1 to any port 5432  # PostgreSQL

ufw enable
```

### Fail2ban 設置

```bash
# 安裝 Fail2ban
apt install -y fail2ban

# 配置 SSH 保護
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
```

---

## 📈 監控和日誌

### Datadog 配置

```yaml
# datadog-agent 配置（已在 docker-compose.yml）
environment:
  - DD_API_KEY=${DATADOG_API_KEY}
  - DD_SITE=datadoghq.com
  - DD_HOSTNAME=vps-singapore
  - DD_TAGS=env:production,service:deepway-mcp
  - DD_LOGS_ENABLED=true
  - DD_APM_ENABLED=true
  - DD_PROCESS_AGENT_ENABLED=true
```

### 日誌查看

```bash
# Docker 服務日誌
docker compose logs -f gemini-router
docker compose logs -f telegram-bots
docker compose logs --tail=100 redis

# Nginx 日誌
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 系統日誌
journalctl -fu docker
journalctl -fu nginx
```

---

## 🎯 快速命令參考

```bash
# 重啟所有服務
docker compose restart

# 僅重啟單個服務
docker compose restart gemini-router

# 查看資源使用
docker stats

# 進入容器
docker exec -it redis redis-cli
docker exec -it postgres psql -U postgres

# 備份數據庫（Supabase 自動備份，無需手動）
# 如果使用本地 PostgreSQL:
docker exec postgres pg_dump -U postgres deepway > backup.sql

# 查看網絡連接
netstat -tuln | grep LISTEN

# 磁盤使用
df -h
du -sh /mnt/volume_sgp1_01/*

# 內存使用
free -h
```

---

## ✅ 部署檢查清單

完成部署後，確認以下事項:

- [ ] 系統更新完成（`apt update && apt upgrade`）
- [ ] Docker 安裝並運行（`docker --version`）
- [ ] Doppler CLI 已登錄（`doppler configure get token`）
- [ ] 環境變量已同步（`.env` 文件存在且包含 75 個 keys）
- [ ] Nginx 配置正確（`nginx -t` 通過）
- [ ] 所有 Docker 服務運行中（`docker compose ps` 全部 Up）
- [ ] Gemini Router 健康（`curl localhost:5000/health` 返回 200）
- [ ] Redis 健康（`docker exec redis redis-cli ping` 返回 PONG）
- [ ] Supabase 連接正常（檢查環境變量）
- [ ] Telegram Bots 在線（發送測試消息）
- [ ] Datadog Agent 運行（`docker exec datadog-agent datadog-agent status`）
- [ ] Nginx 反向代理工作（`curl localhost` 返回頁面）
- [ ] 防火牆配置正確（`ufw status`）
- [ ] Swap 已啟用（`swapon --show`）
- [ ] VS Code SSH 連接成功
- [ ] GitHub Copilot / Windsurf 在遠程環境可用

---

## 📞 緊急聯繫和回滾

### 如果部署失敗

```bash
# 停止所有服務
docker compose down

# 查看錯誤日誌
docker compose logs

# 重新開始（從頭執行）
cd /mnt/volume_sgp1_01/deepway-mcp
./deploy-all.sh
```

### 回滾到本地開發

```bash
# 在本機（Mac）
cd ~/Documents/Git/deepway-mcp
./scripts/dev-local.sh
```

### 數據備份（重要！）

```bash
# 備份 Doppler 環境變量
doppler secrets download --project deepway-mcp --config dev > doppler-backup.json

# 備份 Docker Volumes（如果有數據）
docker run --rm -v deepway-mcp_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgres-backup.tar.gz /data
```

---

## 🚀 部署完成後的下一步

1. **測試所有功能**
   - 訪問網站
   - 測試 Telegram Bots
   - 檢查 Gemini Router
   - 查看 Datadog 監控

2. **配置域名（如果有）**
   - 在 Namecheap 配置 DNS 指向 68.183.239.153
   - 配置 SSL 證書（Let's Encrypt）

3. **設置自動化**
   - GitHub Actions 自動部署
   - 定時備份腳本
   - 監控告警

4. **優化性能**
   - Redis 緩存策略
   - Nginx 緩存配置
   - Docker 資源限制調優

---

**部署完成後，請在聊天中告訴我:**
- ✅ 哪些步驟成功
- ❌ 遇到了什麼問題
- 📊 服務運行狀態（`docker stats` 輸出）

**我會根據實際情況提供進一步的幫助和優化建議。**

---

**祝部署順利！** 🎊

*此文件由 GitHub Copilot 生成，專為 AI 助手在 SSH 環境中使用*
