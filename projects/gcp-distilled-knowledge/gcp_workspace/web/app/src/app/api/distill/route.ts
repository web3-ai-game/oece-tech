/**
 * 🧠 知識蒸餾 API
 * POST /api/distill
 */

import { NextRequest, NextResponse } from 'next/server';

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean);

const FREE_KEY = process.env.GEMINI_FREE_KEY;

let keyIndex = 0;
const getKey = () => {
  if (API_KEYS.length === 0) return FREE_KEY;
  const key = API_KEYS[keyIndex % API_KEYS.length];
  keyIndex++;
  return key;
};

// 蒸餾模式配置
const MODES: Record<string, { model: string; temp: number }> = {
  cold: { model: 'gemini-2.5-flash-lite', temp: 0.1 },
  vector: { model: 'gemini-2.5-flash', temp: 0.7 },
  hot: { model: 'gemini-2.5-pro', temp: 1.2 },
  distill: { model: 'gemini-2.5-flash', temp: 0.5 },
};

export async function POST(request: NextRequest) {
  try {
    const { content, mode = 'vector' } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const config = MODES[mode] || MODES.vector;
    const apiKey = getKey();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `蒸餾提取核心知識：\n\n${content}` }] }],
          generationConfig: {
            temperature: config.temp,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates) {
      const text = data.candidates[0]?.content?.parts?.[0]?.text || '';
      const usage = data.usageMetadata || {};
      
      return NextResponse.json({
        ok: true,
        result: text,
        model: config.model,
        mode,
        tokens: {
          input: usage.promptTokenCount || 0,
          output: usage.candidatesTokenCount || 0,
        },
      });
    } else {
      return NextResponse.json({ 
        ok: false, 
        error: data.error?.message || 'API Error' 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: '知識蒸餾 API',
    modes: Object.keys(MODES),
    usage: 'POST { content: "...", mode: "cold|vector|hot|distill" }',
  });
}
