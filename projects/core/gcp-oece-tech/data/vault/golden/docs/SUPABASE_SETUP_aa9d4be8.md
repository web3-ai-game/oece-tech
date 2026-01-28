# Supabase 数据库设置指南

## 第1步：执行SQL Schema

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`qhgdymgxcbyhtxezvoqt`
3. 进入 **SQL Editor**
4. 复制 `supabase_schema.sql` 全部内容
5. 粘贴并点击 **Run** 执行

执行完成后会创建：
- ✅ 6个数据表（users, invites, articles, bbs_posts, bbs_replies, subscriptions）
- ✅ RLS安全策略
- ✅ 自动触发器（新用户自动生成2个邀请码）
- ✅ 4个测试邀请码（WELCOME2024, NOMAD2024, COMPASS2024, TEST2024）

---

## 第2步：创建测试账号

### 方法1：Supabase Dashboard（推荐）

1. 进入 **Authentication** → **Users**
2. 点击 **Add user** → **Create new user**
3. 填写信息：
   ```
   Email: 123@123.com
   Password: 123123
   ✅ Auto Confirm User (跳过邮箱验证)
   ```
4. 展开 **User Metadata**，添加：
   ```json
   {
     "display_name": "测试账号"
   }
   ```
5. 点击 **Create user**

### 方法2：使用现有邀请码注册

直接在登录页面使用以下邀请码注册：
- `WELCOME2024`
- `NOMAD2024`
- `COMPASS2024`
- `TEST2024`

---

## 第3步：验证数据库

在SQL Editor执行以下查询，检查数据：

```sql
-- 查看所有邀请码
SELECT * FROM public.invites;

-- 查看所有用户
SELECT * FROM public.users;

-- 查看测试账号的邀请码
SELECT i.* 
FROM public.invites i
JOIN public.users u ON i.created_by = u.id
WHERE u.email = '123@123.com';
```

---

## 第4步：配置Auth设置

1. 进入 **Authentication** → **Settings**
2. **Email Auth** 设置：
   - ✅ Enable Email Signup
   - ❌ Disable Email Confirmations（测试环境可关闭）
3. **Security** 设置：
   - Site URL: `http://localhost:3000` (本地)
   - Redirect URLs: 添加 `http://localhost:3000/**`

---

## 邀请码机制说明

### 每个用户的邀请码额度

- 新注册用户：**2个邀请码**
- PRO会员：**额外赠送邀请码**（待实现）

### 如何使用

1. **注册时验证**：用户必须输入有效邀请码才能注册
2. **自动生成**：注册成功后，系统自动生成2个新邀请码给该用户
3. **查看邀请码**：用户在Dashboard可以看到自己的邀请码
4. **分享邀请**：用户可以分享邀请码给朋友

### 初始邀请码（可直接使用）

```
WELCOME2024  - 欢迎码
NOMAD2024    - 数字游民码
COMPASS2024  - 指南针码
TEST2024     - 测试码
```

---

## 常见问题

### Q1: 执行SQL报错 "permission denied"
**A**: 确保在Supabase Dashboard的SQL Editor执行，不要在外部客户端执行。

### Q2: 注册时提示"邀请码无效"
**A**: 检查：
1. 邀请码是否已被使用（`SELECT * FROM invites WHERE code='XXX'`）
2. 大小写是否正确（系统会自动转大写）
3. 数据库是否成功创建invites表

### Q3: 注册成功但没有生成邀请码
**A**: 检查触发器是否执行：
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Q4: 测试账号登录失败
**A**: 
1. 确保在Dashboard创建用户时勾选了 "Auto Confirm User"
2. 或者在SQL中更新：
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '123@123.com';
```

---

## 本地测试流程

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问登录页：http://localhost:3000/login

3. 测试登录：
   - Email: `123@123.com`
   - Password: `123123`

4. 测试注册：
   - 用户名：随意
   - 邮箱：随意
   - 密码：至少6位
   - 邀请码：`WELCOME2024`

5. 登录成功后跳转：http://localhost:3000/dashboard

---

## 数据表关系

```
auth.users (Supabase内置)
    ↓ (触发器)
public.users (用户资料)
    ↓
public.invites (邀请码) ← created_by
    ↓
public.articles (文章) ← author_id
public.bbs_posts (论坛帖子) ← author_id
public.subscriptions (订阅) ← user_id
```

---

## 下一步开发

- [ ] Dashboard页面（显示用户信息+邀请码）
- [ ] 文章列表（限制访问权限）
- [ ] BBS论坛功能
- [ ] PRO会员订阅（Stripe集成）
- [ ] 邀请码管理界面
