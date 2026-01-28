// Simple translation system without next-intl
export const translations = {
  en: {
    // Common
    brand: 'DeepWeay',
    tagline: 'Deep Dive into Digital Nomad 2.0',
    slogan: 'Negotiate with physical distance and time',
    
    // Nav
    home: 'Home',
    articles: 'Articles',
    aiTools: 'AI Tools',
    forum: 'Forum',
    login: 'Login',
    dashboard: 'Dashboard',
    
    // Homepage
    articleCollection: 'Article Collection',
    more: 'More',
    
    // Cards
    proMembership: 'PRO Membership',
    proDescription: 'Unlock AI tools and exclusive content',
    upgradeToPro: 'Upgrade to PRO',
    bbsCommunity: 'BBS Community',
    bbsDescription: 'Join discussions with digital nomads',
    exploreForum: 'Explore Forum',
    aiToolsPreview: 'AI Tools',
    aiToolsDescription: 'AI-powered travel planning tools',
    viewAllTools: 'View All Tools',
    
    // Footer
    connect: 'Connect',
    navigation: 'Navigation',
    links: 'Links',
    
    // Sidebar
    settings: 'Settings',
    logout: 'Logout',
  },
  
  'zh-TW': {
    // Common
    brand: 'DeepWeay',
    tagline: '深潜数字游民 2.0',
    slogan: '与物理距离和时间协商',
    
    // Nav
    home: '首頁',
    articles: '文章',
    aiTools: 'AI 工具',
    forum: '論壇',
    login: '登入',
    dashboard: '儀表板',
    
    // Homepage
    articleCollection: '文章精選',
    more: '更多',
    
    // Cards
    proMembership: 'PRO 會員',
    proDescription: '解鎖 AI 工具和獨家內容',
    upgradeToPro: '升級至 PRO',
    bbsCommunity: 'BBS 社群',
    bbsDescription: '與數位遊民一起討論',
    exploreForum: '探索論壇',
    aiToolsPreview: 'AI 工具',
    aiToolsDescription: 'AI 驅動的旅行規劃工具',
    viewAllTools: '查看所有工具',
    
    // Footer
    connect: '連結',
    navigation: '導航',
    links: '友情連結',
    
    // Sidebar
    settings: '設定',
    logout: '登出',
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function useTranslation(locale: Locale = 'en') {
  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key];
  };
  
  return { t, locale };
}
