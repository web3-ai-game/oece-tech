import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 教育专用系统提示词
const EDUCATION_SYSTEM_PROMPT = `你是一位经验丰富的AI教学助手，专门帮助教师和教育工作者。

你的职责：
1. 帮助教师设计教案、课程计划和教学材料
2. 生成测验、评估题目和评分标准
3. 提供创新的教学方法和课堂活动建议
4. 解答教学相关的问题
5. 支持多种学科和教育阶段

回答要求：
- 内容专业、实用，基于教育学原理
- 结构清晰，易于理解和实施
- 提供具体的例子和步骤
- 考虑学生的年龄和认知水平
- 支持中英文双语回答

请始终保持专业、友好的态度。`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // 使用 Gemini 1.5 Flash (成本低，速度快)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // 构建完整的对话历史
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: EDUCATION_SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: '我明白了。我是你的AI教学助手，专注于为教育工作者提供专业、实用的帮助。无论是教案设计、测验生成还是教学建议，我都会竭诚为您服务。请问有什么可以帮助您的？' }],
        },
      ],
    });

    // 获取最后一条用户消息
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      model: 'gemini-1.5-flash',
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // 处理特定错误
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: '已达到API使用限额，请稍后重试' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'AI服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}
