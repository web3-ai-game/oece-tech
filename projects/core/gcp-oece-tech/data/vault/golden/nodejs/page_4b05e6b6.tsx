'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBBSPost } from '@/lib/supabase/bbs-hooks';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

const postSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }).max(5000),
});

type PostValues = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data: PostValues) => {
    setIsSubmitting(true);
    try {
      const post = await createBBSPost(data.title, data.content);
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your post content here..."
                          className="min-h-[300px] font-mono text-sm"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground font-mono">
                          {field.value.length}/5000
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
