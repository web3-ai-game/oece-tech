# 🐛 Debug Guide - 登录循环问题排查

## 问题描述

登录后跳转到 `/dashboard` 一直显示加载动画（转圈），页面无法正常显示。

## 已添加的调试工具

### 1. 调试页面

访问：http://localhost:3000/debug

**功能：**
- 查看完整的认证状态
- 查看用户资料（public.users）
- 测试登录/登出
- 查看环境变量配置

### 2. Console 日志

已在以下页面添加调试日志：
- `/dashboard` - Dashboard 页面
- `/bbs` - BBS 论坛列表
- `/lib/supabase/hooks.ts` - 认证 Hooks

**打开浏览器控制台（F12）查看：**
```
Dashboard render: { authLoading: true/false, user: true/false, profileLoading: true/false, profile: true/false }
```

## 排查步骤

### Step 1: 访问调试页面

```
http://localhost:3000/debug
```

**检查项：**
- [ ] Auth State 是否正确
- [ ] Session 是否存在
- [ ] User 对象是否完整
- [ ] Profile 是否存在

### Step 2: 测试登录

在调试页面点击 "Test Login"

**预期结果：**
- ✅ Login successful
- ✅ Auth State 显示用户信息
- ✅ User Profile 显示资料

**如果失败，检查：**
1. Supabase URL 是否正确
2. Anon Key 是否正确
3. 用户是否在数据库中

### Step 3: 检查浏览器控制台

1. 打开 http://localhost:3000/login
2. 打开浏览器控制台（F12）
3. 登录账号
4. 观察日志输出

**正常流程：**
```
Dashboard render: { authLoading: true, user: false, ... }
Dashboard render: { authLoading: false, user: true, ... }
Dashboard render: { authLoading: false, user: true, profileLoading: false, profile: true }
```

**异常情况：**

**情况A: authLoading 一直为 true**
```
Dashboard render: { authLoading: true, ... }
Dashboard render: { authLoading: true, ... }
```
→ 原因：`supabase.auth.getUser()` 调用失败
→ 解决：检查网络、Supabase配置

**情况B: user 为 false**
```
Dashboard render: { authLoading: false, user: false, ... }
No user, redirecting to login
```
→ 原因：认证失败或 session 丢失
→ 解决：检查登录逻辑、cookies

**情况C: profileLoading 一直为 true**
```
Dashboard render: { authLoading: false, user: true, profileLoading: true, ... }
```
→ 原因：`public.users` 表查询失败
→ 解决：检查 RLS 策略、用户资料是否存在

### Step 4: 验证数据库

使用 Supabase MCP 或 TablePlus：

```sql
-- 检查用户
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = '123@123.com';

-- 检查资料
SELECT * FROM public.users 
WHERE email = '123@123.com';

-- 检查 RLS 策略
SELECT * FROM pg_policies 
WHERE tablename = 'users';
```

## 可能的原因和解决方案

### 原因1: Supabase 配置错误

**症状：** authLoading 一直为 true

**检查：**
```bash
# 查看环境变量
cat .env.local | grep SUPABASE
```

**解决：**
```bash
# 确保正确配置
NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...（完整密钥）
```

### 原因2: public.users 资料不存在

**症状：** profile 为 null

**检查：**
```sql
SELECT COUNT(*) FROM public.users WHERE email = '123@123.com';
```

**解决：**
```sql
-- 手动创建资料
INSERT INTO public.users (id, email, display_name, role, invites_remaining)
SELECT 
  id,
  email,
  '测试账号',
  'free',
  2
FROM auth.users
WHERE email = '123@123.com';
```

### 原因3: RLS 策略阻止查询

**症状：** profileError 有错误信息

**检查：**
```sql
-- 测试 RLS
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub":"6b21b638-44aa-4865-8e69-93ecfb4e3955"}';
SELECT * FROM public.users WHERE id = '6b21b638-44aa-4865-8e69-93ecfb4e3955';
```

**解决：**
```sql
-- 确保有正确的 RLS 策略
CREATE POLICY "用户可以查看所有用户基本信息" ON public.users
  FOR SELECT USING (true);
```

### 原因4: CORS 或网络问题

**症状：** 控制台有网络错误

**解决：**
1. 检查 Supabase 项目是否正常运行
2. 检查本地网络连接
3. 尝试禁用浏览器扩展（VPN、广告拦截）

### 原因5: useEffect 依赖问题

**症状：** Hook 反复调用

**已修复：**
- ✅ 添加错误处理和 catch
- ✅ 分离 authLoading 和 profileLoading
- ✅ 添加调试日志

## 快速修复命令

### 重启开发服务器
```bash
# 停止当前服务器
Ctrl+C

# 清除缓存并重启
rm -rf .next
npm run dev
```

### 清除浏览器数据
1. 打开控制台（F12）
2. Application → Storage → Clear site data
3. 刷新页面

### 验证 Supabase 连接
```bash
node test-supabase.js
```

## 成功标志

**Dashboard 正常加载：**
- ✅ 显示用户名
- ✅ 显示邀请码列表
- ✅ 可以生成新邀请码
- ✅ 控制台无错误

**Console 日志：**
```
Dashboard render: { authLoading: false, user: true, profileLoading: false, profile: true }
```

## 如果问题仍然存在

1. **截图控制台错误**
   - F12 → Console 标签
   - 截图所有红色错误

2. **截图调试页面**
   - 访问 `/debug`
   - 截图 Auth State 和 User Profile

3. **提供信息：**
   - 浏览器版本
   - 是否使用 VPN
   - 网络环境（公司/家庭）

---

**开始排查：访问 http://localhost:3000/debug** 🔍
