'use client'

import Link from 'next/link'
import { Shield, Lock, Eye, BookOpen, CheckCircle, AlertTriangle, Radio, Wifi, Key } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import { 
  HexagonGrid, 
  CircuitPattern, 
  TechCorners,
  HologramScanlines,
  DataStream,
  FloatingParticles
} from '@/components/decorations/CyberDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* ========== 背景装饰（简化，突出内容） ========== */}
      <HexagonGrid className="text-pixel-primary opacity-5" />
      <CircuitPattern className="opacity-5" />
      <HologramScanlines />
      <DataStream className="opacity-10" />
      <FloatingParticles count={15} className="opacity-20" />
      <TechCorners className="text-pixel-primary opacity-30" />
      
      {/* ========== 主要内容 ========== */}
      <div className="relative z-10">
        
        {/* ========== Hero Section - 地下联络站 ========== */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* 安全状态指示 */}
            <div className="mb-8 flex justify-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-pixel-darker/80 border border-pixel-primary rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-pixel-primary rounded-full animate-pulse" />
                <span className="text-xs font-mono text-pixel-primary">ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-pixel-darker/80 border border-pixel-accent rounded-lg backdrop-blur-sm">
                <Shield size={14} className="text-pixel-accent" />
                <span className="text-xs font-mono text-pixel-accent">SECURE</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-pixel-darker/80 border border-pixel-warning rounded-lg backdrop-blur-sm">
                <Eye size={14} className="text-pixel-warning" />
                <span className="text-xs font-mono text-pixel-warning">ANONYMOUS</span>
              </div>
            </div>
            
            {/* Logo */}
            <div className="mb-8">
              <OECELogo 
                size={200}
                animated={true}
                glowing={true}
              />
            </div>
            
            {/* 站点名称 + 定位 */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-mono">
              <span className="text-neon">OECE</span>
              <span className="text-neon-cyan">.TECH</span>
            </h1>
            
            <div className="mb-6">
              <p className="text-xl md:text-2xl text-pixel-primary font-mono mb-2">
                🔐 地下技術聯絡站
              </p>
              <p className="text-base md:text-lg text-pixel-light/70 font-mono">
                Encrypted Tutorial Hub · Anonymous Communication
              </p>
            </div>
            
            {/* 核心特色 */}
            <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              {/* 私密安全 */}
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm border-pixel-primary">
                <Lock className="text-pixel-primary mx-auto mb-2" size={24} />
                <div className="text-sm font-mono text-pixel-primary mb-1">端到端加密</div>
                <div className="text-xs text-pixel-light/60">Complete Privacy</div>
              </div>
              
              {/* 教程可靠 */}
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm border-pixel-accent">
                <CheckCircle className="text-pixel-accent mx-auto mb-2" size={24} />
                <div className="text-sm font-mono text-pixel-accent mb-1">專業認證教程</div>
                <div className="text-xs text-pixel-light/60">Verified Tutorials</div>
              </div>
              
              {/* 完全匿名 */}
              <div className="card-pixel bg-pixel-darker/60 p-4 backdrop-blur-sm border-pixel-warning">
                <Eye className="text-pixel-warning mx-auto mb-2" size={24} />
                <div className="text-sm font-mono text-pixel-warning mb-1">匿名討論</div>
                <div className="text-xs text-pixel-light/60">Anonymous Forum</div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                href="/tutorials" 
                className="btn-pixel group relative overflow-hidden px-8 py-4"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>查看專業教程</span>
                </span>
                <div className="absolute inset-0 bg-pixel-primary/20 translate-x-full group-hover:translate-x-0 transition-transform" />
              </Link>
              
              <Link 
                href="/forum" 
                className="btn-pixel-outline group px-8 py-4"
              >
                <Radio size={20} className="inline mr-2 animate-pulse" />
                <span>進入聯絡站</span>
              </Link>
            </div>
            
            {/* 安全提示 */}
            <div className="card-pixel border-pixel-danger bg-pixel-danger/5 p-3 max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-xs text-pixel-danger font-mono">
                <AlertTriangle size={12} className="inline mr-1" />
                僅供技術學習 · 請遵守當地法律 · 保護個人隱私
              </p>
            </div>
          </div>
        </section>
        
        {/* ========== 核心服务 - 教程为主 ========== */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* 标题 */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/10 border border-pixel-primary rounded-lg mb-4">
                <Shield size={16} className="text-pixel-primary" />
                <span className="text-sm font-mono text-pixel-primary">CORE SERVICES</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono text-neon">
                核心服務
              </h2>
              <p className="text-pixel-light/70 font-mono">
                Professional · Secure · Anonymous
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* 主要服务：专业教程 */}
              <div className="card-pixel-glow border-2 border-pixel-primary relative overflow-hidden group">
                {/* 标签 */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-pixel-primary text-pixel-darker text-xs font-mono font-bold rounded">
                  PRIMARY
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-pixel-primary/20 flex items-center justify-center">
                      <BookOpen className="text-pixel-primary" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-mono text-pixel-primary mb-1">
                        專業技術教程
                      </h3>
                      <p className="text-sm text-pixel-light/60 font-mono">
                        Verified Professional Tutorials
                      </p>
                    </div>
                  </div>
                  
                  {/* 特色 */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-pixel-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          ✅ 專家審核認證
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          所有教程經過專業審核，確保準確性和安全性
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-pixel-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          🔒 加密內容保護
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          教程內容端到端加密，保護知識產權和用戶隱私
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-pixel-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          📚 完整技術體系
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          VPN搭建、VPS配置、加密通信、隱私保護完整覆蓋
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-pixel-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          🎯 實戰驗證
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          每個教程都經過實際環境測試，確保可用性
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/tutorials"
                    className="btn-pixel w-full flex items-center justify-center gap-2"
                  >
                    <BookOpen size={18} />
                    <span>瀏覽教程庫</span>
                  </Link>
                </div>
              </div>
              
              {/* 次要服务：地下联络站 */}
              <div className="card-pixel-glow border border-pixel-accent relative overflow-hidden group">
                {/* 标签 */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-pixel-accent/20 border border-pixel-accent text-pixel-accent text-xs font-mono rounded">
                  SECURE
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-pixel-accent/20 flex items-center justify-center">
                      <Radio className="text-pixel-accent animate-pulse" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-mono text-pixel-accent mb-1">
                        地下聯絡站
                      </h3>
                      <p className="text-sm text-pixel-light/60 font-mono">
                        Anonymous Communication Hub
                      </p>
                    </div>
                  </div>
                  
                  {/* 特色 */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Eye size={18} className="text-pixel-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          👤 完全匿名討論
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          自動生成匿名身份，前台完全匿名，自己可見
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Lock size={18} className="text-pixel-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          🔐 端到端加密
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          所有通信經過加密，後台僅存IP哈希，保護隱私
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Key size={18} className="text-pixel-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          💬 匿名站內信
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          可選匿名私信，安全討論技術問題
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Wifi size={18} className="text-pixel-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-mono text-pixel-light mb-1">
                          🌐 跨境通信
                        </div>
                        <div className="text-xs text-pixel-light/50">
                          突破封鎖，技術無國界
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/forum"
                    className="btn-pixel-outline w-full flex items-center justify-center gap-2"
                  >
                    <Radio size={18} />
                    <span>進入聯絡站</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* ========== 安全承诺 ========== */}
        <section className="py-16 px-4 bg-pixel-darker/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="text-pixel-primary mx-auto mb-4" size={48} />
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono text-neon">
                安全承諾
              </h2>
              <p className="text-pixel-light/60 font-mono text-sm">
                Security Commitment
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-pixel p-6 text-center bg-pixel-darker/80">
                <div className="w-12 h-12 rounded-full bg-pixel-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-pixel-primary" size={24} />
                </div>
                <h3 className="text-base font-mono text-pixel-primary mb-2">
                  數據加密
                </h3>
                <p className="text-xs text-pixel-light/60">
                  所有敏感數據端到端加密
                  <br/>
                  密碼 bcrypt 加密存儲
                </p>
              </div>
              
              <div className="card-pixel p-6 text-center bg-pixel-darker/80">
                <div className="w-12 h-12 rounded-full bg-pixel-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Eye className="text-pixel-accent" size={24} />
                </div>
                <h3 className="text-base font-mono text-pixel-accent mb-2">
                  隱私保護
                </h3>
                <p className="text-xs text-pixel-light/60">
                  IP僅存哈希值
                  <br/>
                  真實身份不暴露
                </p>
              </div>
              
              <div className="card-pixel p-6 text-center bg-pixel-darker/80">
                <div className="w-12 h-12 rounded-full bg-pixel-warning/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-pixel-warning" size={24} />
                </div>
                <h3 className="text-base font-mono text-pixel-warning mb-2">
                  內容審核
                </h3>
                <p className="text-xs text-pixel-light/60">
                  專業審核機制
                  <br/>
                  舉報系統完善
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* ========== 免责声明 ========== */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card-pixel border-pixel-danger bg-pixel-danger/5 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-pixel-danger flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-mono text-pixel-danger mb-3">
                    重要聲明
                  </h3>
                  <div className="text-sm text-pixel-light/80 space-y-2">
                    <p>
                      <strong className="text-pixel-warning">OECE.TECH</strong> 是一個
                      <strong className="text-pixel-primary">技術教程平台</strong>，
                      所有內容僅供<strong className="text-pixel-accent">學習研究</strong>使用。
                    </p>
                    <p>
                      我們提供的教程和工具旨在幫助用戶理解網絡技術、保護隱私和數據安全。
                      <strong className="text-pixel-danger">請勿用於非法用途</strong>。
                    </p>
                    <p>
                      用戶需自行承擔使用教程和工具的法律責任，
                      <strong className="text-pixel-warning">與平台無關</strong>。
                      請遵守當地法律法規。
                    </p>
                  </div>
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
          </div>
        </section>
        
      </div>
    </div>
  )
}
