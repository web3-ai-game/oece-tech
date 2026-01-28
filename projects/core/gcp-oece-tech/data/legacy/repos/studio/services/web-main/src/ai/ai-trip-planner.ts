import { getModelByMode } from '@/lib/gemini/client';
import {
  createTripPlannerPrompt,
  TripPlannerResult,
} from '@/lib/gemini/prompts/trip-planner';

export type TripPlannerOutput = TripPlannerResult;

export interface TripPlannerInput {
  destination: string;
  duration: string;
  budget: string;
  interests: string;
  aiMode: 'quick' | 'standard' | 'detailed';
  language?: string;
}

/**
 * 行程规划AI工具
 * 使用Gemini Flash模型生成个性化旅行计划
 */
export async function planTrip(
  input: TripPlannerInput
): Promise<TripPlannerOutput> {
  try {
    // 验证输入
    if (!input.destination || input.destination.trim().length < 2) {
      throw new Error('Please provide a valid destination');
    }

    // 根据模式选择模型
    const model = getModelByMode(input.aiMode);
    
    // 创建prompt
    const prompt = createTripPlannerPrompt(input);

    // 调用Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析JSON响应
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const data: TripPlannerResult = JSON.parse(cleanedText);

    // 验证数据结构
    if (!data.overview || !Array.isArray(data.dailyItinerary) || !data.budgetBreakdown) {
      throw new Error('Invalid response format from AI');
    }

    return data;
  } catch (error) {
    console.error('Error in planTrip:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate trip plan: ${error.message}`);
    }
    throw new Error('Failed to generate trip plan. Please try again.');
  }
}
