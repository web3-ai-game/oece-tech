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
                  <PixelIcon type="lock" /> OECE.TECH
                </div>
                <div className="text-base sm:text-lg text-pixel-light mb-3">
                  &gt; 地下技術聚合平台 | Underground Tech Hub
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <RetroTag>30+ 教程</RetroTag>
                  <RetroTag color="accent">50+ API</RetroTag>
                  <RetroTag color="warning">完全匿名</RetroTag>
                </div>
                <div className="flex gap-3">
                  <RetroButton>
                    <PixelIcon type="book" /> 瀏覽教程
                  </RetroButton>
                  <RetroButton variant="outline">
                    <PixelIcon type="coin" /> 賺積分
                  </RetroButton>
                </div>
              </div>
            </div>
          </DOSWindow>
        </div>
        
        <PixelDivider />
        
        {/* 实时数据 - LED风格 */}
        <div className="mb-8">
          <div className="text-xl font-mono text-pixel-primary mb-4 flex items-center gap-2">
            <Activity size={24} />
            <span>&gt; REAL-TIME DATA_</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'user', label: '在線用戶', value: '42', color: 'primary' },
              { icon: 'book', label: '專業教程', value: '30+', color: 'accent' },
              { icon: 'coin', label: '總積分', value: '1.2M', color: 'warning' },
              { icon: 'chat', label: '討論主題', value: '580', color: 'danger' }
            ].map((stat, i) => (
              <RetroCard key={i} className="text-center">
                <div className="mb-3">
                  <PixelIcon type={stat.icon} />
                </div>
                <div className="mb-2">
                  <LEDNumber value={stat.value} />
                </div>
                <div className="text-xs text-pixel-light/70 uppercase font-mono">
                  {stat.label}
                </div>
              </RetroCard>
            ))}
          </div>
        </div>
        
        <PixelDivider />
        
        {/* 热门教程 - 8-bit卡片 */}
        <div className="mb-8">
          <div className="text-xl font-mono text-pixel-primary mb-4 flex items-center gap-2">
            <Zap size={24} />
            <span>&gt; HOT TUTORIALS_</span>
          </div>
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {[
                { emoji: '🚀', title: 'Google郵箱註冊', cat: '出海', views: '2.3K', progress: 85 },
                { emoji: '🔐', title: 'VPN搭建完整指南', cat: 'VPN', views: '1.8K', progress: 92 },
                { emoji: '🕵️', title: '社工防範技巧', cat: '安全', views: '1.5K', progress: 78 },
                { emoji: '🐧', title: 'Kali環境搭建', cat: 'Kali', views: '1.2K', progress: 65 },
                { emoji: '🛡️', title: 'Tor網絡使用', cat: '匿名', views: '980', progress: 88 }
              ].map((tutorial, i) => (
                <div key={i} className="w-72 flex-shrink-0">
                  <RetroCard title={tutorial.cat}>
                    <div className="text-3xl mb-3 text-center">{tutorial.emoji}</div>
                    <div className="text-base font-bold text-pixel-light mb-3 h-12 flex items-center justify-center text-center">
                      {tutorial.title}
                    </div>
                    <div className="mb-3">
                      <div className="text-xs text-pixel-light/60 mb-1 font-mono">完成度:</div>
                      <PixelProgressBar value={tutorial.progress} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-pixel-light/60">👁️ {tutorial.views}</span>
                      <RetroTag color="primary">查看</RetroTag>
                    </div>
                  </RetroCard>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <PixelDivider />
        
        {/* 教程分类 - 像素化网格 */}
        <div className="mb-8">
          <div className="text-xl font-mono text-pixel-primary mb-4 flex items-center gap-2">
            <BookOpen size={24} />
            <span>&gt; TUTORIAL CATEGORIES_</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: '🚀', name: '出海第一步', count: 8 },
              { emoji: '🔐', name: 'VPN/SS技術', count: 6 },
              { emoji: '🕵️', name: '社會工程學', count: 5 },
              { emoji: '🐧', name: 'Kali實戰', count: 4 },
              { emoji: '🛡️', name: '匿名化技術', count: 7 },
              { emoji: '💻', name: 'SSH技巧', count: 5 },
              { emoji: '🔧', name: '硬件改裝', count: 3 },
              { emoji: '🎯', name: '反跟蹤', count: 4 },
              { emoji: '🎮', name: '虛擬環境', count: 3 },
              { emoji: '🌐', name: '跳坑指南', count: 6 }
            ].map((cat, i) => (
              <Link key={i} href={`/tutorials/${cat.name}`}>
                <RetroCard className="text-center hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer">
                  <div className="text-4xl mb-2">{cat.emoji}</div>
                  <div className="text-sm font-bold text-pixel-light mb-2 font-mono">
                    {cat.name}
                  </div>
                  <LEDNumber value={cat.count} />
                  <div className="text-xs text-pixel-light/60 mt-1">篇教程</div>
                </RetroCard>
              </Link>
            ))}
          </div>
        </div>
        
        <PixelDivider />
        
        {/* 实时股市 - LED数字 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-mono text-pixel-primary flex items-center gap-2">
              <TrendingUp size={24} />
              <span>&gt; MARKET DATA_</span>
            </div>
            <Link href="/tools/data">
              <RetroTag color="accent">查看更多 →</RetroTag>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { symbol: 'SET.BK', name: '泰國SET', price: '1420.50', change: '+0.87' },
              { symbol: 'STI', name: '新加坡STI', price: '3245.80', change: '-0.16' },
              { symbol: 'BTC', name: 'Bitcoin', price: '67234', change: '+1.87' },
              { symbol: 'ETH', name: 'Ethereum', price: '3542', change: '-1.26' },
              { symbol: 'USD/THB', name: 'USD泰銖', price: '35.42', change: '+0.14' },
              { symbol: 'USD/SGD', name: 'USD新元', price: '1.34', change: '-0.75' }
            ].map((data, i) => (
              <RetroCard key={i}>
                <div className="text-xs text-pixel-light/50 font-mono mb-1">{data.symbol}</div>
                <div className="mb-2">
                  <LEDNumber value={data.price} />
                </div>
                <div className={`text-xs font-mono font-bold ${
                  data.change.startsWith('+') ? 'text-pixel-primary' : 'text-pixel-danger'
                }`}>
                  {data.change}%
                </div>
              </RetroCard>
            ))}
          </div>
        </div>
        
        <PixelDivider />
        
        {/* 论坛讨论 - DOS风格列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-mono text-pixel-primary flex items-center gap-2">
              <MessageSquare size={24} />
              <span>&gt; FORUM ACTIVITY_</span>
            </div>
            <Link href="/forum">
              <RetroTag color="warning">進入論壇 →</RetroTag>
            </Link>
          </div>
          
          <DOSWindow title="LATEST DISCUSSIONS">
            <div className="space-y-3">
              {[
                { user: '神秘駭客#1024', title: '請問VPN如何選擇？', replies: 12, tag: 'VPN' },
                { user: '匿名開發者#2048', title: 'SSH配置問題求助', replies: 8, tag: 'SSH' },
                { user: '幽靈工程師#4096', title: '分享一個好用的工具', replies: 23, tag: '工具' },
                { user: '暗影用戶#8192', title: 'Kali最新版本測試心得', replies: 15, tag: 'Kali' }
              ].map((post, i) => (
                <div key={i} className="border-2 border-pixel-grid p-3 hover:border-pixel-primary transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <PixelIcon type="eye" />
                    <span className="text-xs text-pixel-accent font-mono">{post.user}</span>
                    <RetroTag color="primary">{post.tag}</RetroTag>
                  </div>
                  <div className="text-sm font-bold text-pixel-light mb-2">
                    &gt; {post.title}
                  </div>
                  <div className="text-xs text-pixel-light/60 font-mono">
                    💬 {post.replies} 回覆
                  </div>
                </div>
              ))}
            </div>
          </DOSWindow>
        </div>
        
        <PixelDivider />
        
        {/* 积分系统 - 8-bit风格 */}
        <div className="mb-8">
          <div className="text-xl font-mono text-pixel-primary mb-4 flex items-center gap-2">
            <Coins size={24} />
            <span>&gt; POINT SYSTEM_</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <DOSWindow title="[ EARN POINTS ]">
              <div className="space-y-3">
                {[
                  { label: '註冊獎勵', points: '+150' },
                  { label: '貢獻教程', points: '+500' },
                  { label: '看廣告', points: '+20' },
                  { label: '社區互動', points: '+5' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b-2 border-pixel-grid pb-2">
                    <span className="text-sm text-pixel-light">&gt; {item.label}</span>
                    <LEDNumber value={item.points} />
                  </div>
                ))}
              </div>
            </DOSWindow>
            
            <DOSWindow title="[ SPEND POINTS ]">
              <div className="space-y-3">
                {[
                  { label: '解鎖教程', points: '50-200' },
                  { label: '下載資源', points: '50-500' },
                  { label: '私密諮詢', points: '100' },
                  { label: 'VIP會員', points: '1000' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b-2 border-pixel-grid pb-2">
                    <span className="text-sm text-pixel-light">&gt; {item.label}</span>
                    <LEDNumber value={item.points} />
                  </div>
                ))}
              </div>
            </DOSWindow>
          </div>
        </div>
        
        {/* 免责声明 - 复古警告框 */}
        <div className="border-4 border-pixel-danger bg-pixel-danger/10 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0 animate-pulse">⚠️</div>
            <div>
              <div className="text-sm font-mono text-pixel-danger font-bold mb-2">
                &gt; IMPORTANT NOTICE_
              </div>
              <div className="text-xs text-pixel-light/80 font-mono leading-relaxed">
                本平台提供的教程內容僅供技術學習研究使用，請勿用於非法用途。
                <Link href="/disclaimer" className="text-pixel-primary hover:underline ml-1">
                  [查看完整聲明]
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
