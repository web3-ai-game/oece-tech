'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Search, Filter, BookOpen, Clock, Eye, Heart, ChevronRight } from 'lucide-react'
import type { TutorialCard, TutorialCategory, TutorialDifficulty } from '@/types'

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<TutorialCard[]>([])
  const [filteredTutorials, setFilteredTutorials] = useState<TutorialCard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<TutorialDifficulty | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // 模拟数据（后续从 API 获取）
  useEffect(() => {
    // TODO: 从 API 获取教程数据
    const mockTutorials: TutorialCard[] = [
      {
        id: 1,
        slug: 'solidity-smart-contracts-basics',
        title: 'Solidity 智能合約基礎',
        title_en: 'Solidity Smart Contracts Basics',
        description: '從零開始學習 Solidity，掌握智能合約開發的核心概念和最佳實踐',
        category: 'web3',
        difficulty: 'beginner',
        duration: 120,
        tags: ['Solidity', 'Ethereum', 'Smart Contracts'],
        view_count: 1250,
        like_count: 89,
        author: {
          username: 'web3_master',
          avatar_url: undefined,
        },
      },
      {
        id: 2,
        slug: 'nextjs-14-app-router',
        title: 'Next.js 14 App Router 完全指南',
        title_en: 'Complete Guide to Next.js 14 App Router',
        description: '深入了解 Next.js 14 的 App Router，構建現代化的 React 應用',
        category: 'frontend',
        difficulty: 'intermediate',
        duration: 180,
        tags: ['Next.js', 'React', 'TypeScript'],
        view_count: 2340,
        like_count: 156,
        author: {
          username: 'frontend_pro',
          avatar_url: undefined,
        },
      },
      {
        id: 3,
        slug: 'defi-protocol-development',
        title: 'DeFi 協議開發實戰',
        title_en: 'DeFi Protocol Development',
        description: '學習如何構建去中心化金融協議，包括借貸、DEX、流動性挖礦',
        category: 'web3',
        difficulty: 'advanced',
        duration: 240,
        tags: ['DeFi', 'Solidity', 'Web3'],
        view_count: 980,
        like_count: 72,
        author: {
          username: 'defi_expert',
          avatar_url: undefined,
        },
      },
      {
        id: 4,
        slug: 'pixel-art-css',
        title: '像素藝術與 CSS',
        title_en: 'Pixel Art with CSS',
        description: '使用 CSS 創建復古像素藝術風格，打造獨特的視覺效果',
        category: 'design',
        difficulty: 'beginner',
        duration: 90,
        tags: ['CSS', 'Pixel Art', 'Design'],
        view_count: 1560,
        like_count: 123,
        author: {
          username: 'pixel_artist',
          avatar_url: undefined,
        },
      },
      {
        id: 5,
        slug: 'nodejs-api-development',
        title: 'Node.js RESTful API 開發',
        title_en: 'Node.js RESTful API Development',
        description: '構建可擴展的 RESTful API，學習 Express、中間件、認證等',
        category: 'backend',
        difficulty: 'intermediate',
        duration: 150,
        tags: ['Node.js', 'Express', 'API'],
        view_count: 1890,
        like_count: 134,
        author: {
          username: 'backend_dev',
          avatar_url: undefined,
        },
      },
      {
        id: 6,
        slug: 'docker-kubernetes-basics',
        title: 'Docker 與 Kubernetes 入門',
        title_en: 'Docker & Kubernetes Basics',
        description: '學習容器化部署和容器編排，掌握現代化的 DevOps 技能',
        category: 'tools',
        difficulty: 'intermediate',
        duration: 200,
        tags: ['Docker', 'Kubernetes', 'DevOps'],
        view_count: 2100,
        like_count: 167,
        author: {
          username: 'devops_guru',
          avatar_url: undefined,
        },
      },
    ]

    setTutorials(mockTutorials)
    setFilteredTutorials(mockTutorials)
    setIsLoading(false)
  }, [])

  // 筛选逻辑
  useEffect(() => {
    let filtered = tutorials

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // 难度筛选
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(t => t.difficulty === selectedDifficulty)
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.title_en.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredTutorials(filtered)
  }, [selectedCategory, selectedDifficulty, searchQuery, tutorials])

  const getDifficultyColor = (difficulty: TutorialDifficulty) => {
    switch (difficulty) {
      case 'beginner': return 'primary'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
    }
  }

  const getDifficultyText = (difficulty: TutorialDifficulty) => {
    switch (difficulty) {
      case 'beginner': return '入門'
      case 'intermediate': return '中級'
      case 'advanced': return '高級'
    }
  }

  const getCategoryText = (category: TutorialCategory) => {
    const map: Record<TutorialCategory, string> = {
      'web3': 'Web3',
      'frontend': '前端',
      'backend': '後端',
      'design': '設計',
      'tools': '工具',
      'data-science': '數據',
    }
    return map[category]
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-pixel-2xl mb-4 text-neon">
          教程庫
        </h1>
        <p className="text-lg text-pixel-light/80 font-sans max-w-2xl mx-auto">
          精選專業技術教程 • 從入門到精通 • 持續更新
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-12">
        <Card className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
              <input
                type="text"
                placeholder="搜索教程... (標題、標籤、描述)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-pixel pl-12 w-full"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                <Filter className="inline mr-2" size={16} />
                分類
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="input-pixel w-full"
              >
                <option value="all">全部分類</option>
                <option value="web3">Web3 開發</option>
                <option value="frontend">前端開發</option>
                <option value="backend">後端開發</option>
                <option value="design">設計系統</option>
                <option value="tools">開發工具</option>
                <option value="data-science">數據科學</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                <Filter className="inline mr-2" size={16} />
                難度
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="input-pixel w-full"
              >
                <option value="all">全部難度</option>
                <option value="beginner">入門</option>
                <option value="intermediate">中級</option>
                <option value="advanced">高級</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-pixel-light/70 font-sans">
            找到 <span className="text-pixel-primary font-bold">{filteredTutorials.length}</span> 個教程
          </div>
        </Card>
      </div>

      {/* Tutorials Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-pixel-primary border-t-transparent animate-spin" />
          <p className="mt-4 text-pixel-light/70 font-sans">載入中...</p>
        </div>
      ) : filteredTutorials.length === 0 ? (
        <div className="text-center py-20">
          <Card className="p-12 max-w-md mx-auto">
            <BookOpen className="mx-auto mb-4 text-pixel-grid" size={64} />
            <h3 className="text-pixel-base mb-2">沒有找到教程</h3>
            <p className="text-pixel-light/70 font-sans text-sm">
              試試調整搜索條件或篩選器
            </p>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Link key={tutorial.id} href={`/tutorials/${tutorial.slug}`}>
              <Card className="h-full flex flex-col hover:border-pixel-primary transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={getDifficultyColor(tutorial.difficulty)}>
                    {getDifficultyText(tutorial.difficulty)}
                  </Badge>
                  <span className="text-pixel-xs text-pixel-accent">
                    {getCategoryText(tutorial.category)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-pixel-base mb-2 line-clamp-2">
                  {tutorial.title}
                </h3>
                <p className="text-xs text-pixel-light/50 mb-3 font-mono">
                  {tutorial.title_en}
                </p>

                {/* Description */}
                <p className="text-sm text-pixel-light/70 mb-4 font-sans line-clamp-2 flex-1">
                  {tutorial.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-pixel-xs text-pixel-accent border border-pixel-accent px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-pixel-xs text-pixel-light/50 border-t-2 border-pixel-grid pt-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {tutorial.duration}分
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {tutorial.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {tutorial.like_count}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-pixel-primary" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      {!isLoading && filteredTutorials.length > 0 && (
        <div className="mt-12 text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-pixel-lg mb-4 text-neon-cyan">
              沒找到想要的教程？
            </h3>
            <p className="text-pixel-light/70 font-sans mb-6">
              我們持續添加新的教程內容，也歡迎你提出建議
            </p>
            <Button variant="secondary">
              提交教程需求
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
