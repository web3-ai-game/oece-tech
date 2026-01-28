'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { pixelGlobeVertexShader, pixelGlobeFragmentShader } from '@/shaders/pixelGlobe'
import { useMapStore } from '@/stores/mapStore'

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { rotation, pixelation } = useMapStore()
  
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      pixelSize: { value: pixelation },
      neonColor: { value: new THREE.Color('#00FFF0') },
      matrixColor: { value: new THREE.Color('#00FF41') },
      shadowColor: { value: new THREE.Color('#9333EA') },
      glitchIntensity: { value: 0.3 },
    }),
    [pixelation]
  )

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Update time uniform for animations
    uniforms.time.value = state.clock.elapsedTime
    
    // Auto rotation
    if (rotation) {
      meshRef.current.rotation.y += 0.001
    }
    
    // Update pixelation
    uniforms.pixelSize.value = pixelation
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <shaderMaterial
        vertexShader={pixelGlobeVertexShader}
        fragmentShader={pixelGlobeFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </Sphere>
  )
}
