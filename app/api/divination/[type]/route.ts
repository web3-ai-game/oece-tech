// 🔮 算命 API（5种占卜类型）

import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/gemini/rate-limit';
import { getDivinationPrompt, type DivinationType } from '@/lib/divination/prompts';

const VALID_TYPES: DivinationType[] = ['tarot', 'astrology', 'iching', 'dream', 'love'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // 验证占卜类型
    if (!VALID_TYPES.includes(type as DivinationType)) {
      return NextResponse.json(
        { error: 'Invalid divination type' },
        { status: 400 }
      );
    }

    // 获取请求体
    const body = await request.json();
    const { question, birthDate, gender } = body;

    // 验证参数
    if (!question) {
      return NextResponse.json(
        { error: 'Question required' },
        { status: 400 }
      );
    }

    // 获取用户 IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // 检查限流（使用 gemini-pro 模型）
    const rateLimitResult = await checkRateLimit(ip, 'gemini-pro');

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

    // 获取占卜的 System Prompt
    const systemInstruction = getDivinationPrompt(type as DivinationType);

    // 构建完整的问题
    let fullQuestion = question;

    if (birthDate) {
      fullQuestion += `\n\n生日: ${birthDate}`;
    }

    if (gender) {
      fullQuestion += `\n性别: ${gender}`;
    }

    // 调用 Gemini API（使用最强模型 gemini-pro）
    const response = await callGemini({
      model: 'gemini-pro',
      messages: [
        {
          role: 'user',
          parts: [{ text: fullQuestion }]
        }
      ],
      systemInstruction,
      temperature: 0.9, // 更高的创造性
      maxTokens: 2048
    });

    // 返回响应
    return NextResponse.json({
      type,
      question,
      response: response.text,
      usage: response.usage,
      cost: {
        tokens: response.usage?.totalTokens || 0,
        thb: 7.00 // 固定价格（赛博神佛）
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
        limit: rateLimitResult.limit
      }
    });
  } catch (error: any) {
    console.error('Divination API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
