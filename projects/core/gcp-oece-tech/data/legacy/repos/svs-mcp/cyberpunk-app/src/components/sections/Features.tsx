'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calculator, Globe, Cpu, Shield, Zap, Users } from 'lucide-react'
import { useI18nStore } from '@/lib/i18n'

export function Features() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'

  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: isEnglish ? 'Arbitrage Calculator' : '套利計算器',
      description: isEnglish 
        ? 'AI-powered cost of living comparison across Southeast Asian cities. Make informed decisions about your next destination.'
        : 'AI驅動的東南亞城市生活成本對比。為您的下一個目的地做出明智決策。',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: isEnglish ? 'Interactive Map' : '互動地圖',
      description: isEnglish
        ? 'Explore digital nomad hotspots with real-time data on visa policies, internet speed, and community size.'
        : '探索數字遊民熱點，實時查看簽證政策、網速和社群規模數據。',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: isEnglish ? 'Hardware Guides' : '硬件指南',
      description: isEnglish
        ? 'Curated recommendations for mobile workstations, from laptops to portable monitors and power solutions.'
        : '精選移動工作站推薦，從筆記本電腦到便攜顯示器和電源解決方案。',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: isEnglish ? 'Web3 Nodes' : 'Web3節點',
      description: isEnglish
        ? 'Join our decentralized community network. Run nodes, earn rewards, and contribute to the ecosystem.'
        : '加入我們的去中心化社群網絡。運行節點、賺取獎勵並為生態系統做出貢獻。',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: isEnglish ? 'Real-time Updates' : '實時更新',
      description: isEnglish
        ? 'Stay informed with live updates on visa changes, cost fluctuations, and community events.'
        : '通過簽證變化、成本波動和社群活動的實時更新保持消息靈通。',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: isEnglish ? 'Community Forum' : '社群論壇',
      description: isEnglish
        ? 'Connect with fellow nomads, share experiences, and get advice from those who have been there.'
        : '與其他遊民聯繫，分享經驗，並從有經驗的人那裡獲得建議。',
    },
  ]

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
              {isEnglish ? 'Features' : '功能特性'}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
            {isEnglish ? 'Everything you need' : '您需要的一切'}
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isEnglish
              ? 'Comprehensive tools and resources for digital nomads in Southeast Asia'
              : '為東南亞數字遊民提供全面的工具和資源'}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 
                       hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-500
                       hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-warm-500 
                            flex items-center justify-center text-white mb-6
                            group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary-500/30">
                {feature.icon}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-warm-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
