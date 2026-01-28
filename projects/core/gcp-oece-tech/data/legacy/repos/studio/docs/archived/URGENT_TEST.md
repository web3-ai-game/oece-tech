# 🧪 立即测试 - Bot已运行

## ✅ 当前状态
- Bot 1 (@svsinst_bot) 正在运行
- Bot 2 (@svslovea_bot) 正在运行
- Web应用：http://188.166.180.96:3001

---

## 🎯 测试步骤

### 1. 在Telegram群聊中发送

选一个测试：

#### 测试 A: 简体中文
```
小爱同学在吗？
```

#### 测试 B: 繁体中文  
```
小愛同學你好
```

#### 测试 C: 英文
```
hey love can you help?
```

#### 测试 D: @mention
```
@svsinst_bot 测试
```

---

## 📊 查看实时日志

```bash
ssh root@188.166.180.96
cd /var/www/studio

# 实时日志（按Ctrl+C退出）
docker compose logs -f telegram-bot-1
```

**如果看到这些日志，说明正常：**
```
📥 Received message in supergroup from 你的用户名: 小爱同学在吗？
🔍 Processing text message: type=supergroup, text="小爱同学在吗？"
📨 Group message from 你的用户名 (keyword): 小爱同学在吗？
```

---

## ⚠️ 如果Bot不响应

### 检查1: Bot是否崩溃
```bash
docker compose ps telegram-bot-1
```

状态应该是`Up`，如果是`Restarting`说明还有问题。

### 检查2: 查看错误日志
```bash
docker compose logs telegram-bot-1 --tail=50 | grep -E "Error|error|409"
```

### 检查3: 确认是PRO会员

Bot只响应PRO会员！确保你的Telegram账号：
1. 已在 deepweay.me 绑定
2. 账号角色是`pro`

在Supabase检查：
```sql
SELECT email, role, telegram_id 
FROM users 
WHERE telegram_id = 你的telegram_id;
```

---

## 🔄 如果还是409冲突

**完全停止所有Bot，等待2分钟：**

```bash
ssh root@188.166.180.96
cd /var/www/studio

# 停止所有Bot
docker compose stop telegram-bot-1 telegram-bot-2

# 等待2分钟（让Telegram API清除session）
sleep 120

# 重新启动
docker compose start telegram-bot-1

# 查看日志
docker compose logs -f telegram-bot-1
```

---

## 📝 支持的关键词

**不区分大小写：**
- `小爱同学` / `小愛同學`
- `小爱` / `小愛`  
- `love` / `bot`
- `xiaoai` / `xiao ai`
- `deepweay`
- `助手` / `助理`

---

## 🎉 成功标志

**如果成功，你会看到：**
1. Bot回复了你的消息
2. 日志中显示：`📨 Group message from xxx (keyword)`
3. Bot不会对其他普通消息反应

---

**现在去群聊发"小爱同学你好"测试吧！** 🚀

然后告诉我结果！
