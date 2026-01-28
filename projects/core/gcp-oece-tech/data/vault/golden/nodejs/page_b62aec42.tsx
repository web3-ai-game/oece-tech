'use client'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Download, Upload } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import './ascii.css'

export default function AsciiArtTool() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [width, setWidth] = useState(100)
  const [charSet, setCharSet] = useState('detailed')
  const [invertColors, setInvertColors] = useState(false)
  const [asciiArt, setAsciiArt] = useState('請上傳圖片並點擊轉換...')
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState('ascii-art')
  const [isConverting, setIsConverting] = useState(false)
  const outputRef = useRef<HTMLPreElement>(null)

  const charRamps = {
    detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    simple: " .:-=+*#%@",
    minimal: " .#",
    blocks: " █"
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name.split('.').slice(0, -1).join('.') || 'ascii-art')

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setImagePreview(event.target?.result as string)
        setAsciiArt('準備就緒，請點擊轉換。')
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const generateAscii = () => {
    if (!image) return

    setIsConverting(true)
    setAsciiArt('正在生成，請稍候...')

    setTimeout(() => {
      try {
        const ramp = charRamps[charSet as keyof typeof charRamps]
        const aspectRatioCorrection = 0.5
        const height = Math.floor((image.height / image.width) * width * aspectRatioCorrection)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        canvas.width = width
        canvas.height = height
        ctx.drawImage(image, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height).data
        let result = ''

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4
            const r = imageData[index]
            const g = imageData[index + 1]
            const b = imageData[index + 2]

            let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if (invertColors) gray = 255 - gray

            const rampIndex = Math.floor((gray / 255) * (ramp.length - 1))
            result += ramp[rampIndex]
          }
          result += '\n'
        }

        setAsciiArt(result)
        adjustOutputSize(width)
      } catch (error) {
        console.error('轉換出錯:', error)
        setAsciiArt(`轉換失敗：${error}`)
      } finally {
        setIsConverting(false)
      }
    }, 50)
  }

  const adjustOutputSize = (charWidth: number) => {
    setTimeout(() => {
      if (!outputRef.current) return

      const container = outputRef.current.parentElement
      if (!container) return

      // 计算缩放比例：根据精确度（width）动态调整
      // width越大，需要缩放得越小才能完整显示
      let scale = 1
      
      if (charWidth <= 100) {
        scale = 1 // 100及以下，正常显示
      } else if (charWidth <= 200) {
        scale = 100 / charWidth // 100-200之间，线性缩放
      } else {
        // 200以上，使用更激进的缩放公式
        scale = Math.max(0.15, 50 / charWidth)
      }

      outputRef.current.style.transform = `scale(${scale})`
      outputRef.current.style.fontSize = '12px'
      outputRef.current.style.lineHeight = '1.0'
      outputRef.current.style.letterSpacing = '0px'
    }, 0)
  }

  useEffect(() => {
    if (image) {
      generateAscii()
    }
  }, [width, charSet, invertColors])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiArt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = asciiArt
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([asciiArt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}-ascii.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
              <h1 className="tool-title">圖片轉字符畫</h1>
              <p className="tool-subtitle">將圖片轉換為ASCII藝術字符畫</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          <div className="ascii-controls-grid">
            {/* 左側：控制面板 */}
            <div className="controls-panel">
              <div className="control-group">
                <label className="section-label">
                  <Upload size={16} />
                  1. 選擇圖片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>

              <div className="control-group">
                <label className="section-label">
                  2. 調整寬度 (精確度): <span className="value-highlight">{width}</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="width-slider"
                />
              </div>

              <div className="control-group">
                <label className="section-label">3. 選擇字符集</label>
                <select
                  value={charSet}
                  onChange={(e) => setCharSet(e.target.value)}
                  className="charset-select"
                >
                  <option value="detailed">高精度 (detailed)</option>
                  <option value="simple">中等 (simple)</option>
                  <option value="minimal">最低 (minimal)</option>
                  <option value="blocks">方塊 (blocks)</option>
                </select>
              </div>

              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={invertColors}
                    onChange={(e) => setInvertColors(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>4. 反轉顏色 (黑底白字)</span>
                </label>
              </div>
            </div>

            {/* 右側：圖片預覽 */}
            <div className="preview-panel">
              {imagePreview ? (
                <img src={imagePreview} alt="預覽" className="preview-image" />
              ) : (
                <div className="preview-placeholder">
                  <Upload size={48} />
                  <p>請上傳圖片</p>
                </div>
              )}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="action-buttons">
            <button
              onClick={generateAscii}
              disabled={!image || isConverting}
              className="action-btn primary"
            >
              {isConverting ? '轉換中...' : image ? '重新轉換' : '請先上傳圖片'}
            </button>
            <button
              onClick={handleCopy}
              disabled={!image || asciiArt.includes('請上傳') || asciiArt.includes('準備就緒')}
              className="action-btn secondary"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '已複製' : '複製結果'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!image || asciiArt.includes('請上傳') || asciiArt.includes('準備就緒')}
              className="action-btn secondary"
            >
              <Download size={16} />
              <span>下載 .txt</span>
            </button>
          </div>

          {/* 輸出區域 - 使用縮放容器 */}
          <div className="output-wrapper">
            <label className="section-label">轉換結果：</label>
            <div className="output-container">
              <pre ref={outputRef} className="ascii-output">
                {asciiArt}
              </pre>
            </div>
          </div>

          <div className="tool-info">
            <h3>💡 使用說明</h3>
            <ul>
              <li><strong>上傳圖片</strong>：支持常見圖片格式（JPG、PNG、GIF等）</li>
              <li><strong>調整精確度</strong>：數值越大，字符畫越精細，但字體會更小</li>
              <li><strong>字符集選擇</strong>：不同字符集產生不同風格的效果</li>
              <li><strong>自動縮放</strong>：輸出區域會自動調整以完整顯示整個圖像</li>
            </ul>

            <h3>📌 常見用途</h3>
            <ul>
              <li>社交媒體藝術分享</li>
              <li>論壇簽名檔製作</li>
              <li>ASCII藝術創作</li>
              <li>Geek風格頭像生成</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>
    </div>
  )
}
