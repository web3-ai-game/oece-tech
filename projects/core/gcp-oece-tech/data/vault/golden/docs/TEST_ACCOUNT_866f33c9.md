# ✅ 测试账号创建成功！

## 登录信息

```
Email: 123@123.com
Password: 123123
```

## 账号详情

- **User ID**: `6b21b638-44aa-4865-8e69-93ecfb4e3955`
- **用户名**: 测试账号
- **会员等级**: FREE
- **剩余邀请码**: 2

## 已生成的邀请码

```
F1950290  - 未使用
38F0BF52  - 未使用
```

## 测试步骤

### 1. 登录测试

访问：http://localhost:3000/login

输入：
- Email: `123@123.com`
- Password: `123123`
- 点击 "SIGN_IN"

**预期结果：**
- ✅ 成功登录
- ✅ 跳转到 Dashboard
- ✅ 显示用户名：测试账号
- ✅ 显示邀请码：2个

### 2. Dashboard 测试

访问：http://localhost:3000/dashboard

**检查项：**
- [ ] 用户信息卡片显示正确
- [ ] 站点简介卡片显示
- [ ] 邀请码列表：F1950290, 38F0BF52
- [ ] 可以生成新邀请码
- [ ] 可以复制邀请码
- [ ] 退出登录按钮工作

### 3. BBS 论坛测试

访问：http://localhost:3000/bbs

**测试步骤：**
1. 点击 "NEW_POST"
2. 标题：Test Post from 123@123.com
3. 内容：This is a test post to verify the BBS forum functionality.
4. 点击 "PUBLISH"
5. 查看帖子详情
6. 添加回复
7. 测试删除功能

### 4. 邀请码测试

使用生成的邀请码注册新用户：

1. 退出登录
2. 访问注册页
3. 使用邀请码：`F1950290`
4. 注册新账号：
   - Username: Test User 2
   - Email: test2@test.com
   - Password: 123456
   - Invite Code: F1950290
5. 验证邀请码状态变为"已使用"

---

## 数据库验证

### 查看用户信息

```sql
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  pu.display_name,
  pu.role,
  pu.invites_remaining
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = '123@123.com';
```

### 查看邀请码

```sql
SELECT 
  code,
  is_used,
  used_by,
  created_at,
  used_at
FROM public.invites
WHERE created_by = '6b21b638-44aa-4865-8e69-93ecfb4e3955';
```

### 查看BBS帖子

```sql
SELECT 
  p.*,
  u.display_name as author_name
FROM public.bbs_posts p
LEFT JOIN public.users u ON p.author_id = u.id
WHERE p.author_id = '6b21b638-44aa-4865-8e69-93ecfb4e3955';
```

---

## 故障排查

### 无法登录？

**检查清单：**
1. 邮箱是否正确：`123@123.com`
2. 密码是否正确：`123123`
3. 用户是否已确认邮箱

**SQL验证：**
```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = '123@123.com';
```

如果 `email_confirmed_at` 为 NULL：
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = '123@123.com';
```

### 邀请码无法使用？

**检查邀请码状态：**
```sql
SELECT code, is_used, created_by
FROM public.invites
WHERE code IN ('F1950290', '38F0BF52');
```

### Dashboard 不显示邀请码？

**检查 public.users：**
```sql
SELECT * FROM public.users WHERE email = '123@123.com';
```

如果 `invites_remaining` 为 0：
```sql
UPDATE public.users 
SET invites_remaining = 2 
WHERE email = '123@123.com';
```

---

## 重要说明

1. ✅ **Bug已修复**：`generate_invite_code()` 函数的歧义问题已解决
2. ✅ **触发器正常**：新用户自动创建资料和邀请码
3. ✅ **可以立即登录**：邮箱已自动确认
4. ⚠️ **Identity记录**：有小问题但不影响登录（已修复）

---

## 下一步

**立即测试：**
1. 访问 http://localhost:3000/login
2. 使用 `123@123.com` / `123123` 登录
3. 体验 Dashboard 和 BBS 功能
4. 使用邀请码注册第二个测试账号

**开发继续：**
- [ ] 测试所有功能
- [ ] 修复发现的问题
- [ ] 准备部署到VPS

---

**测试账号已就绪！开始测试吧！** 🚀
