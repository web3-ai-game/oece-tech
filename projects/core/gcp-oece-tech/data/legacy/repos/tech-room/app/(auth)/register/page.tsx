'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<string[]>([])

  const checkPasswordStrength = (password: string) => {
    const checks: string[] = []
    
    if (password.length >= 8) checks.push('✓ 至少 8 個字元')
    else checks.push('✗ 至少 8 個字元')
    
    if (/[a-z]/.test(password)) checks.push('✓ 包含小寫字母')
    else checks.push('✗ 包含小寫字母')
    
    if (/[A-Z]/.test(password)) checks.push('✓ 包含大寫字母')
    else checks.push('✗ 包含大寫字母')
    
    if (/[0-9]/.test(password)) checks.push('✓ 包含數字')
    else checks.push('✗ 包含數字')
    
    setPasswordStrength(checks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 驗證密碼匹配
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
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
      setError('註冊失敗，請稍後再試')
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
            <div className="w-16 h-16 bg-pixel-secondary border-4 border-pixel-darker flex items-center justify-center mx-auto pixel-float">
              <UserPlus className="text-pixel-darker" size={32} />
            </div>
          </div>
          
          <h1 className="text-pixel-xl mb-2 text-neon-pink">
            註冊帳號
          </h1>
          <p className="text-pixel-light/70 font-sans">
            Join GeekSEA / 加入 GeekSEA
          </p>
        </div>

        {/* Register Form */}
        <div className="card-pixel-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-pixel-danger/20 border-2 border-pixel-danger flex items-start gap-3">
                <AlertCircle className="text-pixel-danger flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-pixel-light font-sans">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                用戶名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-pixel pl-12 w-full"
                  placeholder="geeksea_user"
                  required
                  disabled={isLoading}
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                />
              </div>
              <p className="text-xs text-pixel-light/50 mt-1 font-sans">
                3-20 個字元，只能包含字母、數字和下劃線
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                郵箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-pixel pl-12 w-full"
                  placeholder="your@email.com"
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
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    checkPasswordStrength(e.target.value)
                  }}
                  className="input-pixel pl-12 w-full"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordStrength.map((check, index) => (
                    <p 
                      key={index}
                      className={`text-xs font-mono ${
                        check.startsWith('✓') ? 'text-pixel-primary' : 'text-pixel-light/50'
                      }`}
                    >
                      {check}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-pixel-sm mb-2 text-pixel-accent">
                確認密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pixel-grid" size={20} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-pixel pl-12 w-full"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 font-sans ${
                  formData.password === formData.confirmPassword 
                    ? 'text-pixel-primary' 
                    : 'text-pixel-danger'
                }`}>
                  {formData.password === formData.confirmPassword 
                    ? '✓ 密碼匹配' 
                    : '✗ 密碼不匹配'}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-pixel-light/70 font-sans">
                我同意 <Link href="/terms" className="text-pixel-accent hover:text-pixel-primary">使用條款</Link> 和 <Link href="/privacy" className="text-pixel-accent hover:text-pixel-primary">隱私政策</Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {!isLoading && <UserPlus className="inline mr-2" size={16} />}
              註冊帳號
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-pixel-light/70 font-sans mb-4">
              已經有帳號了？
            </p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                登入
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
