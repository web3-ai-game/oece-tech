'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useMapStore } from '@/stores/mapStore'
import { generateHeatmapData } from '@/lib/nodes'

export function Heatmap() {
  const { showHeatmap } = useMapStore()
  
  const heatmapPoints = useMemo(() => {
    const data = generateHeatmapData()
    const points: THREE.Vector3[] = []
    const colors: THREE.Color[] = []
    
    data.forEach((point) => {
      // Convert lat/lng to 3D coordinates
      const phi = (90 - point.lat) * (Math.PI / 180)
      const theta = (point.lng + 180) * (Math.PI / 180)
      const radius = 2.05
      
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      
      points.push(new THREE.Vector3(x, y, z))
      colors.push(new THREE.Color(point.color))
    })
    
    return { points, colors }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(heatmapPoints.points.length * 3)
    const colors = new Float32Array(heatmapPoints.colors.length * 3)
    
    heatmapPoints.points.forEach((point, i) => {
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    })
    
    heatmapPoints.colors.forEach((color, i) => {
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    return geo
  }, [heatmapPoints])

  if (!showHeatmap) return null

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
