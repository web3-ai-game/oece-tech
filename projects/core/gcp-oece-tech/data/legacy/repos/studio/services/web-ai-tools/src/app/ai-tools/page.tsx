'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Plane, Files, Scale, ShieldCheck, Cpu, Briefcase, Bot, Code, Globe } from 'lucide-react';
import type { AiTool } from '@/lib/types';

export default function AiToolsPage() {

  const allTools: AiTool[] = [
    {
      icon: Plane,
      title: 'Trip Planner',
      description: 'AI-powered travel planning',
      href: '/planner',
      cta: 'Plan Your Trip',
      category: 'Travel Cost',
      isPro: false,
    },
    {
      icon: Files,
      title: 'Visa Comparison',
      description: 'Compare visa requirements',
      href: '/visa-comparison',
      cta: 'Compare Visas',
      category: 'Digital Nomad Security and Remote Work',
      isPro: false,
    },
    {
      icon: Scale,
      title: 'Cost of Living',
      description: 'Compare living costs',
      href: '/cost-of-living',
      cta: 'Compare Costs',
      category: 'Travel Cost',
      isPro: false,
    },
    {
      icon: ShieldCheck,
      titleKey: 'securityAuditTitle',
      descriptionKey: 'securityAuditDescription',
      href: '#',
      ctaKey: 'runAudit',
      category: 'Digital Nomad Security and Remote Work',
      isPro: true,
    },
    {
      icon: Cpu,
      titleKey: 'gearOptimizerTitle',
      descriptionKey: 'gearOptimizerDescription',
      href: '#',
      ctaKey: 'optimizeGear',
      category: 'Digital Nomad Security and Remote Work',
      isPro: true,
    },
    {
      icon: Briefcase,
      titleKey: 'jobFinderTitle',
      descriptionKey: 'jobFinderDescription',
      href: '#',
      ctaKey: 'findJobs',
      category: 'Digital Nomad Security and Remote Work',
      isPro: true,
    },
     {
      icon: Bot,
      titleKey: 'assistantTitle',
      descriptionKey: 'assistantDescription',
      href: '#',
      ctaKey: 'launchAssistant',
      category: 'Digital Nomad Security and Remote Work',
      isPro: true,
    },
     {
      icon: Code,
      titleKey: 'codeHelperTitle',
      descriptionKey: 'codeHelperDescription',
      href: '#',
      ctaKey: 'startCoding',
      category: 'Digital Nomad Security and Remote Work',
      isPro: true,
    },
    {
      icon: Globe,
      titleKey: 'languageTutorTitle',
      descriptionKey: 'languageTutorDescription',
      href: '#',
      ctaKey: 'startLearning',
      category: 'Travel Cost',
      isPro: true,
    },
  ];


  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4">
            <Cpu className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary">
                AI TOOLS
            </h1>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTools.map((tool, index) => (
                <Card key={index} className={`flex flex-col border-secondary/30 hover:border-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 ${tool.isPro ? 'opacity-60 hover:opacity-100' : ''}`}>
                    <CardHeader className="flex-row items-start gap-4 pb-4">
                        <tool.icon className="w-8 h-8 text-secondary mt-1" />
                        <div className="flex-1">
                            <CardTitle className="font-headline text-xl text-secondary/90">{tool.title}</CardTitle>
                             {tool.isPro && <span className="text-xs font-bold text-primary tracking-widest uppercase">PRO</span>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <p className="flex-grow text-muted-foreground">{tool.description}</p>
                        <Link href={tool.href} className={`flex items-center text-sm font-semibold text-secondary group-hover:underline mt-4 ${tool.isPro ? 'pointer-events-none' : ''}`}>
                            {tool.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
  );
}
