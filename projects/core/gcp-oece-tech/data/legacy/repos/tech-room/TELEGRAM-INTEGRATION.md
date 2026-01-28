# 🤖 Telegram + X 集成方案

## 🎯 目标

打造完整的社交媒体生态：
- Telegram Bot - 邀请码生成、账号绑定、快捷操作
- Telegram 群组 - 即时通知、社区讨论
- X (Twitter) - 内容分发、品牌曝光

---

## 🤖 Telegram Bot 完整实现

### 1. 安装依赖

```bash
npm install telegraf
npm install @types/telegraf --save-dev
```

### 2. Bot 代码

```typescript
// lib/telegram/bot.ts
import { Telegraf, Context } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

// 数据库操作
import { 
  generateInviteCode, 
  bindTelegramAccount,
  getUserPoints,
  createAnonymousPost 
} from '@/lib/db'

// ============================================
// 命令：/start - 欢迎 + 邀请码
// ============================================
bot.command('start', async (ctx: Context) => {
  const userId = ctx.from!.id
  const username = ctx.from!.username || ctx.from!.first_name
  
  // 生成邀请码
  const inviteCode = await generateInviteCode({
    type: 'telegram',
    telegramId: userId,
    maxUses: 1,
    points: 100,
  })
  
  await ctx.reply(
    `👁️ *歡迎來到 GeekSEA 秘密基地*\n\n` +
    `🔐 你的專屬邀請碼：\n\`${inviteCode}\`\n\n` +
    `📱 使用邀請碼註冊：\n` +
    `https://geeksea.com/auth/register\n\n` +
    `⚠️ *完全匿名 · 安全通信 · 技術自由*\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `📋 可用命令：\n` +
    `/register - 綁定賬號\n` +
    `/points - 查詢積分\n` +
    `/post - 匿名發帖\n` +
    `/message - 發送站內信\n` +
    `/help - 幫助信息`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 命令：/register - 绑定账号
// ============================================
bot.command('register', async (ctx: Context) => {
  const userId = ctx.from!.id
  
  // 检查是否已绑定
  const existing = await getUserByTelegramId(userId)
  if (existing) {
    return ctx.reply(
      `✅ 你已經綁定賬號：*${existing.username}*\n\n` +
      `🎮 前往網站：\nhttps://geeksea.com/dashboard`,
      { parse_mode: 'Markdown' }
    )
  }
  
  // 生成绑定Token
  const bindToken = await generateBindToken(userId)
  
  await ctx.reply(
    `🔗 *綁定你的 GeekSEA 賬號*\n\n` +
    `點擊下方鏈接完成綁定：\n` +
    `https://geeksea.com/bind?token=${bindToken}\n\n` +
    `⏱️ 鏈接有效期：10分鐘`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 命令：/points - 查询积分
// ============================================
bot.command('points', async (ctx: Context) => {
  const userId = ctx.from!.id
  const user = await getUserByTelegramId(userId)
  
  if (!user) {
    return ctx.reply(
      `❌ 請先綁定賬號\n\n` +
      `使用命令：/register`
    )
  }
  
  const points = await getUserPoints(user.id)
  const stats = await getUserStats(user.id)
  
  await ctx.reply(
    `💰 *你的積分餘額*\n\n` +
    `當前積分：*${points}*\n` +
    `總賺取：${stats.totalEarned}\n` +
    `總消費：${stats.totalSpent}\n\n` +
    `📊 *活躍統計*\n` +
    `發帖數：${stats.posts}\n` +
    `評論數：${stats.comments}\n` +
    `獲得點讚：${stats.likes}\n\n` +
    `🎮 查看詳情：\nhttps://geeksea.com/dashboard`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 命令：/post - 匿名发帖
// ============================================
bot.command('post', async (ctx: Context) => {
  const userId = ctx.from!.id
  const user = await getUserByTelegramId(userId)
  
  if (!user) {
    return ctx.reply('❌ 請先綁定賬號：/register')
  }
  
  // 存储用户状态（等待输入标题）
  await setUserState(userId, 'waiting_post_title')
  
  await ctx.reply(
    `📝 *匿名發帖*\n\n` +
    `請發送帖子標題：\n` +
    `（或發送 /cancel 取消）`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 命令：/message - 站内信
// ============================================
bot.command('message', async (ctx: Context) => {
  const userId = ctx.from!.id
  const user = await getUserByTelegramId(userId)
  
  if (!user) {
    return ctx.reply('❌ 請先綁定賬號：/register')
  }
  
  await ctx.reply(
    `📨 *發送站內信*\n\n` +
    `請發送對方的用戶名：\n` +
    `例如：@username\n\n` +
    `（或發送 /cancel 取消）`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 命令：/help - 帮助
// ============================================
bot.command('help', async (ctx: Context) => {
  await ctx.reply(
    `🤖 *GeekSEA Bot 幫助*\n\n` +
    `*基本命令：*\n` +
    `/start - 獲取邀請碼\n` +
    `/register - 綁定賬號\n` +
    `/points - 查詢積分\n\n` +
    `*快捷操作：*\n` +
    `/post - 匿名發帖\n` +
    `/message - 發送站內信\n` +
    `/status - 查看狀態\n\n` +
    `*社群：*\n` +
    `加入討論群：@geeksea_chat\n` +
    `關注頻道：@geeksea_news\n\n` +
    `*支持：*\n` +
    `聯繫管理員：@geeksea_admin\n` +
    `官方網站：https://geeksea.com\n\n` +
    `⚠️ 使用 Bot 即表示同意免責聲明`,
    { parse_mode: 'Markdown' }
  )
})

// ============================================
// 消息处理（用于发帖流程）
// ============================================
bot.on(message('text'), async (ctx: Context) => {
  const userId = ctx.from.id
  const text = ctx.message.text
  
  // 检查用户状态
  const state = await getUserState(userId)
  
  if (state === 'waiting_post_title') {
    // 保存标题，请求内容
    await setUserData(userId, 'post_title', text)
    await setUserState(userId, 'waiting_post_content')
    
    return ctx.reply(
      `✅ 標題已設置\n\n` +
      `現在請發送帖子內容：\n` +
      `（支持多行文本）`
    )
  }
  
  if (state === 'waiting_post_content') {
    // 获取标题
    const title = await getUserData(userId, 'post_title')
    const user = await getUserByTelegramId(userId)
    
    // 创建匿名帖子
    const post = await createAnonymousPost({
      userId: user!.id,
      title,
      content: text,
      source: 'telegram',
    })
    
    // 清除状态
    await clearUserState(userId)
    
    return ctx.reply(
      `✅ *發帖成功！*\n\n` +
      `📝 標題：${title}\n` +
      `🔗 查看帖子：\n` +
      `https://geeksea.com/forum/post/${post.id}\n\n` +
      `💰 獲得 20 積分`,
      { parse_mode: 'Markdown' }
    )
  }
})

// ============================================
// 启动 Bot
// ============================================
export function startTelegramBot() {
  bot.launch()
  console.log('✅ Telegram Bot started')
  
  // 优雅关闭
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
```

### 3. 启动 Bot

```typescript
// app/api/telegram/webhook/route.ts
import { startTelegramBot } from '@/lib/telegram/bot'

// 开发环境：长轮询
if (process.env.NODE_ENV === 'development') {
  startTelegramBot()
}

// 生产环境：Webhook
export async function POST(request: Request) {
  const update = await request.json()
  // 处理 Telegram update
  return Response.json({ ok: true })
}
```

---

## 📢 Telegram 群组设置

### 群组架构

```
GeekSEA 生态系统
│
├── 📢 @geeksea_news（公告頻道）
│   └── 只讀，管理員發布
│
├── 💬 @geeksea_chat（主群）
│   ├── 技術討論
│   ├── Bot 快捷操作
│   └── 新手引導
│
├── 🛠️ @geeksea_vpn（VPN/VPS群）
│   └── 專門討論 VPN 技術
│
└── 👥 @geeksea_admin（管理群）
    └── 管理員專用
```

### Bot 群组功能

```typescript
// lib/telegram/group-features.ts

// 1. 新帖通知
async function notifyNewPost(post: Post) {
  await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHAT_ID!,
    `🆕 *新帖子*\n\n` +
    `📝 ${post.title}\n` +
    `👤 ${post.anonymousName}\n` +
    `🔗 https://geeksea.com/forum/post/${post.id}`,
    { parse_mode: 'Markdown' }
  )
}

// 2. 回复通知
async function notifyReply(comment: Comment) {
  const user = await getUserById(comment.postAuthorId)
  if (user.telegramId) {
    await bot.telegram.sendMessage(
      user.telegramId,
      `💬 有人回復了你的帖子\n\n` +
      `${comment.content}\n\n` +
      `🔗 查看：https://geeksea.com/forum/post/${comment.postId}`
    )
  }
}

// 3. 站内信通知
async function notifyMessage(message: Message) {
  const receiver = await getUserById(message.toUserId)
  if (receiver.telegramId) {
    await bot.telegram.sendMessage(
      receiver.telegramId,
      `📨 你收到一條新站內信\n\n` +
      `🔗 查看：https://geeksea.com/messages`
    )
  }
}
```

---

## 🐦 X (Twitter) 集成

### 1. 自动发布

```typescript
// lib/twitter/auto-post.ts
import { TwitterApi } from 'twitter-api-v2'

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
})

// 每日精选帖子自动发到X
export async function postDailyHighlight() {
  const topPosts = await getTopPostsToday(3)
  
  for (const post of topPosts) {
    const tweet = `🔐 GeekSEA 每日精選\n\n` +
      `📝 ${post.title}\n` +
      `💬 ${post.comments} 討論\n` +
      `👁️ ${post.views} 瀏覽\n\n` +
      `#GeekSEA #Tech #Anonymous\n\n` +
      `https://geeksea.com/forum/post/${post.id}`
    
    await twitterClient.v2.tweet(tweet)
    await delay(60000) // 间隔1分钟
  }
}

// 定时任务
import cron from 'node-cron'
cron.schedule('0 20 * * *', postDailyHighlight) // 每天晚上8点
```

### 2. 分享功能

```typescript
// components/ShareToX.tsx
export function ShareToX({ postUrl, title }: any) {
  const shareUrl = `https://twitter.com/intent/tweet?` +
    `text=${encodeURIComponent(`🔐 ${title}\n\n#GeekSEA #Tech`)}&` +
    `url=${encodeURIComponent(postUrl)}`
  
  return (
    <a 
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-pixel-outline text-sm"
    >
      分享到 X
    </a>
  )
}
```

---

## 🗄️ 数据库配置

### Prisma Schema 更新

```prisma
// prisma/schema.prisma

model User {
  id              Int       @id @default(autoincrement())
  username        String    @unique
  email           String    @unique
  password        String
  role            String    @default("user")
  points          Int       @default(100)
  
  // 社交媒体绑定
  telegramId      BigInt?   @unique
  telegramUsername String?
  twitterId       String?   @unique
  twitterUsername String?
  
  // 邀请系统
  inviteCode      String?   @unique
  invitedBy       Int?
  invitedCount    Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  posts           Post[]
  comments        Comment[]
  messages        Message[] @relation("MessageFrom")
  inviter         User?     @relation("Invites", fields: [invitedBy], references: [id])
  invitees        User[]    @relation("Invites")
}

model InviteCode {
  id          Int       @id @default(autoincrement())
  code        String    @unique
  type        String    // 'telegram', 'admin', 'paid', 'referral'
  maxUses     Int       @default(1)
  usedCount   Int       @default(0)
  points      Int       @default(100)
  telegramId  BigInt?
  expiresAt   DateTime?
  createdBy   Int?
  createdAt   DateTime  @default(now())
  
  creator     User?     @relation(fields: [createdBy], references: [id])
}
```

---

## 📱 完整部署方案

### 环境变量

```env
# .env.production

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=-1001234567890
TELEGRAM_NEWS_CHANNEL=@geeksea_news

# Twitter (X)
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx

# Database (DigitalOcean)
DATABASE_URL=postgresql://user:pass@db.xxx.db.ondigitalocean.com:25060/geeksea?sslmode=require
```

---

**Telegram + X 完整生态已就绪！** 🤖🐦📱
