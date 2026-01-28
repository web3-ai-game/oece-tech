'use client'

interface Win98ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  variant?: 'default' | 'primary'
}

export function Win98Button({ 
  children, 
  onClick, 
  disabled, 
  type = 'button',
  className = '',
  variant = 'default'
}: Win98ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[75px] px-3 py-1 
        bg-[#C0C0C0] text-black text-[11px]
        ${disabled ? 'text-[#808080]' : ''}
        ${className}
      `}
      style={{
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif',
        boxShadow: disabled 
          ? 'inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF'
          : `
            inset -1px -1px 0 #000000,
            inset 1px 1px 0 #FFFFFF,
            inset -2px -2px 0 #808080,
            inset 2px 2px 0 #DFDFDF
          `,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textShadow: disabled ? '1px 1px 0 #FFFFFF' : 'none'
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `
            inset 1px 1px 0 #000000,
            inset -1px -1px 0 #FFFFFF
          `
          e.currentTarget.style.padding = '5px 11px 3px 13px'
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `
            inset -1px -1px 0 #000000,
            inset 1px 1px 0 #FFFFFF,
            inset -2px -2px 0 #808080,
            inset 2px 2px 0 #DFDFDF
          `
          e.currentTarget.style.padding = '4px 12px'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `
            inset -1px -1px 0 #000000,
            inset 1px 1px 0 #FFFFFF,
            inset -2px -2px 0 #808080,
            inset 2px 2px 0 #DFDFDF
          `
          e.currentTarget.style.padding = '4px 12px&apos;
        }
      }}
    >
      {children}
    </button>
  )
}

// 带图标的按钮
export function Win98IconButton({ 
  children, 
  icon,
  onClick, 
  disabled,
  className = ''
}: Win98ButtonProps & { icon?: React.ReactNode }) {
  return (
    <Win98Button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
    >
      <span className="flex items-center gap-1.5">
        {icon && <span className="text-xs">{icon}</span>}
        {children}
      </span>
    </Win98Button>
  )
}

// Toolbar按钮（更小）
export function Win98ToolbarButton({ 
  children, 
  onClick,
  active = false,
  className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 p-1
        bg-[#C0C0C0] text-black
        flex items-center justify-center
        ${className}
      `}
      style={{
        boxShadow: active 
          ? 'inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF'
          : 'inset -1px -1px 0 #000000, inset 1px 1px 0 #FFFFFF',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}
