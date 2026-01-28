import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glow' | 'outline'
  hover?: boolean
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: CardProps) {
  const variantStyles = {
    default: 'card-pixel',
    glow: 'card-pixel-glow',
    outline: 'card-pixel border-pixel-primary',
  }

  return (
    <div 
      className={cn(
        variantStyles[variant],
        hover && 'hover:translate-x-1 hover:translate-y-1 transition-transform',
        className
      )}
    >
      {children}
    </div>
  )
}
