'use client'

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Globe } from './Globe'
import { NodeMarkers } from './NodeMarkers'
import { Heatmap } from './Heatmap'
import { useMapStore } from '@/stores/mapStore'
import { SOUTHEAST_ASIA_NODES } from '@/lib/nodes'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00FFF0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333EA" />
      
      <Stars
        radius={300}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      <Globe />
      <NodeMarkers />
      <Heatmap />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loading-bar w-64" />
    </div>
  )
}

export function WorldMap() {
  const { nodes, addNode } = useMapStore()
  
  // Initialize nodes on mount
  useEffect(() => {
    if (nodes.length === 0) {
      SOUTHEAST_ASIA_NODES.forEach(node => addNode(node))
    }
  }, [nodes.length, addNode])

  return (
    <div className="w-full h-full relative bg-darkMode">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
