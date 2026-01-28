# API 配置指南

本指南详细说明如何获取和配置各个平台的API密钥。

---

## 🤖 Telegram Bot API

### 获取Bot Token

1. **打开Telegram**，搜索 `@BotFather`

2. **创建新Bot**
   ```
   发送: /newbot
   ```

3. **设置Bot名称**
   ```
   Bot名称: 我的消息聚合Bot
   ```

4. **设置Bot用户名**
   ```
   用户名: my_message_hub_bot
   （必须以_bot结尾）
   ```

5. **保存Token**
   ```
   BotFather会返回:
   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

6. **配置Bot设置**
   ```
   /setprivacy - 禁用隐私模式（让Bot在群组看到所有消息）
   /setjoingroups - 允许加入群组
   /setcommands - 设置命令列表
   ```

### 获取User ID

1. 搜索 `@userinfobot`
2. 发送任意消息
3. Bot会返回你的User ID

### 在.env中配置

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_ID=123456789
```

---

## 🧠 Google Gemini API

### 获取API Key

1. **访问** [Google AI Studio](https://aistudio.google.com/app/apikey)

2. **登录** Google账号

3. **创建API Key**
   - 点击 "Create API Key"
   - 选择项目（或创建新项目）
   - 复制生成的API密钥

4. **注意事项**
   - 免费版: 15 RPM（每分钟15次请求）
   - Pro版: 1000次/天
   - 密钥格式: `AIzaSy...`

### 选择模型

推荐模型：
- `gemini-2.5-flash` - 最新，速度快
- `gemini-1.5-flash` - 稳定版
- `gemini-pro` - 更强大

### 在.env中配置

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MAX_CALLS_PER_DAY=1000
POLLING_INTERVAL=30
```

---

## 📝 Notion API

### 创建Integration

1. **访问** [Notion Integrations](https://www.notion.so/my-integrations)

2. **创建新Integration**
   - 点击 "New integration"
   - 名称: Message Hub Integration
   - 关联工作区
   - 类型: Internal Integration

3. **获取API Key**
   ```
   格式: secret_XXXXXXXXXXXXXXXXXXXXX
   ```

### 获取Database ID

1. **打开你的Notion数据库**

2. **获取链接**
   ```
   https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxx?v=yyyyyy
                              ↑
                          这部分就是Database ID
   ```

3. **给Integration授权**
   - 在数据库页面点击 "..." → "Add connections"
   - 选择你创建的Integration

### 在.env中配置

```env
NOTION_API_KEY=secret_XXXXXXXXXXXXXXXXXXXXX
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxx
```

---

## 💬 Slack API

### 创建Slack App

1. **访问** [Slack API](https://api.slack.com/apps)

2. **创建新App**
   - 点击 "Create New App"
   - 选择 "From scratch"
   - App名称: Message Hub
   - 选择工作区

3. **配置Bot Token Scopes**
   
   在 "OAuth & Permissions" 页面添加：
   ```
   channels:history
   channels:read
   chat:write
   groups:history
   im:history
   im:read
   users:read
   ```

4. **安装App到工作区**
   - 点击 "Install to Workspace"
   - 授权
   - 获取 "Bot User OAuth Token"

5. **获取App Token**（用于Socket Mode）
   - 启用 Socket Mode
   - 生成 App-Level Token

### 在.env中配置

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
```

---

## 📱 WhatsApp Business API

### 使用Meta Business

1. **访问** [Meta for Developers](https://developers.facebook.com/)

2. **创建应用**
   - 选择 "Business"
   - 添加 WhatsApp 产品

3. **获取凭据**
   ```
   Phone Number ID
   WhatsApp Business Account ID
   Access Token
   ```

4. **配置Webhook**
   - 设置验证令牌
   - 订阅消息事件

### 在.env中配置

```env
WHATSAPP_API_KEY=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

---

## 📲 LINE Messaging API

### 创建LINE Channel

1. **访问** [LINE Developers](https://developers.line.biz/)

2. **创建Provider**
   - 点击 "Create"
   - 输入Provider名称

3. **创建Channel**
   - 选择 "Messaging API"
   - 填写信息
   - 创建

4. **获取凭据**
   ```
   Channel Access Token
   Channel Secret
   ```

5. **配置Webhook**
   - 启用 Webhook
   - 设置 Webhook URL

### 在.env中配置

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
```

---

## 📘 Facebook Messenger API

### 创建Facebook App

1. **访问** [Meta for Developers](https://developers.facebook.com/)

2. **创建应用**
   - 类型: Business

3. **添加Messenger产品**
   - 配置Messenger

4. **生成Page Access Token**
   - 选择Page
   - 生成Token

5. **配置Webhook**
   - 设置回调URL
   - 验证令牌
   - 订阅字段: messages, messaging_postbacks

### 在.env中配置

```env
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_VERIFY_TOKEN=your_verify_token
```

---

## 🐦 X (Twitter) API

### 获取API密钥

1. **访问** [Twitter Developer Portal](https://developer.twitter.com/)

2. **创建应用**
   - Projects & Apps → Create App
   - 填写应用信息

3. **获取API Keys**
   ```
   API Key
   API Secret Key
   Bearer Token
   ```

4. **生成Access Tokens**
   - 在App设置中生成
   - 设置权限为 Read and Write

5. **启用OAuth 1.0a**

### 在.env中配置

```env
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

---

## ⚡ 完整.env示例

```env
# ========================================
# Telegram (必填)
# ========================================
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_ID=123456789

# ========================================
# Gemini AI (必填)
# ========================================
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MAX_CALLS_PER_DAY=1000
POLLING_INTERVAL=30

# ========================================
# Notion (可选)
# ========================================
NOTION_API_KEY=secret_XXXXXXXXXXXXXXXXXXXXX
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxx

# ========================================
# Slack (可选)
# ========================================
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret

# ========================================
# WhatsApp (可选)
# ========================================
WHATSAPP_API_KEY=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# ========================================
# LINE (可选)
# ========================================
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret

# ========================================
# Facebook (可选)
# ========================================
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_VERIFY_TOKEN=your_verify_token

# ========================================
# X/Twitter (可选)
# ========================================
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# ========================================
# 数据库 (自动配置)
# ========================================
REDIS_HOST=redis
REDIS_PORT=6379
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=message_hub
POSTGRES_USER=admin
POSTGRES_PASSWORD=changeme

# ========================================
# 其他
# ========================================
LOG_LEVEL=INFO
TZ=Asia/Shanghai
DEBUG=false
```

---

## 🔒 安全提示

1. **永远不要**将`.env`文件提交到Git
   ```bash
   # .gitignore已包含
   .env
   ```

2. **定期轮换** API密钥

3. **最小权限原则**
   - 只授予必要的API权限

4. **使用环境变量**
   - 不要在代码中硬编码密钥

5. **备份密钥**
   - 安全存储API密钥副本

---

## ✅ 验证配置

运行以下命令验证配置：

```bash
# 检查.env文件
cat .env | grep -v "^#" | grep "="

# 测试Bot连接
docker-compose logs bot | grep "Bot启动成功"

# 测试Gemini API
docker-compose logs analyzer | grep "Gemini客户端初始化完成"
```

---

## 🆘 常见问题

### API密钥无效

- 检查是否有多余的空格
- 确认密钥未过期
- 验证权限是否正确

### 速率限制

- Gemini: 调整POLLING_INTERVAL
- Telegram: 每秒最多30条消息
- 其他平台: 查看各自的限制文档

### Webhook配置

某些平台需要公网IP：
```bash
# 使用ngrok暴露本地端口
ngrok http 80
```

---

需要帮助？查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
