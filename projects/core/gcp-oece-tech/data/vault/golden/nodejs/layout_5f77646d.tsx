import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "OECE - AI赋能教育培训平台 | AI-Powered Education Platform",
    template: "%s | OECE",
  },
  description: "使用 Google Gemini AI 为教育工作者赋能。智能备课、创建评估、提升学习成果。AI-powered education tools for teachers and training professionals.",
  keywords: [
    "AI教育",
    "AI教学助手",
    "教案生成器",
    "智能备课",
    "教育培训",
    "AI education",
    "teaching assistant",
    "lesson planning",
    "OECE",
  ],
  authors: [{ name: "OECE" }],
  creator: "OECE",
  publisher: "OECE",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://oece.tech",
    siteName: "OECE",
    title: "OECE - AI赋能教育培训平台",
    description: "使用 Google Gemini AI 为教育工作者赋能。智能备课、创建评估、提升学习成果。",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OECE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OECE - AI赋能教育培训平台",
    description: "使用 Google Gemini AI 为教育工作者赋能。",
    images: ["/og-image.jpg"],
    creator: "@oece_tech",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable} translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" translate="no">
        {children}
        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
