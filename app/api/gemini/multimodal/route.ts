// 🎨 Gemini 多模态 API（文本 + 图片）

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiMultimodal } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/gemini/rate-limit';
import { GeminiModelKey, GEMINI_MODELS } from '@/lib/gemini/config';

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const {
      model = 'gemini-flash',
      prompt,
      imageBase64,
      mimeType = 'image/jpeg'
    } = body;

    // 验证参数
    if (!prompt || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing prompt or imageBase64' },
        { status: 400 }
      );
    }

    // 验证模型
    if (!GEMINI_MODELS[model as GeminiModelKey]) {
      return NextResponse.json(
        { error: 'Invalid model' },
        { status: 400 }
      );
    }

    // 获取用户 IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // 检查限流
    const rateLimitResult = await checkRateLimit(ip, model as GeminiModelKey);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset
        },
        { status: 429 }
      );
    }

    // 调用多模态 API
    const response = await callGeminiMultimodal(
      model as GeminiModelKey,
      prompt,
      imageBase64,
      mimeType
    );

    // 返回响应
    return NextResponse.json({
      response: response.text,
      usage: response.usage,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
        limit: rateLimitResult.limit
      }
    });
  } catch (error: any) {
    console.error('Gemini Multimodal API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
