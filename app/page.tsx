"use client";

import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowButton, GlassButton } from "@/components/ui/button";
import { Rocket, Database, Zap, Shield, Search, Bot, Code2, Sparkles } from "lucide-react";

const projects = [
  {
    title: "DeepWeay.me",
    description: "賽博算命 | AI 聊天平台，給女神和老媽的專屬服務",
    icon: <Bot className="h-6 w-6 text-cyan-400" />,
    className: "md:col-span-2",
    href: "https://deepweay.me",
  },
  {
    title: "Gemini Keys",
    description: "智能密鑰管理系統，7個收費 Key + 1個免費 Key",
    icon: <Shield className="h-6 w-6 text-purple-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Firebase Hosting",
    description: "自動化部署管道，GitHub Actions + Cloud Functions Gen 2",
    icon: <Rocket className="h-6 w-6 text-orange-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Supabase",
    description: "開源數據庫，實時同步 + 用戶認證",
    icon: <Database className="h-6 w-6 text-green-400" />,
    className: "md:col-span-1",
  },
  {
    title: "OpenRouter",
    description: "$1111 餘額，支持所有主流 AI 模型",
    icon: <Sparkles className="h-6 w-6 text-yellow-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Algolia Search",
    description: "毫秒級全文搜索，10K 請求/月",
    icon: <Search className="h-6 w-6 text-blue-400" />,
    className: "md:col-span-1",
  },
];

const techStack = [
  { name: "Next.js 16", icon: <Code2 className="h-5 w-5" /> },
  { name: "Firebase", icon: <Rocket className="h-5 w-5" /> },
  { name: "Doppler", icon: <Shield className="h-5 w-5" /> },
  { name: "Gemini AI", icon: <Sparkles className="h-5 w-5" /> },
  { name: "Supabase", icon: <Database className="h-5 w-5" /> },
  { name: "TailwindCSS", icon: <Zap className="h-5 w-5" /> },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="cyan" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-16">
          <div className="text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-4">
              OECE TECH
            </h1>
            
            {/* Glowing Subtitle */}
            <p className="text-xl md:text-2xl text-cyan-400 font-light mb-2 animate-pulse">
              The Digital Mothership
            </p>
            
            <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto mb-8">
              極客母艦 | Web3 & AI Agents Command Center
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <GlowButton onClick={() => console.log("Launch Console")}>
                🚀 Launch Console
              </GlowButton>
              <GlassButton onClick={() => window.open("https://github.com/web3-ai-game/oece-tech", "_blank")}>
                📚 Documentation
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-12 text-center">
            📦 Active Projects
          </h2>
          <BentoGrid className="max-w-6xl mx-auto">
            {projects.map((project, i) => (
              <BentoGridItem
                key={i}
                title={project.title}
                description={project.description}
                icon={project.icon}
                className={project.className}
              />
            ))}
          </BentoGrid>
        </div>

        {/* Tech Stack */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-12 text-center">
            ⚙️ Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <span className="text-cyan-400 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </span>
                <span className="text-neutral-300 font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-neutral-500 text-sm">
            Built with 🔥 by DeepWeay | Powered by Firebase & Gemini AI
          </p>
          <p className="text-neutral-600 text-xs mt-2">
            © 2025 OECE Tech. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
