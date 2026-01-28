// 多语言系统 - 繁体中文 + 英文

export type Language = 'zh-TW' | 'en'

export const languages: Record<Language, string> = {
  'zh-TW': '繁體中文',
  'en': 'English'
}

export const translations: Record<Language, Record<string, string>> = {
  'zh-TW': {
    // 通用
    'common.loading': '加載中...',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.save': '保存',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.view': '查看',
    'common.share': '分享',
    'common.copy': '複製',
    'common.download': '下載',
    
    // 导航
    'nav.home': '首頁',
    'nav.tutorials': '教程',
    'nav.forum': '論壇',
    'nav.tools': '工具',
    'nav.pricing': '價格',
    'nav.dashboard': '控制台',
    'nav.admin': '管理',
    'nav.login': '登入',
    'nav.register': '註冊',
    'nav.logout': '登出',
    
    // 首页
    'home.title': '技術教程聚合平台',
    'home.subtitle': '技術自由 · 知識無價 · 完全匿名',
    'home.cta.learn': '開始學習',
    'home.cta.earn': '寫教程賺積分',
    'home.feature.tutorials': '專業教程',
    'home.feature.points': '積分眾包',
    'home.feature.multilang': '繁體/英文',
    'home.categories.title': '精選教程分類',
    'home.categories.subtitle': '涵蓋出海、匿名、安全、實戰全技術棧',
    'home.points.title': '積分眾包系統',
    'home.points.subtitle': '寫教程賺積分 · 看廣告賺積分 · 積分解鎖高級教程',
    'home.points.earn': '獲取積分',
    'home.points.spend': '消費積分',
    
    // 教程分类
    'category.getting-started': '出海第一步',
    'category.vpn-tech': 'VPN/SS技術',
    'category.social-engineering': '社會工程學',
    'category.kali-linux': 'Kali實戰',
    'category.anonymity': '匿名化技術',
    'category.ssh-remote': 'SSH/遠程技巧',
    'category.hardware': '硬件改裝',
    'category.anti-tracking': '反跟蹤反偵察',
    'category.virtual-env': '虛擬環境搭建',
    'category.avoid-pitfalls': '跳坑第一站',
    
    // 积分
    'points.balance': '積分餘額',
    'points.earn.register': '註冊獎勵',
    'points.earn.tutorial': '貢獻教程',
    'points.earn.ad': '看廣告',
    'points.earn.community': '社區互動',
    'points.spend.unlock': '解鎖教程',
    'points.spend.download': '下載資源',
    'points.spend.consult': '私密諮詢',
    
    // 免责声明
    'disclaimer.title': '重要聲明',
    'disclaimer.content': '本平台提供的所有教程內容僅供技術學習和研究使用。請勿將教程內容用於任何非法用途。用戶需自行承擔使用教程的法律責任，與平台無關。請遵守當地法律法規。',
    'disclaimer.link': '查看完整免責聲明',
    
    // 教程
    'tutorial.views': '瀏覽',
    'tutorial.likes': '點讚',
    'tutorial.comments': '評論',
    'tutorial.unlock': '解鎖',
    'tutorial.locked': '已鎖定',
    'tutorial.free': '免費',
    'tutorial.difficulty.easy': '簡單',
    'tutorial.difficulty.medium': '中等',
    'tutorial.difficulty.hard': '困難',
    'tutorial.difficulty.hell': '地獄',
    'tutorial.verified': '已認證',
    'tutorial.updated': '更新於',
  },
  
  'en': {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.download': 'Download',
    
    // Navigation
    'nav.home': 'Home',
    'nav.tutorials': 'Tutorials',
    'nav.forum': 'Forum',
    'nav.tools': 'Tools',
    'nav.pricing': 'Pricing',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Home
    'home.title': 'Tutorial Knowledge Aggregation Hub',
    'home.subtitle': 'Tech Freedom · Priceless Knowledge · Complete Anonymity',
    'home.cta.learn': 'Start Learning',
    'home.cta.earn': 'Write Tutorials & Earn Points',
    'home.feature.tutorials': 'Professional Tutorials',
    'home.feature.points': 'Point Crowdsourcing',
    'home.feature.multilang': 'Multi-language',
    'home.categories.title': 'Featured Tutorial Categories',
    'home.categories.subtitle': 'Covering VPN, Anonymity, Security & Practical Skills',
    'home.points.title': 'Point Crowdsourcing System',
    'home.points.subtitle': 'Write Tutorials · Watch Ads · Unlock Advanced Content',
    'home.points.earn': 'Earn Points',
    'home.points.spend': 'Spend Points',
    
    // Categories
    'category.getting-started': 'Getting Started',
    'category.vpn-tech': 'VPN/SS Tech',
    'category.social-engineering': 'Social Engineering',
    'category.kali-linux': 'Kali Linux',
    'category.anonymity': 'Anonymity Tech',
    'category.ssh-remote': 'SSH & Remote',
    'category.hardware': 'Hardware Mod',
    'category.anti-tracking': 'Anti-Tracking',
    'category.virtual-env': 'Virtual Environment',
    'category.avoid-pitfalls': 'Avoid Pitfalls',
    
    // Points
    'points.balance': 'Point Balance',
    'points.earn.register': 'Registration Reward',
    'points.earn.tutorial': 'Contribute Tutorials',
    'points.earn.ad': 'Watch Ads',
    'points.earn.community': 'Community',
    'points.spend.unlock': 'Unlock Tutorials',
    'points.spend.download': 'Download Resources',
    'points.spend.consult': 'Private Consultation',
    
    // Disclaimer
    'disclaimer.title': 'Important Notice',
    'disclaimer.content': 'All tutorial content on this platform is for technical learning and research purposes only. Do not use the content for any illegal purposes. Users are solely responsible for legal compliance. The platform is not liable for user actions. Please comply with local laws and regulations.',
    'disclaimer.link': 'View Full Disclaimer',
    
    // Tutorial
    'tutorial.views': 'Views',
    'tutorial.likes': 'Likes',
    'tutorial.comments': 'Comments',
    'tutorial.unlock': 'Unlock',
    'tutorial.locked': 'Locked',
    'tutorial.free': 'Free',
    'tutorial.difficulty.easy': 'Easy',
    'tutorial.difficulty.medium': 'Medium',
    'tutorial.difficulty.hard': 'Hard',
    'tutorial.difficulty.hell': 'Hell',
    'tutorial.verified': 'Verified',
    'tutorial.updated': 'Updated',
  }
}

// Hook for using translations
export function useTranslation(lang: Language = 'zh-TW') {
  const t = (key: string): string => {
    return translations[lang][key] || key
  }
  
  return { t, lang }
}

// Get translation
export function t(key: string, lang: Language = 'zh-TW'): string {
  return translations[lang][key] || key
}
