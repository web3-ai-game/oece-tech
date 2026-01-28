import { geminiFlash } from '@/lib/gemini/client';
import {
  createCostOfLivingPrompt,
  CostOfLivingResult,
} from '@/lib/gemini/prompts/cost-of-living';

export type CostOfLivingOutput = CostOfLivingResult;

export interface CostOfLivingInput {
  cities: string[];
}

/**
 * 生活成本分析AI工具
 * 使用Gemini Flash模型对比城市生活成本
 */
export async function analyzeCostOfLiving(
  input: CostOfLivingInput
): Promise<CostOfLivingOutput> {
  try {
    // 验证输入
    if (!input.cities || input.cities.length < 2) {
      throw new Error('Please provide at least 2 cities to compare');
    }

    if (input.cities.length > 5) {
      throw new Error('Maximum 5 cities can be compared at once');
    }

    // 创建prompt
    const prompt = createCostOfLivingPrompt(input.cities);

    // 调用Gemini API
    const result = await geminiFlash.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析JSON响应
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const data: CostOfLivingResult = JSON.parse(cleanedText);

    // 验证数据结构
    if (!data.summary || !Array.isArray(data.cities) || !data.recommendations) {
      throw new Error('Invalid response format from AI');
    }

    // 验证城市数量匹配
    if (data.cities.length === 0) {
      throw new Error('No city data returned from AI');
    }

    return data;
  } catch (error) {
    console.error('Error in analyzeCostOfLiving:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to analyze cost of living: ${error.message}`);
    }
    throw new Error('Failed to analyze cost of living. Please try again.');
  }
}
