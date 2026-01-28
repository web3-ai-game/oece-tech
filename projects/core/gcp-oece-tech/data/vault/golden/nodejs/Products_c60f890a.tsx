'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Map, Database, MessageSquare, ArrowRight } from 'lucide-react'
import { useI18nStore } from '@/lib/i18n'
import Link from 'next/link'

export function Products() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'

  const products = [
    {
      icon: <Map className="w-8 h-8" />,
      title: isEnglish ? 'Interactive Map' : '互動地圖',
      description: isEnglish
        ? 'Visualize digital nomad destinations across Southeast Asia with real-time data and insights.'
        : '可視化東南亞數字遊民目的地，提供實時數據和洞察。',
      href: '/map',
      color: 'from-primary-500 to-warm-500',
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: isEnglish ? 'Node Network' : '節點網絡',
      description: isEnglish
        ? 'Join our Web3 community network. Run nodes, contribute to the ecosystem, and earn rewards.'
        : '加入我們的Web3社群網絡。運行節點、為生態系統做出貢獻並賺取獎勵。',
      href: '/nodes',
      color: 'from-warm-500 to-accent-orange',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: isEnglish ? 'Community Forum' : '社群論壇',
      description: isEnglish
        ? 'Connect with thousands of digital nomads. Share experiences, ask questions, and build relationships.'
        : '與數千名數字遊民聯繫。分享經驗、提出問題並建立關係。',
      href: '/forum',
      color: 'from-accent-orange to-primary-600',
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-warm-100 dark:bg-warm-900/30 rounded-full">
            <span className="text-sm font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">
              {isEnglish ? 'Products' : '產品'}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
            {isEnglish ? 'Our Products' : '我們的產品'}
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isEnglish
              ? 'Powerful tools designed for the modern digital nomad'
              : '為現代數字遊民設計的強大工具'}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={product.href}>
                <div className="group h-full p-10 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900
                              rounded-3xl border-2 border-neutral-200 dark:border-neutral-700
                              hover:border-primary-400 dark:hover:border-primary-400
                              transition-all duration-500 cursor-pointer
                              hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-2">
                  {/* Icon with Gradient */}
                  <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${product.color} 
                                flex items-center justify-center text-white mb-8
                                group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                    {product.icon}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    {product.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium
                                group-hover:gap-4 transition-all duration-300">
                    <span>{isEnglish ? 'Learn more' : '了解更多'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
