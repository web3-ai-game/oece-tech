'use client';

import AiPlanner from '@/components/ai-planner';
import { useI18n } from '@/lib/i18n-provider';

export default function PlannerPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          {t.plannerTitle}
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          {t.plannerSubtitle}
        </p>
      </div>
      <AiPlanner />
    </div>
  );
}
