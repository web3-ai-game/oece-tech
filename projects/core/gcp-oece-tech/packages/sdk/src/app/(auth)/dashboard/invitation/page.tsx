'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Link as LinkIcon, Users, Award, DollarSign, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';

// --- Components ---

const StatCard = ({ icon: Icon, title, value, description }: { icon: React.ElementType, title: string, value: string | number, description: string }) => (
    <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function InvitationPage() {
    const { toast } = useToast();
    const { user, loading: authLoading } = useUser();
    
    // Fetch real user profile from Firestore
    // Using `useDoc` hook we built earlier
    const { data: userProfile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : 'dummy');

    const isLoading = authLoading || (user && profileLoading);

    // Default values if data not yet loaded or fields missing
    const referralCode = userProfile?.invitationCode || 'LOADING...';
    const karma = userProfile?.karma || 0;
    const role = userProfile?.role || 'Initiate';
    const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/join?ref=${referralCode}` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "已複制 (Copied)",
            description: "傳道法旨已存入剪貼板。",
        });
    };

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                        功德簿 (Karma Ledger)
                        <Badge variant="outline" className="ml-2 border-amber-500/50 text-amber-500 text-xs">{role}</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1 font-mono text-sm">
                        接引有緣人，積累功德，升級您的靈魂權限。
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={DollarSign} title="當前功德 (Karma)" value={karma} description="可用於高級推演" />
                <StatCard icon={Users} title="已接引人數" value="0" description="尚無下線節點" />
                <StatCard icon={Award} title="靈魂等級" value="Lv.1" description="距離下一級還差 100 功德" />
            </div>

            <Card className="bg-card/50 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-400">
                        <LinkIcon className="w-5 h-5"/>
                        <span>您的專屬傳道法旨 (Referral Link)</span>
                    </CardTitle>
                    <CardDescription>分享此鏈接，接引新的意識節點進入矩陣。</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full flex-col md:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 font-mono text-xs">
                                LINK:
                            </div>
                            <Input 
                                type="text" 
                                value={referralLink} 
                                readOnly 
                                className="bg-black/50 border-white/10 pl-12 font-mono text-sm text-cyan-400" 
                            />
                        </div>
                        <Button onClick={copyToClipboard} className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-black font-bold">
                            <Copy className="mr-2 h-4 w-4" /> 複製法旨
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-card/30 border-white/5">
                <CardHeader>
                    <CardTitle>信徒名錄 (Disciples)</CardTitle>
                    <CardDescription>追蹤您的每一次“善緣”的狀態。</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                        <Users className="w-12 h-12 opacity-20" />
                        <p className="text-sm">暫無信徒。去傳播福音吧，架構師。</p>
                        <Button variant="outline" className="border-dashed border-white/10 text-xs">
                            如何獲取更多功德？
                        </Button>
                    </div>
                    {/* Placeholder Table for when data exists
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead>有緣人 (ID)</TableHead>
                                <TableHead>狀態</TableHead>
                                <TableHead>接引日期</TableHead>
                                <TableHead className="text-right">獲得功德</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             // Map your referral data here
                        </TableBody>
                    </Table>
                    */}
                </CardContent>
            </Card>
        </div>
    );
}
