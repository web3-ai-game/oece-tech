# 广告收益积分系统

## 核心机制：看广告 → 获积分 → 解锁内容

---

## 一、积分经济模型

### 积分获取方式

```typescript
const POINTS_SYSTEM = {
  // 广告观看
  watching: {
    video_15s: 10,      // 15秒视频广告
    video_30s: 20,      // 30秒视频广告
    banner_click: 5,    // Banner点击
    interstitial: 15,   // 插页广告
    rewarded: 30,       // 激励视频
    survey: 50,         // 问卷调查
  },
  
  // 行为奖励
  actions: {
    daily_login: 5,     // 每日登录
    share_content: 10,  // 分享内容
    invite_friend: 100, // 邀请好友
    write_review: 20,   // 撰写评测
    speed_test: 15,     // 贡献测速数据
  },
  
  // 消费价格
  costs: {
    view_tutorial: 10,      // 查看教程
    download_tool: 30,      // 下载工具
    unlock_node: 50,        // 解锁节点
    premium_24h: 100,       // 24小时高级权限
    remove_ads_7d: 200,     // 7天免广告
  }
}
```

---

## 二、广告集成模块

### 1. 广告管理器

```typescript
// lib/ad-manager.ts

export class AdManager {
  private static instance: AdManager
  private adQueue: Ad[] = []
  private userPoints: number = 0
  
  // 广告提供商配置
  private providers = {
    google: {
      enabled: true,
      publisherId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
      slots: {
        banner: 'ca-pub-xxxxx',
        video: 'ca-pub-xxxxx',
        rewarded: 'ca-pub-xxxxx'
      }
    },
    custom: {
      enabled: true,
      ads: [] // 自定义广告
    }
  }
  
  // 加载广告
  async loadAd(type: AdType): Promise<Ad> {
    // 优先显示高价值广告
    const ad = await this.fetchHighValueAd(type)
    this.adQueue.push(ad)
    return ad
  }
  
  // 完成广告观看
  async completeAd(adId: string, watchTime: number): Promise<number> {
    const ad = this.adQueue.find(a => a.id === adId)
    if (!ad) return 0
    
    // 验证观看时间
    if (watchTime < ad.minWatchTime) return 0
    
    // 计算积分
    const points = this.calculatePoints(ad, watchTime)
    
    // 记录到数据库
    await this.recordAdCompletion(adId, points)
    
    // 更新用户积分
    this.userPoints += points
    
    return points
  }
  
  // 计算积分
  private calculatePoints(ad: Ad, watchTime: number): number {
    let basePoints = POINTS_SYSTEM.watching[ad.type]
    
    // 完整观看奖励
    if (watchTime >= ad.duration) {
      basePoints *= 1.5
    }
    
    // 互动奖励
    if (ad.hasInteraction) {
      basePoints += 5
    }
    
    return Math.floor(basePoints)
  }
}
```

### 2. 广告组件

```tsx
// components/ads/VideoAd.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { AdManager } from '@/lib/ad-manager'

interface VideoAdProps {
  onComplete: (points: number) => void
  skippable?: boolean
  minWatchTime?: number
}

export function VideoAd({ onComplete, skippable = false, minWatchTime = 15 }: VideoAdProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [canSkip, setCanSkip] = useState(false)
  const [points, setPoints] = useState(0)
  const startTime = useRef(Date.now())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleComplete()
          return 0
        }
        
        // 5秒后可跳过
        if (skippable && 30 - prev >= 5) {
          setCanSkip(true)
        }
        
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const handleComplete = async () => {
    const watchTime = (Date.now() - startTime.current) / 1000
    const earnedPoints = await AdManager.getInstance().completeAd('ad-id', watchTime)
    setPoints(earnedPoints)
    onComplete(earnedPoints)
  }
  
  const handleSkip = () => {
    if (canSkip) {
      handleComplete()
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        {/* 视频容器 */}
        <div className="aspect-video bg-[#1A0E2E] border-2 border-[#05FFA1] relative">
          {/* 模拟视频内容 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-[#05FFA1] mb-4 font-['VT323']">
                广告内容
              </div>
              <div className="text-2xl text-[#FFFB96]">
                {timeLeft}秒后获得积分
              </div>
            </div>
          </div>
          
          {/* 倒计时 */}
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded">
            <span className="text-white font-mono">{timeLeft}s</span>
          </div>
          
          {/* 跳过按钮 */}
          {canSkip && (
            <button
              onClick={handleSkip}
              className="absolute bottom-4 right-4 bg-[#05FFA1] text-[#0D0221] px-4 py-2 font-bold hover:shadow-[0_0_20px_#05FFA1]"
            >
              跳过 →
            </button>
          )}
        </div>
        
        {/* 积分提示 */}
        <div className="mt-4 text-center">
          <p className="text-[#05FFA1] text-lg">
            完整观看可获得 <span className="text-2xl font-bold">30</span> 积分
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## 三、积分商城

### 商城页面

```tsx
// app/shop/page.tsx

export default function ShopPage() {
  const items = [
    {
      id: 1,
      name: '24小时VIP',
      description: '解锁所有高级功能',
      cost: 100,
      icon: '👑',
      category: 'membership'
    },
    {
      id: 2,
      name: '专属传送点',
      description: '解锁日本高速节点',
      cost: 50,
      icon: '🚀',
      category: 'node'
    },
    {
      id: 3,
      name: '去广告7天',
      description: '免受广告打扰',
      cost: 200,
      icon: '🛡️',
      category: 'feature'
    },
    {
      id: 4,
      name: '高级教程包',
      description: '10个独家教程',
      cost: 150,
      icon: '📚',
      category: 'content'
    }
  ]
  
  return (
    <div className="min-h-screen bg-[#0D0221] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 积分余额 */}
        <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl text-[#05FFA1]">我的积分</h2>
              <p className="text-[#808080]">通过观看广告获得更多积分</p>
            </div>
            <div className="text-right">
              <div className="text-5xl text-[#FFFB96] font-['VT323']">
                1,250
              </div>
              <button className="mt-2 px-4 py-2 bg-[#05FFA1] text-[#0D0221] font-bold">
                获取积分 +
              </button>
            </div>
          </div>
        </div>
        
        {/* 商品列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div 
              key={item.id}
              className="bg-[#1A0E2E] border-2 border-[#01CDFE] p-6 hover:border-[#FF71CE] transition-all"
            >
              <div className="text-6xl text-center mb-4">{item.icon}</div>
              <h3 className="text-xl text-[#05FFA1] mb-2">{item.name}</h3>
              <p className="text-[#808080] text-sm mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl text-[#FFFB96] font-['VT323']">
                  {item.cost} 积分
                </span>
                <button className="px-3 py-1 bg-[#01CDFE] text-[#0D0221] font-bold hover:bg-[#05FFA1]">
                  兑换
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 四、积分任务系统

```typescript
// lib/tasks-system.ts

interface Task {
  id: string
  name: string
  description: string
  points: number
  type: 'daily' | 'weekly' | 'achievement'
  progress: number
  target: number
  completed: boolean
}

export class TasksSystem {
  // 每日任务
  static getDailyTasks(): Task[] {
    return [
      {
        id: 'daily_login',
        name: '每日登录',
        description: '登录即可获得积分',
        points: 5,
        type: 'daily',
        progress: 1,
        target: 1,
        completed: true
      },
      {
        id: 'watch_3_ads',
        name: '观看3个广告',
        description: '观看广告支持平台发展',
        points: 30,
        type: 'daily',
        progress: 1,
        target: 3,
        completed: false
      },
      {
        id: 'share_content',
        name: '分享内容',
        description: '分享任意教程到社交媒体',
        points: 10,
        type: 'daily',
        progress: 0,
        target: 1,
        completed: false
      }
    ]
  }
  
  // 成就任务
  static getAchievements(): Task[] {
    return [
      {
        id: 'first_purchase',
        name: '首次兑换',
        description: '完成第一次积分兑换',
        points: 50,
        type: 'achievement',
        progress: 0,
        target: 1,
        completed: false
      },
      {
        id: 'speed_tester',
        name: '测速达人',
        description: '贡献10次测速数据',
        points: 100,
        type: 'achievement',
        progress: 3,
        target: 10,
        completed: false
      }
    ]
  }
}
```

---

## 五、防作弊机制

```typescript
// lib/anti-cheat.ts

export class AntiCheat {
  // 检测异常行为
  static async detectAbnormalBehavior(userId: string): Promise<boolean> {
    const behaviors = await this.getUserBehaviors(userId)
    
    // 检测规则
    const rules = [
      this.checkAdWatchFrequency(behaviors),     // 广告观看频率
      this.checkClickPatterns(behaviors),        // 点击模式
      this.checkDeviceFingerprint(behaviors),    // 设备指纹
      this.checkIPConsistency(behaviors),        // IP一致性
      this.checkTimePatterns(behaviors)          // 时间模式
    ]
    
    return rules.some(result => result === true)
  }
  
  // 广告观看频率检测
  private static checkAdWatchFrequency(behaviors: UserBehavior[]): boolean {
    // 1小时内观看超过20个广告视为异常
    const hourAgo = Date.now() - 3600000
    const recentAds = behaviors.filter(b => 
      b.type === 'ad_watch' && b.timestamp > hourAgo
    )
    return recentAds.length > 20
  }
  
  // 验证码验证
  static async requireCaptcha(userId: string): Promise<boolean> {
    // 疑似作弊用户需要验证码
    const suspicious = await this.detectAbnormalBehavior(userId)
    return suspicious
  }
}
```

---

## 六、积分统计面板

```tsx
// components/PointsDashboard.tsx

export function PointsDashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-[#1A0E2E] border border-[#05FFA1] p-4">
        <div className="text-3xl text-[#05FFA1] font-bold">1,250</div>
        <div className="text-sm text-[#808080]">当前积分</div>
      </div>
      
      <div className="bg-[#1A0E2E] border border-[#01CDFE] p-4">
        <div className="text-3xl text-[#01CDFE] font-bold">520</div>
        <div className="text-sm text-[#808080]">今日获得</div>
      </div>
      
      <div className="bg-[#1A0E2E] border border-[#FF71CE] p-4">
        <div className="text-3xl text-[#FF71CE] font-bold">12</div>
        <div className="text-sm text-[#808080]">广告观看</div>
      </div>
      
      <div className="bg-[#1A0E2E] border border-[#FFFB96] p-4">
        <div className="text-3xl text-[#FFFB96] font-bold">3</div>
        <div className="text-sm text-[#808080]">待领取</div>
      </div>
    </div>
  )
}
```

---

**广告积分系统完成！**

接下来创建实时监控系统...
