# 🤖 立即测试Telegram Bot

## 快速开始（5分钟）

### 1. 安装Bot依赖

```bash
cd telegram-bot
npm install
```

### 2. 启动Bot 1（小爱同学）

```bash
npm run bot1
```

你会看到:
```
✅ Bot started: @svsinst_bot
📍 Bot ID: xxx
🤖 Bot 1 is running...
```

### 3. 在Telegram测试

1. 打开Telegram
2. 搜索 `@svsinst_bot`
3. 发送 `/start`

**预期回复（如果是PRO会员）:**
```
🌊 Welcome back, [你的名字]!

I'm your AI assistant powered by Gemini Flash...
```

**预期回复（如果不是PRO）:**
```
🌊 Welcome to DeepWeay!

This bot is exclusively for PRO members...
```

### 4. 测试对话

发送任何消息，例如:
```
Hi! I want to travel to Chiang Mai. Any tips?
```

Bot会调用Gemini Flash回复你！

---

## 🔍 问题排查

### Bot无响应

**检查环境变量:**
```bash
# 在telegram-bot目录
cat ../.env.local | grep TELEGRAM
cat ../.env.local | grep GEMINI
```

确保有:
```
TELEGRAM_BOT_TOKEN_1=8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
TELEGRAM_BOT_USERNAME_1=svsinst_bot
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ
```

### 提示"PRO会员专用"

需要在数据库中关联Telegram ID:

**临时测试方案:**
修改 `telegram-bot/src/index.js` 第58行：
```javascript
// 临时跳过PRO验证（仅测试用）
if (!user || user.role !== 'pro') {
  // return ctx.reply(...);  // 注释掉这行
  user = { id: 'test', role: 'pro' }; // 添加这行
}
```

### Gemini API错误

**检查配额:**
访问: https://aistudio.google.com/app/apikey

**查看错误日志:**
```bash
# Bot运行终端会显示错误
❌ Error processing message: ...
```

---

## 📊 查看运行状态

### 查看日志

Bot运行时会实时输出:
```
📥 /start from username (123456)
📨 Message from username: Hi! I want to...
✅ Replied to username (450 tokens)
```

### 统计命令

在Telegram中发送:
```
/stats
```

查看你的使用统计。

---

## 🎯 下一步

### 测试Bot 2

另开一个终端:
```bash
cd telegram-bot
npm run bot2
```

测试 `@svslovea_bot`

### 添加功能

修改 `telegram-bot/src/index.js`:
- 添加新命令
- 调整Prompt
- 添加特殊功能

### 推送到VPS

```bash
git add .
git commit -m "feat: telegram bot working"
git push
```

然后SSH到VPS部署Docker版本。

---

## 💡 开发Tips

### 自动重启（开发模式）

```bash
npm run dev
```

修改代码会自动重启Bot。

### 多Bot同时运行

```bash
# 终端1
npm run bot1

# 终端2
npm run bot2
```

### 调试模式

在代码中添加更多console.log:
```javascript
console.log('User data:', user);
console.log('Gemini response:', response);
```

---

**现在就可以测试Bot了！本地零Docker！** 🚀
