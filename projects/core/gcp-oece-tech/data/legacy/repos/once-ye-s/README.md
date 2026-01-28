# Multi-Platform Message Aggregation & AI Analysis System
# 多平台消息聚合与AI智能分析系统

## 📋 项目概述 (Project Overview)

这是一个完整的消息聚合和智能分析系统，通过Docker容器化部署，集成多个通讯平台，使用Gemini 2.5 Flash进行智能分析，最终通过Telegram Bot提供统一的管理界面。

### 核心功能 (Core Features)

- 🤖 **智能Telegram Bot**: 支持管理员面板、内联按钮、群组被动回复和私聊主动交互
- 🔄 **多平台消息聚合**: Telegram、Notion、Slack、WhatsApp、Line、Facebook、X (Twitter)
- 🧠 **AI智能分析**: 使用Gemini 2.5 Flash API进行消息分析和处理
- 🐳 **完全容器化**: Docker Compose一键部署
- ⚡ **实时路由**: 所有消息路由 → 容器 → 分析 → Telegram
- 📊 **速率控制**: 智能API调用限制（1000次/天，30秒轮询）

---

## 🏗️ 系统架构 (System Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    Message Sources (消息源)                   │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────┤
│ Telegram │  Notion  │  Slack   │ WhatsApp │   Line   │  X   │
│          │          │          │ Facebook │          │      │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴──┬───┘
     │          │          │          │          │        │
     └──────────┴──────────┴──────────┴──────────┴────────┘
                            │
                    ┌───────▼───────┐
                    │   Collectors  │  (消息收集器)
                    │   Container   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │    Router     │  (路由系统)
                    │   Container   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │ Gemini 2.5    │  (AI分析)
                    │   Analyzer    │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │  Telegram Bot │  (管理界面)
                    │   Container   │
                    └───────────────┘
                            │
                        Your TG
```

---

## 📁 项目结构 (Project Structure)

```
once-ye-s/
├── docker-compose.yml          # Docker编排文件
├── .env.example               # 环境变量示例
├── README.md                  # 本文件
├── TUTORIAL.md               # 详细教程
│
├── src/
│   ├── bot/                  # Telegram Bot
│   │   ├── main.py          # Bot主程序
│   │   ├── handlers.py      # 消息处理器
│   │   ├── keyboards.py     # 内联键盘
│   │   └── admin.py         # 管理员功能
│   │
│   ├── collectors/           # 消息收集器
│   │   ├── telegram_collector.py
│   │   ├── notion_collector.py
│   │   ├── slack_collector.py
│   │   ├── whatsapp_collector.py
│   │   ├── line_collector.py
│   │   ├── facebook_collector.py
│   │   └── x_collector.py
│   │
│   ├── analyzer/             # AI分析器
│   │   ├── gemini_client.py
│   │   ├── rate_limiter.py
│   │   └── analyzer.py
│   │
│   ├── router/               # 路由系统
│   │   ├── message_router.py
│   │   ├── queue_manager.py
│   │   └── middleware.py
│   │
│   └── common/               # 共用模块
│       ├── config.py
│       ├── database.py
│       └── logger.py
│
├── docker/                   # Docker配置
│   ├── bot.Dockerfile
│   ├── collectors.Dockerfile
│   ├── analyzer.Dockerfile
│   └── router.Dockerfile
│
├── docs/                     # 文档
│   ├── API_SETUP.md         # API配置指南
│   ├── DEPLOYMENT.md        # 部署指南
│   └── TROUBLESHOOTING.md   # 故障排除
│
└── scripts/                  # 工具脚本
    ├── setup.sh             # 初始化脚本
    └── health_check.sh      # 健康检查
```

---

## 🚀 快速开始 (Quick Start)

### 1. 环境准备

```bash
# 克隆仓库
git clone https://github.com/web3-ai-game/once-ye-s.git
cd once-ye-s

# 复制环境变量文件
cp .env.example .env

# 编辑环境变量，填入你的API密钥
nano .env
```

### 2. 配置API密钥

在 `.env` 文件中配置以下API密钥：

```env
# Telegram Bot Token (从 @BotFather 获取)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_ID=your_telegram_user_id

# Gemini API (从 Google AI Studio 获取)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Rate Limiting
GEMINI_MAX_CALLS_PER_DAY=1000
POLLING_INTERVAL=30

# 其他平台API (可选)
NOTION_API_KEY=your_notion_key
SLACK_BOT_TOKEN=your_slack_token
# ... 更多配置
```

### 3. 启动系统

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看运行状态
docker-compose ps
```

### 4. 验证部署

```bash
# 健康检查
./scripts/health_check.sh

# 测试Telegram Bot
# 在Telegram中向你的Bot发送 /start
```

---

## 🤖 Telegram Bot 使用指南

### 私聊功能 (Private Chat)

与Bot私聊时，你会看到管理员面板：

```
🎛️ 管理员控制面板

请选择功能：
[📊 查看统计]  [⚙️ 系统设置]
[🔍 消息查询]  [📝 日志查看]
[🔄 重启服务]  [📤 导出数据]
```

**特点**：
- ✅ 无需斜杠命令，直接对话
- ✅ 内联按钮快速操作
- ✅ 实时状态更新
- ✅ AI智能回复

### 群组功能 (Group Chat)

在群组中，Bot只会被动回复：

- 有人@提及Bot时回复
- 回复Bot的消息时响应
- 关键词触发（可配置）

---

## 🔧 详细配置指南

### Telegram Bot配置

1. **创建Bot**
   ```
   1. 在Telegram搜索 @BotFather
   2. 发送 /newbot
   3. 按提示设置Bot名称和用户名
   4. 获取Bot Token
   ```

2. **获取你的User ID**
   ```
   1. 在Telegram搜索 @userinfobot
   2. 发送任意消息
   3. 获取你的User ID
   ```

3. **设置Bot权限**
   ```
   发送给 @BotFather:
   /setprivacy - 启用/禁用隐私模式
   /setjoingroups - 允许Bot加入群组
   /setcommands - 设置命令列表
   ```

### Gemini API配置

1. **获取API Key**
   - 访问: https://aistudio.google.com/app/apikey
   - 创建API密钥
   - 选择Gemini 2.5 Flash模型

2. **速率限制说明**
   - 免费版: 15 RPM (每分钟请求数)
   - Pro版: 1000次/天
   - 建议设置30秒轮询间隔

### 其他平台API配置

详见 `docs/API_SETUP.md`

---

## 📊 功能特性详解

### 1. 智能消息路由

所有消息通过统一路由系统：

```python
消息源 → 收集器 → 队列 → 路由器 → AI分析 → 处理 → Telegram
```

### 2. AI分析功能

- 消息分类和标签
- 重要性评分
- 情感分析
- 自动摘要
- 智能回复建议

### 3. 管理员面板

通过内联按钮提供：
- 实时统计数据
- 系统配置
- 日志查看
- 服务控制
- 数据导出

### 4. 安全特性

- 管理员身份验证
- API密钥加密存储
- 请求速率限制
- 消息内容过滤

---

## 🐳 Docker部署详解

### 容器说明

1. **bot-container**: Telegram Bot服务
2. **collectors-container**: 消息收集服务
3. **analyzer-container**: Gemini AI分析服务
4. **router-container**: 路由和队列管理
5. **redis-container**: 消息队列和缓存
6. **postgres-container**: 数据持久化

### 资源配置

```yaml
# 推荐配置
bot: 512MB RAM, 0.5 CPU
collectors: 1GB RAM, 1 CPU
analyzer: 512MB RAM, 0.5 CPU
router: 512MB RAM, 0.5 CPU
redis: 256MB RAM
postgres: 512MB RAM
```

---

## 📖 完整教程

详细的分步教程请查看 [TUTORIAL.md](./TUTORIAL.md)

内容包括：
- 从零开始的VPS配置
- 每个组件的详细实现
- API集成步骤
- 故障排除指南
- 最佳实践

---

## 🔍 监控和维护

### 查看日志

```bash
# 所有服务日志
docker-compose logs -f

# 特定服务日志
docker-compose logs -f bot
docker-compose logs -f analyzer
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart bot
```

### 备份数据

```bash
# 备份数据库
docker-compose exec postgres pg_dump -U user dbname > backup.sql

# 备份Redis数据
docker-compose exec redis redis-cli SAVE
```

---

## 🛠️ 常见问题

### Bot无法响应

1. 检查Token是否正确
2. 确认网络连接
3. 查看容器日志

### API调用限制

1. 检查速率限制设置
2. 增加轮询间隔
3. 升级到Pro版本

### 消息丢失

1. 检查Redis连接
2. 查看队列状态
3. 增加重试机制

---

## 📚 参考资料

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Gemini API](https://ai.google.dev/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Python Telegram Bot](https://python-telegram-bot.org/)

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

Created for web3-ai-game

---

## 🎯 下一步计划

- [ ] 添加Web管理面板
- [ ] 支持更多消息平台
- [ ] 实现消息搜索功能
- [ ] 添加数据分析dashboard
- [ ] 支持插件系统

---

**让我们开始构建你的智能消息中枢！** 🚀
