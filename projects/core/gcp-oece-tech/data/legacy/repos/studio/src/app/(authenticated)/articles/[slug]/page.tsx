'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { articles } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const content = article.slug;


  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-headline font-bold mt-8 mb-4">{paragraph.substring(3)}</h2>
      }
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc">{paragraph.substring(2)}</li>
      }
      return <p key={index} className="leading-relaxed my-4">{paragraph}</p>
    })
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/articles" passHref>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <header className="space-y-4 mb-8">
        <Badge variant="default" className="w-fit">
          {article.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          {article.slug}
        </h1>
        <div className="text-muted-foreground">
          <span>By {article.author}</span> | <span>{article.date}</span>
        </div>
      </header>

      <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          className="object-cover"
          data-ai-hint={article.image.hint}
        />
      </div>

      <div className="prose prose-invert max-w-none text-foreground/90 text-lg">
        {renderContent(content)}
      </div>
    </article>
  );
}
