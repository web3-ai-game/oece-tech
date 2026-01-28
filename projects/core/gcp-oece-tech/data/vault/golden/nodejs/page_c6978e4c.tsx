'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBBSPosts } from '@/lib/supabase/bbs-hooks';
import { useUser } from '@/lib/supabase/hooks';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, Pin, Plus, Clock, User } from 'lucide-react';
import Link from 'next/link';

export default function BBSPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { posts, loading: postsLoading } = useBBSPosts();

  // Debug logging
  console.log('BBS render:', { authLoading, user: !!user, postsLoading });

  // Redirect if not logged in
  if (!authLoading && !user) {
    console.log('No user, redirecting to login');
    router.push('/login');
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">
                DATA_FORUM
              </h1>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                // Deep dive discussions
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/bbs/new')}
            className="gap-2 font-mono"
          >
            <Plus className="h-4 w-4" />
            NEW_POST
          </Button>
        </div>

        {/* Loading State */}
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground font-mono">LOADING_POSTS...</p>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-muted">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-mono mb-4">
                NO_POSTS_YET
              </p>
              <Button
                onClick={() => router.push('/bbs/new')}
                className="gap-2 font-mono"
              >
                <Plus className="h-4 w-4" />
                CREATE_FIRST_POST
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Posts List */
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className={`hover:border-accent/50 transition-all cursor-pointer ${
                  post.is_pinned
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-muted/30'
                }`}
                onClick={() => router.push(`/bbs/${post.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <CardTitle className="font-headline text-xl text-primary line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {post.content.substring(0, 150)}
                        {post.content.length > 150 && '...'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author?.display_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{post.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.reply_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
