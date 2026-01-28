'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/supabase/hooks';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase/auth';

export default function TestDashboard() {
  const router = useRouter();
  const { user, loading } = useUser();

  console.log('TEST Dashboard:', { loading, user: user?.email });

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user, redirecting...');
      setTimeout(() => router.replace('/login'), 500);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-mono">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono">Redirecting to login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-2">✅ 登录成功！</h1>
          <p className="text-muted-foreground font-mono">Authentication Working</p>
        </div>
        
        <div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-lg space-y-3">
          <h2 className="font-bold text-lg mb-3">用户信息</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><span className="text-muted-foreground">User ID:</span> {user.id}</p>
            <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
            <p><span className="text-muted-foreground">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
            <p><span className="text-muted-foreground">Display Name:</span> {user.user_metadata?.display_name || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/dashboard')} 
            className="w-full h-12 text-base"
            size="lg"
          >
            🎯 进入完整 Dashboard
          </Button>
          <Button 
            onClick={() => router.push('/bbs')} 
            variant="outline" 
            className="w-full h-12 text-base"
            size="lg"
          >
            💬 访问 BBS 论坛
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="destructive" 
            className="w-full h-12 text-base"
            size="lg"
          >
            🚪 退出登录
          </Button>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm font-mono leading-relaxed">
            ℹ️ <strong>诊断说明：</strong><br/>
            如果你看到这个页面，说明登录功能<strong>完全正常</strong>！<br/>
            <br/>
            如果点击"进入完整 Dashboard"后还是转圈：<br/>
            → 说明是 Dashboard 内部的数据加载逻辑有问题<br/>
            → 可能是 profileLoading 或 invitesLoading 卡住了
          </p>
        </div>

        <div className="text-center">
          <a 
            href="/debug" 
            className="text-sm text-primary hover:underline font-mono"
          >
            → 返回 Debug 页面
          </a>
        </div>
      </div>
    </div>
  );
}
