'use client'

// 专业SVG图标组件（替代emoji）

export function MoneyIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="6" width="20" height="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

export function RocketIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L4 22l8-6 8 6L12 2z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
      <path d="M8 14l-2 4M16 14l2 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function ShieldIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L4 6v6c0 5 3 9 8 10 5-1 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CodeIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 6L2 12l6 6M16 6l6 6-6 6M14 4l-4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function GlobeIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

export function ServerIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="4" width="20" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="14" width="20" height="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <circle cx="6" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}

export function TerminalIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="4" width="20" height="16" stroke="currentColor" strokeWidth="2" />
      <path d="M6 9l4 3-4 3M12 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ChartIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" />
      <path d="M7 14l4-4 4 2 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="7" cy="14" r="2" fill="currentColor" />
      <circle cx="11" cy="10" r="2" fill="currentColor" />
      <circle cx="15" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="6" r="2" fill="currentColor" />
    </svg>
  )
}

export function UserGroupIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-3 3-5 6-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function BookIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4v16h16" stroke="currentColor" strokeWidth="2" />
      <path d="M4 4h12a2 2 0 0 1 2 2v14" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

export function FireIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2c-3 4-5 8-5 11a5 5 0 0 0 10 0c0-3-2-7-5-11z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3" />
      <path d="M12 10c-1 2-2 3-2 5a2 2 0 0 0 4 0c0-2-1-3-2-5z" fill="currentColor" />
    </svg>
  )
}

export function TargetIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export function LockIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="10" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

export function TrendingIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 7h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function WalletIcon({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="6" width="18" height="13" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="13" width="3" height="3" fill="currentColor" />
    </svg>
  )
}
