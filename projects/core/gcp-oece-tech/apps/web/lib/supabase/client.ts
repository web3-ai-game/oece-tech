// 🗄️ Supabase 客户端配置

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 檢查是否有有效配置
const hasValidConfig = supabaseUrl && supabaseAnonKey;

// 創建 helper 函數獲取 supabase client
function getSupabaseClient(): SupabaseClient | null {
  if (!hasValidConfig) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// 導出 supabase client（可能為 null）
export const supabase = getSupabaseClient();

// 導出 helper 函數用於需要非空 client 的場景
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  return supabase;
}

// 数据库表名
export const TABLES = {
  POSTS: 'forum_posts',
  REPLIES: 'forum_replies',
  LIKES: 'forum_likes'
} as const;

// 论坛分区
export const FORUM_CATEGORIES = {
  AI_DISCUSSION: 'ai-discussion',
  DIVINATION: 'divination',
  TECH_SUPPORT: 'tech-support',
  ANNOUNCEMENTS: 'announcements'
} as const;

export type ForumCategory = typeof FORUM_CATEGORIES[keyof typeof FORUM_CATEGORIES];
