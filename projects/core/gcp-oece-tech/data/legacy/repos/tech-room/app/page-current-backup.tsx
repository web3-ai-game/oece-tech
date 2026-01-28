'use client'

import Link from 'next/link'
import { BookOpen, Coins, Globe, TrendingUp, Shield, Terminal, Wifi, Lock, Eye, Cpu, Radio } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import { 
  HexagonGrid, 
  TechCorners,
  HologramScanlines
} from '@/components/decorations/CyberDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* 背景装饰 */}
      <HexagonGrid className="text-pixel-primary opacity-5" />
      <HologramScanlines />
      <TechCorners className="text-pixel-primary opacity-20" />
      
      <div className="relative z-10">
        
        {/* Hero Section - 教程聚合平台 */}
        <section className="min-h-[70vh] flex items-center justify-center px-4 pt-20 pb-12">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Logo */}
            <div className="mb-6">
              <OECELogo size={180} animated={true} glowing={true} />
            </div>
            
            {/* 主标题 */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-mono">
              <span className="text-neon">技術教程</span>
              <span className="text-neon-cyan">聚合平台</span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-pixel-accent mb-3 font-mono">
              Tutorial Knowledge Aggregation Hub
            </p>
            <p className="text-base text-pixel-light/70 mb-8 font-mono">
              🌐 技術自由 · 💡 知識無價 · 🔐 完全匿名
            </p>
            
            {/* 核心价值 */}
            <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm">
                <BookOpen className="text-pixel-primary mx-auto mb-2" size={28} />
                <div className="text-sm font-mono text-pixel-primary mb-1">30+ 專業教程</div>
                <div className="text-xs text-pixel-light/60">Professional Tutorials</div>
              </div>
              
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm">
                <Coins className="text-pixel-warning mx-auto mb-2" size={28} />
                <div className="text-sm font-mono text-pixel-warning mb-1">積分眾包</div>
                <div className="text-xs text-pixel-light/60">Point Crowdsourcing</div>
              </div>
              
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm">
                <Globe className="text-pixel-accent mx-auto mb-2" size={28} />
                <div className="text-sm font-mono text-pixel-accent mb-1">繁體/英文</div>
                <div className="text-xs text-pixel-light/60">Multi-language</div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/tutorials" 
                className="btn-pixel group px-10 py-4 text-lg"
              >
                <BookOpen size={22} className="inline mr-2" />
                <span>開始學習</span>
              </Link>
              
              <Link 
                href="/auth/register" 
                className="btn-pixel-outline group px-10 py-4 text-lg"
              >
                <Coins size={22} className="inline mr-2" />
                <span>寫教程賺積分</span>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 教程分类 - 核心内容 */}
        <section className="py-16 px-4 bg-pixel-darker/30">
          <div className="max-w-7xl mx-auto">
            
            {/* 标题 */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono text-neon">
                🔥 精選教程分類
              </h2>
              <p className="text-pixel-light/70 font-mono">
                涵蓋出海、匿名、安全、實戰全技術棧
              </p>
            </div>
            
            {/* 分类网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. 出海第一步 */}
              <Link href="/tutorials/getting-started" className="card-pixel-glow group hover:border-pixel-primary transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-primary/20 flex items-center justify-center text-3xl">
                      🚀
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-primary mb-1">
                        出海第一步
                      </h3>
                      <p className="text-xs text-pixel-light/60">Getting Started</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• Google郵箱註冊完整指南</li>
                    <li>• 數字世界匿名化入門</li>
                    <li>• 國外服務註冊技巧</li>
                    <li>• 支付方式選擇</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-primary font-mono">
                    → 8篇教程
                  </div>
                </div>
              </Link>
              
              {/* 2. VPN/SS技术 */}
              <Link href="/tutorials/vpn-tech" className="card-pixel-glow group hover:border-pixel-accent transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-accent/20 flex items-center justify-center text-3xl">
                      🔐
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-accent mb-1">
                        VPN/SS技術
                      </h3>
                      <p className="text-xs text-pixel-light/60">VPN/SS Tech</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• VPN基礎原理（技術角度）</li>
                    <li>• SS/SSR協議詳解</li>
                    <li>• V2Ray完整配置</li>
                    <li>• 自建VPN服務器教程</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-accent font-mono">
                    → 6篇教程
                  </div>
                </div>
              </Link>
              
              {/* 3. 社会工程学 */}
              <Link href="/tutorials/social-engineering" className="card-pixel-glow group hover:border-pixel-warning transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-warning/20 flex items-center justify-center text-3xl">
                      🕵️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-warning mb-1">
                        社會工程學
                      </h3>
                      <p className="text-xs text-pixel-light/60">Social Engineering</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 信息收集技巧</li>
                    <li>• OSINT開源情報</li>
                    <li>• 社工防範指南</li>
                    <li>• 數字足跡清理</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-warning font-mono">
                    → 5篇教程
                  </div>
                </div>
              </Link>
              
              {/* 4. Kali Linux */}
              <Link href="/tutorials/kali-linux" className="card-pixel-glow group hover:border-pixel-secondary transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-secondary/20 flex items-center justify-center text-3xl">
                      🐧
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-secondary mb-1">
                        Kali實戰
                      </h3>
                      <p className="text-xs text-pixel-light/60">Kali Linux</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• Kali環境搭建</li>
                    <li>• 滲透測試工具</li>
                    <li>• 網絡安全實戰</li>
                    <li>• 漏洞掃描技術</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-secondary font-mono">
                    → 4篇教程
                  </div>
                </div>
              </Link>
              
              {/* 5. 匿名化技术 */}
              <Link href="/tutorials/anonymity" className="card-pixel-glow group hover:border-pixel-primary transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-primary/20 flex items-center justify-center text-3xl">
                      🛡️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-primary mb-1">
                        匿名化技術
                      </h3>
                      <p className="text-xs text-pixel-light/60">Anonymity Tech</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 軟件匿名化處理</li>
                    <li>• 加密通信技巧</li>
                    <li>• Tor網絡使用</li>
                    <li>• 隱私瀏覽器配置</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-primary font-mono">
                    → 7篇教程
                  </div>
                </div>
              </Link>
              
              {/* 6. SSH/远程技巧 */}
              <Link href="/tutorials/ssh-remote" className="card-pixel-glow group hover:border-pixel-accent transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-accent/20 flex items-center justify-center text-3xl">
                      💻
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-accent mb-1">
                        SSH/遠程技巧
                      </h3>
                      <p className="text-xs text-pixel-light/60">SSH & Remote</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• SSH安全配置</li>
                    <li>• 跳板機搭建</li>
                    <li>• 3389遠程桌面</li>
                    <li>• 虛擬機技巧</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-accent font-mono">
                    → 5篇教程
                  </div>
                </div>
              </Link>
              
              {/* 7. 硬件改装 */}
              <Link href="/tutorials/hardware" className="card-pixel-glow group hover:border-pixel-warning transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-warning/20 flex items-center justify-center text-3xl">
                      🔧
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-warning mb-1">
                        硬件改裝
                      </h3>
                      <p className="text-xs text-pixel-light/60">Hardware Mod</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 路由器刷機</li>
                    <li>• 硬件匿名化</li>
                    <li>• 設備指紋清除</li>
                    <li>• 防追蹤硬件</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-warning font-mono">
                    → 3篇教程
                  </div>
                </div>
              </Link>
              
              {/* 8. 反跟踪 (地狱难度) */}
              <Link href="/tutorials/anti-tracking" className="card-pixel-glow group hover:border-pixel-danger transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-danger/20 flex items-center justify-center text-3xl">
                      🎯
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-danger mb-1">
                        反跟蹤反偵察
                      </h3>
                      <p className="text-xs text-pixel-light/60">Anti-Tracking 🔥</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 反追蹤技術</li>
                    <li>• 反偵察手段</li>
                    <li>• 虛擬身份構建</li>
                    <li>• 深度匿名方案</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-danger font-mono flex items-center gap-2">
                    <span>→ 4篇教程</span>
                    <span className="px-2 py-0.5 bg-pixel-danger/20 rounded text-xs">地獄難度</span>
                  </div>
                </div>
              </Link>
              
              {/* 9. 虚拟环境 */}
              <Link href="/tutorials/virtual-env" className="card-pixel-glow group hover:border-pixel-primary transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-primary/20 flex items-center justify-center text-3xl">
                      🎮
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-primary mb-1">
                        虛擬環境搭建
                      </h3>
                      <p className="text-xs text-pixel-light/60">Virtual Environment</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 完整虛擬環境</li>
                    <li>• AI生成選擇題</li>
                    <li>• 真實世界實驗環境</li>
                    <li>• 沙盒測試平台</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-primary font-mono">
                    → 3篇教程
                  </div>
                </div>
              </Link>
              
              {/* 10. 跳坑指南 */}
              <Link href="/tutorials/avoid-pitfalls" className="card-pixel-glow group hover:border-pixel-accent transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-pixel-accent/20 flex items-center justify-center text-3xl">
                      🌐
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-mono text-pixel-accent mb-1">
                        跳坑第一站
                      </h3>
                      <p className="text-xs text-pixel-light/60">Avoid Pitfalls</p>
                    </div>
                  </div>
                  <ul className="text-sm text-pixel-light/80 space-y-1">
                    <li>• 常見錯誤避免</li>
                    <li>• 新手容易踩的坑</li>
                    <li>• 最佳實踐</li>
                    <li>• 故障排查</li>
                  </ul>
                  <div className="mt-4 text-xs text-pixel-accent font-mono">
                    → 6篇教程
                  </div>
                </div>
              </Link>
              
            </div>
          </div>
        </section>
        
        {/* 积分系统说明 */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Coins className="text-pixel-warning mx-auto mb-4" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono text-neon">
                💰 積分眾包系統
              </h2>
              <p className="text-pixel-light/70 font-mono">
                寫教程賺積分 · 看廣告賺積分 · 積分解鎖高級教程
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* 获取积分 */}
              <div className="card-pixel-glow p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-pixel-primary" size={32} />
                  <h3 className="text-2xl font-bold font-mono text-pixel-primary">
                    獲取積分
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-primary">1</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        註冊獎勵
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        邀請碼: <span className="text-pixel-primary">150分</span> · 
                        看5個廣告: <span className="text-pixel-primary">100分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-primary">2</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        貢獻教程
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        短教程: <span className="text-pixel-warning">100-300分</span> · 
                        長教程: <span className="text-pixel-warning">500-1000分</span> · 
                        精品: <span className="text-pixel-warning">2000+分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-primary">3</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        看廣告
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        每個廣告: <span className="text-pixel-accent">20分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-primary">4</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        社區互動
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        發帖: <span className="text-pixel-secondary">20分</span> · 
                        回復: <span className="text-pixel-secondary">5分</span> · 
                        獲讚: <span className="text-pixel-secondary">2分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 消费积分 */}
              <div className="card-pixel-glow p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-pixel-accent" size={32} />
                  <h3 className="text-2xl font-bold font-mono text-pixel-accent">
                    消費積分
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-accent">1</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        解鎖教程
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        基礎教程: <span className="text-pixel-primary">免費</span> · 
                        進階教程: <span className="text-pixel-warning">50-200分</span> · 
                        高級教程: <span className="text-pixel-danger">300-1000分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-accent">2</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        下載資源
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        工具/腳本: <span className="text-pixel-warning">50-500分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pixel-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-pixel-accent">3</span>
                    </div>
                    <div>
                      <div className="text-base font-mono text-pixel-light mb-1">
                        私密諮詢
                      </div>
                      <div className="text-sm text-pixel-light/60">
                        匿名提問: <span className="text-pixel-primary">100分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/points" 
                className="btn-pixel-outline px-8 py-3"
              >
                <Coins size={18} className="inline mr-2" />
                <span>了解更多積分規則</span>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 免责声明 */}
        <section className="py-12 px-4 bg-pixel-darker/50">
          <div className="max-w-4xl mx-auto">
            <div className="card-pixel border-pixel-danger bg-pixel-danger/5 p-6 backdrop-blur-sm">
              <div className="text-center">
                <Shield className="text-pixel-danger mx-auto mb-3" size={32} />
                <h3 className="text-lg font-mono text-pixel-danger mb-3">
                  ⚠️ 重要聲明
                </h3>
                <p className="text-sm text-pixel-light/80 leading-relaxed">
                  本平台提供的所有教程內容僅供<strong className="text-pixel-accent">技術學習和研究</strong>使用。
                  請勿將教程內容用於任何<strong className="text-pixel-danger">非法用途</strong>。
                  用戶需自行承擔使用教程的法律責任，<strong className="text-pixel-warning">與平台無關</strong>。
                  請遵守當地法律法規。
                </p>
                <div className="mt-4">
                  <Link 
                    href="/disclaimer" 
                    className="text-xs text-pixel-primary hover:text-pixel-accent transition-colors underline font-mono"
                  >
                    查看完整免責聲明 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}
