'use client'

import { useEffect, useState } from 'react'

// 流动的波浪背景
export function WaveBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
      </defs>
      
      <path d="M0,50 Q50,30 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50" 
            stroke="url(#wave-gradient)" strokeWidth="2" fill="none">
        <animate attributeName="d" 
                 values="M0,50 Q50,30 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50;
                         M0,50 Q50,70 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50;
                         M0,50 Q50,30 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50"
                 dur="4s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

// 圆形脉冲光点
export function CirclePulses() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={`${10 + i * 12}%`}
          cy={`${20 + (i % 3) * 30}%`}
          r="3"
          fill="#00ff88"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="3;6;3"
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}

// 流星效果
export function ShootingStars() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="1" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {[...Array(3)].map((_, i) => (
        <line
          key={i}
          x1="-20"
          y1={20 + i * 30}
          x2="80"
          y2={60 + i * 30}
          stroke="url(#star-gradient)"
          strokeWidth="2"
        >
          <animate
            attributeName="x1"
            values="-20;100%;-20"
            dur={`${4 + i * 2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="80;120%;80"
            dur={`${4 + i * 2}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  )
}

// 圆形网格
export function CircularGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circular-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circular-dots)" />
    </svg>
  )
}

// 发光圆环
export function GlowingRings({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-full h-full ${className}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ring-gradient">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <g transform="translate(100, 100)">
        {[1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            r={20 * i}
            fill="none"
            stroke="#00ff88"
            strokeWidth="1"
            opacity={0.3 / i}
          >
            <animate
              attributeName="r"
              values={`${20 * i};${20 * i + 10};${20 * i}`}
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  )
}

// 数据流线条
export function DataFlowLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {[...Array(6)].map((_, i) => (
        <g key={i}>
          <line
            x1="0"
            y1={100 + i * 80}
            x2="100%"
            y2={100 + i * 80}
            stroke="url(#flow-gradient)"
            strokeWidth="1"
          />
          <circle
            cx="10%"
            cy={100 + i * 80}
            r="2"
            fill="#00d4ff"
          >
            <animate
              attributeName="cx"
              values="0%;100%;0%"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  )
}

// 圆角矩形网格
export function RoundedRectGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="rounded-rects" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="5" y="5" width="50" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rounded-rects)" />
    </svg>
  )
}

// 光晕圆点
export function GlowDots() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 2 + 1}
          fill={i % 2 === 0 ? '#00ff88' : '#00d4ff'}
          filter="url(#glow-filter)"
          opacity="0.4"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.6;0.2"
            dur={`${2 + Math.random() * 3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}

// 圆形进度环
export function CircularProgress({ value = 75, size = 120, color = '#00ff88' }: unknown) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1a2332"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  )
}

// 迷你图标装饰
export function IconDecorations() {
  const icons = ['⚡', '🔐', '🌐', '💻', '🚀', '🎯', '📡', '🛡️']
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  )
}
