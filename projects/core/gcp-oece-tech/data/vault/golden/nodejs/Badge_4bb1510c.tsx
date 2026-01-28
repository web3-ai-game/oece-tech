import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-pixel-primary text-pixel-darker',
    secondary: 'bg-pixel-secondary text-pixel-darker',
    accent: 'bg-pixel-accent text-pixel-darker',
    warning: 'bg-pixel-warning text-pixel-darker',
    danger: 'bg-pixel-danger text-pixel-light',
  }

  return (
    <span 
      className={cn(
        'badge-pixel',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
