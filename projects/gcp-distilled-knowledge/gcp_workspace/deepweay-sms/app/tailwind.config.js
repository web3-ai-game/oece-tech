/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff',
        secondary: '#ff00ff',
        dark: '#0a0a0f',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-cyan-400', 'text-purple-400', 'text-pink-400', 'text-green-400', 'text-yellow-400', 'text-red-400', 'text-orange-400',
    'bg-cyan-500/10', 'bg-purple-500/10', 'bg-pink-500/10', 'bg-green-500/10', 'bg-yellow-500/10', 'bg-red-500/10', 'bg-orange-500/10',
    'border-cyan-500/30', 'border-purple-500/30', 'border-pink-500/30',
  ],
};
