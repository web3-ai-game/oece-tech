'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useI18nStore } from '@/lib/i18n'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function Navbar() {
  const { locale } = useI18nStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isEnglish = locale === 'en'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: isEnglish ? 'Home' : '首頁' },
    { href: '/map', label: isEnglish ? 'Map' : '地圖' },
    { href: '/nodes', label: isEnglish ? 'Nodes' : '節點' },
    { href: '/database', label: isEnglish ? 'Database' : '數據庫' },
    { href: '/forum', label: isEnglish ? 'Forum' : '論壇' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-lg' 
          : 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Neon Effect */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="text-2xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-primary-600 to-warm-500 bg-clip-text text-transparent">OECE</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-light">.TECH</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/auth/login">
              <motion.button
                className="px-6 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 
                         text-white font-medium shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEnglish ? 'Sign In' : '登入'}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-frost-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-ice-core/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="py-3 text-frost-200 hover:text-ice-glow transition-colors">
                  {link.label}
                </div>
              </Link>
            ))}
            <Link href="/auth/login">
              <div className="mt-4 py-3 text-center rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 
                           border border-green-400/30 text-green-300 font-medium">
                {isEnglish ? 'Sign In' : '登入'}
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
