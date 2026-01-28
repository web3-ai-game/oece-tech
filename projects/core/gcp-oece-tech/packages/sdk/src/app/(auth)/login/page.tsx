'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Lock, Hexagon, Code2, ArrowRight, Github, Twitter, Facebook, Laptop, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


const CyberpunkBackground = ({ isDark }: { isDark: boolean }) => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden perspective-800">
        <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-gray-100'}`}></div>
        
        <div className="absolute bottom-0 left-0 w-full h-3/4 bg-grid-pattern animate-pan-grid" style={{ transformOrigin: 'bottom center', transform: 'rotateX(75deg)' }}></div>
        
        <div className="absolute bottom-[25%] left-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/30 to-transparent blur-2xl"></div>
        <div className="absolute bottom-[25%] left-0 w-full h-px bg-cyan-400"></div>

        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[200%] h-1/2 flex items-end justify-center gap-4 animate-buildings">
            {[...Array(20)].map((_, i) => (
                <div key={i} className={`h-full w-4 ${isDark ? 'bg-cyan-900/50' : 'bg-gray-700/50'} relative overflow-hidden`} style={{ height: `${20 + Math.random() * 80}%`, filter: `brightness(${0.5 + Math.random() * 0.5})`}}>
                     <div className="absolute top-0 w-full h-full bg-gradient-to-t from-transparent to-cyan-500/20 animate-light-scan" style={{animationDelay: `${Math.random() * 5}s`}}></div>
                </div>
            ))}
        </div>
        
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black via-black/50 to-transparent' : 'bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent'}`}></div>
    </div>
);


export default function DeepWayLoginPage() {
    const [isDark, setIsDark] = useState(true);
    const [lang, setLang] = useState<'en' | 'zh'>('zh'); 
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();


    const t = {
        en: {
            title: "Access DeepWay.OS",
            subtitle: "Metaphysical Online System",
            login: "Sign In",
            register: "Register",
            identity: "Email Address",
            identityPlaceholder: "user@deepway.me",
            accessKey: "Access Key",
            accessKeyPlaceholder: "••••••••",
            confirmKey: "Confirm Key",
            initiate: "Initiate Link",
            createNode: "Create Node",
            recover: "Recover Signal",
            status: "SYSTEM: ONLINE",
            version: "v.5.0.1",
            noosphere: "NOOSPHERE CONNECTION ESTABLISHED // SECURE CHANNEL ENCRYPTED",
            switchLogin: "Already have a node?",
            switchRegister: "Need to create a node?",
            orContinueWith: "Or Continue With",
        },
        zh: {
            title: "登入 DeepWay.OS",
            subtitle: "形而上在線系統",
            login: "登錄",
            register: "註冊",
            identity: "郵箱地址",
            identityPlaceholder: "user@deepway.me",
            accessKey: "訪問密鑰",
            accessKeyPlaceholder: "••••••••",
            confirmKey: "確認密鑰",
            initiate: "建立鏈接",
            createNode: "創建節點",
            recover: "信號恢復",
            status: "系統: 在線",
            version: "v.5.0.1",
            noosphere: "意識圈連接已建立 // 安全通道已加密",
            switchLogin: "已有節點?",
            switchRegister: "需要創建節點?",
            orContinueWith: "或通過以下方式繼續",
        }
    }[lang];

    useEffect(() => {
    }, []);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const auth = getAuth();
        const db = getFirestore();

        if (isLogin) {
            // Handle Login
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast({ title: "登錄成功", description: "歡迎回到矩陣。" });
                router.push('/dashboard');
            } catch (error: any) {
                console.error("Login Error:", error);
                let message = "登錄失敗，請檢查您的憑證。";
                if (error.code === 'auth/invalid-credential') message = "密碼錯誤或賬號不存在。";
                if (error.code === 'auth/user-not-found') message = "找不到該節點（賬號）。";
                if (error.code === 'auth/wrong-password') message = "密鑰（密碼）錯誤。";
                toast({ variant: "destructive", title: "連接被拒", description: message });
            }
        } else {
            // Handle Registration
            if (password !== confirmPassword) {
                toast({ variant: "destructive", title: "註冊失敗", description: "密鑰不匹配。" });
                setIsLoading(false);
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const displayName = email.split('@')[0];

                await updateProfile(user, { displayName });
                
                // Create user profile in Firestore
                // We use setDoc with merge: true to avoid overwriting if somehow exists
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName,
                    email: user.email,
                    karma: 0,
                    role: 'initiate', // Default role
                    createdAt: new Date().toISOString(),
                    invitationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
                }, { merge: true });
                
                toast({ title: "節點創建成功", description: "您的意識已成功接入矩陣。" });
                router.push('/dashboard');
            } catch (error: any) {
                console.error("Register Error:", error);
                let message = "創建節點失敗。";
                if (error.code === 'auth/email-already-in-use') message = "該信號源（郵箱）已被佔用。";
                if (error.code === 'auth/weak-password') message = "密鑰強度不足（密碼太弱）。";
                toast({ variant: "destructive", title: "創建失敗", description: message });
            }
        }

        setIsLoading(false);
    };

    const socialProviders = [
        { name: 'Google', icon: <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" /> },
        { name: 'Facebook', icon: <Facebook className="w-5 h-5 text-[#1877F2]" /> },
        { name: 'Apple', icon: <Laptop className="w-5 h-5" /> },
        { name: 'GitHub', icon: <Github className="w-5 h-5" /> },
        { name: 'Microsoft', icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-4 h-4" alt="Microsoft"/> },
        { name: 'Twitter', icon: <Twitter className="w-5 h-5 text-[#1DA1F2]" /> },
    ];

    return (
        <div className={`w-full min-h-screen flex flex-col font-sans overflow-hidden relative`}>
            <CyberpunkBackground isDark={isDark} />
            
            <main className="flex-1 w-full flex items-center justify-center p-4 relative z-10">
                <Card className={`w-full max-w-md relative z-10 p-8 shadow-2xl animate-float transition-all duration-500 ${
                    isDark
                    ? 'bg-black/80 border border-amber-500/20 backdrop-blur-md shadow-amber-900/20'
                    : 'bg-white/80 border border-black/10 backdrop-blur-md shadow-gray-500/20'
                }`}>
                    <div className="text-center mb-8 relative">
                        <h1 className={`text-3xl font-black tracking-widest font-serif-display uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            {isLogin ? t.login : t.register}
                        </h1>
                        <p className={`text-xs mt-2 tracking-[0.2em] uppercase ${isDark ? 'text-cyan-700' : 'text-cyan-900'}`}>{t.subtitle}</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleAuthAction}>
                        <div className="space-y-2">
                            <Label htmlFor="identity" className={`text-xs uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-cyan-600' : 'text-cyan-800'}`}>
                                <Hexagon className="w-3 h-3" /> {t.identity}
                            </Label>
                            <div className="relative group">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-cyan-700 group-focus-within:text-amber-400' : 'text-cyan-800 group-focus-within:text-amber-600'}`} />
                                <Input 
                                    id="identity"
                                    type="email" 
                                    placeholder={t.identityPlaceholder}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-10 text-base transition-all duration-300 ${isDark ? 'bg-black/50 border-cyan-900 focus:border-amber-500/50 text-cyan-300 placeholder:text-cyan-900/50' : 'bg-white/50 border-gray-300 focus:border-amber-500 text-gray-800 placeholder:text-gray-400'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="access-key" className={`text-xs uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-cyan-600' : 'text-cyan-800'}`}>
                                <Code2 className="w-3 h-3" /> {t.accessKey}
                            </Label>
                            <div className="relative group">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-cyan-700 group-focus-within:text-amber-400' : 'text-cyan-800 group-focus-within:text-amber-600'}`} />
                                <Input 
                                    id="access-key"
                                    type="password" 
                                    placeholder={t.accessKeyPlaceholder}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`pl-10 text-base transition-all duration-300 ${isDark ? 'bg-black/50 border-cyan-900 focus:border-amber-500/50 text-cyan-300 placeholder:text-cyan-900/50' : 'bg-white/50 border-gray-300 focus:border-amber-500 text-gray-800 placeholder:text-gray-400'}`}
                                />
                            </div>
                        </div>

                        {!isLogin && (
                             <div className="space-y-2">
                                <Label htmlFor="confirm-key" className={`text-xs uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-cyan-600' : 'text-cyan-800'}`}>
                                    <Code2 className="w-3 h-3" /> {t.confirmKey}
                                </Label>
                                <div className="relative group">
                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-cyan-700 group-focus-within:text-amber-400' : 'text-cyan-800 group-focus-within:text-amber-600'}`} />
                                    <Input 
                                        id="confirm-key"
                                        type="password" 
                                        placeholder={t.accessKeyPlaceholder}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-10 text-base transition-all duration-300 ${isDark ? 'bg-black/50 border-cyan-900 focus:border-amber-500/50 text-cyan-300 placeholder:text-cyan-900/50' : 'bg-white/50 border-gray-300 focus:border-amber-500 text-gray-800 placeholder:text-gray-400'}`}
                                    />
                                </div>
                            </div>
                        )}
                        
                          <Button 
                              type="submit" 
                              disabled={isLoading}
                              className={`w-full h-12 text-sm font-bold tracking-widest uppercase rounded-md border transition-all duration-300 group ${
                                  isDark 
                                  ? 'bg-amber-500/90 border-amber-400/50 hover:bg-amber-400 text-black' 
                                  : 'bg-amber-500 border-amber-600/50 hover:bg-amber-600 text-white'
                              }`}
                          >
                              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? t.initiate : t.createNode)}
                              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                          </Button>
                        
                        <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase opacity-40">
                            <div className={`flex-1 h-px ${isDark ? 'bg-cyan-800' : 'bg-cyan-300'}`}></div>
                            <span>{t.orContinueWith}</span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-cyan-800' : 'bg-cyan-300'}`}></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {socialProviders.map(provider => (
                                <Button key={provider.name} variant="outline" className={`w-full transition-all ${isDark ? 'bg-black/50 border-cyan-900/50 hover:border-amber-500/50 hover:bg-cyan-900/40 text-cyan-300' : 'bg-white/50 hover:border-amber-500'}`} onClick={(e) => {e.preventDefault(); toast({title: "提示", description:"此登錄方式正在開發中。"})}}>
                                    {provider.icon}
                                    <span className="hidden md:inline">{provider.name}</span>
                                </Button>
                            ))}
                        </div>

                        <div className="text-center text-xs pt-4">
                           <button 
                             type="button"
                             onClick={() => setIsLogin(!isLogin)}
                             className={`transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                           >
                               {isLogin ? t.switchRegister : t.switchLogin}
                           </button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
