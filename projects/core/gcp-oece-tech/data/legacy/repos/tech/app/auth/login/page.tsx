'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import {
  CRTScanlines,
  CRTCurvature,
  PixelBorders,
  DOSWindow,
  RetroButton,
  PixelDivider
} from '@/components/retro/RetroEffects'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: 实际登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟成功
      router.push('/dashboard')
    } catch (err) {
      setError('登入失敗，請檢查用戶名和密碼')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pixel-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* CRT效果 */}
      <CRTScanlines />
      <CRTCurvature />
      <PixelBorders />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <OECELogo size={120} animated={true} glowing={true} />
          </div>
          <h1 className="text-3xl font-bold font-mono text-pixel-primary mb-2">
            OECE.TECH
          </h1>
          <p className="text-sm text-pixel-light/60 font-mono">
            &gt; UNDERGROUND TECH HUB_
          </p>
        </div>

        <DOSWindow title="[ USER LOGIN ]">
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
                placeholder="輸入用戶名..."
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
                  placeholder="輸入密碼..."
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
                  登入中...
                </>
              ) : (
                '🔓 登入系統&apos;
              )}
            </RetroButton>

            <PixelDivider />

            {/* 注册链接 */}
            <div className="text-center space-y-3">
              <p className="text-sm text-pixel-light/60 font-mono">
                還沒有賬號？
              </p>
              <Link href="/auth/register">
                <RetroButton variant="outline" className="w-full justify-center">
                  📝 註冊新賬號
                </RetroButton>
              </Link>
            </div>

            {/* 其他选项 */}
            <div className="pt-4 border-t-2 border-pixel-grid space-y-2">
              <Link 
                href="/auth/forgot-password"
                className="block text-center text-sm text-pixel-accent hover:text-pixel-primary transition-colors font-mono"
              >
                &gt; 忘記密碼？
              </Link>
              <Link 
                href="/"
                className="block text-center text-sm text-pixel-light/60 hover:text-pixel-primary transition-colors font-mono"
              >
                &gt; 返回首頁
              </Link>
            </div>
          </form>
        </DOSWindow>

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/10 border-2 border-pixel-primary text-pixel-primary text-xs font-mono">
            <Lock size={14} />
            <span>所有通信均已加密 | END-TO-END ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
