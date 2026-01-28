'use client';

import React from 'react';
import { useUser } from '@/lib/supabase/hooks';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
          <Header />
          <div className='flex-1 flex'>
            {children}
          </div>
          <Footer />
      </div>
    </SidebarProvider>
  );
}
