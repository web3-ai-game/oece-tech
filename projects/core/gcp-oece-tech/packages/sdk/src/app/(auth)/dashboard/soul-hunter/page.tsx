'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
    GitBranch, 
    FileCode, 
    Folder, 
    Loader2, 
    Eye, 
    ShieldAlert, 
    Code2
} from 'lucide-react';
import { getUserRepos, getRepoTree, getFileContent } from '@/app/actions/github-project';
import { askTheUniverse } from '@/app/actions/fortune'; // Reuse AI logic
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Components ---

const RepoList = ({ onSelectRepo }: { onSelectRepo: (repo: any) => void }) => {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            const res = await getUserRepos();
            if (res.success) {
                setRepos(res.data);
            } else {
                setError(res.error || "Failed to load repositories.");
            }
            setLoading(false);
        };
        fetchRepos();
    }, []);

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
                {repos.map((repo: any) => (
                    <div 
                        key={repo.id} 
                        onClick={() => onSelectRepo(repo)}
                        className="p-3 rounded-lg border border-white/5 hover:border-primary/50 hover:bg-white/5 cursor-pointer transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-gray-200 group-hover:text-primary truncate">{repo.name}</h3>
                            {repo.private && <Badge variant="outline" className="text-[10px] border-red-500/50 text-red-400">PRIVATE</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{repo.description || "No description"}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> {repo.language || "Unknown"}</span>
                            <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

const FileTree = ({ repo, onSelectFile }: { repo: any, onSelectFile: (path: string) => void }) => {
    const [tree, setTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTree = async () => {
            setLoading(true);
            setError(null);
            const res = await getRepoTree(repo.owner.login, repo.name, repo.default_branch);
            if (res.success) {
                // Filter to show a manageable list (e.g. max 50 items) or just top level
                // For simplicity, showing all but cutting off if too large
                setTree(res.data.slice(0, 100)); 
            } else {
                setError(res.error || "Failed to load file tree.");
            }
            setLoading(false);
        };
        fetchTree();
    }, [repo]);

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <div className="p-4 text-xs text-red-400">{error}</div>;

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-1">
                {tree.map((item: any, i) => (
                    <div 
                        key={i} 
                        onClick={() => item.type === 'blob' && onSelectFile(item.path)}
                        className={`
                            flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer text-sm transition-colors
                            ${item.type === 'blob' ? 'text-gray-300' : 'text-blue-400 font-bold'}
                        `}
                    >
                        {item.type === 'blob' ? <FileCode className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                        <span className="truncate">{item.path}</span>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

const CodeViewer = ({ repo, filePath }: { repo: any, filePath: string }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [analyzing, startAnalyzing] = useTransition();

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setAiAnalysis('');
            const res = await getFileContent(repo.owner.login, repo.name, filePath);
            if (res.success) {
                setContent(res.data);
            } else {
                setContent("// Failed to load file content or file is too large.");
            }
            setLoading(false);
        };
        fetchContent();
    }, [repo, filePath]);

    const handleAnalyze = () => {
        startAnalyzing(async () => {
            const snippet = content.slice(0, 5000); 
            const query = `
                Analyze this code file: ${filePath}
                Language: ${repo.language}
                Code Snippet:
                \`\`\`
                ${snippet}
                \`\`\`
                Task:
                1. Identify potential bugs or security risks.
                2. Explain what this code does in "Cyberpunk" style.
                3. Rate the "Karma" (Quality) from 0-100.
            `;
            const res = await askTheUniverse(query);
            if (res.success) {
                setAiAnalysis(res.data);
            }
        });
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-mono text-primary flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> {filePath}
                </h3>
                <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="bg-purple-600 hover:bg-purple-500">
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 mr-1" />}
                    AI Audit
                </Button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden h-full">
                {/* Source Code */}
                <ScrollArea className="bg-black/50 border border-white/10 rounded-md p-4 font-mono text-xs text-gray-300 h-full">
                    <pre className="whitespace-pre-wrap break-all">{content}</pre>
                </ScrollArea>

                {/* AI Analysis */}
                {aiAnalysis && (
                    <ScrollArea className="bg-purple-900/10 border border-purple-500/30 rounded-md p-4 h-full">
                        <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> DEEPWAY AUDIT REPORT
                        </h4>
                        <div className="prose prose-invert prose-sm text-xs font-mono whitespace-pre-wrap">
                            {aiAnalysis}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

export default function GitHubProjectPage() {
    const [selectedRepo, setSelectedRepo] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    return (
        <div className="space-y-6 h-full pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                        <GitBranch className="w-8 h-8 text-primary" />
                        PROJECT FIRE // REPO INTEGRATION
                    </h1>
                    <p className="text-sm text-gray-400 font-mono mt-1">
                        Direct Link Established. Access Level: ADMIN.
                    </p>
                </div>
                {selectedRepo && (
                    <Button variant="outline" onClick={() => {setSelectedRepo(null); setSelectedFile(null);}}>
                        Switch Repo
                    </Button>
                )}
            </div>

            {!selectedRepo ? (
                <Card className="bg-card/30 border-white/10">
                    <CardHeader>
                        <CardTitle>Select a Repository</CardTitle>
                        <CardDescription>Choose a project to mount into the DeepWay File System.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RepoList onSelectRepo={setSelectedRepo} />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-12 gap-6 h-[700px]">
                    {/* File Explorer */}
                    <Card className="col-span-12 md:col-span-3 bg-card/30 border-white/10 h-full overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b border-white/5">
                            <CardTitle className="text-sm font-mono truncate">{selectedRepo.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 h-full">
                            <FileTree repo={selectedRepo} onSelectFile={setSelectedFile} />
                        </CardContent>
                    </Card>

                    {/* Editor / Viewer */}
                    <Card className="col-span-12 md:col-span-9 bg-card/30 border-white/10 h-full flex flex-col overflow-hidden">
                         <CardContent className="p-4 flex-1 h-full">
                            {selectedFile ? (
                                <CodeViewer repo={selectedRepo} filePath={selectedFile} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                    <Code2 className="w-16 h-16 opacity-20" />
                                    <p>Select a file to begin audit.</p>
                                </div>
                            )}
                         </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
