'use client'

interface Win98InputProps {
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  name?: string
  disabled?: boolean
  className?: string
}

export function Win98Input({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  disabled,
  className = ''
}: Win98InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      className={`
        px-1 py-1 w-full
        bg-white text-black text-[11px]
        notranslate
        ${disabled ? 'bg-[#C0C0C0] text-[#808080]' : ''}
        ${className}
      `}
      style={{
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif',
        border: '2px solid',
        borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        outline: 'none'
      }}
    />
  )
}

export function Win98Textarea({ 
  value,
  onChange,
  placeholder,
  name,
  rows = 4,
  disabled,
  className = ''
}: {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  name?: string
  rows?: number
  disabled?: boolean
  className?: string
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      rows={rows}
      disabled={disabled}
      className={`
        px-1 py-1 w-full
        bg-white text-black text-[11px]
        resize-none
        ${disabled ? 'bg-[#C0C0C0] text-[#808080]' : ''}
        ${className}
      `}
      style={{
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif',
        border: '2px solid',
        borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        outline: 'none'
      }}
    />
  )
}

export function Win98Select({ 
  value,
  onChange,
  options,
  name,
  disabled,
  className = ''
}: {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  name?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      className={`
        px-1 py-1 w-full
        bg-white text-black text-[11px]
        ${disabled ? 'bg-[#C0C0C0] text-[#808080]' : ''}
        ${className}
      `}
      style={{
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif',
        border: '2px solid',
        borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        outline: 'none'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function Win98Checkbox({ 
  checked,
  onChange,
  label,
  name,
  disabled,
  className = ''
}: {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  name?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <div 
        className="w-3 h-3 bg-white flex items-center justify-center"
        style={{
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080'
        }}
      >
        {checked && (
          <span className="text-[8px] font-bold">✓</span>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className="hidden notranslate"
      />
      {label && (
        <span 
          className="text-[11px]"
          style={{
            fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif'
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}

export function Win98Radio({ 
  checked,
  onChange,
  label,
  name,
  value,
  disabled,
  className = ''
}: {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  name?: string
  value?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <div 
        className="w-3 h-3 bg-white rounded-full flex items-center justify-center"
        style={{
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080'
        }}
      >
        {checked && (
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        )}
      </div>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="hidden notranslate"
      />
      {label && (
        <span 
          className="text-[11px]"
          style={{
            fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif'
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
