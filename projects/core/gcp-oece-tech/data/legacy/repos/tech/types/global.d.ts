// 全局类型定义文件

// API响应
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 用户相关
export interface User {
  id: string
  username: string
  email?: string
  level: number
  experience: number
  role?: 'user' | 'admin' | 'super_admin'
  created_at?: Date
  last_seen?: Date
}

// 教程相关
export interface Tutorial {
  id: string | number
  title: string
  slug: string
  content: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  views?: number
  likes?: number
  income?: string
  timeNeeded?: string
  description?: string
}

// 笔记相关
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId?: string
}

// 思维导图
export interface MindMap {
  id: string
  title: string
  nodes: MindMapNode[]
  createdAt: Date
  userId?: string
}

export interface MindMapNode {
  id: string
  label: string
  x?: number
  y?: number
  children?: MindMapNode[]
  data?: Record<string, unknown>
}

// 成就系统
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// 订阅相关
export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise'
  expiresAt?: Date
  features: string[]
  status?: 'active' | 'expired' | 'cancelled'
}

// 邀请码
export interface InviteCode {
  code: string
  email?: string
  ip?: string
  userAgent?: string
  expiresAt: Date
  createdAt: Date
  used?: boolean
  usedBy?: string
}

// 数据可视化
export interface DataItem {
  name: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  unit?: string
}

// 通用分页
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 通用列表响应
export interface ListResponse<T> {
  items: T[]
  pagination: Pagination
}

// 表单数据
export interface FormData {
  [key: string]: string | number | boolean | File | undefined
}

// 路由参数
export interface RouteParams {
  params: Record<string, string>
  searchParams?: Record<string, string | string[]>
}

// Next.js Page Props
export interface PageProps {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// 数据库记录
export interface DBRecord {
  id: string | number
  created_at?: Date | string
  updated_at?: Date | string
  [key: string]: unknown
}

// JWT Token
export interface JWTPayload {
  userId: string
  username: string
  role?: string
  exp?: number
  iat?: number
}

// 环境变量类型扩展
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      JWT_SECRET: string
      NEXT_PUBLIC_SITE_URL: string
      GOOGLE_AI_API_KEY?: string
      GEMINI_FREE_KEY?: string
      NOTION_API_KEY?: string
      SUPABASE_URL?: string
      SUPABASE_ANON_KEY?: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

// 扩展Window对象
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }
  }
}

export {}
