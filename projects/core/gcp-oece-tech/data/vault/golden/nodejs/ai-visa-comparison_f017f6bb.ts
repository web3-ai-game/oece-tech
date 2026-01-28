import { geminiFlash } from '@/lib/gemini/client';
import {
  createVisaComparisonPrompt,
  VisaComparisonResult,
} from '@/lib/gemini/prompts/visa-comparison';

export type VisaComparisonOutput = VisaComparisonResult;

export interface VisaComparisonInput {
  nationality: string;
}

/**
 * 签证对比AI工具
 * 使用Gemini Flash模型生成多国签证对比
 */
export async function compareVisas(
  input: VisaComparisonInput
): Promise<VisaComparisonOutput> {
  try {
    // 创建prompt
    const prompt = createVisaComparisonPrompt(input.nationality);

    // 调用Gemini API
    const result = await geminiFlash.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析JSON响应
    // 清理可能的markdown代码块
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const data: VisaComparisonResult = JSON.parse(cleanedText);

    // 验证数据结构
    if (!data.introduction || !Array.isArray(data.visaOptions)) {
      throw new Error('Invalid response format from AI');
    }

    return data;
  } catch (error) {
    console.error('Error in compareVisas:', error);
    
    // 返回友好的错误信息
    if (error instanceof Error) {
      throw new Error(`Failed to generate visa comparison: ${error.message}`);
    }
    throw new Error('Failed to generate visa comparison. Please try again.');
  }
}
