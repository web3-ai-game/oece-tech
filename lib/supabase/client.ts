// 🗄️ Supabase 客户端配置

import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
