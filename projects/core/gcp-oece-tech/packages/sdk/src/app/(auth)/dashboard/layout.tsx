'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitBranch, 
  MessageSquare, 
  Gamepad2, 
  Sparkles, 
  LogOut, 
  BrainCircuit, 
  Ticket, 
  Mountain,
  Menu,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from '@/firebase/auth/use-user'; // Import our auth hook
import { getAuth, signOut } from 'firebase/auth';

const menuItems = [
  { name: '主控台 (Dashboard)', href: '/dashboard', icon: LayoutDashboard },
  { name: '靈魂獵手 (Soul Hunter)', href: '/dashboard/soul-hunter', icon: BrainCircuit },
  { name: '賽博論壇 (Agora)', href: '/dashboard/forum', icon: MessageSquare },
  { name: 'Meme 工程 (Meme Eng)', href: '/dashboard/meme-engineering', icon: Sparkles },
  { name: '地球 Online (Earth)', href: '/dashboard/earth-online', icon: Gamepad2 },
  { name: '邀請函 (Invitation)', href: '/dashboard/invitation', icon: Ticket },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { user, loading } = useUser();

  // Route Protection Logic
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
      const auth = getAuth();
      await signOut(auth);
      router.push('/login');
  };

  // Loading Screen (Cyberpunk Style)
  if (loading) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-[#050508] text-white">
              <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                      <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Mountain className="w-6 h-6 text-amber-500 animate-pulse" />
                      </div>
                  </div>
                  <p className="text-xs font-mono tracking-[0.3em] text-gray-500 animate-pulse">VERIFYING NEURAL LINK...</p>
              </div>
          </div>
      );
  }

  // If not loading and no user, we render nothing (will redirect)
  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5">
        {/* Brand */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
               <Mountain className="w-5 h-5 fill-current" />
           </div>
           <span className="text-lg font-bold text-white tracking-wide font-serif-display">DEEPWAY.OS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <Avatar className="w-8 h-8 border border-white/10 group-hover:border-amber-500/50 transition-colors">
               <AvatarImage src={user.photoURL || `https://api.dicebear.com/7.x/shapes/svg?seed=${user.email}`} />
               <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-white truncate">{user.displayName || 'Architect'}</p>
               <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-400 h-8 w-8 hover:bg-red-500/10">
                <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050508] text-gray-300 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         {/* Top Mobile Bar */}
         <div className="md:hidden h-16 border-b border-white/5 flex items-center px-4 justify-between bg-[#0a0a0a]/80 backdrop-blur-md z-20">
             <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-white tracking-wide">DEEPWAY</span>
             </div>
             <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r border-white/10 w-64 bg-black">
                    <SidebarContent />
                </SheetContent>
             </Sheet>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                 backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
             }}></div>
             
             <div className="relative z-10 max-w-7xl mx-auto min-h-full">
                 {children}
             </div>
         </div>
      </main>
    </div>
  );
}
