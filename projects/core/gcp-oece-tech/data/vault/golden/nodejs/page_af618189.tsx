'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useUserProfile, useUserInvites } from '@/lib/supabase/hooks';
import { signOut, generateInviteCode } from '@/lib/supabase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UserCircle, KeyRound, MessageSquare, Bot, BookOpen, Star, Zap, ArrowRight, Copy, LogOut, Plus, Check, Sparkles, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading } = useUserProfile(user?.id);
  const { invites, loading: invitesLoading } = useUserInvites(user?.id);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // Debug logging
  console.log('Dashboard render:', { authLoading, user: !!user, profileLoading, profile: !!profile });

  // 未登录跳转（延迟判断避免循环）
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No user detected, will redirect to login in 500ms');
      const timer = setTimeout(() => {
        console.log('Redirecting to login...');
        router.replace('/login');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [authLoading, user, router]);

  // Loading state - 只在 auth 加载时显示，profile 可以异步加载
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-mono">LOADING_AUTH...</p>
        </div>
      </div>
    );
  }

  // 如果没有用户，等待重定向
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground font-mono">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const userRole = profile?.role || 'free';
  const invitesRemaining = profile?.invites_remaining ?? 0;
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Diver';
  
  // Profile 加载中时显示占位符
  const isProfileReady = !profileLoading && profile;

  // 生成新邀请码
  const handleGenerateInvite = async () => {
    if (!user || invitesRemaining <= 0) return;
    
    setIsGenerating(true);
    try {
      const code = await generateInviteCode(user.id);
      toast({
        title: '✅ 邀请码已生成',
        description: `新邀请码：${code}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ 生成失败',
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 复制邀请码
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: '📋 已复制',
        description: `邀请码 ${code} 已复制到剪贴板`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '❌ 复制失败',
        description: '请手动复制邀请码',
      });
    }
  };

  // 退出登录
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ 退出失败',
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">
              CONTROL_PANEL
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              // {displayName} @ {userRole.toUpperCase()}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="gap-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-mono">EXIT</span>
        </Button>
      </div>

      {/* 用户信息 + 站点简介 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户资料卡片 */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              USER_PROFILE
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono">MEMBERSHIP</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-bold font-mono text-lg uppercase">{userRole}</p>
                    {userRole === 'pro' && (
                      <Badge variant="default" className="bg-primary text-xs font-mono">
                        ⚡ PRO
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-accent/20 rounded-lg bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded">
                  <KeyRound className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono">INVITES_AVAILABLE</p>
                  <p className="font-bold font-mono text-lg">{invitesRemaining}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 站点简介卡片 */}
        <Card className="border-accent/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              ABOUT_COMPASS
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              用物理距离和时间谈判
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-mono">▸</span>
                <span>邀请制注册社区，确保高质量交流</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-mono">▸</span>
                <span>分享数字游民生活、远程工作经验</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-mono">▸</span>
                <span>探索地理套利与时间管理策略</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-mono">▸</span>
                <span>PRO会员享受AI工具和专属频道</span>
              </p>
            </div>
            {userRole !== 'pro' && (
              <Button 
                className="w-full bg-accent/90 hover:bg-accent font-mono mt-4"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                UPGRADE_TO_PRO
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 邀请码管理 */}
      <Card className="border-accent/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-accent" />
                INVITE_CODES
              </CardTitle>
              <CardDescription className="font-mono text-xs mt-1">
                // 每个邀请码可供一人注册使用
              </CardDescription>
            </div>
            <Button
              onClick={handleGenerateInvite}
              disabled={isGenerating || invitesRemaining <= 0}
              size="sm"
              className="gap-2 font-mono"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  GENERATING...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  GENERATE_CODE
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invitesLoading ? (
            <div className="text-center py-12 text-muted-foreground font-mono">
              <div className="animate-pulse">LOADING_INVITES...</div>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-muted rounded-lg">
              <KeyRound className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-mono text-sm">
                NO_CODES_FOUND
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                点击上方按钮生成新邀请码
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {invites.map((invite) => (
                <div
                  key={invite.code}
                  className={`p-4 rounded-lg border transition-all ${
                    invite.is_used
                      ? 'bg-muted/30 border-muted/50'
                      : 'bg-accent/5 border-accent/30 hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-lg font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                      {invite.code}
                    </code>
                    {!invite.is_used && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyCode(invite.code)}
                        className="h-8 w-8 hover:bg-accent/20"
                      >
                        {copiedCode === invite.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={invite.is_used ? 'text-amber-500' : 'text-green-500'}>
                      {invite.is_used ? '● USED' : '● ACTIVE'}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(invite.created_at).toLocaleDateString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardActionCard
          icon={MessageSquare}
          title="BBS_FORUM"
          description="与数字游民社区交流经验"
          href="/bbs"
          cta="ENTER"
          color="primary"
        />
        <DashboardActionCard
          icon={Bot}
          title="AI_TOOLS"
          description="探索强大的AI工具集合"
          href="/ai-tools"
          cta="EXPLORE"
          color="accent"
          isPro={userRole === 'pro'}
        />
        <DashboardActionCard
          icon={BookOpen}
          title="ARTICLES"
          description="阅读数字游民指南文章"
          href="/articles"
          cta="READ"
          color="primary"
        />
      </div>

      {/* PRO 升级卡片 */}
      {userRole !== 'pro' && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-xl text-primary">
                  UPGRADE_TO_PRO
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  // 解锁全部功能，享受专属权益
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start gap-2 p-3 bg-card/50 rounded-lg border border-primary/20">
                <Zap className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-sm font-bold">AI_TOOLS</p>
                  <p className="text-xs text-muted-foreground">访问所有PRO专属工具</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-card/50 rounded-lg border border-primary/20">
                <Bot className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-sm font-bold">TELEGRAM_BOT</p>
                  <p className="text-xs text-muted-foreground">专属频道+AI助手</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-card/50 rounded-lg border border-primary/20">
                <KeyRound className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-sm font-bold">EXTRA_INVITES</p>
                  <p className="text-xs text-muted-foreground">额外赠送邀请码</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-card/50 rounded-lg border border-primary/20">
                <Star className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-sm font-bold">PRO_CONTENT</p>
                  <p className="text-xs text-muted-foreground">专属内容和指南</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-primary/90 hover:bg-primary font-mono text-base h-12">
              <Sparkles className="mr-2 h-5 w-5" />
              SUBSCRIBE_NOW - $5/MONTH
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DashboardActionCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
  color = 'primary',
  isPro = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
  color?: 'primary' | 'accent';
  isPro?: boolean;
}) {
  const colorClasses = {
    primary: 'border-primary/20 hover:border-primary/50 bg-primary/5',
    accent: 'border-accent/20 hover:border-accent/50 bg-accent/5',
  };

  const iconColor = color === 'primary' ? 'text-primary' : 'text-accent';

  return (
    <Card className={`${colorClasses[color]} backdrop-blur transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          {isPro && (
            <Badge variant="default" className="bg-primary text-xs font-mono">
              ⚡ PRO
            </Badge>
          )}
        </div>
        <CardTitle className={`font-headline ${iconColor} text-lg`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 min-h-[40px]">
          {description}
        </p>
        <Button asChild variant="outline" className="w-full font-mono border-current">
          <Link href={href}>
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
