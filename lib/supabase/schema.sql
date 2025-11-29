-- 🗄️ Supabase 数据库表结构

-- 论坛帖子表
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 论坛回复表
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞表
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'post' or 'reply'
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON forum_likes(target_type, target_id);

-- RLS (Row Level Security) 策略
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON forum_likes FOR SELECT USING (true);

-- 只有创建者可以更新/删除
CREATE POLICY "Allow creator to update" ON forum_posts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Allow creator to delete" ON forum_posts FOR DELETE USING (auth.uid()::text = user_id);
CREATE POLICY "Allow creator to update" ON forum_replies FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Allow creator to delete" ON forum_replies FOR DELETE USING (auth.uid()::text = user_id);
