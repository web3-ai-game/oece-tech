"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 簡化版翻譯字典
const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.knowledge": "Knowledge",
    "nav.pricing": "Pricing",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "hero.title": "AI-Powered",
    "hero.highlight": "Knowledge Engine",
    "hero.subtitle": "Chat with Gemini AI, explore knowledge base, unlock the future.",
    "chat.placeholder": "Ask me anything...",
    "chat.remaining": "requests remaining",
    "cta.pricing": "Pricing",
    "cta.docs": "Docs",
    "features.gemini.title": "Gemini Pro",
    "features.gemini.desc": "Unlimited Lite",
    "features.chat.title": "Smart Chat",
    "features.chat.desc": "Multi-modal",
    "features.beta.title": "Beta Free",
    "features.beta.desc": "All features",
    "footer.auth": "Full-Stack Login Support",
    "footer.social": "Omni-Channel Marketing",
    "footer.tech": "POWERED BY GIANTS",
    "footer.techSubtitle": "Built on World-Class Infrastructure",
    "footer.copyright": "© 2025 OECE Tech · Built with 🔥 Firebase · Powered by Gemini AI",
    "pricing.title": "Pricing & Memory Panel",
    "profile.title": "Profile",
    "knowledge.title": "Knowledge Base",
  },
  zh: {
    "nav.home": "首頁",
    "nav.knowledge": "知識庫",
    "nav.pricing": "價格",
    "nav.signIn": "登錄",
    "nav.getStarted": "開始使用",
    "hero.title": "AI 驅動",
    "hero.highlight": "知識引擎",
    "hero.subtitle": "與 Gemini AI 對話，探索知識庫，解鎖未來。",
    "chat.placeholder": "問我任何問題...",
    "chat.remaining": "次請求剩餘",
    "cta.pricing": "價格",
    "cta.docs": "文檔",
    "features.gemini.title": "Gemini Pro",
    "features.gemini.desc": "Lite 無限使用",
    "features.chat.title": "智能對話",
    "features.chat.desc": "多模態支持",
    "features.beta.title": "Beta 免費",
    "features.beta.desc": "全部功能",
    "footer.auth": "全棧登錄支持",
    "footer.social": "全渠道營銷",
    "footer.tech": "世界級基礎設施",
    "footer.techSubtitle": "構建於頂級技術棧",
    "footer.copyright": "© 2025 OECE Tech · 基於 🔥 Firebase · 由 Gemini AI 驅動",
    "pricing.title": "價格 & 記憶面板",
    "profile.title": "個人中心",
    "knowledge.title": "知識庫",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
