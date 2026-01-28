'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // 保存 token 到 localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // 重定向到首頁
        router.push('/')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('登錄失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-pixel-primary border-4 border-pixel-darker flex items-center justify-center mx-auto pixel-float">
              <LogIn className="text-pixel-darker" size={32} />
            </div>
          </div>
          
          <h1 className="text-pixel-xl mb-2 text-neon">
            登入帳號
          </h1>
          <p className="text-pixel-light/70 font-sans">
            Welcome Back / 歡迎回來
          </p>
        </div>

        {/* Login Form */}
        <div className="card-pixel-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-pixel-danger/20 border-2 border-pixel-danger flex items-start gap-3">
                <AlertCircle className="text-pixel-danger flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-pixel-light font-sans">{error}</p>
              </div>
            )}

            {/* Email/Username Input */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                郵箱 / 用戶名
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
                <input
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                  className="input-pixel pl-12 w-full"
                  placeholder="your@email.com or username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-pixel pl-12 w-full"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-pixel-accent hover:text-pixel-primary transition-colors font-sans"
              >
                忘記密碼？
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {!isLoading && <LogIn className="inline mr-2" size={16} />}
              登入
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-pixel-grid" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-pixel-dark px-4 text-sm text-pixel-light/50 font-sans">
                或
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-pixel-light/70 font-sans mb-4">
              還沒有帳號？
            </p>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                註冊新帳號
              </Button>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-pixel-light/50 hover:text-pixel-primary transition-colors font-sans"
          >
            ← 返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
}
