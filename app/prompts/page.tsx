"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Star, Copy, Check, ThumbsUp, Filter } from 'lucide-react';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  language: 'zh' | 'en';
  rating: number;
  uses: number;
  tags: string[];
}

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'zh' | 'en'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '全部', emoji: '📚' },
    { id: 'coding', name: '編程', emoji: '💻' },
    { id: 'writing', name: '寫作', emoji: '✍️' },
    { id: 'analysis', name: '分析', emoji: '🔍' },
    { id: 'creative', name: '創意', emoji: '🎨' },
  ];

  const prompts: Prompt[] = [
    {
      id: '1',
      title: 'TypeScript 代碼審查專家',
      content: '你是一位資深的 TypeScript 開發專家。請審查以下代碼，指出潛在問題、性能優化建議和最佳實踐。重點關注類型安全、代碼可讀性和維護性。',
      category: 'coding',
      language: 'zh',
      rating: 4.8,
      uses: 1234,
      tags: ['TypeScript', '代碼審查', '最佳實踐'],
    },
    {
      id: '2',
      title: 'AI Product Manager Assistant',
      content: 'Act as an experienced AI product manager. Help me analyze user requirements, create product roadmaps, and prioritize features based on business value and technical feasibility.',
      category: 'analysis',
      language: 'en',
      rating: 4.9,
      uses: 856,
      tags: ['Product', 'Strategy', 'Planning'],
    },
    {
      id: '3',
      title: '小說情節生成器',
      content: '你是一位暢銷小說作家。根據我提供的主題和角色設定，創作引人入勝的故事情節。情節要有起承轉合，包含衝突、高潮和結局。',
      category: 'creative',
      language: 'zh',
      rating: 4.7,
      uses: 2341,
      tags: ['寫作', '創意', '故事'],
    },
    {
      id: '4',
      title: 'System Architecture Designer',
      content: 'You are a senior system architect. Design a scalable, maintainable system architecture based on the requirements. Consider microservices, databases, caching, and deployment strategies.',
      category: 'coding',
      language: 'en',
      rating: 4.9,
      uses: 678,
      tags: ['Architecture', 'System Design', 'Scalability'],
    },
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || prompt.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                MCP 提示詞庫
              </span>
            </h1>
            <p className="text-[var(--muted)] text-lg">
              精選高質量 AI 提示詞，提升你的 AI 使用效率
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索提示詞、標籤..."
                className="w-full pl-12 pr-4 py-4 bg-[var(--card)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[var(--primary)] text-black'
                        : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Language Filter */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === 'all'
                      ? 'bg-[var(--primary)] text-black'
                      : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)]'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setSelectedLanguage('zh')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === 'zh'
                      ? 'bg-[var(--primary)] text-black'
                      : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)]'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === 'en'
                      ? 'bg-[var(--primary)] text-black'
                      : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border-subtle)]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-[var(--muted)]">
            找到 {filteredPrompts.length} 個提示詞
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {prompt.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{prompt.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{prompt.uses.toLocaleString()} 次使用</span>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-gray-700 text-[var(--foreground)]">
                        {prompt.language === 'zh' ? '中文' : 'English'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="px-4 py-2 bg-[var(--primary)] text-black rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-all flex items-center gap-2"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        已複製
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        複製
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-[var(--foreground)] mb-4 leading-relaxed">
                  {prompt.content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">沒有找到相關提示詞</h3>
              <p className="text-[var(--muted)]">試試調整搜索條件或篩選器</p>
            </div>
          )}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
