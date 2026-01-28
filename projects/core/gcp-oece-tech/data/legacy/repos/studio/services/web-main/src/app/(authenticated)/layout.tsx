'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { BookOpen, Cpu, Home, Loader2, LogOut, MessageSquare, Settings, ChevronsLeft } from 'lucide-react';
import { useUser } from '@/lib/supabase/hooks';
import { signOut } from '@/lib/supabase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { user, loading: isUserLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const { state: sidebarState, toggleSidebar } = useSidebar();
    const { locale } = useLocale();
    const t = translations[locale];

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: t.dashboard, icon: Home },
        { href: '/articles', label: t.articles, icon: BookOpen },
        { 
          href: '/ai-tools', 
          label: t.aiTools, 
          icon: Cpu,
          subItems: [
            { href: '/visa-comparison', label: 'Visa Comparison' },
            { href: '/visa-assistant', label: 'Visa Assistant' },
            { href: '/cost-of-living', label: 'Cost of Living' },
            { href: '/planner', label: 'Trip Planner' },
          ]
        },
        { href: '/bbs', label: t.forum, icon: MessageSquare, disabled: false },
    ];
    
    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className={cn(
              "grid grid-cols-[auto_1fr] flex-1 w-full transition-[grid-template-columns] duration-300 ease-in-out",
              sidebarState === 'expanded' ? 'md:grid-cols-[16rem_1fr]' : 'md:grid-cols-[3.5rem_1fr]'
          )}>
              <Sidebar>
                <SidebarContent>
                   <SidebarMenu>
                        {navItems.map((item) => (
                            <div key={item.href}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={pathname === item.href || item.subItems?.some((sub: any) => pathname === sub.href)} 
                                        disabled={item.disabled}
                                        tooltip={{ children: item.label, side: 'right' }}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {/* AI Tools Sub-menu */}
                                {item.subItems && sidebarState === 'expanded' && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.subItems.map((subItem: any) => (
                                            <SidebarMenuItem key={subItem.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === subItem.href}
                                                >
                                                    <Link href={subItem.href} className="text-xs pl-4">
                                                        <span className="text-accent">▸</span>
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                   </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                             <SidebarMenuButton 
                                asChild 
                                isActive={pathname.startsWith('/settings')}
                                tooltip={{ children: t.settings || 'Settings', side: 'right' }}
                             >
                                <Link href="#">
                                    <Settings />
                                    <span>{t.settings || 'Settings'}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={handleSignOut}
                                tooltip={{ children: t.logout || 'Logout', side: 'right' }}
                            >
                                <LogOut />
                                <span>{t.logout || 'Logout'}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                     <div className="hidden md:flex p-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            <ChevronsLeft className={cn("transition-transform duration-300", sidebarState === 'collapsed' && "rotate-180")} />
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
        <Footer />
      </div>
    )
}
