/**
 * 签证对比工具 Prompt
 * 用于生成多国签证政策对比和推荐
 */

export function createVisaComparisonPrompt(nationality: string): string {
  return `You are an expert visa consultant for digital nomads and remote workers.

User's Nationality: ${nationality}

Task: Provide a comprehensive visa comparison for 3-5 countries that are popular among digital nomads. Focus on countries in Southeast Asia, Europe, and Latin America that offer:
- Digital Nomad Visas
- Long-term Tourist Visas
- Work Permits for Remote Workers
- Retirement Visas (if applicable)

For each country, provide:
1. Country name
2. Visa type name
3. Key facts (duration, cost, requirements) - as a list
4. Detailed summary (eligibility, benefits, restrictions)
5. Important notes and tips

Return your response in this EXACT JSON format:
{
  "introduction": "A brief 2-3 sentence overview explaining the visa landscape for [nationality] passport holders",
  "visaOptions": [
    {
      "country": "Country Name",
      "visaName": "Visa Type",
      "keyFacts": [
        "Duration: X months/years",
        "Cost: $X USD",
        "Processing Time: X weeks",
        "Income Requirement: $X/month (if any)"
      ],
      "summary": "Detailed paragraph explaining who this visa is for, main benefits, and how to qualify",
      "notes": "Important tips, common pitfalls, or recent changes to be aware of"
    }
  ]
}

Important Guidelines:
- Provide accurate, up-to-date information
- Focus on practical advice for digital nomads
- Include cost comparisons
- Mention any recent policy changes
- Be specific about requirements
- Use ${nationality} passport perspective

Return ONLY the JSON, no additional text.`;
}

/**
 * 验证返回的JSON格式
 */
export interface VisaComparisonResult {
  introduction: string;
  visaOptions: Array<{
    country: string;
    visaName: string;
    keyFacts: string[];
    summary: string;
    notes: string;
  }>;
}
