# DeepWeay Telegram Bot

## 本地开发（不用Docker）

### 1. 安装依赖

```bash
cd telegram-bot
npm install
```

### 2. 配置环境变量

从项目根目录的 `.env.local` 会自动读取，或创建 `telegram-bot/.env`:

```bash
cp .env.example .env
# 编辑 .env 填入Token
```

### 3. 运行Bot

**Bot 1 (小爱同学):**
```bash
npm run bot1
# 或
BOT_NUM=1 npm start
```

**Bot 2 (备用):**
```bash
npm run bot2
# 或
BOT_NUM=2 npm start
```

**开发模式（自动重启）:**
```bash
npm run dev
```

### 4. 测试

1. 在Telegram中找到你的Bot
2. 发送 `/start`
3. 发送消息测试对话

## 生产部署（Docker）

见项目根目录的 `docker-compose.yml`

## 命令

- `/start` - 开始
- `/help` - 帮助
- `/reset` - 重置对话历史
- `/stats` - 查看使用统计
