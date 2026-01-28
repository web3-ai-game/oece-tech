import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
// Removed FirebaseProvider import since it seems undefined and we might not need a global provider context for this simple setup
// We are using hooks directly in components

export const metadata: Metadata = {
  title: 'DEEPWAY',
  description: 'Architect Your Reality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Oxanium:wght@600;700;800&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen font-body antialiased')}>
          <div className="relative flex min-h-dvh flex-col bg-background">
              {children}
              <Toaster />
          </div>
      </body>
    </html>
  );
}
