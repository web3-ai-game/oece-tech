'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; 
import { Input } from '@/components/ui/input';
import { 
  SendHorizontal, 
  Sparkles, 
  MessageSquare, 
  X,
  Minimize2,
  Maximize2,
  Moon,
  Sun,
  Globe,
  ArrowRight,
  Mountain, 
  ShieldCheck, 
  Cloud, 
  Github,
  Gitlab,
  Flame, 
  Facebook,
  Instagram,
  Phone,
  MessageCircle, 
  Slack,
  Send, 
  Cpu, 
  Menu
} from 'lucide-react';
import { continueConversation, Message } from '@/app/actions/chat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
        brand: "DEEPWAY",
        slogan: "Architect Your Reality",
        subSlogan: "The next evolution of AI consciousness.",
        emailPlace: "name@company.com",
        login: "Sign In",
        or: "OR CONTINUE WITH",
        chatWelcome: "Hello. I am DeepWay. I'm here to help you find your anchor and elevate your perspective. What is on your mind?",
        chatPlaceholder: "Ask anything...",
        loginBtn: "Log In",
        footerRights: "© 2025 DEEPWAY.ME",
        techStack: "POWERED BY WORLD-CLASS INFRASTRUCTURE"
    },
    zh: {
        brand: "DEEPWAY",
        slogan: "重構你的現實",
        subSlogan: "下一代 AI 意識進化引擎。",
        emailPlace: "你的郵箱地址",
        login: "登錄 / 註冊",
        or: "或通過以下方式",
        chatWelcome: "你好，我是 DeepWay。我在此協助你尋找錨點，提升維度。此刻，你心中有何困惑？",
        chatPlaceholder: "問點什麼...",
        loginBtn: "登錄",
        footerRights: "© 2025 DEEPWAY.ME",
        techStack: "世界級基礎設施驅動"
    }
};

// --- Components ---

const NavBar = ({ isDark, setIsDark, lang, setLang }: any) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
    
    return (
        <header className={`fixed top-0 left-0 w-full z-40 px-4 md:px-8 py-4 flex justify-between items-center transition-all duration-300 backdrop-blur-xl border-b ${
            isDark ? 'bg-[#0a0a0a]/70 border-white/5' : 'bg-[#fcfaf7]/70 border-black/5'
        }`}>
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                {/* Logo: Mountain Peak */}
                <div className={`relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center`}>
                    <Mountain className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? 'text-white' : 'text-black'} fill-current`} strokeWidth={1.5} />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className={`text-xl md:text-2xl font-black tracking-widest font-serif-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.brand}
                </h1>
            </Link>
            
            <div className="flex items-center gap-2 md:gap-6">
                {/* Mobile Menu Trigger */}
                <div className="md:hidden flex items-center gap-2">
                    <button 
                        onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                        className={`text-xs font-bold uppercase p-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        {lang === 'en' ? 'EN' : '繁'}
                    </button>
                    
                    {/* Mobile Sheet Menu could go here, but for now we keep actions visible */}
                    <Link href="/dashboard">
                        <Button size="sm" variant="outline" className={`text-xs h-8 px-3 ${isDark ? 'border-white/20 text-white' : 'border-black/10 text-black'}`}>
                            {t.loginBtn}
                        </Button>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
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

                    <Link href="/dashboard">
                        <button className={`px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-sm border transition-all ${
                            isDark 
                            ? 'border-white text-white hover:bg-white hover:text-black' 
                            : 'border-black text-gray-900 hover:bg-black hover:text-white'
                        }`}>
                            {t.loginBtn}
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

const AIChatWidget = ({ isDark, lang }: any) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: t.chatWelcome }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'model') {
            setMessages([{ role: 'model', content: t.chatWelcome }]);
        }
    }, [lang]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const result = await continueConversation(messages, input);

        setIsLoading(false);
        if (result.success) {
             setMessages(prev => [...prev, { role: 'model', content: result.data }]);
        } else {
             setMessages(prev => [...prev, { role: 'model', content: isDark ? "Connection Interrupted." : "鏈接中斷。" }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 z-50 border
                    ${isDark ? 'bg-white text-black border-transparent' : 'bg-black text-white border-transparent'}
                `}
            >
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        );
    }

    return (
        <div className={`
            fixed z-50 flex flex-col shadow-2xl overflow-hidden transition-all duration-300
            ${isExpanded ? 'inset-0 md:inset-4 rounded-none md:rounded-2xl' : 'bottom-0 md:bottom-8 right-0 md:right-8 w-full md:w-[380px] h-[50vh] md:h-[600px] rounded-t-2xl md:rounded-2xl'}
            ${isDark ? 'bg-[#121212] border-t md:border border-white/10' : 'bg-white border-t md:border border-gray-200'}
        `}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                    </div>
                    <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>DEEPWAY AI</span>
                </div>
                <div className="flex items-center gap-2">
                     <button className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`} onClick={() => setIsExpanded(!isExpanded)}>
                         {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                     </button>
                     <button className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`} onClick={() => setIsOpen(false)}>
                         <X className="w-4 h-4" />
                     </button>
                </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[90%] text-sm leading-7 font-sans
                            ${msg.role === 'user' 
                                ? (isDark ? 'text-white/90 bg-white/10 px-4 py-3 rounded-2xl rounded-tr-sm' : 'text-gray-900 bg-gray-100 px-4 py-3 rounded-2xl rounded-tr-sm')
                                : (isDark ? 'text-gray-400' : 'text-gray-600')}
                        `}>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start pl-2">
                         <div className={`flex gap-1.5 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                             <span className="animate-bounce">●</span>
                             <span className="animate-bounce delay-100">●</span>
                             <span className="animate-bounce delay-200">●</span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'}`}>
                <div className={`flex items-center rounded-xl px-2 py-1 border transition-all ${
                    isDark 
                    ? 'bg-black border-white/10 focus-within:border-amber-500/50' 
                    : 'bg-white border-gray-200 focus-within:border-amber-500/50 shadow-sm'
                }`}>
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.chatPlaceholder}
                        className={`border-none bg-transparent focus-visible:ring-0 h-10 ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className={`p-2 rounded-lg transition-all ${
                            input.trim() 
                            ? (isDark ? 'text-amber-400 hover:bg-amber-400/10' : 'text-amber-600 hover:bg-amber-50') 
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function DeepWayHomePage() {
  const { isDark, setIsDark } = useDarkMode();
  const [lang, setLang] = useState<'en' | 'zh'>('zh'); 
  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex flex-col font-sans ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fcfaf7]'}`}>
      
      <NavBar isDark={isDark} setIsDark={setIsDark} lang={lang} setLang={setLang} />

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 pt-24 md:pt-32 pb-12 px-6 relative z-10">
          
          {/* Left: Content (Mobile First Priority) */}
          <div className="w-full md:flex-1 space-y-8 md:space-y-10 text-center md:text-left">
              <div className="space-y-4 md:space-y-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.2em] border uppercase ${
                      isDark 
                      ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' 
                      : 'border-amber-700/20 text-amber-700 bg-amber-700/5'
                  }`}>
                      <Sparkles className="w-3 h-3" />
                      <span>Consciousness Evolution</span>
                  </div>
                  
                  <h1 className={`text-4xl md:text-6xl lg:text-7xl font-serif-display font-medium leading-[1.1] tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t.slogan}
                  </h1>
                  
                  <p className={`text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto md:mx-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.subSlogan}
                  </p>
              </div>

              {/* Login Form (Demo) */}
              <div className="space-y-4 w-full max-w-sm mx-auto md:mx-0">
                  <div className={`relative group rounded-lg p-1 transition-all duration-300 border ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-black/5 hover:border-black/20 shadow-sm'}`}>
                      <Input 
                        placeholder={t.emailPlace} 
                        className={`h-12 border-none bg-transparent focus-visible:ring-0 text-base px-4 ${isDark ? 'text-white placeholder:text-gray-600' : 'text-black placeholder:text-gray-400'}`}
                      />
                      <Link href="/dashboard">
                        <button className={`absolute right-1.5 top-1.5 h-10 w-10 flex items-center justify-center rounded-md transition-all ${
                            isDark 
                            ? 'bg-white text-black hover:bg-gray-200' 
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase opacity-40">
                      <div className={`flex-1 h-px ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                      <span className={isDark ? 'text-white' : 'text-black'}>{t.or}</span>
                      <div className={`flex-1 h-px ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                  </div>
                  
                  <Link href="/dashboard" className="w-full">
                    <button className={`w-full py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-3 ${
                        isDark 
                        ? 'border-white/20 text-white hover:bg-white/5' 
                        : 'border-black/10 text-gray-900 hover:bg-black/5 bg-white'
                    }`}>
                        <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 grayscale opacity-60" />
                        Google
                    </button>
                  </Link>
              </div>
          </div>

          {/* Right: Visual (Mobile: Hidden or Smaller / Desktop: Full) */}
          <div className="w-full md:flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
               <div className="relative w-full max-w-[400px] aspect-square">
                   <div className={`absolute inset-0 rounded-full blur-[80px] opacity-30 animate-pulse ${
                       isDark ? 'bg-amber-900' : 'bg-amber-200'
                   }`}></div>
                   <div className={`absolute inset-10 rounded-full blur-[60px] opacity-20 animate-pulse delay-75 ${
                       isDark ? 'bg-purple-900' : 'bg-purple-200'
                   }`}></div>

                   <div className={`relative z-10 w-full h-full rounded-[2rem] border backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center animate-float shadow-2xl ${
                       isDark 
                       ? 'bg-white/5 border-white/10' 
                       : 'bg-white/40 border-white/60'
                   }`}>
                        <div className={`w-16 h-16 md:w-20 md:h-20 mb-6 rounded-2xl flex items-center justify-center shadow-lg ${
                            isDark ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white' : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                        }`}>
                            <Mountain className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h3 className={`text-xl md:text-2xl font-serif-display mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>DeepWay.OS</h3>
                        <div className={`text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-60 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            System V.5.0 <br/> Noble Edition
                        </div>
                   </div>
               </div>
          </div>
      </main>

      {/* FOOTER */}
      <footer className={`w-full py-8 md:py-12 px-6 border-t mt-auto relative z-10 ${
          isDark 
          ? 'border-white/5 bg-[#050505] text-gray-400' 
          : 'border-black/5 bg-white text-gray-500'
      }`}>
          <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
              
              {/* Tech Stack */}
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 w-full md:w-auto text-center md:text-left">{t.techStack}</span>
                  <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
                      <div className="flex items-center gap-2" title="Google Cloud Platform"><Cloud className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">GCP</span></div>
                      <div className="flex items-center gap-2" title="Gemini AI"><Cpu className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">GEMINI 2.5</span></div>
                      <div className="flex items-center gap-2" title="Firebase Identity"><Flame className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">FIREBASE</span></div>
                      <div className="flex items-center gap-2" title="Secured by SSL"><ShieldCheck className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">SSL SECURE</span></div>
                      <div className="flex items-center gap-2" title="GitHub"><Github className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">GITHUB</span></div>
                      <div className="flex items-center gap-2" title="GitLab"><Gitlab className="w-5 h-5" /><span className="text-xs font-bold hidden md:inline">GITLAB</span></div>
                  </div>
              </div>

              <div className={`w-full h-px ${isDark ? 'bg-white/5' : 'bg-black/5'}`}></div>

              {/* Links */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex flex-col items-center md:items-start gap-2">
                      <Link href="/" className="flex items-center gap-2">
                          <Mountain className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                          <span className={`text-xl font-bold font-serif-display ${isDark ? 'text-white' : 'text-black'}`}>DEEPWAY</span>
                      </Link>
                      <span className="text-xs tracking-widest">deepweay.me</span>
                  </div>

                  <div className="flex gap-6">
                      <a href="#" className="hover:text-amber-500 transition-colors"><Slack className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-amber-500 transition-colors"><Send className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-amber-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                      <a href="#" className="hover:text-amber-500 transition-colors"><MessageCircle className="w-5 h-5" /></a> {/* Line/WhatsApp */}
                      <a href="#" className="hover:text-amber-500 transition-colors"><Phone className="w-5 h-5" /></a>
                  </div>
              </div>

              {/* Bottom */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-wide opacity-60 text-center md:text-left">
                  <p>{t.footerRights}</p>
                  <p>FULL STACK SUPPORT: +66 88088088</p>
              </div>
          </div>
      </footer>

      <AIChatWidget isDark={isDark} lang={lang} />
    </div>
  );
}
