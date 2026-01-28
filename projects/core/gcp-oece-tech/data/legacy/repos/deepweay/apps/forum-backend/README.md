# 🍄 Mycelium Network - Unified Bot Platform
## 菌丝网络 - 统一Bot平台

[\![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[\![Go Version](https://img.shields.io/badge/go-%3E%3D1.21-blue)](https://golang.org/)
[\![Docker](https://img.shields.io/badge/docker-%3E%3D24.0-blue)](https://www.docker.com/)
[\![Datadog](https://img.shields.io/badge/monitoring-datadog-632ca6)](https://www.datadoghq.com/)

> **Welcome, Fungal Masters** 🍄 欢迎，真菌大师们
> 
> _A unified platform merging DeepWeay community (svs-mcp) with intelligent bot services (svs-bot)._
>
> _将DeepWeay社区（svs-mcp）与智能Bot服务（svs-bot）合并的统一平台。_

**Mycelium Network** is a unified platform focusing on:
- **🤖 Go Bot Core** - High-performance Telegram bot with AI consciousness
- **🔗 Multi-Channel Hub** - Platform sync hub (sync only, no processing)
- **📊 User Analytics** - Database-driven user behavior analysis  
- **🧠 AI Routing** - 25 Gemini Keys intelligent routing system

**菌丝网络**是一个统一平台，专注于：
- **🤖 Go机器人核心** - 高性能Telegram机器人与AI意识
- **🔗 多频道集线器** - 平台同步枢纽（只同步不深加工）
- **📊 用户数据分析** - 数据库驱动的用户行为分析
- **🧠 AI智能路由** - 25个Gemini Keys智能路由系统

> **核心理念**: Bot负责AI交互和数据收集，深加工在本地完成

---

## 🚀 Quick Start 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/web3-ai-game/svs-telegram-bot.git
cd svs-telegram-bot

# 2. 配置环境变量（从Doppler获取）
cp .env.template .env

# 3. 一键部署
./quick-deploy.sh
```

---

## 📊 Current Setup 当前配置

```yaml
VPS: DigitalOcean
  CPU: 2 AMD vCPU
  RAM: 8GB + 20GB Swap = 28GB总内存
  Storage: 90GB SSD + 20GB Volume
  Cost: ~$30/month (从$48优化)
  
Performance:
  Users: 100-200 concurrent
  API: 1000+ requests/min
  Response: <100ms
```

---

## 🏗️ Architecture 架构

### Unified Microservices 统一微服务

```
mycelium-network/
├── go_backend/             # Go Backend Services
│   ├── cmd/xiaoai/        # AI Bot (384MB)
│   └── cmd/gateway/       # API Gateway (384MB)
│
├── services/              # Node.js Services (from svs-mcp)
│   ├── knowledge-base/    # MCP知识图谱
│   ├── aibot/            # AI工具
│   └── forum/            # 论坛系统
│
├── docker-compose.new.yml # 统一容器编排
├── nginx/                # Reverse Proxy
│
└── docs/                 # 📚 完整文档
    ├── README.md        # svs-mcp文档
    └── ...              # 13个文档文件
```

### Container Resources 容器资源

```yaml
Services:
  Redis: 1GB
  PostgreSQL: 512MB
  Xiaoai Bot (Go): 384MB
  API Gateway (Go): 384MB  
  Nginx: 128MB
  Datadog Agent: 256MB
  
Total Limit: ~2.9GB
Actual Usage: ~1.5GB
Buffer: ~25GB available
```

---

## 🔑 Key Features 核心特性

### 1. 🧠 25-Key Intelligent Routing

```yaml
Groups:
  路由组长 (2): 请求分发，15 RPM/key
  工作组A (6): VIP专用，10 RPM/key
  工作组B (6): Premium，10 RPM/key
  工作组C (6): 普通用户，10 RPM/key
  工作组D (5): 游客/备用，10 RPM/key

Capacity:
  Conservative: 230 RPM / 1,380 RPD
  Standard: 385 RPM / 2,300 RPD
  Aggressive: 575 RPM / 4,600 RPD
```

### 2. 🐕 Datadog Deep Monitoring

- VPS系统资源监控
- Docker容器状态
- Redis/Nginx性能
- Go应用APM追踪
- 完整日志收集

### 3. 🔐 90+ Environment Variables

- 32个 Gemini AI配置
- 9个 Telegram Bot配置
- 7个 数据库配置
- 7个 监控配置
- 2个 Docker Hub配置
- 33个 其他服务配置

---

## 📚 Documentation 文档

### Main Docs 主要文档
- [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) - 完整使用指南
- [DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md) - 详细部署步骤
- [DOPPLER_KEYS_INVENTORY.md](DOPPLER_KEYS_INVENTORY.md) - Keys清单

### From svs-mcp 来自svs-mcp
- [docs/README.md](docs/README.md) - DeepWeay社区文档
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - 原部署文档
- 更多13个文档...

---

## 🤖 Services 服务

### Go Backend (高性能)

**Xiaoai Bot** - AI Assistant
- 25 Gemini Keys智能路由
- VIP分级系统
- 多轮对话记忆
- 启动<100ms，响应<50ms

**API Gateway** - 统一入口
- 请求路由
- 限流保护  
- JWT认证

### Node.js Services (from svs-mcp)

- **Knowledge Base** (3001) - MCP知识图谱
- **AI Tools** (3002) - 多模型AI
- **Forum** (3004) - 论坛系统

---

## 🛠️ Development 开发

```bash
# 启动开发环境
docker compose -f docker-compose.new.yml up -d

# 查看日志
docker compose -f docker-compose.new.yml logs -f

# 监控资源（20秒刷新）
./monitor.sh --watch

# 重启服务
docker compose -f docker-compose.new.yml restart xiaoai-bot
```

---

## 🔄 Migration Path 迁移路径

### svs-mcp → Unified Platform

```yaml
Phase 1 - Documentation ✅
  ✅ 复制所有MD文档到docs/
  ✅ 合并README
  ✅ 统一项目结构

Phase 2 - Services Integration 📋
  - 迁移Node.js服务
  - 统一Docker Compose
  - 配置Nginx路由
  
Phase 3 - Unified Deployment 📋
  - 单一部署流程
  - 统一监控
  - 完整文档
```

---

## 💰 Cost Optimization 成本优化

```yaml
Before: $48/month (8GB/4CPU/160GB)
After:  $30/month (8GB/2CPU/90GB+20GB)
Saved:  $216/year

Performance Maintained:
  ✅ 2 AMD CPU (更快)
  ✅ 28GB总内存
  ✅ 100-200用户支持
  ✅ 完整微服务架构
```

---

## 📞 Links 链接

- **Website**: https://deepweay.me
- **GitHub**: https://github.com/web3-ai-game/svs-telegram-bot
- **Datadog**: https://app.datadoghq.com
- **Doppler**: https://dashboard.doppler.com

---

## 📝 License

MIT License

---

**Built with 🍄 by Fungal Masters**

**由真菌大师们用🍄打造**
