'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MarkdownRenderer } from '@/components/tutorial/MarkdownRenderer'
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  Share2,
  BookmarkPlus,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

export default function TutorialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [tutorial, setTutorial] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')

  useEffect(() => {
    const loadTutorial = async () => {
      try {
        // 加載教程數據
        const tutorialsData = await fetch('/data/sample-tutorials.json').then(r => r.json())
        const foundTutorial = tutorialsData.find((t: unknown) => t.slug === slug)
        
        if (foundTutorial) {
          setTutorial(foundTutorial)
          
          // 加載 Markdown 內容
          const mdContent = await fetch('/data/tutorials/solidity-basics.md').then(r => r.text())
          setMarkdownContent(mdContent)
        }
      } catch (error) {
        console.error('加載教程失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTutorial()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pixel-primary border-t-transparent animate-spin mb-4" />
          <p className="text-pixel-light/70 font-sans">載入教程中...</p>
        </div>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 md:p-12 text-center max-w-md">
          <h2 className="text-pixel-lg mb-4">教程不存在</h2>
          <p className="text-pixel-light/70 font-sans mb-6">
            未找到該教程，可能已被刪除或移動
          </p>
          <Button onClick={() => router.push('/tutorials')}>
            <ArrowLeft className="inline mr-2" size={16} />
            返回教程列表
          </Button>
        </Card>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'primary'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
      default: return 'primary'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入門'
      case 'intermediate': return '中級'
      case 'advanced': return '高級'
      default: return difficulty
    }
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Back Button - Mobile Optimized */}
      <div className="container mx-auto px-4 pt-4 md:pt-8">
        <Link href="/tutorials">
          <Button variant="ghost" size="sm" className="text-sm md:text-base">
            <ArrowLeft className="mr-1 md:mr-2" size={16} />
            返回
          </Button>
        </Link>
      </div>

      {/* Header - Mobile Optimized */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 md:p-8 mb-6 md:mb-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Badge variant={getDifficultyColor(tutorial.difficulty) as any}>
                {getDifficultyText(tutorial.difficulty)}
              </Badge>
              <span className="text-pixel-xs text-pixel-accent">
                {tutorial.category.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-pixel-xs text-pixel-light/50">
                <Clock size={12} />
                {tutorial.duration} 分
              </span>
            </div>

            {/* Title - Mobile Optimized */}
            <h1 className="text-pixel-lg md:text-pixel-xl mb-2 md:mb-3 text-neon">
              {tutorial.title}
            </h1>
            <p className="text-sm md:text-lg text-pixel-light/70 font-mono mb-4 md:mb-6">
              {tutorial.title_en}
            </p>

            {/* Description */}
            <p className="text-pixel-light/80 font-sans mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
              {tutorial.description}
            </p>

            {/* Stats & Actions - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t-2 border-pixel-grid pt-4 md:pt-6">
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-pixel-light/70">
                <span className="flex items-center gap-2">
                  <Eye size={18} />
                  {tutorial.view_count}
                </span>
                <span className="flex items-center gap-2">
                  <Heart size={18} className={isLiked ? 'text-pixel-danger fill-pixel-danger' : ''} />
                  {tutorial.like_count}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex-1 sm:flex-none"
                >
                  <Heart size={14} className={`mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isLiked ? '已贊' : '點贊'</span>
                  <span className="sm:hidden">贊</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="flex-1 sm:flex-none"
                >
                  <BookmarkPlus size={14} className={`mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isBookmarked ? '已收藏' : '收藏'</span>
                  <span className="sm:hidden">藏</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tutorial.title,
                        text: tutorial.description,
                        url: window.location.href,
                      })
                    }
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Share2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">分享</span>
                  <span className="sm:hidden">享</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Content - Mobile Optimized */}
          <Card className="p-4 md:p-8">
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={markdownContent} />
            </div>
          </Card>

          {/* Progress Button - Mobile Optimized */}
          <div className="mt-6 md:mt-8 text-center">
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              <CheckCircle2 className="mr-2" size={18} />
              標記為已完成
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
