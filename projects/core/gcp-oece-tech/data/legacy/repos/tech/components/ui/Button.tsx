import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-pixel border-4 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-pixel-primary text-pixel-darker border-pixel-darker shadow-pixel hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2',
    secondary: 'bg-pixel-secondary text-pixel-darker border-pixel-darker shadow-pixel hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2',
    outline: 'bg-transparent border-pixel-primary text-pixel-primary hover:bg-pixel-primary hover:text-pixel-darker shadow-pixel hover:translate-x-1 hover:translate-y-1',
    ghost: 'bg-transparent border-transparent text-pixel-light hover:bg-pixel-dark hover:border-pixel-grid',
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-pixel-xs',
    md: 'px-6 py-3 text-pixel-sm',
    lg: 'px-8 py-4 text-pixel-base',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isLoading && 'pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          載入中...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
