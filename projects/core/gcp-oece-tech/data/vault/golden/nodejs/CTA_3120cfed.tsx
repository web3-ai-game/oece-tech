'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useI18nStore } from '@/lib/i18n'
import Link from 'next/link'

export function CTA() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'

  return (
    <section className="py-32 bg-gradient-to-br from-primary-600 via-warm-500 to-primary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.2)_1px,transparent_0)] bg-[size:48px_48px]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {isEnglish ? 'Ready to start your journey?' : '準備開始您的旅程了嗎？'}
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            {isEnglish
              ? 'Join thousands of digital nomads exploring Southeast Asia. Get access to exclusive tools, community insights, and real-time data.'
              : '加入數千名探索東南亞的數字遊民。獲取獨家工具、社群洞察和實時數據。'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <motion.button
                className="group px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg
                         shadow-lg hover:shadow-xl transition-all duration-300
                         flex items-center gap-3 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEnglish ? 'Get Started Free' : '免費開始'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/map">
              <motion.button
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg
                         hover:bg-white/10 backdrop-blur-sm transition-all duration-300
                         flex items-center gap-3 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEnglish ? 'Explore Map' : '探索地圖'}
              </motion.button>
            </Link>
          </div>

          {/* Trust Badge */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>{isEnglish ? 'No credit card required' : '無需信用卡'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>{isEnglish ? 'Free forever' : '永久免費'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
