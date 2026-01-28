# 🚀 Datadog监控 - 手把手完整指南

**适用于：** DigitalOcean VPS + Docker + 零经验用户

**目标：** 30分钟内完成从零到监控运行

---

## 📋 准备工作

### 你需要的信息

- ✅ VPS IP: `188.166.180.96`
- ✅ SSH密码或密钥
- ✅ Datadog账号（GitHub学生包已激活）
- ✅ 浏览器

---

## 第一部分：获取Datadog API Key（5分钟）

### Step 1: 登录Datadog

1. 打开浏览器
2. 访问: https://app.datadoghq.com/
3. 使用GitHub学生包账号登录

### Step 2: 获取API Key

**操作步骤：**

1. 点击左下角 **头像/Organization Settings**
2. 左侧菜单选择 **API Keys**
3. 点击右上角 **+ New Key**
4. 名称输入: `deepweay-vps`
5. 点击 **Create Key**
6. **立即复制API Key并保存** ⚠️ 只显示一次！

**API Key格式：**
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
ae7af4dca416e9e3894b31c0a12cf093
**保存位置：**
```
创建一个临时文本文件保存：
- Datadog API Key: [粘贴在这里]
```

### Step 3: 确认站点

在同一页面确认你的Datadog站点：

- 🇺🇸 US1: `datadoghq.com` (最常见)
- 🇪🇺 EU: `datadoghq.eu`
- 🇺🇸 US3: `us3.datadoghq.com`
- 🇺🇸 US5: `us5.datadoghq.com`

**记下你的站点！** 例如: `datadoghq.com`

---

## 第二部分：SSH连接VPS（2分钟）

### Mac/Linux用户

打开终端，输入：

```bash
ssh root@188.166.180.96
```

输入密码后回车。

**看到这样的提示就成功了：**
```
Welcome to Ubuntu 22.04.3 LTS
root@deepweay:~#
```

### Windows用户

使用PowerShell或下载PuTTY：

```powershell
ssh root@188.166.180.96
```

---

## 第三部分：安装Docker（10分钟）

### Step 1: 检查是否已安装Docker

```bash
docker --version
```

**如果显示版本号：** 跳到Step 3

**如果显示command not found：** 继续Step 2

### Step 2: 安装Docker

**复制粘贴以下命令（一次一行）：**

```bash
# 更新包管理器
apt update

# 安装必要工具
apt install -y apt-transport-https ca-certificates curl software-properties-common

# 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# 添加Docker仓库
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 更新包列表
apt update

# 安装Docker
apt install -y docker-ce docker-ce-cli containerd.io

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose
```

**等待安装完成（约2-3分钟）**

### Step 3: 验证安装

```bash
docker --version
docker-compose --version
```

**预期输出：**
```
Docker version 24.x.x
Docker Compose version v2.23.0
```

✅ **看到版本号就成功了！**

---

## 第四部分：配置项目（10分钟）

### Step 1: 进入项目目录

```bash
cd /var/www/studio
```

**如果目录不存在，先clone项目：**

```bash
# 创建目录
mkdir -p /var/www
cd /var/www

# Clone项目
git clone https://github.com/web3-ai-game/studio.git
cd studio
```

### Step 2: 创建环境变量文件

```bash
nano .env.production
```

**复制粘贴以下内容（注意替换你的实际值）：**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODU3MTYsImV4cCI6MjA3Nzc2MTcxNn0.6LBkr5EWygKpWeOTs7Hnap0nu7Mp76UQjxt1UXbcbPY
SUPABASE_SERVICE_KEY=你的service_key

# Gemini AI
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ

# Telegram Bot
TELEGRAM_BOT_TOKEN_1=8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
TELEGRAM_BOT_USERNAME_1=svsinst_bot
TELEGRAM_BOT_TOKEN_2=7602987646:AAF-bR1EQuHEi7lmXhWVYOVQurciTKnv15M
TELEGRAM_BOT_USERNAME_2=svslovea_bot
TELEGRAM_ADMIN_USER_ID=8058330099

# Datadog (⚠️ 替换成你的API Key！)
DATADOG_API_KEY=你的Datadog_API_Key
DATADOG_SITE=datadoghq.com

# App
NEXT_PUBLIC_SITE_URL=https://deepweay.me
NODE_ENV=production
```

**保存文件：**
1. 按 `Ctrl + X`
2. 按 `Y`
3. 按 `Enter`

### Step 3: 创建docker-compose.yml

```bash
nano docker-compose.yml
```

**复制粘贴以下完整配置：**

```yaml
version: '3.8'

services:
  # ========================================
  # Next.js Web应用
  # ========================================
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: deepweay-web
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    labels:
      # Datadog日志收集
      com.datadoghq.ad.logs: '[{"source": "nextjs", "service": "deepweay-web", "log_processing_rules": [{"type": "multi_line", "name": "log_start_with_date", "pattern": "\\d{4}-\\d{2}-\\d{2}"}]}]'
      # Datadog标签
      com.datadoghq.tags.env: "production"
      com.datadoghq.tags.service: "deepweay-web"
    networks:
      - deepweay-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ========================================
  # Telegram Bot 1 (小爱同学)
  # ========================================
  telegram-bot-1:
    build:
      context: ./telegram-bot
      dockerfile: Dockerfile
    container_name: deepweay-tg-bot-1
    restart: always
    environment:
      - NODE_ENV=production
      - BOT_NUM=1
    env_file:
      - .env.production
    labels:
      com.datadoghq.ad.logs: '[{"source": "telegram-bot", "service": "tg-bot-1"}]'
      com.datadoghq.tags.env: "production"
      com.datadoghq.tags.service: "tg-bot-1"
    networks:
      - deepweay-network
    depends_on:
      - web

  # ========================================
  # Telegram Bot 2 (备用)
  # ========================================
  telegram-bot-2:
    build:
      context: ./telegram-bot
      dockerfile: Dockerfile
    container_name: deepweay-tg-bot-2
    restart: always
    environment:
      - NODE_ENV=production
      - BOT_NUM=2
    env_file:
      - .env.production
    labels:
      com.datadoghq.ad.logs: '[{"source": "telegram-bot", "service": "tg-bot-2"}]'
      com.datadoghq.tags.env: "production"
      com.datadoghq.tags.service: "tg-bot-2"
    networks:
      - deepweay-network
    depends_on:
      - web

  # ========================================
  # Datadog Agent (监控核心)
  # ========================================
  datadog:
    image: gcr.io/datadoghq/agent:7
    container_name: deepweay-datadog
    restart: always
    environment:
      # API配置
      - DD_API_KEY=${DATADOG_API_KEY}
      - DD_SITE=${DATADOG_SITE}
      
      # 日志收集
      - DD_LOGS_ENABLED=true
      - DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
      
      # 进程监控
      - DD_PROCESS_AGENT_ENABLED=true
      
      # APM追踪
      - DD_APM_ENABLED=true
      - DD_APM_NON_LOCAL_TRAFFIC=true
      
      # 容器监控
      - DD_CONTAINER_LABELS_AS_TAGS=true
      - DD_DOCKER_LABELS_AS_TAGS=true
      
      # 全局标签
      - DD_TAGS=env:production project:deepweay vps:digitalocean
      
      # 主机名
      - DD_HOSTNAME=deepweay-vps
    volumes:
      # Docker socket (监控容器)
      - /var/run/docker.sock:/var/run/docker.sock:ro
      
      # 系统信息
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
      
      # 容器日志
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      
      # 持久化数据
      - /opt/datadog-agent/run:/opt/datadog-agent/run:rw
    networks:
      - deepweay-network
    privileged: true

# ========================================
# 网络配置
# ========================================
networks:
  deepweay-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

**保存：** `Ctrl + X` → `Y` → `Enter`

### Step 4: 创建Next.js Dockerfile

```bash
nano Dockerfile
```

**粘贴以下内容：**

```dockerfile
# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# 复制package文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci --legacy-peer-deps

# ========================================
# Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源码
COPY . .

# 构建应用
RUN npm run build

# ========================================
# Stage 3: Runner
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 安装wget (用于healthcheck)
RUN apk add --no-cache wget

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
```

**保存：** `Ctrl + X` → `Y` → `Enter`

### Step 5: 创建Telegram Bot Dockerfile

```bash
nano telegram-bot/Dockerfile
```

**粘贴：**

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制package文件
COPY package.json package-lock.json* ./

# 安装生产依赖
RUN npm ci --production --ignore-scripts

# 复制源码
COPY src ./src

# 环境变量
ENV NODE_ENV=production

# 启动Bot
CMD ["node", "src/index.js"]
```

**保存：** `Ctrl + X` → `Y` → `Enter`

### Step 6: 更新next.config.ts (支持standalone)

```bash
nano next.config.ts
```

**找到 `export default NextConfig`，在里面添加：**

```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // 👈 添加这一行
  // ... 其他配置
};
```

**完整示例：**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // ... 其他配置
};

export default nextConfig;
```

**保存：** `Ctrl + X` → `Y` → `Enter`

---

## 第五部分：启动容器（5分钟）

### Step 1: 拉取最新代码

```bash
git pull origin main
```

### Step 2: 构建并启动

```bash
docker-compose up -d --build
```

**这会做什么：**
1. 构建Next.js镜像（约2-3分钟）
2. 构建Telegram Bot镜像（约30秒）
3. 下载Datadog Agent镜像（约30秒）
4. 启动所有容器

**预期输出：**
```
[+] Building 180.2s (25/25) FINISHED
[+] Running 5/5
 ✔ Network studio_deepweay-network    Created
 ✔ Container deepweay-datadog         Started
 ✔ Container deepweay-web             Started
 ✔ Container deepweay-tg-bot-1        Started
 ✔ Container deepweay-tg-bot-2        Started
```

### Step 3: 检查容器状态

```bash
docker-compose ps
```

**预期输出：**
```
NAME                 STATUS              PORTS
deepweay-datadog     Up 30 seconds       
deepweay-web         Up 30 seconds       0.0.0.0:3000->3000/tcp
deepweay-tg-bot-1    Up 30 seconds       
deepweay-tg-bot-2    Up 30 seconds
```

✅ **所有容器都是 `Up` 状态就成功了！**

### Step 4: 查看日志

**查看所有日志：**
```bash
docker-compose logs -f
```

**查看特定服务：**
```bash
# Web应用
docker-compose logs -f web

# Telegram Bot
docker-compose logs -f telegram-bot-1

# Datadog
docker-compose logs -f datadog
```

**退出日志查看：** 按 `Ctrl + C`

---

## 第六部分：Datadog Dashboard配置（10分钟）

### Step 1: 等待数据上报（2分钟）

容器启动后，Datadog Agent需要约2分钟开始上报数据。

**可以先喝口水☕**

### Step 2: 访问Datadog Dashboard

1. 打开浏览器
2. 访问: https://app.datadoghq.com/
3. 点击左侧菜单 **Infrastructure** → **Host Map**

**你应该看到：**
- 一个主机：`deepweay-vps`
- 绿色表示运行正常

### Step 3: 查看容器

1. 左侧菜单 **Containers**
2. 你会看到4个容器：
   - `deepweay-web`
   - `deepweay-tg-bot-1`
   - `deepweay-tg-bot-2`
   - `deepweay-datadog`

### Step 4: 创建自定义Dashboard

**操作步骤：**

1. 左侧菜单 **Dashboards** → **New Dashboard**
2. 输入名称: `DeepWeay Production Monitor`
3. 选择 **New Timeboard**
4. 点击 **Create Dashboard**

**添加Widget（重复4次）：**

#### Widget 1: 容器状态

1. 点击 **Add Widgets**
2. 选择 **Check Status**
3. 配置：
   - Title: `Container Health`
   - Check: `docker.service.up`
   - Group by: `container_name`
4. 点击 **Save**

#### Widget 2: CPU使用率

1. 点击 **Add Widgets**
2. 选择 **Timeseries**
3. 配置：
   - Title: `CPU Usage by Container`
   - Metric: `docker.cpu.usage`
   - Group by: `container_name`
4. 点击 **Save**

#### Widget 3: 内存使用

1. 点击 **Add Widgets**
2. 选择 **Timeseries**
3. 配置：
   - Title: `Memory Usage by Container`
   - Metric: `docker.mem.rss`
   - Group by: `container_name`
4. 点击 **Save**

#### Widget 4: 网络流量

1. 点击 **Add Widgets**
2. 选择 **Timeseries**
3. 配置：
   - Title: `Network Traffic`
   - Metric: `docker.net.bytes_sent` 和 `docker.net.bytes_rcvd`
   - Group by: `container_name`
4. 点击 **Save**

### Step 5: 查看日志

1. 左侧菜单 **Logs** → **Search**
2. 搜索框输入: `service:deepweay-web`
3. 你会看到Next.js的实时日志

**常用搜索：**
```
service:deepweay-web           # Web应用日志
service:tg-bot-1               # Bot 1日志
source:telegram-bot            # 所有Bot日志
status:error                   # 所有错误
```

---

## 第七部分：设置告警（5分钟）

### 告警1: 容器停止

1. 左侧菜单 **Monitors** → **New Monitor**
2. 选择 **Metric Monitor**
3. 配置：

**Define the metric:**
```
Metric: docker.containers.running
From: container_name
```

**Set alert conditions:**
```
Alert threshold: < 1
Warning threshold: (留空)
```

**Say what's happening:**
```
Title: {{container_name}} Container Stopped
Message: 
🚨 Container {{container_name}} has stopped!
Please check immediately.

@你的邮箱@gmail.com
```

4. 点击 **Create**

### 告警2: CPU过高

1. **New Monitor** → **Metric Monitor**
2. 配置：

**Define the metric:**
```
Metric: docker.cpu.usage
From: container_name
```

**Set alert conditions:**
```
Alert threshold: > 80
Warning threshold: > 60
```

**Say what's happening:**
```
Title: High CPU Usage on {{container_name}}
Message:
⚠️ CPU usage on {{container_name}} is {{value}}%

@你的邮箱@gmail.com
```

3. 点击 **Create**

### 告警3: 内存过高

1. **New Monitor** → **Metric Monitor**
2. 配置：

**Define the metric:**
```
Metric: docker.mem.rss
From: container_name
```

**Set alert conditions:**
```
Alert threshold: > 900000000 (900MB)
Warning threshold: > 700000000 (700MB)
```

**Say what's happening:**
```
Title: High Memory Usage on {{container_name}}
Message:
⚠️ Memory usage on {{container_name}} is high

@你的邮箱@gmail.com
```

3. 点击 **Create**

---

## 🎯 日常使用

### 查看监控

**浏览器访问：**
https://app.datadoghq.com/dashboard/lists

点击你的 `DeepWeay Production Monitor`

### 重启容器

**SSH到VPS：**
```bash
cd /var/www/studio

# 重启所有
docker-compose restart

# 重启单个
docker-compose restart web
docker-compose restart telegram-bot-1
```

### 查看日志

```bash
# 实时日志
docker-compose logs -f

# 最近50行
docker-compose logs --tail=50

# 特定服务
docker-compose logs -f web
```

### 更新代码

```bash
# SSH到VPS
cd /var/www/studio

# 拉取代码
git pull origin main

# 重新构建并重启
docker-compose up -d --build

# 查看启动日志
docker-compose logs -f
```

### 停止所有容器

```bash
docker-compose down
```

### 完全清理重建

```bash
# 停止并删除
docker-compose down -v

# 清理镜像
docker system prune -a

# 重新构建
docker-compose up -d --build
```

---

## 📊 监控指标说明

### 容器指标

| 指标 | 说明 | 正常值 |
|------|------|--------|
| `docker.containers.running` | 运行中的容器数 | 4 |
| `docker.cpu.usage` | CPU使用率 | < 50% |
| `docker.mem.rss` | 内存使用 | < 800MB |
| `docker.net.bytes_sent` | 发送流量 | 取决于流量 |

### 日志级别

- `INFO` - 正常信息
- `WARN` - 警告（需要注意）
- `ERROR` - 错误（需要处理）
- `DEBUG` - 调试信息

---

## ❗ 常见问题

### Q: 容器一直重启

**检查日志：**
```bash
docker-compose logs web
```

**常见原因：**
1. 环境变量配置错误
2. 端口冲突
3. 内存不足

### Q: Datadog没有数据

**检查步骤：**

1. API Key是否正确
```bash
cat .env.production | grep DATADOG
```

2. Datadog容器是否运行
```bash
docker-compose ps datadog
```

3. 查看Datadog日志
```bash
docker-compose logs datadog
```

### Q: Web应用无法访问

**检查：**

1. 容器状态
```bash
docker-compose ps web
```

2. 端口是否开放
```bash
netstat -tulpn | grep 3000
```

3. Nginx配置（如果有）
```bash
nginx -t
```

### Q: Bot无响应

**检查：**

1. Bot容器日志
```bash
docker-compose logs telegram-bot-1
```

2. Token是否正确
```bash
cat .env.production | grep TELEGRAM
```

3. 网络连接
```bash
docker-compose exec telegram-bot-1 ping -c 3 api.telegram.org
```

---

## ✅ 完成检查清单

- [ ] Docker和Docker Compose已安装
- [ ] .env.production已配置
- [ ] docker-compose.yml已创建
- [ ] Dockerfile已创建
- [ ] 容器全部运行中
- [ ] Datadog显示主机
- [ ] Datadog显示4个容器
- [ ] Dashboard已创建
- [ ] 告警已设置
- [ ] Web应用可访问
- [ ] Bot可以对话

---

## 🎉 恭喜完成！

你现在有了：

- ✅ 完整的Docker容器化环境
- ✅ Datadog实时监控
- ✅ 自动告警系统
- ✅ 容器日志收集
- ✅ 性能指标追踪

**本地开发 + VPS生产 + Datadog监控 = 完美！** 🚀

---

**需要帮助？**
- Datadog文档: https://docs.datadoghq.com/
- Docker文档: https://docs.docker.com/
- 项目Issues: https://github.com/web3-ai-game/studio/issues
