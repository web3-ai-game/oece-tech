import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, Eye, Heart, ChevronRight } from 'lucide-react'
import type { TutorialCard as TutorialCardType } from '@/types'

interface TutorialCardProps {
  tutorial: TutorialCardType
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
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

  const getCategoryText = (category: string) => {
    const map: Record<string, string> = {
      'web3': 'Web3',
      'frontend': '前端',
      'backend': '後端',
      'design': '設計',
      'tools': '工具',
      'data-science': '數據',
    }
    return map[category] || category
  }

  return (
    <Link href={`/tutorials/${tutorial.slug}`}>
      <Card className="h-full flex flex-col hover:border-pixel-primary transition-colors cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Badge variant={getDifficultyColor(tutorial.difficulty) as any}>
            {getDifficultyText(tutorial.difficulty)}
          </Badge>
          <span className="text-pixel-xs text-pixel-accent">
            {getCategoryText(tutorial.category)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-pixel-base mb-2 line-clamp-2 hover:text-pixel-primary transition-colors">
          {tutorial.title}
        </h3>
        <p className="text-xs text-pixel-light/50 mb-3 font-mono line-clamp-1">
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
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="預計時長">
              <Clock size={12} />
              <span className="hidden sm:inline">{tutorial.duration}分</span>
              <span className="sm:hidden">{tutorial.duration}&apos;</span>
            </span>
            <span className="flex items-center gap-1" title="觀看次數">
              <Eye size={12} />
              {tutorial.view_count}
            </span>
            <span className="flex items-center gap-1" title="點贊數">
              <Heart size={12} />
              {tutorial.like_count}
            </span>
          </div>
          <ChevronRight size={16} className="text-pixel-primary" />
        </div>
      </Card>
    </Link>
  )
}
