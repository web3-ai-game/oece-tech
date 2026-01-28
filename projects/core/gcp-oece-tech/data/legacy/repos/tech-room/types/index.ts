// ============================================
// GeekSEA TypeScript 類型定義
// ============================================

// 用戶相關
export interface User {
  id: number
  username: string
  email: string
  display_name?: string
  avatar_url?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  tutorial_count?: number
  completed_count?: number
  total_progress?: number
}

// 認證相關
export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface LoginCredentials {
  emailOrUsername: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

// 教程相關
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type TutorialCategory = 'web3' | 'frontend' | 'backend' | 'design' | 'tools' | 'data-science'

export interface Tutorial {
  id: number
  slug: string
  title: string
  title_en: string
  description?: string
  content: string
  category: TutorialCategory
  difficulty: TutorialDifficulty
  duration?: number
  author_id?: number
  author?: User
  tags?: string[]
  view_count: number
  like_count: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface TutorialCard {
  id: number
  slug: string
  title: string
  title_en: string
  description?: string
  category: TutorialCategory
  difficulty: TutorialDifficulty
  duration?: number
  tags?: string[]
  view_count: number
  like_count: number
  author?: {
    username: string
    avatar_url?: string
  }
}

export interface TutorialFilters {
  category?: TutorialCategory
  difficulty?: TutorialDifficulty
  tags?: string[]
  search?: string
  published?: boolean
}

// 代碼塊
export interface CodeBlock {
  language: string
  code: string
  filename?: string
  highlightLines?: number[]
}

// 學習進度
export interface UserProgress {
  id: number
  user_id: number
  tutorial_id: number
  progress: number // 0-100
  completed: boolean
  last_accessed: string
}

// 評論
export interface Comment {
  id: number
  tutorial_id: number
  user_id: number
  user?: User
  content: string
  parent_id?: number
  replies?: Comment[]
  created_at: string
}

// 點贊
export interface Like {
  id: number
  user_id: number
  tutorial_id: number
  created_at: string
}

// API 響應
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 表單狀態
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}

// 通知
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

// 主題
export type Theme = 'dark' | 'light'

// 語言
export type Locale = 'zh-TW' | 'en'

// 應用配置
export interface AppConfig {
  siteName: string
  siteUrl: string
  siteDescription: string
  defaultLocale: Locale
  supportedLocales: Locale[]
  theme: Theme
}

// 教程統計
export interface TutorialStats {
  total_tutorials: number
  total_views: number
  total_likes: number
  total_comments: number
  categories: Record<TutorialCategory, number>
  difficulties: Record<TutorialDifficulty, number>
}

// 用戶統計
export interface UserStats {
  total_users: number
  active_users: number
  new_users_today: number
  new_users_week: number
  new_users_month: number
}
