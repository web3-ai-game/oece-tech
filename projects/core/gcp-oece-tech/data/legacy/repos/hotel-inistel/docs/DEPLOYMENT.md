# 酒店管理平台 - VPS生产环境部署指南

## 系统要求
- VPS: 1GB RAM, 20GB 存储空间
- 操作系统: Ubuntu 20.04+ 或 CentOS 7+
- IP地址: 35.239.201.9

## 部署步骤

### 1. 系统初始化（在VPS上执行）

```bash
# 上传vps-setup.sh到VPS并执行
chmod +x vps-setup.sh
sudo ./vps-setup.sh
```

### 2. 上传项目文件

将以下文件上传到VPS的 `/opt/hotel-inistel/` 目录：

```
hotel-inistel/
├── src/                    # React源代码
├── public/                 # 静态资源
├── package.json           # 依赖配置
├── package-lock.json      # 锁定版本
├── Dockerfile.prod        # 生产环境Docker文件
├── docker-compose.prod.yml # 生产环境编排
├── nginx.conf             # Nginx配置
├── deploy.sh              # 部署脚本
├── .dockerignore          # Docker忽略文件
└── firebase.json          # Firebase配置
```

### 3. 执行部署

```bash
cd /opt/hotel-inistel
chmod +x deploy.sh
./deploy.sh
```

## 访问应用

- **主应用**: http://35.239.201.9
- **健康检查**: http://35.239.201.9/health

## 管理命令

### 查看服务状态
```bash
docker-compose -f docker-compose.prod.yml ps
```

### 查看日志
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### 重启服务
```bash
docker-compose -f docker-compose.prod.yml restart
```

### 停止服务
```bash
docker-compose -f docker-compose.prod.yml down
```

### 更新部署
```bash
./deploy.sh
```

## 监控和维护

### 系统资源监控
```bash
# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看系统负载
htop
```

### Docker资源监控
```bash
# 查看容器资源使用
docker stats

# 清理无用镜像和容器
docker system prune -f
```

## 故障排除

### 服务无法启动
1. 检查端口是否被占用：`netstat -tlnp | grep :80`
2. 检查Docker服务：`systemctl status docker`
3. 查看容器日志：`docker-compose -f docker-compose.prod.yml logs`

### 内存不足
1. 检查swap是否启用：`swapon -s`
2. 清理Docker缓存：`docker system prune -a`
3. 重启容器：`docker-compose -f docker-compose.prod.yml restart`

### 网络问题
1. 检查防火墙：`ufw status`
2. 检查nginx配置：`docker exec hotel-inistel-prod nginx -t`

## 安全建议

1. 定期更新系统包：`apt update && apt upgrade`
2. 监控fail2ban日志：`tail -f /var/log/fail2ban.log`
3. 定期备份重要数据
4. 使用HTTPS（建议配置Let's Encrypt）

## 性能优化

1. 启用Gzip压缩（已配置）
2. 设置静态文件缓存（已配置）
3. 监控内存使用，必要时重启容器
4. 定期清理Docker镜像和日志

## 备份策略

```bash
# 备份项目文件
tar -czf hotel-backup-$(date +%Y%m%d).tar.gz /opt/hotel-inistel

# 备份到远程（可选）
# scp hotel-backup-*.tar.gz user@backup-server:/backups/
```
