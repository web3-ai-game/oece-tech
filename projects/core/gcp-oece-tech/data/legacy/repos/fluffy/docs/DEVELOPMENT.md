# Fluffy 本地开发指南

## 概述

Fluffy 是一个适合50用户规模的轻量级全栈应用，使用Docker容器模拟Google Cloud环境进行本地开发。

## 系统要求

- Docker Desktop 4.0+
- Node.js 18+
- Git
- 至少4GB可用内存
- 至少10GB可用磁盘空间

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd fluffy
```

### 2. 初始化项目

```bash
./scripts/setup.sh
```

该脚本会：
- 安装前后端依赖
- 创建环境配置文件
- 设置必要的目录和权限

### 3. 启动开发环境

```bash
./scripts/start.sh
```

启动后可访问：
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001
- **Nginx反向代理**: http://localhost
- **Grafana监控**: http://localhost:3002 (admin/admin123)
- **Prometheus指标**: http://localhost:9090
- **MinIO控制台**: http://localhost:9001 (minioadmin/minioadmin123)

### 4. 停止开发环境

```bash
./scripts/stop.sh
```

## 架构说明

### 服务组件

| 组件 | 说明 | 模拟的GCP服务 | 端口 |
|------|------|---------------|------|
| PostgreSQL | 主数据库 | Cloud SQL | 5432 |
| Redis | 缓存服务 | Memorystore | 6379 |
| Backend API | Node.js后端 | Cloud Run | 3001 |
| Frontend | Next.js前端 | Cloud Run | 3000 |
| Nginx | 负载均衡 | Load Balancer | 80/443 |
| Prometheus | 监控指标 | Cloud Monitoring | 9090 |
| Grafana | 监控面板 | Cloud Console | 3002 |
| MinIO | 对象存储 | Cloud Storage | 9000/9001 |

### 技术栈

- **前端**: Next.js 13, React 18, TypeScript, Tailwind CSS
- **后端**: Node.js, Express, TypeScript
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **监控**: Prometheus + Grafana
- **存储**: MinIO (S3兼容)
- **容器**: Docker & Docker Compose

## 开发工作流

### 代码开发

1. **前端开发**
   ```bash
   cd frontend
   npm run dev  # 或使用Docker环境
   ```

2. **后端开发**
   ```bash
   cd backend
   npm run dev  # 或使用Docker环境
   ```

3. **数据库操作**
   ```bash
   # 连接数据库
   docker-compose exec postgres psql -U postgres -d fluffy_db
   
   # 运行迁移
   cd backend && npm run migrate
   ```

### 环境配置

#### 后端环境变量 (backend/.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password123@localhost:5432/fluffy_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-development-jwt-secret-key
FRONTEND_URL=http://localhost:3000
```

#### 前端环境变量 (frontend/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Fluffy
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 数据管理

#### 数据库初始化
数据库启动时会自动运行 `database/init/01_init.sql` 初始化脚本，创建：
- 用户表和测试数据
- 项目表结构
- 审计日志表
- 必要的索引

#### 测试数据
- 管理员: admin@fluffy.com / password
- 普通用户: user@fluffy.com / password

## API 接口

### 认证接口

```bash
# 登录
POST /api/auth/login
{
  "email": "admin@fluffy.com",
  "password": "password"
}

# 注册
POST /api/auth/register
{
  "email": "new@fluffy.com",
  "password": "password",
  "name": "新用户"
}

# 获取当前用户
GET /api/auth/me
Authorization: Bearer <token>
```

### 用户管理

```bash
# 获取用户列表
GET /api/users

# 获取单个用户
GET /api/users/:id

# 创建用户
POST /api/users
{
  "name": "用户名",
  "email": "email@example.com",
  "role": "user"
}
```

## 监控和调试

### Grafana 监控面板

访问 http://localhost:3002 (admin/admin123)

预配置的监控指标：
- 应用性能指标
- 数据库连接状态
- Redis缓存命中率
- 系统资源使用情况

### Prometheus 指标

访问 http://localhost:9090 查看原始指标数据

### 日志集中管理

使用Docker Compose日志聚合：
```bash
# 实时查看所有服务日志
docker-compose logs -f

# 查看最近的错误日志
docker-compose logs --tail=100 | grep ERROR
```

## 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   
   # 修改 docker-compose.yml 中的端口映射
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose ps postgres
   docker-compose logs postgres
   
   # 重启数据库
   docker-compose restart postgres
   ```

3. **依赖安装问题**
   ```bash
   # 清理并重新安装
   rm -rf frontend/node_modules backend/node_modules
   ./scripts/setup.sh
   ```

4. **Docker资源不足**
   ```bash
   # 清理未使用的资源
   docker system prune -f
   docker volume prune -f
   ```

### 重置环境

```bash
# 完全重置开发环境
./scripts/stop.sh
docker-compose down -v  # 删除数据卷
docker system prune -f
./scripts/start.sh
```

## 最佳实践

### 代码规范

1. **TypeScript** - 所有代码使用TypeScript编写
2. **ESLint** - 遵循项目ESLint配置
3. **Git提交** - 使用语义化提交信息

### 安全考虑

1. **环境变量** - 敏感信息通过环境变量配置
2. **JWT密钥** - 生产环境使用强密钥
3. **CORS配置** - 限制跨域访问
4. **速率限制** - API接口限流保护

### 性能优化

1. **Redis缓存** - 合理使用缓存减少数据库查询
2. **数据库索引** - 为常用查询字段创建索引
3. **静态资源** - 使用CDN或对象存储
4. **监控告警** - 设置关键指标告警

## 部署到生产环境

虽然当前专注于本地开发，但项目结构已为生产部署做好准备：

1. **Google Cloud Run** - 容器化应用部署
2. **Cloud SQL** - 托管PostgreSQL数据库
3. **Cloud Storage** - 静态文件存储
4. **Cloud Monitoring** - 应用监控

详细的生产部署指南将在后续版本中提供。