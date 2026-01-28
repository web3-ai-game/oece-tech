# 🚀 立即部署到VPS - 5分钟快速指南

**所有配置已就绪！** Datadog API Key已配置好，直接执行即可！

---

## ⚡ 超快速部署（复制粘贴即可）

### Step 1: SSH到VPS（30秒）

```bash
ssh root@188.166.180.96
```

---

### Step 2: 检查Docker（1分钟）

```bash
docker --version
```

**如果显示版本号：** 跳到Step 3

**如果没有Docker：** 执行安装
```bash
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/studio/main/vps-scripts/install-docker.sh | bash
```

---

### Step 3: Clone项目（1分钟）

```bash
# 如果已经clone过，跳到Step 4
mkdir -p /var/www
cd /var/www
git clone https://github.com/web3-ai-game/studio.git
cd studio
```

**如果已有项目：**
```bash
cd /var/www/studio
git pull origin main
```

---

### Step 4: 创建生产环境配置（2分钟）

```bash
cat > .env.production << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODU3MTYsImV4cCI6MjA3Nzc2MTcxNn0.6LBkr5EWygKpWeOTs7Hnap0nu7Mp76UQjxt1UXbcbPY

# Gemini AI
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ

# Telegram Bots
TELEGRAM_BOT_TOKEN_1=8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
TELEGRAM_BOT_USERNAME_1=svsinst_bot
TELEGRAM_BOT_TOKEN_2=7602987646:AAF-bR1EQuHEi7lmXhWVYOVQurciTKnv15M
TELEGRAM_BOT_USERNAME_2=svslovea_bot
TELEGRAM_ADMIN_USER_ID=8058330099

# Datadog (US5站点)
DATADOG_API_KEY=ae7af4dca416e9e3894b31c0a12cf093
DATADOG_SITE=us5.datadoghq.com

# App
NEXT_PUBLIC_SITE_URL=https://deepweay.me
NODE_ENV=production
EOF
```

---

### Step 5: 启动所有容器（3-5分钟）

```bash
docker compose up -d --build
```

**这会做什么：**
- 构建Next.js镜像（~3分钟）
- 构建2个Telegram Bot镜像（~1分钟）
- 下载Datadog Agent镜像（~30秒）
- 启动所有4个容器

**预期输出：**
```
[+] Building 180.2s
[+] Running 5/5
 ✔ Network studio_deepweay-network    Created
 ✔ Container deepweay-datadog         Started
 ✔ Container deepweay-web             Started
 ✔ Container deepweay-tg-bot-1        Started
 ✔ Container deepweay-tg-bot-2        Started
```

---

### Step 6: 验证运行（30秒）

```bash
# 查看容器状态
docker compose ps
```

**预期看到：**
```
NAME                  STATUS
deepweay-datadog      Up 30 seconds
deepweay-web          Up 30 seconds (healthy)
deepweay-tg-bot-1     Up 30 seconds
deepweay-tg-bot-2     Up 30 seconds
```

**查看日志：**
```bash
# 所有容器日志
docker compose logs -f

# 或单独查看
docker compose logs -f web
docker compose logs -f telegram-bot-1
docker compose logs -f datadog
```

**退出日志：** 按 `Ctrl + C`

---

## ✅ 验证部署成功

### 1. 测试Web应用

**浏览器访问：**
```
http://188.166.180.96:3000
```

或如果配置了Nginx：
```
https://deepweay.me
```

---

### 2. 测试Telegram Bot

1. 打开Telegram
2. 搜索 `@svsinst_bot` 或 `@svslovea_bot`
3. 发送 `/start`
4. 应该收到欢迎消息

---

### 3. 检查Datadog监控

**浏览器访问：**
```
https://us5.datadoghq.com/
```

**应该看到：**
- Infrastructure → 1个主机 `deepweay-vps-production`
- Containers → 4个容器运行中
- Logs → 实时日志流

**等待2-3分钟数据开始上报**

---

## 📊 Datadog Dashboard配置（5分钟）

### 创建自定义Dashboard

1. 访问 https://us5.datadoghq.com/
2. 左侧菜单：**Dashboards** → **New Dashboard**
3. 名称：`DeepWeay Production Monitor`
4. 选择 **Timeboard**

### 添加Widget

**CPU使用率：**
- Widget类型：Timeseries
- Metric: `docker.cpu.usage`
- Group by: `container_name`

**内存使用：**
- Widget类型：Timeseries
- Metric: `docker.mem.rss`
- Group by: `container_name`

**容器状态：**
- Widget类型：Check Status
- Check: `docker.service.up`
- Group by: `container_name`

**日志流：**
- Widget类型：Log Stream
- Query: `source:nextjs OR source:telegram-bot`

---

## 🔧 常用运维命令

### 重启服务

```bash
# 重启所有
docker compose restart

# 重启单个
docker compose restart web
docker compose restart telegram-bot-1
```

### 查看日志

```bash
# 实时日志（所有）
docker compose logs -f

# 最近100行
docker compose logs --tail=100

# 单个服务
docker compose logs -f web
docker compose logs -f datadog
```

### 更新代码

```bash
cd /var/www/studio
git pull origin main
docker compose up -d --build
```

### 停止服务

```bash
# 停止但不删除
docker compose stop

# 停止并删除容器
docker compose down

# 停止并删除所有（包括volume）
docker compose down -v
```

### 查看资源使用

```bash
# Docker资源
docker stats

# 系统资源
htop
# 或
top
```

---

## ❗ 故障排查

### 容器启动失败

**查看详细日志：**
```bash
docker compose logs web
```

**重新构建：**
```bash
docker compose down
docker compose up -d --build
```

### Datadog无数据

**检查Agent日志：**
```bash
docker compose logs datadog
```

**验证API Key：**
```bash
cat .env.production | grep DATADOG
```

**重启Agent：**
```bash
docker compose restart datadog
```

### Bot无响应

**检查Bot日志：**
```bash
docker compose logs telegram-bot-1
```

**验证Token：**
```bash
cat .env.production | grep TELEGRAM
```

**手动测试：**
```bash
docker compose exec telegram-bot-1 sh
# 容器内部
ps aux
exit
```

### Web应用502错误

**检查容器健康：**
```bash
docker compose ps
```

**查看Web日志：**
```bash
docker compose logs web
```

**检查端口：**
```bash
netstat -tulpn | grep 3000
```

---

## 🎯 下一步

### 配置Nginx反向代理（可选）

```bash
# 安装Nginx
apt install nginx -y

# 配置
nano /etc/nginx/sites-available/deepweay.me
```

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name deepweay.me www.deepweay.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**启用并测试：**
```bash
ln -s /etc/nginx/sites-available/deepweay.me /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 配置SSL证书（Let's Encrypt）

```bash
# 安装Certbot
apt install certbot python3-certbot-nginx -y

# 获取证书
certbot --nginx -d deepweay.me -d www.deepweay.me

# 自动续期
certbot renew --dry-run
```

---

## ✅ 完成检查清单

- [ ] SSH连接VPS成功
- [ ] Docker已安装
- [ ] 项目已clone/更新
- [ ] .env.production已创建
- [ ] 容器全部运行
- [ ] Web应用可访问
- [ ] Telegram Bot响应
- [ ] Datadog显示数据
- [ ] Dashboard已创建

---

## 🎉 恭喜完成部署！

**你现在拥有：**
- ✅ 生产环境Web应用
- ✅ 2个Telegram Bot运行中
- ✅ 完整Datadog监控
- ✅ 容器化架构
- ✅ 自动重启保障

**监控地址：**
https://us5.datadoghq.com/

**下次更新只需：**
```bash
cd /var/www/studio
git pull
docker compose up -d --build
```

---

**有问题？** 查看 `DATADOG_QUICKSTART.md` 完整指南
