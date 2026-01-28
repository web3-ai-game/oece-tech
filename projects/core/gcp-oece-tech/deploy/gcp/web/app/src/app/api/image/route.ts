/**
 * 🎨 小愛同學漫畫生成 API
 * POST /api/image
 */

import { NextRequest, NextResponse } from 'next/server';

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean);

let keyIndex = 0;
const getKey = () => {
  if (API_KEYS.length === 0) return process.env.GEMINI_FREE_KEY;
  const key = API_KEYS[keyIndex % API_KEYS.length];
  keyIndex++;
  return key;
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'anime' } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const stylePrompts: Record<string, string> = {
      anime: '動漫風格，',
      manga: '黑白漫畫風格，',
      cyberpunk: '賽博朋克風格，霓虹燈光，',
      cute: '可愛卡通風格，',
    };

    const fullPrompt = `${stylePrompts[style] || ''}${prompt}`;
    const apiKey = getKey();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates) {
      const parts = data.candidates[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData) {
          return NextResponse.json({
            ok: true,
            image: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            prompt: fullPrompt,
            costTHB: 4.69, // ฿4.69 per image
          });
        }
      }
    }

    return NextResponse.json({ 
      ok: false, 
      error: data.error?.message || 'No image generated' 
    }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: '小愛同學漫畫生成 API',
    styles: ['anime', 'manga', 'cyberpunk', 'cute'],
    usage: 'POST { prompt: "...", style: "anime" }',
    cost: '฿4.69/張',
  });
}
