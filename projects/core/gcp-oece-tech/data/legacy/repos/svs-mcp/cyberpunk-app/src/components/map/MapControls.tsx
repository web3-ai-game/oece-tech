'use client'

import { motion } from 'framer-motion'
import { useMapStore } from '@/stores/mapStore'

export function MapControls() {
  const {
    rotation,
    showNodes,
    showHeatmap,
    pixelation,
    toggleRotation,
    toggleNodes,
    toggleHeatmap,
    setPixelation,
  } = useMapStore()

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-20 left-4 bg-pixelGrid/90 backdrop-blur-md border border-neon/30 rounded p-4 z-40"
    >
      <h3 className="text-neon font-mono font-bold mb-4 text-sm">MAP CONTROLS</h3>
      
      <div className="space-y-3">
        <ControlToggle
          label="Auto Rotate"
          checked={rotation}
          onChange={toggleRotation}
        />
        
        <ControlToggle
          label="Show Nodes"
          checked={showNodes}
          onChange={toggleNodes}
        />
        
        <ControlToggle
          label="Heatmap"
          checked={showHeatmap}
          onChange={toggleHeatmap}
        />
        
        <div>
          <label className="text-xs text-neon/70 font-mono block mb-2">
            Pixelation: {pixelation}
          </label>
          <input
            type="range"
            min="4"
            max="32"
            step="4"
            value={pixelation}
            onChange={(e) => setPixelation(Number(e.target.value))}
            className="w-full accent-neon"
          />
        </div>
      </div>
    </motion.div>
  )
}

function ControlToggle({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs text-neon/70 font-mono">{label}</span>
      <div
        onClick={onChange}
        className={`w-10 h-5 rounded-full transition-colors ${
          checked ? 'bg-matrix' : 'bg-darkMode'
        } relative border border-neon/30`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-4 h-4 bg-neon rounded-full shadow-neon"
        />
      </div>
    </label>
  )
}
