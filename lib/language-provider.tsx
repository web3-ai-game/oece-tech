"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// EN + 繁體中文 翻譯字典
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.knowledge": "Knowledge",
    "nav.pricing": "Pricing",
    "nav.tools": "Tools",
    "nav.about": "About",
    "nav.divination": "Divination",
    "nav.forum": "Forum",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",

    // Hero
    "hero.title": "AI-Powered",
    "hero.highlight": "Knowledge Engine",
    "hero.subtitle": "Chat with Gemini AI, explore knowledge base, unlock the future of intelligence.",
    "hero.cta.companion": "Try AI Companion",
    "hero.cta.explore": "Explore Features",

    // Features
    "features.comic.title": "AI Comic Generator",
    "features.comic.desc": "Input story, AI generates beautiful comic panels",
    "features.novel.title": "Novel Engine",
    "features.novel.desc": "Set protagonist, auto-generate exciting plots",
    "features.pastlife.title": "Past Life Analyzer",
    "features.pastlife.desc": "Analyze past life based on birth & personality",
    "features.prompts.title": "MCP Prompt Library",
    "features.prompts.desc": "Curated high-quality AI prompts",

    // Chat
    "chat.placeholder": "Ask me anything...",
    "chat.remaining": "requests remaining",

    // Knowledge Page
    "knowledge.title": "Knowledge Base",
    "knowledge.subtitle": "1000+ distilled e-books, AI strategy cores, and engineering blueprints — powered by semantic vector search.",
    "knowledge.search": "Search knowledge base...",
    "knowledge.cat.ai": "AI Strategy Core",
    "knowledge.cat.ai.desc": "Deep learning architectures, model training strategies, and AI deployment patterns for production systems.",
    "knowledge.cat.product": "DeepWeay Product Matrix",
    "knowledge.cat.product.desc": "27+ interconnected projects spanning AI infrastructure, security, knowledge management, and developer tools.",
    "knowledge.cat.cyber": "Cyber Cosmology",
    "knowledge.cat.cyber.desc": "Exploring the intersection of ancient wisdom and future technology — Cyber Buddha philosophy.",
    "knowledge.cat.eng": "OECE Engineering",
    "knowledge.cat.eng.desc": "Full-stack engineering blueprints: Next.js, Firebase, MongoDB Atlas, vector search, and cloud architecture.",
    "knowledge.cat.resources": "Resources & Tools",
    "knowledge.cat.resources.desc": "Curated collection of APIs, frameworks, deployment tools, and developer productivity boosters.",
    "knowledge.stats.books": "Distilled Books",
    "knowledge.stats.vectors": "Vector Entries",
    "knowledge.stats.categories": "Categories",
    "knowledge.stats.accuracy": "Semantic Accuracy",
    "knowledge.cta": "Start Exploring",

    // Pricing Page
    "pricing.title": "Pricing",
    "pricing.highlight": "& Memory Panel",
    "pricing.subtitle": "Pay only for what you use. Vector memory ensures accuracy, API calls are cheap.",
    "pricing.badge": "Premium Vector · Low API Cost · Guaranteed Accuracy",
    "pricing.free.name": "Free Tier",
    "pricing.free.desc": "Perfect for trying out",
    "pricing.beta.name": "Beta Tester",
    "pricing.beta.desc": "Current plan — All features unlocked",
    "pricing.pro.name": "Pro Plan",
    "pricing.pro.desc": "For power users",
    "pricing.cost.title": "Cost Breakdown — Transparent Pricing",
    "pricing.memory.title": "Vector Memory",
    "pricing.memory.desc": "Every conversation is indexed and stored in MongoDB Atlas. Retrieval is instant and context-aware.",
    "pricing.api.title": "Low API Cost",
    "pricing.api.desc": "Gemini API calls are extremely cheap. We charge 2× for infrastructure and support.",

    // About / Tools / General
    "about.title": "About OECE",
    "about.subtitle": "An AI-native ecosystem built on knowledge distillation, semantic intelligence, and open collaboration.",
    "tools.title": "AI Toolkit",
    "tools.subtitle": "Powerful AI-powered tools for creators, developers, and curious minds.",

    // Footer
    "footer.auth": "Full-Stack Login Support",
    "footer.social": "Omni-Channel Marketing",
    "footer.tech": "POWERED BY GIANTS",
    "footer.techSubtitle": "Built on World-Class Infrastructure",
    "footer.copyright": "© 2025 OECE Tech · Built with 🔥 Firebase · Powered by Gemini AI",
  },
  zh: {
    // Nav
    "nav.home": "首頁",
    "nav.knowledge": "知識庫",
    "nav.pricing": "方案",
    "nav.tools": "工具箱",
    "nav.about": "關於",
    "nav.divination": "賽博神佛",
    "nav.forum": "論壇",
    "nav.signIn": "登入",
    "nav.getStarted": "開始使用",

    // Hero
    "hero.title": "AI 驅動的",
    "hero.highlight": "知識引擎",
    "hero.subtitle": "與 Gemini AI 對話，探索知識庫，解鎖智慧的未來。",
    "hero.cta.companion": "體驗 AI 夥伴",
    "hero.cta.explore": "探索功能",

    // Features
    "features.comic.title": "AI 漫畫生成器",
    "features.comic.desc": "輸入故事，AI 生成精美漫畫分鏡",
    "features.novel.title": "小說引擎",
    "features.novel.desc": "設定主角，自動生成精彩劇情",
    "features.pastlife.title": "前世分析器",
    "features.pastlife.desc": "根據生辰與個性分析前世因果",
    "features.prompts.title": "MCP 提示詞庫",
    "features.prompts.desc": "精選高品質 AI 提示詞",

    // Chat
    "chat.placeholder": "問我任何問題...",
    "chat.remaining": "次請求剩餘",

    // Knowledge Page
    "knowledge.title": "知識庫",
    "knowledge.subtitle": "1000+ 蒸餾電子書、AI 戰略核心、工程藍圖 — 語義向量搜索驅動。",
    "knowledge.search": "搜尋知識庫...",
    "knowledge.cat.ai": "AI 戰略核心",
    "knowledge.cat.ai.desc": "深度學習架構、模型訓練策略、以及生產環境 AI 部署模式。",
    "knowledge.cat.product": "DeepWeay 產品矩陣",
    "knowledge.cat.product.desc": "27+ 互聯項目，涵蓋 AI 基礎設施、安全服務、知識管理與開發者工具。",
    "knowledge.cat.cyber": "賽博宇宙觀",
    "knowledge.cat.cyber.desc": "探索古老智慧與未來科技的交匯 — 賽博神佛哲學。",
    "knowledge.cat.eng": "OECE 工程體系",
    "knowledge.cat.eng.desc": "全棧工程藍圖：Next.js、Firebase、MongoDB Atlas、向量搜索與雲端架構。",
    "knowledge.cat.resources": "資源與工具",
    "knowledge.cat.resources.desc": "精選 API、框架、部署工具與開發者效率提升工具集。",
    "knowledge.stats.books": "蒸餾書籍",
    "knowledge.stats.vectors": "向量條目",
    "knowledge.stats.categories": "分類",
    "knowledge.stats.accuracy": "語義精確度",
    "knowledge.cta": "開始探索",

    // Pricing Page
    "pricing.title": "方案",
    "pricing.highlight": "& 記憶面板",
    "pricing.subtitle": "按量付費，向量記憶確保準確性，API 調用極低成本。",
    "pricing.badge": "高級向量 · 低 API 成本 · 精準保證",
    "pricing.free.name": "免費方案",
    "pricing.free.desc": "適合體驗試用",
    "pricing.beta.name": "Beta 測試員",
    "pricing.beta.desc": "當前方案 — 全部功能已解鎖",
    "pricing.pro.name": "Pro 方案",
    "pricing.pro.desc": "適合進階用戶",
    "pricing.cost.title": "成本明細 — 透明定價",
    "pricing.memory.title": "向量記憶",
    "pricing.memory.desc": "每段對話都在 MongoDB Atlas 中索引存儲，檢索即時且具備上下文感知。",
    "pricing.api.title": "低 API 成本",
    "pricing.api.desc": "Gemini API 調用成本極低，我們加收 2× 用於基礎設施和支援。",

    // About / Tools / General
    "about.title": "關於 OECE",
    "about.subtitle": "一個建立在知識蒸餾、語義智慧與開放協作之上的 AI 原生生態系統。",
    "tools.title": "AI 工具箱",
    "tools.subtitle": "為創作者、開發者和好奇心打造的強大 AI 工具。",

    // Footer
    "footer.auth": "全棧登入支持",
    "footer.social": "全渠道行銷",
    "footer.tech": "世界級基礎設施",
    "footer.techSubtitle": "構建於頂級技術棧",
    "footer.copyright": "© 2025 OECE Tech · 基於 🔥 Firebase · 由 Gemini AI 驅動",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "zh")) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", lang);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-TW" : "en");
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
