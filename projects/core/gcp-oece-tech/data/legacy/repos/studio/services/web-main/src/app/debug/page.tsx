'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check auth session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', sessionData, sessionError);

      // 2. Check auth user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('User:', userData, userError);

      setAuthState({
        session: sessionData.session,
        user: userData.user,
        sessionError,
        userError,
      });

      // 3. If user exists, check profile
      if (userData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        console.log('Profile:', profile, profileError);
        setUserProfile({ profile, profileError });
      }
    } catch (err: any) {
      console.error('Debug error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: '123@123.com',
        password: '123123',
      });
      console.log('Login result:', data, error);
      if (error) throw error;
      alert('Login successful! Refreshing...');
      await checkAuth();
    } catch (err: any) {
      alert('Login failed: ' + err.message);
    }
  };

  const testLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log('Logged out');
      alert('Logged out! Refreshing...');
      await checkAuth();
    } catch (err: any) {
      alert('Logout failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading debug info...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">🔍 Authentication Debug</h1>

      <div className="flex gap-4">
        <Button onClick={checkAuth}>Refresh</Button>
        <Button onClick={testLogin} variant="outline">
          Test Login (123@123.com)
        </Button>
        <Button onClick={testLogout} variant="destructive">
          Test Logout
        </Button>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm">{error}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Auth State</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>User Profile (public.users)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs">
            {JSON.stringify(
              {
                SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                HAS_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
