'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useI18nStore } from '@/lib/i18n'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const { locale } = useI18nStore()
  const router = useRouter()
  const isEnglish = locale === 'en'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signUp(email, password, username)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  }

  if (success) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900 flex items-center justify-center p-4">
        <LanguageSwitcher />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard>
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-frost-100 mb-2">
                {isEnglish ? 'Registration Successful!' : '註冊成功！'}
              </h2>
              <p className="text-frost-400">
                {isEnglish ? 'Redirecting to login...' : '正在跳轉到登入頁面...'}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-titanium-950 via-titanium-900 to-steel-900 flex items-center justify-center p-4">
      <LanguageSwitcher />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                         bg-gradient-to-br from-ice-core/20 to-frost-500/20 border border-ice-core/30 mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <UserPlus className="w-8 h-8 text-ice-glow" />
            </motion.div>
            <h1 className="text-3xl font-bold text-frost-100 mb-2">
              {isEnglish ? 'Create Account' : '創建帳戶'}
            </h1>
            <p className="text-frost-400">
              {isEnglish ? 'Join the digital nomad community' : '加入數字遊民社群'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-frost-300 mb-2">
                {isEnglish ? 'Username' : '用戶名'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-frost-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-titanium-800/50 border border-steel-600/30
                           text-frost-100 placeholder-frost-500 focus:border-ice-core/50 focus:outline-none
                           transition-colors"
                  placeholder={isEnglish ? 'nomad_explorer' : '遊民探險者'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-frost-300 mb-2">
                {isEnglish ? 'Email' : '電子郵件'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-frost-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-titanium-800/50 border border-steel-600/30
                           text-frost-100 placeholder-frost-500 focus:border-ice-core/50 focus:outline-none
                           transition-colors"
                  placeholder={isEnglish ? 'your@email.com' : '你的郵箱'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-frost-300 mb-2">
                {isEnglish ? 'Password' : '密碼'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-frost-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-titanium-800/50 border border-steel-600/30
                           text-frost-100 placeholder-frost-500 focus:border-ice-core/50 focus:outline-none
                           transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-frost-500">
                {isEnglish ? 'At least 6 characters' : '至少6個字符'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-ice-core to-frost-500 
                       text-white font-medium hover:shadow-lg hover:shadow-ice-core/20
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading 
                ? (isEnglish ? 'Creating account...' : '創建中...')
                : (isEnglish ? 'Create Account' : '創建帳戶')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-frost-400 text-sm">
              {isEnglish ? 'Already have an account? ' : '已經有帳戶？ '}
              <Link 
                href="/auth/login" 
                className="text-ice-core hover:text-ice-glow transition-colors font-medium"
              >
                {isEnglish ? 'Sign in' : '登入'}
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  )
}
