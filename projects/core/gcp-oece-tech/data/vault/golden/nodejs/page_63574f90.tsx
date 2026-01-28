'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBBSPosts, togglePinPost, toggleFeaturePost } from '@/lib/supabase/bbs-hooks';
import { useUser, useUserProfile } from '@/lib/supabase/hooks';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Eye, Pin, Plus, User, Sparkles, Crown, Hash, Globe, Plane, Briefcase, Code, Users, Filter, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function BBSPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useUser();
  const { profile } = useUserProfile(user?.id);
  const { posts, loading: postsLoading } = useBBSPosts();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const isAdmin = profile?.role === 'admin';

  // Redirect if not logged in
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const categoryIcons: Record<string, any> = {
    general: Hash,
    city: Globe,
    visa: Plane,
    work: Briefcase,
    lifestyle: Sparkles,
    tech: Code,
    meetup: Users,
  };

  const categoryLabels: Record<string, string> = {
    all: 'All Categories',
    general: 'General',
    city: 'Cities & Travel',
    visa: 'Visa & Immigration',
    work: 'Remote Work',
    lifestyle: 'Lifestyle',
    tech: 'Tech & Tools',
    meetup: 'Meetups & Events',
  };

  const categoryColors: Record<string, string> = {
    general: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    city: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    visa: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    work: 'bg-green-500/10 text-green-400 border-green-500/20',
    lifestyle: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    tech: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    meetup: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  const filteredPosts = categoryFilter === 'all' 
    ? posts 
    : posts.filter(p => p.category === categoryFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleTogglePin = async (postId: string, isPinned: boolean) => {
    try {
      await togglePinPost(postId, !isPinned);
      toast({
        title: isPinned ? '📌 Post unpinned' : '📌 Post pinned',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message,
      });
    }
  };

  const handleToggleFeature = async (postId: string, isFeatured: boolean) => {
    try {
      await toggleFeaturePost(postId, !isFeatured);
      toast({
        title: isFeatured ? '⭐ Post unfeatured' : '⭐ Post featured',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message,
      });
    }
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
                // Deep dive discussions ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
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

        {/* Category Filter */}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[220px] font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([value, label]) => {
                const Icon = categoryIcons[value] || Filter;
                return (
                  <SelectItem key={value} value={value} className="font-mono">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground font-mono">LOADING_POSTS...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-muted">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-headline font-semibold mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                {categoryFilter === 'all' 
                  ? 'Be the first to start a discussion!' 
                  : `No posts in ${categoryLabels[categoryFilter]} category yet`}
              </p>
              <Button onClick={() => router.push('/bbs/new')} className="font-mono gap-2">
                <Plus className="h-4 w-4" />
                CREATE_FIRST_POST
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Posts List */
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const CategoryIcon = categoryIcons[post.category] || Hash;
              const categoryColor = categoryColors[post.category] || categoryColors.general;
              const isAuthorAdmin = post.author?.role === 'admin';
              
              return (
                <Card
                  key={post.id}
                  className={`group hover:border-primary/50 transition-all cursor-pointer ${
                    post.is_pinned ? 'border-accent/40 bg-accent/5' : ''
                  } ${post.is_featured ? 'border-primary/40' : ''}`}
                  onClick={() => router.push(`/bbs/${post.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {/* Category Badge */}
                          <Badge variant="outline" className={`font-mono text-xs ${categoryColor}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categoryLabels[post.category]}
                          </Badge>
                          
                          {/* Pinned Badge */}
                          {post.is_pinned && (
                            <Badge variant="outline" className="font-mono text-xs bg-accent/20 text-accent border-accent/40">
                              <Pin className="h-3 w-3 mr-1" />
                              PINNED
                            </Badge>
                          )}
                          
                          {/* Featured Badge */}
                          {post.is_featured && (
                            <Badge variant="outline" className="font-mono text-xs bg-primary/20 text-primary border-primary/40">
                              <Sparkles className="h-3 w-3 mr-1" />
                              FEATURED
                            </Badge>
                          )}
                          
                          {/* Hot Badge (>500 views) */}
                          {post.view_count > 500 && (
                            <Badge variant="outline" className="font-mono text-xs bg-orange-500/20 text-orange-400 border-orange-500/40">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              HOT
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span className="flex items-center gap-1">
                              {post.author?.display_name || 'Anonymous'}
                              {isAuthorAdmin && (
                                <Crown className="h-3 w-3 text-yellow-500" title="Admin" />
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            {post.view_count}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {post.reply_count}
                          </div>
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(post.id, post.is_pinned)}
                            className="h-8 px-2"
                            title={post.is_pinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className={`h-4 w-4 ${post.is_pinned ? 'text-accent' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeature(post.id, post.is_featured)}
                            className="h-8 px-2"
                            title={post.is_featured ? 'Unfeature' : 'Feature'}
                          >
                            <Sparkles className={`h-4 w-4 ${post.is_featured ? 'text-primary' : ''}`} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
