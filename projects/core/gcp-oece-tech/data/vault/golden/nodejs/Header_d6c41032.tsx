'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, User, CreditCard, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslation();

  // Mock user data - replace with actual auth state
  const user = null;

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.tools, href: '/tools-showcase' },
    { name: t.nav.pricing, href: '/pricing' },
    { name: t.nav.about, href: '/about' },
  ];

  const tools = [
    {
      title: t.tools.imageGeneration,
      href: '/tools/image',
      description: t.tools.imageDesc,
    },
    {
      title: t.tools.videoGeneration,
      href: '/tools/video',
      description: t.tools.videoDesc,
    },
    {
      title: t.tools.contentWriting,
      href: '/tools/content',
      description: t.tools.contentDesc,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">OECE</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                {item.name === 'Tools' ? (
                  <>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        {tools.map((tool) => (
                          <li key={tool.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={tool.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {tool.title}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {tool.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${
                      pathname === item.href ? 'bg-accent/50' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          {/* Language Switcher - 显眼位置 */}
          <LanguageSwitcher />

          {user ? (
            <>
              {/* Credits Display */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">100 {t.nav.credits}</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t.nav.dashboard}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing">{t.nav.billing}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">{t.nav.settings}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href="/auth/login">{t.nav.signIn}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">{t.nav.getStarted}</Link>
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? 'text-primary' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {!user && (
                  <>
                    <hr className="my-4" />
                    <Link
                      href="/auth/login"
                      className="text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {t.nav.signIn}
                    </Link>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        {t.nav.getStarted}
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
