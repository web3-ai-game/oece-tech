"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Type, Image, Video, Music, Code, FileText, Languages,
  Scissors, Wand2, Palette, Zap, Brain, Search, Download,
  RefreshCw, Copy, Check, Hash, Lock, Unlock, QrCode, Barcode, ArrowRight
} from "lucide-react";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { useLanguage } from "@/lib/language-provider";

const toolCategories = [
  {
    name: "Text Tools", nameZh: "文本工具", icon: Type, color: "#4285F4",
    gradient: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/30",
    tools: [
      { id: "summarize", name: "Text Summary", nameZh: "文本摘要", icon: FileText, free: true },
      { id: "translate", name: "AI Translate", nameZh: "AI 翻譯", icon: Languages, free: true },
      { id: "grammar", name: "Grammar Check", nameZh: "語法檢查", icon: Check, free: true },
      { id: "rewrite", name: "Content Rewrite", nameZh: "內容改寫", icon: RefreshCw, free: false },
      { id: "expand", name: "Content Expand", nameZh: "內容擴寫", icon: Wand2, free: false },
      { id: "tone", name: "Tone Shift", nameZh: "語氣轉換", icon: Palette, free: false },
      { id: "seo", name: "SEO Optimize", nameZh: "SEO 優化", icon: Search, free: false },
      { id: "keywords", name: "Keyword Extract", nameZh: "關鍵詞提取", icon: Hash, free: true },
      { id: "sentiment", name: "Sentiment Analysis", nameZh: "情感分析", icon: Brain, free: false },
      { id: "copy", name: "Copywriting", nameZh: "文案生成", icon: Copy, free: false },
    ]
  },
  {
    name: "Image Tools", nameZh: "圖像工具", icon: Image, color: "#EC4899",
    gradient: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/30",
    tools: [
      { id: "img-gen", name: "AI Image Gen", nameZh: "AI 生圖", icon: Image, free: false },
      { id: "img-edit", name: "Image Edit", nameZh: "圖片編輯", icon: Palette, free: false },
      { id: "img-enhance", name: "Image Enhance", nameZh: "圖片增強", icon: Zap, free: false },
      { id: "bg-remove", name: "BG Remove", nameZh: "背景移除", icon: Scissors, free: true },
      { id: "img-compress", name: "Compress", nameZh: "圖片壓縮", icon: Download, free: true },
      { id: "img-convert", name: "Convert", nameZh: "格式轉換", icon: RefreshCw, free: true },
      { id: "qr-gen", name: "QR Code", nameZh: "二維碼生成", icon: QrCode, free: true },
      { id: "barcode", name: "Barcode", nameZh: "條碼生成", icon: Barcode, free: true },
    ]
  },
  {
    name: "Video Tools", nameZh: "視頻工具", icon: Video, color: "#F59E0B",
    gradient: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30",
    tools: [
      { id: "vid-summarize", name: "Video Summary", nameZh: "視頻摘要", icon: FileText, free: false },
      { id: "vid-subtitle", name: "Subtitle Gen", nameZh: "字幕生成", icon: Type, free: false },
      { id: "vid-translate", name: "Subtitle Translate", nameZh: "字幕翻譯", icon: Languages, free: false },
      { id: "vid-compress", name: "Compress", nameZh: "視頻壓縮", icon: Download, free: true },
      { id: "vid-convert", name: "Convert", nameZh: "格式轉換", icon: RefreshCw, free: true },
    ]
  },
  {
    name: "Audio Tools", nameZh: "音頻工具", icon: Music, color: "#8B5CF6",
    gradient: "from-purple-500/10 to-violet-500/10", border: "border-purple-500/30",
    tools: [
      { id: "speech-to-text", name: "Speech to Text", nameZh: "語音轉文字", icon: Type, free: false },
      { id: "text-to-speech", name: "Text to Speech", nameZh: "文字轉語音", icon: Music, free: false },
      { id: "audio-enhance", name: "Audio Enhance", nameZh: "音頻增強", icon: Zap, free: false },
      { id: "audio-compress", name: "Compress", nameZh: "音頻壓縮", icon: Download, free: true },
      { id: "audio-convert", name: "Convert", nameZh: "格式轉換", icon: RefreshCw, free: true },
    ]
  },
  {
    name: "Code Tools", nameZh: "代碼工具", icon: Code, color: "#22C55E",
    gradient: "from-green-500/10 to-emerald-500/10", border: "border-green-500/30",
    tools: [
      { id: "code-gen", name: "Code Gen", nameZh: "代碼生成", icon: Code, free: false },
      { id: "code-review", name: "Code Review", nameZh: "代碼審查", icon: Search, free: false },
      { id: "code-explain", name: "Code Explain", nameZh: "代碼解釋", icon: FileText, free: true },
      { id: "code-fix", name: "Bug Fix", nameZh: "Bug 修復", icon: Wand2, free: false },
      { id: "code-optimize", name: "Optimize", nameZh: "性能優化", icon: Zap, free: false },
      { id: "code-convert", name: "Language Convert", nameZh: "語言轉換", icon: RefreshCw, free: false },
    ]
  },
  {
    name: "Crypto Tools", nameZh: "加密工具", icon: Lock, color: "#06B6D4",
    gradient: "from-cyan-500/10 to-sky-500/10", border: "border-cyan-500/30",
    tools: [
      { id: "encrypt", name: "Encrypt", nameZh: "文本加密", icon: Lock, free: true },
      { id: "decrypt", name: "Decrypt", nameZh: "文本解密", icon: Unlock, free: true },
      { id: "hash", name: "Hash Gen", nameZh: "Hash 生成", icon: Hash, free: true },
      { id: "base64", name: "Base64", nameZh: "Base64 編碼", icon: Code, free: true },
    ]
  }
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState(toolCategories[0]);
  const { t, lang } = useLanguage();
  
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);
  const freeTools = toolCategories.reduce((sum, cat) => 
    sum + cat.tools.filter(tool => tool.free).length, 0
  );

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader currentPage="tools" />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-medium"
            >
              🛠️ {totalTools}+ Tools · {freeTools} Free · AI-Powered
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-clip-text text-transparent">
                {t("tools.title")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto"
            >
              {t("tools.subtitle")}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {[
              { value: `${totalTools}+`, label: "Total Tools", color: "text-blue-400" },
              { value: `${freeTools}`, label: "Free Tools", color: "text-green-400" },
              { value: "6", label: "Categories", color: "text-purple-400" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-5 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)]"
              >
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-[var(--muted)]">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {toolCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  selectedCategory.name === cat.name
                    ? `bg-gradient-to-r ${cat.gradient} border ${cat.border} shadow-md`
                    : "bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)]"
                }`}
              >
                <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                <span>{lang === "zh" ? cat.nameZh : cat.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">({cat.tools.length})</span>
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {selectedCategory.tools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${selectedCategory.gradient} border ${selectedCategory.border} hover:scale-[1.03] transition-all cursor-pointer relative`}
              >
                {tool.free ? (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full border border-green-500/20 font-medium">
                      FREE
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/20 font-medium">
                      PRO
                    </span>
                  </div>
                )}
                <tool.icon 
                  className="h-7 w-7 mb-3 mx-auto" 
                  style={{ color: selectedCategory.color }}
                />
                <h3 className="text-sm font-medium text-center group-hover:text-[var(--primary)] transition-colors">
                  {lang === "zh" ? tool.nameZh : tool.name}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/15"
          >
            <Wand2 className="h-10 w-10 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                All Tools Powered by Gemini AI
              </span>
            </h3>
            <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-6">
              Each tool leverages the latest Gemini models for maximum quality. Beta users get free access to all tools.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t("nav.getStarted")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
