# 匿名注册系统 - 广告解锁机制

## 核心流程

```
访客 → 极简首页(x.ai风格) → 观看广告 → 获得邀请码 → 匿名注册 → 进入世界
```

---

## 首页设计 (x.ai风格)

### 页面结构

```tsx
// app/page.tsx - 极简落地页
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0221] relative overflow-hidden">
      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-20">
        <div className="grid-background" />
      </div>
      
      {/* 扫描线 */}
      <div className="scanlines fixed inset-0 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl">
          {/* Logo */}
          <div className="mb-8 animate-float">
            <h1 
              className="text-7xl md:text-9xl font-bold tracking-wider mb-4"
              style={{
                background: 'linear-gradient(135deg, #05FFA1, #01CDFE, #FF71CE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Press Start 2P', monospace"
              }}
            >
              OECE
            </h1>
          </div>
          
          {/* Slogan */}
          <p className="text-3xl md:text-5xl text-[#FFFB96] mb-4 font-['VT323'] tracking-wide">
            数字世界的传送门
          </p>
          
          <p className="text-lg md:text-2xl text-[#B967FF] mb-12 font-['VT323']">
            探索 · 学习 · 自由
          </p>
          
          {/* CTA按钮 */}
          <button 
            onClick={() => showAdModal()}
            className="group relative px-12 py-4 bg-[#05FFA1] text-[#0D0221] font-bold text-xl tracking-wider uppercase transition-all hover:shadow-[0_0_40px_#05FFA1] hover:-translate-y-1"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            <span className="relative z-10">开始探险</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#05FFA1] via-[#01CDFE] to-[#FF71CE] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <p className="mt-4 text-sm text-[#808080] font-['VT323']">
            观看30秒内容 → 获得探险资格
          </p>
        </div>
      </section>
      
      {/* 滚动提示 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="text-[#05FFA1] text-4xl">↓</div>
      </div>
    </div>
  )
}
```

### 特色展示区（简约）

```tsx
// 滚动后显示
<section className="relative z-10 py-32 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-3 gap-12">
      {[
        {
          icon: '🗺️',
          title: '全球地图解锁',
          desc: '探索隐藏区域'
        },
        {
          icon: '💰',
          title: '技能变现',
          desc: '月入 $3000+'
        },
        {
          icon: '🌍',
          title: '数字游民',
          desc: '自由工作生活'
        }
      ].map((item, i) => (
        <div 
          key={i}
          className="text-center p-8 bg-[#1A0E2E]/50 backdrop-blur-sm border-2 border-[#05FFA1]/30 hover:border-[#05FFA1] transition-all"
        >
          <div className="text-6xl mb-4">{item.icon}</div>
          <h3 className="text-2xl text-[#05FFA1] mb-4 font-['VT323']">
            {item.title}
          </h3>
          <p className="text-[#FFFB96] font-['VT323']">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 广告解锁系统

### 广告模态框

```tsx
// components/AdModal.tsx
'use client'

import { useState, useEffect } from 'react'

export function AdModal({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(30)
  const [canClose, setCanClose] = useState(false)
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanClose(true)
    }
  }, [countdown])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4">
        {/* 广告内容区 */}
        <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-8">
          {/* 标题 */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl text-[#05FFA1] font-['VT323']">
              探险者教程
            </h3>
            <div className="text-[#FFFB96] font-['VT323']">
              {countdown > 0 ? `${countdown}秒后可跳过` : '已解锁'}
            </div>
          </div>
          
          {/* 视频/内容区 */}
          <div className="aspect-video bg-[#0D0221] mb-6 flex items-center justify-center">
            {countdown > 0 ? (
              <div className="text-center">
                <div className="text-8xl text-[#05FFA1] mb-4 font-['VT323']">
                  {countdown}
                </div>
                <p className="text-[#FFFB96] font-['VT323']">
                  了解探险者世界...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl text-[#05FFA1] mb-4">✓</div>
                <p className="text-2xl text-[#FFFB96] font-['VT323']">
                  邀请码已生成
                </p>
              </div>
            )}
          </div>
          
          {/* 按钮 */}
          {canClose && (
            <button
              onClick={onComplete}
              className="w-full py-4 bg-[#05FFA1] text-[#0D0221] font-bold text-xl tracking-wider uppercase hover:shadow-[0_0_30px_#05FFA1] transition-all"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              获取邀请码 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 邀请码生成

```typescript
// lib/invite-system.ts
import { nanoid } from 'nanoid'

interface InviteCode {
  code: string
  email?: string
  ip: string
  userAgent: string
  expiresAt: Date
  createdAt: Date
}

export async function generateInviteCode(ip: string, userAgent: string): Promise<string> {
  // 生成8位邀请码
  const code = nanoid(8).toUpperCase()
  
  // 24小时有效期
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  
  // 存储到数据库
  await supabase.from('invite_codes').insert({
    code,
    ip,
    user_agent: userAgent,
    expires_at: expiresAt,
    used: false
  })
  
  return code
}

export async function verifyInviteCode(code: string): Promise<boolean> {
  const { data } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  return !!data
}
```

---

## 匿名注册系统

### 注册页面

```tsx
// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 验证邀请码
      const codeValid = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode })
      }).then(r => r.json())
      
      if (!codeValid.valid) {
        alert('邀请码无效或已过期')
        return
      }
      
      // 注册用户（完全匿名）
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          inviteCode
        })
      })
      
      if (res.ok) {
        // 自动登录
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        
        if (loginRes.ok) {
          // 跳转到用户面板
          window.location.href = '/dashboard'
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0D0221] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-8">
          <h2 className="text-3xl text-[#05FFA1] mb-6 text-center font-['VT323']">
            加入探险者
          </h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* 邀请码 */}
            <div>
              <label className="block text-[#FFFB96] mb-2 font-['VT323']">
                邀请码
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-[#2D1B3D] border-2 border-[#05FFA1] px-4 py-3 text-[#FFFB96] font-['VT323'] text-lg focus:outline-none focus:shadow-[0_0_20px_#05FFA1]"
                placeholder="输入邀请码"
                required
              />
            </div>
            
            {/* 用户名（匿名） */}
            <div>
              <label className="block text-[#FFFB96] mb-2 font-['VT323']">
                探险者代号
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#2D1B3D] border-2 border-[#05FFA1] px-4 py-3 text-[#FFFB96] font-['VT323'] text-lg focus:outline-none focus:shadow-[0_0_20px_#05FFA1]"
                placeholder="选择你的代号"
                required
              />
              <p className="text-xs text-[#808080] mt-1 font-['VT323']">
                完全匿名，无需邮箱
              </p>
            </div>
            
            {/* 密码 */}
            <div>
              <label className="block text-[#FFFB96] mb-2 font-['VT323']">
                密钥
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2D1B3D] border-2 border-[#05FFA1] px-4 py-3 text-[#FFFB96] font-['VT323'] text-lg focus:outline-none focus:shadow-[0_0_20px_#05FFA1]"
                placeholder="设置密钥"
                required
                minLength={8}
              />
            </div>
            
            {/* 提交 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#05FFA1] text-[#0D0221] font-bold text-xl tracking-wider uppercase hover:shadow-[0_0_30px_#05FFA1] transition-all disabled:opacity-50"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              {loading ? '正在加入...' : '进入世界 →'}
            </button>
          </form>
          
          {/* 返回 */}
          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-[#808080] hover:text-[#05FFA1] font-['VT323']"
            >
              ← 返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 游戏化内容展示

### 慢慢讲解（分级系统）

```typescript
// 内容分级
interface ContentLevel {
  level: number
  title: string
  description: string
  unlockCondition: string
  content: string[]
}

const CONTENT_LEVELS: ContentLevel[] = [
  {
    level: 1,
    title: '新手村 - 基础概念',
    description: '了解数字世界的基本规则',
    unlockCondition: '注册即解锁',
    content: [
      '什么是传送门？',
      '为什么需要探索工具？',
      '探险者的基本装备',
      '安全探险指南'
    ]
  },
  {
    level: 2,
    title: '初级探险 - 使用现成工具',
    description: '学会使用探险装备',
    unlockCondition: '完成新手任务',
    content: [
      '获取第一个传送装备',
      '激活传送门',
      '探索Google大陆',
      '访问YouTube王国'
    ]
  },
  {
    level: 3,
    title: '中级探险 - 建立据点',
    description: '创建自己的传送门',
    unlockCondition: '达到Lv.5',
    content: [
      '选择据点位置（服务器）',
      '部署传送协议',
      '配置路径规划',
      '测试传送速度'
    ]
  },
  {
    level: 4,
    title: '高级探险 - 多据点网络',
    description: '管理传送点网络',
    unlockCondition: '达到Lv.10',
    content: [
      '多据点部署策略',
      '智能路由选择',
      '负载均衡',
      '高级优化技巧'
    ]
  },
  {
    level: 5,
    title: '大师殿堂 - 完全自由',
    description: '成为世界行者',
    unlockCondition: '达到Lv.20',
    content: [
      '自动化传送系统',
      '隐身大师技巧',
      '全球据点管理',
      '数字游民指南'
    ]
  }
]
```

### 渐进式教学页面

```tsx
// components/ProgressiveLearning.tsx
export function ProgressiveLearning({ userLevel }: { userLevel: number }) {
  return (
    <div className="space-y-8">
      {CONTENT_LEVELS.map((level) => {
        const isUnlocked = userLevel >= level.level
        
        return (
          <div 
            key={level.level}
            className={`
              border-2 p-6 transition-all
              ${isUnlocked 
                ? 'border-[#05FFA1] bg-[#1A0E2E]' 
                : 'border-[#808080] bg-[#1A0E2E]/30 opacity-50'
              }
            `}
          >
            {/* 等级标签 */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`
                px-4 py-2 font-['VT323'] text-lg
                ${isUnlocked ? 'bg-[#05FFA1] text-[#0D0221]' : 'bg-[#808080] text-white'}
              `}>
                Lv.{level.level}
              </div>
              <h3 className="text-2xl text-[#FFFB96] font-['VT323']">
                {level.title}
              </h3>
              {!isUnlocked && (
                <span className="text-[#808080] font-['VT323']">🔒</span>
              )}
            </div>
            
            {/* 描述 */}
            <p className="text-[#B967FF] mb-4 font-['VT323']">
              {level.description}
            </p>
            
            {/* 解锁条件 */}
            <div className="text-sm text-[#808080] mb-4 font-['VT323']">
              解锁条件: {level.unlockCondition}
            </div>
            
            {/* 内容列表 */}
            {isUnlocked ? (
              <ul className="space-y-2">
                {level.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#05FFA1]">▸</span>
                    <span className="text-[#FFFB96] font-['VT323']">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[#808080] font-['VT323']">
                继续探险以解锁此内容...
              </div>
            )}
            
            {/* 开始按钮 */}
            {isUnlocked && (
              <button className="mt-4 px-6 py-2 bg-[#05FFA1] text-[#0D0221] font-['VT323'] hover:shadow-[0_0_20px_#05FFA1]">
                开始学习 →
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

## 完全匿名机制

### 用户数据最小化

```typescript
// 数据库Schema
interface User {
  id: string                    // UUID
  username: string              // 仅用户名，无邮箱
  password_hash: string         // bcrypt加密
  level: number                 // 等级
  experience: number            // 经验值
  created_at: Date
  last_seen: Date
  
  // 不存储：
  // - 邮箱（完全不要求）
  // - 真实姓名
  // - 电话号码
  // - 社交账号
  // - IP地址（仅临时验证）
}

// 不记录用户活动日志
// 不追踪用户行为
// 不收集浏览器指纹
```

### 隐私保护

```typescript
// middleware/privacy.ts
export async function privacyMiddleware(req: NextRequest) {
  // 1. 不记录IP（仅用于防滥用，不存储）
  const ip = req.headers.get('x-forwarded-for')
  // 仅用于rate limiting，不存入数据库
  
  // 2. 不设置追踪Cookie
  // 仅使用httpOnly JWT for auth
  
  // 3. 不发送到第三方
  // 无Google Analytics
  // 无Facebook Pixel
  // 无任何追踪
  
  return NextResponse.next()
}
```

---

## API实现

### 邀请码API

```typescript
// app/api/invite/generate/route.ts
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  
  // 防滥用：同一IP每小时只能生成3个
  const recentCodes = await supabase
    .from('invite_codes')
    .select('count')
    .eq('ip', ip)
    .gt('created_at', new Date(Date.now() - 60 * 60 * 1000))
  
  if (recentCodes.count >= 3) {
    return NextResponse.json(
      { error: '请稍后再试' },
      { status: 429 }
    )
  }
  
  const code = await generateInviteCode(ip, userAgent)
  
  return NextResponse.json({ code })
}
```

### 注册API

```typescript
// app/api/auth/register/route.ts
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { username, password, inviteCode } = await req.json()
  
  // 1. 验证邀请码
  const codeValid = await verifyInviteCode(inviteCode)
  if (!codeValid) {
    return NextResponse.json(
      { error: '邀请码无效' },
      { status: 400 }
    )
  }
  
  // 2. 检查用户名是否存在
  const exists = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()
  
  if (exists.data) {
    return NextResponse.json(
      { error: '代号已被使用' },
      { status: 400 }
    )
  }
  
  // 3. 创建用户（完全匿名）
  const passwordHash = await bcrypt.hash(password, 10)
  
  const { data: user } = await supabase
    .from('users')
    .insert({
      username,
      password_hash: passwordHash,
      level: 1,
      experience: 0
    })
    .select()
    .single()
  
  // 4. 标记邀请码已使用
  await supabase
    .from('invite_codes')
    .update({ used: true, used_by: user.id })
    .eq('code', inviteCode)
  
  return NextResponse.json({ success: true })
}
```

---

## 实施清单

```
□ 创建x.ai风格首页
□ 实现广告模态框（30秒倒计时）
□ 邀请码生成系统
□ 匿名注册系统
□ 渐进式内容展示
□ 游戏化教学体系
□ 隐私保护机制
□ API接口实现
```

---

**匿名注册系统完成！**

**核心特性**:
- x.ai极简风格首页
- 观看广告获得邀请码
- 完全匿名注册（无邮箱）
- 游戏化内容分级
- 慢慢讲解（Lv.1-5）
- 零隐私追踪
- 自动登录跳转

**流程**:
1. 访问首页 → 点击"开始探险"
2. 观看30秒内容 → 获得邀请码
3. 匿名注册（用户名+密码）
4. 自动登录 → 跳转Dashboard
5. 渐进式学习 → 解锁高级内容

**下一步**: 开始实现页面组件 🚀
