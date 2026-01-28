'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlitchText({ text, className, intensity = 'medium' }: GlitchTextProps) {
  const glitchVariants = {
    low: { duration: 0.3, delay: 2 },
    medium: { duration: 0.5, delay: 1 },
    high: { duration: 0.8, delay: 0.5 },
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <motion.h1
        className="text-neon font-bold font-mono text-shadow-neon"
        animate={{
          textShadow: [
            '0 0 7px #00FFF0, 0 0 10px #00FFF0',
            '0 0 10px #00FFF0, 0 0 20px #00FFF0, 0 0 30px #00FFF0',
            '0 0 7px #00FFF0, 0 0 10px #00FFF0',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {text}
      </motion.h1>
      
      {/* Glitch layers */}
      <motion.div
        className="absolute top-0 left-0 text-glitch font-bold font-mono opacity-70"
        animate={{
          x: [-2, 2, -2],
          y: [2, -2, 2],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: glitchVariants[intensity].duration,
          repeat: Infinity,
          delay: glitchVariants[intensity].delay,
        }}
        aria-hidden="true"
      >
        {text}
      </motion.div>
      
      <motion.div
        className="absolute top-0 left-0 text-matrix font-bold font-mono opacity-70"
        animate={{
          x: [2, -2, 2],
          y: [-2, 2, -2],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: glitchVariants[intensity].duration,
          repeat: Infinity,
          delay: glitchVariants[intensity].delay + 0.1,
        }}
        aria-hidden="true"
      >
        {text}
      </motion.div>
    </div>
  )
}
