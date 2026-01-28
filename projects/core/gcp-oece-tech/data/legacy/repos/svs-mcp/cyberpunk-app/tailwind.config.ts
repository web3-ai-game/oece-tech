import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Claude-inspired warm color palette
        primary: {
          50: '#fef9f3',
          100: '#fdf3e7',
          200: '#fae5c3',
          300: '#f7d79f',
          400: '#f1bb57',
          500: '#eba00f',
          600: '#d4900e',
          700: '#b1780c',
          800: '#8e6009',
          900: '#744f08',
        },
        warm: {
          50: '#fefaf5',
          100: '#fef5eb',
          200: '#fce6cd',
          300: '#fad7af',
          400: '#f7b973',
          500: '#f39b37',
          600: '#db8c32',
          700: '#b6742a',
          800: '#925d22',
          900: '#774c1c',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        accent: {
          orange: '#f97316',
          amber: '#f59e0b',
          yellow: '#eab308',
        },
        ice: {
          glow: '#A5F3FC',
          core: '#06B6D4',
          deep: '#0891B2',
          dark: '#0E7490',
        },
        shadow: '#9333EA',
        neon: '#00FFF0',
        matrix: '#00FF41',
        glitch: '#FF0080',
        darkMode: '#0A0A0B',
        pixelGrid: '#1A1A2E',
        cyber: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#00FFF0',
          300: '#00E6D8',
          400: '#00CCC0',
          500: '#00B3A8',
          600: '#009990',
          700: '#008078',
          800: '#006660',
          900: '#004D48',
        },
        purple: {
          500: '#9333EA',
          600: '#7E22CE',
          700: '#6B21A8',
          800: '#581C87',
          900: '#3B0764',
        },
        pink: {
          500: '#FF0080',
          600: '#E6007A',
          700: '#CC0066',
          800: '#B30059',
          900: '#99004D',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'Courier New', 'monospace'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h60v60H0z\" fill=\"%231A1A2E\"/%3E%3Cpath d=\"M0 0h30v30H0zM30 30h30v30H30z\" fill=\"%230A0A0B\"/%3E%3C/svg%3E')",
      },
      animation: {
        'glitch': 'glitch 0.5s infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 3s infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0' },
          '49%': { opacity: '0' },
          '49.01%': { opacity: '1' },
        },
        'pulse-neon': {
          '0%, 100%': { 
            textShadow: '0 0 4px #00FFF0, 0 0 11px #00FFF0, 0 0 19px #00FFF0, 0 0 40px #00FFF0',
          },
          '50%': { 
            textShadow: '0 0 2px #00FFF0, 0 0 5px #00FFF0, 0 0 10px #00FFF0, 0 0 20px #00FFF0',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.neon), 0 0 20px theme(colors.neon)',
        'neon-lg': '0 0 10px theme(colors.neon), 0 0 40px theme(colors.neon), 0 0 80px theme(colors.neon)',
        'glitch': '0 0 5px theme(colors.glitch), 0 0 20px theme(colors.glitch)',
        'matrix': '0 0 5px theme(colors.matrix), 0 0 20px theme(colors.matrix)',
      },
    },
  },
  plugins: [],
}

export default config
