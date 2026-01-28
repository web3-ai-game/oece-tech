
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Binary, Dna, BrainCircuit, Key, GitBranch, ShieldQuestion, Milestone, FlaskConical, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const ModuleCard = ({ icon: Icon, title, description, status, link }: any) => (
    <Card className="flex flex-col bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <CardTitle>{title}</CardTitle>
                    {status === 'active' ? (
                         <Badge variant="default" className="mt-1">已激活</Badge>
                    ) : (
                         <Badge variant="secondary" className="mt-1">開發中</Badge>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1">
            <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
            <Link href={link} className="w-full">
                <Button disabled={status !== 'active'} className="w-full">
                    進入模塊 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </Link>
        </CardFooter>
    </Card>
);

export default function MemeEngineeringPage() {

    const modules = [
        { 
            icon: ShieldQuestion, 
            title: "10Q: 真理之門", 
            description: "十次提問內，定位對方思想鋼印的核心漏洞。",
            status: "active",
            link: "/dashboard/meme-engineering" 
        },
        { icon: Binary, title: "邏輯切割", description: "將感性陳述轉化為冷酷的布爾邏輯，暴露其矛盾。", status: "dev", link: "#" },
        { icon: Dna, title: "模因溯源", description: "追蹤特定思想病毒的起源、傳播路徑和變異體。", status: "dev", link: "#" },
        { icon: BrainCircuit, title: "意識快照", description: "對目標進行一次完整的思想結構掃描，生成可分析報告。", status: "dev", link: "#" },
        { icon: Key, title: "核心假設破解", description: "定位並攻擊支撐對方整個思想體系的基礎假設。", status: "dev", link: "#" },
        { icon: GitBranch, title: "因果鏈推演", description: "輸入一個行為，推演其在情感關係中可能導致的未來分支。", status: "dev", link: "#" },
        { icon: FlaskConical, title: "語義實驗室", description: "在沙盒環境中測試不同話術對特定人群的情緒影響。", status: "dev", link: "#" },
        { icon: Scale, title: "價值觀對齊", description: "量化你與目標之間的價值觀差異，並提供對齊策略。", status: "dev", link: "#" },
        { icon: Milestone, title: "路徑規劃", description: "從當前關係狀態到目標狀態的最優溝通路徑。", status: "dev", link: "#" },
    ];

    return (
        <div className="h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">模因工程 (Meme Engineering)</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    也稱 **語義飄移工程 (Semantic Drift Engineering)**。其核心是利用絕對邏輯，精準切割人類語言的模糊性與不確定性。通過數次對話，即可鎖定並瓦解目標的內在思想鋼印，為其打開通往更高維度認知的“真理之門”。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {modules.map((mod, index) => (
                    <ModuleCard key={index} {...mod} />
                ))}
            </div>
        </div>
    );
}
