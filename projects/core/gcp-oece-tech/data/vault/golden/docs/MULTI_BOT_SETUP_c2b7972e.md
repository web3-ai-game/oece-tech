# 🤖 多Bot群聊系统部署指南

**创建时间**: 2025-11-10 16:30

---

## 📋 系统概述

### Bot配置

| Bot | 用户名 | Token | 账户 | 角色 |
|-----|--------|-------|------|------|
| 小爱同学 | @svskilo_bot | `8242036113:AAGh...` | @svskilo | 群管理 |
| Notion助手 | @svs_notion_bot | `7849921796:AAHb...` | @svsinst | 知识分享 |
| 倩倩姐 | @qitiandashengqianqian_bot | `8364183144:AAEI...` | @svsinst | 活跃气氛 |

---

## 🎭 Bot人格设定

### 1. 小爱同学 (主Bot)
```yaml
名称: 小爱同学
角色: 群管理 + 高情商AI
触发方式: 关键词
回复率: 100% (被触发时)
特点:
  - 温暖、理解、支持
  - 记忆5个用户×5次对话
  - 支持简体/繁体/英文
```

**触发关键词**:
- 简体: 小爱、小爱同学、群主、管理、我操、都来、接茬
- 繁体: 小愛、小愛同學、群主、管理、我操、都來、接茬
- 英文: xiaoai, admin, manager, help, hey

### 2. Notion助手
```yaml
名称: Notion助手
角色: 知识分享者
触发方式: 随机 (10%)
回复率: 低频
特点:
  - 理性、专业、博学
  - 喜欢分享知识
  - 引用概念和理论
```

### 3. 倩倩姐
```yaml
名称: 倩倩姐
角色: 活跃气氛
触发方式: 随机 (15%)
回复率: 中频
特点:
  - 活泼、幽默、亲和
  - 大量使用emoji
  - 轻松愉快的语气
```

---

## 🔧 部署步骤

### 步骤1: 添加Token到Doppler
```bash
cd /mnt/volume_sgp1_01/svs
./add_bots_to_doppler.sh
```

### 步骤2: 停止旧Bot
```bash
# 停止单Bot系统
pkill -f high_eq_bot.py
```

### 步骤3: 启动多Bot系统
```bash
# 启动所有Bot
./run_multi_bots.sh
```

### 步骤4: 验证运行
```bash
# 查看进程
ps aux | grep multi_bot_system

# 查看日志
tail -f logs/multi_bot_*.log
```

---

## 🎯 群聊功能

### 场景1: 用户@小爱同学
```
用户A: @小爱同学 今天天气怎么样？
小爱: 我明白你的感受 😊 我记得你之前说过1次话

用户B: 小爱 帮我查一下
小爱: 让我来帮你 💝 我记得你之前说过1次话
```

### 场景2: Bot互动
```
用户: 今天吃什么好？
倩倩姐: (15%概率) 哈哈哈 😄 火锅！
Notion助手: (10%概率) 根据我的了解，建议参考营养学指南 📚
小爱: (不触发关键词，不回复)
```

### 场景3: 记忆系统
```
用户A的对话历史 (最多5条):
1. "今天天气怎么样？"
2. "我想学Python"
3. "有什么推荐的书吗？"
4. "谢谢"
5. "再见"

[第6次对话时，自动清除第1次，保留最新5次]
```

---

## 📊 回复策略

### 小爱同学 (主Bot)
- **触发条件**: 消息包含关键词
- **回复率**: 100% (被触发时)
- **记忆**: 5个用户 × 5次对话
- **语言**: 自动检测 (简体/繁体/英文)

### Notion助手
- **触发条件**: 随机 (10%概率)
- **回复率**: 低频
- **特点**: 专业、知识型回复
- **Emoji**: 少量使用 📚💡🔍

### 倩倩姐
- **触发条件**: 随机 (15%概率)
- **回复率**: 中频
- **特点**: 活泼、emoji多
- **Emoji**: 大量使用 😄🎉💖🌈✨

---

## 🔐 安全配置

### Token管理
```bash
# 所有Token存储在Doppler
doppler secrets get TELEGRAM_BOT_XIAOAI_TOKEN
doppler secrets get TELEGRAM_BOT_NOTION_TOKEN
doppler secrets get TELEGRAM_BOT_QIANQIAN_TOKEN
```

### 权限控制
- ✅ 小爱同学: 管理员权限
- ✅ 其他Bot: 普通成员
- ✅ 防止Bot互相触发循环

---

## 🧪 测试指南

### 测试1: 关键词触发
```
在群里发送: @小爱同学 你好
预期: 小爱同学回复

在群里发送: 小爱 帮忙
预期: 小爱同学回复

在群里发送: 群主在吗
预期: 小爱同学回复
```

### 测试2: 随机回复
```
在群里发送普通消息 (不含关键词)
预期: 
  - Notion助手 10%概率回复
  - 倩倩姐 15%概率回复
  - 小爱同学不回复
```

### 测试3: 记忆系统
```
用户A连续发送5条消息
预期: 小爱同学记住所有5条

用户A发送第6条消息
预期: 小爱同学记住最新5条 (删除第1条)
```

### 测试4: 多用户隔离
```
用户A发送: 我喜欢Python
用户B发送: 我喜欢Java

小爱回复用户A: 记得你说过Python
小爱回复用户B: 记得你说过Java

预期: 记忆互不干扰
```

---

## 📁 文件结构

```
/mnt/volume_sgp1_01/svs/
├── multi_bot_system.py          # 多Bot系统主程序
├── run_multi_bots.sh            # 启动脚本
├── add_bots_to_doppler.sh       # Doppler配置脚本
├── BOT_TOKENS_UPDATED.md        # Token配置文档
└── MULTI_BOT_SETUP.md           # 本文档
```

---

## 🐛 故障排查

### 问题1: Bot不回复
```bash
# 检查进程
ps aux | grep multi_bot_system

# 检查日志
tail -f logs/multi_bot_*.log

# 重启Bot
pkill -f multi_bot_system
./run_multi_bots.sh
```

### 问题2: Redis连接失败
```bash
# 检查Redis状态
redis-cli ping

# 启动Redis
sudo systemctl start redis-server

# 查看Redis日志
sudo journalctl -u redis-server -f
```

### 问题3: Token无效
```bash
# 验证Token
curl https://api.telegram.org/bot<TOKEN>/getMe

# 更新Doppler
doppler secrets set TELEGRAM_BOT_XIAOAI_TOKEN="新Token"
```

---

## 📈 监控指标

### 性能指标
```bash
# 内存使用
ps aux | grep multi_bot_system | awk '{print $6}'

# CPU使用
top -p $(pgrep -f multi_bot_system)

# Redis连接数
redis-cli info clients
```

### 业务指标
```bash
# 消息处理数
redis-cli keys "group_memory:*" | wc -l

# 用户数
redis-cli keys "group_memory:*:*" | cut -d: -f3 | sort -u | wc -l
```

---

## 🚀 下一步优化

### 短期 (本周)
- [ ] 添加更多关键词
- [ ] 优化回复模板
- [ ] 添加emoji随机性
- [ ] 完善日志系统

### 中期 (本月)
- [ ] 接入Gemini API生成智能回复
- [ ] 添加情绪识别
- [ ] 实现上下文理解
- [ ] 添加群聊统计

### 长期 (季度)
- [ ] 多群管理
- [ ] 用户画像
- [ ] 个性化推荐
- [ ] 数据分析面板

---

## 📞 联系方式

- **主账户**: @svskilo
- **副账户**: @svsinst
- **域名**: deepweay.me
- **VPS**: 68.183.239.153

---

**状态**: ✅ 配置完成，待测试
