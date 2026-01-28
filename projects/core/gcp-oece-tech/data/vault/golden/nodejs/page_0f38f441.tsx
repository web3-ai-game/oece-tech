'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';

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
import { useI18n } from '@/lib/i18n-provider';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  inviteCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.02,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useI18n();
  const auth = getAuth();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      inviteCode: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        // --- Sign Up with Invite Code ---
        if (!data.inviteCode) {
            throw new Error(t.inviteCodeRequired);
        }
        const inviteRef = doc(firestore, 'invites', data.inviteCode);
        const inviteDoc = await getDoc(inviteRef);

        if (!inviteDoc.exists() || inviteDoc.data().isUsed) {
            throw new Error(t.inviteCodeInvalid);
        }

        // Create user in Auth
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Use a batch write to create user profile and update invite code atomically
        const batch = writeBatch(firestore);
        
        const userRef = doc(firestore, 'users', user.uid);
        batch.set(userRef, {
            email: user.email,
            role: 'free',
            invites: 2,
            createdAt: new Date(),
        });
        
        batch.update(inviteRef, {
            isUsed: true,
            usedBy: user.uid,
            usedAt: new Date(),
        });

        await batch.commit();
        
        toast({
          title: t.accountCreated,
          description: t.accountCreatedSuccess,
        });

      } else {
        // --- Sign In ---
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: t.signedIn,
          description: t.signedInSuccess,
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t.authFailed,
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user is new
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // New user via Google: create their profile document
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'free', // Grant free tier access by default
                invites: 2, // Give initial invites
                createdAt: new Date(),
            });
        }
        
        toast({
            title: t.signedIn,
            description: t.signedInSuccess,
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t.authFailed,
            description: error.message,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            {isSignUp ? t.createAccount : t.loginPageTitle}
          </CardTitle>
          <CardDescription>
            {isSignUp ? t.signUpSubtitle : t.loginPageSubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                {t.signInWithGoogle}
             </Button>
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{t.orContinueWith}</span>
                </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.email}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          disabled={isLoading || isGoogleLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.password}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading || isGoogleLoading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isSignUp && (
                    <FormField
                    control={form.control}
                    name="inviteCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.inviteCode}</FormLabel>
                        <FormControl>
                            <Input placeholder={t.inviteCodePlaceholder} {...field} disabled={isLoading || isGoogleLoading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp
                    ? isLoading
                      ? t.creatingAccount
                      : t.createAccount
                    : isLoading
                    ? t.signingIn
                    : t.signIn}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? t.switchToSignIn : t.switchToSignUp}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
