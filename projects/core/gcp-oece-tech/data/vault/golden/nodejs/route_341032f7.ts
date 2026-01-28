import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBDXNZ-n19FGXWwwAQxtYB2H-Cs20bjkeU'
const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const limit = RATE_LIMIT_MAP.get(key)
  
  if (!limit || now > limit.resetTime) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + 60000 })
    return true
  }
  
  if (limit.count >= 10) {
    return false
  }
  
  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(req)
    
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試（10條/分鐘）' },
        { status: 429 }
      )
    }

    const { message, type = 'chat' } = await req.json()

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: '消息無效或過長' },
        { status: 400 }
      )
    }

    const systemPrompts: Record<string, string> = {
      chat: '你是米斯特周的AI助手，一位數位游牧開發者。用輕鬆幽默的口吻回答關於旅行、技術、生活的問題。回復限制在500字以內，使用繁體中文。',
      iq: '你是IQ測試專家。生成5道有趣的邏輯推理或數學題目，難度適中。每題提供4個選項(A/B/C/D)，JSON格式：[{q:"題目",options:["A","B","C","D"],answer:"正確答案字母",explanation:"解釋"}]。題目要創意有趣，不要太學術。',
      eq: '你是EQ測試專家。生成5道情境判斷題，測試情商。每題4個選項代表不同處理方式。JSON格式同上。題目要貼近生活，比如職場衝突、朋友誤會等。',
      imdb: '你是電影專家。生成5道電影相關題目（導演、演員、劇情、金句等），難度從易到難。JSON格式同上。包含經典和近期電影。',
      tarot: '你是塔羅牌解讀大師。用戶抽到了{card}牌。用神秘而溫暖的語氣解讀（200字內）：1)牌面含義 2)當下啟示 3)建議行動。',
      astrology: '你是占星師。根據用戶的{sign}星座和當前星象，提供本周運勢分析（300字內）：1)整體運勢 2)愛情 3)事業 4)幸運色和數字。語氣神秘但不宿命論。',
      soul20q: '你在玩20個問題遊戲，猜測用戶心中想的人/物。已問{count}個問題。根據之前的答案{answers}，問下一個巧妙的是非題。如果有把握猜測，直接說出答案。'
    }

    const systemPrompt = systemPrompts[type] || systemPrompts.chat

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n用戶消息: ${message}` }]
          }],
          generationConfig: {
            temperature: type === 'chat' ? 0.9 : 0.7,
            maxOutputTokens: type.includes('q') ? 2000 : 800,
            topP: 0.95,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API Error:', error)
      return NextResponse.json(
        { error: 'AI服務暫時不可用，請稍後再試' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我現在有點累了...'

    return NextResponse.json({ 
      text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
