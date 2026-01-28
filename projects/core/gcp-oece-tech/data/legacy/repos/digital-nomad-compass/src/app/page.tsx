'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { articles } from '@/lib/data';
import ArticleCard from '@/components/article-card';
import { useI18n } from '@/lib/i18n-provider';
import type { Article } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Plane, Files, Scale, ShieldCheck, Cpu, Briefcase } from 'lucide-react';
import Image from 'next/image';
import ProCard from '@/app/common/pro-card';
import BbsCard from '@/app/common/bbs-card';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function Home() {
  const { t } = useI18n();

  const featuredArticles = useMemo(() => {
    return articles.slice(0, 4).map(article => ({
      ...article,
      title: t[`${article.slug}-title` as keyof typeof t] || '',
      excerpt: t[`${article.slug}-excerpt` as keyof typeof t] || '',
    }));
  }, [t]);

  const aiTools = [
    {
      icon: Plane,
      titleKey: 'plannerTitle',
      descriptionKey: 'plannerCardDescription',
      href: '/planner',
      ctaKey: 'planYourTrip',
    },
    {
      icon: Files,
      titleKey: 'visaToolTitle',
      descriptionKey: 'visaToolDescription',
      href: '/visa-comparison',
      ctaKey: 'compareVisas',
    },
    {
      icon: Scale,
      titleKey: 'costToolTitle',
      descriptionKey: 'costToolDescription',
      href: '/cost-of-living',
      ctaKey: 'compareCosts',
    },
    {
      icon: ShieldCheck,
      titleKey: 'securityAuditTitle',
      descriptionKey: 'securityAuditDescription',
      href: '/ai-tools',
      ctaKey: 'runAudit',
    },
    {
      icon: Cpu,
      titleKey: 'gearOptimizerTitle',
      descriptionKey: 'gearOptimizerDescription',
      href: '/ai-tools',
      ctaKey: 'optimizeGear',
    },
    {
      icon: Briefcase,
      titleKey: 'jobFinderTitle',
      descriptionKey: 'jobFinderDescription',
      href: '/ai-tools',
      ctaKey: 'findJobs',
    },
  ];
  
  const featuredTools = aiTools.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-16 md:space-y-24">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg shadow-primary/20">
            <Image
              src="https://picsum.photos/seed/cyberpunk-city/1600/900"
              alt="Cyberpunk cityscape"
              fill
              className="object-cover"
              data-ai-hint="cyberpunk city"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t.homeTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mt-4 max-w-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t.homeSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProCard />
            <BbsCard />
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{t.articleCollection}</h2>
                <Link href="/login" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <span>{t.moreHint} &gt;&gt;</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article as Article} />
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">{t.aiToolsCollection}</h2>
                <Link href="/login" className="flex items-center text-secondary hover:text-secondary/80 transition-colors">
                    <span>{t.moreHint} &gt;&gt;</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-left">
                {featuredTools.map((tool, index) => (
                    <Card key={index} className="flex flex-col border-secondary/30 hover:border-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                        <CardHeader className="flex-row items-start gap-4 pb-4">
                            <tool.icon className="w-8 h-8 text-secondary mt-1" />
                            <CardTitle className="font-headline text-xl text-secondary/90">{t[tool.titleKey as keyof typeof t]}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <p className="flex-grow text-muted-foreground">{t[tool.descriptionKey as keyof typeof t]}</p>
                            <Link href={tool.href} className="flex items-center text-sm font-semibold text-secondary group-hover:underline mt-4">
                              {t[tool.ctaKey as keyof typeof t]}
                              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
