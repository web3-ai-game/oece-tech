export interface CyberpunkTheme {
  colors: {
    shadow: string
    neon: string
    matrix: string
    glitch: string
    darkMode: string
    pixelGrid: string
  }
  effects: {
    glitch: boolean
    scanlines: boolean
    pixelate: number
  }
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends ComponentProps {
  variant?: 'neon' | 'glitch' | 'matrix'
  onClick?: () => void
  disabled?: boolean
}

export interface CardProps extends ComponentProps {
  title: string
  description: string
  icon?: string
}

export interface TerminalProps {
  commands: string[]
  autoPlay?: boolean
  speed?: number
}

export type AnimationIntensity = 'low' | 'medium' | 'high'

export interface GlitchTextProps extends ComponentProps {
  text: string
  intensity?: AnimationIntensity
}
