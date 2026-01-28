'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Plane, Code } from 'lucide-react'
import { useI18nStore } from '@/lib/i18n'

export function UseCases() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'

  const useCases = [
    {
      icon: <Code className="w-6 h-6" />,
      title: isEnglish ? 'Developers' : '開發者',
      description: isEnglish
        ? 'Find the best cities for remote software development with reliable internet and vibrant tech communities.'
        : '尋找最適合遠程軟件開發的城市，擁有可靠的互聯網和充滿活力的科技社群。',
      stats: '2,500+ developers',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: isEnglish ? 'Entrepreneurs' : '創業者',
      description: isEnglish
        ? 'Discover startup-friendly environments with low costs and access to talent across Southeast Asia.'
        : '發現東南亞低成本且能接觸到人才的創業友好環境。',
      stats: '800+ startups',
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: isEnglish ? 'Students' : '學生',
      description: isEnglish
        ? 'Study remotely while exploring new cultures. Find affordable cities with great coworking spaces.'
        : '在探索新文化的同時遠程學習。尋找擁有優質共享辦公空間的經濟實惠城市。',
      stats: '1,200+ students',
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: isEnglish ? 'Travelers' : '旅行者',
      description: isEnglish
        ? 'Plan your journey with detailed guides on visa requirements, transportation, and local experiences.'
        : '通過簽證要求、交通和當地體驗的詳細指南規劃您的旅程。',
      stats: '5,000+ travelers',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-accent-orange/10 dark:bg-accent-orange/20 rounded-full">
            <span className="text-sm font-semibold text-accent-orange uppercase tracking-wider">
              {isEnglish ? 'Use Cases' : '應用場景'}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
            {isEnglish ? 'Built for everyone' : '為所有人而建'}
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isEnglish
              ? 'Whether you\'re a developer, entrepreneur, student, or traveler, we have you covered'
              : '無論您是開發者、創業者、學生還是旅行者，我們都能滿足您的需求'}
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="group p-8 bg-white dark:bg-neutral-800 rounded-2xl 
                       border border-neutral-200 dark:border-neutral-700
                       hover:border-primary-500 dark:hover:border-primary-500
                       transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 
                              flex items-center justify-center text-primary-600 dark:text-primary-400
                              group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {useCase.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full 
                                bg-primary-100 dark:bg-primary-900/30 
                                text-primary-700 dark:text-primary-300 text-sm font-medium">
                    {useCase.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
