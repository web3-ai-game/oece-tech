// 🌊 Gemini 流式聊天 API（Server-Sent Events）

import { NextRequest } from 'next/server';
import { callGeminiStream, type ChatMessage } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/gemini/rate-limit';
import { GeminiModelKey, GEMINI_MODELS } from '@/lib/gemini/config';

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
      return new Response(
        JSON.stringify({ error: 'Invalid model' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取用户 IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // 检查限流
    const rateLimitResult = await checkRateLimit(ip, model as GeminiModelKey);

    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 构建消息历史
    let chatMessages: ChatMessage[];

    if (messages) {
      chatMessages = messages;
    } else if (message) {
      chatMessages = [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];
    } else {
      return new Response(
        JSON.stringify({ error: 'Missing message or messages' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 调用 Gemini API（流式）
    const stream = await callGeminiStream({
      model: model as GeminiModelKey,
      messages: chatMessages,
      systemInstruction,
      temperature,
      maxTokens
    });

    // 创建 SSE 响应流
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);

        // 解析 SSE 数据
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              // 提取文本内容
              const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

              if (content) {
                // 发送 SSE 事件
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                );
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    });

    // 返回 SSE 流
    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error: any) {
    console.error('Gemini Stream API error:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
