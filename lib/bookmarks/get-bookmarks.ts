import { db } from '@/lib/firebase-admin';

export async function getBookmarks(limit = 100, category?: string) {
  try {
    const ref = db.ref('bookmarks');
    const snapshot = await ref.once('value');
    const data = snapshot.val();

    if (!data) return [];

    let allBookmarks: any[] = [];

    Object.keys(data).forEach(cat => {
      if (category && cat !== category) return;
      
      const catBookmarks = data[cat];
      Object.values(catBookmarks).forEach((bm: any) => {
        allBookmarks.push({ ...bm, category: cat });
      });
    });

    // Sort by importance
    allBookmarks.sort((a, b) => (b.importance || 0) - (a.importance || 0));

    return allBookmarks.slice(0, limit);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}
