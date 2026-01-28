/**
 * 签证申请助手 Prompt
 * 协助用户填写签证申请表格和准备材料
 */

export function createVisaAssistantPrompt(input: {
  visaType: string;
  nationality: string;
  destination: string;
  purpose: string;
  duration: string;
  aiMode?: 'quick' | 'standard' | 'detailed';
  language?: string;
}): string {
  const languageInstruction = input.language === 'zh-TW' 
    ? 'IMPORTANT: Respond in Traditional Chinese (繁體中文). All text fields should be in Traditional Chinese.'
    : 'IMPORTANT: Respond in English.';
  
  const detailLevel = {
    quick: 'CONCISE MODE: Provide only essential documents (max 3), key steps (max 5), and critical mistakes (max 3). Be brief.',
    standard: 'STANDARD MODE: Provide comprehensive guidance with reasonable detail. Max 5 document categories, 8 steps, 5 common mistakes.',
    detailed: 'DETAILED MODE: Provide exhaustive guidance including all document types, detailed step-by-step process, comprehensive mistake list, pro tips, and alternative options.',
  };
  
  const modeInstruction = detailLevel[input.aiMode || 'standard'];
    
  return `You are an expert visa application consultant specializing in helping digital nomads and remote workers navigate visa applications.

${languageInstruction}
${modeInstruction}

User Information:
- Applying for: ${input.visaType}
- Nationality: ${input.nationality}
- Destination: ${input.destination}
- Purpose: ${input.purpose}
- Duration: ${input.duration}

Task: Provide comprehensive guidance for the visa application, including:
1. Required documents checklist
2. Step-by-step application process
3. Common mistakes to avoid
4. Timeline and processing duration
5. Tips for success
6. Important considerations

Return your response in this EXACT JSON format:
{
  "overview": {
    "visaType": "${input.visaType}",
    "processingTime": "2-4 weeks",
    "difficulty": "Medium",
    "successRate": "85-90%",
    "totalCost": "$100-200"
  },
  "requiredDocuments": [
    {
      "category": "Identity Documents",
      "items": [
        {
          "name": "Valid Passport",
          "details": "Must be valid for at least 6 months beyond intended stay",
          "required": true
        }
      ]
    }
  ],
  "applicationSteps": [
    {
      "step": 1,
      "title": "Prepare Documents",
      "description": "Gather all required documents",
      "estimatedTime": "2-3 days",
      "tips": [
        "Make copies of everything",
        "Get documents notarized if required"
      ]
    }
  ],
  "commonMistakes": [
    {
      "mistake": "Incomplete documentation",
      "consequence": "Application delay or rejection",
      "howToAvoid": "Use our checklist and verify everything twice"
    }
  ],
  "timeline": {
    "preparation": "1 week",
    "submission": "1 day",
    "processing": "2-4 weeks",
    "total": "3-5 weeks"
  },
  "importantNotes": [
    "Important note 1",
    "Important note 2"
  ],
  "digitalNomadTips": [
    "Tip specifically for digital nomads",
    "Remote work considerations"
  ]
}

Important Guidelines:
- Be specific and actionable
- Focus on ${input.destination} requirements
- Consider ${input.nationality} passport specifics
- Include digital nomad-specific advice
- Provide current 2024-2025 information
- Mention any recent policy changes
- Be realistic about timelines and costs
- Keep response concise - max 3 document categories, 5 steps, 3 mistakes
- Prioritize most important information

Return ONLY the JSON, no additional text.`;
}

/**
 * 验证返回的JSON格式
 */
export interface VisaAssistantResult {
  overview: {
    visaType: string;
    processingTime: string;
    difficulty: string;
    successRate: string;
    totalCost: string;
  };
  requiredDocuments: Array<{
    category: string;
    items: Array<{
      name: string;
      details: string;
      required: boolean;
    }>;
  }>;
  applicationSteps: Array<{
    step: number;
    title: string;
    description: string;
    estimatedTime: string;
    tips: string[];
  }>;
  commonMistakes: Array<{
    mistake: string;
    consequence: string;
    howToAvoid: string;
  }>;
  timeline: {
    preparation: string;
    submission: string;
    processing: string;
    total: string;
  };
  importantNotes: string[];
  digitalNomadTips: string[];
}
