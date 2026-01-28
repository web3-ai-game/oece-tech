# 📊 BBS论坛测试数据导入指南

## 🎯 一键导入（推荐）

在Supabase SQL Editor执行以下SQL：

```sql
-- Step 1: 更新Schema（添加新字段）
ALTER TABLE public.users 
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('free', 'pro', 'admin'));

ALTER TABLE public.bbs_posts 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' 
  CHECK (category IN ('general', 'city', 'visa', 'work', 'lifestyle', 'tech', 'meetup'));

ALTER TABLE public.bbs_posts 
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Step 2: 设置你的账号为管理员（重要！）
-- 替换 'YOUR_USER_ID' 为你的实际用户ID
-- 获取方法：登录后在Dashboard页面的console.log中查看user.id
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your_email@example.com';  -- 或者 WHERE id = 'your-uuid-here'

-- Step 3: 导入8篇测试帖子
-- 注意：author_id使用NULL（显示为Anonymous），或者替换为你的user_id
INSERT INTO public.bbs_posts (title, content, category, author_id, is_pinned, is_featured, view_count, reply_count, created_at)
VALUES 
  -- 1. 置顶欢迎帖
  (
    '📌 Welcome to DeepWeay Forum!',
    '# Welcome Digital Nomads!

This is the DeepWeay community forum, dedicated to providing:

- 🌍 Global lifestyle experiences
- 💼 Remote work opportunities
- 🏠 Accommodation, visa, tax info
- 🤝 Like-minded connections

## Forum Rules

1. Be kind and respectful
2. Share valuable content
3. No spam or ads
4. Protect privacy

Let''s dive deep! 🚀',
    'general',
    NULL,  -- 改为你的user_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    true,
    true,
    1250,
    24,
    NOW() - INTERVAL '30 days'
  ),
  
  -- 2. 热门城市推荐
  (
    '🔥 Top 10 Digital Nomad Cities in 2025',
    'After traveling for a year, here''s my ranking:

## Top 10 Cities

1. **Bangkok, Thailand** - Low cost, fast WiFi, visa-friendly
2. **Lisbon, Portugal** - European culture, warm weather, startup vibe
3. **Bali, Indonesia** - Beach life, yoga culture, creative community
4. **Mexico City, Mexico** - Food paradise, rich history, affordable
5. **Berlin, Germany** - Startup hub, art scene, nightlife

Which is your favorite? Share your experience!',
    'city',
    NULL,
    false,
    true,
    856,
    42,
    NOW() - INTERVAL '7 days'
  ),
  
  -- 3. 时间管理技巧
  (
    '💡 10 Time Management Tips for Remote Workers',
    'As a 5-year remote worker, here are my tips:

## Core Techniques

1. Pomodoro Technique 🍅 - 25 min focus + 5 min break
2. Use World Time Buddy for global meetings
3. Tackle important tasks 6-9am
4. Priority Matrix: Urgent Important > Important Not Urgent
5. 5-min messages > 30-min meetings

What''s your secret?',
    'work',
    NULL,
    false,
    true,
    623,
    31,
    NOW() - INTERVAL '5 days'
  ),
  
  -- 4. 巴厘岛生活指南
  (
    '🏖️ Canggu Digital Nomad Living Guide',
    'Just spent 3 months in Canggu, sharing practical info:

## Accommodation
- Budget: $300-600/mo (villa with pool)
- Areas: Berawa, Batu Bolong

## Coworking
- Dojo Bali: $100/mo
- Tropical Nomad: $8/day

## Internet
- Telkomsel 150GB: $15/mo
- Cafes: 10-30 Mbps

Any questions? 🌴',
    'city',
    NULL,
    false,
    false,
    445,
    18,
    NOW() - INTERVAL '3 days'
  ),
  
  -- 5. 工具推荐
  (
    '💻 Essential Tools for Digital Nomads 2025',
    '# Digital Nomad Toolkit

## 🌐 VPN
- NordVPN / ExpressVPN

## 💬 Communication
- Slack / Discord
- WhatsApp / Telegram

## 📝 Documents
- Notion
- Google Workspace

## 💰 Finance
- Wise / Revolut

What tools do you use?',
    'tech',
    NULL,
    false,
    false,
    512,
    27,
    NOW() - INTERVAL '2 days'
  ),
  
  -- 6. 从全职到数字游民
  (
    '🤔 From Full-time to Digital Nomad: Do I Regret It?',
    '# One Year Review

Last year, I quit my $80k job. Looking back:

## ✅ Gains
1. Freedom - Go anywhere
2. Growth - Problem-solving skills
3. Perspective - Different cultures

## ❌ Challenges
1. Loneliness - No fixed social circle
2. Instability - Income fluctuation
3. Fatigue - Frequent moving

**Do I regret it? No.**',
    'lifestyle',
    NULL,
    false,
    true,
    789,
    35,
    NOW() - INTERVAL '1 day'
  ),
  
  -- 7. 清迈求推荐
  (
    '📱 Just Arrived in Chiang Mai - Recommendations?',
    'Hi! Just arrived, staying for 2 months.

Looking for:
1. Cafes with stable WiFi
2. Affordable coworking spaces
3. DN hangout spots

Requirements:
- 20+ Mbps WiFi
- Power outlets
- Quiet for calls

Budget: $50-100/month

Thanks! 🙏',
    'city',
    NULL,
    false,
    false,
    156,
    12,
    NOW() - INTERVAL '12 hours'
  ),
  
  -- 8. 葡萄牙D7签证
  (
    '🎉 Finally Got Portugal D7 Visa!',
    '# Portugal D7 Visa Guide

After 4 months, I got it!

## 📋 Required
1. Financial Proof: $10,000+
2. Income: €820+/month
3. Portugal rental contract
4. Criminal record check
5. Health insurance

## ⏱️ Timeline
- Week 1: Prep documents
- Week 2-3: Embassy appointment
- Week 4: Submit
- Week 8-16: Wait

Total cost: ~$1000-1500

Any questions?',
    'visa',
    NULL,
    false,
    false,
    392,
    16,
    NOW() - INTERVAL '6 hours'
  );
```

---

## ✅ 验证导入成功

在Supabase SQL Editor执行：

```sql
-- 查看导入的帖子
SELECT 
  title,
  category,
  is_pinned,
  is_featured,
  view_count,
  reply_count,
  created_at
FROM public.bbs_posts
ORDER BY is_pinned DESC, is_featured DESC, created_at DESC;

-- 应该看到8篇帖子
```

---

## 🎨 查看效果

1. **访问论坛列表**: http://localhost:3000/bbs
2. **应该看到**:
   - 1个置顶帖（📌 Welcome）
   - 4个精华帖（⭐ Featured）
   - 2个热门帖（🔥 HOT - 浏览>500）
   - 7种分类标签
   - 使用分类筛选器测试

3. **管理员功能**（需先设置admin角色）:
   - 每个帖子右侧显示Pin/Star按钮
   - 点击可置顶/取消置顶
   - 点击可精华/取消精华

---

## 🔧 常见问题

### Q: 如何获取我的user_id？

**方法1**: 浏览器Console
```javascript
// 在Dashboard页面按F12打开Console
// 查看user对象
console.log(user)
```

**方法2**: Supabase SQL
```sql
SELECT id, email, display_name, role 
FROM public.users 
WHERE email = 'your_email@example.com';
```

### Q: 设置管理员后看不到管理按钮？

刷新页面或重新登录，确保：
```sql
-- 检查role是否已更新
SELECT email, role FROM public.users WHERE email = 'your_email';
-- 应该显示 role = 'admin'
```

### Q: 想用自己的用户作为帖子作者？

将SQL中的 `NULL` 替换为你的user_id:
```sql
INSERT INTO public.bbs_posts (..., author_id, ...)
VALUES (..., 'your-user-uuid', ...);
```

---

## 📝 下一步

1. ✅ 导入测试数据
2. ✅ 设置管理员角色
3. ✅ 访问 /bbs 查看效果
4. ✅ 测试发帖功能
5. ✅ 测试分类筛选
6. ✅ 测试管理员置顶/精华功能

---

更新时间: 2025-11-06
