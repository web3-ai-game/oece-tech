'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export function AppHeader() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/articles', label: t('articles') },
    { href: '/bbs', label: t('forum') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-headline font-bold text-primary">
            DeepWeay
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-primary font-mono ${
              isActive('/dashboard') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            DASHBOARD
          </Link>
          <Link
            href="/articles"
            className={`transition-colors hover:text-primary font-mono ${
              isActive('/articles') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            ARTICLES
          </Link>
          <Link
            href="/bbs"
            className={`transition-colors hover:text-primary font-mono ${
              isActive('/bbs') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            FORUM
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-lg font-mono hover:text-primary"
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/articles"
                  onClick={() => setOpen(false)}
                  className="text-lg font-mono hover:text-primary"
                >
                  ARTICLES
                </Link>
                <Link
                  href="/bbs"
                  onClick={() => setOpen(false)}
                  className="text-lg font-mono hover:text-primary"
                >
                  FORUM
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
