# ✅ GeekSEA v0.4.0 部署检查清单

## 📋 部署前准备

### 本地环境检查
- [ ] Node.js 18.x 已安装
- [ ] 所有依赖已安装 (`npm install`)
- [ ] 本地测试通过 (`npm run dev`)
- [ ] 构建成功 (`npm run build`)
- [ ] 数据库初始化 (`npm run db:init`)

### 代码质量检查
- [ ] TypeScript 编译无错误
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 所有新功能页面可访问
  - [ ] /tools - 工具库
  - [ ] /pricing - 价格页面
  - [ ] /forum - 论坛
- [ ] 导航菜单正常

### 文档完整性
- [ ] `DO-VPS-CONFIG.md` - VPS 配置
- [ ] `PRICE-SYNC.md` - 价格同步
- [ ] `VERSION.md` - 版本信息
- [ ] `config/pricing.json` - 价格配置
- [ ] `deploy-quick.sh` - 快速部署脚本

---

## 🔑 服务器配置（首次部署）

### 1. DigitalOcean Droplet 创建
```bash
# 规格确认
RAM: 2GB
CPU: 2 vCPU
SSD: 60GB
流量: 3TB/月
区域: Singapore (sgp1)
系统: Ubuntu 22.04 LTS
```

- [ ] Droplet 已创建
- [ ] IP 地址已记录: `_________________`
- [ ] Root 密码已设置
- [ ] SSH Key 已添加

### 2. 首次 SSH 连接
```bash
ssh root@YOUR_DROPLET_IP

# 系统更新
apt update && apt upgrade -y

# 创建部署用户
adduser geeksea
usermod -aG sudo geeksea

# 配置 SSH
mkdir -p /home/geeksea/.ssh
cp ~/.ssh/authorized_keys /home/geeksea/.ssh/
chown -R geeksea:geeksea /home/geeksea/.ssh
chmod 700 /home/geeksea/.ssh
chmod 600 /home/geeksea/.ssh/authorized_keys
```

- [ ] 用户 `geeksea` 已创建
- [ ] SSH Key 已配置
- [ ] 可以用 `geeksea` 用户登录

### 3. 环境安装

#### Node.js 18
```bash
su - geeksea
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

- [ ] Node.js 18 已安装
- [ ] npm 已可用
- [ ] 版本验证: `node --version`

#### PM2
```bash
npm install -g pm2
pm2 startup
# 复制输出的命令并执行
```

- [ ] PM2 已安装
- [ ] PM2 开机自启已配置

#### Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

- [ ] Nginx 已安装
- [ ] Nginx 已启动

---

## 📦 项目部署

### 1. GitHub 仓库设置
```bash
# 本地创建
git init
git add .
git commit -m "🎉 Initial commit: GeekSEA v0.4.0"

# GitHub 创建仓库
# https://github.com/new
# 仓库名: geeksea

git remote add origin https://github.com/YOUR_USERNAME/geeksea.git
git branch -M main
git push -u origin main
```

- [ ] GitHub 仓库已创建
- [ ] 仓库地址: `https://github.com/_______________/geeksea`
- [ ] 代码已推送
- [ ] README 显示正常

### 2. 服务器克隆项目
```bash
ssh geeksea@YOUR_DROPLET_IP
cd /home/geeksea
git clone https://github.com/YOUR_USERNAME/geeksea.git
cd geeksea
npm install
```

- [ ] 项目已克隆
- [ ] 依赖已安装

### 3. 环境变量配置
```bash
nano .env.production
```

必填内容:
```env
NODE_ENV=production
JWT_SECRET=你的超级安全密钥_至少32字符_请修改
NEXT_PUBLIC_SITE_URL=https://geeksea.com
DATABASE_URL=./database/geeksea.db
```

- [ ] `.env.production` 已创建
- [ ] JWT_SECRET 已设置（强密钥）
- [ ] NEXT_PUBLIC_SITE_URL 已设置

### 4. 数据库初始化
```bash
mkdir -p database
npm run db:init
npm run create-admin
```

Admin 账号信息:
```
Email: admin@geeksea.com
Password: _________________（记录下来！）
```

- [ ] 数据库已创建
- [ ] Admin 账号已创建
- [ ] Admin 密码已记录

### 5. 构建和启动
```bash
npm run build
pm2 start npm --name "geeksea" -- start
pm2 save
```

- [ ] 构建成功
- [ ] PM2 已启动应用
- [ ] 应用运行正常: `pm2 status`

---

## 🌐 Nginx 配置

### 1. 创建配置文件
```bash
sudo nano /etc/nginx/sites-available/geeksea
```

使用 `DO-VPS-CONFIG.md` 中的 Nginx 配置模板

- [ ] 配置文件已创建
- [ ] 域名已替换为实际域名
- [ ] upstream 端口正确 (3000)

### 2. 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/geeksea /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

- [ ] 软链接已创建
- [ ] Nginx 配置测试通过
- [ ] Nginx 已重启

### 3. SSL 证书
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d geeksea.com -d www.geeksea.com
```

- [ ] Certbot 已安装
- [ ] SSL 证书已获取
- [ ] HTTPS 可访问

---

## 🔄 自动部署配置

### 1. GitHub Actions Secrets
在 GitHub 仓库设置中添加:

Settings → Secrets and variables → Actions

- [ ] `DO_HOST`: 服务器 IP
- [ ] `DO_SSH_KEY`: SSH 私钥
- [ ] `JWT_SECRET`: JWT 密钥
- [ ] `WEBHOOK_SECRET`: Webhook 密钥

### 2. 部署脚本
```bash
nano /home/geeksea/deploy.sh
```

使用 `DO-VPS-CONFIG.md` 中的脚本

```bash
chmod +x /home/geeksea/deploy.sh
```

- [ ] deploy.sh 已创建
- [ ] 脚本可执行
- [ ] 测试运行: `./deploy.sh`

### 3. 价格同步脚本
```bash
nano /home/geeksea/geeksea/scripts/sync-pricing.sh
```

使用 `PRICE-SYNC.md` 中的脚本

```bash
chmod +x /home/geeksea/geeksea/scripts/sync-pricing.sh
```

- [ ] sync-pricing.sh 已创建
- [ ] 脚本可执行
- [ ] 测试运行成功

---

## 🛡️ 安全加固

### 防火墙
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

- [ ] UFW 已启用
- [ ] 端口规则已设置

### Fail2Ban
```bash
sudo apt install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

- [ ] Fail2Ban 已安装
- [ ] Fail2Ban 已启动

### 备份设置
```bash
nano /home/geeksea/backup.sh
```

添加定时任务:
```bash
crontab -e
# 添加: 0 2 * * * /home/geeksea/backup.sh
```

- [ ] backup.sh 已创建
- [ ] 定时任务已添加
- [ ] 首次备份已执行

---

## 🧪 功能测试

### 网站访问
- [ ] HTTP 自动跳转到 HTTPS
- [ ] 首页加载正常
- [ ] 矩阵雨效果显示
- [ ] 导航菜单工作正常

### 新功能测试
- [ ] 工具库 (`/tools`)
  - [ ] VPN 速度测试可用
  - [ ] 显示下载/上传/延迟
- [ ] 价格页面 (`/pricing`)
  - [ ] 三档价格显示正确
  - [ ] 支付方式图标显示
- [ ] 论坛 (`/forum`)
  - [ ] 分类列表显示
  - [ ] 热门帖子显示

### 认证系统
- [ ] 注册页面可访问
- [ ] 登录页面可访问
- [ ] Admin 账号可登录

### 移动端
- [ ] 响应式布局正常
- [ ] 矩阵雨性能可接受
- [ ] 触摸操作流畅

---

## 📊 监控检查

### PM2 监控
```bash
pm2 monit
pm2 logs geeksea
```

- [ ] 应用运行正常
- [ ] 无错误日志
- [ ] 内存使用正常 (< 500MB)
- [ ] CPU 使用正常 (< 50%)

### 系统资源
```bash
free -h     # 内存
df -h       # 磁盘
top         # CPU
```

- [ ] 内存使用 < 50%
- [ ] 磁盘使用 < 50%
- [ ] CPU 负载正常

---

## 🔄 价格同步测试

### 本地修改价格
```bash
# 本地
nano config/pricing.json
# 修改 priceUSD 字段

git add config/pricing.json
git commit -m "💰 Update pricing"
git push origin main
```

### 服务器同步验证
```bash
# 30秒后检查
ssh geeksea@YOUR_IP
cat /home/geeksea/geeksea/config/pricing.json
```

- [ ] 价格自动同步成功
- [ ] 网站显示新价格
- [ ] GitHub Actions 运行成功

---

## ✅ 最终验证

### 核心功能
- [ ] 首页访问速度 < 2秒
- [ ] 教程页面正常
- [ ] 工具库速度测试工作
- [ ] 价格页面显示正确
- [ ] 论坛可访问
- [ ] 登录/注册功能正常

### 性能指标
- [ ] Lighthouse Performance > 85
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### SEO 检查
- [ ] 页面标题正确
- [ ] Meta 描述存在
- [ ] Open Graph 标签存在

---

## 📝 部署后任务

### 立即执行
- [ ] 修改 Admin 密码
- [ ] 测试支付流程（沙箱）
- [ ] 添加 Google Analytics
- [ ] 设置错误追踪（Sentry）

### 一周内
- [ ] 监控服务器性能
- [ ] 收集用户反馈
- [ ] 修复发现的 bug
- [ ] 优化加载速度

### 一个月内
- [ ] 完善论坛功能
- [ ] 集成真实支付
- [ ] 添加更多工具
- [ ] Notion 数据同步

---

## 🎉 部署完成！

**网站地址**: https://geeksea.com  
**Admin 登录**: https://geeksea.com/auth/login  
**GitHub 仓库**: https://github.com/YOUR_USERNAME/geeksea  
**服务器 IP**: YOUR_DROPLET_IP  

**快速命令**:
```bash
# 查看状态
ssh geeksea@YOUR_IP 'pm2 status'

# 查看日志
ssh geeksea@YOUR_IP 'pm2 logs geeksea --lines 50'

# 重启应用
ssh geeksea@YOUR_IP 'pm2 restart geeksea'

# 更新部署
./deploy-quick.sh
```

---

**🎊 恭喜！GeekSEA v0.4.0 部署完成！**

遇到问题请查看:
- `DO-VPS-CONFIG.md` - 详细配置说明
- `PRICE-SYNC.md` - 价格同步机制
- PM2 日志 - `pm2 logs geeksea`
- Nginx 日志 - `/var/log/nginx/error.log`
