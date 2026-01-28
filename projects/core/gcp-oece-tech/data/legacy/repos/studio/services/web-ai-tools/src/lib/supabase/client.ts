import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 类型定义
export type UserRole = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  invites_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Invite {
  code: string;
  created_by: string | null;
  used_by: string | null;
  is_used: boolean;
  created_at: string;
  used_at: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string | null;
  is_pro_only: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BBSPost {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  is_pinned: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface BBSReply {
  id: string;
  post_id: string;
  content: string;
  author_id: string | null;
  parent_reply_id: string | null;
  created_at: string;
  updated_at: string;
}
