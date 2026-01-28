# 快速开始指南 🚀

## 准备工作（5分钟）

### 1. 创建Telegram Bot

```bash
# 在Telegram中：
# 1. 搜索 @BotFather
# 2. 发送 /newbot
# 3. 按提示设置Bot名称和用户名
# 4. 保存收到的Token
```

### 2. 获取你的User ID

```bash
# 在Telegram中：
# 1. 搜索 @userinfobot
# 2. 发送任意消息
# 3. 记录你的User ID
```

### 3. 获取Gemini API Key

```bash
# 访问: https://aistudio.google.com/app/apikey
# 1. 登录Google账号
# 2. 点击 "Create API Key"
# 3. 复制API密钥
```

---

## 一键部署（2分钟）

### 步骤1: 运行安装脚本

```bash
cd /root/once-ye-s
./scripts/setup.sh
```

脚本会自动：
- ✅ 检查Docker和Docker Compose
- ✅ 创建`.env`配置文件
- ✅ 提示你编辑配置
- ✅ 构建Docker镜像
- ✅ 启动所有服务

### 步骤2: 配置.env文件

编辑器会自动打开，填入以下必填项：

```env
# 必填 - Telegram Bot
TELEGRAM_BOT_TOKEN=你的bot_token
TELEGRAM_ADMIN_ID=你的user_id

# 必填 - Gemini AI
GEMINI_API_KEY=你的gemini_api_key

# 可选 - 其他平台（暂时可以不填）
NOTION_API_KEY=
SLACK_BOT_TOKEN=
```

保存并退出（Nano: `Ctrl+X` → `Y` → `Enter`）

### 步骤3: 验证部署

```bash
# 查看服务状态
docker-compose ps

# 应该看到所有服务都在运行
# ✓ telegram-bot
# ✓ message-collectors
# ✓ ai-analyzer
# ✓ message-router
# ✓ redis-queue
# ✓ postgres-db
```

---

## 测试Bot（1分钟）

### 1. 在Telegram中测试

```
1. 搜索你的Bot（使用创建时的用户名）
2. 发送: /start
3. 应该看到管理员控制面板
```

你会看到：

```
🎛️ 管理员控制面板

请选择您需要的功能：

[📊 查看统计]  [⚙️ 系统设置]
[🔍 消息查询]  [📝 日志查看]
[🔄 重启服务]  [📤 导出数据]
[🤖 AI设置]   [📡 平台管理]
```

### 2. 测试智能对话

```
直接发送消息给Bot:
"你好，测试一下AI功能"

Bot会智能回复（使用Gemini AI）
```

### 3. 测试群组功能

```
1. 把Bot加入一个群组
2. @提及Bot: @你的bot 你好
3. Bot会回复
```

---

## 常用命令

### 查看日志

```bash
# 所有服务
docker-compose logs -f

# Bot日志
docker-compose logs -f bot

# AI分析器日志
docker-compose logs -f analyzer
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart bot
```

### 健康检查

```bash
./scripts/health_check.sh
```

### 停止服务

```bash
docker-compose down
```

### 重新启动

```bash
docker-compose up -d
```

---

## 故障排查

### Bot无响应

```bash
# 1. 检查Bot容器
docker-compose logs bot

# 2. 验证Token
# 检查.env文件中的TELEGRAM_BOT_TOKEN是否正确

# 3. 重启Bot
docker-compose restart bot
```

### AI不工作

```bash
# 1. 检查API Key
# 查看analyzer日志
docker-compose logs analyzer

# 2. 检查速率限制
# 确认今日调用次数未超限

# 3. 验证网络
# 确保服务器可以访问Google API
```

### Redis连接失败

```bash
# 检查Redis状态
docker-compose ps redis

# 重启Redis
docker-compose restart redis
```

---

## 下一步

### 添加更多平台

编辑`.env`文件，添加其他平台的API密钥：

```env
# Notion
NOTION_API_KEY=your_key
NOTION_DATABASE_ID=your_db_id

# Slack
SLACK_BOT_TOKEN=your_token
```

重启收集器：

```bash
docker-compose restart collectors
```

### 自定义Bot功能

编辑 `src/bot/main.py` 添加新功能，然后：

```bash
docker-compose build bot
docker-compose restart bot
```

### 调整AI分析

编辑 `src/analyzer/main.py` 修改分析提示词：

```bash
docker-compose build analyzer
docker-compose restart analyzer
```

---

## 监控和维护

### 每日检查

```bash
# 运行健康检查
./scripts/health_check.sh

# 查看队列状态
docker exec redis-queue redis-cli llen message_queue
```

### 备份数据

```bash
# 备份PostgreSQL
docker-compose exec postgres pg_dump -U admin message_hub > backup.sql

# 备份Redis
docker-compose exec redis redis-cli SAVE
```

### 查看资源使用

```bash
docker stats
```

---

## 获取帮助

- 📖 完整文档: [TUTORIAL.md](./TUTORIAL.md)
- 🔧 API配置: [docs/API_SETUP.md](./docs/API_SETUP.md)
- 🐛 问题反馈: [GitHub Issues](https://github.com/web3-ai-game/once-ye-s/issues)

---

## 成功！🎉

你的多平台消息聚合系统已经运行！

现在你可以：
- ✅ 通过Telegram Bot管理所有消息
- ✅ 使用AI智能分析消息
- ✅ 集成多个通讯平台
- ✅ 容器化部署，易于维护

享受你的智能消息中枢吧！
