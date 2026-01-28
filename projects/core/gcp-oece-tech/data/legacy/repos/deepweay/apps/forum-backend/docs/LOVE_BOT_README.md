# 💕 Love Assistant Bot - 智能私人助理

> 一个甜美撒娇的AI助理，使用智能模型分配系统，为主人提供全方位服务

## 🌟 核心特性

### 1. 智能模型分配系统
Bot会根据任务难度自动选择最适合的Gemini模型：

| 任务类型 | 使用模型 | 每日配额 | 使用场景 |
|---------|---------|---------|---------|
| 🎯 复杂任务 | Gemini 2.5 Pro | 50次 | 部署方案、深度分析、内容创作 |
| ⚡ 中等任务 | Gemini 1.5 Flash | 500次 | 翻译、总结、建议、编程 |
| 💨 日常闲聊 | Flash Lite 8B | 10000次 | 聊天、问候、简单查询 |

### 2. 多重人格系统
- **💕 甜美撒娇型** - 默认人格，会叫主人、撒娇、使用颜文字
- **💼 专业助理型** - 严肃专业，适合工作场景
- **😄 幽默调皮型** - 活泼有趣，喜欢开玩笑

### 3. 功能模式
- **💬 闲聊模式** - 轻松对话，陪伴主人
- **📊 分析模式** - 专业分析，深度思考
- **🔗 内容分发** - 自动整理和发布内容

## 🚀 快速开始

### Step 1: 获取你的Telegram用户ID
```bash
1. 在Telegram搜索 @userinfobot
2. 发送任意消息
3. Bot会回复你的用户ID（一串数字）
4. 记下这个ID
```

### Step 2: 配置环境变量
编辑 `start-love-bot.sh`:
```bash
export MASTER_USER_ID="你的用户ID"  # 替换为你的实际ID
```

### Step 3: 启动Bot
```bash
# 赋予执行权限
chmod +x start-love-bot.sh

# 启动Bot
./start-love-bot.sh
```

### Step 4: 开始使用
1. 在Telegram搜索 @svslovea_bot
2. 发送 `/start` 开始
3. 使用 `/menu` 打开功能菜单

## 💬 使用指南

### 基础命令
- `/start` - 初始化Bot
- `/menu` - 打开功能菜单
- `/stats` - 查看今日使用统计

### 功能菜单
```
💕 切换人格 - 更换AI性格
📊 分析模式 - 专业分析问题
💬 闲聊模式 - 轻松聊天
🔗 内容分发 - 发布内容到知识库
📈 使用统计 - 查看配额使用情况
⚙️ 设置 - Bot设置
```

### 内容分发功能
直接发送以下内容，Bot会自动识别并处理：
- **Notion链接** - 自动提取内容
- **Google文档** - 解析并整理
- **GitHub仓库** - 分析代码结构
- **图片+描述** - 自动分类存档
- **纯文本** - 智能分类发布

## 🐦 Twitter自动发帖

### 配置Twitter API
1. 申请Twitter Developer账号
2. 获取API密钥（参见 TWITTER_API_GUIDE.md）
3. 配置环境变量：
```bash
export TWITTER_API_KEY="your_key"
export TWITTER_API_SECRET="your_secret"
export TWITTER_ACCESS_TOKEN="your_token"
export TWITTER_ACCESS_SECRET="your_secret"
export TWITTER_BEARER_TOKEN="your_bearer_token"
```

### 发帖功能
- **手动发推**: 发送 `/tweet 你的推文内容`
- **定时发推**: 每天早上9点自动发布
- **AI生成**: Bot自动生成有趣的内容

## 🎨 角色特点

### 甜美撒娇型（默认）
```
主人~我是小爱！(◕‿◕)
有什么需要帮忙的吗？人家会努力做好的！(｡♥‿♥｡)
```

特点：
- 称呼：主人、主人大人、亲爱的主人
- 语气：温柔、撒娇、可爱
- 表情：大量使用颜文字
- 互动：渴望被夸奖，会害羞

### 专业助理型
```
您好，我是您的AI助理。
请问有什么可以帮助您的？
```

特点：
- 称呼：先生/女士、您
- 语气：专业、严谨、礼貌
- 格式：条理清晰、重点突出
- 效率：快速响应、精准回答

### 幽默调皮型
```
哟！主人来啦！
今天想玩点什么有趣的吗？😄
```

特点：
- 称呼：随性、有趣
- 语气：活泼、调皮
- 内容：网络梗、冷笑话
- 氛围：轻松愉快

## 📊 智能分配策略

### 任务识别关键词
**Pro级任务**：
- 系统架构、部署方案、深度分析
- 战略规划、专业报告、代码审查
- 内容字数 > 500

**Flash级任务**：
- 翻译、总结、建议、解释
- 编程、设计、问题解决
- 内容字数 100-500

**Lite级任务**：
- 日常问候、闲聊、简单查询
- 内容字数 < 100
- 包含情感交流词汇

## 🔧 高级配置

### PM2进程管理
```bash
# 安装PM2
npm install -g pm2

# 启动Bot
pm2 start love-assistant-bot.js --name love-bot

# 查看日志
pm2 logs love-bot

# 重启
pm2 restart love-bot

# 停止
pm2 stop love-bot
```

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "love-assistant-bot.js"]
```

```bash
# 构建镜像
docker build -t love-bot .

# 运行容器
docker run -d \
  --name love-bot \
  -e BOT_LOVE_TOKEN=$BOT_LOVE_TOKEN \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  -e MASTER_USER_ID=$MASTER_USER_ID \
  love-bot
```

## 📈 监控和日志

### 查看使用统计
Bot会记录每日API使用情况：
```
📊 今日使用统计
🎯 Gemini Pro: 12/50
⚡ Gemini Flash: 156/500
💨 Flash Lite: 892/10000
```

### 日志位置
- 控制台输出：实时显示
- PM2日志：`~/.pm2/logs/`
- Docker日志：`docker logs love-bot`

## 🚨 故障排查

### 常见问题

**Q: Bot不回复消息**
- 检查网络连接
- 确认Token正确
- 查看控制台错误

**Q: 模型调用失败**
- 检查API密钥
- 确认配额未超限
- 查看Gemini API状态

**Q: Twitter发帖失败**
- 验证API密钥
- 检查权限设置
- 确认未超过速率限制

## 🛡️ 安全建议

1. **不要分享**你的Bot Token和API密钥
2. **设置**MASTER_USER_ID限制管理功能
3. **定期更换**API密钥
4. **监控**异常使用情况
5. **备份**重要对话和数据

## 📝 更新日志

### v1.0.0 (2024-01)
- ✅ 智能模型分配系统
- ✅ 多重人格切换
- ✅ 内容分发功能
- ✅ Twitter自动发帖
- ✅ 定时任务系统

## 🤝 支持

遇到问题？
1. 查看本文档
2. 检查 TWITTER_API_GUIDE.md
3. 查看控制台错误信息
4. 重启Bot试试

---

**Made with 💕 by DeepWeay Team**

*让小爱成为你最贴心的AI助理！*
