'use client'

import Link from 'next/link'
import { BookOpen, Coins, TrendingUp, MessageSquare, Users, Activity, ArrowRight, Zap } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import { 
  CRTScanlines,
  CRTCurvature,
  PixelBorders,
  PixelIcon,
  RetroButton,
  RetroCard,
  PixelDivider,
  LEDNumber,
  PixelProgressBar,
  RetroTag,
  DOSWindow
} from '@/components/retro/RetroEffects'
import {
  CircularGrid,
  DataFlowLines,
  GlowDots
} from '@/components/decorations/EnhancedSVGDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* CRT复古效果 */}
      <CRTScanlines />
      <CRTCurvature />
      <PixelBorders />
      
      {/* 现代SVG背景（降低透明度）*/}
      <div className="opacity-30">
        <CircularGrid />
        <DataFlowLines />
        <GlowDots />
      </div>
      
      <div className="relative z-10 px-4 py-8 sm:py-12 max-w-7xl mx-auto">
        
        {/* Hero区域 - DOS风格 */}
        <div className="mb-8">
          <DOSWindow title="OECE.TECH - UNDERGROUND TECH HUB">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <OECELogo size={100} animated={true} glowing={true} />
              </div>
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl font-bold mb-2 font-mono text-pixel-primary">
                  TECHNICAL AWAKENING PLATFORM
                </div>
                <p className="text-sm sm:text-base text-pixel-light mb-4 font-mono">
                  技術覺醒平台 | 從躺平到自由的技術路徑
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/register">
                    <RetroButton variant="primary">
                      START JOURNEY
                    </RetroButton>
                  </Link>
                  <Link href="/tutorials">
                    <RetroButton variant="secondary">
                      EXPLORE →
                    </RetroButton>
                  </Link>
                </div>
              </div>
            </div>
          </DOSWindow>
        </div>
        
        {/* 统计数据 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <RetroCard>
            <LEDNumber value={1250} label="POINTS" />
          </RetroCard>
          <RetroCard>
            <LEDNumber value={42} label="TUTORIALS" />
          </RetroCard>
          <RetroCard>
            <LEDNumber value={137} label="USERS" />
          </RetroCard>
          <RetroCard>
            <LEDNumber value={99} label="ONLINE" />
          </RetroCard>
        </div>
        
        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 教程系统 */}
          <Link href="/tutorials" className="block">
            <RetroCard className="h-full hover:border-pixel-primary transition-colors">
              <div className="flex items-start gap-3">
                <PixelIcon type="book" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-pixel-primary mb-2 font-mono">
                    TUTORIAL SYSTEM
                  </h3>
                  <p className="text-pixel-light text-sm mb-3 font-mono">
                    網路協議 | 技能變現 | 數字遊民
                  </p>
                  <PixelProgressBar percentage={75} />
                </div>
              </div>
            </RetroCard>
          </Link>
          
          {/* 积分系统 */}
          <Link href="/shop" className="block">
            <RetroCard className="h-full hover:border-pixel-accent transition-colors">
              <div className="flex items-start gap-3">
                <PixelIcon type="coin" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-pixel-accent mb-2 font-mono">
                    POINTS SHOP
                  </h3>
                  <p className="text-pixel-light text-sm mb-3 font-mono">
                    看廣告獲積分 | 兌換獎勵
                  </p>
                  <div className="flex gap-2">
                    <RetroTag color="accent">HOT</RetroTag>
                    <RetroTag color="primary">2X</RetroTag>
                  </div>
                </div>
              </div>
            </RetroCard>
          </Link>
          
          {/* 论坛 */}
          <Link href="/forum" className="block">
            <RetroCard className="h-full hover:border-pixel-secondary transition-colors">
              <div className="flex items-start gap-3">
                <PixelIcon type="chat" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-pixel-secondary mb-2 font-mono">
                    COMMUNITY
                  </h3>
                  <p className="text-pixel-light text-sm mb-3 font-mono">
                    匿名討論 | 技術交流
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-pixel-primary">● LIVE</span>
                    <span className="text-pixel-light">42 ONLINE</span>
                  </div>
                </div>
              </div>
            </RetroCard>
          </Link>
        </div>
        
        {/* 像素分割线 */}
        <PixelDivider />
        
        {/* 实时数据 */}
        <DOSWindow title="SYSTEM STATUS">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Activity className="text-pixel-primary" size={20} />
              <div>
                <div className="text-xs text-pixel-light font-mono">SERVER</div>
                <div className="text-sm font-bold text-pixel-primary font-mono">ONLINE</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="text-pixel-accent" size={20} />
              <div>
                <div className="text-xs text-pixel-light font-mono">LATENCY</div>
                <div className="text-sm font-bold text-pixel-accent font-mono">12ms</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-pixel-secondary" size={20} />
              <div>
                <div className="text-xs text-pixel-light font-mono">ACTIVE</div>
                <div className="text-sm font-bold text-pixel-secondary font-mono">137</div>
              </div>
            </div>
          </div>
        </DOSWindow>
        
        {/* CTA区域 */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-pixel-primary mb-4 font-mono glitch-text">
            READY TO START?
          </h2>
          <p className="text-pixel-light mb-6 font-mono">
            加入我們，開始你的技術覺醒之旅
          </p>
          <Link href="/auth/register">
            <RetroButton variant="primary">
              CREATE ACCOUNT →
            </RetroButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
