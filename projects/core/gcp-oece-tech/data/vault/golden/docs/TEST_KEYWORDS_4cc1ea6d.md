# 🧪 测试群聊关键词功能

## ✅ Bot已部署关键词触发

现在Bot会响应以下内容：

### 1. @mention（原有功能）
```
@svsinst_bot 你好
```

### 2. 回复Bot消息（原有功能）
- 点击Bot消息的"回复"
- 输入任何内容

### 3. ⭐ 关键词触发（新增！）

**支持的关键词（不区分大小写）：**

#### 中文
- `小爱同学` - 繁体
- `小愛同學` - 简体  
- `小爱` / `小愛`
- `助手` / `助理`

#### 英文
- `love`
- `bot`
- `xiaoai` / `xiao ai`
- `deepweay` / `deep weay`

### 测试方法

在群聊中发送任何**包含关键词**的消息：

```
小爱同学在吗？
love 帮我查一下
bot 你好
xiaoai are you there?
```

**Bot会自动回复！**

---

## 📊 当前容器状态

```bash
ssh root@188.166.180.96
cd /var/www/studio
docker compose ps
```

**应该看到：**
- ✅ `deepweay-web` - healthy
- ✅ `deepweay-datadog` - healthy
- ✅ `deepweay-tg-bot-1` - Up (running)
- ⏸️  `deepweay-tg-bot-2` - Stopped (暂时禁用避免冲突)

---

## 🔍 查看Bot日志

```bash
# 实时日志
docker compose logs -f telegram-bot-1

# 最近20条
docker compose logs telegram-bot-1 --tail=20
```

**正常日志应该显示：**
```
🤖 Starting Bot 1: @svsinst_bot
✅ Bot started: @svsinst_bot
📍 Bot ID: 8076798362
🤖 Bot 1 is running...
```

**当收到消息时会显示：**
```
📨 Group message from 用户名 (keyword): 小爱同学你好...
```

---

## 🎯 测试清单

### 私聊测试
1. 打开 @svsinst_bot
2. 发送任何消息
3. ✅ 应该立即收到AI回复

### 群聊测试

#### Test 1: @mention
1. 在群聊发送：`@svsinst_bot 你好`
2. ✅ Bot应该回复

#### Test 2: 关键词（简体）
1. 发送：`小爱同学在吗`
2. ✅ Bot应该回复

#### Test 3: 关键词（繁体）
1. 发送：`小愛同學幫我`
2. ✅ Bot应该回复

#### Test 4: 关键词（英文）
1. 发送：`love can you help?`
2. ✅ Bot应该回复

#### Test 5: 关键词（拼音）
1. 发送：`xiaoai hello`
2. ✅ Bot应该回复

#### Test 6: 普通消息（不触发）
1. 发送：`今天天气不错`
2. ❌ Bot不应该回复（正常行为）

---

## 🐛 如果不工作

### 1. 检查Bot状态
```bash
ssh root@188.166.180.96
cd /var/www/studio
docker compose ps telegram-bot-1
```

状态应该是 `Up` 而不是 `Restarting`

### 2. 检查日志中的错误
```bash
docker compose logs telegram-bot-1 --tail=30
```

如果看到409错误，说明还有冲突。

### 3. 重启Bot
```bash
docker compose restart telegram-bot-1
sleep 5
docker compose logs telegram-bot-1 --tail=10
```

### 4. 检查是否PRO会员

Bot只响应PRO会员！确保：
- Telegram账号已在 deepweay.me 绑定
- 账号角色是 `pro`

检查方法：
```sql
-- 在Supabase SQL Editor
SELECT email, role, telegram_id 
FROM users 
WHERE telegram_id IS NOT NULL;
```

---

## 📝 日志示例

### 正常运行
```
🤖 Bot 1 is running...
📨 Group message from alice (keyword): 小爱同学你好
📨 Private message from bob: 帮我查签证
⏭️  Ignoring group message (no trigger): 普通聊天内容
```

### 错误日志
```
❌ 409: Conflict - 说明有冲突
❌ TELEGRAM_BOT_TOKEN_1 not found - 环境变量缺失
⚠️ This feature is for PRO members only - 用户非PRO
```

---

## ⚡ 快速命令

```bash
# 查看所有容器
docker compose ps

# 重启Bot
docker compose restart telegram-bot-1

# 查看日志
docker compose logs -f telegram-bot-1

# 停止Bot 2（避免冲突）
docker compose stop telegram-bot-2

# 完全重启
docker compose down && docker compose up -d
```

---

## 🎉 功能总结

| 触发方式 | 示例 | 支持场景 |
|---------|------|---------|
| @mention | `@svsinst_bot 你好` | 群聊 |
| 回复消息 | 点击Bot消息回复 | 群聊 |
| 关键词 | `小爱同学` / `love` / `xiaoai` | 群聊 |
| 任何消息 | 直接发送 | 私聊 |

**现在去群聊测试吧！** 🚀
