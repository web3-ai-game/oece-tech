// 📝 论坛帖子 API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase/client';

/**
 * GET - 获取帖子列表
 */
export async function GET(request: NextRequest) {
  try {
    // 獲取 supabase client
    const supabase = getSupabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 构建查询
    let query = supabase
      .from(TABLES.POSTS)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 按分区过滤
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      posts: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error: any) {
    console.error('Get posts error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST - 创建新帖子
 */
export async function POST(request: NextRequest) {
  try {
    // 獲取 supabase client
    const supabase = getSupabase();

    const body = await request.json();
    const { userId, userName, title, content, category, tags } = body;

    // 验证参数
    if (!userId || !userName || !title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 创建帖子
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .insert({
        user_id: userId,
        user_name: userName,
        title,
        content,
        category,
        tags: tags || []
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      post: data
    });
  } catch (error: any) {
    console.error('Create post error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
