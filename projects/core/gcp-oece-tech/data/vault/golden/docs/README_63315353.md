# 🌊 DeepWeay - Urban Diver Platform

> **Deep Dive into Digital Nomad 2.0**  
> 都市潜航者 · 深潜数字游民新纪元

Cyberpunk风格数字游民社区平台 · AI工具 · Telegram Bot · 企业级监控

---

## ⚡ 快速开始

### 本地开发

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

### VPS部署

```bash
ssh root@188.166.180.96
cd /var/www/studio && git pull
docker compose up -d --build
```

**完整指南：** 查看 [START_HERE.md](./START_HERE.md)

---

## 🎯 核心功能

- 🔐 邀请码认证系统
- 💬 BBS论坛社区
- 🤖 Telegram Bot（2个）
- 🌍 AI工具集（Gemini Flash）
- 📊 Datadog实时监控
- 🐳 Docker容器化部署

---

## 🛠️ 技术栈

**前端:** Next.js 15 + React 19 + TailwindCSS  
**后端:** Supabase + Gemini AI  
**Bot:** Grammy + Telegram API  
**监控:** Datadog Agent  
**部署:** Docker + VPS

---

## 📚 文档

### 必读
- **[START_HERE.md](./START_HERE.md)** - 快速入门
- **[docs/DEPLOY_NOW.md](./docs/DEPLOY_NOW.md)** - 5分钟部署

### 详细文档
所有技术文档在 `docs/` 目录：
- DATADOG_QUICKSTART.md - 监控配置
- TEST_BOT.md - Bot测试
- VPS_SETUP.md - 架构说明
- NEXT_STEPS.md - 开发计划

---

## 🤖 Telegram Bots

- **@svsinst_bot** - PRO会员AI对话
- **@svslovea_bot** - 备用Bot

---

## 📊 监控

**Datadog Dashboard:** https://us5.datadoghq.com/  
（GitHub学生包2年免费Pro版）

---

## 🎨 设计理念

**Cyberpunk Minimalism**
- 暗色主题 + 霓虹色调
- 移动优先响应式
- 保持神秘感和深度

**Urban Diver精神**
- 深潜数字游民生活
- 探索隐秘都市空间
- 地理套利深度应用

---

## 🌍 语言支持

- 🇬🇧 English（默认）
- 🇹🇼 繁體中文
- ❌ 不支持简体中文

---

## 📦 项目结构

```
studio/
├── src/              # Next.js应用
├── telegram-bot/     # Telegram Bot
├── docs/             # 📚 完整文档
├── vps-scripts/      # VPS自动化脚本
└── docker-compose.yml
```

---

## 🔧 常用命令

```bash
# 本地开发
npm run dev

# Bot测试
cd telegram-bot && npm run bot1

# VPS部署
docker compose up -d --build

# 查看日志
docker compose logs -f
```

---

## 📞 联系

- **Telegram:** @svsinst_bot
- **网站:** https://deepweay.me
- **GitHub:** github.com/web3-ai-game/studio

---

**🌊 Deep Dive into the Urban Future · 潜入都市未来**
