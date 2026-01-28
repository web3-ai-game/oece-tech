'use client'

interface Win98WindowProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
  width?: number | string
  height?: number | string
  className?: string
}

export function Win98Window({ 
  title, 
  children, 
  onClose,
  width = 500,
  height = 'auto',
  className = ''
}: Win98WindowProps) {
  return (
    <div 
      className={`bg-[#C0C0C0] ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        minHeight: typeof height === 'number' ? `${height}px` : height,
        boxShadow: `
          inset -1px -1px 0 #000000,
          inset 1px 1px 0 #DFDFDF,
          inset -2px -2px 0 #808080,
          inset 2px 2px 0 #FFFFFF
        `,
        padding: '2px'
      }}
    >
      {/* 标题栏 */}
      <div 
        className="flex items-center justify-between px-1 py-0.5 text-white font-bold text-[11px]"
        style={{
          background: 'linear-gradient(to right, #000080, #1084D0)',
          fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif'
        }}
      >
        <span className="flex items-center gap-1">
          {title}
        </span>
        <div className="flex gap-0.5">
          {/* 最小化 */}
          <button 
            className="w-4 h-3.5 bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center"
            style={{
              boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #FFFFFF'
            }}
          >
            _
          </button>
          {/* 最大化 */}
          <button 
            className="w-4 h-3.5 bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center"
            style={{
              boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #FFFFFF'
            }}
          >
            □
          </button>
          {/* 关闭 */}
          <button 
            className="w-4 h-3.5 bg-[#C0C0C0] text-black text-[10px] flex items-center justify-center hover:brightness-110"
            onClick={onClose}
            style={{
              boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #FFFFFF'
            }}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* 内容区 */}
      <div className="bg-[#C0C0C0] p-2 m-0.5">
        {children}
      </div>
    </div>
  )
}

// 简化的Window组件（无标题栏）
export function Win98Panel({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div 
      className={`bg-[#C0C0C0] p-2 ${className}`}
      style={{
        boxShadow: `
          inset -1px -1px 0 #000000,
          inset 1px 1px 0 #DFDFDF,
          inset -2px -2px 0 #808080,
          inset 2px 2px 0 #FFFFFF
        `
      }}
    >
      {children}
    </div>
  )
}

// 凹陷面板（用于输入框容器等）
export function Win98InsetPanel({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div 
      className={`bg-white p-2 ${className}`}
      style={{
        border: '2px solid',
        borderColor: '#000000 #DFDFDF #DFDFDF #000000'
      }}
    >
      {children}
    </div>
  )
}
