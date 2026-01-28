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
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { user, isUserLoading } = useUser();
    const { t } = useI18n();
    const pathname = usePathname();
    const { state: sidebarState, toggleSidebar } = useSidebar();

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth);
    };

    const navItems = [
        { href: '/dashboard', label: t.dashboardTitle, icon: Home },
        { href: '/articles', label: t.navArticles, icon: BookOpen },
        { href: '/ai-tools', label: t.navAiTools, icon: Cpu },
        { href: '#', label: t.navBBS, icon: MessageSquare, disabled: true },
    ];
    
    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        // This can happen briefly on page load, or if the user is logged out.
        // Redirect logic is handled by middleware or page-level checks.
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className={cn(
            "grid grid-cols-[auto_1fr] flex-1 w-full transition-[grid-template-columns] duration-300 ease-in-out",
            sidebarState === 'expanded' ? 'md:grid-cols-[16rem_1fr]' : 'md:grid-cols-[3.5rem_1fr]'
        )}>
            <Sidebar>
                <SidebarContent>
                   <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname === item.href} 
                                    disabled={item.disabled}
                                    tooltip={{ children: item.label, side: 'right' }}
                                >
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                   </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                             <SidebarMenuButton 
                                asChild 
                                isActive={pathname.startsWith('/settings')}
                                tooltip={{ children: t.navSettings, side: 'right' }}
                             >
                                <Link href="#">
                                    <Settings />
                                    <span>{t.navSettings}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={handleSignOut}
                                tooltip={{ children: t.logout, side: 'right' }}
                            >
                                <LogOut />
                                <span>{t.logout}</span>
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
    )
}
