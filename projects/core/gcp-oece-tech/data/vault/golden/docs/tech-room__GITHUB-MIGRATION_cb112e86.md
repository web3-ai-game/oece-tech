# 🚢 GitHub 迁移部署计划

## 📋 迁移前检查清单

### ✅ 代码准备
- [x] UI 边框圆润化完成
- [x] 工具库页面创建
- [x] 价格页面创建
- [x] 论坛基础页面创建
- [x] 导航菜单更新
- [ ] 移动端优化测试
- [ ] 数据库迁移脚本

### ✅ 环境配置
- [ ] .env.example 完整性检查
- [ ] 敏感信息清理
- [ ] API Keys 文档化

---

## 🔧 步骤 1: 本地测试与优化

### 1.1 完整测试

```bash
# 1. 安装依赖
npm install

# 2. 数据库初始化
npm run db:init

# 3. 种子数据
npm run db:seed

# 4. 启动开发服务器
npm run dev

# 5. 构建测试
npm run build
npm start
```

### 1.2 测试检查项

- [ ] 首页加载正常
- [ ] 教程列表页正常
- [ ] 工具库速度测试功能
- [ ] 价格页面显示正常
- [ ] 论坛页面显示正常
- [ ] 登录/注册功能
- [ ] 移动端响应式
- [ ] 矩阵雨性能（移动端）

### 1.3 性能优化

```typescript
// components/MatrixRain.tsx
'use client'

import { useEffect, useState } from 'react'

export function MatrixRain({ density = 20 }: { density?: number }) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  // 移动端减少密度
  const actualDensity = isMobile ? Math.max(5, density / 4) : density
  
  return (
    // ... matrix rain code with actualDensity
  )
}
```

---

## 📦 步骤 2: 准备 GitHub 仓库

### 2.1 创建仓库

1. 访问 https://github.com/new
2. 仓库名称: `geeksea` 或 `geeksea-platform`
3. 描述: 像素化 Web3 风格专业教程平台
4. 选择: Public 或 Private
5. 不要初始化 README（我们已有）

### 2.2 .gitignore 检查

确保 `.gitignore` 包含:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# database
/database/*.db
/database/*.db-journal

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 2.3 敏感信息清理

```bash
# 检查是否有敏感信息
grep -r "password" . --exclude-dir=node_modules
grep -r "secret" . --exclude-dir=node_modules
grep -r "token" . --exclude-dir=node_modules

# 确保 .env 不被追踪
git rm --cached .env
git rm --cached .env.local
```

---

## 🚀 步骤 3: 初始化并推送

### 3.1 Git 初始化

```bash
cd /Users/svs.loline/Documents/xiangmu/tech-room

# 如果还没有初始化
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "🎉 Initial commit: GeekSEA Platform v1.0

Features:
- 像素化科技迷城风格首页
- 教程系统基础架构
- JWT 认证系统
- 工具库（VPN速度测试）
- 价格页面（多支付方式）
- 论坛系统基础
- 移动端优化
- SQLite 数据库"
```

### 3.2 连接 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/geeksea.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

---

## ⚙️ 步骤 4: GitHub Actions 配置

### 4.1 创建 CI/CD 工作流

创建 `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build project
        run: npm run build
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
      
      - name: Run tests (if any)
        run: npm test --if-present

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        run: echo "Deploy to Vercel or other platform"
```

### 4.2 设置 GitHub Secrets

在仓库设置中添加:

1. **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 secrets:

```
JWT_SECRET=your_jwt_secret_key_here
NOTION_API_KEY=secret_xxx (可选)
STRIPE_SECRET_KEY=sk_test_xxx (可选)
IPINFO_TOKEN=your_token (可选)
VERCEL_TOKEN=xxx (如果使用 Vercel)
```

---

## 🌐 步骤 5: Vercel 部署（推荐）

### 5.1 安装 Vercel CLI

```bash
npm i -g vercel
```

### 5.2 首次部署

```bash
# 登录 Vercel
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

### 5.3 配置环境变量

在 Vercel Dashboard:
1. 选择项目
2. Settings → Environment Variables
3. 添加所有必要的环境变量

### 5.4 自动部署配置

创建 `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1", "sin1"],
  "env": {
    "JWT_SECRET": "@jwt-secret"
  }
}
```

---

## 🐳 步骤 6: Docker 部署（可选）

### 6.1 创建 Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 6.2 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=/app/database/geeksea.db
    volumes:
      - ./database:/app/database
    restart: unless-stopped
```

---

## 📱 步骤 7: 移动端最终优化

### 7.1 创建移动端优化组件

```typescript
// hooks/useDeviceDetect.ts
import { useEffect, useState } from 'react'

export function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
```

### 7.2 性能优化 CSS

```css
/* 移动端禁用复杂动画 */
@media (max-width: 768px) {
  .animate-scan,
  .pixel-float,
  .animate-glitch,
  .animate-pulse {
    animation: none !important;
  }
  
  /* 减少阴影效果 */
  .card-pixel-glow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* 简化矩阵雨 */
  .matrix-rain {
    opacity: 0.1 !important;
  }
}

/* 减少动画用户 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔐 步骤 8: Admin 账号设置

### 8.1 创建 Admin 脚本

```typescript
// scripts/create-admin.ts
import { db } from '../lib/db'
import { hashPassword } from '../lib/auth'

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('Admin@GeekSEA2024')
    
    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash, role, display_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'admin',
      'admin@geeksea.com',
      hashedPassword,
      'admin',
      'Administrator',
      new Date().toISOString()
    )
    
    console.log('✅ Admin account created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    admin@geeksea.com')
    console.log('Password: Admin@GeekSEA2024')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  请立即登录并修改密码！')
    
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint')) {
      console.log('ℹ️  Admin account already exists')
    } else {
      console.error('❌ Error creating admin:', error)
    }
  }
}

createAdmin()
```

### 8.2 添加到 package.json

```json
{
  "scripts": {
    "create-admin": "ts-node scripts/create-admin.ts"
  }
}
```

---

## 📊 步骤 9: 监控与分析

### 9.1 添加 Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## ✅ 迁移完成检查清单

### 代码质量
- [ ] 所有页面正常访问
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 移动端测试通过

### 部署配置
- [ ] GitHub 仓库创建
- [ ] 代码成功推送
- [ ] GitHub Actions 配置
- [ ] 环境变量设置

### 生产环境
- [ ] Vercel/服务器部署成功
- [ ] 域名配置完成
- [ ] SSL 证书配置
- [ ] CDN 配置

### 数据库
- [ ] 数据库迁移脚本
- [ ] Admin 账号创建
- [ ] 备份策略制定

### 监控
- [ ] 性能监控设置
- [ ] 错误追踪配置
- [ ] 分析工具集成

---

## 🎯 下一步行动

### 立即执行（今天）
1. 运行完整测试
2. 推送到 GitHub
3. 部署到 Vercel

### 本周完成
1. 移动端优化
2. Admin 功能完善
3. 性能优化

### 本月完成
1. 支付系统集成
2. 论坛完整功能
3. Notion 数据同步

---

## 📞 紧急联系

**如遇问题**:
- GitHub Issues: https://github.com/YOUR_USERNAME/geeksea/issues
- Email: dev@geeksea.com
- 论坛: https://geeksea.com/forum

---

**准备好了吗？让我们开始迁移！** 🚀
