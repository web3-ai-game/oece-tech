// 🤖 Telegram Bot Webhook API

import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini/client';

/**
 * POST - 处理 Telegram Webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, callback_query } = body;

    // 处理普通消息
    if (message) {
      const chatId = message.chat.id;
      const text = message.text;
      const userId = message.from.id.toString();

      if (!text) {
        return NextResponse.json({ ok: true });
      }

      // 使用 Gemini API 生成回复
      const response = await callGemini({
        model: 'gemini-flash',
        messages: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        systemInstruction: '你是一个友好的AI助手，使用简洁、幽默的语言回复用户。',
        temperature: 0.8
      });

      // 发送回复到 Telegram
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: response.text,
            parse_mode: 'Markdown'
          })
        });
      }

      return NextResponse.json({ ok: true });
    }

    // 处理回调查询
    if (callback_query) {
      // TODO: 处理按钮点击
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Telegram webhook error:', error);

    return NextResponse.json({ ok: false, error: error.message });
  }
}

/**
 * GET - 验证 Webhook（Telegram 会发送 GET 请求验证）
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Webhook active',
    timestamp: new Date().toISOString()
  });
}
