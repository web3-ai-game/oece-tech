'use client'

import { useState, useEffect } from 'react'
import { Coins, User, MessageSquare, BookOpen, Trophy, Settings, TrendingUp, Calendar, Award, Gift } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState({
    id: 1,
    username: 'GeekUser',
    email: 'user@geeksea.com',
    role: 'user',
    avatar: null,
    createdAt: '2025-01-15',
  })
  
  const [points, setPoints] = useState(350)
  const [stats, setStats] = useState({
    posts: 23,
    unlockedTutorials: 15,
    likes: 8,
    comments: 45,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 标题 */}
      <div className="text-center mb-12">
        <div className="inline-block font-mono text-xs text-pixel-primary border border-pixel-primary px-3 py-1 mb-4">
          [USER_DASHBOARD]
        </div>
        <h1 className="text-pixel-2xl text-neon mb-4">個人面板</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左侧：用户信息 + 快速操作 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 用户信息卡片 */}
          <div className="card-pixel-glow p-6">
            {/* 头像 */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pixel-primary to-pixel-accent rounded-full flex items-center justify-center">
              <User size={48} className="text-pixel-darker" />
            </div>
            
            {/* 用户名 */}
            <h2 className="text-pixel-lg text-center mb-1 font-mono">{user.username}</h2>
            <p className="text-sm text-pixel-light/50 text-center mb-4">{user.email}</p>
            
            {/* 积分显示 - 突出 */}
            <div className="card-pixel p-4 mb-4 bg-pixel-darker/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pixel-warning/10 blur-2xl" />
              <div className="flex items-center justify-between relative z-10">
                <Coins className="text-pixel-warning" size={40} />
                <div className="text-right">
                  <div className="text-4xl font-bold text-pixel-warning font-mono">
                    {points}
                  </div>
                  <div className="text-xs text-pixel-light/50">積分餘額</div>
                </div>
              </div>
            </div>
            
            {/* 会员天数 */}
            <div className="flex items-center justify-center gap-2 text-sm text-pixel-light/70 mb-4">
              <Calendar size={16} />
              <span>加入 {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} 天</span>
            </div>
            
            {/* 快速操作 */}
            <div className="space-y-2">
              <Link href="/tools" className="btn-pixel w-full block text-center">
                <Coins className="inline mr-2" size={16} />
                賺取積分
              </Link>
              <button className="btn-pixel-outline w-full">
                <Trophy className="inline mr-2" size={16} />
                積分記錄
              </button>
              <button className="btn-pixel-outline w-full">
                <Settings className="inline mr-2" size={16} />
                帳號設置
              </button>
            </div>
          </div>

          {/* 邀请好友 */}
          <div className="card-pixel p-6">
            <h3 className="text-pixel-base mb-3 flex items-center gap-2">
              <Gift className="text-pixel-secondary" />
              邀請好友
            </h3>
            <p className="text-sm text-pixel-light/70 mb-3">
              分享你的邀請碼，每成功邀請一人獲得 50 積分
            </p>
            <div className="card-pixel p-3 bg-pixel-darker/50 mb-3">
              <code className="text-pixel-accent font-mono">GEEK-{user.id}-INVITE</code>
            </div>
            <button className="btn-pixel-outline w-full text-sm">
              複製邀請碼
            </button>
          </div>
        </div>
        
        {/* 右侧：主要功能 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 积分抵扣订阅 */}
          <PointsDeductionCard points={points} />
          
          {/* 我的统计 */}
          <div className="card-pixel-glow p-6">
            <h3 className="text-pixel-lg mb-6 flex items-center gap-2">
              <TrendingUp className="text-pixel-primary" />
              我的統計
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard 
                icon={MessageSquare}
                label="我的帖子"
                value={stats.posts}
                color="text-pixel-accent"
              />
              <StatCard 
                icon={BookOpen}
                label="已解鎖教程"
                value={stats.unlockedTutorials}
                color="text-pixel-primary"
              />
              <StatCard 
                icon={Award}
                label="獲得點贊"
                value={stats.likes}
                color="text-pixel-secondary"
              />
              <StatCard 
                icon={MessageSquare}
                label="評論數"
                value={stats.comments}
                color="text-pixel-warning"
              />
            </div>
          </div>
          
          {/* 最近活动 */}
          <div className="card-pixel-glow p-6">
            <h3 className="text-pixel-lg mb-4">最近活動</h3>
            
            <div className="space-y-3">
              <ActivityItem 
                type="earn"
                text="觀看廣告獲得積分"
                points={10}
                time="5 分鐘前"
              />
              <ActivityItem 
                type="spend"
                text="解鎖教程：Next.js 深度解析"
                points={-50}
                time="2 小時前"
              />
              <ActivityItem 
                type="earn"
                text="每日簽到"
                points={5}
                time="今天"
              />
              <ActivityItem 
                type="earn"
                text="發表優質帖子"
                points={20}
                time="昨天"
              />
            </div>
            
            <button className="btn-pixel-outline w-full mt-4">
              查看全部記錄
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 积分抵扣卡片组件
function PointsDeductionCard({ points }: { points: number }) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise' | null>(null)
  const [usePoints, setUsePoints] = useState(0)
  
  const planPrices = {
    pro: 9.99,
    enterprise: 29.99,
  }
  
  const maxDeductible = selectedPlan ? Math.min(points, Math.floor(planPrices[selectedPlan] * 100)) : 0
  const finalPrice = selectedPlan ? planPrices[selectedPlan] - (usePoints / 100) : 0
  
  return (
    <div className="card-pixel-glow p-6">
      <h3 className="text-pixel-lg mb-4 flex items-center gap-2">
        <Coins className="text-pixel-primary" />
        積分抵扣訂閱
      </h3>
      
      <p className="text-sm text-pixel-light/70 mb-6">
        使用積分抵扣訂閱費用 (100 積分 = $1 USD)
      </p>
      
      {/* 订阅选择 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div 
          className={`card-pixel p-4 cursor-pointer transition-all ${
            selectedPlan === 'pro' ? 'border-pixel-primary shadow-lg shadow-pixel-primary/20' : ''
          }`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="text-pixel-base mb-2 font-mono">專業版</div>
          <div className="text-3xl font-bold text-pixel-primary font-mono mb-1">
            $9.99<span className="text-sm text-pixel-light/50">/月</span>
          </div>
          <div className="text-xs text-pixel-light/50">全部教程 + 無廣告</div>
        </div>
        
        <div 
          className={`card-pixel p-4 cursor-pointer transition-all ${
            selectedPlan === 'enterprise' ? 'border-pixel-primary shadow-lg shadow-pixel-primary/20' : ''
          }`}
          onClick={() => setSelectedPlan('enterprise')}
        >
          <div className="text-pixel-base mb-2 font-mono">企業版</div>
          <div className="text-3xl font-bold text-pixel-primary font-mono mb-1">
            $29.99<span className="text-sm text-pixel-light/50">/月</span>
          </div>
          <div className="text-xs text-pixel-light/50">團隊功能 + SLA</div>
        </div>
      </div>
      
      {/* 积分抵扣滑块 */}
      {selectedPlan && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-pixel-light/70">
                使用積分抵扣
              </label>
              <span className="text-sm text-pixel-accent font-mono">
                最多可用 {maxDeductible} 積分
              </span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max={maxDeductible}
              step="10"
              value={usePoints}
              onChange={(e) => setUsePoints(Number(e.target.value))}
              className="w-full h-2 bg-pixel-grid rounded-lg appearance-none cursor-pointer accent-pixel-primary"
            />
            
            <div className="flex justify-between mt-2 text-sm font-mono">
              <span className="text-pixel-accent">{usePoints} 積分</span>
              <span className="text-pixel-primary">
                抵扣 ${(usePoints / 100).toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* 最终价格 */}
          <div className="card-pixel p-4 bg-gradient-to-r from-pixel-primary/10 to-pixel-accent/10">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-pixel-light/50 mb-1">最終價格</div>
                <div className="text-sm text-pixel-light/70 line-through">
                  ${planPrices[selectedPlan].toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-pixel-primary font-mono">
                  ${finalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-pixel-accent">
                  節省 ${(usePoints / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <button className="btn-pixel w-full">
            確認訂閱
          </button>
        </div>
      )}
      
      {!selectedPlan && (
        <div className="text-center py-8 text-pixel-light/50 text-sm">
          請選擇訂閱方案
        </div>
      )}
    </div>
  )
}

// 统计卡片组件
function StatCard({ icon: Icon, label, value, color }: unknown) {
  return (
    <div className="card-pixel p-4 text-center hover:border-pixel-primary transition-colors">
      <Icon className={`mx-auto mb-2 ${color}`} size={32} />
      <div className="text-2xl font-bold font-mono mb-1">{value}</div>
      <div className="text-xs text-pixel-light/50">{label}</div>
    </div>
  )
}

// 活动项组件
function ActivityItem({ type, text, points, time }: unknown) {
  return (
    <div className="flex items-center justify-between p-3 card-pixel hover:border-pixel-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          type === 'earn' ? 'bg-pixel-primary' : 'bg-pixel-danger'
        }`} />
        <div>
          <div className="text-sm">{text}</div>
          <div className="text-xs text-pixel-light/50">{time}</div>
        </div>
      </div>
      <div className={`font-mono font-bold ${
        points > 0 ? 'text-pixel-primary' : 'text-pixel-danger'
      }`}>
        {points > 0 ? '+' : ''{points}
      </div>
    </div>
  )
}
