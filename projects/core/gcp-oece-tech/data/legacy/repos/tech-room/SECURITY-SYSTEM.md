# 🔐 完整安全防护系统

## 🎯 核心安全目标

```
✓ 数据库读取权限严格控制
✓ 防SQL注入
✓ 防XSS攻击
✓ 防CSRF攻击
✓ API访问控制
✓ 敏感数据加密
✓ 日志审计
✓ 匿名化保护
```

---

## 🗄️ 数据库安全

### 1. 数据库用户权限分离

```sql
-- 创建只读用户（用于查询）
CREATE USER 'oece_readonly'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT ON oece_db.tutorials TO 'oece_readonly'@'localhost';
GRANT SELECT ON oece_db.users TO 'oece_readonly'@'localhost';

-- 创建读写用户（用于后台管理）
CREATE USER 'oece_readwrite'@'localhost' IDENTIFIED BY 'another_strong_password';
GRANT SELECT, INSERT, UPDATE ON oece_db.* TO 'oece_readwrite'@'localhost';

-- 创建管理员用户（完全权限）
CREATE USER 'oece_admin'@'localhost' IDENTIFIED BY 'super_strong_password';
GRANT ALL PRIVILEGES ON oece_db.* TO 'oece_admin'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 2. 环境变量配置

创建 `.env.local`:

```bash
# 数据库配置（不同权限）
# 只读数据库（前端API使用）
DATABASE_URL_READONLY="postgresql://oece_readonly:password@localhost:5432/oece_db?sslmode=require"

# 读写数据库（后台管理使用）
DATABASE_URL_READWRITE="postgresql://oece_readwrite:password@localhost:5432/oece_db?sslmode=require"

# 管理员数据库（仅管理员使用）
DATABASE_URL_ADMIN="postgresql://oece_admin:password@localhost:5432/oece_db?sslmode=require"

# JWT密钥
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# 加密密钥
ENCRYPTION_KEY="your-32-char-encryption-key-here"

# API限流
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="15m"

# CORS配置
ALLOWED_ORIGINS="https://oece.tech,https://www.oece.tech"
```

### 3. Prisma配置（PostgreSQL）

创建 `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_READONLY")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String   // 加密存储
  role          Role     @default(USER)
  points        Int      @default(100)
  level         Int      @default(1)
  isAnonymous   Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // 关联
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  
  @@index([email])
  @@index([username])
}

enum Role {
  USER
  VIP
  ADMIN
}

model Tutorial {
  id           String   @id @default(cuid())
  slug         String   @unique
  category     String
  title        String
  content      String   @db.Text
  difficulty   Difficulty
  points       Int      @default(0)
  views        Int      @default(0)
  likes        Int      @default(0)
  isPublished  Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([category])
  @@index([slug])
  @@index([isPublished])
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  HELL
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  resource  String
  ipAddress String?
  userAgent String?
  success   Boolean
  details   Json?
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

---

## 🛡️ SQL注入防护

### 1. Prisma ORM（推荐）

创建 `lib/db-safe.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

// 使用只读数据库连接
const prismaReadonly = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_READONLY
    }
  }
})

// 使用读写数据库连接
const prismaReadWrite = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_READWRITE
    }
  }
})

// 安全的查询函数（自动防SQL注入）
export async function getTutorialSafe(slug: string) {
  try {
    // Prisma会自动转义参数
    const tutorial = await prismaReadonly.tutorial.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        category: true,
        difficulty: true,
        points: true,
        views: true,
        likes: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return tutorial
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch tutorial')
  }
}

// 安全的搜索（防注入）
export async function searchTutorialsSafe(query: string) {
  try {
    // 输入验证
    if (query.length > 100) {
      throw new Error('Search query too long')
    }
    
    // Prisma自动处理特殊字符
    const tutorials = await prismaReadonly.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ],
        isPublished: true
      },
      take: 20,
      select: {
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        points: true,
        views: true,
        likes: true
      }
    })
    
    return tutorials
  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Search failed')
  }
}

// 安全的用户查询（防止信息泄露）
export async function getUserSafe(userId: string) {
  try {
    const user = await prismaReadonly.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        // 不返回email和passwordHash
        points: true,
        level: true,
        createdAt: true
      }
    })
    
    return user
  } catch (error) {
    console.error('User query error:', error)
    throw new Error('Failed to fetch user')
  }
}

export { prismaReadonly, prismaReadWrite }
```

### 2. 输入验证和清理

创建 `lib/validation.ts`:

```typescript
import { z } from 'zod'

// 用户注册验证
export const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '用户名只能包含字母、数字、下划线和横线'),
  
  email: z.string()
    .email('无效的邮箱地址')
    .max(100, '邮箱地址过长'),
  
  password: z.string()
    .min(8, '密码至少8个字符')
    .max(100, '密码过长')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[a-z]/, '密码必须包含小写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
  
  inviteCode: z.string()
    .optional()
    .refine(val => !val || /^[A-Z0-9]{6,10}$/.test(val), '无效的邀请码')
})

// 搜索验证
export const searchSchema = z.object({
  query: z.string()
    .min(1, '搜索词不能为空')
    .max(100, '搜索词过长')
    .regex(/^[a-zA-Z0-9\s\u4e00-\u9fa5]+$/, '搜索词包含非法字符')
})

// 评论验证
export const commentSchema = z.object({
  content: z.string()
    .min(1, '评论不能为空')
    .max(500, '评论过长')
    .refine(val => !/<script|javascript:|onerror=/i.test(val), '评论包含危险内容')
})

// 验证函数
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error
  }
}

// HTML清理（防XSS）
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// SQL特殊字符转义（虽然Prisma已经处理了，但多一层保护）
export function escapeSql(str: string): string {
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
}
```

---

## 🔒 API安全

### 1. 速率限制

创建 `lib/rate-limit.ts`:

```typescript
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        return isRateLimited ? reject() : resolve()
      })
  }
}

// 使用示例
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15分钟
  uniqueTokenPerInterval: 500
})
```

### 2. API路由保护

创建 `app/api/tutorials/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { searchTutorialsSafe } from '@/lib/db-safe'
import { validateInput, searchSchema, sanitizeHtml } from '@/lib/validation'
import rateLimit from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1分钟
  uniqueTokenPerInterval: 500
})

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  try {
    // 1. 速率限制
    await limiter.check(10, ip) // 每分钟10次
    
    // 2. 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    
    // 3. 输入验证
    const validatedData = validateInput(searchSchema, { query })
    
    // 4. 清理输入
    const cleanQuery = sanitizeHtml(validatedData.query)
    
    // 5. 数据库查询（只读权限）
    const results = await searchTutorialsSafe(cleanQuery)
    
    // 6. 审计日志
    await logAudit({
      action: 'SEARCH',
      resource: 'tutorials',
      ipAddress: ip,
      userAgent,
      success: true,
      details: {
        query: cleanQuery,
        resultsCount: results.length,
        duration: Date.now() - startTime
      }
    })
    
    // 7. 返回结果
    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
    
  } catch (error) {
    // 记录失败
    await logAudit({
      action: 'SEARCH',
      resource: 'tutorials',
      ipAddress: ip,
      userAgent,
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    
    // 速率限制错误
    if (error instanceof Error && error.message === 'Too many requests') {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      )
    }
    
    // 验证错误
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    // 服务器错误（不泄露详细信息）
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
```

---

## 🔑 认证和授权

### 1. JWT认证

创建 `lib/auth.ts`:

```typescript
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prismaReadWrite } from '@/lib/db-safe'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  username: string
  role: string
  iat?: number
  exp?: number
}

// 生成JWT
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

// 验证JWT
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// 密码验证
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// 从请求中获取用户
export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    return payload
  } catch (error) {
    return null
  }
}

// 权限检查
export function requireAuth(requiredRole?: string) {
  return async (request: Request) => {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      throw new Error('Unauthorized')
    }
    
    if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    
    return user
  }
}
```

---

## 📝 审计日志

创建 `lib/audit.ts`:

```typescript
import { prismaReadWrite } from '@/lib/db-safe'

export interface AuditLogData {
  userId?: string
  action: string
  resource: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  details?: Record<string, any>
}

export async function logAudit(data: AuditLogData) {
  try {
    await prismaReadWrite.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        success: data.success,
        details: data.details || {}
      }
    })
  } catch (error) {
    // 审计日志失败不应该影响主要功能
    console.error('Audit log failed:', error)
  }
}

// 查询审计日志（仅管理员）
export async function getAuditLogs(options: {
  userId?: string
  action?: string
  limit?: number
  offset?: number
}) {
  return prismaReadWrite.auditLog.findMany({
    where: {
      userId: options.userId,
      action: options.action
    },
    take: options.limit || 100,
    skip: options.offset || 0,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// 检测可疑活动
export async function detectSuspiciousActivity(ipAddress: string) {
  const recentLogs = await prismaReadWrite.auditLog.findMany({
    where: {
      ipAddress,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000) // 最近1小时
      }
    }
  })
  
  const failedAttempts = recentLogs.filter(log => !log.success).length
  
  // 如果失败次数过多，标记为可疑
  if (failedAttempts > 10) {
    console.warn(`Suspicious activity detected from IP: ${ipAddress}`)
    return true
  }
  
  return false
}
```

---

## 🛡️ XSS防护

### 1. Content Security Policy

创建 `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // CSP头
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.oece.tech;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim()
  )
  
  // 其他安全头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // HSTS（生产环境）
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  return response
}

export const config = {
  matcher: '/:path*'
}
```

---

## 📦 依赖安装

```bash
# 数据库和ORM
npm install @prisma/client prisma

# 认证和加密
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# 验证
npm install zod

# 速率限制
npm install lru-cache

# 其他
npm install dotenv
```

---

**安全系统设计完成！** 🔐✨

**核心特性**:
- 🗄️ 数据库权限分离（只读/读写/管理员）
- 🛡️ SQL注入防护（Prisma ORM）
- 🔒 XSS防护（CSP + 输入清理）
- 🚦 API速率限制
- 🔑 JWT认证授权
- 📝 完整审计日志
- ✅ 输入验证
- 🔐 密码加密

**下一步**: 创建实际实现文件 🚀
