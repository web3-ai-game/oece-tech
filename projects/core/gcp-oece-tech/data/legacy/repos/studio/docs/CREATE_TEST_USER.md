# 创建测试账号指南

由于 Supabase 的安全限制，需要通过 Dashboard 手动创建测试账号。

## 方法1：通过 Supabase Dashboard（推荐）

### 步骤1：打开 Supabase Dashboard

```
https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt/auth/users
```

### 步骤2：创建新用户

1. 点击右上角 **"Add user"** → **"Create new user"**

2. 填写信息：
   ```
   Email: 123@123.com
   Password: 123123
   ✅ Auto Confirm User (重要！勾选此项跳过邮箱验证)
   ```

3. **User Metadata (JSON)** 填写：
   ```json
   {
     "display_name": "测试账号"
   }
   ```

4. 点击 **"Create user"**

### 步骤3：分配邀请码

创建用户后，系统会自动：
- ✅ 在 `public.users` 表创建资料
- ✅ 设置 `invites_remaining = 2`
- ✅ 创建 2 个邀请码

如果没有自动创建，执行以下SQL：

```sql
-- 获取用户ID
SELECT id FROM auth.users WHERE email = '123@123.com';

-- 手动分配邀请码（替换 <USER_ID>）
UPDATE public.invites
SET created_by = '<USER_ID>'
WHERE code IN ('TEST123A', 'TEST123B');
```

### 步骤4：验证

在 SQL Editor 执行：

```sql
-- 检查用户
SELECT * FROM public.users WHERE email = '123@123.com';

-- 检查邀请码
SELECT * FROM public.invites WHERE created_by = (
  SELECT id FROM public.users WHERE email = '123@123.com'
);
```

---

## 方法2：本地注册（需要邀请码）

### 步骤1：访问注册页

```
http://localhost:3000/login
```

### 步骤2：点击 "CREATE_ACCOUNT"

### 步骤3：填写信息

```
Username: 测试账号
Email: 123@123.com
Password: 123123
Invite Code: WELCOME2024
```

（使用已有的初始邀请码）

### 步骤4：登录

注册成功后：
1. 自动切换到登录表单
2. 输入邮箱和密码
3. 点击 "SIGN_IN"
4. 自动跳转到 Dashboard

---

## 已创建的邀请码

以下邀请码已准备好（未分配给任何用户）：

```
TEST123A - 未使用
TEST123B - 未使用
WELCOME2024 - 未使用
NOMAD2024 - 未使用
COMPASS2024 - 未使用
TEST2024 - 未使用
```

---

## 测试登录

### 登录凭据

```
Email: 123@123.com
Password: 123123
```

### 登录 URL

```
http://localhost:3000/login
```

### 预期结果

1. ✅ 成功登录
2. ✅ 跳转到 Dashboard
3. ✅ 显示用户名：测试账号
4. ✅ 剩余邀请码：2
5. ✅ 可以访问 BBS 论坛

---

## 常见问题

### Q1: 创建用户后无法登录？
**原因：** 未勾选 "Auto Confirm User"
**解决：**
1. Supabase Dashboard → Authentication → Users
2. 找到 123@123.com
3. 点击右侧 "..." → "Confirm email"

### Q2: Dashboard 显示剩余邀请码为 0？
**原因：** 触发器未执行或数据不同步
**解决：**
```sql
UPDATE public.users
SET invites_remaining = 2
WHERE email = '123@123.com';
```

### Q3: 无法生成新邀请码？
**原因：** `invites_remaining` 为 0
**解决：** 执行上面的 SQL 重置为 2

### Q4: 使用邀请码注册后，邀请码仍显示未使用？
**原因：** 注册逻辑问题
**解决：** 检查 `/src/lib/supabase/auth.ts` 中的 `signUpWithInvite` 函数

---

## 快速命令

### 检查用户状态
```sql
SELECT 
  u.id,
  u.email,
  u.display_name,
  u.role,
  u.invites_remaining,
  u.created_at
FROM public.users u
WHERE u.email = '123@123.com';
```

### 查看用户的邀请码
```sql
SELECT 
  code,
  is_used,
  created_at,
  used_at
FROM public.invites
WHERE created_by = (
  SELECT id FROM public.users WHERE email = '123@123.com'
);
```

### 重置邀请码额度
```sql
UPDATE public.users
SET invites_remaining = 2
WHERE email = '123@123.com';
```

### 清除测试数据
```sql
-- 删除用户（会级联删除相关数据）
DELETE FROM auth.users WHERE email = '123@123.com';
```

---

## 推荐：使用 Supabase Dashboard 创建

**优势：**
- ✅ 简单快速（1分钟完成）
- ✅ 自动触发器执行
- ✅ 可视化界面
- ✅ 自动邮箱确认

**步骤总结：**
1. 打开 https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt/auth/users
2. Add user → Create new user
3. Email: 123@123.com, Password: 123123
4. ✅ Auto Confirm User
5. User Metadata: {"display_name": "测试账号"}
6. Create user
7. Done! 🎉

---

**完成后即可使用 123@123.com / 123123 登录测试！**
