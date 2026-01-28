'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // 模拟登录
    setTimeout(() => {
      router.push('/account/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        {/* 渐变光效 */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your OECE account</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
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
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-sm text-gray-400">Remember me</span>
            </label>
            <Link href="/account/forgot" className="text-sm text-purple-400 hover:text-purple-300 transition">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* 分隔线 */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* 第三方登录 */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl py-3 hover:bg-gray-900 transition">
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl py-3 hover:bg-gray-900 transition">
            <Chrome className="w-5 h-5" />
            <span>Google</span>
          </button>
        </div>

        {/* 注册链接 */}
        <p className="text-center mt-8 text-gray-400">
          Don't have an account?{' '}
          <Link href="/account/register" className="text-purple-400 hover:text-purple-300 transition">
            Sign up for free
          </Link>
        </p>

        {/* 底部提示 */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-gray-300">
              Get <span className="text-purple-400 font-semibold">1000 free tokens</span> when you sign up today
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
