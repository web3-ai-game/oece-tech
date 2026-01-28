# 🚨 快速修复计划

## 当前状态（2024-11-10 08:30）

### ❌ 主要问题

1. **Bot不在运行** - Go bot编译有错误
2. **CPU占用高** - load average 1.97-2.09 (2核)
3. **Datadog API Key无效** - 已修复并重启
4. **Bot回复功能** - 代码已修复但未部署

---

## ⚡ 立即行动（15分钟内）

### 1. 快速启动Python Bot测试回复功能

```bash
# 使用现有Python bot快速测试
cd /mnt/volume_sgp1_01/svs_bot
source .env
nohup python3 xiaoa_bot.py > bot.log 2>&1 &

# 测试：
# 1. 私聊发送消息
# 2. 群聊@bot
# 3. 群聊使用关键词
```

###  2. CPU优化措施

```yaml
高CPU进程:
  - next-se+ (Windsurf): 116.7% CPU
  - node: 16.7% CPU
  
立即优化:
  1. 关闭Windsurf language server（最高优先级）
  2. 检查node进程是否必要
  3. 限制bot进程CPU使用

命令:
  # 停止Windsurf相关进程
  pkill -f "language_server"
  
  # 检查CPU
  top -bn1 | head -20
  
  # 限制bot CPU（如果需要）
  cpulimit -p PID -l 50
```

### 3. Datadog监控已启用

```bash
# 已完成：
✅ 更新DD_API_KEY
✅ 重启datadog-agent  
✅ 监控VPS、Docker、Redis

# 查看状态：
systemctl status datadog-agent
datadog-agent status

# 访问Dashboard：
https://app.datadoghq.com
```

---

## 📊 Datadog + Telegram集成

### 方案A：Telegram命令查看监控（推荐）

```python
# 添加到bot的命令处理
@bot.command('monitor')
def show_monitoring(update, context):
    """显示Datadog监控数据"""
    import requests
    
    dd_api_key = os.getenv('DD_API_KEY')
    dd_app_key = os.getenv('DD_APP_KEY')
    
    # 获取CPU使用率
    url = f"https://api.datadoghq.com/api/v1/query"
    params = {
        'api_key': dd_api_key,
        'application_key': dd_app_key,
        'query': 'avg:system.cpu.user{*}',
        'from': int(time.time()) - 300,  # 最近5分钟
        'to': int(time.time())
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    message = f"""
📊 *VPS监控数据* (via Datadog)

💻 *CPU使用率*
当前: {data['series'][0]['pointlist'][-1][1]:.1f}%

📈 *内存使用*  
使用: 2.5GB / 7.9GB (32%)

⚡ *负载*
1分钟: 1.97
5分钟: 2.09  
15分钟: 2.05

🐳 *Docker容器*
运行中: X个
总内存: XMB

更新时间: {datetime.now().strftime('%H:%M:%S')}
    """
    
    update.message.reply_text(message, parse_mode='Markdown')
```

### 方案B：Datadog Webhook → Telegram

```yaml
配置Datadog Webhook:
  1. 登录Datadog Dashboard
  2. Integrations → Webhooks
  3. 添加Telegram Bot Webhook
     URL: https://api.telegram.org/bot<TOKEN>/sendMessage
     Payload: {"chat_id":"<OWNER_ID>","text":"{{event.msg}}"}
  4. 配置告警规则触发Webhook
```

---

## 🎯 项目定位明确化

### 这个项目就是：**Telegram Bot** ✅

```yaml
核心功能:
  🤖 Telegram AI Bot:
    - 私聊AI对话
    - 群聊@提及/关键词回复
    - Owner特权命令
    - VIP系统
  
  📊 用户数据分析:
    - Redis实时统计
    - 用户行为追踪
    - 数据可视化
  
  🧠 25-Key AI路由:
    - Gemini API智能分配
    - 负载均衡
    - 故障转移
  
  📈 监控集成:
    - Datadog系统监控
    - Telegram查看数据
    - 实时告警

docs/文档:
  - 论坛网站脚手架（与bot无关）
  - 施工进度文档
  - 暂时保留，不影响bot功能
```

---

## 🔧 Go Bot编译修复（后续）

### 当前编译错误：

```
1. showUserAnalysis函数结构被破坏 ✅ 已修复
2. handleChineseKeywords返回值 ✅ 已修复  
3. HandlePrivateMessage返回值 ✅ 已修复
4. AIRouter缺少ownerID字段 ✅ 已修复
5. 未使用的导入 ❌ 待修复
```

### 快速解决方案：

```bash
# 方案1：使用goimports自动修复
go install golang.org/x/tools/cmd/goimports@latest
cd go_backend/cmd/xiaoai
goimports -w *.go
go build -o ../../../xiaoai-bot .

# 方案2：临时用Python bot
# Go bot修复后再切换
```

---

## CPU优化详细措施

### 1. 识别高CPU进程

```bash
# 当前高CPU进程
next-server (Windsurf): 116% CPU  ← 立即处理
node: 16.7% CPU                   ← 检查必要性
```

### 2. Windsurf优化

```bash
# 完全关闭（最佳）
pkill -f "language_server"
pkill -f "windsurf"

# 或限制CPU
ps aux | grep windsurf  # 找到PID
cpulimit -p <PID> -l 30  # 限制30% CPU
```

### 3. Bot进程优化

```bash
# 使用nice降低优先级
nice -n 19 python3 xiaoa_bot.py &

# 或Docker限制
docker run --cpus="0.5" ...  # 限制0.5核
```

### 4. Redis优化

```bash
# 已有限制
maxmemory 1gb
maxmemory-policy allkeys-lru

# 额外CPU优化
# 在redis.conf添加：
save ""  # 禁用RDB持久化（减少CPU）
# 只保留AOF即可
```

### 5. 监控CPU

```bash
# 实时监控
watch -n 2 'top -bn1 | head -20'

# 或使用已有脚本
./monitor.sh
```

---

## 📝 快速测试清单

### Bot回复测试（Python版）

```
□ 启动xiaoa_bot.py
□ 私聊发送 "你好" → 应该回复
□ 群聊@bot "你好" → 应该回复
□ 群聊关键词 "小爱" → 应该回复
□ Owner私聊 "/menu" → 显示菜单
□ Owner私聊 "菜单" → 显示菜单
```

### CPU优化验证

```
□ 关闭Windsurf进程
□ 检查load average < 1.5
□ 检查CPU空闲 > 40%
□ Bot正常运行不受影响
```

### Datadog监控

```
□ datadog-agent运行正常
□ 无API Key错误
□ Dashboard显示数据
□ 添加/monitor命令到bot
```

---

## 🚀 30分钟内完成目标

```yaml
✅ 立即完成 (10分钟):
  - 关闭Windsurf (CPU优化)
  - 启动Python bot (测试回复)
  - 验证Datadog (监控正常)

📋 后续完成 (20分钟):
  - 添加/monitor命令
  - 修复Go bot编译
  - 部署Go bot
  - 完整功能测试

💡 长期优化:
  - 完善用户数据分析
  - 优化Redis查询
  - 添加更多监控指标
  - TG经济系统设计
```

---

## 💬 关键命令速查

```bash
# 1. 杀掉高CPU进程
pkill -f "language_server"

# 2. 启动Python bot
cd /mnt/volume_sgp1_01/svs_bot && source .env && nohup python3 xiaoa_bot.py > bot.log 2>&1 &

# 3. 查看CPU
top -bn1 | head -15

# 4. 查看bot日志
tail -f bot.log

# 5. Datadog状态
systemctl status datadog-agent

# 6. 测试bot
# Telegram私聊@svskilo_bot发送"你好"
```

---

## 📊 预期结果

```yaml
CPU:
  优化前: 56% user + 13% sys = 69%
  优化后: <40% (关闭Windsurf后)
  目标: <50% 日常使用

内存:  
  当前: 32% (2.5GB/7.9GB) ✅ 很好
  目标: 保持 <50%

Bot:
  回复率: 100% (所有私聊和触发的群聊)
  响应时间: <2秒
  稳定性: 24/7运行

监控:
  Datadog: 实时收集数据
  Telegram: /monitor命令查看
  告警: CPU>80%, 内存>70%
```

---

**立即执行！优先级：CPU优化 > Bot测试 > 监控集成**
