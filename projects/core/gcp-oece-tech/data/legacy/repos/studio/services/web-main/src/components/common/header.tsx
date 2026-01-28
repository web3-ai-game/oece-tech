'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { useUser } from '@/lib/supabase/hooks';
import { ThemeToggle } from './theme-toggle';
import { useSidebar } from '@/components/ui/sidebar';


export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const { user } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();
  const t = translations[locale];

  const navItems = [
    { href: '/', label: t.home },
    { href: '/articles', label: t.articles },
    { href: '/ai-tools', label: t.aiTools },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'zh-TW' : 'en');
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
         {user && isMobile && (
           <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setOpenMobile(true)}>
             <Menu />
           </Button>
         )}
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              DeepWeay
            </span>
          </Link>
        </div>

        {!user && (
            <nav className={cn("hidden md:flex items-center space-x-6 text-sm font-medium")}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'transition-colors hover:text-primary',
                      (pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href
                        ? 'text-primary font-bold'
                        : 'text-foreground/60'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>
        )}
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={toggleLocale} className="w-16 font-body">
            {locale === 'en' ? '繁' : 'Eng'}
          </Button>
          <ThemeToggle />
          {user ? (
              <Button asChild variant="ghost" className="relative h-8 w-8 rounded-full">
                <Link href="/dashboard">
                  <UserCircle className="h-8 w-8" />
                </Link>
              </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
