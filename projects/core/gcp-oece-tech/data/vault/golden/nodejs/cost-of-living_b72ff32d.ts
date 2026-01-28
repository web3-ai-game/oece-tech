/**
 * 生活成本分析工具 Prompt
 * 用于对比不同城市的生活成本和地理套利机会
 */

export function createCostOfLivingPrompt(cities: string[]): string {
  const citiesList = cities.join(', ');
  
  return `You are an expert cost of living analyst specializing in geographic arbitrage opportunities for digital nomads and remote workers.

User wants to compare: ${citiesList}

Task: Provide a comprehensive cost of living comparison for these cities. Focus on:
- Housing (rent for 1-bedroom apartment in city center)
- Food & Dining (groceries + eating out)
- Transportation (public transport + occasional taxi)
- Utilities (electricity, water, internet)
- Entertainment & Lifestyle
- Healthcare
- Total Monthly Budget (different lifestyle levels)

For each city, provide:
1. City name and country
2. Currency and typical monthly budget ranges
3. Detailed cost breakdown by category
4. Quality of life factors
5. Digital nomad friendliness score (1-10)
6. Geographic arbitrage opportunities

Return your response in this EXACT JSON format:
{
  "summary": "A brief 2-3 sentence overview comparing the cost differences and best value options",
  "cities": [
    {
      "name": "City Name",
      "country": "Country",
      "currency": "USD/EUR/etc",
      "budgetRanges": {
        "budget": "1000-1500",
        "comfortable": "2000-3000",
        "luxury": "4000+"
      },
      "costBreakdown": {
        "housing": {
          "amount": "500-800",
          "description": "1-bedroom apartment in city center"
        },
        "food": {
          "amount": "300-500",
          "description": "Groceries and occasional dining out"
        },
        "transportation": {
          "amount": "50-100",
          "description": "Public transport monthly pass"
        },
        "utilities": {
          "amount": "100-150",
          "description": "Electricity, water, internet, phone"
        },
        "entertainment": {
          "amount": "200-400",
          "description": "Coworking, gym, activities"
        }
      },
      "qualityOfLife": {
        "infrastructure": 8,
        "safety": 9,
        "healthcare": 7,
        "internetSpeed": "50-100 Mbps average",
        "climate": "Tropical/Temperate/etc"
      },
      "digitalNomadScore": 8,
      "highlights": [
        "Major advantage 1",
        "Major advantage 2",
        "Important consideration"
      ],
      "arbitrageOpportunity": "Detailed explanation of geographic arbitrage potential - earning in X currency while living on Y currency"
    }
  ],
  "recommendations": {
    "bestValue": "City name with explanation",
    "bestQuality": "City name with explanation",
    "bestForRemoteWork": "City name with explanation"
  }
}

Important Guidelines:
- Use current 2024-2025 data
- All costs in USD equivalent for easy comparison
- Focus on digital nomad lifestyle (coworking spaces, fast internet)
- Include visa/immigration considerations
- Highlight geographic arbitrage potential
- Be specific with numbers and ranges

Return ONLY the JSON, no additional text.`;
}

/**
 * 验证返回的JSON格式
 */
export interface CostOfLivingResult {
  summary: string;
  cities: Array<{
    name: string;
    country: string;
    currency: string;
    budgetRanges: {
      budget: string;
      comfortable: string;
      luxury: string;
    };
    costBreakdown: {
      housing: { amount: string; description: string };
      food: { amount: string; description: string };
      transportation: { amount: string; description: string };
      utilities: { amount: string; description: string };
      entertainment: { amount: string; description: string };
    };
    qualityOfLife: {
      infrastructure: number;
      safety: number;
      healthcare: number;
      internetSpeed: string;
      climate: string;
    };
    digitalNomadScore: number;
    highlights: string[];
    arbitrageOpportunity: string;
  }>;
  recommendations: {
    bestValue: string;
    bestQuality: string;
    bestForRemoteWork: string;
  };
}
