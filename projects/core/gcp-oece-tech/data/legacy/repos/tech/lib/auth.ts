import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userQueries } from './db'

// JWT Secret（生產環境應該從環境變量讀取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

/**
 * 密碼加密
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * 驗證密碼
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 生成 JWT Token
 */
export function generateToken(payload: { userId: number; email: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * 驗證 JWT Token
 */
export function verifyToken(token: string): unknown {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * 用戶註冊
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: unknown; token?: string }> {
  try {
    // 檢查用戶名是否已存在
    const existingUsername = userQueries.findByUsername(username)
    if (existingUsername) {
      return { success: false, message: '用戶名已被使用' }
    }

    // 檢查郵箱是否已存在
    const existingEmail = userQueries.findByEmail(email)
    if (existingEmail) {
      return { success: false, message: '郵箱已被註冊' }
    }

    // 加密密碼
    const passwordHash = await hashPassword(password)

    // 創建用戶
    const result = userQueries.create(username, email, passwordHash)

    // 獲取新創建的用戶
    const newUser = userQueries.findById(result.lastInsertRowid as number)

    // 生成 Token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    // 返回用戶信息（不包含密碼）
    const { password_hash, ...userWithoutPassword } = newUser

    return {
      success: true,
      message: '註冊成功',
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error('註冊錯誤:', error)
    return { success: false, message: '註冊失敗，請稍後再試' }
  }
}

/**
 * 用戶登錄
 */
export async function loginUser(
  emailOrUsername: string,
  password: string
): Promise<{ success: boolean; message: string; user?: unknown; token?: string }> {
  try {
    // 查找用戶（支持郵箱或用戶名）
    let user = userQueries.findByEmail(emailOrUsername)
    if (!user) {
      user = userQueries.findByUsername(emailOrUsername)
    }

    if (!user) {
      return { success: false, message: '用戶不存在' }
    }

    // 驗證密碼
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return { success: false, message: '密碼錯誤' }
    }

    // 生成 Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    // 返回用戶信息（不包含密碼）
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      message: '登錄成功',
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error('登錄錯誤:', error)
    return { success: false, message: '登錄失敗，請稍後再試' }
  }
}

/**
 * 從請求中獲取當前用戶
 */
export function getUserFromRequest(authHeader: string | null): unknown {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return null
  }

  const user = userQueries.findById(decoded.userId)
  if (!user) {
    return null
  }

  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * 驗證密碼強度
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('密碼至少需要 8 個字元')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密碼需要包含小寫字母')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密碼需要包含大寫字母')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密碼需要包含數字')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 驗證電子郵件格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 驗證用戶名格式
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (username.length < 3) {
    return { isValid: false, error: '用戶名至少需要 3 個字元' }
  }

  if (username.length > 20) {
    return { isValid: false, error: '用戶名最多 20 個字元' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: '用戶名只能包含字母、數字和下劃線' }
  }

  return { isValid: true }
}
