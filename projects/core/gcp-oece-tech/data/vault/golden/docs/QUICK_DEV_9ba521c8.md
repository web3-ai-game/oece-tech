# 🚀 DeepWeay 快速开发指南

**更新**: 2025-11-06  
**模式**: 真实Supabase数据 + 容器化部署

---

## ✅ 已完成功能（使用真实数据）

| 功能 | 状态 | 数据源 | 文件位置 |
|------|------|--------|----------|
| **用户注册/登录** | ✅ | Supabase Auth | `src/lib/supabase/auth.ts` |
| **用户Profile** | ✅ | Supabase `users` | `src/lib/supabase/hooks.ts` |
| **Dashboard** | ✅ | Supabase `users` + `invites` | `src/app/(authenticated)/dashboard/page.tsx` |
| **邀请码系统** | ✅ | Supabase `invites` | 自动trigger生成 |
| **BBS论坛列表** | ✅ | Supabase `bbs_posts` | `src/app/(authenticated)/bbs/page.tsx` |
| **BBS发帖** | ✅ | Supabase `bbs_posts` | `src/app/(authenticated)/bbs/new/page.tsx` |
| **BBS帖子详情** | ✅ | Supabase `bbs_posts` | `src/app/(authenticated)/bbs/[id]/page.tsx` |
| **BBS回复** | ✅ | Supabase `bbs_replies` | 同上 |
| **实时更新** | ✅ | Supabase Realtime | `src/lib/supabase/bbs-hooks.ts` |

---

## 📦 快速启动（3步）

### **步骤1: 配置环境变量**

```bash
# 查看现有环境变量（如果已配置）
ls -la .env*

# 如果没有.env.local，从模板创建
cp .env.production.template .env.local

# 编辑环境变量
nano .env.local
```

**必需配置**:
```bash
# Supabase（必填）
NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key

# 其他可选（AI工具需要）
GOOGLE_GENAI_API_KEY=你的gemini_key  # AI工具使用
TELEGRAM_BOT_TOKEN_1=你的bot_token    # Bot功能
```

### **步骤2: 初始化数据库**

在Supabase Dashboard执行：

```sql
-- 1. 创建表结构（如果还没有）
-- 执行 database/schema.sql 中的所有SQL

-- 2. 插入测试邀请码
INSERT INTO public.invites (code, created_by, is_used)
VALUES 
  ('WELCOME2024', NULL, FALSE),
  ('NOMAD2024', NULL, FALSE),
  ('COMPASS2024', NULL, FALSE),
  ('TEST2024', NULL, FALSE)
ON CONFLICT (code) DO NOTHING;
```

### **步骤3: 启动开发服务器**

```bash
# 安装依赖（第一次）
npm install

# 启动开发服务器
npm run dev

# 访问
open http://localhost:3000
```

---

## 🧪 测试功能流程

### **1. 注册新用户**

```bash
# 访问注册页
http://localhost:3000/login

# 填写信息
邀请码: WELCOME2024
邮箱: test@deepweay.me
密码: Test123456!
用户名: TestDiver

# 注册成功后
- ✅ 自动创建users表记录
- ✅ 自动生成2个邀请码
- ✅ 跳转到登录表单
```

### **2. 登录进入Dashboard**

```bash
# 登录后自动跳转
http://localhost:3000/dashboard

# Dashboard显示:
- ✅ 用户信息（用户名、邮箱、角色）
- ✅ 邀请码列表（已生成的2个码）
- ✅ 生成新邀请码按钮（剩余次数）
- ✅ 快捷导航卡片
```

### **3. 测试论坛功能**

```bash
# 进入论坛
http://localhost:3000/bbs

# 发布新帖
1. 点击 "NEW_POST" 按钮
2. 填写标题和内容
3. 点击 "PUBLISH"
4. 自动跳转到帖子详情页

# 查看帖子详情
http://localhost:3000/bbs/[post_id]

# 发表回复
1. 在详情页底部输入回复内容
2. 点击 "POST REPLY"
3. 实时显示新回复（Supabase Realtime）

# 删除帖子/回复（仅作者可删除）
- 点击垃圾桶图标
- 确认删除
```

---

## 📊 Supabase数据表结构

### **users** - 用户表
```sql
- id (UUID, FK to auth.users)
- email (TEXT)
- display_name (TEXT)
- avatar_url (TEXT)
- role (TEXT: 'free' | 'pro')
- invites_remaining (INTEGER, 默认2)
- created_at, updated_at
```

### **invites** - 邀请码表
```sql
- code (TEXT, PK)
- created_by (UUID, FK to users)
- used_by (UUID, FK to users)
- is_used (BOOLEAN, 默认false)
- created_at, used_at
```

### **bbs_posts** - 论坛帖子表
```sql
- id (UUID, PK)
- title (TEXT)
- content (TEXT)
- author_id (UUID, FK to users)
- is_pinned (BOOLEAN, 默认false)
- view_count (INTEGER, 默认0)
- reply_count (INTEGER, 默认0)
- created_at, updated_at
```

### **bbs_replies** - 论坛回复表
```sql
- id (UUID, PK)
- post_id (UUID, FK to bbs_posts)
- content (TEXT)
- author_id (UUID, FK to users)
- parent_reply_id (UUID, FK to bbs_replies, 可选)
- created_at, updated_at
```

---

## 🔧 开发常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# Lint检查
npm run lint

# 查看Supabase连接状态
node scripts/tests/test-supabase.js
```

---

## 🐛 故障排查

### **问题1: 登录后显示"未授权"**
```bash
# 检查RLS策略
# 在Supabase Dashboard → SQL Editor执行
SELECT * FROM public.users WHERE id = 'your_user_id';

# 如果返回空，手动插入
INSERT INTO public.users (id, email, display_name, role, invites_remaining)
VALUES (
  'your_auth_user_id',
  'your_email@example.com',
  'Your Name',
  'free',
  2
);
```

### **问题2: 无法发帖/回复**
```bash
# 检查数据库函数是否存在
# 在Supabase Dashboard → SQL Editor执行
SELECT proname FROM pg_proc WHERE proname LIKE '%bbs%';

# 应该返回:
# - increment_post_views
# - increment_reply_count
# - decrement_reply_count

# 如果缺失，执行 database/schema.sql 中的函数部分
```

### **问题3: 邀请码用不了**
```bash
# 检查邀请码是否存在
SELECT * FROM public.invites WHERE code = 'WELCOME2024';

# 如果不存在，重新插入
INSERT INTO public.invites (code, created_by, is_used)
VALUES ('WELCOME2024', NULL, FALSE);
```

### **问题4: Supabase连接失败**
```bash
# 检查环境变量
cat .env.local | grep SUPABASE

# 确保配置正确
NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的key（以eyJ开头）

# 测试连接
node scripts/tests/test-supabase.js
```

---

## 📝 下一步开发

### **优先级1: 完善论坛功能** ⏳
- [ ] 帖子编辑功能
- [ ] 帖子点赞/收藏
- [ ] 用户@提及
- [ ] 帖子分类/标签
- [ ] 搜索功能

### **优先级2: Dashboard增强** ⏳
- [ ] 用户头像上传
- [ ] 个人资料编辑
- [ ] 统计图表（发帖数、回复数）
- [ ] 最近活动时间线

### **优先级3: PRO会员功能** ⏳
- [ ] Stripe支付集成
- [ ] 订阅管理
- [ ] PRO专属内容标记

### **优先级4: Bot集成** ⏸️
- [ ] Telegram Bot连接
- [ ] Slack Bot连接
- [ ] Bot命令实现

---

## 💾 提交代码

```bash
# 添加所有改动
git add -A

# 提交
git commit -m "feat: 完善BBS论坛和Dashboard功能

- ✅ BBS论坛完整实现（列表/发帖/详情/回复/删除）
- ✅ Dashboard个人面板（用户信息/邀请码管理）
- ✅ 所有功能使用真实Supabase数据
- ✅ 实时更新功能（Supabase Realtime）
- ✅ 完整的错误处理和加载状态
- ✅ 数据库函数和触发器
- 📝 添加快速开发指南"

# 推送到GitHub
git push origin main
```

---

## 🎯 当前状态

| 组件 | 进度 | 数据源 | 说明 |
|------|------|--------|------|
| **认证系统** | 100% | Supabase Auth | 完整实现 |
| **用户系统** | 100% | Supabase | Profile + 邀请码 |
| **Dashboard** | 90% | Supabase | 基础功能完成，待美化 |
| **BBS论坛** | 95% | Supabase | 核心功能完成，待增强 |
| **文章系统** | 30% | Supabase | 表结构已有，页面待实现 |
| **AI工具** | 10% | Mock → Gemini | 页面框架已有，待集成API |
| **Bot系统** | 10% | - | 容器结构已有，逻辑待实现 |

---

**更新时间**: 2025-11-06  
**开发模式**: VPS快速原型 → GitHub存档 → 本地继续开发  
**成本控制**: 原型完成后关闭VPS，转本地开发
