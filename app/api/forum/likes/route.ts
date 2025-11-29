// ❤️ 论坛点赞 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase/client';

/**
 * POST - 点赞/取消点赞
 */
export async function POST(request: NextRequest) {
  try {
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
    const { data: existingLike } = await supabase
      .from(TABLES.LIKES)
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single();

    if (existingLike) {
      // 取消点赞
      await supabase
        .from(TABLES.LIKES)
        .delete()
        .eq('id', existingLike.id);

      // 更新点赞数
      const table = targetType === 'post' ? TABLES.POSTS : TABLES.REPLIES;
      const { data: target } = await supabase
        .from(table)
        .select('likes_count')
        .eq('id', targetId)
        .single();

      if (target) {
        await supabase
          .from(table)
          .update({ likes_count: Math.max(0, (target.likes_count || 1) - 1) })
          .eq('id', targetId);
      }

      return NextResponse.json({
        success: true,
        action: 'unliked'
      });
    } else {
      // 点赞
      await supabase
        .from(TABLES.LIKES)
        .insert({
          user_id: userId,
          target_type: targetType,
          target_id: targetId
        });

      // 更新点赞数
      const table = targetType === 'post' ? TABLES.POSTS : TABLES.REPLIES;
      const { data: target } = await supabase
        .from(table)
        .select('likes_count')
        .eq('id', targetId)
        .single();

      if (target) {
        await supabase
          .from(table)
          .update({ likes_count: (target.likes_count || 0) + 1 })
          .eq('id', targetId);
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
