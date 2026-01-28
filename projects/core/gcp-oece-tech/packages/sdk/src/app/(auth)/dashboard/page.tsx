'use client'

import React, { useState, useTransition, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Zap, BrainCircuit, Users, Bot, Loader2, Sparkles, Upload, FileCode } from 'lucide-react';
import { askTheUniverse } from '@/app/actions/fortune';
import { analyzeImage } from '@/app/actions/vision';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--primary))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--secondary))',
  },
}

const DailyOracle = () => {
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        setResult('');
        startTransition(async () => {
            const response = await askTheUniverse(query);
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.error || '推演時發生未知錯誤。');
            }
        });
    };
    
    return (
        <Card className="col-span-full xl:col-span-2 border border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Bot className="w-6 h-6" />
                    <span>每日推演 (Daily Oracle)</span>
                </CardTitle>
                <CardDescription>輸入你的困惑、想法、或任何鏈接（如GitHub），洞察因果律的波動。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full gap-2">
                    <Textarea 
                        placeholder="萬物皆數，萬法歸宗... 在此輸入你的“錨點”，例如：https://github.com/torvalds/linux" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-background/50 border-white/10 min-h-[100px] font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} disabled={isPending || !query} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        開始推演 / EXECUTE
                    </Button>
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>推演失敗</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {result && (
                    <Card className="bg-black/30 p-4 border border-white/10">
                        <CardContent className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                            {result}
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}

const VisionAnalyzer = () => {
    const [isPending, startTransition] = useTransition();
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!image) {
            setError('請先上傳一張圖片。');
            return;
        }
        setError('');
        setResult('');
        startTransition(async () => {
            const response = await analyzeImage(image, prompt);
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.error || '分析時發生未知錯誤。');
            }
        });
    };

    return (
        <Card className="col-span-full xl:col-span-2 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Eye className="w-6 h-6" />
                    <span>天眼視覺 (Vision Core)</span>
                </CardTitle>
                <CardDescription>上傳圖像，讓 DeepWay 洞察其中隱藏的數據流與模因結構。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                     <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed border-white/20 hover:bg-white/5 h-20">
                        {image ? (
                            <div className="flex flex-col items-center">
                                <span className="text-green-400 font-bold">已裝載: {imageName}</span>
                                <span className="text-xs text-gray-500">點擊更換</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Upload className="mb-2 h-6 w-6" />
                                <span>點擊上傳 / 拖拽圖像至此</span>
                            </div>
                        )}
                    </Button>
                    <Input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
                <Textarea 
                    placeholder="感覺這張圖哪裡不對勁？輸入你的問題或感受..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-background/50 border-white/10 min-h-[80px]"
                />
                <Button onClick={handleSubmit} disabled={isPending || !image} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                    開啟天眼 / ANALYZE
                </Button>
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>分析失敗</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {result && (
                    <Card className="bg-black/30 p-4 border border-white/10">
                        <CardContent className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                            {result}
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};


export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">主控台 / DASHBOARD</h1>
                    <p className="text-sm text-gray-400 font-mono mt-1">
                        Welcome back, Architect. System V.5.0 online.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        <FileCode className="w-4 h-4 mr-2" />
                        查看 API 文檔
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                        <Zap className="w-4 h-4 mr-2" />
                        升級算力
                    </Button>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">總推演次數</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">45,231</div>
                        <p className="text-xs text-primary">+20.1% 較上月</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">知識庫容量</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">2.3 TB</div>
                        <div className="mt-2">
                            <Progress value={78} className="h-1 bg-white/10" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">在線節點</CardTitle>
                        <Users className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">573</div>
                        <p className="text-xs text-green-400">+18% 較上小時</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">API 調用量</CardTitle>
                        <Eye className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">1.2M</div>
                        <p className="text-xs text-gray-500">下次結算: 12天後</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Interactive Modules */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                <DailyOracle />
                <VisionAnalyzer />
            </div>
            
            {/* Chart Section */}
            <Card className="col-span-full bg-card/30 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">意識流動分析 (Flow Analytics)</CardTitle>
                    <CardDescription>過去六個月的桌面與移動端交互趨勢</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="mobile" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMobile)" />
                                <Area type="monotone" dataKey="desktop" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDesktop)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
