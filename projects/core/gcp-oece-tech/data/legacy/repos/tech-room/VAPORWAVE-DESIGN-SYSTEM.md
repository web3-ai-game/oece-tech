# VAPORWAVE AESTHETIC DESIGN SYSTEM

## CORE VAPORWAVE ELEMENTS

### Color Palette

```css
/* Primary Vaporwave Colors */
--vapor-pink: #FF71CE;           /* Hot pink */
--vapor-purple: #B967FF;         /* Neon purple */
--vapor-blue: #05FFA1;           /* Cyan mint */
--vapor-teal: #01CDFE;           /* Electric teal */
--vapor-lavender: #FFFB96;       /* Pale yellow */

/* Background Gradients */
--vapor-bg-start: #FF71CE;
--vapor-bg-end: #01CDFE;
--vapor-dark: #1A0E2E;
--vapor-darker: #0D0221;

/* Accent Colors */
--vapor-gold: #FFD700;
--vapor-magenta: #FF006E;
--vapor-aqua: #00F5FF;
```

### Typography

```css
/* Vaporwave Fonts */
font-family: 'VT323', monospace;           /* Retro terminal */
font-family: 'Press Start 2P', cursive;    /* 8-bit style */
font-family: 'Orbitron', sans-serif;       /* Futuristic */
font-family: 'Major Mono Display', monospace; /* Geometric */
```

---

## VAPORWAVE UI COMPONENTS

### 1. Gradient Backgrounds

```css
.vaporwave-bg {
  background: linear-gradient(
    135deg,
    #FF71CE 0%,
    #B967FF 25%,
    #01CDFE 50%,
    #05FFA1 75%,
    #FFFB96 100%
  );
  animation: gradient-shift 10s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

### 2. Grid Lines (Essential Vaporwave Element)

```css
.vapor-grid {
  background-image: 
    linear-gradient(0deg, rgba(1, 205, 254, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(1, 205, 254, 0.3) 1px, transparent 1px);
  background-size: 50px 50px;
  position: relative;
  perspective: 1000px;
}

.vapor-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 113, 206, 0.1) 50%,
    transparent 100%
  );
  transform: rotateX(60deg);
  pointer-events: none;
}
```

### 3. Windows (Vaporwave Style)

```tsx
// components/vaporwave/Window.tsx
export function VaporWindow({ title, children }: any) {
  return (
    <div className="relative">
      {/* Glitch effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-vapor-pink to-vapor-teal opacity-50 blur-xl" />
      
      {/* Main window */}
      <div className="relative bg-vapor-darker/90 backdrop-blur-md border-2 border-vapor-teal">
        {/* Title bar with gradient */}
        <div className="h-8 bg-gradient-to-r from-vapor-pink via-vapor-purple to-vapor-teal flex items-center px-3">
          <span className="text-white font-['VT323'] text-lg tracking-wider">
            {title}
          </span>
          <div className="ml-auto flex gap-1">
            <div className="w-4 h-4 bg-vapor-aqua" />
            <div className="w-4 h-4 bg-vapor-magenta" />
            <div className="w-4 h-4 bg-vapor-gold" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-vapor-blue font-['VT323']">
          {children}
        </div>
      </div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(1,205,254,0.05)_2px,rgba(1,205,254,0.05)_4px)]" />
      </div>
    </div>
  )
}
```

### 4. Buttons (Vaporwave)

```css
.vapor-button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #FF71CE, #01CDFE);
  border: 2px solid #05FFA1;
  color: white;
  font-family: 'VT323', monospace;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vapor-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3));
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.vapor-button:hover::before {
  transform: translateX(100%);
}

.vapor-button:hover {
  box-shadow: 
    0 0 20px #FF71CE,
    0 0 40px #01CDFE,
    0 0 60px #05FFA1;
  transform: translateY(-2px);
}
```

---

## VAPORWAVE VISUAL ELEMENTS

### 1. Japanese Text (Essential)

```tsx
<div className="text-vapor-pink font-['Noto Sans JP'] text-4xl">
  技術覚醒
</div>
<div className="text-vapor-teal font-['VT323'] text-2xl tracking-widest">
  テクノロジー
</div>
```

### 2. Glitch Text Effect

```css
.glitch {
  position: relative;
  color: #01CDFE;
  font-family: 'VT323', monospace;
  font-size: 48px;
  animation: glitch-anim 2s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #FF71CE;
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #05FFA1;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim-3 2.5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}
```

### 3. Holographic Effect

```css
.holographic {
  background: linear-gradient(
    135deg,
    #FF71CE 0%,
    #01CDFE 25%,
    #05FFA1 50%,
    #B967FF 75%,
    #FF71CE 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: holographic-shift 3s ease infinite;
}

@keyframes holographic-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

## COMPLETE PAGE EXAMPLE

```tsx
// app/page.tsx - Vaporwave Style
export default function VaporwavePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-vapor-darker">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-vapor-pink via-vapor-purple to-vapor-teal opacity-30 animate-gradient" />
      
      {/* Grid lines */}
      <div className="fixed inset-0 vapor-grid opacity-40" />
      
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(1,205,254,0.03)_2px,rgba(1,205,254,0.03)_4px)]" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 
            className="text-8xl font-['VT323'] glitch mb-4"
            data-text="OECE.TECH"
          >
            OECE.TECH
          </h1>
          
          <div className="text-vapor-pink text-4xl font-['Noto Sans JP'] mb-2">
            技術覚醒
          </div>
          
          <div className="holographic text-3xl font-['Press Start 2P'] tracking-widest">
            TECHNICAL AWAKENING
          </div>
        </div>
        
        {/* Windows */}
        <div className="grid md:grid-cols-3 gap-8">
          <VaporWindow title="NETWORK_PROTOCOL.EXE">
            <div className="space-y-2">
              <div className="text-vapor-teal">專用網絡技術</div>
              <div className="text-vapor-pink">跨境網絡訪問</div>
              <div className="text-vapor-blue">網絡協議工程</div>
            </div>
          </VaporWindow>
          
          <VaporWindow title="SKILL_MONEY.EXE">
            <div className="space-y-2">
              <div className="text-vapor-gold">快速賺錢</div>
              <div className="text-vapor-magenta">技能變現</div>
              <div className="text-vapor-aqua">遠程工作</div>
            </div>
          </VaporWindow>
          
          <VaporWindow title="DIGITAL_NOMAD.EXE">
            <div className="space-y-2">
              <div className="text-vapor-lavender">數字游民</div>
              <div className="text-vapor-purple">全球生活</div>
              <div className="text-vapor-teal">財務自由</div>
            </div>
          </VaporWindow>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-4 gap-4">
          {[
            { label: 'AWAKENED', value: '3847' },
            { label: 'EARNING $3K+', value: '482' },
            { label: 'NOMADS', value: '156' },
            { label: 'SUCCESS', value: '689' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-vapor-darker/90 backdrop-blur-md border-2 border-vapor-teal p-6 text-center"
            >
              <div className="text-5xl font-['VT323'] text-vapor-pink mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-['Press Start 2P'] text-vapor-blue">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="vapor-button">
            START YOUR JOURNEY
          </button>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="fixed bottom-10 right-10 text-vapor-pink font-['Noto Sans JP'] text-6xl opacity-20 animate-float">
        夢
      </div>
    </div>
  )
}
```

---

## VAPORWAVE CSS ANIMATIONS

```css
/* Gradient animation */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Pulse glow */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 113, 206, 0.5),
      0 0 40px rgba(1, 205, 254, 0.3);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(255, 113, 206, 0.8),
      0 0 80px rgba(1, 205, 254, 0.5);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Scan effect */
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(1, 205, 254, 0.8),
    transparent
  );
  animation: scan 8s linear infinite;
}
```

---

## TAILWIND CONFIG

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'vapor-pink': '#FF71CE',
        'vapor-purple': '#B967FF',
        'vapor-blue': '#05FFA1',
        'vapor-teal': '#01CDFE',
        'vapor-lavender': '#FFFB96',
        'vapor-gold': '#FFD700',
        'vapor-magenta': '#FF006E',
        'vapor-aqua': '#00F5FF',
        'vapor-dark': '#1A0E2E',
        'vapor-darker': '#0D0221',
      },
      fontFamily: {
        'vt323': ['"VT323"', 'monospace'],
        'press-start': ['"Press Start 2P"', 'cursive'],
        'orbitron': ['"Orbitron"', 'sans-serif'],
        'noto-jp': ['"Noto Sans JP"', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch-anim 2s infinite',
      }
    }
  }
}
```

---

## FONT IMPORTS

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');
```

---

**VAPORWAVE DESIGN SYSTEM COMPLETE!**

**CORE ELEMENTS:**
- Pink/Purple/Cyan gradients
- Grid lines with perspective
- Japanese text elements
- Glitch effects
- Holographic text
- Scanlines
- VT323 monospace font
- Windows 95/98 style windows
- Neon glow effects

**NEXT STEP:** Apply to homepage
