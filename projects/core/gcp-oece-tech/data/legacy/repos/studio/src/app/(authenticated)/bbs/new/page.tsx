'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBBSPost } from '@/lib/supabase/bbs-hooks';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Send, Eye, Code, Hash, Globe, Briefcase, Plane, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

const postSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(150),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }).max(10000),
  category: z.enum(['general', 'city', 'visa', 'work', 'lifestyle', 'tech', 'meetup']).default('general'),
});

type PostValues = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
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

  const onSubmit = async (data: PostValues) => {
    setIsSubmitting(true);
    try {
      const post = await createBBSPost(data.title, data.content, data.category);
      toast({
        title: '✅ Post created',
        description: 'Your post has been published',
      });
      router.push(`/bbs/${post.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to create post',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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

        {/* Form Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              CREATE_NEW_POST
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              // Share your thoughts with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's on your mind?"
                          {...field}
                          disabled={isSubmitting}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => {
                            const Icon = categoryIcons[value];
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
                      <FormDescription className="text-xs font-mono">
                        Help others find your post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-mono">Content</FormLabel>
                        <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="w-auto">
                          <TabsList className="h-8">
                            <TabsTrigger value="edit" className="text-xs font-mono">Edit</TabsTrigger>
                            <TabsTrigger value="preview" className="text-xs font-mono">Preview</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <FormControl>
                        {previewMode === 'edit' ? (
                          <Textarea
                            ref={textareaRef}
                            placeholder="Write your post content here...\n\nSupports Markdown:\n- **bold** for bold text\n- *italic* for italic\n- # Heading for headers\n- [link](url) for links\n- > quote for quotes"
                            className="min-h-[400px] max-h-[600px] font-mono text-sm resize-none overflow-y-auto"
                            {...field}
                            disabled={isSubmitting}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = `${target.scrollHeight}px`;
                            }}
                          />
                        ) : (
                          <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 border rounded-md bg-muted/30">
                            <div className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm">
                              {field.value || <span className="text-muted-foreground">Nothing to preview yet...</span>}
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground font-mono">
                          {field.value.length}/10000 characters
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/bbs')}
                    disabled={isSubmitting}
                    className="font-mono"
                  >
                    CANCEL
                  </Button>
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
                        PUBLISH
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
