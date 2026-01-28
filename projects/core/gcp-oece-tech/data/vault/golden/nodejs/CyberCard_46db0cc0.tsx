'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CyberCardProps {
  title: string
  description: string
  icon?: string
  className?: string
}

export function CyberCard({ title, description, icon, className }: CyberCardProps) {
  return (
    <motion.div
      className={cn('cyber-card group cursor-pointer', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-neon opacity-50 
                      transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-neon opacity-50 
                      transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        {icon && (
          <motion.div
            className="text-6xl mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
        
        <h3 className="text-2xl font-bold text-neon mb-3 font-mono">
          {title}
        </h3>
        
        <p className="text-neon/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hologram effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,240,0.1) 0%, rgba(147,51,234,0.1) 100%)',
        }}
      />
    </motion.div>
  )
}
