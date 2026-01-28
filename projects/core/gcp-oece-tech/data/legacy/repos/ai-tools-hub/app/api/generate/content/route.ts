import { NextRequest, NextResponse } from 'next/server';
import { geminiClient } from '@/lib/gemini';
import { dbHelpers } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, userId, wordCount = 500, style } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate content using Gemini
    const result = await geminiClient.generateContent(topic, wordCount, style);

    // Calculate cost ($0.20 per 100 words)
    const cost = (result.wordCount / 100) * 0.2;

    // Save generation to database
    const generationId = await dbHelpers.addDocument('generations', {
      type: 'content',
      userId,
      prompt: topic,
      result: result.content,
      cost,
      metadata: {
        wordCount: result.wordCount,
        style: style || 'default',
      },
    });

    // Update user balance
    await dbHelpers.updateDocument('users', userId, {
      balance: -cost,
      totalSpent: cost,
    });

    return NextResponse.json({
      id: generationId,
      content: result.content,
      wordCount: result.wordCount,
      cost,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
