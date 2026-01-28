# 🧪 Bot测试指南

## 当前状态

✅ **简化测试Bot正在运行**
- Bot: 小爱同学 (@svskilo_bot)
- Token: 8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg
- 状态: 等待消息

---

## 🔍 诊断结果

### Bot信息
```
用户名: @svskilo_bot
ID: 8242036113
名称: 小愛同學
```

### 当前问题
Bot正在轮询但**没有收到群消息**，可能原因：

1. **Bot没有加入群组** ❌
2. **群组隐私模式开启** ⚠️
3. **Bot权限不足** ⚠️

---

## 📋 测试步骤

### 步骤1: 确认Bot已加入群组
```
1. 打开Telegram群组
2. 点击群组名称 → 查看成员
3. 确认 @svskilo_bot 在成员列表中
```

### 步骤2: 关闭群组隐私模式
```
1. 找到 @BotFather
2. 发送 /mybots
3. 选择 @svskilo_bot
4. 点击 Bot Settings
5. 点击 Group Privacy
6. 选择 Turn Off
```

**重要**: 隐私模式开启时，Bot只能看到：
- @提到它的消息
- /命令消息
- 它自己发送的消息

关闭后，Bot可以看到群里的所有消息！

### 步骤3: 测试消息
在群里发送以下消息测试：

```
测试1: @svskilo_bot 你好
测试2: 小爱 帮忙
测试3: 今天天气怎么样？
```

---

## 📊 实时监控

### 查看Bot日志
```bash
# 查看进程
ps aux | grep simple_test_bot

# 停止Bot
pkill -f simple_test_bot

# 重启Bot
cd /mnt/volume_sgp1_01/svs
source venv/bin/activate
python3 simple_test_bot.py
```

### 预期输出
如果Bot收到消息，会显示：

```
╔══════════════════════════════════════════════════════════════╗
║ 📨 收到消息
╠══════════════════════════════════════════════════════════════╣
║ 聊天类型: group
║ 聊天名称: 测试群
║ 发送者: @username
║ 内容: 你好
║ Chat ID: -1001234567890
║ Message ID: 123
╚══════════════════════════════════════════════════════════════╝
```

---

## 🔧 故障排查

### 问题1: Bot没有回复
**检查**:
```bash
# 查看Bot是否运行
ps aux | grep simple_test_bot

# 查看最新日志
tail -f /tmp/bot.log
```

### 问题2: 权限错误
**解决**:
```
1. 在群组中将Bot设为管理员
2. 或确保Bot有发言权限
```

### 问题3: Token无效
**验证**:
```bash
curl https://api.telegram.org/bot8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg/getMe
```

---

## ✅ 成功标志

当Bot正常工作时，你会看到：

1. **Bot收到消息** - 日志显示收到的消息
2. **Bot回复消息** - 群里看到Bot的回复
3. **无错误日志** - 没有Conflict或其他错误

---

## 🚀 下一步

测试成功后：

1. **停止测试Bot**:
   ```bash
   pkill -f simple_test_bot
   ```

2. **启动完整多Bot系统**:
   ```bash
   ./run_multi_bots.sh
   ```

3. **验证功能**:
   - 关键词触发 (小爱同学)
   - 随机回复 (Notion助手、倩倩姐)
   - 记忆系统 (5用户×5对话)

---

## 📞 需要帮助？

如果Bot还是没有反应：

1. **截图群组成员列表** - 确认Bot在群里
2. **截图Bot设置** - 确认隐私模式关闭
3. **提供Chat ID** - 在群里发送 `/start` 给Bot
4. **检查Bot日志** - 查看是否有错误

---

**当前测试Bot正在运行，等待你在群里发送消息！** 🎉
