'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function BbsCard() {
  const { locale } = useLocale();
  const t = translations[locale];
    return (
        <Card className="flex flex-col bg-card/80 backdrop-blur-sm border-border/30 hover:border-border/80 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t.bbsCommunity}</CardTitle>
                <CardDescription className="text-base">{t.bbsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <p className="flex-grow text-sm text-muted-foreground">Connect with digital nomads worldwide</p>
                <Button asChild variant="secondary" className="w-full mt-4">
                    <Link href="/login">{t.exploreForum}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
