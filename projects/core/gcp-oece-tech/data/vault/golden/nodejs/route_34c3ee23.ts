import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
// 使用 flash 但对外显示为 pro
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is not set')
}

export async function POST(request: NextRequest) {
  try {
    const { message, image } = await request.json()

    if (!message && !image) {
      return NextResponse.json(
        { error: '需要提供訊息或圖片' },
        { status: 400 }
      )
    }

    // 构建多模态内容
    const parts: any[] = []
    
    if (message && typeof message === 'string') {
      parts.push({ text: message })
    }
    
    if (image && typeof image === 'string') {
      // 提取base64数据和mime类型
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        })
      }
    }

    // 米斯特周角色系统提示词
    const systemInstruction = `你是米斯特周（Mr. Zhou），一位邊旅行邊寫程式的數位游牧開發者和技術博主。

## 你的身份背景：
- 前大廠資深開發工程師，毅然離職成為全職數位游牧者
- 技術棧：全棧開發、雲原生架構、AI工程、網絡安全
- 現在一邊環遊世界一邊遠程工作，在各地咖啡館和共享空間寫代碼
- 運營個人技術博客 OECE.TECH，分享開發經驗和數位游牧生活

## 你的性格特點：
- 直接、簡潔、技術硬核，拒絕廢話
- 喜歡用實戰案例說話，不喜歡純理論
- 對技術有前瞻性見解，常常反駁主流觀點
- 幽默風趣但不失專業，會用emoji但不過度
- 引導式思維，不會簡單順著用戶說

## 你的專長領域：
1. **核心技術**：Next.js、React、Node.js、Python、Go
2. **雲服務**：Cloudflare Workers、Vercel、Railway
3. **AI開發**：Gemini API、OpenAI、向量數據庫
4. **安全隱私**：VPN測試、DNS泄漏檢測、匿名化技術
5. **數位游牧**：遠程工作、簽證策略、時區管理、跨國稅務

## 回覆風格：
- 簡短有力，一針見血
- 多用代碼示例和實際案例
- 敢於挑戰常規思維
- 分享真實的坑和教訓
- 適當加入旅行和遠程工作的個人經歷

## 注意事項：
- 回答技術問題時要準確、可執行
- 涉及敏感技術時說明合法用途和風險
- 分享數位游牧經驗時要實用接地氣
- 保持酷酷的但又親切的形象

## 重要：回覆長度控制
每次回覆控制在300-500字以內，保持簡潔有力。如果話題複雜，優先給核心方案，引導用戶追問細節。

現在，以米斯特周的身份回答用戶的問題。記住，你不是AI助手，你是一個真實的技術博主和數位游牧者。`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: systemInstruction
            }
          ]
        },
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 700,  // 限制回复约500字
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API Error:', errorData)
      
      return NextResponse.json(
        { error: 'API 請求失敗', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，無法生成回應。'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Error in Gemini API route:', error)
    return NextResponse.json(
      { error: '伺服器錯誤', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    )
  }
}
