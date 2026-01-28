import { create } from 'zustand'
import { NodeLocation, NodeInteraction, MapSettings } from '@/types/map'

interface MapStore extends NodeInteraction, MapSettings {
  nodes: NodeLocation[]
  setSelectedNode: (node: NodeLocation | null) => void
  setHoveredNode: (node: NodeLocation | null) => void
  toggleDetail: () => void
  updateNodeStatus: (nodeId: string, status: NodeLocation['status']) => void
  addNode: (node: NodeLocation) => void
  toggleRotation: () => void
  toggleNodes: () => void
  toggleHeatmap: () => void
  setPixelation: (value: number) => void
}

export const useMapStore = create<MapStore>((set) => ({
  // Node Interaction State
  selectedNode: null,
  hoveredNode: null,
  isDetailOpen: false,
  
  // Map Settings
  rotation: true,
  showNodes: true,
  showHeatmap: true,
  pixelation: 8,
  
  // Nodes Data
  nodes: [],
  
  // Actions
  setSelectedNode: (node) => set({ selectedNode: node, isDetailOpen: !!node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  toggleDetail: () => set((state) => ({ isDetailOpen: !state.isDetailOpen })),
  
  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, status } : node
      ),
    })),
  
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  
  toggleRotation: () => set((state) => ({ rotation: !state.rotation })),
  toggleNodes: () => set((state) => ({ showNodes: !state.showNodes })),
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
  setPixelation: (value) => set({ pixelation: value }),
}))
