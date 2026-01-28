'use client'

interface LogoProps {
  size?: number
  variant?: 'default' | 'animated' | 'minimal'
  className?: string
}

export function Logo({ size = 48, variant = 'default', className = '' }: LogoProps) {
  if (variant === 'minimal') {
    // 简约版本
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#05FFA1" />
            <stop offset="100%" stopColor="#01CDFE" />
          </linearGradient>
        </defs>
        <text
          x="50"
          y="60"
          fontSize="32"
          fontFamily="'Press Start 2P', monospace"
          fontWeight="bold"
          fill="url(#minimalGradient)"
          textAnchor="middle"
        >
          OECE
        </text>
      </svg>
    )
  }

  if (variant === 'animated') {
    // 动画版本
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#05FFA1">
              <animate attributeName="stop-color" values="#05FFA1;#FF71CE;#05FFA1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#01CDFE">
              <animate attributeName="stop-color" values="#01CDFE;#05FFA1;#01CDFE" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#FF71CE">
              <animate attributeName="stop-color" values="#FF71CE;#01CDFE;#FF71CE" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* 背景圆环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#animatedGradient)"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* 主体文字 */}
        <text
          x="50"
          y="58"
          fontSize="24"
          fontFamily="'VT323', monospace"
          fontWeight="bold"
          fill="url(#animatedGradient)"
          textAnchor="middle"
          filter="url(#glow)"
        >
          OECE
        </text>
      </svg>
    )
  }

  // 默认版本 - 高质量设计
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className}>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05FFA1" />
          <stop offset="50%" stopColor="#01CDFE" />
          <stop offset="100%" stopColor="#FF71CE" />
        </linearGradient>
        
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D0221" />
          <stop offset="100%" stopColor="#1A0E2E" />
        </linearGradient>
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* 背景 */}
      <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#bgGradient)" />
      
      {/* 网格装饰 */}
      <g opacity="0.1">
        <line x1="10" y1="40" x2="110" y2="40" stroke="#05FFA1" strokeWidth="1" />
        <line x1="10" y1="60" x2="110" y2="60" stroke="#05FFA1" strokeWidth="1" />
        <line x1="10" y1="80" x2="110" y2="80" stroke="#05FFA1" strokeWidth="1" />
        <line x1="40" y1="10" x2="40" y2="110" stroke="#05FFA1" strokeWidth="1" />
        <line x1="60" y1="10" x2="60" y2="110" stroke="#05FFA1" strokeWidth="1" />
        <line x1="80" y1="10" x2="80" y2="110" stroke="#05FFA1" strokeWidth="1" />
      </g>
      
      {/* OECE 文字 - 专业设计 */}
      <g filter="url(#shadow)">
        {/* O */}
        <circle
          cx="30"
          cy="60"
          r="12"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="3"
        />
        
        {/* E */}
        <g>
          <path
            d="M 45 48 L 58 48 M 45 60 L 56 60 M 45 72 L 58 72"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="45" y1="48" x2="45" y2="72" stroke="url(#logoGradient)" strokeWidth="3" />
        </g>
        
        {/* C */}
        <path
          d="M 77 48 Q 65 48 65 60 Q 65 72 77 72"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* E */}
        <g>
          <path
            d="M 82 48 L 95 48 M 82 60 L 93 60 M 82 72 L 95 72"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="82" y1="48" x2="82" y2="72" stroke="url(#logoGradient)" strokeWidth="3" />
        </g>
      </g>
      
      {/* 点缀 */}
      <circle cx="105" cy="15" r="2" fill="#05FFA1" opacity="0.6" />
      <circle cx="15" cy="105" r="2" fill="#FF71CE" opacity="0.6" />
    </svg>
  )
}

// 文字Logo组件
export function TextLogo({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <span 
        style={{
          background: 'linear-gradient(135deg, #05FFA1, #01CDFE, #FF71CE)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '2rem',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}
      >
        OECE
      </span>
      <span 
        style={{
          color: '#808080',
          fontFamily: "'VT323', monospace",
          fontSize: '1rem',
          marginLeft: '8px'
        }}
      >
        .TECH
      </span>
    </div>
  )
}
