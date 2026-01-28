# 🐳 DeepWeay Docker 快速启动指南

**目标**: 5分钟完成容器化部署到VPS

---

## 📋 Prerequisites

| 项目 | 要求 |
|------|------|
| VPS | DigitalOcean SFO2 (8GB RAM, 4 vCPUs) |
| 系统 | Ubuntu 25.10 x64 |
| IP | 165.227.50.171 (Primary), 134.209.142.24 (Reserved) |
| 域名 | deepweay.me → 134.209.142.24 |
| Docker | 24.0+ |
| docker-compose | 2.0+ |

---

## 🚀 One-Command Deployment

```bash
# SSH到VPS
ssh root@165.227.50.171

# Clone项目
git clone https://github.com/web3-ai-game/studio.git
cd studio

# 配置环境变量
cp .env.production.template .env.production
nano .env.production  # 填入API keys

# 一键部署
chmod +x vps-scripts/docker-deploy.sh
./vps-scripts/docker-deploy.sh
```

**预计时间**: 3-5分钟（首次需获取SSL证书）

---

## 🔧 Manual Step-by-Step

### 1. 安装Docker (如未安装)

```bash
# 使用官方脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装docker-compose
sudo apt install docker-compose -y

# 验证
docker --version         # 应显示 24.0+
docker-compose --version # 应显示 2.0+
```

### 2. 配置环境变量

```bash
cp .env.production.template .env.production
```

**必填项**:
```bash
# Supabase (从 https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt/settings/api)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Gemini AI (从 https://aistudio.google.com/apikey)
GOOGLE_GENAI_API_KEY=AIza...

# Telegram Bots (从 @BotFather)
TELEGRAM_BOT_TOKEN_1=7123...:AAH...
TELEGRAM_BOT_TOKEN_2=7456...:AAH...

# NextAuth Secret (生成)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 3. 构建并启动容器

```bash
# 构建镜像（首次或代码更新时）
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps
```

**预期输出**:
```
NAME                   STATUS         PORTS
deepweay-nginx         Up (healthy)   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
deepweay-web           Up (healthy)   3000/tcp
deepweay-tg-bot-1      Up             
deepweay-tg-bot-2      Up             
deepweay-datadog       Up             8125/udp, 8126/tcp
```

### 4. 获取SSL证书 (仅首次)

```bash
# 方法1: 使用部署脚本（推荐）
./vps-scripts/docker-deploy.sh  # 自动处理SSL

# 方法2: 手动获取
docker-compose run --rm nginx certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@deepweay.me \
  --agree-tos \
  --no-eff-email \
  -d deepweay.me \
  -d www.deepweay.me

# 重启Nginx加载证书
docker-compose restart nginx
```

### 5. 验证部署

```bash
# 检查健康状态
curl https://deepweay.me/api/health

# 查看日志
docker-compose logs -f web

# 访问应用
open https://deepweay.me  # 或浏览器打开
```

---

## 📊 Container Architecture

```
┌─────────────────────────────────────────┐
│  Internet (Port 80/443)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  deepweay-nginx (Reverse Proxy + SSL)   │
│  - SSL Termination                      │
│  - Rate Limiting                        │
│  - Static Asset Caching                 │
└─────────────────┬───────────────────────┘
                  │ (Internal: Port 3000)
┌─────────────────▼───────────────────────┐
│  deepweay-web (Next.js App)             │
│  - Server Components                    │
│  - API Routes                           │
│  - Standalone Build                     │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
┌─────▼────┐ ┌───▼────┐ ┌───▼──────┐
│ TG Bot 1 │ │ TG Bot │ │ Datadog  │
│ (小爱)    │ │ 2(备用) │ │ Agent    │
└──────────┘ └────────┘ └──────────┘
                  │
            (External)
                  │
      ┌───────────┼───────────┐
      │           │           │
┌─────▼────┐ ┌───▼────┐ ┌───▼──────┐
│ Supabase │ │ Gemini │ │ Telegram │
│ (外部)    │ │ AI API │ │ Bot API  │
└──────────┘ └────────┘ └──────────┘
```

---

## 🛠️ Common Operations

### 查看日志

```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f web
docker-compose logs -f nginx
docker-compose logs -f telegram-bot-1

# 最近100行
docker-compose logs --tail=100 web
```

### 重启服务

```bash
# 重启单个服务
docker-compose restart web
docker-compose restart nginx

# 重启所有服务
docker-compose restart

# 完全重建（代码更新后）
docker-compose down
docker-compose up -d --build
```

### 更新部署

```bash
# 方法1: 使用快速部署脚本
./vps-scripts/deploy.sh

# 方法2: 手动更新
git pull origin main
docker-compose down
docker-compose up -d --build
```

### 进入容器调试

```bash
# 进入Next.js容器
docker-compose exec web sh

# 执行命令
docker-compose exec web node test-supabase.js

# 查看环境变量
docker-compose exec web env | grep SUPABASE
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 删除未使用的镜像
docker image prune -a

# 删除未使用的卷
docker volume prune

# 完全清理（危险！）
docker system prune -a --volumes
```

---

## 🔍 Troubleshooting

### Issue: Container健康检查失败

```bash
# 查看健康状态
docker-compose ps

# 查看详细日志
docker-compose logs web

# 手动测试健康端点
docker-compose exec web wget -O- http://localhost:3000/api/health
```

### Issue: SSL证书获取失败

**原因**:
1. DNS未正确配置
2. 端口80被占用
3. 域名验证失败

**解决**:
```bash
# 检查DNS
dig +short deepweay.me  # 应返回 134.209.142.24

# 检查端口
netstat -tulpn | grep :80

# 停止其他服务
sudo systemctl stop apache2  # 如果有
sudo systemctl stop nginx    # 宿主机的nginx

# 重试获取证书
docker-compose run --rm nginx certbot certonly --standalone \
  -d deepweay.me -d www.deepweay.me
```

### Issue: Supabase连接失败

```bash
# 测试连接
docker-compose exec web node test-supabase.js

# 检查环境变量
docker-compose exec web env | grep SUPABASE

# 验证.env.production配置
cat .env.production | grep SUPABASE
```

### Issue: 容器无法启动

```bash
# 查看错误详情
docker-compose logs [service_name]

# 检查端口占用
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000

# 释放端口
sudo kill -9 [PID]
```

---

## 📈 Monitoring

### Datadog Dashboard

1. 访问: https://app.datadoghq.com
2. 查找主机: `deepweay-vps-production`
3. 查看容器: `deepweay-*`

**Key Metrics**:
- CPU使用率: < 60%
- 内存使用: < 6GB (8GB总量)
- 响应时间: < 200ms (p95)
- 错误率: < 1%

### Health Checks

```bash
# API健康检查
curl https://deepweay.me/api/health

# Nginx健康检查
curl https://deepweay.me/health

# Docker健康状态
docker-compose ps | grep healthy
```

---

## 🔐 Security Checklist

- [x] SSL/TLS已启用 (Let's Encrypt)
- [x] HTTP→HTTPS自动重定向
- [x] Security headers已配置
- [x] API rate limiting已启用
- [x] 容器以非root用户运行
- [x] 敏感数据在.env.production (不提交git)
- [x] Supabase RLS已启用
- [x] Datadog日志脱敏

---

## 📚 Resources

| 资源 | 链接 |
|------|------|
| VPS控制台 | https://cloud.digitalocean.com |
| Supabase后台 | https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt |
| Datadog监控 | https://app.datadoghq.com |
| Docker文档 | https://docs.docker.com |
| Let's Encrypt | https://letsencrypt.org/docs |
| 项目GitHub | https://github.com/web3-ai-game/studio |

---

## ✅ Success Indicators

部署成功后，你应该看到：

1. ✅ `https://deepweay.me` 正常访问（绿色锁图标）
2. ✅ 登录/注册功能正常
3. ✅ Datadog显示所有容器在线
4. ✅ Telegram Bot响应消息
5. ✅ Health check返回200

**测试命令**:
```bash
# 1. SSL测试
curl -I https://deepweay.me | grep "HTTP/2 200"

# 2. 健康检查
curl https://deepweay.me/api/health | jq .status  # 应返回 "healthy"

# 3. 容器状态
docker-compose ps | grep -c "healthy"  # 应返回 2 (nginx + web)

# 4. 日志检查
docker-compose logs --tail=50 | grep -i error  # 应无严重错误
```

---

**Last Updated**: 2025-11-06  
**Version**: 1.0.0  
**Deployment Time**: ~5 minutes  
**Maintainer**: @DeepWeay Team
