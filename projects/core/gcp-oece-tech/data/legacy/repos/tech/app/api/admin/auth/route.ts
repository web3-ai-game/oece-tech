import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

// 模拟管理员数据库
const ADMINS = [
  {
    id: 'admin_root',
    username: 'root',
    passwordHash: '$2a$10$...', // bcrypt hash
    role: 'super_admin',
    permissions: ['*'],
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    lastLogin: null,
    loginAttempts: 0,
    isLocked: false
  }
]

// IP白名单
const IP_WHITELIST = [
  '10.0.0.1',
  '10.0.0.2',
  '10.0.0.3',
  '127.0.0.1',
  'localhost'
]

// 审计日志记录
async function logAdminAction(
  adminId: string,
  action: string,
  details: any,
  ip: string,
  success: boolean
) {
  const log = {
    id: nanoid(),
    timestamp: new Date().toISOString(),
    adminId,
    action,
    details,
    ip,
    success,
    userAgent: details.userAgent || 'unknown'
  }
  
  // 这里应该保存到数据库
  console.log('[ADMIN AUDIT]', log)
  
  // 如果是关键操作，发送告警
  if (['LOGIN_ATTEMPT', 'PERMISSION_CHANGE', 'USER_DELETE', 'SYSTEM_CONFIG'].includes(action)) {
    await sendSecurityAlert(log)
  }
  
  return log
}

// 发送安全告警
async function sendSecurityAlert(log: any) {
  // 这里可以集成邮件、短信、Webhook等告警方式
  console.log('[SECURITY ALERT]', {
    level: 'HIGH',
    message: `Admin action detected: ${log.action}`,
    admin: log.adminId,
    timestamp: log.timestamp,
    ip: log.ip
  })
}

// 验证IP白名单
function verifyIPWhitelist(ip: string): boolean {
  return IP_WHITELIST.includes(ip)
}

// 验证两步验证码
function verifyTwoFactor(secret: string, code: string): boolean {
  // 这里应该使用真实的TOTP库验证
  // 示例代码仅作演示
  return code === '123456'
}

// 生成安全令牌
function generateSecureToken(adminId: string, role: string): string {
  return jwt.sign(
    {
      adminId,
      role,
      timestamp: Date.now(),
      sessionId: nanoid()
    },
    process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production',
    {
      expiresIn: '30m', // 30分钟过期
      issuer: 'oece-admin',
      audience: 'admin-panel'
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, twoFactorCode, hardwareKey } = body
    
    // 获取请求IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // 1. 验证IP白名单
    if (!verifyIPWhitelist(ip)) {
      await logAdminAction(
        'unknown',
        'LOGIN_BLOCKED_IP',
        { username, reason: 'IP not whitelisted' },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Access denied from this location'
      }, { status: 403 })
    }
    
    // 2. 查找管理员
    const admin = ADMINS.find(a => a.username === username)
    if (!admin) {
      await logAdminAction(
        'unknown',
        'LOGIN_ATTEMPT_FAILED',
        { username, reason: 'User not found' },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }
    
    // 3. 检查账户是否锁定
    if (admin.isLocked) {
      await logAdminAction(
        admin.id,
        'LOGIN_BLOCKED_LOCKED',
        { username, reason: 'Account locked' },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Account is locked. Contact super admin.'
      }, { status: 403 })
    }
    
    // 4. 验证密码（实际应该验证bcrypt hash）
    const isPasswordValid = password === 'admin123' // 示例，实际应使用bcrypt.compare
    if (!isPasswordValid) {
      admin.loginAttempts++
      
      // 超过3次失败尝试，锁定账户
      if (admin.loginAttempts >= 3) {
        admin.isLocked = true
        await logAdminAction(
          admin.id,
          'ACCOUNT_LOCKED',
          { username, attempts: admin.loginAttempts },
          ip,
          false
        )
      }
      
      await logAdminAction(
        admin.id,
        'LOGIN_ATTEMPT_FAILED',
        { username, reason: 'Invalid password', attempts: admin.loginAttempts },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
        attemptsRemaining: Math.max(0, 3 - admin.loginAttempts)
      }, { status: 401 })
    }
    
    // 5. 验证两步验证
    if (!verifyTwoFactor(admin.twoFactorSecret, twoFactorCode)) {
      await logAdminAction(
        admin.id,
        'LOGIN_2FA_FAILED',
        { username, reason: 'Invalid 2FA code' },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Invalid two-factor code'
      }, { status: 401 })
    }
    
    // 6. 验证硬件密钥（可选）
    if (hardwareKey && hardwareKey !== 'expected-hardware-key') {
      await logAdminAction(
        admin.id,
        'LOGIN_HARDWARE_KEY_FAILED',
        { username, reason: 'Invalid hardware key' },
        ip,
        false
      )
      
      return NextResponse.json({
        success: false,
        error: 'Invalid hardware key'
      }, { status: 401 })
    }
    
    // 7. 登录成功
    admin.loginAttempts = 0
    admin.lastLogin = new Date().toISOString()
    
    const token = generateSecureToken(admin.id, admin.role)
    
    await logAdminAction(
      admin.id,
      'LOGIN_SUCCESS',
      { username, role: admin.role },
      ip,
      true
    )
    
    // 设置安全响应头
    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      }
    })
    
    // 设置安全Cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1800, // 30分钟
      path: '/admin'
    })
    
    return response
    
  } catch (error) {
    console.error('[ADMIN AUTH ERROR]', error)
    
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 })
  }
}

// 验证管理员会话
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 })
    }
    
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production'
    ) as any
    
    // 验证会话是否过期
    if (Date.now() - decoded.timestamp > 30 * 60 * 1000) {
      return NextResponse.json({
        success: false,
        error: 'Session expired'
      }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      admin: {
        id: decoded.adminId,
        role: decoded.role,
        sessionId: decoded.sessionId
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid token'
    }, { status: 401 })
  }
}
