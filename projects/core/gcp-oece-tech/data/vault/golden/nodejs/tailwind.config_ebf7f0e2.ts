import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 像素化 Web3 配色
        pixel: {
          primary: '#00ff88',      // 螢光綠
          secondary: '#ff00ff',    // 像素粉
          accent: '#00ffff',       // 青色
          warning: '#ffaa00',      // 警告橙
          danger: '#ff3366',       // 危險紅
          dark: '#1a1a2e',        // 深藍黑
          darker: '#0f0f1e',      // 更深背景
          light: '#eeeeee',       // 淺色文字
          grid: '#333344',        // 網格線
        },
        // Web3 漸變色
        web3: {
          purple: '#9945FF',
          pink: '#FF4081',
          cyan: '#14F195',
          blue: '#0070F3',
        }
      },
      fontFamily: {
        pixel: ['Press Start 2P', 'monospace'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'pixel-xs': ['10px', '14px'],
        'pixel-sm': ['12px', '16px'],
        'pixel-base': ['14px', '20px'],
        'pixel-lg': ['16px', '24px'],
        'pixel-xl': ['20px', '28px'],
        'pixel-2xl': ['24px', '32px'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-lg': '8px 8px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-glow': '0 0 20px rgba(0, 255, 136, 0.5)',
        'pixel-glow-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
        'pixel-glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
      },
      animation: {
        'pixel-blink': 'blink 1s step-end infinite',
        'pixel-slide': 'slide 20s linear infinite',
        'pixel-float': 'float 3s ease-in-out infinite',
        'pixel-scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      backgroundImage: {
        'pixel-grid': 'linear-gradient(0deg, transparent 24%, rgba(51, 51, 68, .3) 25%, rgba(51, 51, 68, .3) 26%, transparent 27%, transparent 74%, rgba(51, 51, 68, .3) 75%, rgba(51, 51, 68, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(51, 51, 68, .3) 25%, rgba(51, 51, 68, .3) 26%, transparent 27%, transparent 74%, rgba(51, 51, 68, .3) 75%, rgba(51, 51, 68, .3) 76%, transparent 77%, transparent)',
        'web3-gradient': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00ff88 0%, #00ffff 50%, #ff00ff 100%)',
      },
      backgroundSize: {
        'pixel-grid-size': '50px 50px',
      },
    },
  },
  plugins: [],
}

export default config
