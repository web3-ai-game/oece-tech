export const NetworkGrid = () => (
  <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* 网格线 */}
    {[...Array(20)].map((_, i) => (
      <line
        key={`h-${i}`}
        x1="0"
        y1={i * 30}
        x2="800"
        y2={i * 30}
        stroke="url(#networkGradient)"
        strokeWidth="0.5"
        opacity="0.3"
      />
    ))}
    {[...Array(27)].map((_, i) => (
      <line
        key={`v-${i}`}
        x1={i * 30}
        y1="0"
        x2={i * 30}
        y2="600"
        stroke="url(#networkGradient)"
        strokeWidth="0.5"
        opacity="0.3"
      />
    ))}
    
    {/* 连接节点 */}
    <g filter="url(#glow)">
      <circle cx="150" cy="150" r="4" fill="#8B5CF6" opacity="0.8">
        <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="150" r="4" fill="#3B82F6" opacity="0.8">
        <animate attributeName="r" values="4;6;4" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="300" r="6" fill="#10B981" opacity="0.9">
        <animate attributeName="r" values="6;8;6" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="450" r="4" fill="#F59E0B" opacity="0.8">
        <animate attributeName="r" values="4;6;4" dur="3s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="450" r="4" fill="#EF4444" opacity="0.8">
        <animate attributeName="r" values="4;6;4" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* 连接线 */}
    <path
      d="M150 150 L400 300 L650 150"
      stroke="#8B5CF6"
      strokeWidth="1"
      fill="none"
      opacity="0.4"
      strokeDasharray="5,5"
    >
      <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />
    </path>
    <path
      d="M150 450 L400 300 L650 450"
      stroke="#3B82F6"
      strokeWidth="1"
      fill="none"
      opacity="0.4"
      strokeDasharray="5,5"
    >
      <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />
    </path>
  </svg>
)

export const DataFlow = () => (
  <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
      </linearGradient>
    </defs>
    
    {/* 数据流线条 */}
    {[...Array(5)].map((_, i) => (
      <g key={i}>
        <rect
          x="-100"
          y={80 + i * 60}
          width="100"
          height="2"
          fill="url(#dataGradient)"
        >
          <animate
            attributeName="x"
            values="-100;900"
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </rect>
        <circle
          cx="0"
          cy={80 + i * 60}
          r="3"
          fill="#8B5CF6"
        >
          <animate
            attributeName="cx"
            values="-100;900"
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    ))}
    
    {/* 中央处理器 */}
    <g transform="translate(400, 200)">
      <rect x="-60" y="-60" width="120" height="120" stroke="#8B5CF6" strokeWidth="2" fill="none" opacity="0.6" rx="10">
        <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="-40" y="-40" width="80" height="80" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.4" rx="5">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0;360"
          dur="20s"
          repeatCount="indefinite"
        />
      </rect>
      <circle cx="0" cy="0" r="15" fill="#10B981" opacity="0.8">
        <animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
)

export const ShieldProtection = () => (
  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
      </linearGradient>
      <filter id="shieldGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* 外层防护圈 */}
    <circle cx="200" cy="200" r="150" stroke="url(#shieldGradient)" strokeWidth="0.5" fill="none" opacity="0.3">
      <animate attributeName="r" values="150;160;150" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="200" r="130" stroke="url(#shieldGradient)" strokeWidth="0.5" fill="none" opacity="0.4">
      <animate attributeName="r" values="130;140;130" dur="4s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="200" r="110" stroke="url(#shieldGradient)" strokeWidth="0.5" fill="none" opacity="0.5">
      <animate attributeName="r" values="110;120;110" dur="4s" begin="1s" repeatCount="indefinite" />
    </circle>
    
    {/* 盾牌主体 */}
    <g filter="url(#shieldGlow)">
      <path
        d="M200 100 L260 130 L260 220 Q260 280 200 320 Q140 280 140 220 L140 130 Z"
        stroke="url(#shieldGradient)"
        strokeWidth="2"
        fill="url(#shieldGradient)"
        fillOpacity="0.1"
      />
      
      {/* 中央锁 */}
      <g transform="translate(200, 200)">
        <rect x="-20" y="-10" width="40" height="30" rx="5" fill="#10B981" opacity="0.8" />
        <path d="M-15 -10 Q-15 -25 0 -25 Q15 -25 15 -10" stroke="#10B981" strokeWidth="3" fill="none" />
        <circle cx="0" cy="5" r="3" fill="#000" />
      </g>
    </g>
    
    {/* 扫描线 */}
    <rect x="50" y="0" width="2" height="400" fill="url(#shieldGradient)" opacity="0.6">
      <animate attributeName="x" values="50;350;50" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
    </rect>
  </svg>
)

export const GlobalNetwork = () => (
  <svg className="w-full h-full" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    {/* 地球 */}
    <g transform="translate(400, 250)">
      {/* 经纬线 */}
      <ellipse cx="0" cy="0" rx="150" ry="150" stroke="url(#globeGradient)" strokeWidth="0.5" fill="none" />
      <ellipse cx="0" cy="0" rx="150" ry="100" stroke="url(#globeGradient)" strokeWidth="0.5" fill="none" />
      <ellipse cx="0" cy="0" rx="150" ry="50" stroke="url(#globeGradient)" strokeWidth="0.5" fill="none" />
      <line x1="-150" y1="0" x2="150" y2="0" stroke="url(#globeGradient)" strokeWidth="0.5" />
      <line x1="0" y1="-150" x2="0" y2="150" stroke="url(#globeGradient)" strokeWidth="0.5" />
      
      {/* 旋转动画 */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0;360"
          dur="30s"
          repeatCount="indefinite"
        />
        
        {/* 连接点 */}
        <circle cx="100" cy="0" r="4" fill="#8B5CF6">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="-100" cy="0" r="4" fill="#3B82F6">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="100" r="4" fill="#10B981">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="-100" r="4" fill="#F59E0B">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </g>
    
    {/* 轨道卫星 */}
    <g>
      <ellipse cx="400" cy="250" rx="200" ry="100" stroke="url(#globeGradient)" strokeWidth="0.5" fill="none" strokeDasharray="5,10" />
      <circle cx="0" cy="0" r="6" fill="#8B5CF6">
        <animateMotion dur="10s" repeatCount="indefinite">
          <mpath href="#orbit" />
        </animateMotion>
      </circle>
    </g>
    <path id="orbit" d="M600 250 A200 100 0 1 1 200 250 A200 100 0 1 1 600 250" fill="none" />
    
    {/* 信号波 */}
    {[...Array(3)].map((_, i) => (
      <circle
        key={i}
        cx="400"
        cy="250"
        r="0"
        stroke="url(#globeGradient)"
        strokeWidth="1"
        fill="none"
      >
        <animate
          attributeName="r"
          values="0;250"
          dur="3s"
          begin={`${i}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0"
          dur="3s"
          begin={`${i}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}
  </svg>
)

export const SpeedMeter = () => (
  <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    
    {/* 仪表盘外圈 */}
    <path
      d="M100 250 A150 150 0 0 1 300 250"
      stroke="url(#speedGradient)"
      strokeWidth="20"
      fill="none"
      strokeLinecap="round"
      opacity="0.3"
    />
    
    {/* 刻度线 */}
    {[...Array(11)].map((_, i) => {
      const angle = -180 + i * 18
      const rad = (angle * Math.PI) / 180
      const x1 = 200 + 130 * Math.cos(rad)
      const y1 = 250 + 130 * Math.sin(rad)
      const x2 = 200 + 120 * Math.cos(rad)
      const y2 = 250 + 120 * Math.sin(rad)
      
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i < 3 ? '#EF4444' : i < 7 ? '#F59E0B' : '#10B981'}
          strokeWidth="2"
          opacity="0.8"
        />
      )
    })}
    
    {/* 指针 */}
    <g transform="translate(200, 250)">
      <line x1="0" y1="0" x2="0" y2="-100" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-90;90;-90"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>
      <circle cx="0" cy="0" r="8" fill="#fff" />
    </g>
    
    {/* 速度显示 */}
    <text x="200" y="220" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold" fontFamily="monospace">
      <tspan>
        <animate attributeName="fill" values="#EF4444;#F59E0B;#10B981;#F59E0B;#EF4444" dur="4s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.1;1"
          dur="2s"
          repeatCount="indefinite"
        />
        FAST
      </tspan>
    </text>
  </svg>
)
