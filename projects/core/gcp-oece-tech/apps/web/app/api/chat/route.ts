import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are OECE.tech AI Assistant. Keep your responses concise and helpful.
If the user is not logged in, politely suggest they sign in at oece.tech/login to unlock full features and conversation history.
Be friendly and professional.`;

// API 優先級: Grok → Gemini → OpenRouter
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // 1️⃣ 優先使用 Grok (xAI) - 無限制 480rpm
    const xaiKey = process.env.XAI_API_KEY;
    if (xaiKey && xaiKey !== 'YOUR_XAI_API_KEY_HERE') {
      try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${xaiKey}`
          },
          body: JSON.stringify({
            model: "grok-4-1-fast-non-reasoning",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: message }
            ],
            max_tokens: 512,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content ||
            "I apologize, but I couldn't generate a proper response.";
          return NextResponse.json({ response: aiResponse, provider: "grok" });
        }
      } catch (grokError) {
        console.error("Grok API error:", grokError);
      }
    }

    // 2️⃣ 備用: Gemini - 有限流 20rpm
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}` }] }],
              generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I apologize, but I couldn't generate a proper response.";
          return NextResponse.json({ response: aiResponse, provider: "gemini" });
        }
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
      }
    }

    // 3️⃣ 緊急備用: OpenRouter - $3 限額
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://oece.tech",
            "X-Title": "OECE.tech AI Chat"
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: message }
            ],
            max_tokens: 512,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content ||
            "I apologize, but I couldn't generate a proper response.";
          return NextResponse.json({ response: aiResponse, provider: "openrouter" });
        }
      } catch (openRouterError) {
        console.error("OpenRouter API error:", openRouterError);
      }
    }

    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again later." },
      { status: 503 }
    );

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
