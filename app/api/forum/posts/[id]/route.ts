// 📝 单个帖子 API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase/client';

/**
 * GET - 获取单个帖子
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 獲取 supabase client
    const supabase = getSupabase();

    const { id } = await params;

    // 获取帖子
    const { data: post, error } = await supabase
      .from(TABLES.POSTS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // 增加浏览量
    await supabase
      .from(TABLES.POSTS)
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Get post error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 删除帖子
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 獲取 supabase client
    const supabase = getSupabase();

    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // 验证所有权
    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select('user_id')
      .eq('id', id)
      .single();

    if (post?.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 删除帖子
    const { error } = await supabase
      .from(TABLES.POSTS)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
