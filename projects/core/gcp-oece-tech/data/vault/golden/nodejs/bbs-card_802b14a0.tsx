'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';

export default function BbsCard() {
    const { t } = useI18n();
    return (
        <Card className="flex flex-col bg-card/80 backdrop-blur-sm border-border/30 hover:border-border/80 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl text-foreground/90">
                    <Users className="w-6 h-6 text-secondary" />
                    {t.bbsCardTitle}
                </CardTitle>
                <CardDescription>{t.bbsCardSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <p className="flex-grow text-sm text-muted-foreground">{t.bbsCardContent}</p>
                <Button asChild variant="secondary" className="w-full mt-4">
                    <Link href="/login">{t.bbsCardCta}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
