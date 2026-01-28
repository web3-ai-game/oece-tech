# 🏗️ DeepWeay.me 完整开发策略

> **更新时间:** 2025-11-05 20:50 UTC+7  
> **版本:** v3.0 - 容器化全栈架构

---

## 📋 核心文档

本文档已拆分为多个模块化文档：

1. **[GEMINI_STRATEGY.md](./GEMINI_STRATEGY.md)** - Gemini免费层终极榨取策略
2. **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Docker容器化部署方案
3. **[BOT_INTEGRATION.md](./BOT_INTEGRATION.md)** - 多平台Bot集成指南
4. **[.env.template](./.env.template)** - 完整环境变量配置模板
5. **[WINDSURF_COMMANDS.md](./WINDSURF_COMMANDS.md)** - Windsurf开发命令块

---

## 🎯 快速开始

### 1. 环境配置

```bash
# 复制环境变量模板
cp .env.template .env.local

# 编辑配置（填写必要的Token）
nano .env.local
```

**必填项：**
- ✅ `GEMINI_API_KEY` - 已配置
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - 已配置
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 已配置
- ✅ `TELEGRAM_BOT_TOKEN_1` - 已配置
- ✅ `TELEGRAM_BOT_TOKEN_2` - 已配置
- ⏳ `SLACK_BOT_TOKEN` - 待配置
- ⏳ `DATADOG_API_KEY` - 待配置

### 2. 本地开发

```bash
# 安装依赖
npm install --legacy-peer-deps

# 运行开发服务器
npm run dev

# 访问
open http://localhost:3000
```

### 3. Docker部署

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

---

## 📊 项目状态

| 模块 | 完成度 | 优先级 |
|------|--------|--------|
| Web应用 | 95% | P0 ✅ |
| Gemini集成 | 100% | P0 ✅ |
| Telegram Bot | 0% | P1 🔄 |
| Slack Bot | 0% | P2 ⏳ |
| 首页AI聊天 | 0% | P1 🔄 |
| Docker化 | 0% | P1 🔄 |
| 监控系统 | 0% | P2 ⏳ |

---

## 🚀 开发优先级（按Windsurf命令块顺序）

### Phase 1: 基础设施（本周）

**命令块0: 项目环境设置**
- [x] Gemini SDK集成
- [x] 环境变量配置
- [ ] Rate Limiter实现
- [ ] 翻译队列系统

**命令块1: BBS自动翻译**
- [ ] 翻译API接口
- [ ] 发帖后自动翻译
- [ ] 双语内容存储

### Phase 2: Bot开发（本月）

**Telegram Bot 1 (小爱同学)**
- [ ] Grammy框架集成
- [ ] PRO会员验证
- [ ] Gemini对话功能
- [ ] Docker容器化

**Telegram Bot 2 (备用)**
- [ ] 相同架构
- [ ] 功能定制
- [ ] 负载分流

### Phase 3: 多平台扩展（下月）

- [ ] Slack Bot开发
- [ ] WhatsApp集成
- [ ] Line Bot集成
- [ ] 首页AI聊天窗口

---

## 🔐 Token配置清单

### 已完成 ✅

- [x] Gemini API Key: `AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ`
- [x] Supabase URL: `https://qhgdymgxcbyhtxezvoqt.supabase.co`
- [x] Telegram Bot 1: `8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg`
- [x] Telegram Bot 2: `7602987646:AAF-bR1EQuHEi7lmXhWVYOVQurciTKnv15M`
- [x] Telegram Admin ID: `8058330099`

### 待配置 ⏳

**Slack (优先级: P2)**
1. 创建Slack App: https://api.slack.com/apps
2. 启用Socket Mode
3. 获取Token:
   - `SLACK_BOT_TOKEN` (xoxb-)
   - `SLACK_APP_TOKEN` (xapp-)
   - `SLACK_SIGNING_SECRET`
4. 创建频道: 通用/英文/中文/PRO

**监控 (优先级: P2)**
1. Datadog: https://app.datadoghq.com/
2. 获取API Key
3. 配置Agent

**支付 (优先级: P3)**
1. Stripe测试模式
2. 配置Webhook

---

## 📁 目录结构

```
studio/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React组件
│   ├── lib/
│   │   ├── gemini/       # Gemini AI集成
│   │   │   ├── client.ts
│   │   │   ├── rate-limiter.ts
│   │   │   └── translation-queue.ts
│   │   └── supabase/     # Supabase集成
│   └── types/
├── telegram-bot/         # TG Bot容器
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── slack-bot/            # Slack Bot容器
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker编排
├── .env.template         # 环境变量模板
├── GEMINI_STRATEGY.md    # Gemini策略文档
├── DOCKER_SETUP.md       # Docker部署文档
└── BOT_INTEGRATION.md    # Bot集成文档
```

---

## 📞 联系方式规划

### Footer联系方式配置

**已有:**
- Website: https://deepweay.me
- GitHub: https://github.com/web3-ai-game/studio

**待添加:**
- Telegram中文群: `TELEGRAM_GROUP_ZH`
- Telegram英文群: `TELEGRAM_GROUP_EN`
- Slack工作区: `SLACK_WORKSPACE_URL`
- Slack付费群: `SLACK_CHANNEL_PRO`
- WhatsApp: `WHATSAPP_DISPLAY_NUMBER`
- Line: `LINE_BOT_NAME`

### 社群架构

```
DeepWeay社群体系
├── 免费社群
│   ├── Telegram中文群 (公开)
│   ├── Telegram英文群 (公开)
│   └── Slack通用频道 (邀请)
└── PRO会员专属
    ├── Telegram私密频道
    ├── Slack PRO频道
    ├── 1对1 Bot对话
    └── WhatsApp群组
```

---

## 🎯 Windsurf开发策略

基于Notion文档的命令块系统：

### 使用方式

1. 在Windsurf输入: `@Notion 执行命令块0`
2. 或复制命令到Windsurf执行
3. 按顺序完成各命令块

### 命令块清单

- **命令块0:** Gemini SDK集成 ✅
- **命令块1:** BBS自动翻译 🔄
- **命令块2:** AI工具开发 ⏳
- **命令块3:** Telegram Bot ⏳
- **命令块4:** 监控系统 ⏳

详见: [WINDSURF_COMMANDS.md](./WINDSURF_COMMANDS.md)

---

## 🔗 相关链接

**项目:**
- GitHub: https://github.com/web3-ai-game/studio
- 域名: https://deepweay.me
- VPS: 188.166.180.96

**Notion文档:**
- Gemini策略: https://www.notion.so/DeepWeay-me-Gemini-2a26b9c2d3798192a39cf93230061ff0
- Windsurf命令: https://www.notion.so/Windsurf-DeepWeay-2a26b9c2d379814d99f1fd613bcc39ca

**官方文档:**
- Gemini API: https://ai.google.dev/docs
- Supabase: https://supabase.com/docs
- Telegram Bot: https://core.telegram.org/bots/api
- Slack API: https://api.slack.com/
- Next.js: https://nextjs.org/docs

---

**文档更新:** 2025-11-05 20:50 UTC+7  
**下次更新:** 完成命令块1后
