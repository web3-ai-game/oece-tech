"use client";

import Link from "next/link";
import { AssetShowcase } from "@/components/asset-showcase";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { Heart } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 pointer-events-none" />
      
      <SharedHeader currentPage="home" />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs font-medium">
              🎉 Beta 免費使用 · 20人小圈子測試
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-[#00FF41] to-white bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
              <br />
              <span className="text-[#00FF41] drop-shadow-[0_0_30px_rgba(0,255,65,0.5)]">
                {t("hero.highlight")}
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-20">
            <Link href="/companion" className="group relative px-8 py-4 bg-[#00FF41] text-black rounded-xl text-base font-bold hover:scale-105 transition-all shadow-2xl shadow-[#00FF41]/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative flex items-center gap-2">
                <Heart className="h-5 w-5" />
                體驗 AI 伴侶
              </div>
            </Link>
            <Link href="/comic" className="px-8 py-4 border-2 border-[#00FF41]/30 text-[#00FF41] rounded-xl text-base font-bold hover:bg-[#00FF41]/10 hover:border-[#00FF41] transition-all">
              探索功能
            </Link>
          </div>

          {/* Features - 4 核心功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <Link href="/comic" className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">AI 漫畫生成器</h3>
                <p className="text-sm text-gray-400">輸入劇情，AI 生成精美漫畫分鏡</p>
              </div>
            </Link>

            <Link href="/novel" className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">爽文推演引擎</h3>
                <p className="text-sm text-gray-400">設定主角，自動生成爽文劇情</p>
              </div>
            </Link>

            <Link href="/pastlife" className="group relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">🔮</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">前世分析器</h3>
                <p className="text-sm text-gray-400">基於生辰性格，推演前世身份</p>
              </div>
            </Link>

            <Link href="/prompts" className="group relative p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">MCP 提示詞庫</h3>
                <p className="text-sm text-gray-400">精選高質量 AI 提示詞</p>
              </div>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">1000+</div>
              <div className="text-sm text-gray-400">電子書資源</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">4</div>
              <div className="text-sm text-gray-400">AI 核心功能</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">20</div>
              <div className="text-sm text-gray-400">測試用戶名額</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">24/7</div>
              <div className="text-sm text-gray-400">全天候服務</div>
            </div>
          </div>

          {/* Core Technology Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-[#00FF41] via-cyan-400 to-[#00FF41] bg-clip-text text-transparent">
                  核心技術架構
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                基於深度知識蒸餾與多模態 AI 引擎的下一代內容生產流水線
              </p>
            </div>

            {/* Tech Pipeline */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="relative">
                {/* Pipeline Flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Step 1 */}
                  <div className="relative group">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all">
                      <div className="text-3xl mb-3">📚</div>
                      <h3 className="text-sm font-bold mb-2 text-purple-400">知識蒸餾</h3>
                      <p className="text-xs text-gray-400">1000+ 書籍語義提取</p>
                    </div>
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative group">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 transition-all">
                      <div className="text-3xl mb-3">🧠</div>
                      <h3 className="text-sm font-bold mb-2 text-blue-400">向量化存儲</h3>
                      <p className="text-xs text-gray-400">MongoDB 語義索引</p>
                    </div>
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative group">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/60 transition-all">
                      <div className="text-3xl mb-3">🎯</div>
                      <h3 className="text-sm font-bold mb-2 text-green-400">語義路由</h3>
                      <p className="text-xs text-gray-400">智能意圖識別</p>
                    </div>
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-green-500 to-amber-500"></div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative group">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all">
                      <div className="text-3xl mb-3">🔄</div>
                      <h3 className="text-sm font-bold mb-2 text-amber-400">多人格輪詢</h3>
                      <p className="text-xs text-gray-400">Key 池負載均衡</p>
                    </div>
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-amber-500 to-red-500"></div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative group">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 hover:border-red-500/60 transition-all">
                      <div className="text-3xl mb-3">✨</div>
                      <h3 className="text-sm font-bold mb-2 text-red-400">內容生成</h3>
                      <p className="text-xs text-gray-400">多模態輸出</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Left Card */}
              <div className="relative p-8 rounded-2xl bg-[#161B22] border border-[#00FF41]/20 overflow-hidden">
                <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#00FF41]/10 blur-3xl" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00FF41]/10 flex items-center justify-center">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h3 className="text-xl font-bold">深度知識蒸餾技術</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  採用先進的<span className="text-[#00FF41] font-semibold">語義壓縮算法</span>，將海量文本數據進行多層次抽象提取。
                  通過<span className="text-[#00FF41] font-semibold">神經網絡編碼器</span>將知識轉化為高維向量空間，
                  實現<span className="text-[#00FF41] font-semibold">99.5% 的語義保真度</span>，同時將存儲體積壓縮至原始數據的 <span className="text-[#00FF41] font-semibold">1/100</span>。
                </p>
                <div className="relative mb-4 rounded-xl border border-[#00FF41]/15 bg-black/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FF41]/0 via-[#00FF41]/10 to-[#00FF41]/0 opacity-60" />
                  <svg
                    viewBox="0 0 420 120"
                    className="relative h-24 w-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="nnStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(0,255,65,0.2)" />
                        <stop offset="50%" stopColor="rgba(34,211,238,0.45)" />
                        <stop offset="100%" stopColor="rgba(0,255,65,0.2)" />
                      </linearGradient>
                      <filter id="nnGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Connections */}
                    <g filter="url(#nnGlow)" stroke="url(#nnStroke)" strokeWidth="1.2" strokeLinecap="round" fill="none">
                      <path d="M30 20 C120 15, 140 45, 210 40" className="opacity-60" />
                      <path d="M30 60 C120 60, 140 60, 210 40" className="opacity-35" />
                      <path d="M30 100 C120 105, 140 75, 210 80" className="opacity-60" />

                      <path d="M210 40 C280 20, 310 35, 390 20" className="opacity-55" />
                      <path d="M210 40 C280 60, 310 60, 390 60" className="opacity-35" />
                      <path d="M210 80 C280 100, 310 85, 390 100" className="opacity-55" />

                      <path d="M210 80 C280 60, 310 60, 390 60" className="opacity-25" />
                      <path d="M30 20 C110 20, 160 90, 210 80" className="opacity-25" />
                    </g>

                    {/* Nodes */}
                    <g filter="url(#nnGlow)">
                      <circle cx="30" cy="20" r="6" fill="rgba(0,255,65,0.85)" />
                      <circle cx="30" cy="60" r="6" fill="rgba(0,255,65,0.55)" />
                      <circle cx="30" cy="100" r="6" fill="rgba(0,255,65,0.85)" />

                      <circle cx="210" cy="40" r="7" fill="rgba(34,211,238,0.85)" />
                      <circle cx="210" cy="80" r="7" fill="rgba(34,211,238,0.65)" />

                      <circle cx="390" cy="20" r="6" fill="rgba(0,255,65,0.7)" />
                      <circle cx="390" cy="60" r="6" fill="rgba(0,255,65,0.9)" />
                      <circle cx="390" cy="100" r="6" fill="rgba(0,255,65,0.7)" />

                      {/* Pulse */}
                      <circle cx="210" cy="40" r="15" fill="rgba(34,211,238,0.12)" className="animate-pulse" />
                      <circle cx="390" cy="60" r="18" fill="rgba(0,255,65,0.10)" className="animate-pulse" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs">語義編碼</span>
                  <span className="px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs">向量壓縮</span>
                  <span className="px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs">知識圖譜</span>
                </div>
              </div>

              {/* Right Card */}
              <div className="p-8 rounded-2xl bg-[#161B22] border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold">智能負載均衡引擎</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  基於<span className="text-cyan-400 font-semibold">多人格 AI Key 池</span>的分布式調度系統，
                  實現<span className="text-cyan-400 font-semibold">毫秒級</span>的請求路由與故障轉移。
                  配合<span className="text-cyan-400 font-semibold">語義緩存層</span>，
                  將響應速度提升 <span className="text-cyan-400 font-semibold">300%</span>，成本降低 <span className="text-cyan-400 font-semibold">70%</span>。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">負載均衡</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">智能路由</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">容錯機制</span>
                </div>
              </div>
            </div>

            {/* Production Line */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[#00FF41]/5 to-cyan-500/5 border border-[#00FF41]/20 max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-[#00FF41] to-cyan-400 bg-clip-text text-transparent">
                    🏭 AI 內容工廠流水線
                  </span>
                </h3>
                <p className="text-sm text-gray-400">從知識到創意的全自動化生產鏈</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">📖</div>
                  <h4 className="font-bold mb-2">爽文工廠</h4>
                  <p className="text-xs text-gray-400">知識蒸餾 + Gemini 文本生成<br/>自動化章節推演引擎</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎨</div>
                  <h4 className="font-bold mb-2">漫畫工廠</h4>
                  <p className="text-xs text-gray-400">文本蒸餾 + Gemini 圖像生成<br/>AI 分鏡自動化流水線</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🤖</div>
                  <h4 className="font-bold mb-2">對話工廠</h4>
                  <p className="text-xs text-gray-400">語義路由 + Grok 多輪推理<br/>智能伴侶生產系統</p>
                </div>
              </div>
            </div>

            {/* Technical Blueprint - 工程圖紙風格 */}
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                    📐 Technical Blueprint
                  </span>
                </h3>
                <p className="text-sm text-gray-500">基於成熟開源技術棧的低成本高效方案</p>
              </div>

              {/* Blueprint Container */}
              <div className="relative p-6 md:p-8 rounded-2xl bg-[#0a0f14] border border-gray-700/50 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(100,100,100,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
                
                {/* Blueprint Title */}
                <div className="relative flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00FF41]/60" />
                    <span className="text-xs font-mono text-gray-500">OECE-ARCH-v1.0</span>
                  </div>
                  <span className="text-xs font-mono text-gray-600">REV: 2026.01</span>
                </div>

                {/* Architecture Flow */}
                <div className="relative grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 mb-8">
                  {/* Input Layer */}
                  <div className="p-4 rounded-lg border border-dashed border-gray-600 bg-gray-900/50">
                    <div className="text-xs font-mono text-gray-500 mb-2">INPUT</div>
                    <div className="text-sm font-semibold text-white mb-1">Raw Data</div>
                    <div className="text-[10px] text-gray-500 space-y-0.5">
                      <div>• PDF / EPUB / TXT</div>
                      <div>• Web Scraping</div>
                      <div>• API Feeds</div>
                    </div>
                  </div>

                  {/* Distillation */}
                  <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
                    <div className="text-xs font-mono text-purple-400 mb-2">DISTILL</div>
                    <div className="text-sm font-semibold text-white mb-1">Knowledge Extraction</div>
                    <div className="text-[10px] text-gray-400 space-y-0.5">
                      <div className="text-purple-400">• LangChain</div>
                      <div className="text-purple-400">• Unstructured.io</div>
                      <div>• Chunk + Overlap</div>
                    </div>
                  </div>

                  {/* Embedding */}
                  <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                    <div className="text-xs font-mono text-blue-400 mb-2">EMBED</div>
                    <div className="text-sm font-semibold text-white mb-1">Vector Store</div>
                    <div className="text-[10px] text-gray-400 space-y-0.5">
                      <div className="text-blue-400">• text-embedding-004</div>
                      <div className="text-blue-400">• MongoDB Atlas</div>
                      <div>• HNSW Index</div>
                    </div>
                  </div>

                  {/* Routing */}
                  <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                    <div className="text-xs font-mono text-green-400 mb-2">ROUTE</div>
                    <div className="text-sm font-semibold text-white mb-1">Semantic Router</div>
                    <div className="text-[10px] text-gray-400 space-y-0.5">
                      <div className="text-green-400">• semantic-router</div>
                      <div className="text-green-400">• Intent Classification</div>
                      <div>• Dynamic Dispatch</div>
                    </div>
                  </div>

                  {/* Generation */}
                  <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <div className="text-xs font-mono text-amber-400 mb-2">GENERATE</div>
                    <div className="text-sm font-semibold text-white mb-1">Multi-Model</div>
                    <div className="text-[10px] text-gray-400 space-y-0.5">
                      <div className="text-amber-400">• Gemini 2.5 Flash</div>
                      <div className="text-amber-400">• Grok-3</div>
                      <div>• Key Pool Rotation</div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="relative pt-4 border-t border-gray-700/50">
                  <div className="text-xs font-mono text-gray-600 mb-3">TECH STACK</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">Next.js 16</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">TypeScript</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-purple-900/30 border border-purple-700/50 text-purple-400">LangChain</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-blue-900/30 border border-blue-700/50 text-blue-400">MongoDB Atlas</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-green-900/30 border border-green-700/50 text-green-400">semantic-router</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-amber-900/30 border border-amber-700/50 text-amber-400">Gemini API</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">Firebase</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">Supabase</span>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">TailwindCSS</span>
                  </div>
                  <div className="mt-4 text-[10px] text-gray-600 font-mono">
                    * 全棧開源方案 · 單機可部署 · API 成本 &lt; $0.01/1K tokens
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Giants of Computing - 科技先驅致敬 */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  站在巨人的肩膀上
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                致敬開創人工智能與計算機科學的偉大先驅
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Alan Turing */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20 hover:border-blue-400/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">🧮</div>
                  <h3 className="font-bold text-blue-400 mb-1">Alan Turing</h3>
                  <p className="text-xs text-gray-400 mb-2">1912-1954</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    「機器能思考嗎？」<br/>
                    <span className="text-blue-400/80">圖靈測試之父</span>，定義了「智能」的邊界
                  </p>
                </div>
              </div>

              {/* John von Neumann */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 hover:border-purple-400/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5e/JohnvonNeumann-LosAlamos.gif')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">💻</div>
                  <h3 className="font-bold text-purple-400 mb-1">John von Neumann</h3>
                  <p className="text-xs text-gray-400 mb-2">1903-1957</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    「存儲程序」架構奠基者<br/>
                    <span className="text-purple-400/80">現代計算機之父</span>，博弈論先驅
                  </p>
                </div>
              </div>

              {/* Theodore von Kármán */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 hover:border-orange-400/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/6/6e/Theodore_von_Karman.jpg')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="font-bold text-orange-400 mb-1">Theodore von Kármán</h3>
                  <p className="text-xs text-gray-400 mb-2">1881-1963</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    錢學森的導師<br/>
                    <span className="text-orange-400/80">航空航天之父</span>，流體力學大師
                  </p>
                </div>
              </div>

              {/* Claude Shannon */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-teal-900/30 border border-green-500/20 hover:border-green-400/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/99/ClaudeShannon_MFO3807.jpg')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">📡</div>
                  <h3 className="font-bold text-green-400 mb-1">Claude Shannon</h3>
                  <p className="text-xs text-gray-400 mb-2">1916-2001</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    「一切皆可 0 和 1」<br/>
                    <span className="text-green-400/80">信息論之父</span>，奠定數字時代
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-8 text-center max-w-3xl mx-auto">
              <blockquote className="text-lg italic text-gray-500 border-l-4 border-amber-500/50 pl-4">
                &ldquo;We can only see a short distance ahead, but we can see plenty there that needs to be done.&rdquo;
                <footer className="text-sm text-amber-400/60 mt-2">— Alan Turing</footer>
              </blockquote>
            </div>
          </div>

          {/* Red Team vs Blue Team - AI 安全對抗 */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  🎯 AI 安全攻防靶場
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                認知戰爭時代的紅藍對抗演練平台 · <span className="text-amber-400">即將上線</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Red Team */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-500/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                      <span className="text-2xl">🔴</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-400">紅隊 · 攻擊方</h3>
                      <p className="text-xs text-red-400/60">Offensive Security</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    模擬真實威脅場景，掌握前沿攻擊向量。我們研究但<span className="text-red-400 font-semibold">不公開</span>具體手法：
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">▸</span>
                      <span className="text-gray-500">Prompt Injection · 提示詞注入</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">▸</span>
                      <span className="text-gray-500">Jailbreak Techniques · 越獄突破</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">▸</span>
                      <span className="text-gray-500">Social Engineering · 社會工程學</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">▸</span>
                      <span className="text-gray-500">Cognitive Warfare · 認知戰術</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400/80">
                    ⚠️ 紅隊技術僅限內部研究，不對外公開
                  </div>
                </div>
              </div>

              {/* Blue Team */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-500/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <span className="text-2xl">🔵</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-400">藍隊 · 防禦方</h3>
                      <p className="text-xs text-blue-400/60">Defensive Security</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    構建堅不可摧的 AI 安全防線，我們<span className="text-blue-400 font-semibold">開源分享</span>防禦技術：
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">▸</span>
                      <span className="text-gray-300">Input Sanitization · 輸入淨化</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">▸</span>
                      <span className="text-gray-300">Guardrails System · 護欄系統</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">▸</span>
                      <span className="text-gray-300">Anomaly Detection · 異常檢測</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">▸</span>
                      <span className="text-gray-300">Semantic Firewall · 語義防火牆</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400/80">
                    ✓ 藍隊技術開源共享，共建安全生態
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Arena Preview */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-500/5 via-purple-500/10 to-blue-500/5 border border-purple-500/20 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-lg mb-1">
                    <span className="text-red-400">紅</span>
                    <span className="text-gray-500 mx-2">vs</span>
                    <span className="text-blue-400">藍</span>
                    <span className="text-gray-300 ml-2">實戰演練場</span>
                  </h4>
                  <p className="text-xs text-gray-500">在安全的沙盒環境中進行攻防對抗訓練，提升 AI 安全意識</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 border border-purple-500/30 text-sm font-semibold hover:border-purple-400/50 transition-all">
                  🎮 即將開放 · 敬請期待
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Asset Portfolio */}
      <AssetShowcase />

      <SharedFooter />
    </div>
  );
}
