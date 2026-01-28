'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeonButtonProps {
  children: React.ReactNode
  variant?: 'neon' | 'glitch' | 'matrix'
  onClick?: () => void
  className?: string
}

export function NeonButton({ 
  children, 
  variant = 'neon', 
  onClick,
  className 
}: NeonButtonProps) {
  const variants = {
    neon: 'border-neon text-neon hover:bg-neon hover:shadow-neon-lg hover:text-darkMode',
    glitch: 'border-glitch text-glitch hover:bg-glitch hover:shadow-glitch hover:text-darkMode',
    matrix: 'border-matrix text-matrix hover:bg-matrix hover:shadow-matrix hover:text-darkMode',
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 font-mono text-base border-2 bg-transparent',
        'transition-all duration-300 overflow-hidden inline-flex items-center gap-2',
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(90deg, transparent, ${
            variant === 'neon' ? '#00FFF0' :
            variant === 'glitch' ? '#FF0080' :
            '#00FF41'
          }, transparent)`,
        }}
      />
    </motion.button>
  )
}
