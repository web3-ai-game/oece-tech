'use client'

import { useState } from 'react'
import { Users, Coins, MessageSquare, Settings, BarChart, Shield, Gift, AlertTriangle, TrendingUp, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1337,
    userGrowth: 12,
    totalPoints: 45200,
    pointsGrowth: 8,
    forumPosts: 892,
    postsGrowth: 15,
    monthlyRevenue: 2400,
    revenueGrowth: 23,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 标题 */}
      <div className="mb-12">
        <div className="inline-block font-mono text-xs text-pixel-danger border border-pixel-danger px-3 py-1 mb-4 animate-pulse">
          [ADMIN_CONTROL_PANEL]
        </div>
        <h1 className="text-pixel-2xl text-neon mb-2">管理面板</h1>
        <p className="text-pixel-light/70 font-mono">GeekSEA 總控制台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Users}
          iconColor="text-pixel-primary"
          label="總用戶"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.userGrowth}%`}
          changePositive={true}
        />
        <StatsCard 
          icon={Coins}
          iconColor="text-pixel-warning"
          label="積分發放"
          value={`${(stats.totalPoints / 1000).toFixed(1)}K`}
          change={`+${stats.pointsGrowth}%`}
          changePositive={true}
        />
        <StatsCard 
          icon={MessageSquare}
          iconColor="text-pixel-accent"
          label="論壇帖子"
          value={stats.forumPosts.toLocaleString()}
          change={`+${stats.postsGrowth}%`}
          changePositive={true}
        />
        <StatsCard 
          icon={BarChart}
          iconColor="text-pixel-secondary"
          label="月收入"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
          change={`+${stats.revenueGrowth}%`}
          changePositive={true}
        />
      </div>
      
      {/* 管理功能 */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 用户管理 */}
        <div className="card-pixel-glow p-6">
          <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
            <Users className="text-pixel-primary" />
            用戶管理
          </h3>
          
          <div className="space-y-3 mb-6">
            <UserRow 
              username="web3developer"
              email="dev@example.com"
              points={520}
              role="user"
              status="active"
            />
            <UserRow 
              username="blockchainpro"
              email="pro@example.com"
              points={1250}
              role="pro"
              status="active"
            />
            <UserRow 
              username="spammer123"
              email="spam@example.com"
              points={0}
              role="user"
              status="banned"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="btn-pixel-outline flex-1 text-sm">
              查看全部用戶
            </button>
            <button className="btn-pixel-outline text-sm">
              <Shield size={16} className="inline" />
            </button>
          </div>
        </div>

        {/* 积分管理 */}
        <div className="card-pixel-glow p-6">
          <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
            <Coins className="text-pixel-warning" />
            積分管理
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="card-pixel p-4 bg-pixel-darker/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-pixel-light/70">今日發放</span>
                <span className="text-xl font-bold text-pixel-primary font-mono">
                  2,340
                </span>
              </div>
              <div className="h-1 bg-pixel-grid rounded-full overflow-hidden">
                <div className="h-full bg-pixel-primary w-3/4" />
              </div>
            </div>
            
            <div className="card-pixel p-4 bg-pixel-darker/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-pixel-light/70">今日消費</span>
                <span className="text-xl font-bold text-pixel-accent font-mono">
                  1,890
                </span>
              </div>
              <div className="h-1 bg-pixel-grid rounded-full overflow-hidden">
                <div className="h-full bg-pixel-accent w-2/3" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 card-pixel border-pixel-danger">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-pixel-danger" size={20} />
                <span className="text-sm">異常用戶檢測</span>
              </div>
              <span className="text-pixel-danger font-mono font-bold">3</span>
            </div>
          </div>
          
          <button className="btn-pixel-outline w-full text-sm">
            手動調整積分
          </button>
        </div>

        {/* 邀请码管理 */}
        <div className="card-pixel-glow p-6">
          <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
            <Gift className="text-pixel-secondary" />
            邀請碼管理
          </h3>
          
          <div className="space-y-3 mb-6">
            <InviteCodeRow 
              code="GEEK-LAUNCH-2025"
              type="免費"
              uses="45/100"
              expires="30天後"
            />
            <InviteCodeRow 
              code="PREMIUM-VIP-001"
              type="付費"
              uses="5/10"
              expires="永久"
            />
            <InviteCodeRow 
              code="ADMIN-SPECIAL"
              type="管理員"
              uses="0/無限"
              expires="永久"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-pixel text-sm">
              生成邀請碼
            </button>
            <button className="btn-pixel-outline text-sm">
              批量生成
            </button>
          </div>
        </div>

        {/* 内容审核 */}
        <div className="card-pixel-glow p-6">
          <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
            <MessageSquare className="text-pixel-accent" />
            內容審核
          </h3>
          
          <div className="space-y-3 mb-6">
            <ModerationItem 
              type="舉報"
              content="用戶舉報：垃圾廣告帖"
              author="anonymous"
              time="5分鐘前"
              status="pending"
            />
            <ModerationItem 
              type="敏感詞"
              content="檢測到敏感詞：某違禁內容"
              author="user123"
              time="15分鐘前"
              status="pending"
            />
            <ModerationItem 
              type="已處理"
              content="刪除垃圾帖子"
              author="spammer"
              time="1小時前"
              status="resolved"
            />
          </div>
          
          <button className="btn-pixel-outline w-full text-sm">
            查看待審核列表
          </button>
        </div>
      </div>

      {/* 系统监控 */}
      <div className="mt-8 card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
          <Activity className="text-pixel-primary" />
          系統監控
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card-pixel p-4">
            <div className="text-xs text-pixel-light/50 mb-2">CPU使用率</div>
            <div className="text-2xl font-bold text-pixel-primary font-mono mb-2">
              23%
            </div>
            <div className="h-1 bg-pixel-grid rounded-full overflow-hidden">
              <div className="h-full bg-pixel-primary w-1/4" />
            </div>
          </div>
          
          <div className="card-pixel p-4">
            <div className="text-xs text-pixel-light/50 mb-2">內存使用</div>
            <div className="text-2xl font-bold text-pixel-accent font-mono mb-2">
              45%
            </div>
            <div className="h-1 bg-pixel-grid rounded-full overflow-hidden">
              <div className="h-full bg-pixel-accent w-1/2" />
            </div>
          </div>
          
          <div className="card-pixel p-4">
            <div className="text-xs text-pixel-light/50 mb-2">磁盤使用</div>
            <div className="text-2xl font-bold text-pixel-secondary font-mono mb-2">
              18%
            </div>
            <div className="h-1 bg-pixel-grid rounded-full overflow-hidden">
              <div className="h-full bg-pixel-secondary w-1/5" />
            </div>
          </div>
          
          <div className="card-pixel p-4">
            <div className="text-xs text-pixel-light/50 mb-2">在線用戶</div>
            <div className="text-2xl font-bold text-pixel-warning font-mono mb-2">
              156
            </div>
            <div className="text-xs text-pixel-primary">
              <TrendingUp size={12} className="inline" /> +8%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 统计卡片组件
function StatsCard({ icon: Icon, iconColor, label, value, change, changePositive }: unknown) {
  return (
    <div className="card-pixel-glow p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 ${iconColor} opacity-10 blur-2xl`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <Icon className={iconColor} size={32} />
          <span className={`text-xs font-mono ${
            changePositive ? 'text-pixel-primary' : 'text-pixel-danger'
          }`}>
            {change}
          </span>
        </div>
        <div className="text-3xl font-bold font-mono mb-1">{value}</div>
        <div className="text-xs text-pixel-light/50">{label}</div>
      </div>
    </div>
  )
}

// 用户行组件
function UserRow({ username, email, points, role, status }: unknown) {
  return (
    <div className="card-pixel p-3 hover:border-pixel-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm">{username}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              role === 'pro' ? 'bg-pixel-primary/20 text-pixel-primary' : 'bg-pixel-grid text-pixel-light/50'
            }`}>
              {role}
            </span>
            {status === 'banned' && (
              <span className="text-xs px-2 py-0.5 rounded bg-pixel-danger/20 text-pixel-danger">
                已封禁
              </span>
            )}
          </div>
          <div className="text-xs text-pixel-light/50">{email}</div>
        </div>
        <div className="text-right">
          <div className="text-pixel-warning font-mono font-bold">{points}</div>
          <div className="text-xs text-pixel-light/50">積分</div>
        </div>
      </div>
    </div>
  )
}

// 邀请码行组件
function InviteCodeRow({ code, type, uses, expires }: unknown) {
  return (
    <div className="card-pixel p-3">
      <div className="flex items-center justify-between mb-2">
        <code className="text-sm text-pixel-accent font-mono">{code}</code>
        <span className="text-xs px-2 py-1 rounded bg-pixel-secondary/20 text-pixel-secondary">
          {type}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-pixel-light/50">
        <span>使用: {uses}</span>
        <span>過期: {expires}</span>
      </div>
    </div>
  )
}

// 审核项组件
function ModerationItem({ type, content, author, time, status }: unknown) {
  return (
    <div className={`card-pixel p-3 ${
      status === 'pending' ? 'border-pixel-warning' : ''
    }`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded bg-pixel-warning/20 text-pixel-warning">
          {type}
        </span>
        <span className="text-xs text-pixel-light/50">{time}</span>
      </div>
      <p className="text-sm mb-1">{content}</p>
      <div className="text-xs text-pixel-light/50">作者: {author}</div>
    </div>
  )
}
