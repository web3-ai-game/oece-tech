'use client'

import Link from 'next/link'
import { 
  User, Coins, BookOpen, MessageSquare, TrendingUp, Settings, 
  Eye, Trophy, Clock, Download, Star, LogOut 
} from 'lucide-react'
import {
  CRTScanlines,
  DOSWindow,
  RetroCard,
  RetroButton,
  RetroTag,
  LEDNumber,
  PixelProgressBar,
  PixelDivider,
  PixelIcon
} from '@/components/retro/RetroEffects'

export default function DashboardPage() {
  // 模拟用户数据
  const userData = {
    username: '神秘駭客#1024',
    email: 'anonymous@oece.tech',
    points: 1580,
    level: 5,
    experience: 75,
    memberSince: '2025-10-01',
    tutorialsViewed: 42,
    postsCreated: 15,
    commentsCount: 89,
    likesReceived: 234
  }

  return (
    <div className="min-h-screen bg-pixel-darker p-4 relative">
      <CRTScanlines />
      
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-mono text-pixel-primary mb-2">
              &gt; DASHBOARD_
            </h1>
            <p className="text-sm text-pixel-light/60 font-mono">
              歡迎回來, {userData.username}
            </p>
          </div>
          <RetroButton variant="outline">
            <LogOut size={18} className="mr-2" />
            登出
          </RetroButton>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* 左侧 - 用户信息 */}
          <div className="space-y-6">
            
            {/* 用户卡片 */}
            <DOSWindow title="[ USER PROFILE ]">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-pixel-primary/20 flex items-center justify-center mx-auto mb-4 text-5xl">
                  <PixelIcon type="user" />
                </div>
                <h3 className="text-xl font-bold font-mono text-pixel-light mb-1">
                  {userData.username}
                </h3>
                <p className="text-sm text-pixel-light/60 font-mono">
                  {userData.email}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-pixel-grid pb-2">
                  <span className="text-sm text-pixel-light">等級</span>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-pixel-warning" />
                    <LEDNumber value={`LV ${userData.level}`} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-pixel-light/60">經驗值</span>
                    <span className="text-xs text-pixel-primary font-mono">{userData.experience}%</span>
                  </div>
                  <PixelProgressBar value={userData.experience} />
                </div>

                <div className="flex items-center justify-between border-b-2 border-pixel-grid pb-2">
                  <span className="text-sm text-pixel-light">會員時長</span>
                  <span className="text-sm text-pixel-accent font-mono">
                    <Clock size={14} className="inline mr-1" />
                    {Math.floor((Date.now() - new Date(userData.memberSince).getTime()) / (1000 * 60 * 60 * 24))} 天
                  </span>
                </div>
              </div>

              <PixelDivider />

              <Link href="/settings">
                <RetroButton variant="outline" className="w-full justify-center">
                  <Settings size={18} className="mr-2" />
                  設置
                </RetroButton>
              </Link>
            </DOSWindow>

            {/* 积分卡片 */}
            <DOSWindow title="[ POINTS BALANCE ]">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">
                  <PixelIcon type="coin" />
                </div>
                <div className="mb-2">
                  <LEDNumber value={userData.points.toLocaleString()} />
                </div>
                <p className="text-xs text-pixel-light/60 font-mono">
                  當前積分餘額
                </p>
              </div>

              <div className="space-y-2">
                <Link href="/points/earn">
                  <RetroButton className="w-full justify-center">
                    <TrendingUp size={18} className="mr-2" />
                    賺取積分
                  </RetroButton>
                </Link>
                <Link href="/pricing">
                  <RetroButton variant="outline" className="w-full justify-center">
                    <Star size={18} className="mr-2" />
                    升級會員
                  </RetroButton>
                </Link>
              </div>
            </DOSWindow>
          </div>

          {/* 中间 - 统计数据 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <RetroCard title="教程">
                <div className="text-center py-2">
                  <div className="text-2xl mb-2"><PixelIcon type="book" /></div>
                  <LEDNumber value={userData.tutorialsViewed} />
                  <p className="text-xs text-pixel-light/60 mt-1">已學習</p>
                </div>
              </RetroCard>

              <RetroCard title="帖子">
                <div className="text-center py-2">
                  <div className="text-2xl mb-2"><PixelIcon type="chat" /></div>
                  <LEDNumber value={userData.postsCreated} />
                  <p className="text-xs text-pixel-light/60 mt-1">已發布</p>
                </div>
              </RetroCard>

              <RetroCard title="評論">
                <div className="text-center py-2">
                  <div className="text-2xl mb-2">💬</div>
                  <LEDNumber value={userData.commentsCount} />
                  <p className="text-xs text-pixel-light/60 mt-1">已評論</p>
                </div>
              </RetroCard>

              <RetroCard title="點讚">
                <div className="text-center py-2">
                  <div className="text-2xl mb-2"><PixelIcon type="star" /></div>
                  <LEDNumber value={userData.likesReceived} />
                  <p className="text-xs text-pixel-light/60 mt-1">已獲得</p>
                </div>
              </RetroCard>
            </div>

            {/* 最近活动 */}
            <DOSWindow title="[ RECENT ACTIVITY ]">
              <div className="space-y-3">
                {[
                  { type: 'tutorial', title: '完成教程: Google郵箱註冊指南', time: '2小時前', points: '+50' },
                  { type: 'post', title: '發布帖子: VPN推薦討論', time: '5小時前', points: '+20' },
                  { type: 'comment', title: '評論: SSH配置技巧', time: '1天前', points: '+5' },
                  { type: 'achievement', title: '獲得成就: 學習達人', time: '2天前', points: '+100' }
                ].map((activity, i) => (
                  <div key={i} className="border-2 border-pixel-grid p-3 hover:border-pixel-primary transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-pixel-light mb-1">&gt; {activity.title}</p>
                        <p className="text-xs text-pixel-light/60 font-mono">
                          <Clock size={12} className="inline mr-1" />
                          {activity.time}
                        </p>
                      </div>
                      <RetroTag color="primary">{activity.points}</RetroTag>
                    </div>
                  </div>
                ))}
              </div>
            </DOSWindow>

            {/* 我的教程 */}
            <DOSWindow title="[ MY TUTORIALS ]">
              <div className="space-y-3">
                {[
                  { title: 'Google郵箱註冊完整指南', progress: 100, status: 'completed' },
                  { title: 'VPN搭建教程', progress: 75, status: 'in-progress' },
                  { title: 'Tor網絡使用指南', progress: 30, status: 'in-progress' },
                  { title: 'Kali環境搭建', progress: 0, status: 'not-started' }
                ].map((tutorial, i) => (
                  <div key={i} className="border-2 border-pixel-grid p-3">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-bold text-pixel-light flex-1">
                        {tutorial.title}
                      </h4>
                      <RetroTag color={
                        tutorial.status === 'completed' ? 'primary' :
                        tutorial.status === 'in-progress' ? 'warning' : 'accent'
                      }>
                        {tutorial.status === 'completed' ? '✓ 完成' :}
                         tutorial.status === 'in-progress' ? '進行中' : '未開始'}
                      </RetroTag>
                    </div>
                    <PixelProgressBar value={tutorial.progress} />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link href="/tutorials">
                  <RetroButton variant="outline" className="w-full justify-center">
                    <BookOpen size={18} className="mr-2" />
                    瀏覽更多教程
                  </RetroButton>
                </Link>
              </div>
            </DOSWindow>

            {/* 快捷操作 */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/tutorials">
                <RetroCard>
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2"><PixelIcon type="book" /></div>
                    <p className="text-sm font-mono text-pixel-light">學習教程</p>
                  </div>
                </RetroCard>
              </Link>

              <Link href="/forum">
                <RetroCard>
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2"><PixelIcon type="chat" /></div>
                    <p className="text-sm font-mono text-pixel-light">論壇討論</p>
                  </div>
                </RetroCard>
              </Link>

              <Link href="/tools">
                <RetroCard>
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🛠️</div>
                    <p className="text-sm font-mono text-pixel-light">實用工具</p>
                  </div>
                </RetroCard>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
