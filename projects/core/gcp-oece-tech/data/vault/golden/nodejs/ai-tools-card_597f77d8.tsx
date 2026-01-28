'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Zap } from 'lucide-react';

export default function AiToolsCard() {
  const { locale } = useLocale();
  const t = translations[locale];
    return (
        <Card className="flex flex-col bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t.aiToolsPreview}</CardTitle>
                <CardDescription className="text-base">{t.aiToolsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4">
                <ul className="flex-grow space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                        <span>Trip planning with AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                        <span>Visa comparison & guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Bot className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                        <span>Cost of living analysis</span>
                    </li>
                </ul>
                <Link href="/ai-tools">
                    <Button variant="outline" className="w-full">Explore AI Tools</Button>
                </Link>
            </CardContent>
        </Card>
    );
}
