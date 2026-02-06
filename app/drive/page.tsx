"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Folder, FileText, Image, Video, Music, File, 
  Upload, Download, Trash2, Share2, MoreVertical, Grid3x3, List,
  Search, Plus, Star, Clock, Zap, Database
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "AI 戰略核心.pdf",
    type: "pdf",
    size: "2.3 MB",
    modified: "2025-11-28",
    icon: FileText,
    color: "#EF4444"
  },
  {
    id: 2,
    name: "賽博神佛對話記錄",
    type: "folder",
    size: "15.6 MB",
    modified: "2025-11-27",
    icon: Folder,
    color: "#3B82F6"
  },
  {
    id: 3,
    name: "產品原型圖.png",
    type: "image",
    size: "4.2 MB",
    modified: "2025-11-26",
    icon: Image,
    color: "#8B5CF6"
  },
  {
    id: 4,
    name: "Demo 演示視頻.mp4",
    type: "video",
    size: "23.5 MB",
    modified: "2025-11-25",
    icon: Video,
    color: "#F59E0B"
  },
  {
    id: 5,
    name: "會議錄音.mp3",
    type: "audio",
    size: "8.9 MB",
    modified: "2025-11-24",
    icon: Music,
    color: "#10B981"
  },
  {
    id: 6,
    name: "代碼備份.zip",
    type: "archive",
    size: "45.2 MB",
    modified: "2025-11-23",
    icon: File,
    color: "#6B7280"
  }
];

export default function DrivePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // 改為 Token 計費模式
  const tokensUsed = 4567; // 已使用 tokens
  const tokensFree = 9999; // 免費額度
  const tokensPercent = (tokensUsed / tokensFree) * 100;
  
  // 計算成本
  const vectorCost = tokensUsed * 0.10 / 1000; // ฿0.10/1K tokens

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                My <span className="text-[var(--primary)]">Drive</span>
              </h1>
              <p className="text-sm text-[var(--muted)]">
                9999 tokens 免費向量存储 · AI-powered organization
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 bg-[var(--input-bg)] rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[var(--input-bg)]" : ""}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[var(--input-bg)]" : ""}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-400" />
                Vector Storage
              </h3>
              <span className="text-sm text-[var(--muted)]">
                {tokensUsed.toLocaleString()} / {tokensFree.toLocaleString()} tokens
              </span>
            </div>
            <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${tokensPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">
                {(tokensFree - tokensUsed).toLocaleString()} tokens 剩餘 · 免費額度
              </span>
              <span className="font-mono text-yellow-400">
                成本: ฿{vectorCost.toFixed(2)}
              </span>
            </div>
            <p className="mt-3 text-xs text-purple-400">
              💡 每個 token = 向量關鍵詞存储 · 調用 = Key × 向量庫 token 詞長度 + Pro 減免
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm hover:bg-[var(--input-bg)]">
              <Star className="h-4 w-4" />
              Starred
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm hover:bg-[var(--input-bg)]">
              <Clock className="h-4 w-4" />
              Recent
            </button>
          </div>

          {/* Files Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--input-bg)] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <file.icon className="h-10 w-10" style={{ color: file.color }} />
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--input-bg)] rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-medium mb-1 truncate">{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--input-bg)] transition-all cursor-pointer"
                >
                  <file.icon className="h-6 w-6 flex-shrink-0" style={{ color: file.color }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">{file.type}</p>
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">{file.size}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{file.modified}</div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-[var(--input-bg)] rounded">
                      <Download className="h-4 w-4 text-[var(--muted)]" />
                    </button>
                    <button className="p-2 hover:bg-[var(--input-bg)] rounded">
                      <Share2 className="h-4 w-4 text-[var(--muted)]" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <button className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-blue-500/50 transition-all text-left">
              <Plus className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">New Folder</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Organize your files</p>
            </button>
            <button className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-green-500/50 transition-all text-left">
              <Upload className="h-6 w-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Upload Files</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Drag & drop or browse</p>
            </button>
            <button className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-purple-500/50 transition-all text-left">
              <Share2 className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Share</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Collaborate with others</p>
            </button>
          </div>

          {/* AI Features */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI-Powered Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Search className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Search</h4>
                  <p className="text-xs text-[var(--muted)]">Find files by content, not just name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Folder className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto Organization</h4>
                  <p className="text-xs text-[var(--muted)]">AI suggests folder structure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Document Summary</h4>
                  <p className="text-xs text-[var(--muted)]">AI generates file summaries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vector Indexing</h4>
                  <p className="text-xs text-[var(--muted)]">All files indexed for instant recall</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-yellow-400 font-mono">
              💸 漫不經心一句話，幾萬 token 燒出去 · 全棧串聯 · 虛空取物
            </p>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
