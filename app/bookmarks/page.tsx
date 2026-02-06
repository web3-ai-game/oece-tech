import { getBookmarks } from '@/lib/bookmarks/get-bookmarks';
import { BookmarkGrid } from '@/components/bookmark-grid';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const revalidate = 3600; // 每小时重新验证

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks(100);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 pointer-events-none" />
      
      <SharedHeader currentPage="tools" />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#00FF41] to-cyan-400 bg-clip-text text-transparent">
                Curated AI Knowledge Base
              </span>
            </h1>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Distilled knowledge from 1000+ sources, powered by Grok 4.1 & Gemini
            </p>
          </div>

          <BookmarkGrid bookmarks={bookmarks} />
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
