'use client'

import { motion } from 'framer-motion'

export function IceFrostBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Ice crystals */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-ice-glow rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Frost gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-ice-dark/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-frost-900/5 via-transparent to-ice-core/5" />
      
      {/* Metal shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-steel-300/5 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
