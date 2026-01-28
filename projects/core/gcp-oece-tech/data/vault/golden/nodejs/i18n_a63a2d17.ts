import { create } from 'zustand'

type Locale = 'en' | 'zh-TW'

interface I18nStore {
  locale: Locale
  setLocale: (locale: Locale) => void
}

// Simplified store without persist for now
export const useI18nStore = create<I18nStore>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
}))

// Import messages directly
import enMessages from '@/i18n/locales/en.json'
import zhTWMessages from '@/i18n/locales/zh-TW.json'

export const loadMessages = (locale: Locale) => {
  return locale === 'en' ? enMessages : zhTWMessages
}
