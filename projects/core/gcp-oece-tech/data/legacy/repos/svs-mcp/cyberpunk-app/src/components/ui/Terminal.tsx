'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TerminalProps {
  commands: string[]
}

export function Terminal({ commands }: TerminalProps) {
  const [displayedCommands, setDisplayedCommands] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < commands.length) {
      const timer = setTimeout(() => {
        setDisplayedCommands(prev => [...prev, commands[currentIndex]])
        setCurrentIndex(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, commands])

  return (
    <motion.div
      className="terminal max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-header">
        <div className="terminal-dot bg-glitch" />
        <div className="terminal-dot bg-neon" />
        <div className="terminal-dot bg-matrix" />
        <span className="text-xs text-matrix/70 ml-2">SYSTEM_TERMINAL_v2.0.47</span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {displayedCommands.map((cmd, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="text-neon">$</span>
              <span className="text-matrix">{cmd}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {currentIndex < commands.length && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <span className="text-neon">$</span>
            <span className="w-2 h-4 bg-matrix" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
