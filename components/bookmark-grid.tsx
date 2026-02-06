import Link from 'next/link';
import { Star, ExternalLink, Tag } from 'lucide-react';

interface Bookmark {
  title: string;
  url: string;
  description?: string;
  importance: number;
  tags?: string[];
  category: string;
  ai_summary?: string;
}

export function BookmarkGrid({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bm, index) => (
        <div 
          key={index}
          className="group relative p-6 bg-[#161B22] border border-gray-800 hover:border-[#00FF41]/50 rounded-xl transition-all hover:translate-y-[-2px] flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <span className="inline-block px-2 py-1 mb-2 text-xs font-mono text-[#00FF41] bg-[#00FF41]/10 rounded border border-[#00FF41]/20">
                {bm.category}
              </span>
              <h3 className="text-lg font-bold text-gray-100 group-hover:text-white line-clamp-2">
                {bm.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
              <span className="text-xs font-bold">{bm.importance}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
            {bm.ai_summary || bm.description || "No description available."}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
            <div className="flex gap-2 overflow-hidden">
              {bm.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs text-gray-500 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            
            <Link 
              href={bm.url} 
              target="_blank" 
              className="text-[#00FF41] hover:text-[#00FF41]/80 p-2 rounded-lg hover:bg-[#00FF41]/10 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
