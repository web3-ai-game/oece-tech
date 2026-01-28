# 🔍 DeepWeay 项目诊断报告

**生成时间**: 2025-11-06  
**诊断范围**: 路由结构、登录注册流程、项目目录

---

## 📁 项目目录结构

```
src/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx                # 全局布局（translate="no"）
│   ├── page.tsx                  # 首页（Guest访问）
│   ├── login/                    # 登录/注册页面
│   │   └── page.tsx              # ✅ 邀请码注册 + 登录表单
│   ├── (authenticated)/          # 认证路由组（需登录）
│   │   ├── layout.tsx            # ✅ 侧边栏 + Header + Footer
│   │   ├── dashboard/            # 用户仪表盘
│   │   │   └── page.tsx          # ✅ 显示用户信息 + 邀请码
│   │   ├── articles/             # 文章列表
│   │   │   ├── page.tsx          # 文章列表
│   │   │   └── [slug]/           # 文章详情
│   │   ├── ai-tools/             # AI工具集合（PRO-only）
│   │   │   └── page.tsx          # ✅ 6个AI工具入口
│   │   ├── visa-assistant/       # 签证助手
│   │   ├── visa-comparison/      # 签证对比
│   │   ├── cost-of-living/       # 生活成本计算器
│   │   ├── planner/              # 行程规划器
│   │   └── bbs/                  # 论坛系统
│   │       ├── page.tsx          # 帖子列表
│   │       ├── new/              # 发布新帖
│   │       └── [id]/             # 帖子详情 + 回复
│   ├── api/                      # API路由
│   │   └── health/               # 健康检查
│   │       └── route.ts          # ✅ GET /api/health
│   ├── debug/                    # 调试页面
│   └── test-dashboard/           # 测试页面
├── lib/
│   ├── supabase/                 # Supabase集成
│   │   ├── client.ts             # Supabase客户端配置
│   │   ├── auth.ts               # ✅ 认证逻辑（登录/注册/登出）
│   │   ├── hooks.ts              # ✅ useUser hook
│   │   └── bbs-hooks.ts          # BBS数据hooks
│   ├── translations.ts           # 多语言翻译
│   └── utils.ts                  # 工具函数
├── components/
│   ├── ui/                       # shadcn/ui组件
│   └── common/                   # 公共组件
│       ├── header.tsx            # ✅ 导航栏 + 语言切换
│       └── footer.tsx            # ✅ 页脚
└── contexts/
    └── locale-context.tsx        # 语言上下文

```

---

## 🔐 认证流程诊断

### 1. **注册流程** (`signUpWithInvite`)

**位置**: `/src/lib/supabase/auth.ts`

**流程**:
```
用户填写表单
  ↓
验证邀请码（invites表）
  ↓
检查邀请码是否已使用
  ↓
Supabase Auth创建账号
  ↓
更新users表（display_name, role=free）
  ↓
标记邀请码为已使用
  ↓
触发Supabase trigger（自动生成2个邀请码）
  ↓
注册成功 → 跳转登录表单
```

**涉及数据表**:
- `auth.users` (Supabase内置)
- `public.users` (自定义profile)
- `public.invites` (邀请码管理)

**⚠️ 潜在问题**:
1. ❌ **错误**：`auth.ts` 第82-83行使用了`db.collection().doc().set()`
   ```typescript
   // 错误！这是Firebase语法，不是Supabase
   await db.collection('users').doc(user.id).set({...})
   ```
   **应改为**:
   ```typescript
   await supabase.from('users').upsert({
     id: user.id,
     email,
     display_name: username,
     role: 'free',
     invites_remaining: 2
   })
   ```

2. ⚠️ **Race Condition**: 邀请码并发使用时可能重复
   - **建议**: 在invites表添加unique constraint或使用数据库锁

### 2. **登录流程** (`signInWithPassword`)

**位置**: `/src/lib/supabase/auth.ts`

**流程**:
```
用户输入 email + password
  ↓
Supabase Auth验证
  ↓
成功 → 返回session
  ↓
自动跳转 /dashboard
```

**✅ 实现正确**：使用`supabase.auth.signInWithPassword()`

### 3. **用户状态管理** (`useUser`)

**位置**: `/src/lib/supabase/hooks.ts`

**功能**:
```typescript
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 1. 获取当前session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // 2. 从users表获取完整profile
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(data);
      }
      setLoading(false);
    };
    
    getUser();
    
    // 3. 监听auth状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading };
}
```

**✅ 实现良好**，但可以优化：
- 添加错误处理
- 考虑使用SWR或React Query缓存

---

## 🛣️ 路由结构诊断

### **公共路由**（无需登录）

| 路由 | 文件 | 状态 | 说明 |
|------|------|------|------|
| `/` | `app/page.tsx` | ✅ | 首页（6篇文章预览 + 6个AI工具teaser） |
| `/login` | `app/login/page.tsx` | ✅ | 登录/注册表单（含Header + Footer） |
| `/api/health` | `app/api/health/route.ts` | ✅ | 健康检查API |

### **认证路由**（需登录）

路由组: `(authenticated)` - 自动保护，未登录会重定向到 `/login`

| 路由 | 文件 | 状态 | 权限 | 说明 |
|------|------|------|------|------|
| `/dashboard` | `dashboard/page.tsx` | ✅ | Free+ | 用户信息 + 邀请码管理 |
| `/articles` | `articles/page.tsx` | ✅ | Free+ | 文章列表 |
| `/articles/[slug]` | `articles/[slug]/page.tsx` | ✅ | Free+ | 文章详情 |
| `/ai-tools` | `ai-tools/page.tsx` | ⚠️ | **PRO only** | AI工具集合（6个工具） |
| `/visa-assistant` | `visa-assistant/page.tsx` | ⚠️ | **PRO only** | 签证助手 |
| `/visa-comparison` | `visa-comparison/page.tsx` | ⚠️ | **PRO only** | 签证对比 |
| `/cost-of-living` | `cost-of-living/page.tsx` | ⚠️ | **PRO only** | 生活成本计算 |
| `/planner` | `planner/page.tsx` | ⚠️ | **PRO only** | 行程规划 |
| `/bbs` | `bbs/page.tsx` | ✅ | Free+ | 论坛帖子列表 |
| `/bbs/new` | `bbs/new/page.tsx` | ✅ | Free+ | 发布新帖 |
| `/bbs/[id]` | `bbs/[id]/page.tsx` | ✅ | Free+ | 帖子详情 + 回复 |

### **PRO权限检查逻辑**

**当前实现**: 在`(authenticated)/layout.tsx`中检查用户状态

**建议改进**: 创建中间件或HOC统一处理PRO权限
```typescript
// src/lib/supabase/middleware.ts
export function requireProMembership() {
  const { user } = useUser();
  const router = useRouter();
  
  if (user?.role !== 'pro') {
    router.push('/dashboard?upgrade=true');
  }
}
```

---

## 🐛 已发现问题汇总

### 🔴 Critical（必须修复）

1. **Firebase语法残留** (`auth.ts` Line 82-83)
   ```typescript
   // ❌ 错误
   await db.collection('users').doc(user.id).set({...})
   
   // ✅ 正确
   await supabase.from('users').upsert({
     id: user.id,
     email,
     display_name: username,
     role: 'free',
     invites_remaining: 2
   })
   ```

2. **环境变量未定义检查**
   - `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 需要在运行时验证

### 🟡 Warning（建议修复）

3. **邀请码并发问题**
   - 多个用户同时使用同一邀请码时可能出现竞态条件
   - **解决**: 添加数据库unique constraint + optimistic locking

4. **PRO权限检查分散**
   - AI工具页面应统一权限检查逻辑
   - **解决**: 创建`requirePro()`中间件

5. **错误处理不完善**
   - `useUser` hook缺少错误状态
   - **解决**: 添加`error`状态到返回值

### 🔵 Info（优化建议）

6. **性能优化**
   - `useUser` hook每次都查询数据库
   - **解决**: 使用SWR或React Query缓存

7. **TypeScript类型安全**
   - 部分地方使用`any`类型
   - **解决**: 定义完整的类型定义

---

## ✅ 推荐的修复顺序

### **Phase 1: 紧急修复**（今天）

1. ✅ 修复`auth.ts`中的Firebase语法错误
2. ✅ 添加环境变量验证
3. ✅ 测试注册/登录流程

### **Phase 2: 功能完善**（本周）

4. 实现PRO权限中间件
5. 完善错误处理
6. 添加邀请码unique constraint

### **Phase 3: 性能优化**（下周）

7. 集成SWR缓存
8. 优化TypeScript类型
9. 添加单元测试

---

## 🧪 测试清单

### **注册流程测试**

- [ ] 使用有效邀请码注册成功
- [ ] 使用无效邀请码注册失败
- [ ] 使用已使用的邀请码注册失败
- [ ] 注册后自动获得2个邀请码
- [ ] 用户信息正确写入users表

### **登录流程测试**

- [ ] 正确的email + password登录成功
- [ ] 错误的password登录失败
- [ ] 不存在的email登录失败
- [ ] 登录后跳转到 /dashboard
- [ ] Session持久化（刷新页面仍登录）

### **权限测试**

- [ ] Guest用户访问`/dashboard`重定向到`/login`
- [ ] Free用户可访问articles和BBS
- [ ] Free用户访问AI工具被阻止
- [ ] PRO用户可访问所有页面

### **路由测试**

- [ ] 所有公共路由正常访问
- [ ] 所有认证路由需要登录
- [ ] 动态路由`/articles/[slug]`正常工作
- [ ] 动态路由`/bbs/[id]`正常工作
- [ ] 404页面正常显示

---

## 📊 数据流图

```
┌─────────────┐
│  用户访问   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Next.js Router  │
└──────┬──────────┘
       │
       ├─── 公共路由 (/login, /) → 直接渲染
       │
       └─── 认证路由 (/dashboard, /ai-tools, etc)
               │
               ▼
       ┌───────────────────┐
       │ (authenticated)   │
       │ layout.tsx        │
       └─────┬─────────────┘
             │
             ▼
       ┌───────────────┐
       │  useUser()    │ ← 从Supabase获取用户信息
       └─────┬─────────┘
             │
             ├─── 已登录 → 渲染页面
             └─── 未登录 → router.push('/login')
```

---

## 🔗 关键文件清单

| 文件 | 作用 | 状态 |
|------|------|------|
| `src/lib/supabase/client.ts` | Supabase客户端配置 | ✅ 正常 |
| `src/lib/supabase/auth.ts` | 认证逻辑 | ❌ **有错误** |
| `src/lib/supabase/hooks.ts` | 用户状态hook | ✅ 正常 |
| `src/app/login/page.tsx` | 登录/注册页面 | ✅ 正常 |
| `src/app/(authenticated)/layout.tsx` | 认证路由布局 | ✅ 正常 |
| `src/app/(authenticated)/dashboard/page.tsx` | 用户仪表盘 | ✅ 正常 |
| `src/app/api/health/route.ts` | 健康检查API | ✅ 正常 |

---

**生成于**: 2025-11-06  
**下次更新**: 修复Critical问题后
