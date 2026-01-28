'use client';

import { useMemo } from 'react';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { articles } from '@/lib/data';
import ArticleCard from '@/components/article-card';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Article } from '@/lib/types';
import ProCard from '@/app/common/pro-card';
import BbsCard from '@/app/common/bbs-card';
import AiToolsCard from '@/app/common/ai-tools-card';
import { Plane, Files, Scale, Cpu, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const featuredArticles = useMemo(() => {
    return articles.slice(0, 4);
  }, []);

  const aiTools = [
    { icon: Plane, title: 'Trip Planner', description: 'AI-powered travel itinerary planning', href: '/planner', cta: 'Start Planning' },
    { icon: Files, title: 'Visa Assistant', description: 'Get visa application guidance', href: '/visa-assistant', cta: 'Get Assistance' },
    { icon: Scale, title: 'Visa Comparison', description: 'Compare visa requirements worldwide', href: '/visa-comparison', cta: 'Compare Visas' },
    { icon: ShieldCheck, title: 'Cost of Living', description: 'Analyze living costs across cities', href: '/cost-of-living', cta: 'Analyze Costs' },
    { icon: Cpu, title: 'AI Chatbot', description: 'Chat with AI travel assistant', href: '/chatbot', cta: 'Start Chat' },
    { icon: Briefcase, title: 'Remote Jobs', description: 'Find remote work opportunities', href: '/jobs', cta: 'Browse Jobs' },
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
                Deep Dive into Digital Nomad 2.0
              </h1>
              <p className="text-lg md:text-xl text-white/90 mt-4 max-w-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Negotiate with physical distance and time
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProCard />
            <BbsCard />
            <AiToolsCard />
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{t.articleCollection}</h2>
                <Link href="/login" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <span>{t.more} &gt;&gt;</span>
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
                  <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">AI Tools</h2>
                  <Link href="/login" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                      <span>More &gt;&gt;</span>
                  </Link>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-left">
                {aiTools.map((tool, index) => (
                    <Card key={index} className="flex flex-col border-secondary/30 hover:border-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                        <CardHeader className="flex-row items-start gap-4 pb-4">
                            <tool.icon className="w-8 h-8 text-secondary mt-1" />
                            <CardTitle className="font-headline text-xl text-secondary/90">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <p className="flex-grow text-muted-foreground">{tool.description}</p>
                            <Link href={tool.href} className="flex items-center text-sm font-semibold text-secondary group-hover:underline mt-4">
                              {tool.cta}
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
