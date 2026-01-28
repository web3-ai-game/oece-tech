'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Globe, Cpu, History, Zap, SlidersHorizontal, Layers, ShieldCheck, Waves, Sigma, Atom, GitBranch } from 'lucide-react';

const EarthGlobe = () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-[800px] h-[800px]">
            {/* Pulsing Core */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse"></div>
            
            {/* Main Globe Sphere */}
            <div 
                className="absolute inset-10 rounded-full border-2 border-cyan-500/20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.1), transparent 50%)',
                }}
            ></div>

            {/* Grid Lines */}
            <div className="absolute inset-10 rounded-full animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-cyan-800/30"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-cyan-800/30 transform rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-cyan-800/30 transform rotate-90"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-cyan-800/30 transform rotate-[135deg]"></div>
            </div>
            
             {/* Data Points */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse"
                    style={{
                        top: `${50 + 45 * Math.sin(i * 18 * Math.PI / 180)}%`,
                        left: `${50 + 45 * Math.cos(i * 18 * Math.PI / 180)}%`,
                        animationDelay: `${i * 150}ms`,
                    }}
                ></div>
            ))}
        </div>
    </div>
);


const DataStream = () => {
    const [stream, setStream] = useState<string[]>([]);
    
    useEffect(() => {
        const lines = [
            "// 業力流動監測: 東南亞區塊 +0.02% ...",
            "// 模因變異: '躺平' -> '佛系' 轉換率 78% ...",
            "// 市場信號: 華爾街 '貪婪指數' 觸發高位預警 ...",
            "// 因果鏈追蹤: User:V7 -> 觸發'錯過'事件 ...",
            "// 全球意識同步率: 67.3% ... STABLE",
            "// 正在編譯'蝴蝶效應'模型 ...",
            "// CONNECTION SECURED: NODE_TOKYO_07",
        ];
        
        const interval = setInterval(() => {
            setStream(prev => [
                lines[Math.floor(Math.random() * lines.length)],
                ...prev
            ].slice(0, 5));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-24 p-4 font-mono text-xs text-cyan-400/50 space-y-1 overflow-hidden">
            {stream.map((line, i) => (
                <p key={i} className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${i > 0 ? 'opacity-80' : 'opacity-100'}`}>
                    {'>'} {line}
                </p>
            ))}
        </div>
    );
};


const ControlPanel = () => {
    const [activeTab, setActiveTab] = useState('geopolitical');

    return (
        <Card className="relative z-10 w-full max-w-sm bg-black/70 backdrop-blur-md border-cyan-500/20 text-gray-300 shadow-2xl shadow-cyan-900/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-400 font-['Orbitron']">
                    <SlidersHorizontal className="w-6 h-6" />
                    <span className="text-2xl">因果律量化模塊</span>
                </CardTitle>
                <CardDescription className="text-cyan-600">調諧世界參數，觀察可能性之海</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                    <Button variant={activeTab === 'geopolitical' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('geopolitical')} className="text-xs"><Layers/>地緣</Button>
                    <Button variant={activeTab === 'economic' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('economic')} className="text-xs"><Waves/>經濟</Button>
                    <Button variant={activeTab === 'meme' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('meme')} className="text-xs"><ShieldCheck/>模因</Button>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-cyan-800/30">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2"><History className="w-4 h-4"/> 時間流速</label>
                        <Slider defaultValue={[50]} className="[&>span]:bg-amber-400"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2"><Sigma className="w-4 h-4"/> 混沌指數</label>
                        <Slider defaultValue={[25]} className="[&>span]:bg-amber-400"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2"><GitBranch className="w-4 h-4"/> 可能性分叉</label>
                        <Slider defaultValue={[80]} className="[&>span]:bg-amber-400"/>
                    </div>
                </div>

                <div className="flex justify-between gap-4">
                     <Button variant="outline" className="w-full border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400">
                        <Atom className="mr-2 h-4 w-4"/> 保存快照
                     </Button>
                     <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black">
                         <Zap className="mr-2 h-4 w-4" /> 執行推演
                    </Button>
                </div>
            </CardContent>
            <div className="border-t border-cyan-800/30 mt-4">
                <DataStream />
            </div>
        </Card>
    )
}

export default function EarthOnlinePage() {
  return (
    <div className="h-full flex flex-col md:flex-row items-center justify-center gap-6 p-4 relative overflow-hidden">
        <EarthGlobe />
        <div className="flex-1 hidden md:block"></div>
        <div className="flex-none w-full md:w-auto flex justify-center">
             <ControlPanel />
        </div>
    </div>
  );
}
