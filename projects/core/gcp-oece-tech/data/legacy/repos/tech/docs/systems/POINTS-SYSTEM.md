# 💎 GeekSEA 积分系统设计

## 🎯 核心理念

**免费用户通过看广告获得积分，用积分解锁付费内容**

- 💰 付费用户：直接订阅，无广告
- 🎬 免费用户：看广告赚积分，用积分解锁内容
- 🔄 灵活转换：积分可抵扣订阅费用

---

## 📊 积分经济模型

### 积分获取方式

| 方式 | 积分 | 冷却时间 | 说明 |
|------|------|----------|------|
| 观看视频广告 | 10 | 30秒 | Google AdSense 视频 |
| 完成问卷 | 50 | 24小时 | 用户反馈问卷 |
| 每日签到 | 5 | 24小时 | 连续签到加成 |
| 分享教程 | 3 | 每篇 | 社交媒体分享 |
| 发布优质帖子 | 20 | - | 论坛高质量内容 |
| 新用户注册 | 100 | 一次性 | 欢迎奖励 |

### 积分消费

| 内容类型 | 积分价格 | 等价金额 |
|----------|----------|----------|
| 单篇教程 | 50 积分 | $0.50 |
| 教程合集（10篇） | 400 积分 | $4.00 |
| VIP工具使用（1天） | 100 积分 | $1.00 |
| 下载离线教程 | 30 积分/篇 | $0.30 |
| 移除广告（7天） | 500 积分 | $5.00 |

### 积分兑换规则

```
1 积分 = $0.01 USD
100 积分 = $1.00 USD

专业版月费 $9.99 = 999 积分
```

---

## 🗄️ 数据库设计

### 用户积分表

```sql
CREATE TABLE user_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
```

### 积分交易记录表

```sql
CREATE TABLE point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'earn' or 'spend'
  source TEXT NOT NULL, -- 'ad_video', 'daily_signin', 'tutorial_unlock', etc.
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  metadata TEXT, -- JSON 额外信息
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX idx_point_transactions_source ON point_transactions(source);
```

### 广告观看记录表

```sql
CREATE TABLE ad_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ad_provider TEXT NOT NULL, -- 'google_adsense', 'carbon', etc.
  ad_id TEXT,
  duration INTEGER, -- 秒
  completed BOOLEAN DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  fingerprint TEXT, -- 浏览器指纹
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_ad_views_user_id ON ad_views(user_id);
CREATE INDEX idx_ad_views_created_at ON ad_views(created_at);
CREATE INDEX idx_ad_views_ip_address ON ad_views(ip_address);
```

### 内容解锁记录表

```sql
CREATE TABLE content_unlocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_type TEXT NOT NULL, -- 'tutorial', 'tool', 'feature'
  content_id TEXT NOT NULL,
  unlock_method TEXT NOT NULL, -- 'points', 'subscription', 'free'
  points_spent INTEGER DEFAULT 0,
  expires_at DATETIME, -- 临时解锁过期时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_content_unlocks_user_id ON content_unlocks(user_id);
CREATE INDEX idx_content_unlocks_content ON content_unlocks(content_type, content_id);
```

---

## 🛡️ 防刷机制

### 1. 多维度限制

#### IP 限制
```typescript
// 同一 IP 24小时内最多看 50 个广告
const MAX_ADS_PER_IP_PER_DAY = 50

// 检查 IP 频率
const checkIPLimit = async (ipAddress: string) => {
  const count = await db.query(`
    SELECT COUNT(*) as count 
    FROM ad_views 
    WHERE ip_address = ? 
    AND created_at > datetime('now', '-24 hours')
  `, [ipAddress])
  
  return count[0].count < MAX_ADS_PER_IP_PER_DAY
}
```

#### 用户限制
```typescript
// 单个用户每天最多赚取 200 积分（广告）
const MAX_POINTS_PER_USER_PER_DAY = 200

// 两次广告之间至少间隔 30 秒
const MIN_AD_INTERVAL = 30 // 秒
```

#### 设备指纹
```typescript
// 使用 FingerprintJS 识别设备
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fp = await FingerprintJS.load()
const result = await fp.get()
const fingerprint = result.visitorId

// 同一设备每天最多 60 个广告
const MAX_ADS_PER_DEVICE_PER_DAY = 60
```

### 2. 行为分析

```typescript
// 可疑行为检测
const detectSuspiciousBehavior = (adViews: AdView[]) => {
  // 1. 观看间隔过于规律
  const intervals = calculateIntervals(adViews)
  const isRegular = standardDeviation(intervals) < 2
  
  // 2. 完成率异常（总是完整看完）
  const completionRate = adViews.filter(v => v.completed).length / adViews.length
  const isSuspicious = completionRate > 0.98
  
  // 3. 观看时间异常（太快或太慢）
  const avgDuration = average(adViews.map(v => v.duration))
  const isAbnormal = avgDuration < 5 || avgDuration > 60
  
  return isRegular || isSuspicious || isAbnormal
}

// 触发人机验证
if (detectSuspiciousBehavior(userAdViews)) {
  requireCaptcha()
  temporaryRateLimit(userId, '1 hour')
}
```

### 3. CAPTCHA 验证

```typescript
// 使用 reCAPTCHA v3
import { RecaptchaV3 } from 'recaptcha-v3'

// 观看广告前验证
const verifyHuman = async (token: string) => {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET!,
        response: token,
      }),
    }
  )
  
  const data = await response.json()
  return data.success && data.score > 0.5
}
```

### 4. 梯度奖励

```typescript
// 同一用户看广告次数越多，单次奖励越少
const calculateAdReward = (todayAdCount: number) => {
  if (todayAdCount < 10) return 10      // 前10次：10积分
  if (todayAdCount < 20) return 8       // 10-20次：8积分
  if (todayAdCount < 30) return 5       // 20-30次：5积分
  if (todayAdCount < 40) return 3       // 30-40次：3积分
  return 1                               // 40次以上：1积分
}
```

---

## 🎬 广告对接方案

### 方案 1: Google AdSense（推荐）

#### 视频广告
```typescript
// components/ads/VideoAd.tsx
'use client'

import { useState, useEffect } from 'react'

export function VideoAd({ onComplete }: { onComplete: () => void }) {
  const [adCompleted, setAdCompleted] = useState(false)
  
  useEffect(() => {
    // 加载 AdSense 视频广告
    const script = document.createElement('script')
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    script.async = true
    script.setAttribute('data-ad-client', process.env.NEXT_PUBLIC_ADSENSE_CLIENT!)
    document.body.appendChild(script)
    
    // 监听广告完成
    window.addEventListener('adCompleted', handleAdComplete)
    
    return () => {
      window.removeEventListener('adCompleted', handleAdComplete)
    }
  }, [])
  
  const handleAdComplete = async () => {
    setAdCompleted(true)
    
    // 发送积分奖励请求
    await fetch('/api/points/earn', {
      method: 'POST',
      body: JSON.stringify({
        source: 'ad_video',
        provider: 'google_adsense',
        duration: 30,
      }),
    })
    
    onComplete()
  }
  
  return (
    <div className="card-pixel p-6">
      <div className="text-center mb-4">
        <h3 className="text-pixel-base mb-2">觀看廣告賺取積分</h3>
        <p className="text-sm text-pixel-light/70">完整觀看即可獲得 10 積分</p>
      </div>
      
      {/* AdSense 广告位 */}
      <div className="ad-container">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
             data-ad-slot="YOUR_AD_SLOT"
             data-ad-format="auto"></ins>
      </div>
      
      {adCompleted && (
        <div className="text-center mt-4 text-pixel-primary font-mono">
          ✓ 已獲得 10 積分！
        </div>
      )}
    </div>
  )
}
```

### 方案 2: Carbon Ads（技术友好）

```typescript
// components/ads/CarbonAd.tsx
'use client'

import { useEffect } from 'react'

export function CarbonAd() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_CODE&placement=geeksea'
    script.id = '_carbonads_js'
    script.async = true
    
    document.getElementById('carbon-container')?.appendChild(script)
  }, [])
  
  return <div id="carbon-container" />
}
```

### 方案 3: 混合广告

```typescript
// lib/ad-manager.ts
export class AdManager {
  static async getOptimalAd(userId: string) {
    // 根据用户地理位置和偏好选择最佳广告
    const userLocation = await getUserLocation(userId)
    
    if (userLocation === 'CN') {
      return 'tencent_ads'  // 腾讯广告
    } else if (userLocation === 'SEA') {
      return 'google_adsense'  // Google 东南亚
    } else {
      return 'carbon_ads'  // 全球技术广告
    }
  }
}
```

---

## 💻 API 设计

### 获取积分余额

```typescript
// app/api/points/balance/route.ts
export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  
  const balance = await db.query(`
    SELECT balance, total_earned, total_spent 
    FROM user_points 
    WHERE user_id = ?
  `, [user.id])
  
  return Response.json(balance[0])
}
```

### 赚取积分

```typescript
// app/api/points/earn/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  const { source, provider, duration } = await request.json()
  
  // 1. 验证人机
  const isHuman = await verifyHuman(request)
  if (!isHuman) {
    return Response.json({ error: 'Verification failed' }, { status: 403 })
  }
  
  // 2. 检查限制
  const canEarn = await checkLimits(user.id, request.ip)
  if (!canEarn) {
    return Response.json({ error: 'Daily limit reached' }, { status: 429 })
  }
  
  // 3. 计算奖励
  const todayCount = await getTodayAdCount(user.id)
  const reward = calculateAdReward(todayCount)
  
  // 4. 记录广告观看
  await db.run(`
    INSERT INTO ad_views (user_id, ad_provider, duration, completed, points_earned, ip_address)
    VALUES (?, ?, ?, 1, ?, ?)
  `, [user.id, provider, duration, reward, request.ip])
  
  // 5. 更新积分
  await db.run(`
    UPDATE user_points 
    SET balance = balance + ?,
        total_earned = total_earned + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [reward, reward, user.id])
  
  // 6. 记录交易
  await logTransaction(user.id, 'earn', source, reward)
  
  return Response.json({ 
    success: true, 
    earned: reward,
    newBalance: await getBalance(user.id)
  })
}
```

### 消费积分

```typescript
// app/api/points/spend/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  const { contentType, contentId, amount } = await request.json()
  
  // 1. 检查余额
  const balance = await getBalance(user.id)
  if (balance < amount) {
    return Response.json({ error: 'Insufficient points' }, { status: 402 })
  }
  
  // 2. 扣除积分
  await db.run(`
    UPDATE user_points 
    SET balance = balance - ?,
        total_spent = total_spent + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [amount, amount, user.id])
  
  // 3. 解锁内容
  await db.run(`
    INSERT INTO content_unlocks (user_id, content_type, content_id, unlock_method, points_spent)
    VALUES (?, ?, ?, 'points', ?)
  `, [user.id, contentType, contentId, amount])
  
  // 4. 记录交易
  await logTransaction(user.id, 'spend', `unlock_${contentType}`, -amount)
  
  return Response.json({ 
    success: true,
    newBalance: balance - amount
  })
}
```

---

## 🎨 前端组件

### 积分显示组件

```typescript
// components/points/PointsBalance.tsx
'use client'

import { useEffect, useState } from 'react'
import { Coins } from 'lucide-react'

export function PointsBalance() {
  const [balance, setBalance] = useState(0)
  
  useEffect(() => {
    fetchBalance()
  }, [])
  
  const fetchBalance = async () => {
    const res = await fetch('/api/points/balance')
    const data = await res.json()
    setBalance(data.balance)
  }
  
  return (
    <div className="flex items-center gap-2 card-pixel px-4 py-2">
      <Coins className="text-pixel-warning" size={20} />
      <span className="font-mono text-pixel-lg">{balance}</span>
      <span className="text-xs text-pixel-light/70">積分</span>
    </div>
  )
}
```

### 赚取积分按钮

```typescript
// components/points/EarnPointsButton.tsx
'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { VideoAd } from '../ads/VideoAd'

export function EarnPointsButton() {
  const [showAd, setShowAd] = useState(false)
  
  return (
    <>
      <button 
        onClick={() => setShowAd(true)}
        className="btn-pixel"
      >
        <Play className="inline mr-2" size={16} />
        觀看廣告賺積分
      </button>
      
      {showAd && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <VideoAd onComplete={() => {
              setShowAd(false)
              window.location.reload() // 刷新积分
            }} />
          </div>
        </div>
      )}
    </>
  )
}
```

---

## 📱 用户体验流程

### 免费用户解锁教程

```
1. 浏览教程列表
2. 点击付费教程（显示🔒图标）
3. 弹出解锁选项：
   ┌─────────────────────────────┐
   │  解锁这篇教程               │
   │                             │
   │  方式1: 使用 50 积分        │
   │  [当前: 120 积分]           │
   │  [使用积分解锁]             │
   │                             │
   │  方式2: 观看广告赚积分      │
   │  看5个广告即可解锁          │
   │  [观看广告]                 │
   │                             │
   │  方式3: 订阅专业版          │
   │  ¥9.99/月 无限制访问        │
   │  [立即订阅]                 │
   └─────────────────────────────┘
4. 用户选择方式
5. 解锁成功，开始学习
```

### 积分抵扣订阅

```
订阅专业版 $9.99/月

可用积分: 500 积分 = $5.00

□ 使用积分抵扣
  抵扣后: $4.99

[确认订阅]
```

---

## 🎯 商业模型

### 收入来源

1. **广告收入**: 
   - Google AdSense: $2-5 CPM
   - 预计1000用户/天看广告 = $2-5/天
   - 月收入: $60-150

2. **订阅收入**:
   - 专业版 $9.99/月
   - 转化率 5% = 月收入可观

3. **积分兑换差价**:
   - 用户看广告赚10积分 = 平台收入 $0.02-0.05
   - 用户消费10积分 = 平台成本 $0.01
   - 差价 = 利润

### 用户留存

- 免费用户：通过积分系统保持活跃
- 付费用户：无广告纯净体验
- 转化路径：免费 → 积分用户 → 付费用户

---

## ✅ 实施清单

### Phase 1: 数据库和后端
- [ ] 创建积分相关数据表
- [ ] 实现积分 API
- [ ] 实现防刷机制
- [ ] 集成 reCAPTCHA

### Phase 2: 广告集成
- [ ] 注册 Google AdSense
- [ ] 集成视频广告
- [ ] 实现广告观看追踪

### Phase 3: 前端组件
- [ ] 积分显示组件
- [ ] 赚取积分按钮
- [ ] 内容解锁UI
- [ ] 积分历史记录

### Phase 4: 测试
- [ ] 防刷测试
- [ ] 积分计算测试
- [ ] 用户流程测试
- [ ] 性能测试

---

**积分系统让免费用户也能享受优质内容，同时为平台创造广告收入！** 💎
