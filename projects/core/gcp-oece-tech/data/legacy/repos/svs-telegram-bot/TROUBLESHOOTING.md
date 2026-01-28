# 🔧 故障排查记录

## 问题1: 私聊重复回复 + 群聊关键词不触发

**发现时间**: 2025-11-09 08:30  
**状态**: ✅ **已解决**

### 问题描述

1. **私聊重复回复**: 用户发送一条消息，bot回复两次相同内容
2. **群聊关键词不触发**: 在群里发送"管理员"或"小爱同学"，bot没有响应

### 根本原因

**多个bot实例使用同一个token**

发现了两个容器在运行相同的Telegram Bot Token：
1. `svs-telegram-bot` (新容器) - 运行 xiaoa_bot.py
2. `svs-tg-bot` (旧容器) - 运行 love_bot.py ⚠️ **冲突源**

这导致：
- Telegram同时向两个bot实例推送消息
- 每个实例都独立回复 → 重复回复
- 关键词检测逻辑在两个实例中行为不一致

### 解决方案

#### 步骤1: 排查运行的bot容器

```bash
# 查看所有bot相关容器
docker ps -a | grep bot

# 输出:
# svs-telegram-bot  (xiaoa_bot.py)  ✅ 保留
# svs-tg-bot        (love_bot.py)   ❌ 冲突
```

#### 步骤2: 停止冲突容器

```bash
# 停止并删除旧bot
docker stop svs-tg-bot
docker rm svs-tg-bot
```

#### 步骤3: 重启正确的容器

```bash
cd /mnt/volume_sgp1_01/svs_bot
docker compose restart
```

#### 步骤4: 验证

```bash
# 确认只有一个bot在运行
docker ps | grep bot

# 输出应该只有:
# svs-telegram-bot   (xiaoa_bot.py)  ✅
```

### 验证日志

**正确的启动日志**:
```
✅ KeywordDetector initialized with 10 keywords
✅ Supabase client initialized
✅ XiaoAiBot (小爱同学) initialized
✅ XiaoAi Bot started!
🍄 群聊关键词触发系统已激活
🎯 支持关键词: 管理员, 小爱同学 (简繁英)
```

### 测试清单

#### ✅ 测试1: 私聊不重复

**操作**:
```
你: 你好
```

**预期**:
- ✅ 只收到一条回复
- ❌ 不应该收到两条相同回复

#### ✅ 测试2: 群聊关键词触发

**操作**:
```
在群里: "管理员在吗？"
```

**预期**:
- ✅ Bot @你并回复
- ✅ 用户被注册到数据库
- ✅ 日志显示: "🎯 Keyword trigger"

**测试关键词**:
- 管理员 / 管理員 / admin
- 小爱同学 / 小愛同學 / xiaoai

#### ✅ 测试3: 聊天记录保存

**操作**:
```
触发关键词后继续对话
发送: /mystats
```

**预期**:
- ✅ 显示触发次数
- ✅ 显示聊天记录数量
- ✅ 显示最近对话

---

## 预防措施

### 1. 容器命名规范

**规则**: 每个项目使用独立的容器名称和网络

```yaml
# docker-compose.yml
services:
  svs-bot:
    container_name: svs-telegram-bot  # 唯一名称
    networks:
      - svs_bot_network  # 独立网络
```

### 2. 启动前检查

**每次启动前执行**:
```bash
# 检查是否有冲突的bot
docker ps | grep -E "telegram|bot"

# 如果发现旧bot，先停止
docker stop <old-bot-name>
```

### 3. 环境变量隔离

**确保每个bot使用不同的token**:
```bash
# svs_bot/.env
TELEGRAM_BOT_SVSKILO_TOKEN=8242036113:AAG...

# 其他项目不应使用同一个token
```

### 4. 监控脚本

创建监控脚本检测重复实例:

```bash
#!/bin/bash
# check_bot_duplicates.sh

TOKEN="8242036113:AAG..."
COUNT=$(docker ps --format "{{.Command}}" | grep -c "$TOKEN")

if [ $COUNT -gt 1 ]; then
    echo "⚠️  警告: 发现 $COUNT 个实例使用同一token!"
    docker ps | grep bot
    exit 1
fi

echo "✅ 正常: 只有 1 个bot实例在运行"
```

---

## 常见问题 FAQ

### Q1: 如何确认bot没有重复实例？

```bash
# 方法1: 检查容器
docker ps --format "table {{.Names}}\t{{.Command}}" | grep bot

# 方法2: 检查日志
docker compose logs --tail=20 | grep "initialized"

# 应该只看到一次初始化日志
```

### Q2: 如果误删了正确的bot怎么办？

```bash
cd /mnt/volume_sgp1_01/svs_bot
docker compose up -d --build
```

### Q3: 如何快速重启bot？

```bash
# 方法1: 重启容器（快）
docker compose restart

# 方法2: 重新部署（慢但完整）
docker compose down
docker compose up -d --build
```

### Q4: Bot启动但不响应消息

**检查清单**:
1. ✅ Telegram token是否正确
2. ✅ 网络连接是否正常
3. ✅ 日志是否有错误
4. ✅ Bot是否被添加到群里
5. ✅ Bot是否有读取消息权限

```bash
# 查看实时日志
docker compose logs -f

# 应该看到 getUpdates 请求
```

---

## 维护检查表

### 每日检查

- [ ] 容器运行状态
```bash
docker compose ps
```

- [ ] 日志中无错误
```bash
docker compose logs --tail=50 | grep -i error
```

### 每周检查

- [ ] API使用量
```
在Telegram发送: /status
```

- [ ] 数据库连接
```bash
docker compose logs | grep "Supabase"
```

- [ ] 只有一个bot实例
```bash
docker ps | grep bot | wc -l
# 应该是 1
```

---

## 联系支持

如果问题持续存在：

1. **收集信息**:
```bash
# 容器状态
docker ps -a > container_status.txt

# 完整日志
docker compose logs > bot_logs.txt

# 环境信息
docker compose config > compose_config.txt
```

2. **提交Issue**: https://github.com/web3-ai-game/svs-telegram-bot/issues

3. **包含信息**:
   - 问题描述
   - 复现步骤
   - 日志文件
   - 容器状态

---

*问题解决时间: 2025-11-09 08:31*  
*处理时间: ~10分钟*  
*影响范围: 私聊和群聊功能*  
*解决状态: ✅ 已完全修复*

🍄 ✨ 🔧
