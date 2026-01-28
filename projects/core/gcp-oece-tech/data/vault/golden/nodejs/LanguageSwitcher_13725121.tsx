'use client'

import { motion } from 'framer-motion'
import { useI18nStore } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18nStore()

  return (
    <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === 'en'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('zh-TW')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === 'zh-TW'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        }`}
      >
        中文
      </button>
    </div>
  )
}
