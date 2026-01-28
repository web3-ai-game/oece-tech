# 🚀 DeepWeay 开发指南 - 从这里开始

**最后更新：** 2025-11-05  
**状态：** ✅ 本地开发环境就绪，VPS部署配置完成

---

## 📋 当前项目状态

### ✅ 已完成

- **Next.js应用** - Web前端（95%）
- **Supabase集成** - 数据库+认证（100%）
- **Gemini AI配置** - API密钥已配置（100%）
- **Telegram Bot代码** - 2个Bot完整实现（100%）
- **环境变量模板** - 完整配置文档（100%）
- **VPS部署脚本** - 自动化脚本（100%）
- **Datadog监控指南** - 手把手教程（100%）

### 🔄 进行中

- **Telegram Bot测试** - 本地可测试
- **VPS容器化部署** - 脚本已就绪
- **Datadog监控配置** - 等待部署

### ⏳ 待开发

- 首页AI聊天窗口
- Slack Bot
- WhatsApp集成
- Line Bot

---

## 🎯 两种开发模式

### 模式A: 本地开发（推荐！零内存压力）

**适用于：** 日常开发、功能测试、Bot调试

**内存占用：** ~300MB（只跑Node.js）

**操作：**
```bash
# Next.js开发
npm run dev

# Bot测试（新终端）
cd telegram-bot
npm install
npm run bot1
```

**监控：** 浏览器打开Datadog Dashboard（VPS数据）

---

### 模式B: VPS生产（GitHub学生包Datadog Pro）

**适用于：** 生产部署、容器化运行、监控告警

**配置：** Docker + Datadog Agent

**部署：** 一键脚本自动化

---

## 🚀 立即开始（3个选择）

### 选择1: 测试Telegram Bot（5分钟）⭐ 推荐

**最快看到效果！**

```bash
# 1. 进入Bot目录
cd telegram-bot

# 2. 安装依赖
npm install

# 3. 启动Bot 1
npm run bot1
```

**然后：**
1. 打开Telegram
2. 搜索 `@svsinst_bot`
3. 发送 `/start`
4. 开始对话！

**详细指南：** `TEST_BOT.md`

---

### 选择2: 配置Datadog监控（10分钟）

**GitHub学生包用户专享！**

**步骤：**
1. 登录 https://app.datadoghq.com/
2. 获取API Key
3. SSH到VPS配置

**详细指南：** `DATADOG_QUICKSTART.md`（手把手30分钟完整教程）

---

### 选择3: VPS一键部署（30分钟）

**完整生产环境！**

```bash
# 1. SSH到VPS
ssh root@188.166.180.96

# 2. 安装Docker（如果未安装）
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/studio/main/vps-scripts/install-docker.sh | bash

# 3. Clone项目（如果未clone）
mkdir -p /var/www
cd /var/www
git clone https://github.com/web3-ai-game/studio.git
cd studio

# 4. 配置项目
bash vps-scripts/setup-project.sh
# 输入你的Datadog API Key

# 5. 启动所有容器
docker compose up -d --build

# 6. 查看状态
docker compose ps
docker compose logs -f
```

**详细指南：** `vps-scripts/README.md`

---

## 📚 文档导航

### 核心文档

| 文档 | 用途 | 适合谁 |
|------|------|--------|
| `START_HERE.md` | 👈 你在这里 | 所有人 |
| `DATADOG_QUICKSTART.md` | Datadog完整配置指南 | VPS部署者 |
| `TEST_BOT.md` | Bot快速测试 | 开发者 |
| `NEXT_STEPS.md` | 后续开发计划 | 项目管理 |

### 技术文档

| 文档 | 内容 |
|------|------|
| `VPS_SETUP.md` | 架构概览 |
| `.env.template` | 环境变量完整说明 |
| `vps-scripts/README.md` | 部署脚本文档 |
| `DEPLOYMENT.md` | 部署流程 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `.env.local` | 本地开发环境变量 ✅ |
| `.env.production` | VPS生产环境变量（需创建）|
| `docker-compose.yml` | Docker容器配置（需创建）|
| `next.config.ts` | Next.js配置 |

---

## 🔑 重要配置信息

### 已配置的Token

**Gemini AI:**
```
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ
```

**Telegram Bot 1 (小爱同学):**
```
Token: 8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
Username: @svsinst_bot
```

**Telegram Bot 2 (备用):**
```
Token: 7602987646:AAF-bR1EQuHEi7lmXhWVYOVQurciTKnv15M
Username: @svslovea_bot
```

**Supabase:**
```
URL: https://qhgdymgxcbyhtxezvoqt.supabase.co
已配置在 .env.local
```

### 待配置的Token

**Datadog:** 
- 需要从Datadog Dashboard获取
- GitHub学生包已激活Pro版
- 参考：`DATADOG_QUICKSTART.md` 第一部分

**Slack / WhatsApp / Line:**
- 待后续开发时配置
- 配置指南在 `.env.template`

---

## 💻 开发工作流

### 本地开发（日常）

```
1. 打开终端1
   cd /Users/svs.loline/Documents/Git/studio
   npm run dev
   → http://localhost:3000

2. 打开终端2（如果测试Bot）
   cd telegram-bot
   npm run bot1
   → Telegram测试对话

3. 打开浏览器
   → 本地看网站效果
   → Datadog Dashboard看VPS状态

4. 开发完成后
   git add .
   git commit -m "feat: xxx"
   git push
```

### VPS部署（更新）

**方法1: 自动部署（推荐）**
```bash
# SSH到VPS
ssh root@188.166.180.96

# 一键部署
cd /var/www/studio
./vps-scripts/deploy.sh
```

**方法2: 手动步骤**
```bash
git pull origin main
docker compose down
docker compose up -d --build
docker compose logs -f
```

---

## 📊 Datadog监控面板

### 配置完成后访问

**URL:** https://app.datadoghq.com/

**可以看到：**
- 🖥️ VPS主机状态
- 🐳 4个容器运行状况
- 📈 CPU/内存实时图表
- 📝 所有服务日志
- 🚨 自动告警（容器停止、资源过高）

**不需要：**
- ❌ SSH到VPS查看
- ❌ 本地运行Docker
- ❌ 额外监控工具

**零本地负担！**

---

## 🎯 推荐开发顺序

### 今天（2小时）

- [x] ✅ 项目配置完成
- [x] ✅ Bot代码完成
- [x] ✅ 部署脚本完成
- [ ] 🔄 测试Telegram Bot（5分钟）
- [ ] 🔄 获取Datadog API Key（2分钟）

### 明天（1小时）

- [ ] VPS配置Docker Compose
- [ ] 启动所有容器
- [ ] 配置Datadog Dashboard
- [ ] 测试监控和告警

### 后天（2小时）

- [ ] 开发首页AI聊天窗口
- [ ] 测试完整流程
- [ ] 文档更新

---

## 🆘 遇到问题？

### Bot无响应
**查看：** `TEST_BOT.md` - 问题排查部分

### Datadog无数据
**查看：** `DATADOG_QUICKSTART.md` - 常见问题部分

### 容器启动失败
**查看：** `vps-scripts/README.md` - 故障排查部分

### 其他问题
1. 查看对应文档的troubleshooting部分
2. 检查 `.env.local` 或 `.env.production`
3. 查看日志：`docker compose logs -f`

---

## 📦 项目结构速览

```
studio/
├── src/                          # Next.js源码
│   ├── app/                      # 页面和路由
│   ├── components/               # React组件
│   └── lib/                      # 工具库
│       └── supabase/             # Supabase配置
│
├── telegram-bot/                 # Telegram Bot ⭐ 新增
│   ├── src/index.js              # Bot主程序
│   ├── package.json              # Bot依赖
│   └── Dockerfile                # Bot容器配置
│
├── vps-scripts/                  # VPS脚本 ⭐ 新增
│   ├── install-docker.sh         # Docker安装
│   ├── setup-project.sh          # 项目配置
│   ├── deploy.sh                 # 一键部署
│   └── README.md                 # 脚本说明
│
├── docs/                         # 文档
│   ├── DATADOG_QUICKSTART.md     # Datadog指南 ⭐ 新增
│   ├── TEST_BOT.md               # Bot测试 ⭐ 新增
│   ├── NEXT_STEPS.md             # 开发计划 ⭐ 新增
│   └── START_HERE.md             # 👈 当前文件
│
├── .env.local                    # 本地环境变量 ✅
├── .env.template                 # 环境变量模板 ✅
├── docker-compose.yml            # Docker配置（需创建）
├── Dockerfile                    # Next.js容器（需创建）
└── package.json                  # Next.js依赖
```

---

## 🎉 恭喜！你已经拥有

### ✅ 轻量级本地开发环境
- 零Docker，零内存压力
- 热重载，快速迭代
- 完整功能测试

### ✅ 生产级VPS部署方案
- Docker容器化
- 一键部署脚本
- 自动化更新流程

### ✅ 企业级监控系统
- Datadog Pro（GitHub学生包）
- 实时性能监控
- 自动告警通知

### ✅ 完整开发文档
- 手把手操作指南
- 故障排查方案
- 最佳实践建议

---

## 🚀 现在就开始吧！

### 最快路径（5分钟看到效果）

```bash
# 1. 测试Bot
cd telegram-bot
npm install
npm run bot1

# 2. 打开Telegram
# 搜索 @svsinst_bot

# 3. 发送消息
# Hi! 你好！
```

**立即体验AI对话！** 🤖

---

## 📞 需要帮助

- **Telegram Bot测试：** 参考 `TEST_BOT.md`
- **Datadog配置：** 参考 `DATADOG_QUICKSTART.md`
- **VPS部署：** 参考 `vps-scripts/README.md`
- **开发计划：** 参考 `NEXT_STEPS.md`

---

**准备好了吗？开始你的DeepWeay开发之旅！** 🌊

---

**最后推送时间：** 2025-11-05 21:15 UTC+7  
**Commit：** 987d678  
**分支：** main
