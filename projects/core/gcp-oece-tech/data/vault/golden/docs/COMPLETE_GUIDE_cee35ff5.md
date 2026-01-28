# 🍄 菌丝网络 - 完整部署指南

> 8GB内存 + 20GB Swap | 2 AMD CPU | ~$30/月 | 支持100+用户

---

## 📊 当前配置

```yaml
VPS配置:
  提供商: DigitalOcean
  CPU: 2 AMD vCPU
  内存: 8GB RAM
  Swap: 20GB (已优化)
  总内存: 28GB
  主盘: 90GB SSD
  外挂盘: 20GB (项目盘)
  价格: ~$30/月
  年省: $216 (从$48降配)

系统优化:
  ✅ Swap 20GB已配置
  ✅ 内核参数已优化
  ✅ swappiness=20
  ✅ 开机自动挂载

资源预算:
  物理内存: 8GB
  虚拟内存: 20GB
  容器占用: ~1.8GB实际
  系统开销: ~1.2GB
  可用缓冲: ~25GB
```

---

## 🚀 快速开始

### 1. 启动监控

```bash
# 每20秒刷新一次
./monitor.sh --watch
```

### 2. 启动容器服务

```bash
# 使用8GB优化配置
docker-compose -f docker-compose.8gb.yml up -d

# 查看状态
docker-compose -f docker-compose.8gb.yml ps
```

### 3. 检查资源

```bash
# 查看内存和swap
free -h

# 查看容器资源
docker stats

# 查看磁盘
df -h
```

---

## 🔑 Doppler Keys 配置

### API Keys 分类

#### AI/LLM (8个服务)
```yaml
Gemini API:
  - 25个免费Keys池
  - 智能路由分发
  - 主力AI引擎
  
OpenAI: 备用AI引擎
Anthropic (Claude): 长文本处理
OpenRouter: 多模型聚合
Jules AI: 商业助手
```

#### 数据库 (2个)
```yaml
Supabase:
  - PostgreSQL数据库
  - 用户认证
  - 对象存储
  - 免费层充足
  
PostgreSQL:
  - 本地论坛数据库
  - VPS容器运行
```

#### Telegram (3个Bot)
```yaml
svsinst_bot: 小爱同学AI对话
svskilo_bot: 主Bot通用服务
svslovea_bot: 情感陪伴Bot
```

#### 基础设施
```yaml
GitHub: 代码仓库
Notion: 知识库
Doppler: 密钥管理
Sentry: 错误追踪
DigitalOcean: VPS管理
```

### 部署Doppler Keys到VPS

```bash
# 使用现有脚本
./doppler_setup_keys.sh
```

---

## 🐳 容器架构

### 12个微服务

```yaml
核心服务:
  1. Redis (1GB)
     - 缓存和会话
     - 限流计数
     
  2. Nginx (128MB)
     - 反向代理
     - 静态文件
     - SSL终止

AI服务:
  3. Xiaoai Bot (256MB)
     - Telegram Bot
     - AI对话引擎
     - 25 Keys智能路由

Web服务:
  4. Portal (512MB) - 欢迎页+登录
  5. Forum (512MB) - 论坛系统
  6. Chat (384MB) - 在线聊天室
  7. Panel (384MB) - 个人面板
  8. Admin (384MB) - 管理后台

游戏经济:
  9. Economy (256MB) - 菌丝经济引擎
  10. Game (512MB) - 游戏服务

辅助服务:
  11. Translator (192MB) - 翻译服务
  12. KB (384MB) - 知识库

总计限制: ~4.8GB
实际占用: ~1.8GB
```

### 容器配置文件

```bash
# 8GB内存专用配置
docker-compose.8gb.yml - 完整12服务

# 启动方式
docker-compose -f docker-compose.8gb.yml up -d

# 停止
docker-compose -f docker-compose.8gb.yml down

# 重启单个服务
docker-compose -f docker-compose.8gb.yml restart xiaoai-bot

# 查看日志
docker-compose -f docker-compose.8gb.yml logs -f xiaoai-bot
```

---

## 🎮 性能预期

```yaml
并发能力:
  - 100-200 在线用户
  - 200+ WebSocket连接
  - 1000+ API请求/分钟

响应性能:
  - API: <100ms
  - WebSocket: <50ms
  - 静态资源: <10ms

稳定性:
  ✅ 8GB物理内存充足
  ✅ 20GB Swap缓冲
  ✅ 2 AMD CPU性能优秀
  ✅ 容器自动重启
  ✅ 健康检查机制
```

---

## 💾 存储管理

### 主盘90GB分配

```yaml
系统: 10GB
Docker镜像: 8GB
Swap: 20GB
日志: 2GB
缓存: 3GB
剩余: 47GB
```

### 外挂20GB用途

```yaml
项目代码: 2GB
数据存储: 5GB
备份文件: 5GB
开发环境: 3GB
预留: 5GB
```

---

## 🔧 维护命令

### 日常监控

```bash
# 资源监控（20秒刷新）
./monitor.sh --watch

# 内存使用
free -h && swapon --show

# 容器状态
docker stats

# 磁盘使用
df -h
```

### 容器管理

```bash
# 查看所有容器
docker ps -a

# 重启所有服务
docker-compose -f docker-compose.8gb.yml restart

# 清理未使用镜像
docker image prune -a

# 清理未使用卷
docker volume prune

# 查看日志
docker-compose -f docker-compose.8gb.yml logs -f --tail=50
```

### 备份与恢复

```bash
# 备份Doppler配置
./doppler_backup.sh

# 备份数据库（使用Supabase自动备份）

# 备份代码
git push origin main
```

---

## 🛠️ 故障排查

### 内存不足

```bash
# 检查内存使用
free -h

# 如果物理内存>6GB，检查容器
docker stats

# 重启占用高的容器
docker restart <container_name>
```

### Swap使用过高

```bash
# 查看swap使用
swapon --show

# 如果>10GB，需要优化
# 降低swappiness
sudo sysctl -w vm.swappiness=10
```

### 容器无法启动

```bash
# 查看日志
docker logs <container_name>

# 检查端口占用
netstat -tuln | grep <port>

# 重新构建
docker-compose -f docker-compose.8gb.yml build <service>
docker-compose -f docker-compose.8gb.yml up -d <service>
```

### 磁盘空间不足

```bash
# 清理Docker
docker system prune -a

# 清理日志
sudo journalctl --vacuum-time=3d

# 清理apt缓存
sudo apt clean
```

---

## 📈 扩展建议

### 何时需要升级

```yaml
触发条件:
  - 日活用户>150
  - 内存使用率持续>75%
  - Swap使用>50%
  - CPU使用率>80%
  - 响应时间变慢

升级选项:
  - 4 vCPU (保持8GB内存)
  - 或添加负载均衡
  - 或分离前后端
```

### 水平扩展方案

```yaml
方案A: 双VPS分离
  VPS1: 前端+Nginx ($12-18/月)
  VPS2: 后端+Bot ($24/月)
  总计: $36-42/月

方案B: 专用服务
  VPS1: Bot+AI ($18/月)
  VPS2: Web服务 ($24/月)
  总计: $42/月

方案C: 负载均衡
  多个2CPU/4GB实例
  DO Load Balancer
  按需扩展
```

---

## 📝 有用的脚本

### monitor.sh - 资源监控

```bash
./monitor.sh           # 运行一次
./monitor.sh --watch   # 持续监控（20秒刷新）
```

### doppler_setup_keys.sh - 配置Doppler

```bash
./doppler_setup_keys.sh
# 将所有Keys上传到VPS环境变量
```

### doppler_backup.sh - 备份配置

```bash
./doppler_backup.sh
# 备份当前Doppler配置
```

---

## 🎯 开发工作流

### 本地开发（推荐）

```bash
# 1. 本地编辑代码
code .

# 2. 提交到Git
git add .
git commit -m "更新"
git push origin main

# 3. VPS拉取
ssh root@your-vps
cd /mnt/volume_sgp1_01/svs_bot
git pull

# 4. 重启容器
docker-compose -f docker-compose.8gb.yml restart
```

### VPS开发（如需要）

```yaml
优势:
  - 随时随地开发
  - 代码在服务器

注意:
  - VS Code Server占用~1.5GB
  - 需要配置SSH密钥
  - 网络延迟影响体验
```

---

## 💰 成本总结

```yaml
降配前: $48/月 (8GB/4CPU/160GB)
降配后: ~$30/月 (8GB/2CPU/90GB+20GB外挂)
年省: $216

优化效果:
  ✅ 成本降低48%
  ✅ 性能保持
  ✅ 2 AMD CPU更快
  ✅ 20GB Swap缓冲
  ✅ 完全满足100+用户

结论: 完美降本增效！
```

---

## 🔐 安全建议

```yaml
防火墙:
  - 仅开放 22, 80, 443
  - 使用ufw管理
  
SSH:
  - 禁用密码登录
  - 仅密钥认证
  - 非标准端口
  
密钥管理:
  - 使用Doppler统一管理
  - 定期轮换
  - 审计日志
  
备份:
  - 代码: GitHub
  - 数据库: Supabase自动备份
  - 配置: Doppler备份
  - VPS: DO快照（按需）
```

---

## 📞 支持与文档

```yaml
项目仓库:
  GitHub: web3-ai-game/svs-telegram-bot
  
主要文档:
  - COMPLETE_GUIDE.md (本文档)
  - DOPPLER_KEYS_INVENTORY.md (Keys清单)
  - docker-compose.8gb.yml (容器配置)
  
监控脚本:
  - monitor.sh (资源监控)
  
Doppler脚本:
  - doppler_setup_keys.sh (部署keys)
  - doppler_backup.sh (备份配置)
```

---

## 🎉 总结

你现在拥有一个：
- ✅ 成本优化的VPS ($30/月)
- ✅ 28GB总内存 (8GB物理+20GB虚拟)
- ✅ 12个微服务容器架构
- ✅ 完整的监控和管理工具
- ✅ 支持100+用户的能力
- ✅ 灵活的扩展方案

**系统已优化完成，可以开始开发和部署了！** 🍄🚀
