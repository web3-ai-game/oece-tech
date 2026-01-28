import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// 安全配置
const SECURITY_CONFIG = {
  maxRequestsPerMinute: 100,
  maxFailedAttempts: 3,
  sessionTimeout: 30 * 60 * 1000, // 30分钟
  ipWhitelist: ['10.0.0.0/8', '127.0.0.1', 'localhost'],
  requiredHeaders: ['x-admin-key', 'x-csrf-token'],
  blockedUserAgents: ['bot', 'crawler', 'spider'],
  sensitiveRoutes: ['/admin/settings', '/admin/users', '/admin/database']
}

// 请求速率限制存储
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 失败尝试存储
const failedAttemptsStore = new Map<string, number>()

// 黑名单存储
const blacklistStore = new Set<string>()

// 会话存储
const sessionStore = new Map<string, { 
  adminId: string
  role: string
  lastActivity: number
  ip: string
}>()

// 检查IP是否在白名单
function isIPWhitelisted(ip: string): boolean {
  return SECURITY_CONFIG.ipWhitelist.some(allowed => {
    if (allowed.includes('/')) {
      // CIDR notation check
      return checkCIDR(ip, allowed)
    }
    return ip === allowed
  })
}

// CIDR检查
function checkCIDR(ip: string, cidr: string): boolean {
  // 简化的CIDR检查，实际应使用专门的库
  const [network] = cidr.split('/')
  return ip.startsWith(network.split('.')[0])
}

// 速率限制检查
function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(identifier)
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + 60000 // 1分钟后重置
    })
    return true
  }
  
  if (limit.count >= SECURITY_CONFIG.maxRequestsPerMinute) {
    return false
  }
  
  limit.count++
  return true
}

// 记录失败尝试
function recordFailedAttempt(identifier: string): void {
  const attempts = (failedAttemptsStore.get(identifier) || 0) + 1
  failedAttemptsStore.set(identifier, attempts)
  
  if (attempts >= SECURITY_CONFIG.maxFailedAttempts) {
    blacklistStore.add(identifier)
    console.log(`[SECURITY] IP ${identifier} has been blacklisted after ${attempts} failed attempts`)
  }
}

// 验证CSRF令牌
function verifyCSRFToken(token: string, sessionId: string): boolean {
  // 实际应该验证CSRF令牌的有效性
  return token === `csrf_${sessionId}`
}

// 验证管理员密钥
function verifyAdminKey(key: string): boolean {
  // 实际应该验证管理员密钥
  return key === process.env.ADMIN_MASTER_KEY
}

// 记录安全事件
async function logSecurityEvent(event: {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip: string
  path: string
  details: any
}) {
  const timestamp = new Date().toISOString()
  
  // 记录到数据库或日志服务
  console.log('[SECURITY EVENT]', {
    ...event,
    timestamp
  })
  
  // 如果是高危或严重事件，发送告警
  if (event.severity === 'high' || event.severity === 'critical') {
    await sendAlert(event)
  }
}

// 发送安全告警
async function sendAlert(event: any) {
  // 可以集成各种告警渠道：邮件、短信、Slack、Discord等
  console.log('[ALERT]', event)
  
  // 示例：发送到监控服务
  try {
    await fetch('https://monitoring.oece.tech/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })
  } catch (error) {
    console.error('[ALERT ERROR]', error)
  }
}

export async function adminMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  // 1. 检查黑名单
  if (blacklistStore.has(ip)) {
    await logSecurityEvent({
      type: 'BLACKLIST_ACCESS',
      severity: 'high',
      ip,
      path,
      details: { reason: 'IP is blacklisted' }
    })
    
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    )
  }
  
  // 2. 检查速率限制
  if (!checkRateLimit(ip)) {
    await logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      severity: 'medium',
      ip,
      path,
      details: { limit: SECURITY_CONFIG.maxRequestsPerMinute }
    })
    
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // 3. 检查User-Agent
  const userAgent = request.headers.get('user-agent') || ''
  const isBot = SECURITY_CONFIG.blockedUserAgents.some(bot => 
    userAgent.toLowerCase().includes(bot)
  )
  
  if (isBot) {
    await logSecurityEvent({
      type: 'BOT_DETECTED',
      severity: 'medium',
      ip,
      path,
      details: { userAgent }
    })
    
    return NextResponse.json(
      { error: 'Automated access not allowed' },
      { status: 403 }
    )
  }
  
  // 4. 验证必需的安全头
  const adminKey = request.headers.get('x-admin-key')
  const csrfToken = request.headers.get('x-csrf-token')
  
  if (!adminKey || !csrfToken) {
    await logSecurityEvent({
      type: 'MISSING_SECURITY_HEADERS',
      severity: 'medium',
      ip,
      path,
      details: { hasAdminKey: !!adminKey, hasCSRF: !!csrfToken }
    })
    
    recordFailedAttempt(ip)
    
    return NextResponse.json(
      { error: 'Missing required security headers' },
      { status: 400 }
    )
  }
  
  // 5. 验证JWT令牌
  const token = request.cookies.get('admin-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    await logSecurityEvent({
      type: 'MISSING_AUTH_TOKEN',
      severity: 'low',
      ip,
      path,
      details: {}
    })
    
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production'
    ) as any
    
    // 6. 验证会话
    const session = sessionStore.get(decoded.sessionId)
    if (!session) {
      await logSecurityEvent({
        type: 'INVALID_SESSION',
        severity: 'medium',
        ip,
        path,
        details: { sessionId: decoded.sessionId }
      })
      
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }
    
    // 7. 检查会话超时
    if (Date.now() - session.lastActivity > SECURITY_CONFIG.sessionTimeout) {
      sessionStore.delete(decoded.sessionId)
      
      await logSecurityEvent({
        type: 'SESSION_TIMEOUT',
        severity: 'low',
        ip,
        path,
        details: { sessionId: decoded.sessionId }
      })
      
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }
    
    // 8. 验证IP一致性
    if (session.ip !== ip) {
      await logSecurityEvent({
        type: 'IP_MISMATCH',
        severity: 'high',
        ip,
        path,
        details: { 
          sessionIp: session.ip,
          requestIp: ip 
        }
      })
      
      return NextResponse.json(
        { error: 'Security violation detected' },
        { status: 403 }
      )
    }
    
    // 9. 检查敏感路由权限
    if (SECURITY_CONFIG.sensitiveRoutes.includes(path)) {
      if (session.role !== 'super_admin') {
        await logSecurityEvent({
          type: 'UNAUTHORIZED_ACCESS',
          severity: 'high',
          ip,
          path,
          details: { 
            adminId: session.adminId,
            role: session.role 
          }
        })
        
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }
    
    // 10. 更新会话活动时间
    session.lastActivity = Date.now()
    
    // 记录成功的访问
    await logSecurityEvent({
      type: 'ADMIN_ACCESS',
      severity: 'low',
      ip,
      path,
      details: {
        adminId: session.adminId,
        role: session.role
      }
    })
    
    // 添加安全响应头
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', "default-src 'self'")
    
    return response
    
  } catch (error) {
    await logSecurityEvent({
      type: 'TOKEN_VERIFICATION_FAILED',
      severity: 'high',
      ip,
      path,
      details: { error: (error as Error).message }
    })
    
    recordFailedAttempt(ip)
    
    return NextResponse.json(
      { error: 'Invalid authentication' },
      { status: 401 }
    )
  }
}
