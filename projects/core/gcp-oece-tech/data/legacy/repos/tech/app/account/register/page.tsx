'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.inviteCode) {
      newErrors.inviteCode = 'Invite code is required'
    } else if (!formData.inviteCode.startsWith('OECE-')) {
      newErrors.inviteCode = 'Invalid invite code format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      }
    } else {
      if (validateStep2()) {
        setLoading(true)
        // 模拟注册
        setTimeout(() => {
          router.push('/account/dashboard')
        }, 1500)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-400">Join OECE to access powerful tools</p>
        </div>

        {/* 进度指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-purple-500' : 'bg-gray-800'
            }`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-purple-500' : 'bg-gray-800'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-purple-500' : 'bg-gray-800'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                    errors.inviteCode ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'
                  }`}
                  placeholder="OECE-XXXXXXXX"
                  required
                />
                {errors.inviteCode && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.inviteCode}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  Don't have an invite code?{' '}
                  <Link href="/invite" className="text-purple-400 hover:text-purple-300 transition">
                    Get one here
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full bg-gray-900/50 border rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.username ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'
                    }`}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-gray-900/50 border rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.email ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full bg-gray-900/50 border rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.password ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'
                    }`}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full bg-gray-900/50 border rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* 服务条款 */}
        <p className="text-center mt-6 text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition">
            Privacy Policy
          </Link>
        </p>

        {/* 登录链接 */}
        <p className="text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <Link href="/account/login" className="text-purple-400 hover:text-purple-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
