'use client';

import React, { useState, useEffect } from 'react';
import { 
    Mountain, 
    Sun, 
    Moon, 
    Globe,
    Cloud,
    Cpu,
    Flame,
    ShieldCheck,
    Github,
    Gitlab,
    Slack,
    Send,
    Facebook,
    Instagram,
    MessageCircle,
    Phone,
    Twitter,
    Laptop
} from 'lucide-react';
import Link from 'next/link';

// --- Theme Context ---
const useDarkMode = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return { isDark, setIsDark };
};

// --- Localization Mock ---
const TRANSLATIONS = {
    en: {
        brand: "DEEPWAY.ME",
        login: "Sign In",
        footerRights: `© ${new Date().getFullYear()} DEEPWAY.ME`,
        techStack: "POWERED BY WORLD-CLASS INFRASTRUCTURE",
        contact: "FULL STACK SUPPORT: +66 88088088",
    },
    zh: {
        brand: "DEEPWAY.ME",
        login: "登錄 / 註冊",
        footerRights: `© ${new Date().getFullYear()} DEEPWAY.ME`,
        techStack: "世界級基礎設施驅動",
        contact: "全棧技術支持: +66 88088088",
    }
};

// --- Components ---

const SimpleHeader = ({ isDark, setIsDark, lang, setLang }: any) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
    
    return (
        <header className={`fixed top-0 left-0 w-full z-40 px-6 md:px-8 py-4 flex justify-between items-center transition-all duration-300 backdrop-blur-xl border-b ${
            isDark ? 'bg-[#0a0a0a]/70 border-white/5' : 'bg-[#fcfaf7]/70 border-black/5'
        }`}>
            <Link href="/" className="flex items-center gap-2 group">
                <Mountain className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'} fill-current transition-transform group-hover:scale-110`} strokeWidth={1.5} />
                <h1 className={`text-2xl font-black tracking-widest font-['Orbitron'] uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.brand}
                </h1>
            </Link>
            
            <div className="flex items-center gap-3 md:gap-6">
                <button 
                    onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                    className={`flex items-center gap-1 text-xs font-bold uppercase transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                >
                    <Globe className="w-3 h-3" />
                    <span>{lang === 'en' ? 'EN' : '繁'}</span>
                </button>

                <button 
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-black/5 hover:text-black'}`}
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            </div>
        </header>
    );
};

const BeefyFooter = ({ lang, isDark }: any) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
    return (
        <footer className={`w-full py-12 px-6 border-t mt-auto relative z-10 ${
            isDark 
            ? 'border-white/5 bg-[#050505] text-gray-400' 
            : 'border-black/5 bg-white text-gray-500'
        }`}>
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                 <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 w-full md:w-auto text-center md:text-left">{t.techStack}</span>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
                        <div className="flex items-center gap-2" title="Google Cloud Platform"><Cloud className="w-5 h-5" /><span className="text-xs font-bold">GCP</span></div>
                        <div className="flex items-center gap-2" title="Gemini AI"><Cpu className="w-5 h-5" /><span className="text-xs font-bold">GEMINI 2.5</span></div>
                        <div className="flex items-center gap-2" title="Firebase Identity"><Flame className="w-5 h-5" /><span className="text-xs font-bold">FIREBASE</span></div>
                        <div className="flex items-center gap-2" title="Secured by SSL"><ShieldCheck className="w-5 h-5" /><span className="text-xs font-bold">SSL SECURE</span></div>
                        <div className="flex items-center gap-2" title="GitHub"><Github className="w-5 h-5" /><span className="text-xs font-bold">GITHUB</span></div>
                        <div className="flex items-center gap-2" title="GitLab"><Gitlab className="w-5 h-5" /><span className="text-xs font-bold">GITLAB</span></div>
                        <div className="flex items-center gap-2" title="Facebook"><Facebook className="w-5 h-5" /></div>
                        <div className="flex items-center gap-2" title="Apple"><Laptop className="w-5 h-5" /></div>
                        <div className="flex items-center gap-2" title="Microsoft"><img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-4 h-4" alt="Microsoft"/></div>
                        <div className="flex items-center gap-2" title="Twitter"><Twitter className="w-5 h-5" /></div>
                    </div>
                </div>

                <div className={`w-full h-px ${isDark ? 'bg-white/5' : 'bg-black/5'}`}></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <Mountain className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                            <span className={`text-xl font-black font-['Orbitron'] uppercase ${isDark ? 'text-white' : 'text-black'}`}>DEEPWAY.ME</span>
                        </div>
                        <span className="text-xs tracking-widest">deepway.me</span>
                    </div>

                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-amber-500 transition-colors"><Slack className="w-5 h-5" /></Link>
                        <Link href="/" className="hover:text-amber-500 transition-colors"><Send className="w-5 h-5" /></Link>
                        <Link href="/" className="hover:text-amber-500 transition-colors"><Facebook className="w-5 h-5" /></Link>
                        <Link href="/" className="hover:text-amber-500 transition-colors"><Instagram className="w-5 h-5" /></Link>
                        <Link href="/" className="hover:text-amber-500 transition-colors"><MessageCircle className="w-5 h-5" /></Link>
                        <Link href="/" className="hover:text-amber-500 transition-colors"><Phone className="w-5 h-5" /></Link>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-wide opacity-60">
                    <p>{t.footerRights}</p>
                    <p>{t.contact}</p>
                </div>
            </div>
        </footer>
    );
};


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark, setIsDark } = useDarkMode();
  const [lang, setLang] = useState<'en' | 'zh'>('zh'); 

  // A way to check if the current child is the dashboard
  const isDashboard = (children as React.ReactElement)?.props?.childProp?.segmentPath?.includes('dashboard');

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex flex-col font-sans ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fcfaf7]'}`}>
       {!isDashboard && <SimpleHeader isDark={isDark} setIsDark={setIsDark} lang={lang} setLang={setLang} />}
      <div className="flex-1 flex flex-col pt-16 md:pt-0">
        {children}
      </div>
      <BeefyFooter lang={lang} isDark={isDark} />
    </div>
  );
}
