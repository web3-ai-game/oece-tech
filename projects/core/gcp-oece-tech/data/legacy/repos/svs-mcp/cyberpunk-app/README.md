# 🌃 Cyberpunk Nexus

A cutting-edge Next.js 14 application with a stunning cyberpunk theme, complete with glitch effects, neon aesthetics, and modern web technologies.

## ✨ Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom cyberpunk theme
- **Framer Motion** for smooth animations
- **Docker** containerization
- **Nginx** reverse proxy
- **Responsive** design
- **Cyberpunk UI Components**:
  - Glitch text effects
  - Neon buttons
  - Holographic cards
  - Terminal interface
  - Scanline overlays

## 🎨 Color Palette

```typescript
const cyberpunkTheme = {
  colors: {
    shadow: '#9333EA',      // 影子紫
    neon: '#00FFF0',        // 霓虹青
    matrix: '#00FF41',      // 矩陣綠
    glitch: '#FF0080',      // 故障粉
    darkMode: '#0A0A0B',    // 深黑背景
    pixelGrid: '#1A1A2E'    // 像素格子
  }
}
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production (Docker)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
cyberpunk-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── effects/
│   │   │   └── GlitchText.tsx  # Glitch text effect
│   │   └── ui/
│   │       ├── NeonButton.tsx  # Neon button component
│   │       ├── CyberCard.tsx   # Cyber card component
│   │       └── Terminal.tsx    # Terminal component
│   └── lib/
│       └── utils.ts            # Utility functions
├── nginx/
│   └── nginx.conf              # Nginx configuration
├── docker-compose.yml          # Docker Compose config
├── Dockerfile                  # Docker build config
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 📦 Components Usage

### GlitchText
```tsx
<GlitchText 
  text="CYBERPUNK" 
  intensity="high" 
  className="text-6xl" 
/>
```

### NeonButton
```tsx
<NeonButton variant="neon">Click Me</NeonButton>
```

### CyberCard
```tsx
<CyberCard
  title="Neural Link"
  description="Connect to the network"
  icon="🧠"
/>
```

## 🐳 Docker Setup

1. Update `.env` with your configuration
2. Modify `docker-compose.yml` domain settings
3. Run `docker-compose up -d`

## 📝 License

MIT License

---

**Made with 💜 in the Cyberpunk Universe**
