'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronRight, ChevronDown, CheckCircle, X, Globe, Shield, Zap, Users, ArrowDown, Lock, Cpu, Activity, Server, Sparkles } from 'lucide-react'
import { nanoid } from 'nanoid'
import { NetworkGrid, DataFlow, ShieldProtection, GlobalNetwork, SpeedMeter } from '@/components/svg/LandingIllustrations'

// 广告内容 - 使用黑话系统
const ADS_DATA = [
  {
    id: 1,
    title: "全球传送门网络",
    description: "连接100+国家的量子隧道节点，实现瞬间传送",
    icon: Globe,
    duration: 6
  },
  {
    id: 2,
    title: "军事级能量护盾",
    description: "AES-256能量编码技术，保护您的数据传输",
    icon: Shield,
    duration: 6
  },
  {
    id: 3,
    title: "光速传输协议",
    description: "WireGuard最新技术，毫秒级时空延迟",
    icon: Zap,
    duration: 6
  },
  {
    id: 4,
    title: "完全隐形模式",
    description: "零日志政策，您的探索痕迹完全消失",
    icon: Lock,
    duration: 6
  },
  {
    id: 5,
    title: "跨境商业解决方案",
    description: "轻松管理多个海外账号，扩展全球业务",
    icon: Server,
    duration: 6
  },
  {
    id: 6,
    title: "影视宇宙解锁",
    description: "访问Netflix、YouTube等全球流媒体平台",
    icon: Activity,
    duration: 6
  },
  {
    id: 7,
    title: "游戏加速引擎",
    description: "专属游戏线路，降低延迟提升体验",
    icon: Cpu,
    duration: 6
  },
  {
    id: 8,
    title: "企业安全方案",
    description: "远程办公必备，安全访问公司内网",
    icon: Shield,
    duration: 6
  },
  {
    id: 9,
    title: "学术资源通道",
    description: "连接全球学术数据库，获取前沿研究",
    icon: Globe,
    duration: 6
  },
  {
    id: 10,
    title: "24/7技术支持",
    description: "专业团队随时待命，解决您的任何问题",
    icon: Users,
    duration: 6
  }
]

export default function InvitePage() {
  const [showAdModal, setShowAdModal] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [watchedAds, setWatchedAds] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(6)
  const [inviteCode, setInviteCode] = useState('')
  const [isWatching, setIsWatching] = useState(false)
  const [canSkip, setCanSkip] = useState(false)

  // 生成邀请码
  const generateInviteCode = () => {
    return `OECE-${nanoid(8).toUpperCase()}`
  }

  // 开始看广告
  const startWatchingAds = () => {
    setShowAdModal(true)
    setCurrentAdIndex(0)
    setWatchedAds([])
    setIsWatching(true)
    setTimeLeft(6)
    setCanSkip(false)
  }

  // 完成当前广告
  const handleAdComplete = useCallback(() => {
    const newWatchedAds = [...watchedAds, currentAdIndex]
    setWatchedAds(newWatchedAds)
    
    if (newWatchedAds.length === 10) {
      // 全部看完，生成邀请码
      const code = generateInviteCode()
      setInviteCode(code)
      setIsWatching(false)
      // 保存到localStorage
      localStorage.setItem('inviteCode', code)
      localStorage.setItem('inviteCodeTime', Date.now().toString())
    } else {
      // 继续下一个广告
      const nextIndex = (currentAdIndex + 1) % ADS_DATA.length
      setCurrentAdIndex(nextIndex)
      setTimeLeft(ADS_DATA[nextIndex].duration)
      setCanSkip(false)
    }
  }, [watchedAds, currentAdIndex])

  // 跳过广告
  const skipAd = () => {
    if (canSkip) {
      handleAdComplete()
    }
  }

  // 播放广告计时器
  useEffect(() => {
    if (isWatching && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        if (timeLeft === 3) {
          setCanSkip(true)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isWatching])

  // 处理广告完成
  useEffect(() => {
    if (isWatching && timeLeft === 0) {
      handleAdComplete()
    }
  }, [timeLeft, isWatching, handleAdComplete])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        {/* 导航 */}
        <nav className="px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="text-xl font-semibold">OECE.TECH</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">关于</a>
            <a href="#" className="text-gray-400 hover:text-white transition">文档</a>
            <button className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-900 transition">
              登录
            </button>
          </div>
        </nav>

        {/* Hero Section - 长条设计 */}
        <section className="relative">
          <div className="min-h-screen flex flex-col items-center justify-center px-8">
            <div className="max-w-5xl w-full">
              {/* 主标题 */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                  Next Generation
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                  Quantum Network
                </span>
              </h1>
            
              <p className="text-xl md:text-2xl text-gray-400 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
                突破地理限制，连接全球数字资源，体验前所未有的网络自由
              </p>

              {/* CTA按钮 */}
              <div className="flex justify-center">
                <div className="text-center">
                  <button
                    onClick={startWatchingAds}
                    className="group relative px-10 py-5 text-lg font-medium transition-all hover:scale-105 active:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition" />
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-10 py-5">
                      <span className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        获取专属邀请码
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                  <p className="mt-6 text-sm text-gray-500">
                    观看10条广告即可获得专属邀请码
                  </p>
                </div>
              </div>
            </div>
            
            {/* 向下滚动提示 */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ArrowDown className="w-6 h-6 text-gray-500" />
            </div>
          </div>
          
          {/* SVG 装饰 - 网络图 */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
            <NetworkGrid />
          </div>
        </section>

        {/* Section 2: 技术特性 */}
        <section className="relative py-32">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                核心技术
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* 左侧: SVG图形 */}
              <div className="relative h-[400px]">
                <GlobalNetwork />
              </div>
              
              {/* 右侧: 特性列表 */}
              <div className="space-y-8">
                {[
                  { icon: Globe, title: '全球网络', desc: '覆盖150+国家和地区，智能路由选择' },
                  { icon: Shield, title: '军事级加密', desc: 'AES-256加密标准，保护数据安全' },
                  { icon: Zap, title: '极速传输', desc: '毫秒级延迟，带宽无限制' },
                  { icon: Server, title: '稳定可靠', desc: '99.9%服务可用性，24/7技术支持' }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                        <feature.icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}  
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 3: 数据流动画 */}
        <section className="relative py-32 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                数据传输可视化
              </span>
            </h2>
            
            <div className="relative h-[400px]">
              <DataFlow />
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-400">10Gbps</div>
                <div className="text-gray-500 mt-2">传输速度</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">0.01%</div>
                <div className="text-gray-500 mt-2">丢包率</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400">24/7</div>
                <div className="text-gray-500 mt-2">持续运行</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 4: 安全防护 */}
        <section className="relative py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    多层安全防护
                  </span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">端到端加密</h3>
                      <p className="text-gray-400">所有数据传输都经过军事级加密保护</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">零日志政策</h3>
                      <p className="text-gray-400">不记录任何用户活动和连接日志</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">自动切换节点</h3>
                      <p className="text-gray-400">智能检测最优线路，自动切换连接</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px]">
                <ShieldProtection />
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 5: 速度测试 */}
        <section className="relative py-32 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                实时性能监控
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[300px]">
                <SpeedMeter />
              </div>
              
              <div className="space-y-8">
                {[
                  { label: '下载速度', value: '952 Mbps', percentage: 95 },
                  { label: '上传速度', value: '847 Mbps', percentage: 85 },
                  { label: '连接稳定性', value: '99.9%', percentage: 99 }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 统计数据 */}
        <section className="border-y border-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '3M+', label: '活跃用户' },
                { value: '150+', label: '国家覆盖' },
                { value: '99.9%', label: '在线时间' },
                { value: '24/7', label: '技术支持' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 广告模态框 */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
            {!inviteCode ? (
              // 广告播放界面
              <div>
                {/* 进度条 */}
                <div className="bg-gray-800 p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 font-medium">
                      任务进度 {currentAdIndex + 1} / 10
                    </span>
                    <div className="flex gap-2">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-1 rounded-full transition-all ${
                            i < watchedAds.length 
                              ? 'bg-green-500' 
                              : i === currentAdIndex
                              ? 'bg-blue-500 animate-pulse'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${(watchedAds.length / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 广告内容 */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-12 max-w-2xl">
                      <div className="text-8xl mb-6">
                        {ADS_DATA[currentAdIndex].title.split(' ')[0]}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">
                        {ADS_DATA[currentAdIndex].title.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="text-xl text-gray-300">
                        {ADS_DATA[currentAdIndex].description}
                      </p>
                      
                      {/* 进度环 */}
                      <div className="mt-8 relative inline-block">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-700"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(timeLeft / 6) * 251.2} 251.2`}
                            className="text-blue-500 transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                          {timeLeft}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 跳过按钮 */}
                  {canSkip && (
                    <button
                      onClick={skipAd}
                      className="absolute bottom-6 right-6 bg-white/10 backdrop-blur hover:bg-white/20 transition px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
                    >
                      继续下一个
                      <ChevronDown className="w-4 h-4 rotate-270" />
                    </button>
                  )}
                </div>

                {/* 关闭按钮 */}
                <button
                  onClick={() => {
                    setShowAdModal(false)
                    setIsWatching(false)
                    setCurrentAdIndex(0)
                    setWatchedAds([])
                    setTimeLeft(6)
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ) : (
              // 邀请码展示界面
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                
                <h2 className="text-4xl font-bold mb-3">成功获得邀请码！</h2>
                <p className="text-gray-400 mb-8 text-lg">您的专属邀请码已生成，永久有效</p>
                
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
                  <div className="relative bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <code className="text-3xl font-mono font-bold tracking-wider text-blue-400">
                      {inviteCode}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode)
                      alert('邀请码已复制到剪贴板！')
                    }}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                  >
                    复制邀请码
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/auth/register?code=' + inviteCode
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:shadow-lg transition"
                  >
                    立即使用 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部 */}
      <footer className="border-t border-gray-800 mt-24 py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-gray-500 text-sm">
          <div>© 2024 OECE.TECH. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition">隐私政策</a>
            <a href="#" className="hover:text-gray-400 transition">服务条款</a>
            <a href="#" className="hover:text-gray-400 transition">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
