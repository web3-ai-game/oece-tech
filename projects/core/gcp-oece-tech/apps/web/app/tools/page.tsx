"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Type, Image, Video, Music, Code, FileText, Languages,
  Scissors, Wand2, Palette, Zap, Brain, Search, Download, Upload,
  RefreshCw, Copy, Check, Hash, Lock, Unlock, QrCode, Barcode
} from "lucide-react";

const toolCategories = [
  {
    name: "文本工具",
    nameEn: "Text Tools",
    icon: Type,
    color: "#4285F4",
    tools: [
      { id: "summarize", name: "文本摘要", icon: FileText, free: true },
      { id: "translate", name: "AI 翻譯", icon: Languages, free: true },
      { id: "grammar", name: "語法檢查", icon: Check, free: true },
      { id: "rewrite", name: "內容改寫", icon: RefreshCw, free: false },
      { id: "expand", name: "內容擴寫", icon: Wand2, free: false },
      { id: "tone", name: "語氣轉換", icon: Palette, free: false },
      { id: "seo", name: "SEO 優化", icon: Search, free: false },
      { id: "keywords", name: "關鍵詞提取", icon: Hash, free: true },
      { id: "sentiment", name: "情感分析", icon: Brain, free: false },
      { id: "copy", name: "文案生成", icon: Copy, free: false },
    ]
  },
  {
    name: "圖像工具",
    nameEn: "Image Tools",
    icon: Image,
    color: "#EC4899",
    tools: [
      { id: "img-gen", name: "AI 生圖", icon: Image, free: false },
      { id: "img-edit", name: "圖片編輯", icon: Palette, free: false },
      { id: "img-enhance", name: "圖片增強", icon: Zap, free: false },
      { id: "bg-remove", name: "背景移除", icon: Scissors, free: true },
      { id: "img-compress", name: "圖片壓縮", icon: Download, free: true },
      { id: "img-convert", name: "格式轉換", icon: RefreshCw, free: true },
      { id: "qr-gen", name: "二維碼生成", icon: QrCode, free: true },
      { id: "barcode", name: "條碼生成", icon: Barcode, free: true },
    ]
  },
  {
    name: "視頻工具",
    nameEn: "Video Tools",
    icon: Video,
    color: "#F59E0B",
    tools: [
      { id: "vid-summarize", name: "視頻摘要", icon: FileText, free: false },
      { id: "vid-subtitle", name: "字幕生成", icon: Type, free: false },
      { id: "vid-translate", name: "字幕翻譯", icon: Languages, free: false },
      { id: "vid-compress", name: "視頻壓縮", icon: Download, free: true },
      { id: "vid-convert", name: "格式轉換", icon: RefreshCw, free: true },
    ]
  },
  {
    name: "音頻工具",
    nameEn: "Audio Tools",
    icon: Music,
    color: "#8B5CF6",
    tools: [
      { id: "speech-to-text", name: "語音轉文字", icon: Type, free: false },
      { id: "text-to-speech", name: "文字轉語音", icon: Music, free: false },
      { id: "audio-enhance", name: "音頻增強", icon: Zap, free: false },
      { id: "audio-compress", name: "音頻壓縮", icon: Download, free: true },
      { id: "audio-convert", name: "格式轉換", icon: RefreshCw, free: true },
    ]
  },
  {
    name: "代碼工具",
    nameEn: "Code Tools",
    icon: Code,
    color: "#22C55E",
    tools: [
      { id: "code-gen", name: "代碼生成", icon: Code, free: false },
      { id: "code-review", name: "代碼審查", icon: Search, free: false },
      { id: "code-explain", name: "代碼解釋", icon: FileText, free: true },
      { id: "code-fix", name: "Bug 修復", icon: Wand2, free: false },
      { id: "code-optimize", name: "性能優化", icon: Zap, free: false },
      { id: "code-convert", name: "語言轉換", icon: RefreshCw, free: false },
    ]
  },
  {
    name: "加密工具",
    nameEn: "Crypto Tools",
    icon: Lock,
    color: "#06B6D4",
    tools: [
      { id: "encrypt", name: "文本加密", icon: Lock, free: true },
      { id: "decrypt", name: "文本解密", icon: Unlock, free: true },
      { id: "hash", name: "Hash 生成", icon: Hash, free: true },
      { id: "base64", name: "Base64 編碼", icon: Code, free: true },
    ]
  }
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState(toolCategories[0]);
  
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);
  const freeTools = toolCategories.reduce((sum, cat) => 
    sum + cat.tools.filter(t => t.free).length, 0
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
              🛠️ AI TOOLS SUITE
            </div>
            <h1 className="text-4xl font-bold mb-2">
              AI 工具 <span className="text-[var(--primary)]">大合集</span>
            </h1>
            <p className="text-sm text-gray-400">
              {totalTools}+ AI-powered tools · {freeTools} free · Text, Image, Video, Audio, Code
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {toolCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory.name === cat.name
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-xs text-gray-500">({cat.tools.length})</span>
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {selectedCategory.tools.map((tool) => (
              <div
                key={tool.id}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer relative"
              >
                {!tool.free && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                      PRO
                    </span>
                  </div>
                )}
                <tool.icon 
                  className="h-6 w-6 mb-3 mx-auto" 
                  style={{ color: selectedCategory.color }}
                />
                <h3 className="text-sm font-medium text-center group-hover:text-[var(--primary)] transition-colors">
                  {tool.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">{totalTools}+</div>
              <div className="text-xs text-gray-500">Total Tools</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">{freeTools}</div>
              <div className="text-xs text-gray-500">Free Tools</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-xs text-gray-500">Categories</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
