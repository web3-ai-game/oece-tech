'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBBSPost, useBBSReplies, createBBSReply, deleteBBSPost, deleteBBSReply, togglePinPost, toggleFeaturePost } from '@/lib/supabase/bbs-hooks';
import { useUser, useUserProfile } from '@/lib/supabase/hooks';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, Clock, User, MessageSquare, Send, Loader2, Trash2, Pin, Sparkles, Crown, Hash, Globe, Plane, Briefcase, Code, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const replySchema = z.object({
  content: z.string().min(5, { message: 'Reply must be at least 5 characters' }).max(2000),
});

type ReplyValues = z.infer<typeof replySchema>;

export default function BBSPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  const { toast } = useToast();
  const { user } = useUser();
  const { profile } = useUserProfile(user?.id);
  const { post, loading: postLoading } = useBBSPost(postId);
  const { replies, loading: repliesLoading } = useBBSReplies(postId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isAdmin = profile?.role === 'admin';

  const form = useForm<ReplyValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: '',
    },
  });

  // 自适应textarea高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [form.watch('content')]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onSubmitReply = async (data: ReplyValues) => {
    setIsSubmitting(true);
    try {
      await createBBSReply(postId, data.content);
      form.reset();
      toast({
        title: '✅ Reply posted',
        description: 'Your reply has been published',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to post reply',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deleteBBSPost(postId);
      toast({
        title: '✅ Post deleted',
        description: 'Your post has been removed',
      });
      router.push('/bbs');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to delete post',
        description: error.message,
      });
      setIsDeleting(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteBBSReply(replyId, postId);
      toast({
        title: '✅ Reply deleted',
        description: 'Your reply has been removed',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to delete reply',
        description: error.message,
      });
    }
  };

  const handleTogglePin = async () => {
    if (!post) return;
    try {
      await togglePinPost(post.id, post.is_pinned);
      toast({
        title: post.is_pinned ? '📌 Post unpinned' : '📌 Post pinned',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message,
      });
    }
  };

  const handleToggleFeature = async () => {
    if (!post) return;
    try {
      await toggleFeaturePost(post.id, post.is_featured);
      toast({
        title: post.is_featured ? '⭐ Post unfeatured' : '⭐ Post featured',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message,
      });
    }
  };

  if (postLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground font-mono">LOADING_POST...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive/30">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground font-mono">POST_NOT_FOUND</p>
              <Button
                onClick={() => router.push('/bbs')}
                className="mt-4 font-mono"
              >
                BACK_TO_FORUM
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const isAuthor = user?.id === post.author_id;
  const isAuthorAdmin = post.author?.role === 'admin';
  const CategoryIcon = categoryIcons[post.category || 'general'] || Hash;
  const categoryColor = categoryColors[post.category || 'general'] || categoryColors.general;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/bbs')}
          className="mb-6 gap-2 font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK_TO_FORUM
        </Button>

        {/* Post Card */}
        <Card className={`mb-6 ${
          post.is_pinned ? 'border-accent/40 bg-accent/5' : ''
        } ${post.is_featured ? 'border-primary/40' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Badges Row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className={`font-mono text-xs ${categoryColor}`}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {categoryLabels[post.category || 'general']}
                  </Badge>
                  {post.is_pinned && (
                    <Badge variant="outline" className="font-mono text-xs bg-accent/20 text-accent border-accent/40">
                      <Pin className="h-3 w-3 mr-1" />
                      PINNED
                    </Badge>
                  )}
                  {post.is_featured && (
                    <Badge variant="outline" className="font-mono text-xs bg-primary/20 text-primary border-primary/40">
                      <Sparkles className="h-3 w-3 mr-1" />
                      FEATURED
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <CardTitle className="text-2xl md:text-3xl font-headline text-primary mb-4">
                  {post.title}
                </CardTitle>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="flex items-center gap-1">
                      {post.author?.display_name || 'Anonymous'}
                      {isAuthorAdmin && (
                        <Crown className="h-3.5 w-3.5 text-yellow-500" title="Admin" />
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{post.view_count} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.reply_count} replies</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTogglePin}
                      className="h-9 px-3"
                      title={post.is_pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className={`h-4 w-4 ${post.is_pinned ? 'text-accent' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleFeature}
                      className="h-9 px-3"
                      title={post.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Sparkles className={`h-4 w-4 ${post.is_featured ? 'text-primary' : ''}`} />
                    </Button>
                  </>
                )}
                {isAuthor && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2 font-mono"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        DELETE
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-headline">
                          Delete post?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-mono text-xs">
                          This action cannot be undone. All replies will also be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-mono">CANCEL</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeletePost}
                          className="bg-destructive hover:bg-destructive/90 font-mono"
                        >
                          DELETE
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card className="mb-6 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-accent">
              POST_REPLY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitReply)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          ref={textareaRef}
                          placeholder="Write your reply...\n\nSupports Markdown syntax"
                          className="min-h-[120px] max-h-[400px] font-mono text-sm resize-none overflow-y-auto"
                          {...field}
                          disabled={isSubmitting}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground font-mono">
                          {field.value.length}/2000 characters
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 font-mono"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        POSTING...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        REPLY
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Replies List */}
        <div className="space-y-4">
          <h2 className="text-xl font-headline text-primary font-bold mb-4">
            REPLIES ({replies.length})
          </h2>
          {repliesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : replies.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-mono text-sm">
                  NO_REPLIES_YET
                </p>
              </CardContent>
            </Card>
          ) : (
            replies.map((reply) => {
              const isReplyAuthor = user?.id === reply.author_id;
              return (
                <Card key={reply.id} className="border-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 font-mono">
                          <User className="h-4 w-4" />
                          <span className="flex items-center gap-1">
                            {reply.author?.display_name || 'Anonymous'}
                            {reply.author?.role === 'admin' && (
                              <Crown className="h-3.5 w-3.5 text-yellow-500" title="Admin" />
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDate(reply.created_at)}</span>
                        </div>
                      </div>
                      {isReplyAuthor && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-headline">
                                Delete reply?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-mono text-xs">
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-mono">CANCEL</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReply(reply.id)}
                                className="bg-destructive hover:bg-destructive/90 font-mono"
                              >
                                DELETE
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
