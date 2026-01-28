import { getModelByMode } from '@/lib/gemini/client';
import {
  createVisaAssistantPrompt,
  VisaAssistantResult,
} from '@/lib/gemini/prompts/visa-assistant';

export type VisaAssistantOutput = VisaAssistantResult;

export interface VisaAssistantInput {
  visaType: string;
  nationality: string;
  destination: string;
  purpose: string;
  duration: string;
  aiMode: 'quick' | 'standard' | 'detailed';
  language?: string;
}

/**
 * 签证申请助手AI工具
 * 使用Gemini Flash模型提供签证申请指导
 */
export async function getVisaAssistance(
  input: VisaAssistantInput
): Promise<VisaAssistantOutput> {
  try {
    // 验证输入
    if (!input.nationality || input.nationality.trim().length < 2) {
      throw new Error('Please provide a valid nationality');
    }
    if (!input.destination || input.destination.trim().length < 2) {
      throw new Error('Please provide a valid destination');
    }

    // 根据模式选择模型
    const model = getModelByMode(input.aiMode);
    
    // 创建prompt
    const prompt = createVisaAssistantPrompt(input);

    // 调用Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析JSON响应
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const data: VisaAssistantResult = JSON.parse(cleanedText);

    // 验证数据结构
    if (!data.overview || !Array.isArray(data.requiredDocuments) || !Array.isArray(data.applicationSteps)) {
      throw new Error('Invalid response format from AI');
    }

    return data;
  } catch (error) {
    console.error('Error in getVisaAssistance:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get visa assistance: ${error.message}`);
    }
    throw new Error('Failed to get visa assistance. Please try again.');
  }
}
