'use client'

import { motion } from 'framer-motion'

interface LoadingBarProps {
  progress?: number
  className?: string
}

export function LoadingBar({ progress, className }: LoadingBarProps) {
  return (
    <div className={`loading-bar ${className || ''}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-shadow via-neon to-glitch"
        initial={{ x: '-100%' }}
        animate={{ 
          x: progress !== undefined ? `${progress - 100}%` : '100%' 
        }}
        transition={
          progress !== undefined 
            ? { duration: 0.3 } 
            : { duration: 2, repeat: Infinity }
        }
      />
    </div>
  )
}
