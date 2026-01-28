'use client'

import { useState, useEffect } from 'react'
import { Logo } from '@/components/Logo'

interface ProfileData {
  // 基础信息
  avatar: string
  username: string
  level: number
  experience: number
  joinDate: Date
  
  // 学习数据
  completedCourses: number
  totalHours: number
  currentStreak: number
  achievements: Achievement[]
  
  // 知识库
  notes: Note[]
  mindmaps: MindMap[]
  bookmarks: Bookmark[]
  
  // 订阅
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    expiresAt?: Date
    features: string[]
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface MindMap {
  id: string
  title: string
  nodes: unknown[]
  createdAt: Date
}

interface Bookmark {
  id: string
  title: string
  url: string
  category: string
  createdAt: Date
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'achievements' | 'subscription'>('overview')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 加载用户数据
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    // 模拟数据加载
    setTimeout(() => {
      setProfileData({
        avatar: '/avatar.png',
        username: 'Explorer_007',
        level: 12,
        experience: 2750,
        joinDate: new Date('2024-06-15'),
        completedCourses: 23,
        totalHours: 156,
        currentStreak: 7,
        achievements: [
          {
            id: '1',
            title: '首次传送',
            description: '完成第一次传送门激活',
            icon: '🌟',
            unlockedAt: new Date('2024-06-20'),
            rarity: 'common'
          },
          {
            id: '2',
            title: '探索大师',
            description: '探索10个隐藏区域',
            icon: '🗺️',
            unlockedAt: new Date('2024-07-10'),
            rarity: 'rare'
          },
          {
            id: '3',
            title: '密码学专家',
            description: '完成所有密码学课程',
            icon: '🔐',
            unlockedAt: new Date('2024-08-05'),
            rarity: 'epic'
          }
        ],
        notes: [
          {
            id: '1',
            title: '密码学笔记',
            content: '# AES加密\n\n对称加密算法...',
            tags: ['密码学', 'AES'],
            createdAt: new Date('2024-09-01'),
            updatedAt: new Date('2024-09-05')
          }
        ],
        mindmaps: [],
        bookmarks: [],
        subscription: {
          plan: 'pro',
          expiresAt: new Date('2025-01-15'),
          features: [
            '无限传送次数',
            '高级装备库',
            'AI助手',
            '优先支持'
          ]
        }
      })
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0221] flex items-center justify-center">
        <div className="text-[#05FFA1] text-2xl font-['VT323'] animate-pulse">
          加载中...
        </div>
      </div>
    )
  }

  if (!profileData) {
    return null
  }

  const experienceProgress = (profileData.experience % 500) / 500 * 100

  return (
    <div className="min-h-screen bg-[#0D0221] text-[#FFFB96]">
      {/* 顶部导航 */}
      <nav className="h-16 bg-[#1A0E2E] border-b-2 border-[#05FFA1] flex items-center px-6">
        <Logo size={40} />
        <div className="ml-auto flex items-center gap-4">
          <span className="text-[#05FFA1] font-['VT323']">Lv.{profileData.level}</span>
          <div className="w-10 h-10 rounded-full bg-[#2D1B3D] border-2 border-[#05FFA1]" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* 个人信息卡片 */}
        <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-8 mb-8">
          <div className="flex items-center gap-8">
            {/* 头像 */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#2D1B3D] border-4 border-[#05FFA1] flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
              <div className="absolute bottom-0 right-0 bg-[#05FFA1] text-[#0D0221] px-2 py-1 rounded-full text-sm font-bold">
                Lv.{profileData.level}
              </div>
            </div>

            {/* 基础信息 */}
            <div className="flex-1">
              <h1 className="text-4xl text-[#05FFA1] font-['Press Start 2P'] mb-4">
                {profileData.username}
              </h1>
              
              <div className="grid grid-cols-4 gap-6 mb-4">
                <div>
                  <div className="text-2xl text-[#05FFA1] font-['VT323']">
                    {profileData.completedCourses}
                  </div>
                  <div className="text-sm text-[#808080]">完成任务</div>
                </div>
                <div>
                  <div className="text-2xl text-[#01CDFE] font-['VT323']">
                    {profileData.totalHours}h
                  </div>
                  <div className="text-sm text-[#808080]">学习时长</div>
                </div>
                <div>
                  <div className="text-2xl text-[#FF71CE] font-['VT323']">
                    {profileData.currentStreak}天
                  </div>
                  <div className="text-sm text-[#808080]">连续登录</div>
                </div>
                <div>
                  <div className="text-2xl text-[#FFFB96] font-['VT323']">
                    {profileData.achievements.length}
                  </div>
                  <div className="text-sm text-[#808080]">成就解锁</div>
                </div>
              </div>

              {/* 经验条 */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>经验值</span>
                  <span>{profileData.experience}/3000</span>
                </div>
                <div className="w-full bg-[#2D1B3D] h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#05FFA1] to-[#01CDFE] h-full transition-all"
                    style={{ width: `${experienceProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 订阅状态 */}
            <div className="text-right">
              <div className="bg-[#05FFA1] text-[#0D0221] px-4 py-2 rounded font-bold mb-2">
                {profileData.subscription.plan.toUpperCase()} PLAN
              </div>
              {profileData.subscription.expiresAt && (
                <div className="text-sm text-[#808080]">
                  有效期至: {profileData.subscription.expiresAt.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex gap-4 mb-8">
          {(['overview', 'notes', 'achievements', 'subscription'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 font-['VT323'] text-lg transition-all
                ${activeTab === tab 
                  ? 'bg-[#05FFA1] text-[#0D0221]' 
                  : 'bg-[#1A0E2E] text-[#FFFB96] hover:bg-[#2D1B3D]'
                }
              `}
            >
              {tab === 'overview' && '总览'}
              {tab === 'notes' && '知识库'}
              {tab === 'achievements' && '成就'}
              {tab === 'subscription' && '订阅'
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-8 min-h-[400px]">
          {/* 总览 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-8">
              {/* 学习进度 */}
              <div className="bg-[#0D0221] p-6 border border-[#05FFA1]/30">
                <h3 className="text-xl text-[#05FFA1] mb-4 font-['VT323']">学习进度</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>密码学基础</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-[#2D1B3D] h-2 rounded">
                      <div className="bg-[#05FFA1] h-2 rounded" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>传送门技术</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-[#2D1B3D] h-2 rounded">
                      <div className="bg-[#01CDFE] h-2 rounded" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>数字游民</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-[#2D1B3D] h-2 rounded">
                      <div className="bg-[#FF71CE] h-2 rounded" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 最近活动 */}
              <div className="bg-[#0D0221] p-6 border border-[#05FFA1]/30">
                <h3 className="text-xl text-[#01CDFE] mb-4 font-['VT323']">最近活动</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-[#05FFA1]">▸</span>
                    <span>完成密码学第3章</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#05FFA1]">▸</span>
                    <span>解锁新成就：探索大师</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#05FFA1]">▸</span>
                    <span>创建思维导图：AES算法</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#05FFA1]">▸</span>
                    <span>加入探险者公会</span>
                  </li>
                </ul>
              </div>

              {/* 装备库 */}
              <div className="bg-[#0D0221] p-6 border border-[#05FFA1]/30">
                <h3 className="text-xl text-[#FF71CE] mb-4 font-['VT323']">我的装备</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['🗡️', '🛡️', '🎒', '⚡', '🔮', '💎'].map((item, i) => (
                    <div 
                      key={i}
                      className="aspect-square bg-[#2D1B3D] border border-[#05FFA1]/30 flex items-center justify-center text-2xl hover:border-[#05FFA1] transition-all cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 知识库 */}
          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl text-[#05FFA1] font-['VT323']">我的笔记</h3>
                <button className="px-4 py-2 bg-[#05FFA1] text-[#0D0221] font-['VT323'] hover:shadow-[0_0_20px_#05FFA1]">
                  + 新建笔记
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {profileData.notes.map((note) => (
                  <div 
                    key={note.id}
                    className="bg-[#0D0221] p-4 border border-[#05FFA1]/30 hover:border-[#05FFA1] transition-all cursor-pointer"
                  >
                    <h4 className="text-lg text-[#05FFA1] mb-2">{note.title}</h4>
                    <p className="text-sm text-[#808080] mb-3 line-clamp-3">
                      {note.content.substring(0, 100)}...
                    </p>
                    <div className="flex gap-2">
                      {note.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs bg-[#2D1B3D] px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 成就 */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-4 gap-6">
              {profileData.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`
                    text-center p-6 border-2 transition-all
                    ${achievement.unlockedAt 
                      ? 'bg-[#0D0221] border-[#05FFA1]' 
                      : 'bg-[#1A0E2E]/50 border-[#808080] opacity-50'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h4 className={`
                    text-lg font-['VT323'] mb-2
                    ${achievement.rarity === 'legendary' && 'text-[#FFD700]'}
                    ${achievement.rarity === 'epic' && 'text-[#FF71CE]'}
                    ${achievement.rarity === 'rare' && 'text-[#01CDFE]'}
                    ${achievement.rarity === 'common' && 'text-[#05FFA1]'}
                  `}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-[#808080]">{achievement.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* 订阅 */}
          {activeTab === 'subscription' && (
            <div>
              <h3 className="text-2xl text-[#05FFA1] mb-6 font-['VT323']">当前订阅</h3>
              
              <div className="bg-[#0D0221] p-6 border-2 border-[#05FFA1] mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl text-[#01CDFE]">
                    {profileData.subscription.plan.toUpperCase()} PLAN
                  </h4>
                  {profileData.subscription.expiresAt && (
                    <span className="text-[#FFFB96]">
                      有效期至: {profileData.subscription.expiresAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {profileData.subscription.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#05FFA1]">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="px-8 py-3 bg-gradient-to-r from-[#05FFA1] to-[#01CDFE] text-[#0D0221] font-bold font-['VT323'] text-lg hover:shadow-[0_0_30px_#05FFA1] transition-all">
                升级到 ENTERPRISE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
