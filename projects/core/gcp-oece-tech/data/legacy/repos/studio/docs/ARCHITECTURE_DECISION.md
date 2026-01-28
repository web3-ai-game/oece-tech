# 架构方案对比与决策

## 用户规模：50人/3个月

## 方案1：纯Firebase（Spark免费层）❌
```
Firebase Auth + Firestore + Hosting
```

### 免费额度
- Auth: 无限用户 ✅
- Firestore: 50k读/20k写/天，1GB存储
- Hosting: 10GB带宽/月
- Functions: 125k调用/月

### 问题
- ⚠️ 50用户，假设每天活跃20人，每人浏览10篇文章 = 200次读取
- ⚠️ BBS论坛实时监听会消耗大量读取
- ⚠️ 开发阶段频繁刷新，很快超限
- ❌ Firestore计费复杂，容易超支

**结论**：开发阶段就会超限，不推荐


## 方案2：混合架构（Firebase Auth + Supabase + VPS）✅ 推荐
```
Firebase Auth（认证）
Supabase Postgres（数据库）
VPS（托管Next.js）
```

### 免费额度
- Firebase Auth: 无限用户 ✅
- Supabase:
  - Postgres: 500MB数据库
  - 50k行数据
  - 无限API请求
  - 2GB带宽/月
- VPS: 已有，50GB存储

### 优势
- ✅ Firebase Auth最稳定（Google登录、邮箱验证）
- ✅ 保留现有Firebase Auth代码
- ✅ Supabase数据库更慷慨（无读写次数限制）
- ✅ VPS已配置好，直接用
- ✅ 50用户绝对够用（500MB可存10万+文章）
- ✅ Supabase有RLS（行级安全），无需后端API
- ✅ 开发体验好（Supabase Studio可视化管理）

### 代码改动量
```diff
登录注册：保留Firebase Auth代码（0改动）✅
数据存储：Firestore → Supabase（小改动）
- doc(firestore, 'users', uid) 
+ supabase.from('users').select()

BBS论坛：Firestore实时监听 → Supabase Realtime
- onSnapshot(collection)
+ supabase.channel().on('postgres_changes')
```

### 成本
- Firebase Auth: $0
- Supabase: $0
- VPS: 已有

**结论**：最佳方案，成本0，开发体验好


## 方案3：完全Supabase（Supabase Auth + DB + VPS）⚠️
```
Supabase全套 + VPS托管
```

### 优势
- ✅ 一个平台管理所有
- ✅ Supabase Auth也很强（支持Google登录）
- ✅ 免费额度够用

### 劣势
- ❌ 需要重写所有Firebase Auth代码（大量工作）
- ❌ 失去Gemini写好的代码
- ⚠️ Supabase Auth功能稍弱于Firebase

**结论**：技术可行，但改动太大


## 方案4：Firebase + 自托管Postgres（VPS跑数据库）⚠️
```
Firebase Auth + VPS Postgres + VPS托管
```

### 问题
- ❌ VPS只有2GB RAM，跑Postgres + Next.js会紧张
- ❌ 需要维护数据库（备份、安全、更新）
- ❌ 没有Supabase的实时功能和管理界面

**结论**：不推荐，维护成本高


---

## ✅ 最终推荐：方案2（混合架构）

### 架构图
```
┌─────────────────────────────────────────┐
│         用户浏览器                      │
│  https://deepweay.me                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         VPS (188.166.180.96)             │
│  - Next.js SSG (端口3000)                │
│  - Nginx (反向代理 + SSL)                │
│  - PM2 (进程管理)                        │
└──┬─────────────────────────┬─────────────┘
   │                         │
   ▼                         ▼
┌─────────────────┐   ┌─────────────────────┐
│ Firebase Auth   │   │ Supabase Postgres   │
│ (认证服务)       │   │ (数据库)            │
│                 │   │                     │
│ - 邮箱登录      │   │ - users表           │
│ - Google登录    │   │ - invites表         │
│ - 邮箱验证      │   │ - articles表        │
│                 │   │ - bbs_posts表       │
│ $0/月           │   │ - payments表        │
│                 │   │                     │
│                 │   │ $0/月 (免费层)      │
└─────────────────┘   └─────────────────────┘
```

### 数据流
1. **登录**：用户 → VPS → Firebase Auth → 返回Token
2. **读数据**：用户 → VPS → Supabase API → 返回数据
3. **写数据**：用户 → VPS → Supabase API → 写入数据库
4. **实时更新**：Supabase Realtime → VPS WebSocket → 用户

### 为什么不全用Firebase？
- Firestore按读写次数计费，开发阶段会频繁刷新，容易超限
- Supabase无限API请求，只限带宽（2GB/月足够50人）
- Supabase有SQL界面，调试方便

### 为什么不全用Supabase？
- Firebase Auth更成熟稳定
- Google登录集成度更高
- 代码已写好，不用重写


---

## 实施步骤

### 第1步：保留Firebase Auth
```bash
# 配置Firebase项目
- 创建Firebase项目
- 启用Authentication (Email + Google)
- 复制配置到 .env.local
```

### 第2步：数据库迁移到Supabase
```sql
-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  role TEXT DEFAULT 'free',
  invites INTEGER DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建邀请码表
CREATE TABLE invites (
  code TEXT PRIMARY KEY,
  is_used BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP
);
```

### 第3步：修改代码
```typescript
// 登录：保持不变（Firebase Auth）
const user = await signInWithEmailAndPassword(auth, email, password);

// 存储：改用Supabase
// 旧代码：
// await setDoc(doc(firestore, 'users', uid), data);

// 新代码：
await supabase.from('users').insert(data);
```

### 第4步：测试部署
```bash
git push origin main
# GitHub Actions自动部署到VPS
# 访问 https://deepweay.me
```


---

## 成本对比（50用户/月）

| 方案 | Firebase | Supabase | VPS | 总成本 |
|------|----------|----------|-----|--------|
| 方案1 | $0 → $25+ | - | - | $25+ |
| **方案2** | **$0** | **$0** | **已有** | **$0** |
| 方案3 | - | $0 | 已有 | $0 |
| 方案4 | $0 | - | 已有 | $0 |

**说明**：
- 方案1超过免费层后，Firestore很容易到$25/月
- 方案2-4都是$0，但方案2改动最小


---

## 结论

**推荐方案2**，理由：
1. ✅ Firebase Auth代码保留（0改动）
2. ✅ Supabase数据库免费额度慷慨
3. ✅ VPS已配置好
4. ✅ 50用户绝对够用
5. ✅ 开发体验最好
6. ✅ 成本$0

**下一步**：
1. 配置Firebase Auth项目
2. 创建Supabase数据表
3. 修改Firestore调用为Supabase
4. 测试登录注册
5. 部署上线
