'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Twitter } from 'lucide-react';

export function AppFooter() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-headline font-bold text-primary">DeepWeay</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {t('tagline')}
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://github.com/web3-ai-game"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/deepweay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-mono text-accent">{t('tools')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/visa-comparison" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('visaComparison')}
                </Link>
              </li>
              <li>
                <Link href="/cost-of-living" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('costOfLiving')}
                </Link>
              </li>
              <li>
                <Link href="/planner" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('tripPlanner')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-mono text-accent">{t('community')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/bbs" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('forum')}
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('articles')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('telegram')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold font-mono text-accent">{t('resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            {t('copyright')} | {t('slogan')}
          </p>
        </div>
      </div>
    </footer>
  );
}
