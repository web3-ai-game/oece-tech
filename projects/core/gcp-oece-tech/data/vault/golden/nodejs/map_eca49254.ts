import { Vector3 } from 'three'

export interface NodeLocation {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  position?: Vector3
  status: 'online' | 'offline' | 'unstable'
  arbitrageScore: number
  costOfLiving: number
  internetSpeed: number
  community: number
  description?: string
}

export interface HeatmapData {
  lat: number
  lng: number
  value: number
  color: string
}

export interface MapSettings {
  rotation: boolean
  showNodes: boolean
  showHeatmap: boolean
  pixelation: number
}

export interface NodeInteraction {
  selectedNode: NodeLocation | null
  hoveredNode: NodeLocation | null
  isDetailOpen: boolean
}
