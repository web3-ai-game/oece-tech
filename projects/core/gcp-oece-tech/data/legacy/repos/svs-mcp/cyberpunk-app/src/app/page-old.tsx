'use client'

import { motion } from 'framer-motion'
import { Brain, Globe, Shield, Zap, Map, MessageSquare } from 'lucide-react'
import { GlitchText } from '@/components/effects/GlitchText'
import { NeonButton } from '@/components/ui/NeonButton'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20" />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <GlitchText
            text="OECE.TECH"
            className="text-6xl md:text-8xl font-bold mb-6"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-neon/80 mb-4 font-mono"
          >
            東南亞數字遊民網絡
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base text-neon/60 mb-12 max-w-2xl mx-auto"
          >
            地理套利計算器 × Web3影子節點社區 × AI驅動的極客硬件指南
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/map">
              <NeonButton>
                <Map className="w-4 h-4 mr-2" />
                探索地圖
              </NeonButton>
            </Link>
            <NeonButton variant="glitch">
              <MessageSquare className="w-4 h-4 mr-2" />
              加入社區
            </NeonButton>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neon mb-4 font-mono">
            核心功能
          </h2>
          <p className="text-neon/60">為數字遊民打造的一站式平台</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Globe className="w-12 h-12" />}
            title="3D世界地圖"
            description="實時查看東南亞8大城市的數字遊民節點狀態，地理套利熱力圖一目了然"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12" />}
            title="AI助手集成"
            description="Gemini AI驅動的智能問答，幫你做出最佳的遊民決策"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="Web3社區"
            description="去中心化的影子節點網絡，Supabase支持的安全存儲"
          />
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <StatCard
            icon={<Zap className="w-8 h-8 text-matrix" />}
            value="8"
            label="活躍節點"
          />
          <StatCard
            icon={<Globe className="w-8 h-8 text-neon" />}
            value="$800-3500"
            label="生活成本範圍"
          />
          <StatCard
            icon={<Brain className="w-8 h-8 text-glitch" />}
            value="AI"
            label="智能助手"
          />
          <StatCard
            icon={<Shield className="w-8 h-8 text-shadow" />}
            value="100%"
            label="開源透明"
          />
        </motion.div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="cyber-card group cursor-pointer h-full"
    >
      <div className="flex flex-col items-center text-center p-6">
        <div className="text-neon mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-neon mb-3 font-mono">
          {title}
        </h3>
        <p className="text-neon/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

function StatCard({ icon, value, label }: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="cyber-card text-center p-6">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-neon/60 text-sm font-mono">{label}</div>
    </div>
  )
}
