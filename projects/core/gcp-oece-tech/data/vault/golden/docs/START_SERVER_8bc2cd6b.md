# 启动服务器指南

## 1. 环境配置

已配置 `.env.local` 文件，包含：
- IP地址: 134.209.47.209
- Supabase配置
- Gemini AI配置

## 2. 启动开发服务器

```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器（监听所有网络接口）
npm run dev -- -H 0.0.0.0 -p 3000
```

## 3. 启动生产服务器

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start -- -H 0.0.0.0 -p 3000
```

## 4. 使用 PM2 持久化运行

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "cyberpunk-app" -- start -- -H 0.0.0.0 -p 3000

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 5. 访问地址

- 本地: http://localhost:3000
- 外网: http://134.209.47.209:3000

## 6. 防火墙配置

确保服务器防火墙允许3000端口：

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## 7. 页面路由

- 首页: `/`
- 地图: `/map`
- 数据库: `/database`
- 节点列表: `/nodes`
- 登录: `/auth/login`
- 注册: `/auth/register`
- 论坛: `/forum` (开发中)

## 8. 故障排查

### 无法访问外网IP

1. 检查防火墙设置
2. 确认服务器监听 0.0.0.0 而不是 127.0.0.1
3. 检查云服务商安全组规则

### 端口被占用

```bash
# 查看占用3000端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 环境变量未生效

```bash
# 重启开发服务器
# 确保 .env.local 文件存在且格式正确
```
