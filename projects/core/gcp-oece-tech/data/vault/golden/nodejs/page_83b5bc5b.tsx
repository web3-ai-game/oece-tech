'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Database, Server, Layers, GitBranch, Lock, Zap,
  Activity, BarChart3, Globe2, Shield, Code2, Terminal,
  ArrowRight, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ParticleField } from '@/components/effects/ParticleField'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useI18nStore } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'

export default function DatabasePage() {
  const { locale } = useI18nStore()
  const [stats, setStats] = useState({
    totalNodes: 8,
    activeConnections: 0,
    dataSize: '2.4 GB',
    uptime: '99.9%'
  })

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeConnections: Math.floor(Math.random() * 50) + 20
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const isEnglish = locale === 'en'

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900">
      <LanguageSwitcher />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full 
                       bg-gradient-to-r from-ice-core/20 to-frost-500/20 
                       border border-ice-core/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Database className="w-5 h-5 text-ice-glow" />
            <span className="text-sm font-mono text-frost-200">
              {isEnglish ? 'Powered by Supabase' : 'Supabase 驅動'}
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-ice-glow via-frost-200 to-steel-200 
                         bg-clip-text text-transparent">
            {isEnglish ? 'Database Infrastructure' : '數據庫基礎設施'}
          </h1>
          
          <p className="text-xl text-frost-300/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            {isEnglish 
              ? 'Enterprise-grade PostgreSQL database with real-time capabilities, built for global digital nomad networks'
              : '企業級 PostgreSQL 數據庫，具備實時功能，專為全球數字遊民網絡打造'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <DatabaseButton icon={<Terminal />}>
              {isEnglish ? 'SQL Editor' : 'SQL 編輯器'}
            </DatabaseButton>
            <DatabaseButton variant="secondary" icon={<BarChart3 />}>
              {isEnglish ? 'Analytics' : '分析儀表板'}
            </DatabaseButton>
          </div>
        </motion.div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <StatCard
            icon={<Server className="w-8 h-8" />}
            value={stats.totalNodes.toString()}
            label={isEnglish ? 'Database Nodes' : '數據庫節點'}
            trend="+2"
            color="ice"
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            value={stats.activeConnections.toString()}
            label={isEnglish ? 'Active Connections' : '活躍連接'}
            trend="live"
            color="frost"
            pulse
          />
          <StatCard
            icon={<Layers className="w-8 h-8" />}
            value={stats.dataSize}
            label={isEnglish ? 'Data Size' : '數據大小'}
            trend="+12%"
            color="steel"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            value={stats.uptime}
            label={isEnglish ? 'Uptime' : '運行時間'}
            trend="stable"
            color="ice"
          />
        </div>

        {/* Database Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <DatabaseFeature
            icon={<Zap />}
            title={isEnglish ? 'Real-time Subscriptions' : '實時訂閱'}
            description={isEnglish 
              ? 'Listen to database changes instantly with WebSocket connections. Perfect for live dashboards and collaborative features.'
              : '通過 WebSocket 連接即時監聽數據庫變化。完美適用於實時儀表板和協作功能。'}
            features={[
              isEnglish ? 'Sub-millisecond latency' : '亞毫秒級延遲',
              isEnglish ? 'Automatic reconnection' : '自動重連',
              isEnglish ? 'Filter & transform data' : '過濾和轉換數據'
            ]}
          />
          <DatabaseFeature
            icon={<Shield />}
            title={isEnglish ? 'Row Level Security' : '行級安全'}
            description={isEnglish 
              ? 'PostgreSQL RLS policies ensure users only access their own data. Built-in authentication with JWT tokens.'
              : 'PostgreSQL RLS 策略確保用戶只能訪問自己的數據。內建 JWT 令牌認證。'}
            features={[
              isEnglish ? 'Policy-based access' : '基於策略的訪問',
              isEnglish ? 'JWT authentication' : 'JWT 認證',
              isEnglish ? 'Role management' : '角色管理'
            ]}
          />
          <DatabaseFeature
            icon={<GitBranch />}
            title={isEnglish ? 'Database Branching' : '數據庫分支'}
            description={isEnglish 
              ? 'Create isolated database branches for development and testing. Merge changes safely to production.'
              : '為開發和測試創建隔離的數據庫分支。安全地將更改合併到生產環境。'}
            features={[
              isEnglish ? 'Instant branching' : '即時分支',
              isEnglish ? 'Zero downtime' : '零停機時間',
              isEnglish ? 'Easy rollback' : '輕鬆回滾'
            ]}
          />
          <DatabaseFeature
            icon={<Globe2 />}
            title={isEnglish ? 'Global Edge Network' : '全球邊緣網絡'}
            description={isEnglish 
              ? 'Distributed across multiple regions for low-latency access worldwide. Automatic failover and replication.'
              : '分佈於多個區域，實現全球低延遲訪問。自動故障轉移和複製。'}
            features={[
              isEnglish ? '10+ global regions' : '10+ 全球區域',
              isEnglish ? 'Auto-scaling' : '自動擴展',
              isEnglish ? 'CDN integration' : 'CDN 整合'
            ]}
          />
        </div>

        {/* Database Schema Preview */}
        <GlassCard className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-xl bg-ice-core/10 border border-ice-core/30">
              <Code2 className="w-8 h-8 text-ice-glow" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-frost-100">
                {isEnglish ? 'Database Schema' : '數據庫架構'}
              </h2>
              <p className="text-frost-400">
                {isEnglish ? 'Optimized for digital nomad data' : '為數字遊民數據優化'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SchemaTable
              name="nodes"
              description={isEnglish ? 'City locations & stats' : '城市位置和統計'}
              columns={['id', 'name', 'country', 'lat', 'lng', 'cost_of_living', 'internet_speed']}
            />
            <SchemaTable
              name="users"
              description={isEnglish ? 'Nomad profiles' : '遊民檔案'}
              columns={['id', 'email', 'username', 'current_location', 'bio']}
            />
            <SchemaTable
              name="experiences"
              description={isEnglish ? 'Shared stories' : '分享故事'}
              columns={['id', 'user_id', 'node_id', 'rating', 'content', 'created_at']}
            />
          </div>
        </GlassCard>

        {/* API Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CodeExample
            title={isEnglish ? 'Query Data' : '查詢數據'}
            language="javascript"
            code={`// Fetch all nodes with cost < $1500
const { data, error } = await supabase
  .from('nodes')
  .select('*')
  .lt('cost_of_living', 1500)
  .order('arbitrage_score', { ascending: false })`}
          />
          <CodeExample
            title={isEnglish ? 'Real-time Updates' : '實時更新'}
            language="javascript"
            code={`// Subscribe to node status changes
supabase
  .channel('nodes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'nodes' },
    (payload) => console.log(payload)
  )
  .subscribe()`}
          />
        </div>
      </section>
    </main>
  )
}

// Database Button Component
function DatabaseButton({ children, icon, variant = 'primary' }: {
  children: React.ReactNode
  icon: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const styles = variant === 'primary'
    ? 'bg-gradient-to-r from-ice-core to-frost-500 text-white hover:shadow-ice-glow'
    : 'bg-white/5 border-2 border-white/20 text-frost-200 hover:bg-white/10'

  return (
    <motion.button
      className={`px-8 py-4 rounded-xl font-mono text-base inline-flex items-center gap-3
                  transition-all duration-300 ${styles}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  )
}

// Stat Card Component
function StatCard({ icon, value, label, trend, color, pulse }: {
  icon: React.ReactNode
  value: string
  label: string
  trend: string
  color: 'ice' | 'frost' | 'steel'
  pulse?: boolean
}) {
  const colors = {
    ice: 'from-ice-core/20 to-ice-deep/20 border-ice-core/30',
    frost: 'from-frost-500/20 to-frost-700/20 border-frost-500/30',
    steel: 'from-steel-400/20 to-steel-600/20 border-steel-400/30',
  }

  return (
    <GlassCard hover={false} className={`bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5">
          {icon}
        </div>
        {trend === 'live' && pulse && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-300">LIVE</span>
          </motion.div>
        )}
      </div>
      <div className="text-4xl font-bold text-frost-100 mb-2">{value}</div>
      <div className="text-sm text-frost-400 mb-2">{label}</div>
      {trend !== 'live' && (
        <div className="text-xs text-ice-glow">
          {trend}
        </div>
      )}
    </GlassCard>
  )
}

// Database Feature Component
function DatabaseFeature({ icon, title, description, features }: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-ice-core/20 to-frost-500/20 border border-ice-core/30">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8 text-ice-glow' })}
        </div>
        <h3 className="text-2xl font-bold text-frost-100">{title}</h3>
      </div>
      <p className="text-frost-300/80 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-frost-200">
            <CheckCircle2 className="w-5 h-5 text-ice-core flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}

// Schema Table Component
function SchemaTable({ name, description, columns }: {
  name: string
  description: string
  columns: string[]
}) {
  return (
    <div className="p-6 rounded-xl bg-titanium-800/30 border border-steel-600/30">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-ice-core" />
        <h4 className="text-lg font-bold text-frost-100 font-mono">{name}</h4>
      </div>
      <p className="text-sm text-frost-400 mb-4">{description}</p>
      <div className="space-y-2">
        {columns.map((col, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-ice-core/50" />
            <span className="text-frost-300 font-mono">{col}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Code Example Component
function CodeExample({ title, language, code }: {
  title: string
  language: string
  code: string
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-frost-100">{title}</h3>
        <span className="text-xs text-frost-400 font-mono uppercase">{language}</span>
      </div>
      <pre className="p-4 rounded-lg bg-titanium-950/50 border border-steel-700/30 overflow-x-auto">
        <code className="text-sm text-ice-glow font-mono leading-relaxed">
          {code}
        </code>
      </pre>
    </GlassCard>
  )
}
