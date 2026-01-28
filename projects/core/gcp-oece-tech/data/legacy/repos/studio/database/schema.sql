-- ===================================
-- Digital Nomad Compass - Supabase Schema
-- ===================================

-- 1. 用户扩展表（关联auth.users）
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'pro')),
  invites_remaining INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 邀请码表
CREATE TABLE public.invites (
  code TEXT PRIMARY KEY,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  used_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- 3. 文章表
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_pro_only BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BBS论坛帖子表
CREATE TABLE public.bbs_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BBS回复表
CREATE TABLE public.bbs_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.bbs_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  parent_reply_id UUID REFERENCES public.bbs_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 订阅记录表（PRO会员）
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- RLS (Row Level Security) 策略
-- ===================================

-- 启用RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bbs_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bbs_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users表策略
CREATE POLICY "用户可以查看所有用户基本信息" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "用户只能更新自己的信息" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Invites表策略
CREATE POLICY "任何人可以查询邀请码是否有效" ON public.invites
  FOR SELECT USING (true);

CREATE POLICY "已登录用户可以创建邀请码" ON public.invites
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "已登录用户可以使用邀请码" ON public.invites
  FOR UPDATE USING (NOT is_used);

-- Articles表策略
CREATE POLICY "所有人可以查看已发布的文章" ON public.articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "作者可以管理自己的文章" ON public.articles
  FOR ALL USING (auth.uid() = author_id);

-- BBS Posts策略
CREATE POLICY "已登录用户可以查看所有帖子" ON public.bbs_posts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "已登录用户可以发帖" ON public.bbs_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "作者可以编辑删除自己的帖子" ON public.bbs_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "作者可以删除自己的帖子" ON public.bbs_posts
  FOR DELETE USING (auth.uid() = author_id);

-- BBS Replies策略
CREATE POLICY "已登录用户可以查看所有回复" ON public.bbs_replies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "已登录用户可以回复" ON public.bbs_replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "作者可以编辑删除自己的回复" ON public.bbs_replies
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "作者可以删除自己的回复" ON public.bbs_replies
  FOR DELETE USING (auth.uid() = author_id);

-- Subscriptions策略
CREATE POLICY "用户只能查看自己的订阅信息" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ===================================
-- 函数：自动生成邀请码
-- ===================================
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- 生成8位随机码
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- 检查是否已存在（使用表别名避免歧义）
    SELECT EXISTS(SELECT 1 FROM public.invites i WHERE i.code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$ LANGUAGE plpgsql;

-- ===================================
-- 触发器：新用户注册后创建资料和邀请码
-- ===================================
CREATE OR REPLACE FUNCTION create_user_profile_and_invites()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT;
BEGIN
  -- 创建用户资料
  INSERT INTO public.users (id, email, display_name, avatar_url, invites_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    2  -- 每个新用户2个邀请码额度
  );
  
  -- 生成2个邀请码
  FOR i IN 1..2 LOOP
    code := generate_invite_code();
    INSERT INTO public.invites (code, created_by, is_used)
    VALUES (code, NEW.id, FALSE);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile_and_invites();

-- ===================================
-- 索引优化
-- ===================================
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published ON public.articles(is_published);
CREATE INDEX idx_bbs_posts_created_at ON public.bbs_posts(created_at DESC);
CREATE INDEX idx_bbs_posts_pinned ON public.bbs_posts(is_pinned);
CREATE INDEX idx_bbs_replies_post_id ON public.bbs_replies(post_id);
CREATE INDEX idx_invites_code ON public.invites(code);
CREATE INDEX idx_invites_used ON public.invites(is_used);

-- ===================================
-- BBS 辅助函数
-- ===================================

-- 增加帖子浏览数
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 增加回复数
CREATE OR REPLACE FUNCTION increment_reply_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET reply_count = reply_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 减少回复数
CREATE OR REPLACE FUNCTION decrement_reply_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET reply_count = GREATEST(reply_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- 插入初始邀请码（用于测试注册）
-- ===================================
INSERT INTO public.invites (code, created_by, is_used)
VALUES 
  ('WELCOME2024', NULL, FALSE),
  ('NOMAD2024', NULL, FALSE),
  ('COMPASS2024', NULL, FALSE),
  ('TEST2024', NULL, FALSE);

-- ===================================
-- 创建测试账号说明
-- ===================================
-- 测试账号需要在Supabase Dashboard手动创建:
-- 1. 进入 Authentication > Users
-- 2. 点击 "Add user" > "Create new user"
-- 3. Email: 123@123.com
-- 4. Password: 123123
-- 5. Email Confirm: true (跳过邮箱验证)
-- 6. User Metadata: {"display_name": "测试账号"}
-- 
-- 或者使用以下SQL (需要在auth schema中执行):
-- 注意：这需要超级用户权限，建议使用Dashboard创建
/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  '123@123.com',
  crypt('123123', gen_salt('bf')),
  NOW(),
  '{"display_name": "测试账号"}'::jsonb,
  NOW(),
  NOW()
);
*/
