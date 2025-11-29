// 💰 用户 Token 统计 API

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * GET - 获取用户 Token 使用统计
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // 获取用户数据
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      tokens: userData.tokens || 9999,
      tokensUsed: userData.tokensUsed || 0,
      tier: userData.tier || 'beta',
      lastUpdated: userData.updatedAt || new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Get tokens error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

/**
 * POST - 扣除用户 Tokens
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, operation = 'deduct' } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // 更新 Token 余额
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentTokens = userDoc.data().tokens || 0;

    if (operation === 'deduct') {
      // 扣除 Tokens
      if (currentTokens < amount) {
        return NextResponse.json(
          { error: 'Insufficient tokens' },
          { status: 400 }
        );
      }

      await updateDoc(userRef, {
        tokens: increment(-amount),
        tokensUsed: increment(amount),
        updatedAt: new Date().toISOString()
      });
    } else if (operation === 'add') {
      // 增加 Tokens
      await updateDoc(userRef, {
        tokens: increment(amount),
        updatedAt: new Date().toISOString()
      });
    }

    // 返回更新后的余额
    const updatedDoc = await getDoc(userRef);
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      tokens: updatedData?.tokens || 0,
      tokensUsed: updatedData?.tokensUsed || 0
    });
  } catch (error: any) {
    console.error('Update tokens error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to update tokens' },
      { status: 500 }
    );
  }
}
