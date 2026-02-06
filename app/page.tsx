"use client";

import { AssetShowcase } from "@/components/asset-showcase";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesGrid } from "@/components/home/features-grid";
import { TechArchitecture } from "@/components/home/tech-architecture";
import { GiantsSection } from "@/components/home/giants-section";
import { SecurityArena } from "@/components/home/security-arena";
import { PipelineSVG, EcosystemSVG } from "@/components/home/pipeline-svg";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />
      
      <SharedHeader currentPage="home" />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <HeroSection />
          <FeaturesGrid />
          <PipelineSVG />
          <TechArchitecture />
          <EcosystemSVG />
          <GiantsSection />
          <SecurityArena />
        </div>
      </main>

      <AssetShowcase />
      <SharedFooter />
    </div>
  );
}
