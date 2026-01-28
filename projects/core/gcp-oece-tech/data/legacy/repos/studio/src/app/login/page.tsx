'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signUpWithInvite, signInWithPassword } from '@/lib/supabase/auth';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Sign in form validation
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Sign up form validation
const signUpSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  inviteCode: z.string().min(1, { message: 'Invite code is required' }),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // 登录表单
  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 注册表单
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      inviteCode: '',
    },
  });

  // 处理登录
  const handleSignIn = async (data: SignInValues) => {
    setIsLoading(true);
    try {
      await signInWithPassword(data.email, data.password);
      
      toast({
        title: '✅ Sign in successful',
        description: 'Welcome back, diver!',
      });
      
      // 使用router跳转
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: '❌ Sign in failed',
        description: error.message || 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleSignUp = async (data: SignUpValues) => {
    setIsLoading(true);
    try {
      await signUpWithInvite(
        data.email,
        data.password,
        data.inviteCode,
        data.username
      );
      toast({
        title: '✅ Account created',
        description: 'Please sign in to continue your dive',
      });
      setIsSignUp(false);
      signInForm.setValue('email', data.email);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Sign up failed',
        description: error.message || 'Please check your invite code',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-[80vh] py-12">
        <Card className="mx-auto max-w-sm w-full border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {isSignUp ? 'DIVE_DEEPER' : 'URBAN_DIVER'}
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {isSignUp
                ? '// Join the deep dive community · Invite code required'
                : '// Negotiate with physical distance and time'}
            </CardDescription>
          </CardHeader>
        <CardContent>
          {!isSignUp ? (
            // 登录表单
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(handleSignIn)}
                className="space-y-4"
              >
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="diver@urban.zone"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-mono" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'DIVING...' : 'SIGN_IN'}
                  </Button>
              </form>
            </Form>
          ) : (
            // 注册表单
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(handleSignUp)}
                className="space-y-4"
              >
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Urban Diver"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="diver@urban.zone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="min. 6 characters"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="inviteCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono">Invite Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="WELCOME2024"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-mono" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'DIVING...' : 'CREATE_ACCOUNT'}
                  </Button>
              </form>
            </Form>
          )}

            <div className="mt-4 text-center text-sm font-mono">
              {isSignUp ? (
                <>
                  Already a diver?{' '}
                  <Button
                    variant="link"
                    className="p-0 font-semibold font-mono"
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                  >
                    SIGN_IN
                  </Button>
                </>
              ) : (
                <>
                  New to diving?{' '}
                  <Button
                    variant="link"
                    className="p-0 font-semibold font-mono"
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                  >
                    CREATE_ACCOUNT
                  </Button>
                </>
              )}
            </div>

            {isSignUp && (
              <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
                <p>// No invite code?</p>
                <p className="mt-1">
                  Subscribe to{' '}
                  <span className="text-primary font-semibold">PRO ($5/mo)</span>{' '}
                  for instant access + invite codes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
