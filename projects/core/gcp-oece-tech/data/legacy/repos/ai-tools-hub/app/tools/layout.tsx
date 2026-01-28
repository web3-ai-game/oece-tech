'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import {
  GraduationCap,
  PenTool,
  TrendingUp,
  Megaphone,
  Database,
  Lightbulb,
  Menu,
  X,
} from 'lucide-react';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const categories = [
    {
      id: 'teaching',
      name: 'AI教学工具',
      nameEn: 'AI Teaching',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: 6,
    },
    {
      id: 'content',
      name: '内容工厂',
      nameEn: 'Content Factory',
      icon: PenTool,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: 6,
    },
    {
      id: 'seo',
      name: 'SEO优化',
      nameEn: 'SEO Tools',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: 6,
    },
    {
      id: 'traffic',
      name: '流量工厂',
      nameEn: 'Traffic Factory',
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: 6,
    },
    {
      id: 'analytics',
      name: '数据分析',
      nameEn: 'Analytics',
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      count: 4,
    },
    {
      id: 'creative',
      name: '创意工具',
      nameEn: 'Creative',
      icon: Lightbulb,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      count: 3,
    },
  ];

  const isActive = (categoryId: string) => {
    return pathname.includes(`#${categoryId}`) || pathname === '/tools';
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Mobile Menu Button */}
        <div className="sticky top-16 z-40 flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
          <h2 className="font-semibold">工具中心</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 
            transform border-r bg-background transition-transform duration-300 ease-in-out
            md:translate-x-0 overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 space-y-1">
            {/* All Tools */}
            <Link href="/tools" onClick={() => setSidebarOpen(false)}>
              <div
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors
                  ${
                    pathname === '/tools'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }
                `}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                  <Menu className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">所有工具</p>
                  <p className="text-xs text-muted-foreground">All Tools</p>
                </div>
                <span className="text-xs font-semibold">35+</span>
              </div>
            </Link>

            <div className="my-4 border-t" />

            {/* Categories */}
            {categories.map((category) => {
              const Icon = category.icon;
              const active = isActive(category.id);
              return (
                <Link
                  key={category.id}
                  href={`/tools#${category.id}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors
                      ${active ? 'bg-muted' : 'hover:bg-muted/50'}
                    `}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.bgColor}`}>
                      <Icon className={`h-4 w-4 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.nameEn}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {category.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-purple-50 p-4">
              <p className="mb-2 text-sm font-semibold">升级Pro</p>
              <p className="mb-3 text-xs text-muted-foreground">
                解锁全部工具和高级功能
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link href="/pricing">立即升级</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </>
  );
}
