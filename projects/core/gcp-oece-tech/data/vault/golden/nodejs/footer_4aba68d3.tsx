'use client';

import Link from 'next/link';
import { Send, Facebook, Instagram } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';

export default function Footer() {
  const { t } = useI18n();

  const socialLinks = [
    { icon: Send, href: '#', name: 'Telegram' },
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
  ];

  const internalLinks = [
    { href: '/articles', name: t.navArticles },
    { href: '/ai-tools', name: t.navAiTools },
  ];
  
  const friendLinks = [
      { href: '#', name: 'Nomad List' },
      { href: '#', name: 'V2EX' },
      { href: '#', name: 'Indie Hackers' },
  ]

  return (
    <footer className="border-t border-border/40 bg-background/50 z-10 relative">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-headline text-lg text-primary">{t.connect}</h3>
          {socialLinks.map((link) => (
            <a key={link.name} href={link.href} className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-headline text-lg text-primary">{t.navigation}</h3>
          {internalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Friend Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-headline text-lg text-primary">{t.friendLinks}</h3>
           {friendLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
        </div>
        
        {/* Placeholder for future content, e.g. Login */}
        <div></div>

      </div>
      <div className="border-t border-border/40 py-4">
        <p className="text-center text-sm text-muted-foreground">
          {t.footerCopyright.replace('{year}', new Date().getFullYear().toString()).replace('DeepWeay.com', 'DeepWeay.me')}
        </p>
      </div>
    </footer>
  );
}
