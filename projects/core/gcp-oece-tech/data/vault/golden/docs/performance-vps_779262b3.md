---
trigger: always_on
---

# VPS Performance Rules
CRITICAL: 1vCPU 2GB 50GB SSD - 必须极致优化

## 资源约束
- 内存预算: 单服务<300MB
- 并发限制: Max 50 connections
- 构建时间: <3分钟
- 包大小: <50MB

## 技术栈限制
- ❌ 禁用: Heavy框架(Next.js SSR, Nuxt), ORM(Prisma)
- ✅ 首选: 静态生成, SQLite, 原生SQL
- 缓存策略: Redis可选, 优先文件缓存

## 部署约束
- 单容器部署 or pm2
- 零停机更新: rsync + symlink
- 日志轮转: logrotate 5天

## 代码规范
- 避免同步I/O操作
- 所有数据库查询必须索引
- 图片必须压缩 + CDN(Cloudflare)