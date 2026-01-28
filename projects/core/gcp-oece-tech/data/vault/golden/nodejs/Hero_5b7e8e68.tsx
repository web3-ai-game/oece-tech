'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useI18nStore } from '@/lib/i18n'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'
  
  const translations = {
    en: {
      subtitle: "Southeast Asia Digital Nomad Network",
      description: "AI-Driven Arbitrage Calculator × Web3 Community Nodes × Mobile Hardware Guides for Southeast Asia",
      exploreMap: "Explore Map",
      viewNodes: "View Nodes",
      stats: {
        nodes: "Active Nodes",
        countries: "Countries", 
        community: "Community",
        support: "Support"
      }
    },
    'zh-TW': {
      subtitle: "東南亞數字遊民網絡",
      description: "地理套利計算器 × Web3影子節點社群 × AI驅動的極客硬件指南",
      exploreMap: "探索地圖",
      viewNodes: "查看節點",
      stats: {
        nodes: "活躍節點",
        countries: "國家",
        community: "社群成員",
        support: "全天支持"
      }
    }
  }
  
  const t = translations[locale]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-warm-50 via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] bg-[size:32px_32px]" />
      
      {/* Warm Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-200/30 dark:bg-warm-900/20 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Logo */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight mb-4 relative">
              <span className="bg-gradient-to-r from-primary-600 via-warm-500 to-primary-600 bg-clip-text text-transparent">
                OECE
              </span>
              <span className="text-neutral-900 dark:text-neutral-100">.TECH</span>
              
              {/* Decorative underline */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full" />
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            className="text-2xl md:text-4xl text-neutral-700 dark:text-neutral-300 mb-6 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link href="/map">
              <motion.button
                className="group px-10 py-5 bg-gradient-to-r from-primary-600 to-warm-500 hover:from-primary-700 hover:to-warm-600 
                         text-white font-bold rounded-xl
                         shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 
                         transition-all duration-300
                         flex items-center gap-3 text-lg relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="w-5 h-5" />
                {t.exploreMap}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/nodes">
              <motion.button
                className="px-10 py-5 bg-white/10 dark:bg-neutral-800/50 backdrop-blur-sm border-2 border-neutral-300 dark:border-neutral-600 
                         text-neutral-900 dark:text-neutral-100 font-bold rounded-xl
                         hover:bg-white/20 dark:hover:bg-neutral-700/50 hover:border-primary-400 dark:hover:border-primary-400
                         shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.viewNodes}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {[
              { value: '50+', label: t.stats.nodes },
              { value: '15+', label: t.stats.countries },
              { value: '1000+', label: t.stats.community },
              { value: '24/7', label: t.stats.support },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-neutral-400 dark:border-neutral-600 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-primary-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
