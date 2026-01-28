'use client';

import { useTranslations } from 'next-intl';
import VisaComparer from '@/components/visa-comparer';

export default function VisaComparisonPage() {
  const t = useTranslations('tools.visaComparison');
  
  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-primary">
          {t('title')}
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-foreground/80 max-w-3xl mx-auto font-mono">
          // {t('subtitle')}
        </p>
      </div>
      <VisaComparer />
    </div>
  );
}
