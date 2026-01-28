'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, TrendingUp, Wifi, DollarSign, Users, 
  Activity, AlertCircle, CheckCircle2, Clock
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useI18nStore } from '@/lib/i18n'
import { useNodes } from '@/hooks/useNodes'
import Link from 'next/link'

export default function NodesPage() {
  const { locale } = useI18nStore()
  const { nodes, loading, error } = useNodes()
  const isEnglish = locale === 'en'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900">
        <div className="text-center">
          <div className="loading-bar w-64 mb-4" />
          <p className="text-frost-300">Loading nodes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900">
        <GlassCard className="max-w-md">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-frost-100 mb-2">Error</h2>
            <p className="text-frost-300">{error}</p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900">
      <LanguageSwitcher />
      
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-ice-glow via-frost-200 to-steel-200 
                         bg-clip-text text-transparent">
            {isEnglish ? 'Digital Nomad Nodes' : '數字遊民節點'}
          </h1>
          <p className="text-xl text-frost-300/80 max-w-2xl mx-auto">
            {isEnglish 
              ? 'Real-time data from Southeast Asian cities optimized for remote work'
              : '東南亞城市實時數據，為遠程工作優化'}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <GlassCard hover={false}>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-ice-core mx-auto mb-3" />
              <div className="text-3xl font-bold text-frost-100 mb-1">{nodes.length}</div>
              <div className="text-sm text-frost-400">{isEnglish ? 'Total Cities' : '總城市數'}</div>
            </div>
          </GlassCard>
          <GlassCard hover={false}>
            <div className="text-center">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-frost-100 mb-1">
                {nodes.filter(n => n.status === 'online').length}
              </div>
              <div className="text-sm text-frost-400">{isEnglish ? 'Online Now' : '在線中'}</div>
            </div>
          </GlassCard>
          <GlassCard hover={false}>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-frost-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-frost-100 mb-1">
                {(nodes.reduce((sum, n) => sum + n.arbitrageScore, 0) / nodes.length).toFixed(1)}
              </div>
              <div className="text-sm text-frost-400">{isEnglish ? 'Avg Score' : '平均分數'}</div>
            </div>
          </GlassCard>
          <GlassCard hover={false}>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-steel-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-frost-100 mb-1">
                ${Math.min(...nodes.map(n => n.costOfLiving))}
              </div>
              <div className="text-sm text-frost-400">{isEnglish ? 'Lowest Cost' : '最低成本'}</div>
            </div>
          </GlassCard>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/nodes/${node.id}`}>
                <NodeCard node={node} isEnglish={isEnglish} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

function NodeCard({ node, isEnglish }: { node: any, isEnglish: boolean }) {
  const statusColors = {
    online: 'text-green-400 border-green-400/30 bg-green-400/10',
    offline: 'text-red-400 border-red-400/30 bg-red-400/10',
    unstable: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  }

  const statusIcons = {
    online: <CheckCircle2 className="w-4 h-4" />,
    offline: <AlertCircle className="w-4 h-4" />,
    unstable: <Clock className="w-4 h-4" />,
  }

  return (
    <GlassCard className="h-full cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-frost-100 mb-1">{node.name}</h3>
          <p className="text-sm text-frost-400">{node.country}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusColors[node.status as keyof typeof statusColors]}`}>
          {statusIcons[node.status as keyof typeof statusIcons]}
          <span className="text-xs uppercase font-mono">{node.status}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Arbitrage Score */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-frost-400">{isEnglish ? 'Arbitrage Score' : '套利分數'}</span>
            <span className="text-ice-glow font-bold">{node.arbitrageScore}/10</span>
          </div>
          <div className="h-2 bg-titanium-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ice-core to-frost-400 rounded-full"
              style={{ width: `${node.arbitrageScore * 10}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-steel-300" />
            <div>
              <div className="text-xs text-frost-400">{isEnglish ? 'Cost/mo' : '月成本'}</div>
              <div className="text-sm font-bold text-frost-100">${node.costOfLiving}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-steel-300" />
            <div>
              <div className="text-xs text-frost-400">{isEnglish ? 'Internet' : '網速'}</div>
              <div className="text-sm font-bold text-frost-100">{node.internetSpeed} Mbps</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-steel-300" />
            <div>
              <div className="text-xs text-frost-400">{isEnglish ? 'Community' : '社群'}</div>
              <div className="text-sm font-bold text-frost-100">{node.community}/10</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-steel-300" />
            <div>
              <div className="text-xs text-frost-400">{isEnglish ? 'Location' : '位置'}</div>
              <div className="text-sm font-bold text-frost-100">{node.lat.toFixed(1)}°</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {node.description && (
          <p className="text-sm text-frost-300/70 leading-relaxed border-t border-steel-700/30 pt-4">
            {node.description}
          </p>
        )}
      </div>
    </GlassCard>
  )
}
