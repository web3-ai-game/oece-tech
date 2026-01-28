# 🔧 登录循环问题修复 - 测试指南

## ✅ 已完成的修复

### 1. 优化 useUser Hook
- ✅ 添加错误处理
- ✅ 添加 console 日志
- ✅ 确保 loading 状态正确

### 2. 修复 Dashboard 重定向逻辑
- ✅ 使用 `useEffect` 延迟判断（500ms）
- ✅ 使用 `router.replace` 代替 `router.push`
- ✅ 避免立即重定向导致的循环

### 3. 添加调试工具
- ✅ `/debug` 页面查看认证状态
- ✅ Dashboard 添加详细日志
- ✅ BBS 添加调试日志

---

## 🧪 测试步骤

### Step 1: 重启开发服务器

```bash
# Terminal (Ctrl+C 停止当前服务器)
cd /Users/svs.loline/Documents/Git/studio
rm -rf .next
npm run dev
```

**等待服务器启动：**
```
Ready on http://localhost:3000
```

### Step 2: 清除浏览器数据

**Safari:**
1. 菜单 → Develop → Empty Caches
2. 或按 Option+Command+E

**Chrome:**
1. F12 → Application → Storage
2. Clear site data
3. 刷新页面

### Step 3: 测试登录流程

**A. 访问调试页面**
```
http://localhost:3000/debug
```

**B. 点击 "Test Login (123@123.com)"**

**预期结果：**
- ✅ 弹出 "Login successful!"
- ✅ Auth State 显示 user 信息
- ✅ User Profile 显示资料

**C. 如果登录成功，访问 Dashboard**
```
http://localhost:3000/dashboard
```

**预期结果：**
- ✅ 显示用户名：测试账号
- ✅ 显示邀请码列表
- ✅ 不再无限转圈

### Step 4: 手动登录测试

**A. 访问登录页**
```
http://localhost:3000/login
```

**B. 打开浏览器控制台（F12）**

**C. 登录**
```
Email: 123@123.com
Password: 123123
```

**D. 观察控制台日志**

**正常流程：**
```
Dashboard render: { authLoading: true, user: false, ... }
Dashboard render: { authLoading: false, user: true, ... }
Dashboard render: { authLoading: false, user: true, profileLoading: false, profile: true }
```

**E. 检查页面**
- ✅ 成功显示 Dashboard
- ✅ 显示用户信息
- ✅ 无无限转圈

---

## 🐛 如果问题仍然存在

### 情况A: 调试页面登录失败

**症状：**
- 点击 "Test Login" 显示错误
- Auth State 仍然显示 null

**解决：**
```bash
# 检查数据库
node test-supabase.js
```

如果连接失败，检查 `.env.local`:
```bash
cat .env.local | grep SUPABASE
```

### 情况B: 登录后仍然转圈

**症状：**
- 登录成功
- Dashboard 一直显示 loading
- 控制台显示 `authLoading: true` 不变

**检查：**
1. 打开控制台（F12）
2. 查看是否有错误（红色）
3. 查看 Network 标签，检查请求是否失败

**可能原因：**
- Supabase API 请求失败
- 网络问题
- CORS 问题

**解决：**
```bash
# 清除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 情况C: 登录后立即跳回登录页

**症状：**
- 登录成功
- 跳转到 Dashboard
- 立即跳回 /login

**检查控制台：**
```
No user detected, will redirect to login in 500ms
Redirecting to login...
```

**原因：** session 没有正确保存

**解决：**
1. 检查浏览器是否禁用了 cookies
2. 清除浏览器数据
3. 尝试无痕模式

### 情况D: Profile 加载失败

**症状：**
- 用户已登录
- `profileLoading: true` 不变

**检查：**
```sql
-- 使用 TablePlus 或 Supabase Dashboard
SELECT * FROM public.users WHERE email = '123@123.com';
```

如果没有记录：
```sql
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

---

## 📊 成功的标志

### 调试页面

**Auth State:**
```json
{
  "session": { "access_token": "..." },
  "user": {
    "id": "6b21b638-...",
    "email": "123@123.com"
  }
}
```

**User Profile:**
```json
{
  "profile": {
    "id": "6b21b638-...",
    "email": "123@123.com",
    "display_name": "测试账号",
    "role": "free",
    "invites_remaining": 2
  }
}
```

### Dashboard 页面

- ✅ 显示欢迎信息
- ✅ 显示用户名
- ✅ 显示邀请码列表（2个）
- ✅ 可以生成新邀请码
- ✅ 退出登录按钮工作

### 控制台日志

```
Dashboard render: {
  authLoading: false,
  user: true,
  profileLoading: false,
  profile: true
}
```

---

## 🎯 快速验证命令

### 重启并测试（一键命令）

```bash
# 停止服务器（Ctrl+C），然后执行：
rm -rf .next && npm run dev

# 然后在浏览器：
# 1. 清除缓存
# 2. 访问 http://localhost:3000/debug
# 3. 点击 "Test Login"
# 4. 访问 http://localhost:3000/dashboard
```

### 验证数据库（使用 MCP）

在 Windsurf Cascade 执行：
```typescript
mcp6_execute_sql({
  project_id: 'qhgdymgxcbyhtxezvoqt',
  query: `
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
  `
})
```

---

## 📝 关键修改总结

### 修改文件：

1. **src/lib/supabase/hooks.ts**
   - 添加错误处理和日志

2. **src/app/(authenticated)/dashboard/page.tsx**
   - 使用 `useEffect` 延迟判断
   - 使用 `router.replace` 避免历史记录堆积
   - 500ms 延迟给 auth 状态加载时间

3. **src/app/debug/page.tsx**
   - 新增调试页面

### 修复原理：

**问题：**
```
登录 → Dashboard → 检测无user → 立即跳回login → 循环
```

**修复后：**
```
登录 → Dashboard → 等待500ms → 检测user → 正常显示
```

---

**开始测试！按照 Step 1-4 执行** 🚀
