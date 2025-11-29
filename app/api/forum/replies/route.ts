// 💬 论坛回复 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase/client';

/**
 * GET - 获取回复列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      );
    }

    // 获取回复
    const { data, error } = await supabase
      .from(TABLES.REPLIES)
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ replies: data });
  } catch (error: any) {
    console.error('Get replies error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

/**
 * POST - 创建回复
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, userName, content } = body;

    // 验证参数
    if (!postId || !userId || !userName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 创建回复
    const { data, error } = await supabase
      .from(TABLES.REPLIES)
      .insert({
        post_id: postId,
        user_id: userId,
        user_name: userName,
        content
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 更新帖子的回复数
    await supabase.rpc('increment_replies_count', { post_id: postId });

    return NextResponse.json({
      success: true,
      reply: data
    });
  } catch (error: any) {
    console.error('Create reply error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to create reply' },
      { status: 500 }
    );
  }
}
