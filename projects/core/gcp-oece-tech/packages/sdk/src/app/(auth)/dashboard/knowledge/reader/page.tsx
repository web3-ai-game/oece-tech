'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    BookOpen, 
    ChevronRight, 
    FileText, 
    Loader2, 
    Menu, 
    Sparkles,
    MessageSquareQuote
} from 'lucide-react';
import { getRepoTree, getFileContent } from '@/app/actions/github-project';
import { askTheUniverse } from '@/app/actions/fortune';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function KnowledgeReaderPage() {
    const searchParams = useSearchParams();
    const repoFullName = searchParams.get('repo'); // e.g., "username/notion-sms-kb"

    const [tree, setTree] = useState<any[]>([]);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [loadingTree, setLoadingTree] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    
    // AI Interaction
    const [aiInsight, setAiInsight] = useState('');
    const [isThinking, startThinking] = useTransition();

    useEffect(() => {
        if (!repoFullName) return;
        const [owner, repo] = repoFullName.split('/');
        
        const init = async () => {
            setLoadingTree(true);
            const res = await getRepoTree(owner, repo, 'main'); // Default to main
            if (res.success) {
                // Filter only .md files for the knowledge base
                const mdFiles = res.data.filter((f: any) => f.path.endsWith('.md'));
                setTree(mdFiles);
                if (mdFiles.length > 0) {
                    loadFile(owner, repo, mdFiles[0].path); // Load first file
                }
            }
            setLoadingTree(false);
        };
        init();
    }, [repoFullName]);

    const loadFile = async (owner: string, repo: string, path: string) => {
        setCurrentFile(path);
        setLoadingContent(true);
        setAiInsight(''); // Clear previous insight
        const res = await getFileContent(owner, repo, path);
        if (res.success) {
            setContent(res.data);
        } else {
            setContent('# Error Loading File\nUnable to fetch content from the Void.');
        }
        setLoadingContent(false);
    };

    const handleAskAI = () => {
        if (!content) return;
        startThinking(async () => {
            const query = `
                Context: User is reading a knowledge base file: "${currentFile}".
                Content snippet (first 2000 chars):
                ${content.slice(0, 2000)}...

                Task: Give a "DeepWay" philosophical summary of this document.
                Style: Cyber-Mystic.
            `;
            const res = await askTheUniverse(query);
            if (res.success) {
                setAiInsight(res.data);
            }
        });
    };

    if (!repoFullName) return <div className="p-10 text-center text-gray-500">No Knowledge Base Selected.</div>;

    const Sidebar = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10 bg-black/20">
                <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    {repoFullName.split('/')[1]}
                </h2>
            </div>
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                    {tree.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                const [owner, repo] = repoFullName.split('/');
                                loadFile(owner, repo, item.path);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-md truncate transition-colors flex items-center gap-2
                                ${currentFile === item.path 
                                    ? 'bg-amber-500/10 text-amber-500 font-medium' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            {item.path}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-100px)] border border-white/10 rounded-xl overflow-hidden bg-[#050508]">
            {/* Desktop Sidebar */}
            <div className="w-64 border-r border-white/10 bg-[#0a0a0a] hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden absolute top-4 left-4 z-20">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-black/50 border-white/10">
                            <Menu className="w-4 h-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 bg-[#0a0a0a] border-r border-white/10">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* AI Insight Banner */}
                {aiInsight && (
                    <div className="bg-purple-900/20 border-b border-purple-500/30 p-4 text-xs font-mono text-purple-200">
                        <div className="flex items-center gap-2 mb-1 font-bold text-purple-400">
                            <Sparkles className="w-3 h-3" /> DEEPWAY INSIGHT
                        </div>
                        {aiInsight}
                    </div>
                )}

                {/* Markdown Reader */}
                <ScrollArea className="flex-1 p-6 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        {loadingContent ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                                <p className="text-xs tracking-widest uppercase">Decyphering Runes...</p>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-amber max-w-none prose-headings:font-serif-display prose-p:leading-loose prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                                <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/10">
                                    <h1 className="text-3xl font-bold text-white mb-0">{currentFile?.split('/').pop()}</h1>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="gap-2 text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                                        onClick={handleAskAI}
                                        disabled={isThinking}
                                    >
                                        {isThinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquareQuote className="w-3 h-3" />}
                                        解讀真意
                                    </Button>
                                </div>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
