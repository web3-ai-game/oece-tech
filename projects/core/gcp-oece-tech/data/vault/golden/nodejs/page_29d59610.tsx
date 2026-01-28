'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n-provider';
import { LayoutDashboard, UserCircle, KeyRound, MessageSquare, Bot, BookOpen, Star, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useI18n();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc(userProfileRef);

  if (!user) {
    return null;
  }
  
  const userRole = userProfile?.role || 'free';
  const inviteCount = userProfile?.invites || 0;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            {t.dashboardTitle}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t.welcomeBack}, {user.displayName || user.email}</CardTitle>
            <CardDescription>{t.dashboardSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-card/50">
                  <UserCircle className="h-8 w-8 text-primary" />
                  <div>
                      <p className="text-sm text-muted-foreground">{t.membershipLevel}</p>
                      <p className="font-bold text-lg capitalize">{t[userRole as keyof typeof t] || userRole}</p>
                  </div>
              </div>
               <div className="flex items-center gap-4 p-4 border rounded-lg bg-card/50">
                  <KeyRound className="h-8 w-8 text-accent" />
                  <div>
                      <p className="text-sm text-muted-foreground">{t.invitesAvailable}</p>
                      <p className="font-bold text-lg">{inviteCount}</p>
                  </div>
              </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardActionCard
                icon={MessageSquare}
                title={t.bbsCardTitle}
                description={t.bbsEnterDescription}
                href="#"
                cta={t.bbsEnterCta}
            />
            <DashboardActionCard
                icon={Bot}
                title={t.aiToolsCollection}
                description={t.aiToolsEnterDescription}
                href="/ai-tools"
                cta={t.aiToolsEnterCta}
            />
            <DashboardActionCard
                icon={BookOpen}
                title={t.navArticles}
                description={t.articlesEnterDescription}
                href="/articles"
                cta={t.articlesEnterCta}
            />
        </div>

        {userRole !== 'pro' && (
          <Card className="lg:col-span-3 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-xl text-primary">{t.proUpgradeTitle}</CardTitle>
              </div>
              <CardDescription>{t.proUpgradeDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start gap-2"><Zap className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{t.proBenefit1}</span></li>
                <li className="flex items-start gap-2"><Bot className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{t.proBenefit2}</span></li>
                 <li className="flex items-start gap-2"><KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>{t.proBenefit3}</span></li>
              </ul>
              <Button className="w-full bg-primary/90 hover:bg-primary">
                {t.proCardCta}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DashboardActionCard({ icon: Icon, title, description, href, cta }: { icon: React.ElementType, title: string, description: string, href: string, cta: string }) {
  return (
    <Card className="hover:shadow-lg hover:border-accent/50 transition-all">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Icon className="w-8 h-8 text-accent" />
          <CardTitle className="font-headline text-accent">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 h-12">{description}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>{cta} <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </CardContent>
    </Card>
  )
}
