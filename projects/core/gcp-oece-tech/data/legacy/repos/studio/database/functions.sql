-- ===================================
-- Supabase Database Functions
-- BBS功能所需的数据库函数
-- ===================================

-- 1. 增加帖子浏览量
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 增加帖子回复数
CREATE OR REPLACE FUNCTION increment_reply_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET reply_count = reply_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 减少帖子回复数
CREATE OR REPLACE FUNCTION decrement_reply_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.bbs_posts
  SET reply_count = GREATEST(reply_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 新用户注册时自动创建profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role, invites_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    'free',
    2
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建trigger（如果不存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. 自动生成2个邀请码给新用户
CREATE OR REPLACE FUNCTION generate_initial_invite_codes()
RETURNS TRIGGER AS $$
DECLARE
  code1 TEXT;
  code2 TEXT;
BEGIN
  -- 生成两个随机邀请码
  code1 := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  code2 := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  
  -- 插入邀请码
  INSERT INTO public.invites (code, created_by)
  VALUES (code1, NEW.id), (code2, NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建trigger
DROP TRIGGER IF EXISTS on_user_created_generate_invites ON public.users;
CREATE TRIGGER on_user_created_generate_invites
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION generate_initial_invite_codes();

-- 6. 更新updated_at时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到所有表
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bbs_posts_updated_at BEFORE UPDATE ON public.bbs_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bbs_replies_updated_at BEFORE UPDATE ON public.bbs_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
