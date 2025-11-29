// 🎯 用户数据类型定义（完整版）

/**
 * 用户层级
 */
export enum UserTier {
  FREE = 'free',
  BETA = 'beta',
  PRO = 'pro',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

/**
 * 用户角色
 */
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

/**
 * 用户状态
 */
export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending'
}

/**
 * OAuth 提供商
 */
export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  APPLE = 'apple',
  MICROSOFT = 'microsoft'
}

/**
 * 用户完整数据模型
 */
export interface UserData {
  // 基础信息
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;

  // Token 和计费
  tokens: number;
  tokensUsed: number;
  tokensTotal: number;
  tier: UserTier;

  // 权限和状态
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;

  // 认证信息
  authProviders: AuthProvider[];
  lastLoginAt: string;
  lastLoginIP?: string;
  lastLoginDevice?: string;

  // 使用统计
  conversationsCount: number;
  apiCallsCount: number;
  storageUsed: number; // bytes

  // 偏好设置
  preferences: UserPreferences;

  // 邀请系统
  invitedBy?: string;
  inviteCode: string;
  invitesUsed: number;
  invitesLimit: number;

  // 时间戳
  createdAt: string;
  updatedAt: string;

  // 元数据
  metadata?: Record<string, any>;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  language: 'en' | 'zh-CN' | 'zh-TW';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
  privacy: {
    showProfile: boolean;
    showActivity: boolean;
    allowAnalytics: boolean;
  };
  ai: {
    defaultModel: string;
    temperature: number;
    maxTokens: number;
  };
}

/**
 * 用户活动日志
 */
export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  action: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

export enum ActivityType {
  AUTH = 'auth',
  API_CALL = 'api_call',
  TOKEN_USAGE = 'token_usage',
  PROFILE_UPDATE = 'profile_update',
  SETTING_CHANGE = 'setting_change',
  FILE_UPLOAD = 'file_upload',
  FORUM_POST = 'forum_post',
  SECURITY = 'security'
}

/**
 * 用户会话
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  device: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
}

/**
 * API 密钥
 */
export interface APIKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: {
    rpm: number; // requests per minute
    rpd: number; // requests per day
  };
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'revoked' | 'expired';
}

/**
 * 默认用户数据
 */
export const DEFAULT_USER_DATA: Partial<UserData> = {
  tokens: 9999,
  tokensUsed: 0,
  tokensTotal: 9999,
  tier: UserTier.BETA,
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  emailVerified: false,
  authProviders: [],
  conversationsCount: 0,
  apiCallsCount: 0,
  storageUsed: 0,
  invitesUsed: 0,
  invitesLimit: 5,
  preferences: {
    language: 'zh-CN',
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      telegram: false
    },
    privacy: {
      showProfile: true,
      showActivity: false,
      allowAnalytics: true
    },
    ai: {
      defaultModel: 'gemini-lite',
      temperature: 0.7,
      maxTokens: 2048
    }
  }
};

/**
 * 类型守卫：检查是否为管理员
 */
export function isAdmin(user: UserData): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN;
}

/**
 * 类型守卫：检查是否为付费用户
 */
export function isPremiumUser(user: UserData): boolean {
  return user.tier === UserTier.PRO || user.tier === UserTier.PREMIUM;
}

/**
 * 类型守卫：检查账号是否可用
 */
export function isAccountActive(user: UserData): boolean {
  return user.status === UserStatus.ACTIVE;
}
