# 🌐 oece.tech - 极客母艦

> 综合项目导航和知识管理平台

**域名**: https://oece.tech  
**项目启动**: 2026-01-15  
**当前版本**: 1.0.0-alpha

---

## 🎯 项目定位

**极客母艦** - 汇聚所有技术项目、工具和知识的中央枢纽

### 核心功能
- 📊 **项目导航**: 所有技术项目的展示和管理
- 🔍 **智能搜索**: Algolia 全文搜索
- 📚 **知识库**: 集成文档和最佳实践
- 🤖 **AI 工具**: 展示和集成 AI 能力
- 💬 **Telegram Bot**: 项目查询和通知

---

## 📁 项目结构

\`\`\`
gcp-oece-tech/
├── apps/                       # 应用代码
│   ├── web/                    # Next.js 前端 (核心)
│   ├── api/                    # 后端 API
│   └── telegram-bot/           # Telegram 机器人
│
├── packages/                   # 共享代码
│   ├── shared/                 # 共享类型和工具
│   ├── sdk/                    # 420420 SDK
│   └── ui/                     # UI 组件库
│
├── data/                       # 数据资源
│   ├── projects/               # db 项目数据 (490 MB)
│   ├── legacy/                 # 历史项目归档 (157 MB)
│   └── vault/                  # 30 仓库精炼库 (25 MB)
│
├── deploy/                     # 部署配置
│   ├── gcp/                    # GCP 部署脚本
│   └── firebase/               # Firebase 配置
│
├── docs/                       # 项目文档
│   ├── README.md               # 本文件
│   ├── ARCHITECTURE.md         # 架构设计
│   ├── API.md                  # API 文档
│   ├── DEPLOYMENT.md           # 部署指南
│   └── DEVELOPMENT.md          # 开发指南
│
└── scripts/                    # 工具脚本
    ├── deploy.sh               # 部署脚本
    └── seed-data.js            # 数据初始化
\`\`\`

---

## 🚀 快速开始

### 本地开发

\`\`\`bash
# 安装依赖
cd apps/web
npm install

# 启动开发服务器 (使用 Doppler)
doppler run --project oece-tech-prod --config dev -- npm run dev

# 访问
# http://localhost:3000
\`\`\`

### 部署到生产

\`\`\`bash
# 使用部署脚本
./scripts/deploy.sh prod

# 或手动部署
cd apps/web
doppler run --project oece-tech-prod --config prod -- npm run build
firebase deploy --project oece-tech-firebase
\`\`\`

---

## 🔧 技术栈

| 层次 | 技术 | 版本 |
|------|------|------|
| **前端框架** | Next.js | 16.0.5 |
| **UI 库** | React | 19.2.0 |
| **样式** | TailwindCSS | 4.x |
| **语言** | TypeScript | 5.x |
| **搜索** | Algolia | 5.22.0 |
| **数据库** | MongoDB | 7.x |
| **缓存** | Upstash Redis | 1.35.7 |
| **监控** | Sentry | Latest |
| **部署** | Firebase + GCP | Latest |

---

## 📊 包含的项目

### 核心应用
- **oece-tech**: Next.js 前端应用 (2.1 MB)
- **web3-ai-game**: 基础配置和工具

### AI 工具
- **sms-agentic-tg-bot**: Telegram 双 AI 机器人 (872 KB)

### SDK & 工具
- **420420**: 火计划 SDK (1.9 MB)

### 知识库
- **db**: 核心数据备份 (490 MB, 2335 文件)
- **legacy-repos-archive**: 历史项目 (157 MB, 24 项目)
- **sms-vault-30repos-compressed**: 精炼库 (25 MB)

### 部署工具
- **gcp-dev-environment**: GCP 监控配置 (4.1 MB)
- **gcp-sms-deployment**: 部署脚本 (280 KB)

---

## 📈 开发路线图

### Phase 1: 基础框架 (Week 1-2) ✓
- [x] 项目结构搭建
- [x] 基础文档创建
- [ ] 环境配置完成
- [ ] CI/CD 配置

### Phase 2: 核心功能 (Week 3-5)
- [ ] 项目导航页面
- [ ] 搜索功能集成
- [ ] 知识库展示
- [ ] API 开发

### Phase 3: AI 集成 (Week 6-7)
- [ ] Telegram Bot 集成
- [ ] AI 工具展示
- [ ] 智能推荐

### Phase 4: 部署上线 (Week 8-9)
- [ ] 生产环境部署
- [ ] 性能优化
- [ ] 监控配置
- [ ] 正式上线

---

## 🔗 相关链接

- **网站**: https://oece.tech (待上线)
- **文档**: [docs/](docs/)
- **API 文档**: [docs/API.md](docs/API.md)
- **部署指南**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📝 环境变量

参考 `docs/DEPLOYMENT.md` 或使用 Doppler:

\`\`\`bash
doppler run --project oece-tech-prod --config dev -- npm run dev
\`\`\`

主要环境变量:
- `MONGODB_URI`: MongoDB 连接字符串
- `ALGOLIA_APP_ID`: Algolia 应用 ID
- `ALGOLIA_ADMIN_API_KEY`: Algolia 管理密钥
- `TELEGRAM_BOT_TOKEN`: Telegram 机器人令牌
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN

---

**最后更新**: 2026-01-15  
**维护者**: web3-ai-game Team
