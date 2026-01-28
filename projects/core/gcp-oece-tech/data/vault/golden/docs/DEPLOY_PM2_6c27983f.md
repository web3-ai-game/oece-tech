# PM2部署指南 (低配VPS优化版)

适用于 **1vCPU / 2GB RAM** 的VPS环境。

## 🎯 优势

与Docker方案对比：

| 指标 | Docker方案 | PM2方案 | 提升 |
|------|-----------|---------|------|
| 运行内存 | ~1.2GB | ~400MB | **-66%** |
| 部署时间 | ~5分钟 | ~30秒 | **10x** |
| VPS剩余内存 | ~300MB | ~1.2GB | **4x** |

## 📋 前置要求

### VPS环境
- Ubuntu 20.04+ / Debian 11+
- 2GB RAM, 1 CPU, 20GB 硬盤
- Node.js 18+

### 本地环境
- Git
- SSH访问权限

## 🚀 首次部署

### 1. VPS初始化

```bash
# 连接VPS
ssh root@your-vps-ip

# 更新系统
apt update && apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装
node --version
npm --version

# 安装PM2
npm install -g pm2

# 配置Swap (重要！)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 2. 克隆项目

```bash
cd /var/www
git clone https://github.com/yourusername/oece.tech.git
cd oece.tech
```

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

添加必要的API keys后保存。

### 4. 首次部署

```bash
chmod +x deploy-pm2.sh
./deploy-pm2.sh
```

### 5. 配置PM2开机自启

```bash
pm2 startup
pm2 save
```

## 🔄 日常更新

### 自动部署 (推荐)

推送到GitHub main分支后，GitHub Actions自动执行：
1. 本地构建静态文件
2. rsync同步到VPS
3. PM2零停机重启

### 手动部署

```bash
cd /var/www/oece.tech
./deploy-pm2.sh
```

## 📊 监控命令

```bash
# 查看服务状态
pm2 list
pm2 monit

# 查看日志
pm2 logs oece-web
pm2 logs oece-web --lines 100

# 查看内存使用
free -h
pm2 status

# 实时监控
htop
```

## 🛠️ 常用操作

```bash
# 重启服务
pm2 reload oece-web

# 停止服务
pm2 stop oece-web

# 启动服务
pm2 start oece-web

# 删除服务
pm2 delete oece-web

# 清空日志
pm2 flush
```

## 🔧 Nginx反向代理

### 安装Nginx

```bash
apt install nginx -y
```

### 配置站点

```bash
nano /etc/nginx/sites-available/oece.tech
```

```nginx
server {
    listen 80;
    server_name oece.tech www.oece.tech;

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        root /var/www/oece.tech/out;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 启用配置

```bash
ln -s /etc/nginx/sites-available/oece.tech /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 配置HTTPS

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d oece.tech -d www.oece.tech
```

## 🐛 故障排查

### 服务无法启动

```bash
# 查看详细日志
pm2 logs oece-web --err

# 检查端口占用
lsof -i :3000

# 重新部署
cd /var/www/oece.tech
./deploy-pm2.sh
```

### 内存不足

```bash
# 检查内存
free -h
pm2 status

# 确认Swap已启用
swapon --show

# 重启服务释放内存
pm2 reload oece-web
```

### 构建失败

```bash
# 清理缓存
rm -rf .next out node_modules
npm ci
npm run build
```

## 📈 性能监控

### 安装监控工具

```bash
# htop - 系统监控
apt install htop -y

# PM2监控面板
pm2 install pm2-logrotate
```

### 定期检查

```bash
# 每天检查一次
free -h          # 内存使用
df -h            # 磁盘使用
pm2 status       # PM2状态
journalctl -xe   # 系统日志
```

## 🔐 安全建议

1. **修改SSH端口**
2. **配置防火墙** (ufw)
3. **禁用root登录**
4. **定期更新系统**
5. **备份.env文件**

## 📞 技术支持

遇到问题？
- 查看 [GitHub Issues](https://github.com/yourusername/oece.tech/issues)
- 查看PM2日志: `pm2 logs`
- 查看系统日志: `journalctl -u nginx`

---

**内存预算**: 运行时 <400MB | 构建时峰值 <600MB
