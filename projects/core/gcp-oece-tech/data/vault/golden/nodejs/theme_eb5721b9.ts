import { CyberpunkTheme } from '@/types'

export const cyberpunkTheme: CyberpunkTheme = {
  colors: {
    shadow: '#9333EA',      // 影子紫
    neon: '#00FFF0',        // 霓虹青
    matrix: '#00FF41',      // 矩陣綠
    glitch: '#FF0080',      // 故障粉
    darkMode: '#0A0A0B',    // 深黑背景
    pixelGrid: '#1A1A2E'    // 像素格子
  },
  effects: {
    glitch: true,
    scanlines: true,
    pixelate: 8
  }
}

export const getThemeColor = (colorName: keyof CyberpunkTheme['colors']) => {
  return cyberpunkTheme.colors[colorName]
}

export const animations = {
  glitch: 'glitch 0.5s infinite',
  scanline: 'scanline 8s linear infinite',
  flicker: 'flicker 3s infinite',
  pulseNeon: 'pulse-neon 2s ease-in-out infinite',
  float: 'float 6s ease-in-out infinite',
}

export const shadows = {
  neon: `0 0 5px ${cyberpunkTheme.colors.neon}, 0 0 20px ${cyberpunkTheme.colors.neon}`,
  glitch: `0 0 5px ${cyberpunkTheme.colors.glitch}, 0 0 20px ${cyberpunkTheme.colors.glitch}`,
  matrix: `0 0 5px ${cyberpunkTheme.colors.matrix}, 0 0 20px ${cyberpunkTheme.colors.matrix}`,
}
