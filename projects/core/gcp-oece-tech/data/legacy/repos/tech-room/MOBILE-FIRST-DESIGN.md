# 📱 GeekSEA 移动端优先设计

## 🎯 核心定位

**数字化匿名秘密基地 - 移动版**
- 主力：手机版 BBS
- 辅助：教程站 + 站内信
- 平台：Telegram Bot + 群组 + X(Twitter)
- 用户：前期 200 人左右
- 数据库：DB 免费层（10GB，$0/月）

---

## 📱 移动端优化策略

### 1. 触摸优化

#### 按钮尺寸
```css
/* 最小触摸目标：44x44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* 间距增大 */
.mobile-spacing {
  gap: 16px; /* 桌面端 8px */
}
```

#### 手势支持
```typescript
// 下拉刷新
<PullToRefresh onRefresh={refreshForum} />

// 滑动返回
<SwipeBack onSwipe={goBack} />

// 长按菜单
<LongPress onLongPress={showMenu} />
```

### 2. 性能优化

#### 减少动画
```css
/* 移动端简化动画 */
@media (max-width: 768px) {
  .animate-scan {
    animation: none !important;
  }
  
  .matrix-rain {
    display: none !important;
  }
  
  /* 只保留关键动画 */
  .pulse-only {
    animation: pulse 2s ease-in-out infinite;
  }
}
```

#### 图片优化
```tsx
// 使用 Next.js Image 优化
<Image 
  src="/avatar.jpg"
  width={40}
  height={40}
  loading="lazy"
  quality={75}
/>
```

### 3. 布局适配

#### 单列布局
```tsx
// 移动端强制单列
<div className="grid grid-cols-1 md:grid-cols-3">
  {/* 内容 */}
</div>
```

#### 底部导航
```tsx
// 固定底部导航栏
<nav className="fixed bottom-0 left-0 right-0 bg-pixel-darker border-t border-pixel-grid">
  <div className="flex justify-around p-2">
    <NavButton icon={Home} label="首頁" />
    <NavButton icon={MessageSquare} label="論壇" />
    <NavButton icon={Mail} label="信箱" />
    <NavButton icon={User} label="我的" />
  </div>
</nav>
```

---

## 🎨 移动端专属UI

### "秘密基地"感觉

#### 顶部状态栏
```tsx
<div className="fixed top-0 left-0 right-0 z-50 bg-pixel-darker/95 backdrop-blur-sm border-b border-pixel-danger">
  <div className="flex items-center justify-between p-3">
    {/* 左：状态 */}
    <div className="flex items-center gap-2 text-xs">
      <div className="w-2 h-2 bg-pixel-danger rounded-full animate-pulse" />
      <span className="text-pixel-danger">SECURE</span>
    </div>
    
    {/* 中：标题 */}
    <span className="font-mono text-sm text-pixel-light/70">
      匿名基地
    </span>
    
    {/* 右：信号 */}
    <div className="flex items-center gap-1">
      <Signal size={14} className="text-pixel-primary" />
      <span className="text-xs text-pixel-light/50">42</span>
    </div>
  </div>
</div>
```

#### 卡片设计
```tsx
// 手机端优化的卡片
<div className="card-pixel p-4 mb-3 active:scale-98 transition-transform">
  {/* 更大的触摸区域 */}
  <div className="flex items-start gap-3">
    <div className="w-12 h-12 rounded-full bg-pixel-primary/20" />
    <div className="flex-1">
      <h3 className="text-base mb-1">标题</h3>
      <p className="text-sm text-pixel-light/70">内容</p>
    </div>
  </div>
</div>
```

---

## 🤖 Telegram 集成方案

### 1. Telegram Bot 功能

#### 核心功能
```
/start - 获取邀请码
/register - 绑定账号
/points - 查询积分
/post - 匿名发帖
/message - 发送站内信
/status - 查看状态
```

#### Bot 实现
```typescript
// lib/telegram-bot.ts
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

// 获取邀请码
bot.command('start', async (ctx) => {
  const userId = ctx.from.id
  const inviteCode = await generateInviteCode('telegram', userId)
  
  ctx.reply(
    `🔐 歡迎來到 GeekSEA 秘密基地\n\n` +
    `你的邀請碼: \`${inviteCode}\`\n\n` +
    `使用此邀請碼在網站註冊：\n` +
    `https://geeksea.com/auth/register\n\n` +
    `⚠️ 完全匿名，安全通信`,
    { parse_mode: 'Markdown' }
  )
})

// 绑定账号
bot.command('register', async (ctx) => {
  const userId = ctx.from.id
  // 生成绑定链接
  const bindToken = await generateBindToken(userId)
  ctx.reply(
    `點擊綁定你的賬號：\n` +
    `https://geeksea.com/bind?token=${bindToken}`
  )
})

// 查询积分
bot.command('points', async (ctx) => {
  const userId = ctx.from.id
  const user = await getUserByTelegramId(userId)
  if (!user) {
    return ctx.reply('❌ 請先綁定賬號：/register')
  }
  
  const points = await getPoints(user.id)
  ctx.reply(
    `💰 你的積分：${points}\n\n` +
    `訪問網站查看詳情：\n` +
    `https://geeksea.com/dashboard`
  )
})

// 匿名发帖（通过Bot）
bot.command('post', async (ctx) => {
  const userId = ctx.from.id
  const user = await getUserByTelegramId(userId)
  if (!user) {
    return ctx.reply('❌ 請先綁定賬號：/register')
  }
  
  ctx.reply('請發送你要匿名發布的內容：')
  // 等待用户输入...
})

bot.launch()
```

### 2. Telegram 群组

#### 群组设置
```
主群：GeekSEA 秘密基地
├── 公告頻道（只讀）
├── 技術討論群
├── VPN/VPS 交流群
└── 新手引導群
```

#### 群组功能
- 📢 即时通知（新帖、回复）
- 🤖 Bot 命令快捷操作
- 👥 匿名讨论（通过Bot转发）
- 🔗 快速跳转到网站

### 3. X (Twitter) 集成

#### 功能
```typescript
// lib/twitter-integration.ts

// 1. 分享到X
async function shareToX(postUrl: string) {
  const text = `🔐 GeekSEA 匿名技術討論`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`
  return url
}

// 2. X Bot 自动发布
// 每日精选帖子自动发到X
async function postToX(post: Post) {
  // 使用 Twitter API
}
```

---

## 🗄️ 数据库方案

### DigitalOcean Database 免费层

#### 规格
```
提供商: DigitalOcean Managed Database
免费层: PostgreSQL/MySQL
规格:
  - 存储: 10GB
  - 内存: 1GB
  - 连接数: 25
  - 价格: $0/月（开发者计划）
  
适合:
  - 前期 200 用户
  - 每日 1000+ 帖子
  - 完全够用
```

#### 配置
```env
# .env.production
DATABASE_TYPE=postgresql
DATABASE_HOST=db.xxx.db.ondigitalocean.com
DATABASE_PORT=25060
DATABASE_NAME=geeksea
DATABASE_USER=doadmin
DATABASE_PASSWORD=xxx
DATABASE_SSL=true
```

#### 迁移方案
```typescript
// 使用 Prisma ORM（支持多种数据库）
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // 或 "mysql" 或 "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id              Int       @id @default(autoincrement())
  username        String    @unique
  email           String    @unique
  password        String
  role            String    @default("user")
  points          Int       @default(100)
  telegramId      BigInt?   @unique
  twitterId       String?   @unique
  inviteCode      String?   @unique
  invitedBy       Int?
  createdAt       DateTime  @default(now())
  
  posts           Post[]
  comments        Comment[]
  messages        Message[] @relation("MessageFrom")
}

model Post {
  id              Int       @id @default(autoincrement())
  title           String
  content         String    @db.Text
  authorId        Int
  isAnonymous     Boolean   @default(true)
  anonymousName   String?
  categoryId      Int
  pointsReward    Int       @default(0)
  views           Int       @default(0)
  likes           Int       @default(0)
  createdAt       DateTime  @default(now())
  
  author          User      @relation(fields: [authorId], references: [id])
  comments        Comment[]
}

// ... 其他表
```

---

## 📱 移动端BBS界面

### 论坛首页（手机版）

```tsx
// app/forum/mobile-view.tsx
'use client'

import { useState } from 'react'
import { Search, Plus, Filter, TrendingUp, Clock, Eye } from 'lucide-react'

export function MobileForumView() {
  const [activeTab, setActiveTab] = useState<'hot' | 'new'>('hot')
  
  return (
    <div className="min-h-screen bg-pixel-darker pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-40 bg-pixel-darker/95 backdrop-blur-sm border-b border-pixel-grid">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-light/50" size={18} />
              <input 
                type="text"
                placeholder="搜索技術討論..."
                className="w-full pl-10 pr-4 py-2 bg-pixel-darker border border-pixel-grid rounded-lg text-sm"
              />
            </div>
            <button className="p-2 border border-pixel-grid rounded-lg">
              <Filter size={18} />
            </button>
          </div>
          
          {/* 标签切换 */}
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => setActiveTab('hot')}
              className={`flex-1 py-2 rounded-lg text-sm font-mono ${
                activeTab === 'hot' 
                  ? 'bg-pixel-primary text-pixel-darker' 
                  : 'bg-pixel-darker border border-pixel-grid'
              }`}
            >
              <TrendingUp size={14} className="inline mr-1" />
              熱門
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2 rounded-lg text-sm font-mono ${
                activeTab === 'new' 
                  ? 'bg-pixel-accent text-pixel-darker' 
                  : 'bg-pixel-darker border border-pixel-grid'
              }`}
            >
              <Clock size={14} className="inline mr-1" />
              最新
            </button>
          </div>
        </div>
      </div>
      
      {/* 帖子列表 */}
      <div className="p-3 space-y-3">
        <MobilePostCard 
          title="VPN 搭建完整教程"
          author="神秘駭客#1337"
          isAnonymous={true}
          views={234}
          comments={12}
          points={50}
        />
        <MobilePostCard 
          title="如何配置 VPS 翻牆"
          author="匿名用戶#4892"
          isAnonymous={true}
          views={189}
          comments={8}
          points={30}
        />
        {/* 更多帖子... */}
      </div>
      
      {/* 浮动发帖按钮 */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-pixel-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform">
        <Plus size={24} className="text-pixel-darker" />
      </button>
      
      {/* 底部导航 */}
      <MobileBottomNav />
    </div>
  )
}

// 移动端帖子卡片
function MobilePostCard({ title, author, isAnonymous, views, comments, points }: any) {
  return (
    <div className="card-pixel p-4 active:scale-98 transition-transform">
      <div className="flex items-start gap-3">
        {/* 头像 */}
        <div className="w-10 h-10 rounded-full bg-pixel-grid flex items-center justify-center flex-shrink-0">
          {isAnonymous && <Eye size={16} className="text-pixel-accent" />}
        </div>
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium mb-1 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-xs text-pixel-light/50">
            <span>{author}</span>
            <span>·</span>
            <span>{views} 瀏覽</span>
          </div>
          
          {/* 底部信息 */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-pixel-accent">
              💬 {comments}
            </span>
            {points > 0 && (
              <span className="text-xs text-pixel-warning">
                💰 {points} 積分
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 底部导航
function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pixel-darker/95 backdrop-blur-sm border-t border-pixel-grid">
      <div className="flex justify-around py-2">
        <NavItem icon={Home} label="首頁" active />
        <NavItem icon={MessageSquare} label="論壇" />
        <NavItem icon={Mail} label="信箱" badge={3} />
        <NavItem icon={User} label="我的" />
      </div>
    </nav>
  )
}
```

---

## 🎯 邀请注册层次

### 邀请码类型

```typescript
enum InviteType {
  TELEGRAM = 'telegram',    // TG Bot 生成
  ADMIN = 'admin',          // 管理员发放
  PAID = 'paid',            // 购买获得
  REFERRAL = 'referral',    // 用户邀请
}

interface InviteCode {
  code: string              // GEEK-XXX-XXX
  type: InviteType
  maxUses: number           // 使用次数
  usedCount: number
  points: number            // 奖励积分
  expiresAt?: Date
  createdBy: number
}
```

### 层次划分

```
1. Telegram Bot 邀请码
   - 免费获取
   - 单次使用
   - 奖励: 100 积分
   
2. 用户邀请码
   - 每月可生成 3 个
   - 单次使用
   - 邀请人和被邀请人各得 50 积分
   
3. 购买邀请码
   - $5 购买
   - 单次使用
   - 奖励: 200 积分
   
4. 管理员邀请码
   - 无限次使用
   - 特殊标记
   - 奖励: 500 积分
```

---

## 📊 前期用户规模

### 资源规划（200用户）

```
数据库: DB 免费层
├── 用户: 200
├── 帖子: 每天 20 篇 × 30天 = 600篇
├── 评论: 每天 100 条 × 30天 = 3000条
├── 站内信: 每天 50 条 × 30天 = 1500条
└── 存储: < 1GB（完全够用）

服务器: DO 2GB VPS ($12/月)
├── Next.js主站: 400MB
├── Flarum论坛: 300MB
└── 剩余: 1.3GB

带宽: 3TB/月
├── 日均流量: 100GB
└── 完全够用
```

---

## ✅ 移动端优化清单

### 已优化
- [x] 触摸目标尺寸 (44x44px)
- [x] 单列布局
- [x] 底部导航
- [x] 简化动画
- [x] 卡片设计

### 待实现
- [ ] PWA 支持（离线访问）
- [ ] 下拉刷新
- [ ] 无限滚动
- [ ] 图片懒加载
- [ ] 手势操作

---

**移动端优先的匿名秘密基地已就绪！** 📱👁️🔒
