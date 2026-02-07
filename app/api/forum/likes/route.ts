// ❤️ 论坛点赞 API (遷移到 Firestore)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, query, where, getDoc, updateDoc, doc } from 'firebase/firestore';

// 集合名稱
const LIKES_COLLECTION = 'forum_likes';
const POSTS_COLLECTION = 'forum_posts';
const REPLIES_COLLECTION = 'forum_replies';

/**
 * POST - 点赞/取消点赞
 */
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const body = await request.json();
    const { userId, targetType, targetId } = body;

    // 验证参数
    if (!userId || !targetType || !targetId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['post', 'reply'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid target type' },
        { status: 400 }
      );
    }

    // 检查是否已点赞
    const q = query(
      collection(db, LIKES_COLLECTION),
      where('user_id', '==', userId),
      where('target_type', '==', targetType),
      where('target_id', '==', targetId)
    );
    const snapshot = await getDocs(q);
    const existingLike = snapshot.docs[0];

    if (existingLike) {
      // 取消点赞
      await deleteDoc(existingLike.ref);

      // 更新点赞数
      const table = targetType === 'post' ? POSTS_COLLECTION : REPLIES_COLLECTION;
      const targetDocRef = doc(db, table, targetId);
      const targetSnap = await getDoc(targetDocRef);
      if (targetSnap.exists()) {
        await updateDoc(targetDocRef, {
          likes_count: Math.max(0, (targetSnap.data().likes_count || 1) - 1)
        });
      }

      return NextResponse.json({
        success: true,
        action: 'unliked'
      });
    } else {
      // 点赞
      await addDoc(collection(db, LIKES_COLLECTION), {
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
        created_at: new Date().toISOString()
      });

      // 更新点赞数
      const table = targetType === 'post' ? POSTS_COLLECTION : REPLIES_COLLECTION;
      const targetDocRef = doc(db, table, targetId);
      const targetSnap = await getDoc(targetDocRef);
      if (targetSnap.exists()) {
        await updateDoc(targetDocRef, {
          likes_count: (targetSnap.data().likes_count || 0) + 1
        });
      }

      return NextResponse.json({
        success: true,
        action: 'liked'
      });
    }
  } catch (error: any) {
    console.error('Like/Unlike error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to process like' },
      { status: 500 }
    );
  }
}
