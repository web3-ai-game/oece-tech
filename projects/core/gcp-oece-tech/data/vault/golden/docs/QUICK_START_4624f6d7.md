# 🚀 Urban Diver 快速启动指南

## ✅ 已完成的功能

### 核心功能
- ✅ Supabase 认证系统（邀请码注册）
- ✅ 用户 Dashboard（个人资料、邀请码管理）
- ✅ BBS 论坛（发帖、回复、删除）
- ✅ 英文优先界面（禁止 Google 翻译）
- ✅ Cyberpunk 暗黑风格
- ✅ 移动端响应式设计

### 技术栈
- Next.js 15.5+ (App Router + Turbopack)
- React 19 (Server Components)
- Supabase (Auth + Database + Realtime)
- TailwindCSS + shadcn/ui
- TypeScript (strict mode)

---

## 🔧 创建测试账号

### 方法1：Supabase Dashboard（推荐 - 1分钟）

1. **打开链接：**
   ```
   https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt/auth/users
   ```

2. **创建用户：**
   - 点击 "Add user" → "Create new user"
   - Email: `123@123.com`
   - Password: `123123`
   - ✅ **勾选 "Auto Confirm User"** (跳过邮箱验证)
   - User Metadata (JSON): 
     ```json
     {"display_name": "测试账号"}
     ```
   - 点击 "Create user"

3. **完成！** 系统会自动：
   - 创建 `public.users` 资料
   - 分配 2 个邀请码额度
   - 可立即登录使用

### 方法2：本地注册（需要邀请码）

1. 访问：http://localhost:3000/login
2. 点击 "CREATE_ACCOUNT"
3. 填写信息：
   - Username: `测试用户`
   - Email: `test@test.com`
   - Password: `123456`
   - Invite Code: `WELCOME2024`
4. 注册成功后登录

### 可用的初始邀请码

```
WELCOME2024  - 欢迎码
NOMAD2024    - 数字游民码
COMPASS2024  - 指南针码
TEST2024     - 测试码
TEST123A     - 测试A
TEST123B     - 测试B
```

---

## 🧪 测试流程

### 1. 登录测试

```
URL: http://localhost:3000/login
Email: 123@123.com
Password: 123123
```

**预期结果：**
- ✅ Toast 提示："Sign in successful"
- ✅ 自动跳转到 Dashboard
- ✅ 显示用户信息和邀请码

### 2. Dashboard 测试

访问：http://localhost:3000/dashboard

**检查项：**
- [ ] 用户名显示正确
- [ ] 会员等级：FREE
- [ ] 剩余邀请码：2
- [ ] 站点简介卡片显示
- [ ] 生成邀请码按钮可用
- [ ] 退出登录按钮工作

### 3. BBS 论坛测试

访问：http://localhost:3000/bbs

**测试步骤：**
1. 点击 "NEW_POST" 按钮
2. 填写标题和内容
3. 点击 "PUBLISH" 发布
4. 查看帖子详情
5. 添加回复
6. 测试删除功能

**检查项：**
- [ ] 论坛列表正常显示
- [ ] 发帖功能正常
- [ ] 回复功能正常
- [ ] 浏览数和回复数统计正确
- [ ] 删除权限控制正确（只能删除自己的内容）

### 4. UI/UX 测试

**Cyberpunk 风格：**
- [ ] 暗黑主题
- [ ] 青色/紫色霓虹
- [ ] font-mono 技术元素
- [ ] font-headline 标题
- [ ] 卡片式布局

**响应式：**
- [ ] 手机端 (375px) ✓
- [ ] 平板端 (768px) ✓
- [ ] 桌面端 (1920px) ✓

**语言：**
- [ ] 英文为默认语言
- [ ] 可切换繁体中文
- [ ] Google 翻译已禁用

---

## 📊 Supabase 数据检查

### 检查用户资料

```sql
SELECT * FROM public.users WHERE email = '123@123.com';
```

### 检查邀请码

```sql
SELECT 
  code,
  is_used,
  created_by,
  created_at
FROM public.invites
WHERE created_by = (SELECT id FROM public.users WHERE email = '123@123.com')
   OR code IN ('TEST123A', 'TEST123B');
```

### 检查 BBS 帖子

```sql
SELECT 
  p.*,
  u.display_name as author_name
FROM public.bbs_posts p
LEFT JOIN public.users u ON p.author_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;
```

---

## 🛠️ Windsurf MCP 工具

### 已安装的 MCP 服务器

```
✅ filesystem (14 tools)      - 文件操作
✅ memory (9 tools)            - 知识管理  
⚪ notion-mcp-server (0 tools) - 未使用
✅ puppeteer (7 tools)         - 浏览器自动化
✅ sequential-thinking (1 tool)- 复杂问题思考
✅ supabase-mcp-server (29 tools) - 数据库操作
```

### Supabase MCP 常用命令

```typescript
// 列出项目
mcp6_list_projects()

// 执行 SQL
mcp6_execute_sql({
  project_id: 'qhgdymgxcbyhtxezvoqt',
  query: 'SELECT * FROM public.users LIMIT 5;'
})

// 列出表
mcp6_list_tables({
  project_id: 'qhgdymgxcbyhtxezvoqt',
  schemas: ['public']
})

// 应用迁移
mcp6_apply_migration({
  project_id: 'qhgdymgxcbyhtxezvoqt',
  name: 'add_new_field',
  query: 'ALTER TABLE ...'
})
```

### 规则更新

已在 `WINDSURF_RULES.md` 添加：

```
16. MCP Tools Usage: Frequently use available MCP tools;
    - filesystem MCP for file operations
    - supabase-mcp-server for database operations
    - puppeteer MCP for browser automation
    - sequential-thinking for complex problems
    - Always prefer MCP tools over manual operations
```

---

## 🐛 常见问题

### Q: 无法登录测试账号？

**检查清单：**
1. 是否在 Supabase Dashboard 创建了用户？
2. 是否勾选了 "Auto Confirm User"？
3. 密码是否正确：`123123`

**解决方法：**
- Supabase Dashboard → Authentication → Users
- 找到 `123@123.com`
- 点击 "..." → "Confirm email"

### Q: Dashboard 显示剩余邀请码为 0？

**原因：** 触发器未执行

**解决：**
```sql
UPDATE public.users
SET invites_remaining = 2
WHERE email = '123@123.com';
```

### Q: BBS 论坛功能不工作？

**检查：**
1. 是否执行了 `supabase_schema.sql` 中的 BBS 辅助函数？
2. 是否启用了 Realtime？

**解决：**
```sql
-- 执行这些函数
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID) ...
CREATE OR REPLACE FUNCTION increment_reply_count(post_id UUID) ...
CREATE OR REPLACE FUNCTION decrement_reply_count(post_id UUID) ...
```

### Q: 实时更新不工作？

**解决：**
1. Supabase Dashboard → Database → Replication
2. 启用 `bbs_posts` 和 `bbs_replies` 表的 Realtime

---

## 📁 项目文件结构

```
/Users/svs.loline/Documents/Git/studio/
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   ├── dashboard/page.tsx    # 用户面板
│   │   │   └── bbs/
│   │   │       ├── page.tsx          # 论坛列表
│   │   │       ├── new/page.tsx      # 发帖页面
│   │   │       └── [id]/page.tsx     # 帖子详情
│   │   ├── login/page.tsx            # 登录注册
│   │   └── layout.tsx                # 全局布局
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts             # Supabase 客户端
│   │       ├── auth.ts               # 认证函数
│   │       ├── hooks.ts              # 用户 Hooks
│   │       └── bbs-hooks.ts          # BBS Hooks
│   └── components/
│       ├── common/                   # 通用组件
│       └── ui/                       # shadcn/ui 组件
├── supabase_schema.sql               # 数据库结构
├── .env.local                        # 环境变量
├── WINDSURF_RULES.md                 # Windsurf 规则
├── BBS_SETUP.md                      # BBS 设置指南
├── CREATE_TEST_USER.md               # 测试账号指南
├── TESTING_GUIDE.md                  # 测试指南
└── QUICK_START.md                    # 本文档
```

---

## 🎯 下一步开发

### 短期任务
- [ ] 测试并修复注册流程问题
- [ ] BBS 富文本编辑器
- [ ] 搜索功能
- [ ] 用户资料页

### 中期任务
- [ ] PRO 会员 Stripe 支付
- [ ] 文章管理系统
- [ ] AI 工具集成
- [ ] Telegram Bot

### 长期任务
- [ ] 管理员后台
- [ ] 内容审核系统
- [ ] 积分和徽章系统
- [ ] 数据分析面板

---

## 📞 快速命令

### 开发服务器

```bash
npm run dev              # 启动开发服务器 :3000
npm run build            # 生产构建
npm run genkit:dev       # Genkit AI 开发模式
```

### 测试脚本

```bash
node test-supabase.js    # 测试 Supabase 连接
node create-test-user.js # 创建测试用户（已弃用）
```

### Git 操作

```bash
git add .
git commit -m "feat: add BBS forum feature"
git push origin main     # 自动部署到 VPS
```

---

**准备就绪！开始测试吧！** 🚀

有问题随时查看各个文档：
- `CREATE_TEST_USER.md` - 测试账号创建
- `BBS_SETUP.md` - BBS 论坛设置
- `TESTING_GUIDE.md` - 完整测试流程
- `WINDSURF_RULES.md` - 开发规范
