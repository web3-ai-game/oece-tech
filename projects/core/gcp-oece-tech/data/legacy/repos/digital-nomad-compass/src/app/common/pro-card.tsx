'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Bot, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';

export default function ProCard() {
    const { t } = useI18n();
    return (
        <Card className="flex flex-col bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary">
                    <Zap className="w-6 h-6" />
                    {t.proCardTitle}
                </CardTitle>
                <CardDescription>{t.proCardSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4">
                <ul className="flex-grow space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>{t.proBenefit1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Bot className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>{t.proBenefit2}</span>
                    </li>
                </ul>
                <Button asChild className="w-full mt-4 bg-primary/90 hover:bg-primary">
                    <Link href="/login">{t.proCardCta}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
