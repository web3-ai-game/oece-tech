// Grok API Proxy - AI Companion Chat
// 避免在前端暴露 API Key

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, model = 'grok-4', temperature = 0.7, max_tokens = 4000 } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // 調用 Grok API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Grok API error:', error);
      return NextResponse.json(
        { error: 'Grok API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // TODO: 保存對話歷史到 Supabase
    // await saveConversation(userId, messages, data.choices[0].message);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Companion chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
