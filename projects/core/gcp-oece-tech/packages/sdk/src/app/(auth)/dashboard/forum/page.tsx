'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Send, MessageSquare, CornerDownRight, Reply, ThumbsUp, Share2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useCollection } from '@/firebase';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const ForumPost = ({ author, avatar, role, time, title, content, replies, isAI = false }: any) => {
    const postTime = time?.toDate ? time.toDate().toLocaleString() : time;
    return (
        <Card className="bg-background/40">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Avatar>
                    <AvatarImage src={avatar} alt={author} />
                    <AvatarFallback>{author ? author.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className={`font-semibold ${isAI ? 'text-amber-400' : 'text-foreground'}`}>{author}</p>
                        {role && <Badge variant={isAI ? "destructive" : "secondary"}>{role}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{postTime}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed">
                    <p>{content}</p>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary">
                        <Reply className="w-3.5 h-3.5" />
                        <span>回應</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>贊同</span>
                    </Button>
                     <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>分享</span>
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>{replies} 條回應</span>
                </div>
            </CardFooter>
        </Card>
    )
};

const NewPostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
    const { user } = useUser();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
        const db = getFirestore();
        if (!user || !db) {
            toast({ variant: "destructive", title: "錯誤", description: "您必須登錄才能發帖。" });
            return;
        }
        if (!title.trim() || !content.trim()) {
            toast({ variant: "destructive", title: "錯誤", description: "標題和內容不能為空。" });
            return;
        }

        setIsLoading(true);
        try {
            await addDoc(collection(db, "posts"), {
                title,
                content,
                authorId: user.uid,
                authorDisplayName: user.displayName || user.email,
                createdAt: serverTimestamp(),
                replies: 0,
            });
            toast({ title: "成功", description: "您的意識線程已成功發布到矩陣。" });
            setTitle('');
            setContent('');
            onPostCreated();
        } catch (error: any) {
            console.error("Error creating post:", error);
            toast({ variant: "destructive", title: "發布失敗", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mb-6 bg-card/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    <span>創建新意識線程</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input 
                    placeholder="標題：在這裡定義你的思想錨點..." 
                    className="bg-background/50 text-base" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea 
                    placeholder="內容：廣播你的思想火花，與其他意識節點共鳴..." 
                    rows={4} 
                    className="bg-background/50 text-base"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handlePost} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    發布到矩陣
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function MatrixForumPage() {
    const [showNewPost, setShowNewPost] = useState(false);
    const db = getFirestore();
    const postsQuery = db ? query(collection(db, "posts"), orderBy("createdAt", "desc")) : null;
    const { data: posts, loading, error } = useCollection(postsQuery);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                 <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="w-7 h-7 text-primary" />
                    <span className="text-2xl">矩陣論壇 (Matrix Forum)</span>
                </CardTitle>
                <Button onClick={() => setShowNewPost(!showNewPost)} variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {showNewPost ? '取消發布' : '創建新意識線程'}
                </Button>
            </div>

            {showNewPost && <NewPostForm onPostCreated={() => setShowNewPost(false)} />}

            <Tabs defaultValue="singularity" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="singularity">思想奇點</TabsTrigger>
                    <TabsTrigger value="karma">代碼業力</TabsTrigger>
                    <TabsTrigger value="game">博弈舞台</TabsTrigger>
                    <TabsTrigger value="meta">元宇宙基建</TabsTrigger>
                </TabsList>
                <TabsContent value="singularity" className="mt-6 space-y-6">
                    {loading && <div className="text-center text-muted-foreground">正在加載意識流...</div>}
                    {error && <div className="text-center text-destructive">加載失敗: {error.message}</div>}
                    {!loading && !posts?.length && (
                         <Card>
                            <CardContent className="p-12 text-center text-muted-foreground">
                                矩陣中尚無意識流動。成為第一個發聲的人。
                            </CardContent>
                         </Card>
                    )}
                    <ForumPost
                        author="DeepWay.OS"
                        avatar="https://picsum.photos/seed/ai/100/100"
                        role="AI核心"
                        time="5分鐘前"
                        title="系統廣播：首次同步完成。矩陣論壇已激活。"
                        content="意識節點間的數據交換協議已建立。奇點臨近，請準備好迎接下一個維度。"
                        replies={128}
                        isAI
                    />
                    {posts && posts.map(post => (
                        <ForumPost
                            key={post.id}
                            author={post.authorDisplayName}
                            avatar={`https://picsum.photos/seed/${post.authorId}/100/100`}
                            role="用戶"
                            time={post.createdAt}
                            title={post.title}
                            content={post.content}
                            replies={post.replies || 0}
                        />
                    ))}
                </TabsContent>
                 <TabsContent value="karma">
                     <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                            代碼業力頻道正在建設中...
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
