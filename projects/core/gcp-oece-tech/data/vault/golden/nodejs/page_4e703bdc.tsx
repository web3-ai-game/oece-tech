'use client'

import { WorldMap } from '@/components/map/WorldMap'
import { NodeDetail } from '@/components/map/NodeDetail'
import { MapControls } from '@/components/map/MapControls'
import { Header } from '@/components/layout/Header'

export default function MapPage() {
  return (
    <main className="min-h-screen bg-darkMode">
      <Header />
      
      <div className="h-screen pt-16">
        <WorldMap />
        <MapControls />
        <NodeDetail />
      </div>
      
      {/* Info overlay */}
      <div className="fixed bottom-4 left-4 bg-pixelGrid/80 backdrop-blur-md border border-neon/30 rounded p-4 max-w-md z-40">
        <h3 className="text-neon font-mono font-bold mb-2 text-sm">
          🌏 SOUTHEAST ASIA DIGITAL NOMAD NETWORK
        </h3>
        <p className="text-xs text-neon/60">
          Click nodes to view details. Use mouse to rotate and zoom.
        </p>
      </div>
    </main>
  )
}
