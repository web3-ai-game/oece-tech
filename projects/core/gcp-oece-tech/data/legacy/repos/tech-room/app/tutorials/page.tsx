'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, BookOpen, Clock, Eye, Heart } from 'lucide-react'
import {
  CRTScanlines,
  DOSWindow,
  RetroButton,
  RetroTag,
  PixelDivider,
  LEDNumber
} from '@/components/retro/RetroEffects'

// 模拟教程数据（实际从MD文件读取）
const MOCK_TUTORIALS = [
  {
    slug: 'google-email',
    category: 'getting-started',
    title: 'Google郵箱註冊完整指南',
    description: '從零開始註冊Google郵箱，包含手機驗證、隱私設置等完整步驟',
    difficulty: 'easy',
    tags: ['email', 'google', 'registration'],
    author: 'anonymous',
    points: 0,
    views: 2300,
    likes: 156,
    created: '2025-10-15',
    updated: '2025-10-19'
  },
  {
    slug: 'vpn-setup',
    category: 'vpn-tech',
    title: 'VPN完整搭建指南',
    description: '手把手教你在VPS上搭建自己的VPN服務器',
    difficulty: 'medium',
    tags: ['vpn', 'vps', 'server'],
    author: 'anonymous',
    points: 50,
    views: 1800,
    likes: 234,
    created: '2025-10-10',
    updated: '2025-10-18'
  },
  {
    slug: 'social-engineering',
    category: 'anonymity',
    title: '社會工程學防範指南',
    description: '了解社工攻擊手段，學會保護個人信息',
    difficulty: 'hard',
    tags: ['security', 'privacy', 'social-engineering'],
    author: 'anonymous',
    points: 100,
    views: 1500,
    likes: 189,
    created: '2025-10-05',
    updated: '2025-10-17'
  }
]

const CATEGORIES = [
  { id: 'all', name: '全部', emoji: '📚', count: 30 },
  { id: 'getting-started', name: '出海第一步', emoji: '🚀', count: 8 },
  { id: 'vpn-tech', name: 'VPN/SS技術', emoji: '🔐', count: 6 },
  { id: 'anonymity', name: '匿名化技術', emoji: '🛡️', count: 7 },
  { id: 'kali-linux', name: 'Kali實戰', emoji: '🐧', count: 4 }
]

const DIFFICULTIES = [
  { id: 'all', name: '全部難度', color: 'primary' },
  { id: 'easy', name: '簡單', color: 'primary' },
  { id: 'medium', name: '中等', color: 'warning' },
  { id: 'hard', name: '困難', color: 'danger' },
  { id: 'hell', name: '地獄', color: 'secondary' }
]

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  const filteredTutorials = MOCK_TUTORIALS.filter(tutorial => {
    const matchCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    const matchDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty
    const matchSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchCategory && matchDifficulty && matchSearch
  })

  return (
    <div className="min-h-screen bg-pixel-darker p-4">
      <CRTScanlines />
      
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-pixel-primary mb-2">
            &gt; TUTORIALS_
          </h1>
          <p className="text-pixel-light/60 font-mono">
            30+ 專業技術教程 | 從入門到精通
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-6">
          <DOSWindow title="[ CATEGORIES ]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 border-2 transition-all ${
                    selectedCategory === cat.id
                      ? 'border-pixel-primary bg-pixel-primary/20'
                      : 'border-pixel-grid hover:border-pixel-primary'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className="text-sm font-bold text-pixel-light mb-1">
                    {cat.name}
                  </div>
                  <LEDNumber value={cat.count} />
                </button>
              ))}
            </div>
          </DOSWindow>
        </div>

        {/* 搜索和筛选 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* 搜索框 */}
          <DOSWindow title="[ SEARCH ]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索教程標題或標籤..."
                className="w-full px-4 py-3 bg-pixel-darker border-4 border-pixel-grid text-pixel-light font-mono
                         focus:border-pixel-primary focus:outline-none transition-colors pl-12"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pixel-primary" />
            </div>
          </DOSWindow>

          {/* 难度筛选 */}
          <DOSWindow title="[ DIFFICULTY ]">
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`px-4 py-2 border-2 font-mono text-sm transition-all ${
                    selectedDifficulty === diff.id
                      ? 'border-pixel-primary bg-pixel-primary text-pixel-darker'
                      : 'border-pixel-grid text-pixel-light hover:border-pixel-primary&apos;
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </DOSWindow>
        </div>

        {/* 排序 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-pixel-light/60 font-mono">
            找到 <LEDNumber value={filteredTutorials.length} /> 個教程
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-pixel-darker border-2 border-pixel-grid text-pixel-light font-mono
                     focus:border-pixel-primary focus:outline-none transition-colors"
          >
            <option value="latest">最新</option>
            <option value="popular">最熱門</option>
            <option value="likes">最多點讚</option>
          </select>
        </div>

        {/* 教程列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.category}/${tutorial.slug}`}
            >
              <DOSWindow 
                title={`[ ${tutorial.category.toUpperCase()} ]`}
                className="h-full hover:border-pixel-primary transition-all"
              >
                {/* 难度标签 */}
                <div className="flex items-center justify-between mb-3">
                  <RetroTag color={
                    tutorial.difficulty === 'easy' ? 'primary' :
                    tutorial.difficulty === 'medium' ? 'warning' :
                    tutorial.difficulty === 'hard' ? 'danger' : 'secondary'
                  }>
                    {tutorial.difficulty === 'easy' ? '簡單' :
                     tutorial.difficulty === 'medium' ? '中等' :
                     tutorial.difficulty === 'hard' ? '困難' : '地獄'
                  </RetroTag>
                  
                  {tutorial.points > 0 ? (
                    <RetroTag color="warning">
                      💰 {tutorial.points}
                    </RetroTag>
                  ) : (
                    <RetroTag color="primary">免費</RetroTag>
                  )}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-bold text-pixel-light mb-2 line-clamp-2">
                  {tutorial.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-pixel-light/70 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                <PixelDivider />

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-pixel-grid text-pixel-accent text-xs font-mono border border-pixel-grid"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 元数据 */}
                <div className="flex items-center justify-between text-xs text-pixel-light/60 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {tutorial.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {tutorial.likes}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {tutorial.updated}
                  </span>
                </div>
              </DOSWindow>
            </Link>
          ))}
        </div>

        {/* 空状态 */}
        {filteredTutorials.length === 0 && (
          <DOSWindow title="[ NO RESULTS ]">
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-pixel-light/60 font-mono">
                沒有找到符合條件的教程
              </p>
            </div>
          </DOSWindow>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <DOSWindow title="[ CONTRIBUTE ]">
            <div className="py-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold font-mono text-pixel-primary mb-3">
                想要貢獻教程？
              </h3>
              <p className="text-sm text-pixel-light/70 mb-6">
                在GitHub上編寫MD文件，推送即可自動部署
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://github.com/your-repo/tutorials"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RetroButton>
                    查看GitHub倉庫
                  </RetroButton>
                </a>
                <Link href="/auth/register">
                  <RetroButton variant="outline">
                    註冊賺取積分
                  </RetroButton>
                </Link>
              </div>
            </div>
          </DOSWindow>
        </div>
      </div>
    </div>
  )
}
