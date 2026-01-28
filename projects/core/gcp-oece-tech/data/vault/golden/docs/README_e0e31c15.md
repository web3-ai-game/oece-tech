# VPS部署脚本使用指南

## 📂 脚本说明

### 1. `install-docker.sh` - Docker安装
**用途：** 在全新的Ubuntu VPS上安装Docker和Docker Compose

**使用方法：**
```bash
# SSH到VPS
ssh root@188.166.180.96

# 下载并执行
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/studio/main/vps-scripts/install-docker.sh | bash
```

**或本地执行：**
```bash
cd /var/www/studio
bash vps-scripts/install-docker.sh
```

---

### 2. `setup-project.sh` - 项目配置
**用途：** 交互式配置.env.production文件

**使用方法：**
```bash
cd /var/www/studio
bash vps-scripts/setup-project.sh
```

**会要求输入：**
- Datadog API Key ⚠️ 必填
- Datadog Site (默认: datadoghq.com)
- Supabase配置 (可跳过使用默认值)

---

### 3. `deploy.sh` - 快速部署
**用途：** 一键更新并重启所有服务

**使用方法：**
```bash
cd /var/www/studio
./vps-scripts/deploy.sh
```

**执行内容：**
1. git pull 拉取最新代码
2. docker compose down 停止旧容器
3. docker compose up -d --build 构建新容器
4. 显示容器状态和日志

---

## 🚀 完整部署流程

### 首次部署（全新VPS）

```bash
# 1. SSH登录
ssh root@188.166.180.96

# 2. 安装Docker
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/studio/main/vps-scripts/install-docker.sh | bash

# 3. Clone项目
mkdir -p /var/www
cd /var/www
git clone https://github.com/web3-ai-game/studio.git
cd studio

# 4. 配置项目
bash vps-scripts/setup-project.sh
# 按提示输入Datadog API Key

# 5. 启动服务
docker compose up -d --build

# 6. 查看状态
docker compose ps
docker compose logs -f
```

---

### 日常更新部署

```bash
# SSH到VPS
ssh root@188.166.180.96

# 一键部署
cd /var/www/studio
./vps-scripts/deploy.sh
```

---

## 📋 常用命令

### 查看状态
```bash
cd /var/www/studio

# 容器状态
docker compose ps

# 实时日志
docker compose logs -f

# 查看特定服务
docker compose logs -f web
docker compose logs -f telegram-bot-1
```

### 重启服务
```bash
# 重启所有
docker compose restart

# 重启单个
docker compose restart web
```

### 停止服务
```bash
# 停止
docker compose down

# 停止并删除volume
docker compose down -v
```

### 清理重建
```bash
# 完全清理
docker compose down -v
docker system prune -a -f

# 重新构建
docker compose up -d --build
```

---

## 🔧 故障排查

### 容器启动失败

**查看详细日志：**
```bash
docker compose logs web
```

**常见问题：**
1. 环境变量错误 → 检查 `.env.production`
2. 端口占用 → `netstat -tulpn | grep 3000`
3. 内存不足 → `free -h`

### Datadog无数据

**检查步骤：**
```bash
# 1. 检查API Key
cat .env.production | grep DATADOG

# 2. 检查Datadog容器
docker compose ps datadog

# 3. 查看日志
docker compose logs datadog
```

### Bot无响应

```bash
# 查看Bot日志
docker compose logs telegram-bot-1

# 检查Token
cat .env.production | grep TELEGRAM

# 手动重启
docker compose restart telegram-bot-1
```

---

## 📊 监控

### Datadog Dashboard

访问: https://app.datadoghq.com/

**查看：**
- Infrastructure → Host Map（主机状态）
- Containers（容器列表）
- Logs（实时日志）
- Dashboards（自定义仪表板）

---

## 🔒 安全建议

### 1. 保护.env.production
```bash
chmod 600 .env.production
```

### 2. 定期更新系统
```bash
apt update && apt upgrade -y
```

### 3. 配置防火墙
```bash
# 允许SSH
ufw allow 22

# 允许HTTP/HTTPS
ufw allow 80
ufw allow 443

# 启用防火墙
ufw enable
```

---

## 📦 备份

### 备份配置文件
```bash
# 创建备份目录
mkdir -p ~/backups

# 备份环境变量
cp .env.production ~/backups/env.production.$(date +%Y%m%d)

# 备份docker-compose配置
cp docker-compose.yml ~/backups/docker-compose.$(date +%Y%m%d).yml
```

### 定期备份（可选）
```bash
# 创建cron任务
crontab -e

# 添加：每天凌晨2点备份
0 2 * * * cd /var/www/studio && cp .env.production ~/backups/env.production.$(date +\%Y\%m\%d)
```

---

## 🆘 紧急恢复

### 快速回滚
```bash
# 停止当前版本
docker compose down

# 回滚代码
git reset --hard HEAD~1

# 重新部署
docker compose up -d --build
```

### 从备份恢复
```bash
# 恢复环境变量
cp ~/backups/env.production.20231105 .env.production

# 重启服务
docker compose up -d --build
```

---

**需要帮助？** 
查看详细文档: `/DATADOG_QUICKSTART.md`
