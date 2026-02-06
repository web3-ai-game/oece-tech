import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

  try {
    let ref = db.ref('bookmarks');
    
    // 注意：Realtime DB 的查询能力有限，复杂查询最好在客户端做或使用 Firestore
    // 这里简单获取所有数据，然后在内存中过滤（假设数据量不是特别大 < 10MB）
    // 如果数据量大，应该在 `蒸馏` 阶段存入 Firestore 或 Algolia
    
    const snapshot = await ref.once('value');
    const data = snapshot.val();

    if (!data) {
      return NextResponse.json({ bookmarks: [] });
    }

    let allBookmarks: any[] = [];

    // 数据结构可能是 { category: { id: { ... } } }
    Object.keys(data).forEach(cat => {
      if (category && cat !== category) return;
      
      const catBookmarks = data[cat];
      Object.values(catBookmarks).forEach((bm: any) => {
        allBookmarks.push({ ...bm, category: cat });
      });
    });

    // 排序：按重要性降序
    allBookmarks.sort((a, b) => (b.importance || 0) - (a.importance || 0));

    // 分页/限制
    const pagedBookmarks = allBookmarks.slice(0, limit);

    return NextResponse.json({ 
      bookmarks: pagedBookmarks,
      total: allBookmarks.length,
      categories: Object.keys(data)
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
