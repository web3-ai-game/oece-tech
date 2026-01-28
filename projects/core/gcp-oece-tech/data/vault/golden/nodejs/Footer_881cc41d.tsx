'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Mail, MapPin, Globe } from 'lucide-react'
import Link from 'next/link'
import { useI18nStore } from '@/lib/i18n'

export function Footer() {
  const { locale } = useI18nStore()
  const isEnglish = locale === 'en'
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: isEnglish ? 'Map' : '地圖', href: '/map' },
      { label: isEnglish ? 'Nodes' : '節點', href: '/nodes' },
      { label: isEnglish ? 'Database' : '數據庫', href: '/database' },
      { label: isEnglish ? 'Forum' : '論壇', href: '/forum' },
    ],
    resources: [
      { label: isEnglish ? 'Documentation' : '文檔', href: '#' },
      { label: isEnglish ? 'API Reference' : 'API 參考', href: '#' },
      { label: isEnglish ? 'Guides' : '指南', href: '#' },
      { label: isEnglish ? 'Blog' : '博客', href: '#' },
    ],
    company: [
      { label: isEnglish ? 'About' : '關於', href: '#' },
      { label: isEnglish ? 'Team' : '團隊', href: '#' },
      { label: isEnglish ? 'Careers' : '職位', href: '#' },
      { label: isEnglish ? 'Contact' : '聯繫', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/web3-ai-game/svs-mcp', label: 'GitHub' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Mail className="w-5 h-5" />, href: 'mailto:contact@oece.tech', label: 'Email' },
  ]

  return (
    <footer className="relative border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="mb-6">
                <div className="text-3xl font-bold tracking-tight mb-4">
                  <span className="text-primary-600 dark:text-primary-400">OECE</span>
                  <span className="text-neutral-900 dark:text-neutral-100">.TECH</span>
                </div>
              </div>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              {isEnglish 
                ? 'Southeast Asia Digital Nomad Network. Empowering remote workers with AI-driven arbitrage calculators, Web3 community nodes, and mobile hardware guides.'
                : '東南亞數字遊民網絡。通過AI驅動的套利計算器、Web3社群節點和移動硬件指南，賦能遠程工作者。'}
            </p>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{isEnglish ? 'Southeast Asia' : '東南亞'}</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-100 font-bold mb-4 uppercase tracking-wider text-sm">
              {isEnglish ? 'Product' : '產品'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-100 font-bold mb-4 uppercase tracking-wider text-sm">
              {isEnglish ? 'Resources' : '資源'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-100 font-bold mb-4 uppercase tracking-wider text-sm">
              {isEnglish ? 'Company' : '公司'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            © {currentYear} OECE.TECH. {isEnglish ? 'All rights reserved.' : '版權所有。'}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 
                         border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400
                         hover:border-primary-500 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="#">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {isEnglish ? 'Privacy Policy' : '隱私政策'}
              </span>
            </Link>
            <Link href="#">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {isEnglish ? 'Terms of Service' : '服務條款'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
    </footer>
  )
}
