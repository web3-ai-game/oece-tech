# 🍄 菌丝网络 - 完整部署步骤

## 📋 部署清单

### 阶段 1: 准备工作 ✅

**已完成:**
- ✅ VPS降配到 2AMD/8GB ($30/月)
- ✅ Swap升级到20GB
- ✅ 监控脚本配置 (20秒刷新)
- ✅ 文档整理完成
- ✅ 外挂盘准备好 (20GB)

**当前状态:**
```yaml
CPU: 2 AMD vCPU
内存: 8GB RAM
Swap: 20GB
总可用: 28GB
主盘: 90GB (41GB可用)
外挂盘: 20GB (/mnt/volume_sgp1_01)
```

---

## 🔑 阶段 2: 从Doppler获取所有Keys

### 2.1 需要的Doppler Keys

```yaml
核心必需:
  - DD_API_KEY (Datadog监控)
  - DD_APP_KEY (Datadog应用)
  - DD_SITE (默认: datadoghq.com)
  
  - TELEGRAM_BOT_XIAOAI_TOKEN (小爱Bot)
  - BOT_OWNER_ID (Bot管理员)
  
  - GEMINI_API_KEY_1 到 GEMINI_API_KEY_25 (25个)
  
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  
可选增强:
  - DOCKER_USERNAME (Docker Hub用户名)
  - DOCKER_TOKEN (Docker Hub访问令牌)
  
  - GITHUB_TOKEN
  - NOTION_TOKEN
  - SENTRY_DSN
  - OPENAI_API_KEY
```

### 2.2 如何获取Docker Hub Token

1. **访问 Docker Hub**
   ```
   https://hub.docker.com/
   ```

2. **登录后进入设置**
   ```
   Account Settings → Security → Access Tokens
   ```

3. **创建新Token**
   ```
   名称: Mycelium VPS
   权限: Read, Write, Delete
   ```

4. **复制Token并添加到Doppler**
   ```
   DOCKER_USERNAME=你的用户名
   DOCKER_TOKEN=dckr_pat_xxxxxxxxxxxxx
   ```

### 2.3 从Doppler导出配置

**方法A: 使用Web界面**
```
1. 登录 https://dashboard.doppler.com
2. 选择项目: svs-api-key-all
3. 选择环境: dev 或 production
4. 点击 "Download .env"
5. 保存为 .env.production
```

**方法B: 使用CLI (需要Service Token)**
```bash
# 配置token
doppler configure set token dp.st.YOUR_TOKEN

# 导出所有keys
doppler secrets download --no-file --format env > .env.production

# 复制到项目
cp .env.production .env
```

**方法C: 手动复制（推荐）**
```bash
# 编辑模板
nano .env.template

# 从Doppler Web界面逐个复制keys
# 然后保存为
mv .env.template .env
```

---

## 🐕 阶段 3: 部署Datadog监控

### 3.1 准备Datadog Keys

从Doppler获取:
```bash
DD_API_KEY=xxx
DD_APP_KEY=xxx  # 可选
DD_SITE=datadoghq.com  # 或 datadoghq.eu
```

### 3.2 运行Datadog安装脚本

```bash
# 设置环境变量
export DD_API_KEY="你的API Key"
export DD_SITE="datadoghq.com"

# 运行安装
./setup-datadog.sh
```

**脚本会自动:**
- ✅ 安装Datadog Agent
- ✅ 配置系统监控
- ✅ 配置Docker监控
- ✅ 配置Redis/Nginx监控
- ✅ 启用日志收集
- ✅ 启用APM追踪

### 3.3 验证Datadog

```bash
# 检查Agent状态
sudo datadog-agent status

# 查看日志
sudo journalctl -u datadog-agent -f

# 访问Dashboard
https://app.datadoghq.com
```

---

## 📦 阶段 4: 备份现有环境

### 4.1 运行备份脚本

```bash
./rebuild-plan.sh
```

**脚本会:**
1. ✅ 备份项目代码到外挂盘
2. ✅ 备份Docker卷
3. ✅ 备份环境变量
4. ✅ 记录容器状态
5. ✅ 提交到Git

**备份位置:**
```
/mnt/volume_sgp1_01/backup_YYYYMMDD_HHMMSS/
```

### 4.2 Git同步

```bash
cd /mnt/volume_sgp1_01/svs_bot
git add -A
git commit -m "🔄 重构前完整备份"
git push origin main
```

---

## 🧹 阶段 5: 清理现有容器

### 5.1 安全清理

```bash
# 查看当前容器
docker ps -a

# 停止所有容器
docker stop $(docker ps -aq)

# 删除所有容器
docker rm $(docker ps -aq)

# 清理未使用的镜像
docker image prune -a -f

# 完整系统清理
docker system prune -a -f --volumes
```

### 5.2 验证清理

```bash
# 应该没有容器
docker ps -a

# 应该只剩基础镜像
docker images

# 检查磁盘空间释放
df -h
```

---

## 🏗️ 阶段 6: 构建新架构

### 6.1 确认环境变量

```bash
# 检查.env文件
cat .env | grep -E "TELEGRAM|GEMINI|SUPABASE|DD_" | head -20

# 必须包含:
# - TELEGRAM_BOT_XIAOAI_TOKEN
# - GEMINI_API_KEYS (25个合并)
# - SUPABASE_*
# - DD_API_KEY
```

### 6.2 构建容器

```bash
# 使用新配置构建
docker-compose -f docker-compose.new.yml build

# 启动所有服务
docker-compose -f docker-compose.new.yml up -d
```

### 6.3 验证部署

```bash
# 查看容器状态
docker-compose -f docker-compose.new.yml ps

# 查看日志
docker-compose -f docker-compose.new.yml logs -f

# 检查健康状态
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 🎯 阶段 7: 测试与验证

### 7.1 系统资源检查

```bash
# 内存使用
free -h

# Swap使用
swapon --show

# 容器资源
docker stats

# 磁盘使用
df -h
```

### 7.2 服务健康检查

```bash
# Redis
docker exec mycelium-redis redis-cli ping

# PostgreSQL
docker exec mycelium-postgres pg_isready

# Nginx
curl http://localhost/health

# API Gateway
curl http://localhost/api/health
```

### 7.3 Datadog Dashboard

访问并检查:
```
https://app.datadoghq.com

查看:
- Infrastructure → Host Map (VPS状态)
- Containers (Docker容器)
- APM → Services (服务追踪)
- Logs (日志收集)
```

---

## 📊 阶段 8: 持续监控

### 8.1 启动监控脚本

```bash
# 实时监控 (20秒刷新)
./monitor.sh --watch
```

### 8.2 配置告警

在Datadog中设置告警:
- CPU使用率 > 80%
- 内存使用率 > 85%
- Swap使用 > 50%
- 容器异常退出
- API响应时间 > 1s

---

## 🔄 完整自动化脚本

**一键完成2-6阶段:**

```bash
./setup-complete-stack.sh
```

**脚本会交互式引导你:**
1. 备份现有环境
2. 配置Doppler
3. 安装Datadog
4. 添加Docker Token
5. 构建新架构
6. 验证部署

---

## 📝 部署检查清单

### 部署前

- [ ] Doppler keys已准备好
- [ ] Datadog API key已获取
- [ ] Docker Hub token已创建
- [ ] Git已同步最新代码
- [ ] 备份脚本已测试

### 部署中

- [ ] 备份完成
- [ ] Git已推送
- [ ] 旧容器已清理
- [ ] Datadog已安装
- [ ] 环境变量已配置
- [ ] 新容器已构建

### 部署后

- [ ] 所有容器运行正常
- [ ] 健康检查通过
- [ ] Datadog收到数据
- [ ] 日志正常收集
- [ ] 资源使用合理
- [ ] API响应正常

---

## 🆘 故障排查

### 容器启动失败

```bash
# 查看详细日志
docker-compose -f docker-compose.new.yml logs <service-name>

# 检查环境变量
docker-compose -f docker-compose.new.yml config

# 重新构建
docker-compose -f docker-compose.new.yml build --no-cache <service-name>
```

### Datadog未收到数据

```bash
# 检查Agent状态
sudo datadog-agent status

# 重启Agent
sudo systemctl restart datadog-agent

# 查看Agent日志
sudo journalctl -u datadog-agent -n 100
```

### 内存不足

```bash
# 检查Swap
swapon --show

# 调整swappiness
sudo sysctl -w vm.swappiness=10

# 重启占用高的容器
docker restart <container-name>
```

---

## 🎉 部署成功标志

```yaml
✅ 6个容器运行中:
  - mycelium-redis
  - mycelium-postgres
  - mycelium-xiaoai
  - mycelium-gateway
  - mycelium-nginx
  - datadog-agent

✅ 内存使用 < 6GB (物理)
✅ Swap使用 < 5GB
✅ CPU使用 < 60%
✅ 所有健康检查通过
✅ Datadog Dashboard显示数据
✅ 日志正常收集
✅ API可访问

总成本: ~$30/月
性能: 支持100+用户
可用性: 99%+
```

---

## 📞 下一步行动

1. **立即执行:**
   ```bash
   # 从Doppler获取keys
   # 填写到 .env
   
   # 运行完整部署
   ./setup-complete-stack.sh
   ```

2. **验证监控:**
   ```bash
   # 本地监控
   ./monitor.sh --watch
   
   # Datadog Dashboard
   https://app.datadoghq.com
   ```

3. **部署应用:**
   ```bash
   # 前端、Bot等服务
   # 根据需要添加到docker-compose.new.yml
   ```

---

**准备好了吗？开始部署！** 🚀
