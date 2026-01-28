'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import type { ArticleSlugs } from '@/lib/dictionaries';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const { t } = useI18n();

  const titleKey = `${article.slug}-title` as keyof typeof t;
  const excerptKey = `${article.slug}-excerpt` as keyof typeof t;
  const categoryKey = article.category as keyof typeof t;

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={article.image.hint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-3 flex flex-col h-full">
          <div className='flex justify-between items-center'>
            <Badge variant="default" className="bg-primary/80 text-primary-foreground">
              {t[categoryKey]}
            </Badge>
            <p className="text-sm text-muted-foreground">{article.date}</p>
          </div>
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
            {t[titleKey]}
          </CardTitle>
          <p className="text-muted-foreground flex-grow">{t[excerptKey]}</p>
          <div className="flex items-center text-sm font-semibold text-primary group-hover:underline">
            {t.readMore}
            <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
