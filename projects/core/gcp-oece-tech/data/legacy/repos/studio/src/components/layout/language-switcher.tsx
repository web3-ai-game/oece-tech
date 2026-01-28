'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentLocale(Cookies.get('NEXT_LOCALE') || 'en');
  }, []);

  const setLocale = (locale: string) => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
    setCurrentLocale(locale);
    window.location.reload();
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="font-mono">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-mono">
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          className={currentLocale === 'en' ? 'bg-accent' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('zh-TW')}
          className={currentLocale === 'zh-TW' ? 'bg-accent' : ''}
        >
          🇹🇼 繁體中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
