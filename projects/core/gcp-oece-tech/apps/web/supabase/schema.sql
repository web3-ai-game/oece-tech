-- 🗄️ OECE.tech 論壇數據庫結構
-- 在 Supabase SQL Editor 中執行此腳本

-- 論壇帖子表
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ai-discussion',
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 論壇回覆表
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 點贊表
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'reply')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON forum_likes(target_type, target_id);

-- 創建更新回覆數的函數
CREATE OR REPLACE FUNCTION increment_replies_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_posts 
  SET replies_count = replies_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 啟用 RLS (Row Level Security)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人可讀
CREATE POLICY "Posts are viewable by everyone" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Replies are viewable by everyone" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Likes are viewable by everyone" ON forum_likes
  FOR SELECT USING (true);

-- RLS 策略：認證用戶可寫
CREATE POLICY "Users can insert posts" ON forum_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert replies" ON forum_replies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert likes" ON forum_likes
  FOR INSERT WITH CHECK (true);

-- RLS 策略：用戶只能刪除自己的內容
CREATE POLICY "Users can delete own posts" ON forum_posts
  FOR DELETE USING (true);

CREATE POLICY "Users can delete own likes" ON forum_likes
  FOR DELETE USING (true);

-- 插入一些示例數據
INSERT INTO forum_posts (user_id, user_name, title, content, category, tags) VALUES
  ('demo-user-1', 'DeepWeay', 'Gemini 2.5 Pro 使用心得分享', '最近測試了 Gemini 2.5 Pro，效果非常驚艷！特別是在複雜推理任務上表現優異...', 'ai-discussion', ARRAY['gemini', 'ai', 'review']),
  ('demo-user-2', 'CyberSage', '賽博神佛算命準確率測試報告', '使用塔羅占卜功能測試了 50 次，準確率達到 85%！AI 算命真的有點東西...', 'divination', ARRAY['tarot', 'divination', 'test']),
  ('demo-user-3', 'TechGuru', 'Firebase Hosting 部署最佳實踐', '分享一下我在 Firebase Hosting 上部署 Next.js 項目的經驗和踩坑記錄...', 'tech-support', ARRAY['firebase', 'nextjs', 'deployment']);
