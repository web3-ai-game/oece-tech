'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-[10000] bg-[var(--bg-window)] border-2 px-4 py-2 flex items-center gap-2 cursor-pointer font-bold text-[11px] hover:shadow-[0_0_20px_var(--shadow-glow)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
      style={{
        borderColor: 'var(--border-highlight) var(--border-dark) var(--border-dark) var(--border-highlight)',
        fontFamily: '"MS Sans Serif", sans-serif',
        color: 'var(--text-primary)'
      }}
      aria-label={theme === 'light' ? '關燈' : '開燈'}
      title={`${theme === 'light' ? '關燈' : '開燈'} (Ctrl+L)`}
    >
      {/* 图标 */}
      <div className="w-6 h-6 flex items-center justify-center animate-pulse">
        {theme === 'light' ? (
          // 太阳图标（开灯）
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#FFD700" />
            <path 
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
              stroke="#FFD700" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // 月亮图标（关灯）
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
              fill="#B967FF" 
              stroke="#01CDFE" 
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
      
      {/* 文字 */}
      <span className="uppercase tracking-wider">
        {theme === 'light' ? '關燈' : '開燈'
      </span>
    </button>
  )
}
