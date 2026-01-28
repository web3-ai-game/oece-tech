'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-white/5 to-white/[0.02]',
        'backdrop-blur-xl border border-white/10',
        'shadow-2xl shadow-ice-core/5',
        hover && 'hover:border-ice-core/50 hover:shadow-ice-core/20',
        'transition-all duration-500',
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
        }}
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </motion.div>
  )
}
