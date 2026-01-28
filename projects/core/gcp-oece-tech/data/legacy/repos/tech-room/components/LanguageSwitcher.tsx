'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { Language, languages } from '@/lib/i18n'

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW')
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'zh-TW' || savedLang === 'en')) {
      setCurrentLang(savedLang)
    } else {
      // 自动检测浏览器语言
      const browserLang = navigator.language
      if (browserLang.startsWith('zh')) {
        setCurrentLang('zh-TW')
      } else {
        setCurrentLang('en')
      }
    }
  }, [])
  
  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem('language', lang)
    setIsOpen(false)
    
    // 触发全局语言切换事件
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }))
    
    // 刷新页面以应用新语言
    window.location.reload()
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-pixel-grid hover:border-pixel-primary transition-colors bg-pixel-darker"
      >
        <Globe size={18} className="text-pixel-primary" />
        <span className="text-sm font-mono text-pixel-light hidden sm:inline">
          {languages[currentLang]}
        </span>
      </button>
      
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-40 card-pixel bg-pixel-darker z-50">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => switchLanguage(code as Language)}
                className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors ${
                  currentLang === code
                    ? 'bg-pixel-primary/20 text-pixel-primary'
                    : 'text-pixel-light hover:bg-pixel-grid'
                }`}
              >
                {name}
                {currentLang === code && (
                  <span className="float-right">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Hook for using current language
export function useCurrentLanguage(): Language {
  const [lang, setLang] = useState<Language>('zh-TW')
  
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLang(savedLang)
    }
    
    const handleLanguageChange = (e: CustomEvent) => {
      setLang(e.detail)
    }
    
    window.addEventListener('languageChange', handleLanguageChange as any)
    return () => window.removeEventListener('languageChange', handleLanguageChange as any)
  }, [])
  
  return lang
}
