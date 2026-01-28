'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Book, FileText } from 'lucide-react';
import { getUserRepos } from '@/app/actions/github-project';
import { useRouter } from 'next/navigation';

export default function KnowledgeBaseSetup() {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRepos = async () => {
            const res = await getUserRepos();
            if (res.success) {
                // Filter for "notion" or "sms" related repos
                const filtered = res.data.filter((r: any) => 
                    r.name.toLowerCase().includes('notion') || 
                    r.name.toLowerCase().includes('sms') ||
                    r.name.toLowerCase().includes('kb') // maybe kb for knowledge base?
                );
                setRepos(filtered.length > 0 ? filtered : res.data); // If no match, show all
            }
            setLoading(false);
        };
        fetchRepos();
    }, []);

    const handleSelectRepo = (repoName: string) => {
        // Redirect to the actual reader page with repo param
        router.push(`/dashboard/knowledge/reader?repo=${repoName}`);
    };

    if (loading) return <div className="p-10 flex justify-center text-white"><Loader2 className="animate-spin mr-2" /> Searching for Knowledge Base...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Book className="w-8 h-8 text-amber-500" />
                    知識庫源選擇 (Knowledge Source)
                </h1>
                <p className="text-gray-400 mt-2">
                    檢測到以下可能為“知識庫”的倉庫。請點擊確認以掛載為電子書。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo: any) => (
                    <Card 
                        key={repo.id} 
                        className="bg-white/5 border-white/10 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-white/10"
                        onClick={() => handleSelectRepo(repo.full_name)}
                    >
                        <CardHeader>
                            <CardTitle className="text-sm font-mono text-white truncate flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                {repo.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-gray-500 line-clamp-2">{repo.description || "No description provided."}</p>
                            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-widest">
                                <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                                <span className="text-amber-500 font-bold">MOUNT</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
