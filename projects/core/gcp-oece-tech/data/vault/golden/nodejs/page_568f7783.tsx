'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, Lock, Unlock, Play, CheckCircle, X } from 'lucide-react'

// 广告数据（10条）
const ADS_DATA = [
  {
    id: 1,
    title: "解锁全球内容",
    description: "访问被限制的网站和服务",
    duration: 5,
    type: 'video'
  },
  {
    id: 2,
    title: "保护隐私安全",
    description: "军事级加密保护您的数据",
    duration: 5,
    type: 'video'
  },
  {
    id: 3,
    title: "极速连接",
    description: "全球节点，毫秒级延迟",
    duration: 5,
    type: 'video'
  },
  {
    id: 4,
    title: "匿名浏览",
    description: "完全隐藏您的网络身份",
    duration: 5,
    type: 'video'
  },
  {
    id: 5,
    title: "跨境电商必备",
    description: "轻松管理多个海外账号",
    duration: 5,
    type: 'video'
  },
  {
    id: 6,
    title: "流媒体解锁",
    description: "观看Netflix、YouTube等",
    duration: 5,
    type: 'video'
  },
  {
    id: 7,
    title: "游戏加速",
    description: "降低延迟，提升游戏体验",
    duration: 5,
    type: 'video'
  },
  {
    id: 8,
    title: "远程办公",
    description: "安全访问公司内网",
    duration: 5,
    type: 'video'
  },
  {
    id: 9,
    title: "学术研究",
    description: "访问国际学术资源",
    duration: 5,
    type: 'video'
  },
  {
    id: 10,
    title: "24/7技术支持",
    description: "专业团队随时为您服务",
    duration: 5,
    type: 'video'
  }
]

export default function LandingPage() {
  const [showAdModal, setShowAdModal] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [watchedAds, setWatchedAds] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(5)
  const [inviteCode, setInviteCode] = useState('')
  const [isWatching, setIsWatching] = useState(false)
  const [canSkip, setCanSkip] = useState(false)

  // 生成邀请码
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'OECE-'
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // 开始看广告
  const startWatchingAds = () => {
    setShowAdModal(true)
    setCurrentAdIndex(0)
    setWatchedAds([])
    setIsWatching(true)
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
    } else if (isWatching && timeLeft === 0) {
      handleAdComplete()
    }
  }, [timeLeft, isWatching])

  // 完成当前广告
  const handleAdComplete = () => {
    const newWatchedAds = [...watchedAds, currentAdIndex]
    setWatchedAds(newWatchedAds)
    
    if (newWatchedAds.length === 10) {
      // 全部看完，生成邀请码
      const code = generateInviteCode()
      setInviteCode(code)
      setIsWatching(false)
    } else {
      // 继续下一个广告
      setCurrentAdIndex(currentAdIndex + 1)
      setTimeLeft(5)
      setCanSkip(false)
    }
  }

  // 跳过广告（3秒后可跳过）
  const skipAd = () => {
    if (canSkip) {
      handleAdComplete()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      {/* 动态光效背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        {/* 导航栏 */}
        <nav className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-lg" />
            <span className="text-xl font-bold">OECE</span>
          </div>
          <button className="text-sm text-gray-400 hover:text-white transition">
            Sign in
          </button>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                突破边界
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              探索无限可能的数字世界，解锁全球内容，保护隐私安全
            </p>

            <motion.button
              onClick={startWatchingAds}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 text-lg font-semibold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg group-hover:blur-xl transition" />
              <div className="relative bg-black rounded-full px-8 py-4 border border-purple-500/50 group-hover:border-purple-400 transition">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  免费获取邀请码
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </span>
              </div>
            </motion.button>

            <p className="mt-4 text-sm text-gray-500">
              观看10条广告即可获得专属邀请码
            </p>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌍', title: '全球覆盖', desc: '100+国家节点' },
              { icon: '⚡', title: '极速连接', desc: '毫秒级延迟' },
              { icon: '🔒', title: '军事级加密', desc: 'AES-256加密' },
              { icon: '🎯', title: '精准定位', desc: '智能路由选择' },
              { icon: '♾️', title: '无限流量', desc: '不限速不限量' },
              { icon: '🛡️', title: '隐私保护', desc: '零日志政策' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition" />
                <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 广告模态框 */}
      <AnimatePresence>
        {showAdModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-2xl w-full overflow-hidden"
            >
              {!inviteCode ? (
                // 广告播放界面
                <div>
                  {/* 进度条 */}
                  <div className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        广告 {currentAdIndex + 1} / 10
                      </span>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < watchedAds.length 
                                ? 'bg-green-500' 
                                : i === currentAdIndex
                                ? 'bg-yellow-500 animate-pulse'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${(watchedAds.length / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 广告内容 */}
                  <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-cyan-900/50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">
                          {['🌍', '🔒', '⚡', '🛡️', '💻', '📺', '🎮', '🏢', '📚', '🔧'][currentAdIndex]}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {ADS_DATA[currentAdIndex].title}
                        </h3>
                        <p className="text-gray-300">
                          {ADS_DATA[currentAdIndex].description}
                        </p>
                      </div>
                    </div>

                    {/* 倒计时 */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/70 rounded-lg px-3 py-1">
                        <span className="text-2xl font-mono font-bold">
                          {timeLeft}
                        </span>
                      </div>
                    </div>

                    {/* 跳过按钮 */}
                    {canSkip && (
                      <button
                        onClick={skipAd}
                        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur hover:bg-white/30 transition px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        跳过广告
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
                      setTimeLeft(5)
                    }}
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                // 邀请码展示界面
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold mb-2">恭喜获得邀请码！</h2>
                  <p className="text-gray-400 mb-6">您的专属邀请码已生成</p>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-lg mb-6">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-2xl font-mono font-bold tracking-wider">
                        {inviteCode}
                      </code>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode)
                      alert('邀请码已复制到剪贴板！')
                    }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    复制邀请码
                  </button>
                  
                  <button
                    onClick={() => {
                      window.location.href = '/auth/register?code=' + inviteCode
                    }}
                    className="block w-full mt-4 text-gray-400 hover:text-white transition"
                  >
                    立即使用邀请码注册 →
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}
