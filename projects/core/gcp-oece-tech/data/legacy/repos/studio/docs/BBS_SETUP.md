# BBS论坛设置指南

## ✅ 已完成的开发

### 1. 数据库结构
- ✅ `bbs_posts` 表（帖子）
- ✅ `bbs_replies` 表（回复）
- ✅ RLS 安全策略
- ✅ 索引优化

### 2. 前端页面
- ✅ 论坛列表页：`/bbs`
- ✅ 发帖页面：`/bbs/new`
- ✅ 帖子详情+回复：`/bbs/[id]`
- ✅ Dashboard入口链接

### 3. 功能特性
- ✅ 发帖/回复
- ✅ 删除帖子/回复（作者权限）
- ✅ 浏览数统计
- ✅ 回复数统计
- ✅ 置顶帖功能
- ✅ 实时更新（Supabase Realtime）
- ✅ 移动端响应式
- ✅ Cyberpunk风格UI

---

## 🔧 需要执行的SQL更新

### 步骤1: 打开Supabase SQL Editor

```
https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt
```

1. 左侧菜单 → **SQL Editor**
2. 点击 **New query**

### 步骤2: 执行以下SQL

```sql
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

-- 添加索引（如果还没有）
CREATE INDEX IF NOT EXISTS idx_bbs_posts_pinned ON public.bbs_posts(is_pinned);
```

### 步骤3: 点击 Run 或按 `Ctrl+Enter`

预期结果：
```
Success. No rows returned
```

---

## 🧪 测试论坛功能

### 1. 访问论坛列表

```
http://localhost:3000/bbs
```

**预期效果：**
- ✅ 显示 "DATA_FORUM" 标题
- ✅ 有 "NEW_POST" 按钮
- ✅ 空状态显示 "NO_POSTS_YET"
- ✅ Header 和 Footer 正常显示

### 2. 创建第一个帖子

1. 点击 "NEW_POST" 按钮
2. 填写信息：
   ```
   Title: Welcome to Urban Diver Forum
   Content: This is our first post in the DATA_FORUM. 
            Let's start diving deep into discussions!
   ```
3. 点击 "PUBLISH"

**预期效果：**
- ✅ Toast 提示："Post created"
- ✅ 自动跳转到帖子详情页
- ✅ 显示帖子内容和元数据

### 3. 测试回复功能

1. 在帖子详情页
2. 在 "POST_REPLY" 区域输入：
   ```
   Great to see the forum live! Looking forward to discussions.
   ```
3. 点击 "REPLY"

**预期效果：**
- ✅ Toast 提示："Reply posted"
- ✅ 回复立即显示在列表中
- ✅ 回复数 +1
- ✅ 显示回复作者和时间

### 4. 测试删除功能

**删除回复：**
1. 点击自己回复右上角的垃圾桶图标
2. 确认删除

**删除帖子：**
1. 在帖子详情页点击右上角 "DELETE"
2. 确认删除
3. 自动跳转回论坛列表

**预期效果：**
- ✅ 弹出确认对话框
- ✅ 删除成功后有Toast提示
- ✅ 回复数相应减少

### 5. 测试实时更新

1. 打开两个浏览器窗口
2. 都登录同一个账号
3. 在窗口A发帖
4. 在窗口B观察

**预期效果：**
- ✅ 窗口B自动显示新帖子（无需刷新）

---

## 🎨 UI 特性检查

### Cyberpunk风格
- [ ] font-mono 用于所有技术元素
- [ ] font-headline 用于标题
- [ ] 暗色主题 + 青色/紫色霓虹
- [ ] 卡片式布局
- [ ] Glassmorphism 效果

### 移动端响应式
- [ ] 手机端（375px）正常显示
- [ ] 平板端（768px）正常显示
- [ ] 桌面端（1920px）正常显示
- [ ] 卡片堆叠合理

### 功能完整性
- [ ] 所有页面有Header和Footer
- [ ] 英文为主要语言
- [ ] Google翻译被禁用
- [ ] Loading状态显示正确
- [ ] Empty状态有友好提示
- [ ] Error状态有恢复操作

---

## 📊 数据库查询测试

### 查看所有帖子
```sql
SELECT 
  p.*,
  u.display_name as author_name
FROM public.bbs_posts p
LEFT JOIN public.users u ON p.author_id = u.id
ORDER BY p.is_pinned DESC, p.created_at DESC;
```

### 查看帖子的所有回复
```sql
SELECT 
  r.*,
  u.display_name as author_name
FROM public.bbs_replies r
LEFT JOIN public.users u ON r.author_id = u.id
WHERE r.post_id = '<帖子ID>'
ORDER BY r.created_at ASC;
```

### 设置置顶帖
```sql
UPDATE public.bbs_posts
SET is_pinned = true
WHERE id = '<帖子ID>';
```

---

## 🚀 下一步开发计划

### 短期（Week 1-2）
- [ ] 帖子分类/标签系统
- [ ] 搜索功能
- [ ] 用户资料页
- [ ] 点赞功能

### 中期（Week 3-4）
- [ ] 富文本编辑器
- [ ] 图片上传
- [ ] @提及用户
- [ ] 通知系统

### 长期（Month 2+）
- [ ] 管理员后台
- [ ] 内容审核
- [ ] 举报系统
- [ ] 积分系统

---

## 🐛 常见问题

### Q1: 发帖后没有跳转？
**原因：** 路由配置或认证问题
**解决：**
```bash
# 检查控制台错误
# 确认 (authenticated) 路由组配置
# 重启开发服务器
npm run dev
```

### Q2: 回复数不更新？
**原因：** SQL函数未执行
**解决：** 在Supabase SQL Editor重新执行上面的函数

### Q3: 实时更新不工作？
**原因：** Supabase Realtime未启用
**解决：**
1. Supabase Dashboard → Database → Replication
2. 启用 `bbs_posts` 和 `bbs_replies` 表的Realtime

### Q4: 页面样式错乱？
**原因：** Tailwind类名冲突或暗色模式问题
**解决：**
- 检查 `tailwind.config.ts`
- 确认 dark mode 已启用
- 清除浏览器缓存

---

## 📝 文件清单

```
新增文件：
├── src/lib/supabase/bbs-hooks.ts          # BBS React Hooks
├── src/app/(authenticated)/bbs/page.tsx   # 论坛列表
├── src/app/(authenticated)/bbs/new/page.tsx        # 发帖页面
├── src/app/(authenticated)/bbs/[id]/page.tsx       # 帖子详情
└── BBS_SETUP.md                            # 本文档

修改文件：
├── supabase_schema.sql                     # 添加辅助函数
└── src/app/(authenticated)/dashboard/page.tsx  # 更新BBS链接
```

---

**论坛功能已就绪！执行SQL后即可开始测试！** 🎉
