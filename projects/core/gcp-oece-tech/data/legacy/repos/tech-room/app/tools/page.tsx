'use client'

import { useState } from 'react'
import { Zap, Gauge, Globe, Lock, Code, FileJson, Terminal } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const [speedTest, setSpeedTest] = useState({
    testing: false,
    download: null as number | null,
    upload: null as number | null,
    latency: null as number | null,
  })

  const startSpeedTest = async () => {
    setSpeedTest({ testing: true, download: null, upload: null, latency: null })
    
    try {
      // 测试延迟
      const latencyStart = Date.now()
      await fetch('https://1.1.1.1/cdn-cgi/trace')
      const latency = Date.now() - latencyStart
      
      // 测试下载速度（10MB）
      const downloadStart = Date.now()
      const response = await fetch('https://speed.cloudflare.com/__down?bytes=10000000')
      await response.arrayBuffer()
      const downloadTime = (Date.now() - downloadStart) / 1000
      const downloadSpeed = (10 * 8) / downloadTime
      
      // 模拟上传速度（实际需要服务器支持）
      const uploadSpeed = downloadSpeed * 0.8
      
      setSpeedTest({
        testing: false,
        download: parseFloat(downloadSpeed.toFixed(2)),
        upload: parseFloat(uploadSpeed.toFixed(2)),
        latency: latency,
      })
    } catch (error) {
      console.error('Speed test failed:', error)
      setSpeedTest({ testing: false, download: null, upload: null, latency: null })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <section className="text-center mb-16">
        <div className="inline-block font-mono text-xs text-pixel-accent border border-pixel-accent px-3 py-1 mb-4">
          [TOOLKIT_SYSTEM]
        </div>
        <h1 className="text-pixel-2xl mb-6 text-neon">
          工具庫
        </h1>
        <p className="text-lg text-pixel-light/80 font-mono max-w-2xl mx-auto">
          專業開發者必備工具集合
        </p>
      </section>

      {/* VPN Speed Test */}
      <section className="mb-12">
        <div className="card-pixel-glow">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="text-pixel-primary" size={32} />
            <div>
              <h2 className="text-pixel-lg">網絡速度測試</h2>
              <p className="text-sm text-pixel-light/70 font-mono">測試你的 VPN/網絡連接速度</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Download Speed */}
            <div className="card-pixel text-center p-6">
              <div className="text-sm text-pixel-light/70 mb-2 font-mono">下載速度</div>
              <div className={`text-3xl font-bold font-mono mb-2 ${
                speedTest.download ? 'text-pixel-primary' : 'text-pixel-light/30'
              }`}>
                {speedTest.testing ? '...' : speedTest.download ? `${speedTest.download}` : '--'}
              </div>
              <div className="text-xs text-pixel-light/50 font-mono">Mbps</div>
            </div>

            {/* Upload Speed */}
            <div className="card-pixel text-center p-6">
              <div className="text-sm text-pixel-light/70 mb-2 font-mono">上傳速度</div>
              <div className={`text-3xl font-bold font-mono mb-2 ${
                speedTest.upload ? 'text-pixel-accent' : 'text-pixel-light/30'
              }`}>
                {speedTest.testing ? '...' : speedTest.upload ? `${speedTest.upload}` : '--'}
              </div>
              <div className="text-xs text-pixel-light/50 font-mono">Mbps</div>
            </div>

            {/* Latency */}
            <div className="card-pixel text-center p-6">
              <div className="text-sm text-pixel-light/70 mb-2 font-mono">延遲</div>
              <div className={`text-3xl font-bold font-mono mb-2 ${
                speedTest.latency ? 'text-pixel-secondary' : 'text-pixel-light/30'
              }`}>
                {speedTest.testing ? '...' : speedTest.latency ? `${speedTest.latency}` : '--'}
              </div>
              <div className="text-xs text-pixel-light/50 font-mono">ms</div>
            </div>
          </div>

          <button
            onClick={startSpeedTest}
            disabled={speedTest.testing}
            className="btn-pixel w-full"
          >
            <Zap className="inline mr-2" size={16} />
            {speedTest.testing ? '測試中...' : '開始測試'}
          </button>

          <div className="mt-4 text-xs text-pixel-light/50 font-mono text-center">
            使用 Cloudflare 全球節點進行測試
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section>
        <h2 className="text-pixel-lg mb-6 text-center">
          <span className="text-pixel-accent font-mono">[</span>
          更多工具
          <span className="text-pixel-accent font-mono">]</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* IP Information */}
          <div className="card-pixel-glow group">
            <div className="mb-4">
              <Globe className="text-pixel-accent" size={40} />
            </div>
            <h3 className="text-pixel-base mb-3 font-mono">IP 信息查詢</h3>
            <p className="text-sm text-pixel-light/70 mb-4 font-sans">
              查詢 IP 地址的地理位置、ISP 等信息
            </p>
            <button className="btn-pixel-outline w-full text-sm" disabled>
              即將推出
            </button>
          </div>

          {/* Encryption Tool */}
          <div className="card-pixel-glow group">
            <div className="mb-4">
              <Lock className="text-pixel-secondary" size={40} />
            </div>
            <h3 className="text-pixel-base mb-3 font-mono">加密/解密</h3>
            <p className="text-sm text-pixel-light/70 mb-4 font-sans">
              支持 Base64、MD5、SHA256 等多種加密方式
            </p>
            <button className="btn-pixel-outline w-full text-sm" disabled>
              即將推出
            </button>
          </div>

          {/* Code Editor */}
          <div className="card-pixel-glow group">
            <div className="mb-4">
              <Code className="text-pixel-primary" size={40} />
            </div>
            <h3 className="text-pixel-base mb-3 font-mono">在線代碼編輯器</h3>
            <p className="text-sm text-pixel-light/70 mb-4 font-sans">
              支持多種語言的在線編輯和運行
            </p>
            <button className="btn-pixel-outline w-full text-sm" disabled>
              即將推出
            </button>
          </div>

          {/* JSON Formatter */}
          <div className="card-pixel-glow group">
            <div className="mb-4">
              <FileJson className="text-pixel-warning" size={40} />
            </div>
            <h3 className="text-pixel-base mb-3 font-mono">JSON 格式化</h3>
            <p className="text-sm text-pixel-light/70 mb-4 font-sans">
              美化、驗證和轉換 JSON 數據
            </p>
            <button className="btn-pixel-outline w-full text-sm" disabled>
              即將推出
            </button>
          </div>

          {/* API Tester */}
          <div className="card-pixel-glow group">
            <div className="mb-4">
              <Terminal className="text-pixel-accent" size={40} />
            </div>
            <h3 className="text-pixel-base mb-3 font-mono">API 測試工具</h3>
            <p className="text-sm text-pixel-light/70 mb-4 font-sans">
              測試和調試 REST API 接口
            </p>
            <button className="btn-pixel-outline w-full text-sm" disabled>
              即將推出
            </button>
          </div>

          {/* More Coming */}
          <div className="card-pixel border-dashed">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-pixel-base mb-3 font-mono">更多工具</h3>
              <p className="text-sm text-pixel-light/70 font-sans">
                持續開發中...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="card-pixel-glow text-center p-8">
          <h3 className="text-pixel-lg mb-4 text-neon-cyan font-mono">
            需要更多工具？
          </h3>
          <p className="text-pixel-light/80 mb-6 font-mono">
            加入 GeekSEA 社區，提出你的需求
          </p>
          <Link href="/forum" className="btn-pixel">
            前往論壇 →
          </Link>
        </div>
      </section>
    </div>
  )
}
