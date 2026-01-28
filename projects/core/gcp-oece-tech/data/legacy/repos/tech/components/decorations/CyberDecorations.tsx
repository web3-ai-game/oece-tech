'use client'

import { useEffect, useState } from 'react'

// 六边形网格背景
export function HexagonGrid({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-5 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
          <polygon 
            points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  )
}

// 电路板纹理
export function CircuitPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-10 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="3" fill="#00ff88" />
          <circle cx="150" cy="50" r="3" fill="#00d4ff" />
          <circle cx="50" cy="150" r="3" fill="#00ff88" />
          <circle cx="150" cy="150" r="3" fill="#00d4ff" />
          
          <line x1="50" y1="50" x2="150" y2="50" stroke="#00ff88" strokeWidth="1" />
          <line x1="50" y1="50" x2="50" y2="150" stroke="#00d4ff" strokeWidth="1" />
          <line x1="150" y1="50" x2="150" y2="150" stroke="#00ff88" strokeWidth="1" />
          <line x1="50" y1="150" x2="150" y2="150" stroke="#00d4ff" strokeWidth="1" />
          
          <rect x="95" y="95" width="10" height="10" fill="none" stroke="#00ff88" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  )
}

// 雷达扫描圆
export function RadarCircle({ size = 400, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="radar-gradient">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <g transform={`translate(${size/2}, ${size/2})`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            r={i * size / 12}
            fill="none"
            stroke="#00ff88"
            strokeWidth="1"
            opacity={0.2}
          />
        ))}
        
        <line x1="0" y1={-size/2} x2="0" y2={size/2} stroke="#00ff88" strokeWidth="1" opacity="0.1" />
        <line x1={-size/2} y1="0" x2={size/2} y2="0" stroke="#00ff88" strokeWidth="1" opacity="0.1" />
        
        <path
          d={`M 0,0 L 0,${-size/2} A ${size/2},${size/2} 0 0,1 ${size/2},0 Z`}
          fill="url(#radar-gradient)"
          opacity="0.5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  )
}

// 数据流动线条
export function DataStream({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="1" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={100 + i * 150}
          x2="100%"
          y2={100 + i * 150}
          stroke="url(#stream-gradient)"
          strokeWidth="2"
          opacity="0.3"
        >
          <animate
            attributeName="x1"
            from="-100%"
            to="200%"
            dur={`${3 + i}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from="0%"
            to="300%"
            dur={`${3 + i}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  )
}

// 浮动粒子
export function FloatingParticles({ count = 20, className = '' }: { count?: number, className?: string }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }))

  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={`${particle.x}%`}
          cy={`${particle.y}%`}
          r={particle.size}
          fill="#00ff88"
          opacity="0.3"
        >
          <animate
            attributeName="cy"
            from={`${particle.y}%`}
            to={`${particle.y - 20}%`}
            dur={`${particle.duration}s`}
            begin={`${particle.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.5;0"
            dur={`${particle.duration}s`}
            begin={`${particle.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}

// 科技角落装饰
export function TechCorners({ className = '' }: { className?: string }) {
  return (
    <>
      {/* 左上角 */}
      <svg className={`absolute top-0 left-0 w-32 h-32 ${className}`} xmlns="http://www.w3.org/2000/svg">
        <path d="M 0,40 L 0,0 L 40,0" stroke="#00ff88" strokeWidth="2" fill="none" />
        <path d="M 0,80 L 0,60 L 20,60" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="40" cy="40" r="3" fill="#00ff88" />
        <line x1="0" y1="20" x2="20" y2="20" stroke="#00d4ff" strokeWidth="1" />
      </svg>

      {/* 右上角 */}
      <svg className={`absolute top-0 right-0 w-32 h-32 ${className}`} xmlns="http://www.w3.org/2000/svg">
        <path d="M 128,40 L 128,0 L 88,0" stroke="#00ff88" strokeWidth="2" fill="none" />
        <path d="M 128,80 L 128,60 L 108,60" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="88" cy="40" r="3" fill="#00ff88" />
        <line x1="128" y1="20" x2="108" y2="20" stroke="#00d4ff" strokeWidth="1" />
      </svg>

      {/* 左下角 */}
      <svg className={`absolute bottom-0 left-0 w-32 h-32 ${className}`} xmlns="http://www.w3.org/2000/svg">
        <path d="M 0,88 L 0,128 L 40,128" stroke="#00ff88" strokeWidth="2" fill="none" />
        <path d="M 0,48 L 0,68 L 20,68" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="40" cy="88" r="3" fill="#00ff88" />
        <line x1="0" y1="108" x2="20" y2="108" stroke="#00d4ff" strokeWidth="1" />
      </svg>

      {/* 右下角 */}
      <svg className={`absolute bottom-0 right-0 w-32 h-32 ${className}`} xmlns="http://www.w3.org/2000/svg">
        <path d="M 128,88 L 128,128 L 88,128" stroke="#00ff88" strokeWidth="2" fill="none" />
        <path d="M 128,48 L 128,68 L 108,68" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="88" cy="88" r="3" fill="#00ff88" />
        <line x1="128" y1="108" x2="108" y2="108" stroke="#00d4ff" strokeWidth="1" />
      </svg>
    </>
  )
}

// 数字矩阵雨
export function DigitalRain({ className = '' }: { className?: string }) {
  const [drops, setDrops] = useState<Array<{ x: number, y: number, speed: number }>>([])

  useEffect(() => {
    const newDrops = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 2 + 1,
    }))
    setDrops(newDrops)
  }, [])

  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {drops.map((drop, i) => (
        <text
          key={i}
          x={`${drop.x}%`}
          y={`${drop.y}%`}
          fill="url(#rain-gradient)"
          fontSize="14"
          fontFamily="monospace"
          opacity="0.3"
        >
          {Math.random() > 0.5 ? '01' : 'アイ'}
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to={`0 ${100 / drop.speed}`}
            dur={`${drop.speed}s`}
            repeatCount="indefinite"
          />
        </text>
      ))}
    </svg>
  )
}

// 全息扫描线
export function HologramScanlines({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="scanlines" x="0" y="0" width="100%" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#00ff88" strokeWidth="1" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanlines)" />
    </svg>
  )
}

// 能量脉冲圈
export function EnergyPulse({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="pulse-gradient">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {[1, 2, 3].map((i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#00ff88"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="r"
            from="20"
            to="45"
            dur="3s"
            begin={`${i * 1}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.2;0"
            dur="3s"
            begin={`${i * 1}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      <circle cx="50" cy="50" r="5" fill="url(#pulse-gradient)">
        <animate
          attributeName="r"
          values="5;8;5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

// 立方体网格
export function CubeGrid({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-5 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cubes" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 30,10 L 50,20 L 50,40 L 30,50 L 10,40 L 10,20 Z M 30,10 L 30,30 M 10,20 L 30,30 M 50,20 L 30,30"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cubes)" />
    </svg>
  )
}
