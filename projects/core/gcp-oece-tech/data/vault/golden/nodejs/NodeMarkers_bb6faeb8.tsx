'use client'

import { useRef, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { NodeLocation } from '@/types/map'
import { useMapStore } from '@/stores/mapStore'
import { getStatusColor } from '@/lib/nodes'
import { nodeMarkerVertexShader, nodeMarkerFragmentShader } from '@/shaders/pixelGlobe'

interface NodeMarkerProps {
  node: NodeLocation
}

function NodeMarker({ node }: NodeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { setSelectedNode, setHoveredNode, hoveredNode } = useMapStore()
  
  const isHovered = hoveredNode?.id === node.id
  
  // Convert lat/lng to 3D coordinates
  const position = useMemo(() => {
    const phi = (90 - node.lat) * (Math.PI / 180)
    const theta = (node.lng + 180) * (Math.PI / 180)
    const radius = 2.1
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    
    return new THREE.Vector3(x, y, z)
  }, [node.lat, node.lng])

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color(getStatusColor(node.status)) },
      opacity: { value: isHovered ? 1.0 : 0.7 },
      time: { value: 0 },
    }),
    [node.status, isHovered]
  )

  useFrame((state) => {
    uniforms.time.value = state.clock.elapsedTime
    
    if (meshRef.current) {
      // Billboard effect - always face camera
      meshRef.current.quaternion.copy(state.camera.quaternion)
      
      // Scale on hover
      const targetScale = isHovered ? 1.5 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedNode(node)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoveredNode(node)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHoveredNode(null)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[0.15, 0.15]} />
        <shaderMaterial
          vertexShader={nodeMarkerVertexShader}
          fragmentShader={nodeMarkerFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      
      {isHovered && (
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.08}
          color="#00FFF0"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#0A0A0B"
        >
          {node.name}
        </Text>
      )}
    </group>
  )
}

export function NodeMarkers() {
  const { nodes, showNodes } = useMapStore()
  
  if (!showNodes) return null

  return (
    <group>
      {nodes.map((node) => (
        <NodeMarker key={node.id} node={node} />
      ))}
    </group>
  )
}
