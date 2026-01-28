# 🚀 SVS高情商Bot - 5分钟快速启动

## ✅ 当前状态
- ✅ 所有代码已完成
- ✅ 测试全部通过
- ✅ Docker镜像已构建
- ✅ 数据库运行中
- ⚠️ **只需要**: 有效的Telegram Bot Token

## 🎯 立即启动（3步）

### 步骤1: 创建Telegram Bot

打开Telegram，搜索 `@BotFather`，发送：
```
/newbot
```

按提示输入：
- Bot名称: `SVS High EQ Bot`
- Bot用户名: `svs_high_eq_bot`

复制BotFather返回的Token（类似: `1234567890:ABCdef...`）

### 步骤2: 更新Token

```bash
cd /mnt/volume_sgp1_01/svs
vim run_bot.sh
```

修改第15行：
```bash
export TELEGRAM_BOT_XIAOAI_TOKEN="你的新Token"
```

### 步骤3: 启动Bot

```bash
./run_bot.sh
```

看到这个就成功了：
```
🧠 高情商智能体Bot启动
========================
• 25个Gemini Keys就绪
• 共享大脑系统激活
• 情商模块加载完成
```

## 💬 测试Bot

1. 打开Telegram
2. 搜索你的Bot用户名
3. 发送 `/start`
4. 选择心情开始对话！

## 📊 功能演示

```
/start - 开始对话，选择心情
/help - 查看帮助
/mood - 记录心情
/memory - 查看共同回忆
/joke - 听个笑话
/encourage - 获得鼓励
```

## 🔧 故障排查

### Token无效
```bash
# 确认Token格式正确
# 应该是: 数字:字母数字混合
# 例如: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 端口占用
```bash
# 检查Redis
sudo lsof -i :6379

# 检查PostgreSQL
sudo lsof -i :5432
```

### 查看日志
```bash
# 实时日志
tail -f logs/bot/*.log

# Docker日志
docker compose logs -f high-eq-bot
```

## 📁 项目结构

```
/mnt/volume_sgp1_01/svs/
├── high_eq_bot.py       # 主程序 ⭐
├── gemini_router.py     # API路由
├── run_bot.sh          # 启动脚本 ⭐
├── test_bot.py         # 测试脚本
├── docker-compose.yml  # Docker配置
├── requirements.txt    # Python依赖
└── README.md          # 完整文档
```

## 🎨 Bot特色

### 情绪识别
- 😊 开心 (happy)
- 😢 难过 (sad)
- 😠 生气 (angry)
- 😰 焦虑 (anxious)
- 😴 疲惫 (tired)

### 智能回复
- 共情式回应
- 适时幽默
- 积极鼓励
- 长期记忆

### 技术亮点
- 25个Gemini Keys轮询
- Redis共享记忆
- PostgreSQL持久化
- 自动故障切换

## 📈 下一步

### 推送到GitHub
```bash
git remote add origin <your-repo>
git push -u origin master
```

### 配置CI/CD
```bash
./setup_github_secrets.sh
```

### 启用监控
```bash
docker compose --profile monitoring up -d
```

访问:
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## 💡 提示

1. **测试优先**: 先用 `./test_bot.py` 测试功能
2. **日志监控**: 使用 `tail -f` 实时查看日志
3. **资源监控**: 使用 `docker stats` 查看资源
4. **备份数据**: 定期备份PostgreSQL数据

## 🆘 需要帮助？

- 📖 完整文档: `README.md`
- 🔧 部署状态: `DEPLOYMENT_STATUS.md`
- ✅ 完成报告: `COMPLETED_SETUP.md`

---

**一切就绪，只等你的Bot Token！** 🚀
