'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TitaniumCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'ice' | 'steel' | 'frost'
}

export function TitaniumCard({ children, className, glowColor = 'ice' }: TitaniumCardProps) {
  const glowColors = {
    ice: 'group-hover:shadow-ice-glow group-hover:border-ice-core',
    steel: 'group-hover:shadow-steel-400 group-hover:border-steel-400',
    frost: 'group-hover:shadow-frost-400 group-hover:border-frost-400',
  }

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden',
        'bg-gradient-to-br from-titanium-800/50 to-titanium-900/80',
        'backdrop-blur-sm border-2 border-steel-700/30',
        'transition-all duration-500',
        glowColors[glowColor],
        className
      )}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
      whileHover={{ y: -5 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-ice-core/50 
                      opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-ice-core/50 
                      opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Titanium texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-steel-400/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Ice frost effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-ice-core/0 via-ice-core/5 to-ice-core/0 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Metal edge highlight */}
      <div className="absolute inset-0 border border-steel-300/10 pointer-events-none"
           style={{
             clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
           }} />
    </motion.div>
  )
}
