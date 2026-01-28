# 💬 GeekSEA 轻量级论坛系统设计

## 🎯 核心需求

1. **注册机制**: 邀请码 OR 看广告获得注册权
2. **个人面板**: 简洁，必须有积分抵扣功能
3. **管理面板**: 总管理后台（你专用）
4. **匿名发帖**: 全匿名支持
5. **优化编辑器**: 完美的写作体验
6. **轻量部署**: 2GB Ubuntu 可运行

---

## 🏗️ 技术选型

### 方案对比

| 论坛方案 | 内存占用 | 优点 | 缺点 | 推荐度 |
|---------|---------|------|------|--------|
| **Flarum** | 256MB+ | 极简、现代、API友好 | PHP依赖 | ⭐⭐⭐⭐⭐ |
| Discourse | 2GB+ | 功能强大 | 太重 | ⭐⭐ |
| NodeBB | 512MB+ | Node.js、实时 | 较复杂 | ⭐⭐⭐⭐ |
| 自建Next.js | 200MB+ | 完全可控 | 需要开发 | ⭐⭐⭐⭐ |

### 🏆 推荐方案：Flarum + 自定义扩展

**为什么选 Flarum？**
- ✅ 轻量级：256MB 内存足够
- ✅ 现代化：响应式设计、移动友好
- ✅ API 友好：可以与主站集成
- ✅ 扩展丰富：匿名发帖、邀请码等都有插件
- ✅ 可定制：删除不需要的功能很容易

---

## 📊 系统架构

```
GeekSEA 架构
├── 主站 (Next.js) - localhost:3000
│   ├── 落地页 (/)
│   ├── 教程系统 (/tutorials)
│   ├── 工具库 (/tools)
│   ├── 价格页 (/pricing)
│   ├── 个人面板 (/dashboard)
│   └── 管理面板 (/admin)
│
└── 论坛 (Flarum) - localhost:8080
    ├── 讨论区
    ├── 匿名发帖
    └── API 接口
```

### 集成方式

```
用户在主站登录
    ↓
JWT Token 共享
    ↓
自动登录论坛（Single Sign-On）
    ↓
积分同步
```

---

## 🎨 个人面板设计

### 页面路由: `/dashboard`

#### 功能模块

```typescript
// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Coins, User, MessageSquare, BookOpen, Trophy, Settings } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState(0)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左侧：用户信息 */}
        <div className="lg:col-span-1">
          <UserCard user={user} points={points} />
        </div>
        
        {/* 右侧：功能面板 */}
        <div className="lg:col-span-2">
          <PointsSection points={points} />
          <MyContentSection />
          <InviteSection />
        </div>
      </div>
    </div>
  )
}
```

#### 核心组件

**1. 用户信息卡片**
```typescript
function UserCard({ user, points }) {
  return (
    <div className="card-pixel-glow p-6">
      {/* 头像 */}
      <div className="w-24 h-24 mx-auto mb-4 bg-pixel-primary rounded-full" />
      
      {/* 用户名 */}
      <h2 className="text-pixel-lg text-center mb-2">{user?.username}</h2>
      
      {/* 积分显示 - 突出 */}
      <div className="card-pixel p-4 mb-4 bg-pixel-darker/50">
        <div className="flex items-center justify-between">
          <Coins className="text-pixel-warning" size={32} />
          <div className="text-right">
            <div className="text-3xl font-bold text-pixel-warning font-mono">
              {points}
            </div>
            <div className="text-xs text-pixel-light/50">積分餘額</div>
          </div>
        </div>
      </div>
      
      {/* 快速操作 */}
      <div className="space-y-2">
        <button className="btn-pixel w-full">
          <Coins className="inline mr-2" size={16} />
          賺取積分
        </button>
        <button className="btn-pixel-outline w-full">
          <Trophy className="inline mr-2" size={16} />
          積分記錄
        </button>
      </div>
    </div>
  )
}
```

**2. 积分抵扣区域**
```typescript
function PointsSection({ points }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [usePoints, setUsePoints] = useState(0)
  
  return (
    <div className="card-pixel-glow p-6 mb-6">
      <h3 className="text-pixel-lg mb-4 flex items-center gap-2">
        <Coins className="text-pixel-primary" />
        積分抵扣訂閱
      </h3>
      
      {/* 订阅选择 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div 
          className={`card-pixel p-4 cursor-pointer ${
            selectedPlan === 'pro' ? 'border-pixel-primary' : ''
          }`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="text-pixel-base mb-2">專業版</div>
          <div className="text-2xl font-bold text-pixel-primary font-mono">
            $9.99<span className="text-sm">/月</span>
          </div>
        </div>
        
        <div 
          className={`card-pixel p-4 cursor-pointer ${
            selectedPlan === 'enterprise' ? 'border-pixel-primary' : ''
          }`}
          onClick={() => setSelectedPlan('enterprise')}
        >
          <div className="text-pixel-base mb-2">企業版</div>
          <div className="text-2xl font-bold text-pixel-primary font-mono">
            $29.99<span className="text-sm">/月</span>
          </div>
        </div>
      </div>
      
      {/* 积分抵扣滑块 */}
      {selectedPlan && (
        <div className="mt-6">
          <label className="text-sm text-pixel-light/70 mb-2 block">
            使用積分抵扣 (100 積分 = $1)
          </label>
          <input 
            type="range" 
            min="0" 
            max={Math.min(points, 999)}
            value={usePoints}
            onChange={(e) => setUsePoints(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-pixel-accent">{usePoints} 積分</span>
            <span className="text-pixel-primary">
              抵扣 ${(usePoints / 100).toFixed(2)}
            </span>
          </div>
          
          {/* 最终价格 */}
          <div className="card-pixel p-4 mt-4 bg-pixel-darker/50">
            <div className="flex justify-between items-center">
              <span>最終價格:</span>
              <span className="text-2xl font-bold text-pixel-primary font-mono">
                ${((selectedPlan === 'pro' ? 9.99 : 29.99) - usePoints / 100).toFixed(2)}
              </span>
            </div>
          </div>
          
          <button className="btn-pixel w-full mt-4">
            確認訂閱
          </button>
        </div>
      )}
    </div>
  )
}
```

**3. 我的内容**
```typescript
function MyContentSection() {
  return (
    <div className="card-pixel-glow p-6">
      <h3 className="text-pixel-lg mb-4">我的內容</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-pixel p-4 text-center">
          <MessageSquare className="mx-auto mb-2 text-pixel-accent" size={32} />
          <div className="text-2xl font-bold font-mono">23</div>
          <div className="text-xs text-pixel-light/50">我的帖子</div>
        </div>
        
        <div className="card-pixel p-4 text-center">
          <BookOpen className="mx-auto mb-2 text-pixel-primary" size={32} />
          <div className="text-2xl font-bold font-mono">15</div>
          <div className="text-xs text-pixel-light/50">已解鎖教程</div>
        </div>
        
        <div className="card-pixel p-4 text-center">
          <Trophy className="mx-auto mb-2 text-pixel-secondary" size={32} />
          <div className="text-2xl font-bold font-mono">8</div>
          <div className="text-xs text-pixel-light/50">獲得點贊</div>
        </div>
      </div>
    </div>
  )
}
```

---

## 🛡️ 管理面板设计

### 页面路由: `/admin`

#### 权限控制
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const user = await getCurrentUser(request)
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return NextResponse.next()
}
```

#### 管理功能

```typescript
// app/admin/page.tsx
'use client'

import { Users, Coins, MessageSquare, Settings, BarChart } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 统计卡片 */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Users}
          label="總用戶"
          value="1,337"
          change="+12%"
        />
        <StatsCard 
          icon={Coins}
          label="積分發放"
          value="45.2K"
          change="+8%"
        />
        <StatsCard 
          icon={MessageSquare}
          label="論壇帖子"
          value="892"
          change="+15%"
        />
        <StatsCard 
          icon={BarChart}
          label="月收入"
          value="$2.4K"
          change="+23%"
        />
      </div>
      
      {/* 管理功能 */}
      <div className="grid lg:grid-cols-2 gap-8">
        <UserManagement />
        <PointsManagement />
        <InviteCodeManagement />
        <ContentModeration />
      </div>
    </div>
  )
}
```

**核心管理功能**：

1. **用户管理**
   - 用户列表
   - 封禁/解封
   - 积分调整
   - 角色管理

2. **积分管理**
   - 积分发放统计
   - 异常用户检测
   - 手动调整积分

3. **邀请码管理**
   - 生成邀请码
   - 邀请码使用情况
   - 批量生成

4. **内容审核**
   - 论坛帖子审核
   - 用户举报处理
   - 敏感词过滤

---

## 🔐 注册系统设计

### 注册流程

```
用户访问注册页
    ↓
选择注册方式:
├── 方式1: 输入邀请码 (购买获得)
└── 方式2: 观看广告 (免费)
    ↓
    看5个广告
    ↓
    获得临时注册权限
    ↓
完成注册
    ↓
获得 100 积分新手奖励
```

### 邀请码系统

#### 数据库设计
```sql
CREATE TABLE invite_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'paid', 'free', 'admin'
  price REAL DEFAULT 0,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE invite_uses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (code_id) REFERENCES invite_codes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### API 设计
```typescript
// app/api/invite/generate/route.ts
export async function POST(request: Request) {
  const admin = await requireAdmin(request)
  const { count, type, price, maxUses, expiresIn } = await request.json()
  
  const codes = []
  for (let i = 0; i < count; i++) {
    const code = generateCode() // 生成随机码
    await db.run(`
      INSERT INTO invite_codes (code, type, price, max_uses, expires_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [code, type, price, maxUses, expiresAt, admin.id])
    
    codes.push(code)
  }
  
  return Response.json({ codes })
}

// 验证邀请码
export async function validateInviteCode(code: string) {
  const invite = await db.query(`
    SELECT * FROM invite_codes 
    WHERE code = ? 
    AND used_count < max_uses
    AND (expires_at IS NULL OR expires_at > datetime('now'))
  `, [code])
  
  return invite.length > 0
}
```

### 广告注册流程

```typescript
// app/auth/register/page.tsx
function RegisterPage() {
  const [method, setMethod] = useState<'invite' | 'ads' | null>(null)
  const [adsWatched, setAdsWatched] = useState(0)
  const REQUIRED_ADS = 5
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        {!method ? (
          // 选择注册方式
          <div className="space-y-4">
            <button 
              onClick={() => setMethod('invite')}
              className="btn-pixel w-full"
            >
              使用邀請碼註冊
            </button>
            <button 
              onClick={() => setMethod('ads')}
              className="btn-pixel-outline w-full"
            >
              觀看廣告免費註冊
            </button>
          </div>
        ) : method === 'ads' ? (
          // 观看广告
          <AdRegistrationFlow 
            adsWatched={adsWatched}
            onAdComplete={() => setAdsWatched(prev => prev + 1)}
            required={REQUIRED_ADS}
          />
        ) : (
          // 邀请码输入
          <InviteCodeForm />
        )}
      </div>
    </div>
  )
}
```

---

## 📝 Flarum 部署方案

### 安装 Flarum

```bash
# 1. 安装 PHP 和依赖
sudo apt update
sudo apt install -y php8.1 php8.1-fpm php8.1-mysql php8.1-curl php8.1-dom php8.1-gd php8.1-json php8.1-mbstring php8.1-openssl php8.1-tokenizer php8.1-zip

# 2. 安装 Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# 3. 安装 Flarum
cd /var/www
composer create-project flarum/flarum forum --stability=beta
cd forum
chmod 755 /var/www/forum
chmod -R 775 storage

# 4. 配置 Nginx
sudo nano /etc/nginx/sites-available/forum
```

### Nginx 配置

```nginx
server {
    listen 8080;
    server_name localhost;
    root /var/www/forum/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~* \.(?:css|js|woff2?|svg|gif|ico|jpe?g|png)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 必装扩展

```bash
# 1. 匿名发帖
composer require askvortsov/flarum-anonymous-posting

# 2. 邀请码注册
composer require fof/invite-code

# 3. 编辑器增强
composer require fof/formatting

# 4. API 增强
composer require fof/oauth

# 5. 防刷扩展
composer require fof/anti-spam
```

### 删除不需要的功能

编辑 `config/config.php`:
```php
// 禁用不需要的扩展
'extensions_enabled' => [
    // 保留
    'flarum-tags',
    'flarum-markdown',
    'askvortsov-anonymous-posting',
    
    // 禁用
    // 'flarum-likes',
    // 'flarum-mentions',
]
```

---

## ✍️ 编辑器优化

### 方案：集成 Tiptap 编辑器

#### 特点
- 🎨 所见即所得
- 📝 Markdown 支持
- 🖼️ 图片上传
- 💻 代码高亮
- 📋 表格支持

#### 实现

```typescript
// components/editor/RichEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { lowlight } from 'lowlight'

export function RichEditor({ onSubmit }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'card-pixel p-4 min-h-[300px] focus:outline-none prose prose-invert max-w-none',
      },
    },
  })

  return (
    <div className="card-pixel-glow">
      {/* 工具栏 */}
      <EditorToolbar editor={editor} />
      
      {/* 编辑区域 */}
      <EditorContent editor={editor} />
      
      {/* 底部操作 */}
      <div className="flex justify-between items-center p-4 border-t border-pixel-grid">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <span>匿名發帖</span>
        </label>
        
        <button 
          onClick={() => onSubmit(editor.getHTML())}
          className="btn-pixel"
        >
          發布
        </button>
      </div>
    </div>
  )
}
```

---

## 🔄 主站与论坛集成

### SSO (Single Sign-On)

```typescript
// lib/sso.ts
export async function generateForumSSOToken(user: User) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  }
  
  const token = jwt.sign(payload, process.env.FORUM_SSO_SECRET!, {
    expiresIn: '24h'
  })
  
  return token
}

// 论坛自动登录链接
export function getForumLoginUrl(user: User) {
  const token = generateForumSSOToken(user)
  return `http://localhost:8080/sso?token=${token}`
}
```

### 积分同步

```typescript
// Webhook: 论坛发帖后同步积分
// app/api/webhook/forum/post/route.ts
export async function POST(request: Request) {
  const { userId, postId, anonymous } = await request.json()
  
  if (!anonymous) {
    // 非匿名发帖奖励积分
    await awardPoints(userId, 20, 'forum_post')
  }
  
  return Response.json({ success: true })
}
```

---

## 📊 资源占用预估

### 2GB Ubuntu 资源分配

```
总内存: 2GB

分配:
├── 系统: 300MB
├── Next.js 主站: 400MB
├── Flarum 论坛: 300MB
├── Nginx: 50MB
├── PHP-FPM: 200MB
├── SQLite: 50MB
└── 缓存/其他: 700MB

✅ 完全够用！
```

---

## ✅ 实施清单

### Week 1: 基础搭建
- [ ] 安装 Flarum
- [ ] 配置必要扩展
- [ ] 创建个人面板页面
- [ ] 创建管理面板页面

### Week 2: 核心功能
- [ ] 实现邀请码系统
- [ ] 广告注册流程
- [ ] 积分抵扣功能
- [ ] SSO 集成

### Week 3: 优化完善
- [ ] 编辑器优化
- [ ] 匿名发帖测试
- [ ] 性能优化
- [ ] 安全加固

### Week 4: 测试上线
- [ ] 完整功能测试
- [ ] 压力测试
- [ ] 生产环境部署

---

**轻量级论坛系统，2GB内存完全够用！** 💬🚀
