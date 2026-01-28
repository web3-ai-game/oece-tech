# Fluffy - 全栈Google云架构项目

基于Google Cloud Platform的轻量级全栈应用，适合50用户规模的中小型项目。

## 🚀 项目特色

- **轻量级架构**: 专为小团队设计，简单易维护
- **容器化开发**: 使用Docker模拟完整的Google Cloud环境
- **现代技术栈**: Next.js + Node.js + PostgreSQL + Redis
- **完整监控**: Prometheus + Grafana 监控体系
- **开箱即用**: 一键启动完整开发环境

## 📋 技术栈

### 前端
- **框架**: Next.js 13 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

### 后端
- **运行时**: Node.js 18
- **框架**: Express.js
- **语言**: TypeScript
- **认证**: JWT + bcrypt

### 数据层
- **主数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **对象存储**: MinIO (S3兼容)

### 基础设施
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx
- **监控**: Prometheus + Grafana
- **日志**: Winston + Docker Logs

## 🏗 项目结构

```
fluffy/
├── frontend/          # Next.js前端应用
│   ├── app/          # App Router页面
│   ├── components/   # React组件
│   └── styles/       # 样式文件
├── backend/           # Node.js后端API
│   ├── src/          # TypeScript源码
│   ├── routes/       # API路由
│   └── middleware/   # 中间件
├── database/          # 数据库配置
│   └── init/         # 初始化脚本
├── docker/            # Docker配置
│   ├── nginx/        # 反向代理配置
│   ├── prometheus/   # 监控配置
│   └── grafana/      # 仪表板配置
├── scripts/           # 自动化脚本
└── docs/              # 项目文档
```

## 🔧 快速开始

### 系统要求

- Docker Desktop 4.0+
- Node.js 18+
- Git
- 4GB+ 内存
- 10GB+ 磁盘空间

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd fluffy
   ```

2. **初始化环境**
   ```bash
   ./scripts/setup.sh
   ```

3. **启动开发环境**
   ```bash
   ./scripts/start.sh
   ```

### 访问地址

启动成功后可访问：

- 🌐 **前端应用**: <http://localhost:3000>
- 🔌 **后端API**: <http://localhost:3001>
- 🔄 **负载均衡**: <http://localhost>
- 📊 **监控面板**: <http://localhost:3002> (admin/admin123)
- 📈 **指标数据**: <http://localhost:9090>
- 💾 **对象存储**: <http://localhost:9001> (minioadmin/minioadmin123)

## 🎯 核心功能

- **用户认证**: 完整的注册/登录/权限管理
- **RESTful API**: 标准化API接口
- **实时监控**: 系统性能和业务指标监控
- **对象存储**: 文件上传和管理
- **缓存机制**: Redis缓存提升性能
- **日志系统**: 结构化日志记录
- **安全防护**: CORS、限流、数据加密

## 🛠 开发指南

### 本地开发

```bash
# 查看服务状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 重启特定服务
docker-compose restart backend

# 停止所有服务
./scripts/stop.sh
```

### API测试

```bash
# 健康检查
curl http://localhost:3001/health

# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fluffy.com","password":"password"}'

# 获取用户列表
curl http://localhost:3001/api/users
```

### 数据库管理

```bash
# 连接数据库
docker-compose exec postgres psql -U postgres -d fluffy_db

# 查看表结构
\dt

# 查看用户数据
SELECT * FROM users;
```

## 📖 文档

- [开发指南](docs/DEVELOPMENT.md) - 详细的开发环境配置和使用说明
- [API文档](docs/API.md) - 完整的API接口文档
- [架构设计](docs/ARCHITECTURE.md) - 系统架构和技术选型说明

## 🔐 默认账号

开发环境预置账号：

- **管理员**: admin@fluffy.com / password
- **普通用户**: user@fluffy.com / password

## 📊 监控指标

Grafana预配置监控面板包含：

- 应用性能指标 (响应时间、吞吐量)
- 数据库连接状态和查询性能
- Redis缓存命中率和内存使用
- 系统资源使用情况 (CPU、内存、磁盘)
- 业务指标 (用户活跃度、API调用统计)

## 🛡 安全特性

- JWT令牌认证，24小时过期
- bcrypt密码加密存储
- API速率限制 (100请求/15分钟)
- CORS跨域访问控制
- 输入验证和SQL注入防护

## 📈 扩展规划

当前架构支持平滑扩展到生产环境：

1. **Google Cloud Run** - 无服务器容器部署
2. **Cloud SQL** - 托管PostgreSQL数据库
3. **Cloud Storage** - 对象存储服务
4. **Cloud Monitoring** - 应用性能监控
5. **Cloud CDN** - 全球内容分发

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Docker官网](https://www.docker.com/)
- [Next.js文档](https://nextjs.org/docs)
- [Express.js指南](https://expressjs.com/)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [Google Cloud Platform](https://cloud.google.com/)

---

💡 **提示**: 如需帮助或遇到问题，请查看文档或提交Issue。
