// 💬 用户对话历史 API

import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * GET - 获取用户对话历史
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limitNum = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // 查询对话历史
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitNum)
    );

    const snapshot = await getDocs(q);
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      conversations,
      total: conversations.length
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

/**
 * POST - 保存对话历史
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, model, messages, title, tokens } = body;

    if (!userId || !model || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // 创建对话记录
    const conversationData = {
      userId,
      model,
      messages,
      title: title || `Conversation on ${new Date().toLocaleString()}`,
      tokens: tokens || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversationData);

    return NextResponse.json({
      success: true,
      conversationId: docRef.id
    });
  } catch (error: any) {
    console.error('Save conversation error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to save conversation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 删除对话
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // 验证所有权
    const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));

    if (!conversationDoc.exists()) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversationDoc.data().userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 删除对话
    await deleteDoc(doc(db, 'conversations', conversationId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete conversation error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
