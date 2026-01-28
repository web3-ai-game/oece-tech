'use client'

import { useEffect, useState } from 'react'

interface OECELogoProps {
  size?: number
  animated?: boolean
  glowing?: boolean
  className?: string
}

export function OECELogo({ 
  size = 200, 
  animated = true, 
  glowing = true,
  className = '' 
}: OECELogoProps) {
  const [scanLinePosition, setScanLinePosition] = useState(0)
  
  useEffect(() => {
    if (!animated) return
    
    const interval = setInterval(() => {
      setScanLinePosition(prev => (prev + 1) % 100)
    }, 30)
    
    return () => clearInterval(interval)
  }, [animated])
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 霓虹光晕效果 */}
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* 强烈光晕 */}
        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* 渐变色 - 青绿 */}
        <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        
        {/* 渐变色 - 紫蓝 */}
        <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        
        {/* 扫描线遮罩 */}
        <mask id="scan-mask">
          <rect width="200" height="200" fill="white"/>
          <rect 
            width="200" 
            height="2" 
            y={scanLinePosition * 2} 
            fill="black" 
            opacity="0.3"
          />
        </mask>
      </defs>
      
      {/* 背景圆环 */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="none" 
        stroke="url(#gradient-primary)" 
        strokeWidth="2" 
        opacity="0.2"
      />
      <circle 
        cx="100" 
        cy="100" 
        r="85" 
        fill="none" 
        stroke="url(#gradient-accent)" 
        strokeWidth="1" 
        opacity="0.1"
      />
      
      {/* 科技装饰线 */}
      <g opacity="0.3" stroke="url(#gradient-primary)" strokeWidth="1" fill="none">
        <path d="M 30,30 L 50,30 L 50,50" />
        <path d="M 170,30 L 150,30 L 150,50" />
        <path d="M 30,170 L 50,170 L 50,150" />
        <path d="M 170,170 L 150,170 L 150,150" />
      </g>
      
      {/* 主体 OECE 文字 */}
      <g 
        filter={glowing ? "url(#strong-glow)" : "none"}
        mask={animated ? "url(#scan-mask)" : "none"}
      >
        {/* O */}
        <path
          d="M 35,100 A 20,20 0 1,1 35,99.9"
          fill="none"
          stroke="url(#gradient-primary)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* E */}
        <g transform="translate(65, 0)">
          <line x1="0" y1="80" x2="0" y2="120" stroke="url(#gradient-primary)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="80" x2="18" y2="80" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="100" x2="15" y2="100" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="120" x2="18" y2="120" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
        </g>
        
        {/* C */}
        <path
          d="M 118,80 A 20,20 0 0,0 98,100 A 20,20 0 0,0 118,120"
          fill="none"
          stroke="url(#gradient-primary)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* E */}
        <g transform="translate(130, 0)">
          <line x1="0" y1="80" x2="0" y2="120" stroke="url(#gradient-primary)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="80" x2="18" y2="80" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="100" x2="15" y2="100" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
          <line x1="0" y1="120" x2="18" y2="120" stroke="url(#gradient-accent)" strokeWidth="6" strokeLinecap="round"/>
        </g>
      </g>
      
      {/* .tech 小字 */}
      <text
        x="100"
        y="145"
        textAnchor="middle"
        fill="url(#gradient-accent)"
        fontSize="12"
        fontFamily="monospace"
        opacity="0.7"
        filter={glowing ? "url(#neon-glow)" : "none"}
      >
        .tech
      </text>
      
      {/* 六边形装饰 */}
      <g opacity="0.15" fill="none" stroke="url(#gradient-primary)" strokeWidth="1">
        <polygon points="100,20 120,30 120,50 100,60 80,50 80,30" />
        <polygon points="100,140 120,150 120,170 100,180 80,170 80,150" />
        <polygon points="20,100 30,120 30,140 20,150 10,140 10,120" />
        <polygon points="180,100 190,120 190,140 180,150 170,140 170,120" />
      </g>
      
      {/* 动态点 */}
      {animated && (
        <>
          <circle cx="100" cy="20" r="2" fill="#00ff88">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="180" r="2" fill="#00d4ff">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="20" cy="100" r="2" fill="#00ff88">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="180" cy="100" r="2" fill="#00d4ff">
            <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        </>
      )}
      
      {/* 扫描线效果 */}
      {animated && (
        <line
          x1="0"
          y1={scanLinePosition * 2}
          x2="200"
          y2={scanLinePosition * 2}
          stroke="#00ff88"
          strokeWidth="1"
          opacity="0.3"
        />
      )}
    </svg>
  )
}

// 简化版本 - 用于小尺寸展示
export function OECELogoSimple({ size = 50, className = '' }: { size?: number, className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient-simple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="glow-simple">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow-simple)">
        {/* O */}
        <circle cx="45" cy="100" r="18" fill="none" stroke="url(#gradient-simple)" strokeWidth="5"/>
        
        {/* E */}
        <g transform="translate(75, 0)">
          <line x1="0" y1="82" x2="0" y2="118" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="82" x2="15" y2="82" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="100" x2="12" y2="100" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="118" x2="15" y2="118" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
        </g>
        
        {/* C */}
        <path
          d="M 128,82 A 18,18 0 0,0 110,100 A 18,18 0 0,0 128,118"
          fill="none"
          stroke="url(#gradient-simple)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        
        {/* E */}
        <g transform="translate(140, 0)">
          <line x1="0" y1="82" x2="0" y2="118" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="82" x2="15" y2="82" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="100" x2="12" y2="100" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
          <line x1="0" y1="118" x2="15" y2="118" stroke="url(#gradient-simple)" strokeWidth="5" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  )
}

// Favicon版本
export function OECEFavicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="favicon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      
      <rect width="32" height="32" fill="#0a0e14" rx="6"/>
      
      <g transform="translate(4, 8)">
        {/* 简化的 OE 字母 */}
        <circle cx="6" cy="8" r="5" fill="none" stroke="url(#favicon-gradient)" strokeWidth="2"/>
        <g transform="translate(14, 0)">
          <line x1="0" y1="3" x2="0" y2="13" stroke="url(#favicon-gradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="0" y1="3" x2="5" y2="3" stroke="url(#favicon-gradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="0" y1="8" x2="4" y2="8" stroke="url(#favicon-gradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="0" y1="13" x2="5" y2="13" stroke="url(#favicon-gradient)" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  )
}
