# 📊 Datadog 监控配置指南

## 🎯 监控策略

### 核心思路
- ✅ **VPS部署Docker** - 所有服务容器化
- ✅ **Datadog监控VPS** - 监控所有容器
- ✅ **本地看Dashboard** - 不需要本地跑容器
- ✅ **零本地负担** - 本地只开发推送代码

---

## 📋 第一步：获取Datadog API Key

### 1. 登录Datadog

访问: https://app.datadoghq.com/

### 2. 创建API Key

1. 点击左下角 **Organization Settings**
2. 选择 **API Keys**
3. 点击 **New Key**
4. 输入名称: `DeepWeay VPS`
5. 复制生成的API Key

### 3. 配置环境变量

**VPS上配置 `/var/www/studio/.env.production`:**

```bash
# Datadog监控
DATADOG_API_KEY=your_api_key_here
DATADOG_SITE=datadoghq.com
DATADOG_SERVICE_NAME=deepweay-web
DATADOG_ENV=production
```

---

## 🐳 第二步：VPS Docker配置

### 1. 在VPS上创建docker-compose.yml

**SSH到VPS:**
```bash
ssh root@188.166.180.96
cd /var/www/studio
```

**创建配置文件:**

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Next.js Web应用
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: deepweay-web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXT_PUBLIC_SITE_URL=https://deepweay.me
    labels:
      com.datadoghq.ad.logs: '[{"source": "nextjs", "service": "deepweay-web"}]'
    networks:
      - deepweay-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Telegram Bot 1
  telegram-bot-1:
    build:
      context: ./telegram-bot
      dockerfile: Dockerfile
    container_name: deepweay-tg-bot-1
    restart: always
    environment:
      - NODE_ENV=production
      - BOT_NUM=1
      - TELEGRAM_BOT_TOKEN_1=${TELEGRAM_BOT_TOKEN_1}
      - TELEGRAM_BOT_USERNAME_1=${TELEGRAM_BOT_USERNAME_1}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    labels:
      com.datadoghq.ad.logs: '[{"source": "telegram-bot", "service": "tg-bot-1"}]'
    networks:
      - deepweay-network

  # Telegram Bot 2
  telegram-bot-2:
    build:
      context: ./telegram-bot
      dockerfile: Dockerfile
    container_name: deepweay-tg-bot-2
    restart: always
    environment:
      - NODE_ENV=production
      - BOT_NUM=2
      - TELEGRAM_BOT_TOKEN_2=${TELEGRAM_BOT_TOKEN_2}
      - TELEGRAM_BOT_USERNAME_2=${TELEGRAM_BOT_USERNAME_2}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    labels:
      com.datadoghq.ad.logs: '[{"source": "telegram-bot", "service": "tg-bot-2"}]'
    networks:
      - deepweay-network

  # Datadog Agent
  datadog:
    image: gcr.io/datadoghq/agent:7
    container_name: deepweay-datadog
    restart: always
    environment:
      - DD_API_KEY=${DATADOG_API_KEY}
      - DD_SITE=${DATADOG_SITE:-datadoghq.com}
      - DD_LOGS_ENABLED=true
      - DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
      - DD_PROCESS_AGENT_ENABLED=true
      - DD_APM_ENABLED=true
      - DD_APM_NON_LOCAL_TRAFFIC=true
      - DD_CONTAINER_LABELS_AS_TAGS=true
      - DD_TAGS=env:production,project:deepweay
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    networks:
      - deepweay-network

networks:
  deepweay-network:
    driver: bridge
EOF
```

### 2. 创建Dockerfile（Next.js）

```bash
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# 构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 运行
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF
```

### 3. 创建Telegram Bot Dockerfile

```bash
cat > telegram-bot/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY src ./src

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
EOF
```

### 4. 更新next.config.ts（支持standalone）

```bash
cat >> next.config.ts << 'EOF'
// 添加到配置
output: 'standalone',
EOF
```

---

## 🚀 第三步：VPS部署流程

### 1. 初次部署

```bash
# SSH到VPS
ssh root@188.166.180.96

# 拉取代码
cd /var/www/studio
git pull origin main

# 配置环境变量
nano .env.production
# 填入所有必要的Token和API Key

# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

### 2. 后续更新

**本地开发 → 推送:**
```bash
# 本地
git add .
git commit -m "feat: xxx"
git push origin main
```

**VPS自动部署脚本:**
```bash
# 创建部署脚本
cat > /var/www/studio/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/studio
git pull origin main
docker-compose up -d --build
docker-compose logs --tail=50
EOF

chmod +x deploy.sh

# 使用
./deploy.sh
```

---

## 📊 第四步：Datadog Dashboard配置

### 1. 访问Datadog

https://app.datadoghq.com/

### 2. 创建Dashboard

1. **Dashboards** → **New Dashboard**
2. 命名: `DeepWeay VPS Monitor`
3. 添加Widgets:

**系统指标:**
- CPU使用率
- 内存使用率
- 磁盘使用率
- 网络流量

**容器指标:**
- 容器状态
- 容器日志
- 容器重启次数

**应用指标:**
- HTTP请求数
- API响应时间
- 错误率

### 3. 设置Alerts

**CPU告警:**
- 条件: CPU > 80% 持续5分钟
- 通知: Email

**内存告警:**
- 条件: Memory > 90% 持续3分钟
- 通知: Email

**容器Down告警:**
- 条件: Container stopped
- 通知: Email + Slack

---

## 📱 本地开发工作流（零Docker）

### 1. Next.js开发

```bash
# 本地
cd /Users/svs.loline/Documents/Git/studio
npm run dev
# 访问 http://localhost:3000
```

### 2. Telegram Bot开发

```bash
# 本地（新终端）
cd telegram-bot
npm install
npm run bot1
# Bot开始运行，直接在Telegram测试
```

### 3. 查看VPS状态

**方法1: Datadog Dashboard**
- 打开浏览器
- 访问Datadog Dashboard
- 实时查看所有指标

**方法2: SSH查看**
```bash
ssh root@188.166.180.96
docker-compose ps
docker-compose logs -f web
```

### 4. 推送更新

```bash
# 本地测试完成后
git add .
git commit -m "feat: add xxx"
git push

# SSH到VPS
ssh root@188.166.180.96
cd /var/www/studio
./deploy.sh
```

---

## 🔍 监控指标说明

### Container Metrics

**查看方式:** Datadog → Containers

**关键指标:**
- `docker.containers.running` - 运行中的容器数
- `docker.cpu.usage` - 容器CPU使用
- `docker.mem.rss` - 容器内存使用

### Application Metrics

**查看方式:** Datadog → APM → Services

**关键指标:**
- `http.request.duration` - 请求延迟
- `http.request.count` - 请求数
- `error.rate` - 错误率

### Custom Metrics（可选）

在代码中添加自定义指标:

```javascript
// 例如：Gemini API调用统计
import { StatsD } from 'node-dogstatsd';
const dogstatsd = new StatsD();

// 记录Gemini调用
dogstatsd.increment('gemini.api.calls', 1, ['model:flash']);
dogstatsd.histogram('gemini.api.tokens', tokens);
```

---

## 💡 优化建议

### 1. 日志管理

**VPS日志轮转:**
```bash
# 创建logrotate配置
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size 10M
  missingok
  delaycompress
  copytruncate
}
EOF
```

### 2. 资源限制

**在docker-compose.yml中添加:**
```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 3. 健康检查

**自定义健康检查接口:**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

---

## 🎯 最终工作流

### 本地（Mac - 零Docker）

```
1. npm run dev          # Next.js开发
2. npm run bot1         # Bot测试（另一个终端）
3. 浏览器打开 Datadog   # 看VPS状态
4. git push            # 推送代码
```

### VPS（自动化）

```
1. GitHub接收push
2. 手动或自动 ./deploy.sh
3. Docker重新构建容器
4. Datadog自动监控
```

### 监控（Datadog Dashboard）

```
1. 打开浏览器
2. 访问 Datadog
3. 查看所有指标
4. 收到告警邮件（如有问题）
```

---

## ✅ 检查清单

### 初始配置（一次性）

- [ ] 获取Datadog API Key
- [ ] VPS创建docker-compose.yml
- [ ] VPS创建Dockerfile
- [ ] VPS配置.env.production
- [ ] Datadog创建Dashboard
- [ ] 设置告警规则

### 日常开发

- [ ] 本地npm run dev开发
- [ ] 本地npm run bot1测试Bot
- [ ] Datadog查看VPS状态
- [ ] git push推送代码
- [ ] VPS ./deploy.sh部署

---

**配置完成后，本地开发完全不需要Docker，只需要看Datadog Dashboard！** ✅
