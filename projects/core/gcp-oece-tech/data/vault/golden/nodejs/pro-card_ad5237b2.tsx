'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Bot, Star } from 'lucide-react';

export default function ProCard() {
  const { locale } = useLocale();
  const t = translations[locale];
    return (
        <Card className="flex flex-col bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t.proMembership}</CardTitle>
                <CardDescription className="text-base">{t.proDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4">
                <ul className="flex-grow space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Unlimited AI tool access</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Bot className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Exclusive content & community</span>
                    </li>
                </ul>
                <Button asChild variant="default" className="w-full">
                  <Link href="/login">{t.upgradeToPro}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
