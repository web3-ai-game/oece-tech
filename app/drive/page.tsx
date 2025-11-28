"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Folder, FileText, Image, Video, Music, File, 
  Upload, Download, Trash2, Share2, MoreVertical, Grid3x3, List,
  Search, Plus, Star, Clock, Zap
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

  const totalSize = files.reduce((sum, file) => {
    const size = parseFloat(file.size);
    return sum + size;
  }, 0);

  const storageLimit = 100; // MB
  const storageUsed = totalSize;
  const storagePercent = (storageUsed / storageLimit) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:opacity-90">
              <Upload className="h-4 w-4" />
              Upload
            </button>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                My <span className="text-[var(--primary)]">Drive</span>
              </h1>
              <p className="text-sm text-gray-400">
                100 MB free storage · AI-powered organization
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white/10" : ""}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white/10" : ""}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Storage</h3>
              <span className="text-sm text-gray-400">
                {storageUsed.toFixed(1)} MB / {storageLimit} MB
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  storagePercent > 90 ? "bg-red-500" :
                  storagePercent > 70 ? "bg-yellow-500" :
                  "bg-green-500"
                }`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {(storageLimit - storageUsed).toFixed(1)} MB remaining · 
              {storagePercent > 90 && " ⚠️ Storage almost full"}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[var(--primary)] outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10">
              <Star className="h-4 w-4" />
              Starred
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10">
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
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <file.icon className="h-10 w-10" style={{ color: file.color }} />
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-medium mb-1 truncate">{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <file.icon className="h-6 w-6 flex-shrink-0" style={{ color: file.color }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500">{file.type}</p>
                  </div>
                  <div className="text-xs text-gray-500">{file.size}</div>
                  <div className="text-xs text-gray-500">{file.modified}</div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-white/10 rounded">
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded">
                      <Share2 className="h-4 w-4 text-gray-400" />
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
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all text-left">
              <Plus className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">New Folder</h3>
              <p className="text-xs text-gray-500">Organize your files</p>
            </button>
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all text-left">
              <Upload className="h-6 w-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Upload Files</h3>
              <p className="text-xs text-gray-500">Drag & drop or browse</p>
            </button>
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all text-left">
              <Share2 className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Share</h3>
              <p className="text-xs text-gray-500">Collaborate with others</p>
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
                  <p className="text-xs text-gray-400">Find files by content, not just name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Folder className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto Organization</h4>
                  <p className="text-xs text-gray-400">AI suggests folder structure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Document Summary</h4>
                  <p className="text-xs text-gray-400">AI generates file summaries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vector Indexing</h4>
                  <p className="text-xs text-gray-400">All files indexed for instant recall</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-yellow-400 font-mono">
              💸 漫不經心一句話，幾萬 token 燒出去 · 全棧串聯 · 虛空取物
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
