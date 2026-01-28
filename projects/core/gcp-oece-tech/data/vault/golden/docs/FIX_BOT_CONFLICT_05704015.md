# 🤖 解决Telegram Bot冲突

## 问题
Bot容器不断重启，错误：`409: Conflict: terminated by other getUpdates request`

## 原因
Telegram API限制：**同一个Bot token只能被一个实例使用**

---

## ✅ 解决方法

### 方案1: 检查并停止本地Bot（最可能）

**在你的Mac上执行：**

```bash
# 1. 检查是否有node进程在运行Bot
ps aux | grep "node.*telegram-bot"

# 2. 如果看到类似这样的进程：
# svs.loline  12345  node /Users/svs.loline/.../telegram-bot/src/index.js

# 3. Kill掉进程
kill 12345

# 或者kill所有相关进程
pkill -f "telegram-bot"
```

**然后等待30秒**，VPS上的Bot会自动恢复。

---

### 方案2: 检查其他设备

可能在其他地方运行了Bot：
- 另一台电脑
- 另一个终端窗口
- 其他VPS/服务器

**找到并停止它们。**

---

### 方案3: 如果不确定，使用Bot 2

Bot 2 (@svslovea_bot) 目前没有冲突：

```bash
# SSH到VPS
ssh root@188.166.180.96

# 停止Bot 1
cd /var/www/studio
docker compose stop telegram-bot-1

# 检查Bot 2状态
docker compose ps telegram-bot-2
```

然后使用 @svslovea_bot 测试。

---

## 🔍 验证Bot状态

```bash
ssh root@188.166.180.96
cd /var/www/studio

# 查看容器状态
docker compose ps

# 查看Bot日志
docker compose logs telegram-bot-1 --tail=20

# 如果看到"Bot 1 is running..."，说明正常了
```

---

## ✅ 正常运行的标志

**日志中应该看到：**
```
🤖 Starting Bot 1: @svsinst_bot
✅ Bot started: @svsinst_bot
📍 Bot ID: 8076798362
🤖 Bot 1 is running...
```

**如果看到409错误，说明还有冲突。**

---

## 🎯 新功能已部署

群聊中Bot现在会响应：

1. ✅ **@mention** - 例如：`@svsinst_bot 你好`
2. ✅ **回复Bot消息** - 点击Bot消息的回复按钮，然后发消息
3. ❌ **普通消息** - 不会响应（避免打扰群聊）

---

## 📞 测试步骤

1. **确认本地没有Bot运行**
   ```bash
   ps aux | grep telegram-bot
   # 应该看不到任何结果
   ```

2. **等待30秒**

3. **在Telegram群聊中测试**
   - 方法1：发送 `@svsinst_bot 你好`
   - 方法2：回复Bot之前的消息，输入任何内容

4. **应该收到AI回复！**

---

## 🆘 还是不行？

执行完全重启：

```bash
ssh root@188.166.180.96
cd /var/www/studio

# 完全停止
docker compose down

# 等待10秒
sleep 10

# 重新启动
docker compose up -d

# 查看日志
docker compose logs -f telegram-bot-1
```

按 `Ctrl+C` 退出日志查看。

---

**关键：确保没有其他地方在运行这个Bot！** 🔑
