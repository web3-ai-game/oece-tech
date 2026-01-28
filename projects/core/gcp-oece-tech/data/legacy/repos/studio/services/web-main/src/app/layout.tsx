import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/common/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LocaleProvider } from '@/contexts/locale-context';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Urban Diver | Deep Dive into Digital Nomad 2.0',
  description: 'Explore the depths of urban living and digital freedom. Dive deep into the future of location-independent lifestyle.',
  other: {
    'google': 'notranslate',
  },
};

const Favicon = () => (
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>" />
);


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  // messages removed
  
  return (
    <html lang={locale} suppressHydrationWarning translate="no" suppressContentEditableWarning>
      <head>
        <Favicon />
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&family=Orbitron:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider>
            <FirebaseClientProvider>
              <SidebarProvider>
                {children}
                <Toaster />
              </SidebarProvider>
            </FirebaseClientProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
