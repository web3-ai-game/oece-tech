# 🌊 web3-ai-game 完整项目资产总览

> **扫描时间**: 2026-01-15  
> **总项目数**: 27 个  
> **总资产规模**: ~1.3 GB  
> **GitHub 用户**: web3-ai-game

---

## 📌 快速导航

- **[完整项目分析](./PROJECT_ANALYSIS.md)** - 深度扫描报告，包含所有项目的详细信息
- **[GitHub 仓库首页](https://github.com/web3-ai-game)** - 浏览在线版本

---

## 🎯 核心资产分布

### 📚 知识库/数据资产 (1.17 GB - 90%)

这是你的最大资产，包含了核心的数据和知识库：

| 项目 | 大小 | 说明 |
|------|------|------|
| **db** | 490 MB | 数据库存档 (2335 文件，主要为 Markdown) |
| **MD** | 482 MB | Novel AI 推演引擎，基于 1016 本中文小说 |
| **legacy-repos-archive** | 157 MB | 24 个历史项目的统一归档 |
| **sms-complete-archive-final** | 70 MB | SMS 工作区最终备份，208MB全资产压缩版 |

**特点**：
- 主要以 Markdown 文档和数据为主 (占比 80%)
- 包含 AI 训练数据和知识蒸馏成果
- 是整个生态的基础数据层

---

### 🚀 核心产品系统 (200+ MB - 9%)

实际运行的产品和服务：

| 项目 | 大小 | 类型 | 说明 |
|------|------|------|------|
| **sms-vault-30repos-compressed** | 25 MB | TypeScript | 30 仓库精炼，高密度知识库 |
| **svs-hotel-combined** | 11 MB | TypeScript | SVS Hotel 项目统合版 |
| **gcp-distilled-knowledge** | 23 MB | JavaScript | GCP 蒸馏知识库 |
| **oece-tech** | 2.1 MB | Node.js + React + Next.js | 极客母艦导航项目 |
| **420420 (火计划)** | 1.9 MB | Node.js + Next.js | 核心机密配置 SDK |
| **sms-agentic-tg-bot** | 872 KB | JavaScript | Telegram 双 AI 机器人系统 |
| **deepweay-me** | 888 KB | TypeScript | 赛博算命 AI 聊天 |

**特点**：
- 以 Next.js 和 TypeScript 为主技术栈
- 包含前端、API 和 AI 集成
- 重点在于用户交互和实时服务

---

### 🔧 部署/基建系统 (50+ MB - 0.5%)

云端部署和系统运维：

| 项目 | 类型 | 说明 |
|------|------|------|
| **gcp-dev-environment** | JavaScript | GCP 完整监控系统，PM2 持久化 |
| **gcp-sms-deployment** | Shell | GCP SMS 部署文档 |
| **do-n8n** | 自动化 | DigitalOcean N8n 配置 |
| **sms-key** | Shell | 安全密钥管理系统 |

**特点**：
- 主要针对 GCP 和 DO 平台
- 包含 PM2、N8n 等运维工具
- 支持自动化部署和监控

---

### 🤖 AI 工具集

| 项目 | 说明 |
|------|------|
| **ebook-converter** | Python 电子书转换工具 |
| **sms-key** | API 密钥和环境变量管理 |

---

### 🗂️ 备份/归档区

- **backup-20251127** - 2025-11-27 备份
- **web3-start** - Web3 启动工具集
- **special-disco** - 特殊项目归档
- **ssssssss** - VPS 一键配置
- **oece-www-https** - HTTPS 网站版本
- **deepseet-knowledge-base** - 知识库备份
- **sms-digital-assets-ultra** - 资产压缩版

---

## 🛠️ 技术栈全景

### 主要编程语言分布

```
TypeScript  ██████████ 最主流 (Next.js、React、SDK)
JavaScript  █████████  前端和 Node.js
Python      ████       数据处理和 AI 工具
Markdown    ███████████ 文档和知识库 (占比最大)
```

### 核心技术框架

| 技术 | 使用项数 | 用途 |
|------|--------|------|
| **Next.js** | 4+ | Web 全栈框架 |
| **React** | 4+ | 前端组件库 |
| **TypeScript** | 8+ | 类型安全开发 |
| **Node.js** | 6+ | 后端运行时 |
| **Notion API** | 2+ | 知识管理 |
| **Gemini/Claude API** | 3+ | AI 模型集成 |
| **GCP** | 3+ | 云平台部署 |

---

## 📊 项目成熟度评估

### 🟢 生产就绪 (可直接使用)
- oece-tech - 项目导航
- sms-agentic-tg-bot - Telegram 机器人
- ebook-converter - 电子书转换
- gcp-dev-environment - 部署系统

### 🟡 半成品 (需要完成)
- 420420 (火计划) - SDK 迁移中
- svs-hotel-combined - 合并版本
- deepweay-me - AI 聊天应用
- notion-sms - 知识库管理

### 🔴 归档/备份 (参考价值)
- db - 数据备份
- MD - 知识库存档
- legacy-repos-archive - 历史项目
- 其他备份项目

---

## 🚀 快速开始指南

### 1. 项目浏览
```bash
cd /mnt/sms
ls -1d */          # 查看所有项目
cd 项目名称        # 进入具体项目
cat README.md      # 查看项目说明
```

### 2. 核心文件位置
- **前端代码**: 各项目中的 `src/`, `components/`, `pages/`
- **API 文档**: 项目根目录的 `README.md`
- **配置文件**: `.env.example`, `next.config.ts`, `package.json`
- **数据库**: `db/` 项目中的 JSON/CSV 文件

### 3. 部署参考
- GCP 部署文档: `gcp-deployment/`, `gcp-dev-environment/`
- 环境配置: `sms-key/`, 参照示例修改
- N8n 工作流: `do-n8n/`

---

## 🎓 项目组织建议

### 建议的组织结构
```
web3-ai-game/
├── 知识库/          (MD, db, legacy-repos-archive)
├── 核心产品/        (oece-tech, 420420, deepweay-me)
├── 部署运维/        (gcp-*, sms-key, do-n8n)
├── AI工具/          (sms-agentic-tg-bot, ebook-converter)
└── 备份存档/        (其他)
```

### 关键依赖关系
```
产品系统 ← 知识库/数据
   ↓
部署运维 → GCP/Cloud
   ↓
用户交互 ← AI工具集
```

---

## 📈 下一步行动

### 立即执行
- [ ] 按类别整理项目文件夹结构
- [ ] 为核心产品补充 deployment scripts
- [ ] 统一 API 文档格式
- [ ] 建立 CI/CD 流程

### 中期规划
- [ ] 整合 MD 和 db 为统一知识库
- [ ] 提升 sms-agentic-tg-bot 到生产级别
- [ ] 完成 420420 的 SDK 迁移
- [ ] 优化 GCP 部署流程

### 长期愿景
- [ ] 整个生态的云原生改造
- [ ] API 网关统一管理
- [ ] 微服务化拆分
- [ ] 自动化测试覆盖

---

## 📝 文件清单

本目录下的重要文件：

| 文件 | 说明 |
|------|------|
| **README.md** (本文件) | 项目全景概览和快速导航 |
| **PROJECT_ANALYSIS.md** | 深度扫描报告，包含所有项目详情 |
| **PROJECT_SUMMARY.md** | 项目基础信息总结 |

---

## 🔗 相关链接

- **GitHub 主账户**: https://github.com/web3-ai-game
- **核心项目**:
  - oece-tech: https://github.com/web3-ai-game/oece-tech
  - sms-agentic-tg-bot: https://github.com/web3-ai-game/sms-agentic-tg-bot
  - MD: https://github.com/web3-ai-game/MD

---

## 📞 支持和反馈

需要帮助？查看：
1. 项目内的 README.md
2. PROJECT_ANALYSIS.md 中的详细说明
3. 各项目的 GitHub Issues

---

**最后更新**: 2026-01-15 | **总扫描时间**: ~5分钟 | **数据完整性**: 100%
