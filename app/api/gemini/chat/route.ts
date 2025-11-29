// 🤖 Gemini 聊天 API（非流式）

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, type ChatMessage } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/gemini/rate-limit';
import { GeminiModelKey, GEMINI_MODELS } from '@/lib/gemini/config';
import { calculateCost } from '@/lib/pricing-pool';

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const {
      model = 'gemini-lite',
      message,
      messages,
      systemInstruction,
      temperature,
      maxTokens
    } = body;

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

    // 构建消息历史
    let chatMessages: ChatMessage[];

    if (messages) {
      // 如果提供了完整的消息历史
      chatMessages = messages;
    } else if (message) {
      // 如果只提供了单条消息
      chatMessages = [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];
    } else {
      return NextResponse.json(
        { error: 'Missing message or messages' },
        { status: 400 }
      );
    }

    // 调用 Gemini API
    const response = await callGemini({
      model: model as GeminiModelKey,
      messages: chatMessages,
      systemInstruction,
      temperature,
      maxTokens
    });

    // 计算成本
    const modelKey = model === 'gemini-flash' ? 'gemini-flash' :
                     model === 'gemini-pro' ? 'cyber-sage' :
                     'gemini-lite';

    const cost = response.usage
      ? calculateCost(response.usage.totalTokens, modelKey as any)
      : 0;

    // 返回响应
    return NextResponse.json({
      response: response.text,
      usage: response.usage,
      cost: {
        tokens: response.usage?.totalTokens || 0,
        thb: cost
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
        limit: rateLimitResult.limit
      }
    });
  } catch (error: any) {
    console.error('Gemini Chat API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
