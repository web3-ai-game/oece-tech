'use client';

import { useMemo } from 'react';
import { articles } from '@/lib/data';
import ArticleCard from '@/components/article-card';
import type { Article } from '@/lib/types';
import { BookOpen } from 'lucide-react';

export default function ArticlesPage() {
  const allArticles = useMemo(() => {
    return articles;
  }, []);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            ARTICLES
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allArticles.map((article) => (
          <ArticleCard key={article.slug} article={article as Article} />
        ))}
      </div>
    </div>
  );
}
