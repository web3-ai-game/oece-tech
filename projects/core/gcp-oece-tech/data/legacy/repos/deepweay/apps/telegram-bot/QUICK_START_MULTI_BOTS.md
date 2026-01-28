# 🚀 多Bot系统快速启动

## ⚡ 一键启动

```bash
cd /mnt/volume_sgp1_01/svs
./run_multi_bots.sh
```

---

## 🤖 三个Bot

| Bot | 触发方式 | 回复率 |
|-----|----------|--------|
| 小爱同学 | 关键词 | 100% |
| Notion助手 | 随机 | 10% |
| 倩倩姐 | 随机 | 15% |

---

## 🔑 关键词 (触发小爱同学)

```
小爱 小爱同学 群主 管理 我操 都来 接茬
xiaoai admin manager help hey
```

---

## 📝 测试命令

### 在群里发送
```
@小爱同学 你好        → 小爱回复
小爱 帮忙             → 小爱回复
今天吃什么？          → 可能有Bot回复
```

---

## 🔧 管理命令

```bash
# 查看状态
ps aux | grep multi_bot_system

# 停止
pkill -f multi_bot_system

# 重启
./run_multi_bots.sh

# 查看日志
tail -f logs/multi_bot_*.log
```

---

## 📊 账户归属

- **@svskilo**: 小爱同学
- **@svsinst**: Notion助手 + 倩倩姐

---

## ✅ 完成清单

- [x] 创建2个新Bot
- [x] 配置Token
- [x] 实现群聊功能
- [x] 记忆系统 (5用户×5对话)
- [x] 关键词检测
- [x] 随机回复
- [ ] 添加到Doppler
- [ ] 加入测试群
- [ ] 启动测试

---

**下一步**: 
1. 运行 `./add_bots_to_doppler.sh` 添加Token
2. 把3个Bot加入测试群
3. 运行 `./run_multi_bots.sh` 启动系统
4. 在群里测试功能

🎉 准备就绪！
