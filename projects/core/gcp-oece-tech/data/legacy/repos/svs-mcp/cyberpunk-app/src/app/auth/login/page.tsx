'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useI18nStore } from '@/lib/i18n'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const { locale } = useI18nStore()
  const router = useRouter()
  const isEnglish = locale === 'en'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirect to forum
    router.push('/forum')
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
              <LogIn className="w-8 h-8 text-ice-glow" />
            </motion.div>
            <h1 className="text-3xl font-bold text-frost-100 mb-2">
              {isEnglish ? 'Welcome Back' : '歡迎回來'}
            </h1>
            <p className="text-frost-400">
              {isEnglish ? 'Sign in to your account' : '登入你的帳戶'}
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
                ? (isEnglish ? 'Signing in...' : '登入中...')
                : (isEnglish ? 'Sign In' : '登入')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-frost-400 text-sm">
              {isEnglish ? "Don't have an account? " : '還沒有帳戶？ '}
              <Link 
                href="/auth/register" 
                className="text-ice-core hover:text-ice-glow transition-colors font-medium"
              >
                {isEnglish ? 'Sign up' : '註冊'}
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  )
}
