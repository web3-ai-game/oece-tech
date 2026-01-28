# 🏨 HotelHub - 智能酒店管理平台

[![GitHub Stars](https://img.shields.io/github/stars/web3-ai-game/hotel-install-room?style=social)](https://github.com/web3-ai-game/hotel-install-room/stargazers)
[![GitHub Actions](https://github.com/web3-ai-game/hotel-install-room/workflows/HotelHub%20CI/CD%20Pipeline/badge.svg)](https://github.com/web3-ai-game/hotel-install-room/actions)
[![GitHub Issues](https://img.shields.io/github/issues/web3-ai-game/hotel-install-room)](https://github.com/web3-ai-game/hotel-install-room/issues)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Enabled-blue?logo=github)](https://github.com/features/copilot)

**关键词**: 酒店管理, React应用, Node.js后端, PostgreSQL, 多租户, UI组件库, GitHub集成, AI辅助开发

## 🎯 项目概览

HotelHub是一个现代化的智能酒店管理平台，集成了完整的UI资源库、游戏娱乐模块和Web3金融功能。本项目完全基于GitHub生态，支持GitHub Copilot AI辅助开发。

**核心特性**:
- 🏨 多租户酒店管理系统
- 🎮 集成游戏娱乐中心
- 💰 Web3金融交易功能  
- 🎨 专业UI组件库 (300+ 组件)
- 🤖 GitHub Copilot AI智能编程
- 🚀 GitHub Actions 自动化部署
- 📋 MCP (Model Context Protocol) 集成

## 📋 项目架构

### 应用层 | APPLICATIONS
```
apps/
├── web/            # React前端应用 #React #前端 #UI
│   ├── frontend/   # 用户界面组件
│   └── backend/    # 前端服务配置
├── api/            # Express后端API #Node.js #API #后端
│   ├── src/        # API核心逻辑
│   └── tests/      # API测试套件
└── admin/          # 管理后台 #管理后台 #权限控制
```

### 共享包 | PACKAGES  
```
packages/
├── ui/            # UI组件库 #组件库 #设计系统
├── config/        # 共享配置 #配置管理 #环境变量
└── database/      # 数据库模型 #数据库 #ORM #模型
```

### UI资源库 | UI_ASSETS
```
hotel-ui/          # 专业UI资源库 #UI资源 #组件 #游戏
├── ui-kit/        # 基础UI组件 (Button, Card, Modal)
├── game-pool/     # HTML5游戏模块 (老虎机, 空投游戏)
├── web3-components/ # Web3金融组件 (交易终端, DeFi)
├── digital-assets/  # 视觉资源 (SVG图标, 背景)
└── frontend/      # React页面组件
```

### 基础设施 | INFRASTRUCTURE
```
├── docs/          # 项目文档 #文档 #说明
├── scripts/       # 自动化脚本 #脚本 #工具
├── deployments/   # 部署配置 #Docker #K8s #部署
└── database/      # 数据库脚本 #SQL #初始化
```

## 🚀 快速开始

> GitLab-only 模式：本项目已提供无 GitHub 依赖的 AI 编辑器/代理配置与脚本（默认即为关闭 GitHub 集成）。详见 docs/AI_EDITORS_SETUP_GITLAB.md 和 docs/TROUBLESHOOT_GITHUB_LOGIN.md。若你之前启用了任何 GitHub 脚本，可执行 `bash scripts/disable-github-integrations.sh` 一键隔离。

## 🚀 快速开始

### 🛠️ 环境准备

```bash
# 前置要求
- Node.js 18+ 
- Docker & Docker Compose
- Git
- GitHub账号 (推荐开启Copilot)

# 克隆项目
git clone https://github.com/web3-ai-game/hotel-install-room.git
cd hotel-install-room

# 依赖安装
npm install          # 根目录依赖
cd frontend && npm install  # 前端依赖  
cd ../backend && npm install # 后端依赖
```

### 🤖 双AI编辑器策略

项目支持两种AI开发模式，你可以根据需要切换：

```bash
# Windsurf AI模式 (优先使用，充分利用订阅)
./scripts/switch-ai-mode.sh windsurf
# 然后在Windsurf中打开项目，使用Claude 3.5 Sonnet

# GitHub Copilot模式 (订阅用完后切换)  
./scripts/switch-ai-mode.sh github
# 然后在VS Code中打开项目，使用GitHub Copilot
```

### ⚡ GitHub 生态集成

```bash
# 1. 切换到GitHub生态 (清理GitLab配置)
./scripts/switch-to-github.sh

# 2. 配置GitHub Token (用于MCP和API访问)
./scripts/setup-github-token.sh

# 3. 验证GitHub Copilot (在VS Code中测试)
code .  # 打开项目，测试Copilot代码补全
```

### 🔧 开发模式

```bash
# 分离式开发
npm run dev:frontend  # 前端开发 (端口3000)
npm run dev:backend   # 后端开发 (端口5001)

# 或使用启动脚本  
./scripts/start.sh start  # 一键启动所有服务
```

### 🐳 Docker开发

```bash
# Docker环境
npm run docker:up    # 启动Docker服务
npm run docker:down  # 停止Docker服务

# 查看服务状态
docker-compose ps    # 检查容器状态
```

### 开发模式 | DEVELOPMENT
```bash
# 启动完整开发环境
npm run dev

# 单独启动服务
npm run dev:frontend   # 前端开发服务器
npm run dev:backend    # 后端API服务器  
npm run dev:admin      # 管理后台
```

### Docker开发 | DOCKER_DEV
```bash
# 启动Docker开发环境
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### UI资源使用 | UI_RESOURCES
```bash
# 搜索UI组件
node scripts/ui-finder.js search "button card"

# 智能推荐
ui-recommend "hotel-management"

# 测试UI集成
ui-test-integration
```

## 🌐 服务端口

| 服务 | 开发端口 | 生产端口 | 描述 |
|------|---------|---------|------|
| **前端应用** | 3000 | 80 | React用户界面 |
| **后端API** | 5001 | 443 | Express服务器 |
| **管理后台** | 3001 | 8080 | 管理界面 |
| **数据库** | 5432 | 5432 | PostgreSQL |
| **文档站点** | 3000/docs | 80/docs | 项目文档 |

## 🛠️ 技术栈

### 前端技术 | FRONTEND_STACK
- **框架**: React 18 + TypeScript
- **UI库**: Material-UI + Emotion CSS
- **路由**: React Router + 保护路由
- **状态管理**: Context API + Hooks
- **样式**: CSS-in-JS + 响应式设计
- **国际化**: i18next多语言支持

### 后端技术 | BACKEND_STACK  
- **运行时**: Node.js + Express
- **数据库**: SQLite(开发) + PostgreSQL(生产)
- **认证**: JWT + BCrypt + RBAC权限
- **API**: RESTful设计 + 数据验证
- **中间件**: CORS + 限流 + 错误处理

### 基础设施 | INFRASTRUCTURE_STACK
- **容器化**: Docker + Docker Compose
- **数据存储**: 外置SSD(/Volumes/128/)
- **内存优化**: 512MB限制 + 性能监控
- **部署**: Kubernetes + Nginx反向代理
- **监控**: 健康检查 + 日志聚合

### 特色功能 | SPECIAL_FEATURES
- **游戏模块**: HTML5 Canvas + JavaScript动画
- **Web3集成**: 区块链交易 + DeFi协议
- **UI组件库**: 324+专业组件和资源
- **多租户**: 租户隔离 + 数据分离
- **AI增强**: MCP智能推荐 + 自然语言处理

## 📚 重要文档

## 📚 文档资源

### 🐙 GitHub 集成文档
- [`docs/GITHUB_INTEGRATION_GUIDE.md`](./docs/GITHUB_INTEGRATION_GUIDE.md) - GitHub生态集成指南
- [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) - 贡献指南和开发规范  
- [GitHub Actions工作流](https://github.com/web3-ai-game/hotel-install-room/actions) - CI/CD状态
- [GitHub Issues](https://github.com/web3-ai-game/hotel-install-room/issues) - Bug报告和功能请求

### 📋 核心文档
- [`UI_ASSETS_INDEX.md`](./UI_ASSETS_INDEX.md) - UI资源库完整索引
- [`UI_INTEGRATION_GUIDE.md`](./UI_INTEGRATION_GUIDE.md) - UI集成开发指南
- [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) - 项目技术架构总览
- [`docs/MCP_SETUP_GUIDE.md`](./docs/MCP_SETUP_GUIDE.md) - MCP服务器配置

### 🔌 API文档
- [认证API](./docs/api/auth.md) - 用户认证和授权
- [酒店API](./docs/api/hotels.md) - 酒店管理接口
- [预订API](./docs/api/bookings.md) - 预订系统接口
- [游戏API](./docs/api/games.md) - 游戏模块接口

### 🚀 部署文档
- [Docker部署](./docs/DEPLOYMENT.md) - 容器化部署指南
- [K8s配置](./deployments/kubernetes/) - Kubernetes配置
- [Nginx配置](./deployments/nginx/) - 反向代理设置

## 🔧 开发工具

### MCP智能助手 | MCP_INTEGRATION
```bash
# 启动MCP服务器
node scripts/ui-docs-mcp-server.js

# 自然语言UI查询
"我需要一个酒店房间预订的按钮组件"
"帮我美化一下仪表板界面"
"添加一些游戏娱乐功能"
```

### 实用脚本 | UTILITY_SCRIPTS
```bash
# UI资源管理
ui-search "keyword"        # 搜索UI组件
ui-recommend "scenario"    # 获取推荐方案
ui-status                 # 检查UI服务状态

# 开发辅助
npm run lint              # 代码质量检查
npm run test              # 运行测试套件
npm run build:analyze     # 构建分析
```

## 📊 项目状态

### 完成功能 | COMPLETED_FEATURES ✅
- 多租户酒店管理核心功能
- UI资源库完整集成(324+组件)
- 游戏娱乐模块(老虎机、预测游戏)
- Web3金融功能(交易终端、DeFi)
- Docker容器化开发环境
- MCP智能推荐系统
- 响应式设计和多语言支持

### 下一步计划 | ROADMAP 🚧
- [ ] 移动端PWA优化
- [ ] 高级数据分析仪表板  
- [ ] 第三方支付集成
- [ ] 实时通知系统
- [ ] 性能监控和日志系统
- [ ] 高可用集群部署

## 🤝 贡献指南

### 开发流程 | DEVELOPMENT_WORKFLOW
1. Fork项目并创建功能分支
2. 使用UI资源库中的组件
3. 遵循代码规范和测试要求
4. 提交PR并通过代码审查
5. 合并到主分支

### 代码规范 | CODE_STANDARDS
- TypeScript优先，严格类型检查
- ESLint + Prettier代码格式化
- 组件优先使用UI资源库
- API遵循RESTful设计原则
- 提交信息使用约定式提交

---

**🎉 HotelHub v2.0 - 现代化酒店管理的完整解决方案**

**GitLab仓库**: [https://github.com/oicc1/hotel-install.git](https://github.com/oicc1/hotel-install.git)
更多信息请查看 [`project-config.json`](./project-config.json) 和相关文档。
