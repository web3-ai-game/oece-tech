# 🍄 Deepway MCP - 真菌部落交流社區

> 菌絲網絡社群平台 - 整合論壇、Telegram Bot 和 AI 工具的統一生態系統

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## 📋 項目概述

Deepway MCP 採用 **Monorepo 架構**，整合了多個子系統：

| 組件 | 技術棧 | 功能 | 狀態 |
|------|--------|------|------|
| **Web 主站** | Next.js 14 + React | 論壇前端界面 | ✅ 開發中 |
| **Telegram Bot** | Python 3.12 | 高情商 AI 聊天 | ✅ 運行中 |
| **Forum Backend** | Python + FastAPI | 論壇後端 API | 🚧 整合中 |

## 🚀 快速開始

### 1. 環境配置

```bash
# 配置 Doppler
doppler setup --project deepway-mcp --config dev
doppler secrets download --no-file --format env > .env
```

### 2. 本地開發

```bash
# 安裝依賴
npm install

# 啟動 Web 開發服務器
npm run dev

# 啟動 Telegram Bot
cd apps/telegram-bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python high_eq_bot.py
```

### 3. Docker 部署

```bash
cd docker
docker-compose up -d
```

## 📁 Monorepo 結構

```
deepway-mcp/
├── apps/                      # 應用層
│   ├── web/                  # Next.js 主站
│   │   ├── app/             # App Router
│   │   ├── components/      # React 組件
│   │   ├── lib/             # 工具函數
│   │   └── public/          # 靜態資源
│   │
│   ├── telegram-bot/        # Telegram Bot (Python)
│   │   ├── high_eq_bot.py  # Bot 主程序
│   │   ├── gemini_router.py # Gemini API 路由
│   │   └── requirements.txt # Python 依賴
│   │
│   └── forum-backend/       # 論壇後端 (Python)
│       └── requirements.txt
│
├── packages/                 # 共享包
│   ├── shared/              # 共享工具
│   └── config/              # 配置文件
│
├── docker/                   # Docker 配置
│   ├── docker-compose.yml   # 容器編排
│   └── nginx/               # Nginx 配置
│
├── scripts/                  # 自動化腳本
│   ├── deploy.sh            # 部署腳本
│   └── sync.sh              # VPS 同步
│
└── docs/                     # 文檔
    ├── API.md
    └── STRUCTURE.md
```

## 🐳 Docker 服務

| 服務 | 端口 | 資源 | 說明 |
|------|------|------|------|
| Nginx | 80, 443 | 32MB | 反向代理 |
| Web | 3000 | 384MB | Next.js |
| Bot | - | 256MB | Telegram |
| PostgreSQL | 5432 | 512MB | 數據庫 |
| Redis | 6379 | 256MB | 緩存 |

**總資源**: 2vCPU / 1.8GB RAM (適合 $28/月 VPS)

## 🔄 開發工作流

### 本地 → GitHub → VPS 同步

```bash
# 本地開發
git pull origin main
doppler secrets download --no-file --format env > .env
npm run dev

# 提交代碼
git add .
git commit -m "feat: 新功能"
git push origin main

# VPS 部署
./scripts/deploy.sh
```

### VS Code Remote SSH 開發

```bash
# 1. 配置 SSH
cat >> ~/.ssh/config << EOF
Host deepway-vps
    HostName your-vps-ip
    User root
    IdentityFile ~/.ssh/id_rsa
EOF

# 2. VS Code 連接
Cmd+Shift+P → Remote-SSH: Connect to Host → deepway-vps

# 3. 在 VPS 上開發
cd /mnt/volume_sgp1_01/deepway-mcp
code .
```

## 🤖 Telegram Bot

### 支持的機器人

- **@svskilo_bot** - 高情商聊天機器人（主力）
- **@svslovea_bot** - 社交機器人
- **@svsinst_bot** - 小愛機器人

### Gemini API 配置

- **模型**: Gemini 2.5 Flash
- **Keys**: 25個 API 密鑰
- **策略**: Round-robin 負載均衡
- **限制**: 25k 請求/天/key

## 🔑 環境變量

通過 Doppler 統一管理 48 個環境變量：

```bash
# 查看配置
doppler secrets

# 下載到本地
doppler secrets download --no-file --format env > .env

# 上傳新配置
doppler secrets upload .env
```

## 📊 部署方案

### 當前方案: VPS 容器化

- **規格**: 2vCPU / 4GB RAM
- **成本**: $28/月 (DigitalOcean)
- **位置**: /mnt/volume_sgp1_01/deepway-mcp

### 混合部署（推薦）

- 靜態頁面 → Vercel (免費)
- API 服務 → VPS Docker
- 節省成本 50%

## 📝 文檔

- [項目結構](docs/STRUCTURE.md)
- [API 文檔](docs/API.md)
- [環境變量管理](ENV_MANAGEMENT.md)
- [部署指南](ENV_CLEANUP_REPORT.md)

## 🤝 貢獻

歡迎提交 Pull Request！

## 📄 授權

MIT License

## 🔗 相關鏈接

- **GitHub**: https://github.com/web3-ai-game/deepway-mcp
- **Doppler**: deepway-mcp 項目
- **VPS**: DigitalOcean SGP1

---

**最後更新**: 2025-11-16  
**版本**: 2.0.0 (Monorepo 重構)  
**狀態**: 🚀 Active Development
