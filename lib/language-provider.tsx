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
