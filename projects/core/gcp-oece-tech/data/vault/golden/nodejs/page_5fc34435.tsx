'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Key, PlayCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import {
  CRTScanlines,
  CRTCurvature,
  PixelBorders,
  DOSWindow,
  RetroButton,
  RetroTag,
  PixelDivider,
  LEDNumber,
  PixelProgressBar
} from '@/components/retro/RetroEffects'

export default function RegisterPage() {
  const router = useRouter()
  const [method, setMethod] = useState<'invite' | 'ads' | null>(null)
  const [adsWatched, setAdsWatched] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    inviteCode: ''
  })

  const REQUIRED_ADS = 5
  const adsProgress = (adsWatched / REQUIRED_ADS) * 100

  const watchAd = () => {
    if (adsWatched < REQUIRED_ADS) {
      setAdsWatched(adsWatched + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: 实际注册API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟成功
      router.push('/dashboard')
    } catch (err) {
      setError('註冊失敗，請稍後重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pixel-darker p-4 relative overflow-hidden">
      {/* CRT效果 */}
      <CRTScanlines />
      <CRTCurvature />
      <PixelBorders />
      
      <div className="max-w-4xl mx-auto py-8 relative z-10">
        {/* Logo + 标题 */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <OECELogo size={100} animated={true} glowing={true} />
          </div>
          <h1 className="text-3xl font-bold font-mono text-pixel-primary mb-2">
            註冊新賬號
          </h1>
          <p className="text-sm text-pixel-light/60 font-mono">
            &gt; CHOOSE YOUR REGISTRATION METHOD_
          </p>
        </div>

        {!method ? (
          // 选择注册方式
          <div className="grid md:grid-cols-2 gap-6">
            {/* 邀请码注册 */}
            <div onClick={() => setMethod('invite')} className="cursor-pointer">
              <DOSWindow title="[ INVITE CODE ]">
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🔑</div>
                  <h3 className="text-xl font-bold font-mono text-pixel-primary mb-3">
                    邀請碼註冊
                  </h3>
                  <p className="text-sm text-pixel-light/70 mb-4">
                    使用邀請碼快速註冊
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-pixel-primary">✓</span>
                      <span className="text-sm">立即註冊</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-pixel-primary">✓</span>
                      <LEDNumber value="+150" />
                      <span className="text-sm">積分獎勵</span>
                    </div>
                  </div>
                  <RetroButton className="w-full justify-center">
                    選擇此方式 →
                  </RetroButton>
                </div>
              </DOSWindow>
            </div>

            {/* 看广告注册 */}
            <div onClick={() => setMethod('ads')} className="cursor-pointer">
              <DOSWindow title="[ WATCH ADS ]">
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">📺</div>
                  <h3 className="text-xl font-bold font-mono text-pixel-accent mb-3">
                    看廣告註冊
                  </h3>
                  <p className="text-sm text-pixel-light/70 mb-4">
                    觀看5個廣告即可註冊
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-pixel-accent">✓</span>
                      <span className="text-sm">無需邀請碼</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-pixel-accent">✓</span>
                      <LEDNumber value="+100" />
                      <span className="text-sm">積分獎勵</span>
                    </div>
                  </div>
                  <RetroButton variant="outline" className="w-full justify-center">
                    選擇此方式 →
                  </RetroButton>
                </div>
              </DOSWindow>
            </div>
          </div>
        ) : (
          // 注册表单
          <DOSWindow title={method === 'invite' ? '[ INVITE CODE REGISTRATION ]' : '[ ADS REGISTRATION ]'}>
            {method === 'ads' && adsWatched < REQUIRED_ADS && (
              <div className="mb-6 p-4 border-4 border-pixel-accent bg-pixel-accent/5">
                <div className="text-center mb-4">
                  <p className="text-sm font-mono text-pixel-light mb-2">
                    &gt; 觀看廣告進度: {adsWatched} / {REQUIRED_ADS}
                  </p>
                  <PixelProgressBar value={adsWatched} max={REQUIRED_ADS} />
                </div>
                <RetroButton 
                  onClick={watchAd}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <PlayCircle size={20} className="mr-2" />
                  觀看廣告 #{adsWatched + 1}
                </RetroButton>
              </div>
            )}

            {(method === 'invite' || adsWatched >= REQUIRED_ADS) && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 用户名 */}
                <div>
                  <label className="block text-sm font-mono text-pixel-light mb-2">
                    <User size={16} className="inline mr-2" />
                    用戶名 / USERNAME
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-pixel-darker border-4 border-pixel-grid text-pixel-light font-mono
                             focus:border-pixel-primary focus:outline-none transition-colors"
                    placeholder="選擇一個匿名用戶名..."
                    required
                  />
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-mono text-pixel-light mb-2">
                    <Mail size={16} className="inline mr-2" />
                    郵箱 / EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-pixel-darker border-4 border-pixel-grid text-pixel-light font-mono
                             focus:border-pixel-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* 密码 */}
                <div>
                  <label className="block text-sm font-mono text-pixel-light mb-2">
                    <Lock size={16} className="inline mr-2" />
                    密碼 / PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-pixel-darker border-4 border-pixel-grid text-pixel-light font-mono
                               focus:border-pixel-primary focus:outline-none transition-colors pr-12"
                      placeholder="至少8個字符..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-pixel-light/60 hover:text-pixel-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* 邀请码（仅邀请码方式） */}
                {method === 'invite' && (
                  <div>
                    <label className="block text-sm font-mono text-pixel-light mb-2">
                      <Key size={16} className="inline mr-2" />
                      邀請碼 / INVITE CODE
                    </label>
                    <input
                      type="text"
                      value={formData.inviteCode}
                      onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                      className="w-full px-4 py-3 bg-pixel-darker border-4 border-pixel-grid text-pixel-light font-mono
                               focus:border-pixel-primary focus:outline-none transition-colors"
                      placeholder="輸入邀請碼..."
                      required
                    />
                  </div>
                )}

                {/* 错误提示 */}
                {error && (
                  <div className="border-4 border-pixel-danger bg-pixel-danger/10 p-3">
                    <p className="text-sm text-pixel-danger font-mono">
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                {/* 提交按钮 */}
                <RetroButton
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      註冊中...
                    </>
                  ) : (
                    <>
                      📝 立即註冊並獲得{' '}
                      <LEDNumber value={method === 'invite' ? '+150' : '+100'} />
                      {' '}積分
                    </>
                  )}
                </RetroButton>

                <PixelDivider />

                {/* 返回选择 */}
                <RetroButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMethod(null)
                    setAdsWatched(0)
                  }}
                  className="w-full justify-center"
                >
                  ← 返回選擇註冊方式
                </RetroButton>
              </form>
            )}

            {/* 已有账号 */}
            <div className="mt-6 pt-6 border-t-2 border-pixel-grid text-center">
              <p className="text-sm text-pixel-light/60 font-mono mb-3">
                已經有賬號？
              </p>
              <Link href="/auth/login">
                <RetroButton variant="outline" className="w-full justify-center">
                  🔓 登入系統
                </RetroButton>
              </Link>
            </div>
          </DOSWindow>
        )}

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/10 border-2 border-pixel-primary text-pixel-primary text-xs font-mono">
            <Lock size={14} />
            <span>匿名註冊 · 數據加密 | ANONYMOUS & ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
