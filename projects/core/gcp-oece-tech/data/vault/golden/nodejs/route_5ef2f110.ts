import { NextRequest, NextResponse } from 'next/server';
import { geminiClient } from '@/lib/gemini';
import { dbHelpers } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, userId, duration = 30 } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate video using Gemini
    const result = await geminiClient.generateVideo(description, duration);

    // Calculate cost ($2.00 per 30 seconds)
    const cost = (duration / 30) * 2.0;

    // Save generation to database
    const generationId = await dbHelpers.addDocument('generations', {
      type: 'video',
      userId,
      prompt: description,
      result: result.url,
      cost,
      metadata: {
        storyboard: result.storyboard,
        duration,
        format: 'mp4',
      },
    });

    // Update user balance
    await dbHelpers.updateDocument('users', userId, {
      balance: -cost,
      totalSpent: cost,
    });

    return NextResponse.json({
      id: generationId,
      videoUrl: result.url,
      storyboard: result.storyboard,
      duration,
      cost,
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
