# 👤 GeekSEA 匿名技术论坛设计（重点）

## 🎯 核心需求

1. **完全匿名发帖** - 对外显示匿名
2. **匿名评论** - 评论也匿名
3. **自己可见** - 用户能看到自己的帖子和评论
4. **积分交易** - 打赏、悬赏功能
5. **站内信** - 私密沟通
6. **成品BBS** - 使用安全的开源方案

---

## 🏆 推荐方案：Flarum + 匿名扩展

### 为什么选 Flarum？

✅ **轻量级** - 256MB 内存足够  
✅ **现代化** - 响应式设计  
✅ **安全可靠** - 开源、活跃社区  
✅ **扩展丰富** - 匿名、私信等都有插件  
✅ **API 友好** - 可与主站集成  

---

## 🔐 匿名机制设计

### 数据库结构

```sql
-- 帖子表
CREATE TABLE forum_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,  -- 真实用户ID（内部）
  display_mode TEXT DEFAULT 'anonymous', -- 'anonymous' or 'real'
  anonymous_name TEXT,  -- 自动生成的匿名名称
  category_id INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 0,  -- 悬赏积分
  is_resolved BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 评论表
CREATE TABLE forum_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,  -- 真实用户ID（内部）
  display_mode TEXT DEFAULT 'anonymous',
  anonymous_name TEXT,
  points_received INTEGER DEFAULT 0,  -- 收到的打赏
  is_best_answer BOOLEAN DEFAULT 0,  -- 是否最佳答案
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 积分交易表
CREATE TABLE point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'tip', 'reward', 'trade'
  reference_type TEXT, -- 'post', 'comment'
  reference_id INTEGER,
  message TEXT,  -- 交易留言
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- 站内信表
CREATE TABLE private_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT 0,  -- 是否匿名发送
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);
```

---

## 🎭 匿名显示逻辑

### 前端显示

```typescript
// components/forum/PostCard.tsx
function PostCard({ post, currentUserId }: any) {
  // 判断是否显示真实信息
  const isAuthor = post.author_id === currentUserId
  
  return (
    <div className="card-pixel-glow p-6">
      {/* 作者显示 */}
      <div className="flex items-center gap-3 mb-4">
        {isAuthor ? (
          // 自己能看到是自己的帖子
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pixel-primary" />
            <div>
              <span className="text-sm font-mono">{post.author_username}</span>
              <span className="ml-2 text-xs text-pixel-accent">(你)</span>
            </div>
          </div>
        ) : (
          // 别人看到的是匿名
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pixel-grid" />
            <span className="text-sm text-pixel-light/70 font-mono">
              {post.anonymous_name || '匿名用戶'}
            </span>
          </div>
        )}
        
        {/* 悬赏标识 */}
        {post.points_reward > 0 && (
          <span className="text-xs px-2 py-1 bg-pixel-warning/20 text-pixel-warning border border-pixel-warning">
            懸賞 {post.points_reward} 積分
          </span>
        )}
      </div>
      
      {/* 标题和内容 */}
      <h3 className="text-pixel-lg mb-3">{post.title}</h3>
      <p className="text-pixel-light/80">{post.content}</p>
      
      {/* 操作按钮 */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <button className="text-pixel-accent hover:text-pixel-primary">
          💬 {post.comments_count} 評論
        </button>
        <button className="text-pixel-secondary hover:text-pixel-primary">
          💎 打賞
        </button>
        {isAuthor && post.points_reward > 0 && (
          <button className="text-pixel-warning hover:text-pixel-primary">
            ✓ 選擇最佳答案
          </button>
        )}
      </div>
    </div>
  )
}
```

### 匿名名称生成

```typescript
// lib/anonymous.ts
export function generateAnonymousName(userId: number, postId: number): string {
  // 基于用户ID和帖子ID生成唯一但匿名的名称
  const hash = simpleHash(`${userId}-${postId}`)
  const prefixes = ['神秘', '隱匿', '幽靈', '暗影', '虛空']
  const suffixes = ['駭客', '開發者', '工程師', '大師', '極客']
  
  const prefix = prefixes[hash % prefixes.length]
  const suffix = suffixes[Math.floor(hash / 100) % suffixes.length]
  const number = (hash % 9999).toString().padStart(4, '0')
  
  return `${prefix}${suffix}#${number}`
  // 例如: "神秘駭客#1337"
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}
```

---

## 💰 积分交易功能

### 打赏功能

```typescript
// components/forum/TipButton.tsx
'use client'

import { useState } from 'react'
import { Coins } from 'lucide-react'

export function TipButton({ targetUserId, referenceType, referenceId }: any) {
  const [amount, setAmount] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleTip = async () => {
    await fetch('/api/points/tip', {
      method: 'POST',
      body: JSON.stringify({
        targetUserId,
        amount,
        message,
        referenceType,
        referenceId,
      }),
    })
    
    setShowModal(false)
  }
  
  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="text-pixel-secondary hover:text-pixel-primary"
      >
        <Coins size={16} className="inline" /> 打賞
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="card-pixel-glow p-6 max-w-md w-full">
            <h3 className="text-pixel-lg mb-4">打賞積分</h3>
            
            <label className="block text-sm text-pixel-light/70 mb-2">
              打賞金額
            </label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              max="1000"
              step="10"
              className="input-pixel mb-4"
            />
            
            <label className="block text-sm text-pixel-light/70 mb-2">
              留言（可選）
            </label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="感謝分享..."
              className="input-pixel mb-4"
              rows={3}
            />
            
            <div className="flex gap-2">
              <button onClick={handleTip} className="btn-pixel flex-1">
                確認打賞
              </button>
              <button onClick={() => setShowModal(false)} className="btn-pixel-outline">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

### 悬赏发帖

```typescript
// components/forum/CreatePostWithReward.tsx
function CreatePostWithReward() {
  const [rewardPoints, setRewardPoints] = useState(0)
  
  return (
    <div className="card-pixel-glow p-6">
      <h3 className="text-pixel-lg mb-4">發布帖子</h3>
      
      {/* 标题 */}
      <input 
        type="text"
        placeholder="標題"
        className="input-pixel mb-4"
      />
      
      {/* 内容 */}
      <textarea 
        placeholder="內容"
        className="input-pixel mb-4"
        rows={6}
      />
      
      {/* 悬赏设置 */}
      <div className="card-pixel p-4 mb-4 bg-pixel-darker/50">
        <label className="flex items-center justify-between mb-2">
          <span className="text-sm">設置懸賞</span>
          <input 
            type="checkbox"
            onChange={(e) => setRewardPoints(e.target.checked ? 50 : 0)}
          />
        </label>
        
        {rewardPoints > 0 && (
          <>
            <input 
              type="range"
              min="50"
              max="500"
              step="50"
              value={rewardPoints}
              onChange={(e) => setRewardPoints(Number(e.target.value))}
              className="w-full mb-2"
            />
            <div className="text-sm text-pixel-warning text-center">
              懸賞 {rewardPoints} 積分給最佳答案
            </div>
          </>
        )}
      </div>
      
      {/* 匿名选项 */}
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input type="checkbox" defaultChecked />
        <span>匿名發帖</span>
      </label>
      
      <button className="btn-pixel w-full">
        發布
      </button>
    </div>
  )
}
```

---

## 📨 站内信系统

### 数据库实现

```typescript
// app/api/messages/send/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  const { toUserId, subject, content, isAnonymous } = await request.json()
  
  await db.run(`
    INSERT INTO private_messages (from_user_id, to_user_id, subject, content, is_anonymous)
    VALUES (?, ?, ?, ?, ?)
  `, [user.id, toUserId, subject, content, isAnonymous])
  
  return Response.json({ success: true })
}
```

### 前端组件

```typescript
// components/messages/MessageInbox.tsx
'use client'

import { Mail, MailOpen } from 'lucide-react'

export function MessageInbox() {
  const [messages, setMessages] = useState([])
  
  return (
    <div className="card-pixel-glow p-6">
      <h3 className="text-pixel-lg mb-4">站內信</h3>
      
      <div className="space-y-3">
        {messages.map((msg: any) => (
          <div 
            key={msg.id}
            className={`card-pixel p-4 cursor-pointer ${
              !msg.is_read ? 'border-pixel-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {msg.is_read ? (
                  <MailOpen size={16} className="text-pixel-light/50" />
                ) : (
                  <Mail size={16} className="text-pixel-primary" />
                )}
                <span className="text-sm font-mono">
                  {msg.is_anonymous ? '匿名用戶' : msg.from_username}
                </span>
              </div>
              <span className="text-xs text-pixel-light/50">
                {msg.created_at}
              </span>
            </div>
            <div className="text-sm text-pixel-light/80">{msg.subject}</div>
          </div>
        ))}
      </div>
      
      <button className="btn-pixel-outline w-full mt-4">
        查看全部
      </button>
    </div>
  )
}
```

---

## 🔒 安全性考虑

### 1. 真实身份保护
```typescript
// 确保API不泄露真实用户信息
export async function getPosts() {
  const posts = await db.query('SELECT * FROM forum_posts')
  
  return posts.map(post => ({
    ...post,
    // 移除敏感信息
    author_id: undefined,  // 不返回真实ID
    author_email: undefined,
    author_ip: undefined,
    // 只返回匿名信息
    display_name: post.anonymous_name,
  }))
}
```

### 2. IP 追踪（后台）
```typescript
// 虽然前台匿名，但后台记录IP用于防止滥用
await db.run(`
  INSERT INTO post_meta (post_id, ip_address, user_agent)
  VALUES (?, ?, ?)
`, [postId, requestIP, userAgent])
```

### 3. 举报机制
```typescript
// 用户可以举报违规内容
function ReportButton({ postId }: any) {
  return (
    <button className="text-pixel-danger text-sm">
      🚩 舉報
    </button>
  )
}
```

---

## 🎯 Flarum 部署配置

### 必装扩展

```bash
# 1. 匿名发帖
composer require askvortsov/flarum-anonymous-posting

# 2. 私信系统
composer require fof/byobu

# 3. 最佳答案
composer require fof/best-answer

# 4. 积分系统
composer require fof/gamification

# 5. 打赏功能
composer require flarum/nicknames
```

### 配置文件

```php
// config/config.php
return [
    'anonymous' => [
        'default_mode' => 'anonymous',  // 默认匿名
        'allow_reveal' => false,  // 不允许显示真实身份
    ],
    'gamification' => [
        'points_per_post' => 20,
        'points_per_comment' => 5,
        'enable_tipping' => true,
    ],
];
```

---

## 📊 功能总结

| 功能 | 状态 | 说明 |
|------|------|------|
| 匿名发帖 | ✅ | 完全匿名，自己可见 |
| 匿名评论 | ✅ | 评论也匿名 |
| 积分打赏 | ✅ | 支持打赏作者 |
| 悬赏问答 | ✅ | 发帖悬赏积分 |
| 站内信 | ✅ | 私密沟通 |
| 匿名站内信 | ✅ | 可选匿名 |
| 举报机制 | ✅ | 防止滥用 |

---

**匿名技术论坛才是核心！安全、隐私、专业！** 👤🔒
