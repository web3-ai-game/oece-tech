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

// 登录验证
export const loginSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符'),
  
  password: z.string()
    .min(1, '密码不能为空')
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

// 教程slug验证
export const tutorialSlugSchema = z.object({
  category: z.string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, '无效的分类'),
  
  slug: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, '无效的教程ID')
})

// 验证函数
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      throw new Error(firstError.message)
    }
    throw new Error('验证失败')
  }
}

// HTML清理（防XSS）
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;')
}

// SQL特殊字符转义（额外保护层）
export function escapeSql(str: string): string {
  if (!str) return ''
  
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
}

// 邮箱脱敏
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (user.length <= 2) return `${user[0]}***@${domain}`
  return `${user[0]}***${user[user.length - 1]}@${domain}`
}

// IP地址验证
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// URL验证（防SSRF）
export function isValidUrl(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(url)
    
    // 只允许https
    if (parsed.protocol !== 'https:') {
      return false
    }
    
    // 如果指定了允许的域名
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      )
    }
    
    // 禁止内网地址
    const hostname = parsed.hostname
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

// 检测危险内容
export function containsDangerousContent(content: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /onload=/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /eval\(/i,
    /alert\(/i,
    /document\.cookie/i,
    /window\.location/i
  ]
  
  return dangerousPatterns.some(pattern => pattern.test(content))
}

// 清理文件名
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255)
}
