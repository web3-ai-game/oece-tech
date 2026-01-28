'use client';

import VisaComparer from '@/components/visa-comparer';
import { useI18n } from '@/lib/i18n-provider';

export default function VisaComparisonPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          {t.visaToolTitle}
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          {t.visaToolSubtitle}
        </p>
      </div>
      <VisaComparer />
    </div>
  );
}
