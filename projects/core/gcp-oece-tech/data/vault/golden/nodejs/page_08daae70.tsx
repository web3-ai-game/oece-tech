'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import './color.css'

export default function ColorPicker() {
  const [hexColor, setHexColor] = useState('#00fff9')
  const [copied, setCopied] = useState('')

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    } else {
      s = 0
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const rgb = hexToRgb(hexColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const presetColors = [
    '#00fff9', '#ff006e', '#8b5cf6', '#ffbe0b', '#00ff00',
    '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#000000', '#ffffff', '#808080', '#c0c0c0', '#800000'
  ]

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Link href="/" className="pixel-logo">OECE.TECH</Link>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <Link href="/">首頁</Link>
            <Link href="/tutorials">教學</Link>
            <Link href="/toolkits">工具包</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="tool-page-header">
          <Link href="/toolkits/development" className="back-link">
            <ArrowLeft size={20} />
            <span>返回開發者工具</span>
          </Link>
          <div className="tool-title-section">
            <div className="tool-icon-large">🎨</div>
            <div>
              <h1 className="tool-title">顏色拾取器</h1>
              <p className="tool-subtitle">HEX / RGB / HSL 顏色轉換工具</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="color-picker-section">
            <div className="color-display" style={{ backgroundColor: hexColor }}>
              <input
                type="color"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="color-input"
              />
            </div>
            
            <div className="color-values">
              <div className="color-value-item">
                <div className="section-header">
                  <label className="section-label">HEX</label>
                  <button className="copy-btn" onClick={() => handleCopy(hexColor, 'hex')}>
                    {copied === 'hex' ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied === 'hex' ? '已複製' : '複製'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  className="color-value-input"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                />
              </div>

              {rgb && (
                <>
                  <div className="color-value-item">
                    <div className="section-header">
                      <label className="section-label">RGB</label>
                      <button 
                        className="copy-btn" 
                        onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                      >
                        {copied === 'rgb' ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied === 'rgb' ? '已複製' : '複製'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="color-value-input"
                      value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      readOnly
                    />
                  </div>

                  {hsl && (
                    <div className="color-value-item">
                      <div className="section-header">
                        <label className="section-label">HSL</label>
                        <button 
                          className="copy-btn" 
                          onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                        >
                          {copied === 'hsl' ? <Check size={16} /> : <Copy size={16} />}
                          <span>{copied === 'hsl' ? '已複製' : '複製'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        className="color-value-input"
                        value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                        readOnly
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="preset-colors">
            <h4>預設顏色</h4>
            <div className="preset-grid">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="preset-color-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => setHexColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 使用說明</h3>
            <ul>
              <li><strong>HEX</strong>：網頁開發最常用的顏色格式</li>
              <li><strong>RGB</strong>：紅綠藍三色通道，範圍0-255</li>
              <li><strong>HSL</strong>：色相、飽和度、亮度，更直觀</li>
              <li>點擊色塊或輸入HEX值即可更新</li>
            </ul>
            
            <h3>📌 常見用途</h3>
            <ul>
              <li>網頁設計和CSS編寫</li>
              <li>UI/UX配色方案</li>
              <li>品牌色彩管理</li>
              <li>顏色格式轉換</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>

      <style jsx>{`
        .color-picker-section {
          background: var(--bg-secondary);
          border: 2px solid var(--accent-cyan);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .color-display {
          width: 100%;
          height: 200px;
          border-radius: 12px;
          margin-bottom: 2rem;
          position: relative;
          cursor: pointer;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .color-input {
          width: 100px;
          height: 100px;
          border: 4px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .color-values {
          display: grid;
          gap: 1.5rem;
        }
        
        .color-value-item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .color-value-input {
          width: 100%;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .color-value-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
        }
        
        .preset-colors {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .preset-colors h4 {
          margin: 0 0 1rem 0;
          color: var(--text-primary);
        }
        
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 1rem;
        }
        
        .preset-color-btn {
          width: 100%;
          aspect-ratio: 1;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .preset-color-btn:hover {
          transform: scale(1.1);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(0, 255, 249, 0.5);
        }
      `}</style>
    </div>
  )
}
