'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '@/stores/mapStore'
import { getStatusColor } from '@/lib/nodes'

export function NodeDetail() {
  const { selectedNode, isDetailOpen, setSelectedNode } = useMapStore()

  if (!selectedNode || !isDetailOpen) return null

  const statusColor = getStatusColor(selectedNode.status)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 h-full w-96 bg-pixelGrid/95 backdrop-blur-lg border-l-2 border-neon/30 z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-neon/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-neon font-mono mb-1">
                {selectedNode.name}
              </h2>
              <p className="text-sm text-neon/60">{selectedNode.country}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-neon/60 hover:text-neon transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor }}
            />
            <span className="text-sm font-mono uppercase" style={{ color: statusColor }}>
              {selectedNode.status}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <StatBar
            label="Arbitrage Score"
            value={selectedNode.arbitrageScore}
            max={10}
            color="#00FF41"
          />
          
          <StatItem
            label="Cost of Living"
            value={`$${selectedNode.costOfLiving}/month`}
            icon="💰"
          />
          
          <StatItem
            label="Internet Speed"
            value={`${selectedNode.internetSpeed} Mbps`}
            icon="🌐"
          />
          
          <StatBar
            label="Community"
            value={selectedNode.community}
            max={10}
            color="#00FFF0"
          />
          
          {/* Coordinates */}
          <div className="pt-4 border-t border-neon/10">
            <div className="text-xs text-neon/40 font-mono space-y-1">
              <div>LAT: {selectedNode.lat.toFixed(4)}°</div>
              <div>LNG: {selectedNode.lng.toFixed(4)}°</div>
            </div>
          </div>

          {/* Description */}
          {selectedNode.description && (
            <div className="pt-4">
              <p className="text-sm text-neon/70 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button className="btn-neon w-full border-matrix text-matrix hover:bg-matrix hover:text-darkMode">
              View Details
            </button>
            <button className="btn-neon w-full border-neon text-neon hover:bg-neon hover:text-darkMode">
              Calculate Arbitrage
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function StatBar({ label, value, max, color }: { 
  label: string
  value: number
  max: number
  color: string
}) {
  const percentage = (value / max) * 100

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-neon/70 font-mono">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2 bg-darkMode rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function StatItem({ label, value, icon }: {
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-darkMode/50 rounded">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-neon/70 font-mono">{label}</span>
      </div>
      <span className="text-sm font-bold text-neon">{value}</span>
    </div>
  )
}
