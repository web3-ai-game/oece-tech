/**
 * 行程规划工具 Prompt
 * 智能生成旅行路线和预算计划
 */

export function createTripPlannerPrompt(input: {
  destination: string;
  duration: string;
  budget: string;
  interests: string;
  aiMode?: 'quick' | 'standard' | 'detailed';
  language?: string;
}): string {
  const languageInstruction = input.language === 'zh-TW' 
    ? 'IMPORTANT: Respond in Traditional Chinese (繁體中文). All text fields should be in Traditional Chinese.'
    : 'IMPORTANT: Respond in English.';
  
  const detailLevel = {
    quick: 'CONCISE MODE: Provide essential information only. 2-3 activities per day, brief descriptions.',
    standard: 'STANDARD MODE: Balanced details. 3-5 activities per day, moderate descriptions.',
    detailed: 'DETAILED MODE: Comprehensive and in-depth. 5-7 activities per day, detailed descriptions, insider tips, alternative options.',
  };
  
  const modeInstruction = detailLevel[input.aiMode || 'standard'];
    
  return `You are an expert travel planner specializing in creating personalized itineraries for digital nomads and remote workers.

${languageInstruction}
${modeInstruction}

User Request:
- Destination: ${input.destination}
- Duration: ${input.duration}
- Budget: ${input.budget}
- Interests: ${input.interests}

Task: Create a detailed day-by-day itinerary with practical information for someone combining work and travel.

Return your response in this EXACT JSON format:
{
  "overview": {
    "destination": "City, Country",
    "totalDays": 7,
    "estimatedBudget": "$2000-2500 USD",
    "bestTimeToVisit": "March-May, September-November",
    "summary": "Brief 2-3 sentence overview of the trip"
  },
  "dailyItinerary": [
    {
      "day": 1,
      "title": "Arrival & Setup",
      "morning": {
        "activities": ["Activity 1", "Activity 2"],
        "cost": "$50-100",
        "workFriendly": true
      },
      "afternoon": {
        "activities": ["Activity 1", "Activity 2"],
        "cost": "$30-50",
        "workFriendly": false
      },
      "evening": {
        "activities": ["Activity 1", "Activity 2"],
        "cost": "$20-40",
        "workFriendly": false
      },
      "accommodation": "Hotel/Airbnb recommendation with area",
      "totalDayCost": "$100-200"
    }
  ],
  "practicalInfo": {
    "transportation": {
      "gettingThere": "Flight options and costs",
      "localTransport": "Best ways to get around",
      "estimatedCost": "$200-300"
    },
    "accommodation": {
      "recommendations": ["Option 1 with area and price range", "Option 2"],
      "estimatedCost": "$500-800 for ${input.duration}"
    },
    "food": {
      "recommendations": ["Restaurant/Cafe 1", "Restaurant/Cafe 2"],
      "estimatedDailyBudget": "$30-50"
    },
    "coworkingSpaces": [
      {
        "name": "Space Name",
        "location": "Area",
        "price": "$10-20/day or $100-150/month",
        "wifi": "50-100 Mbps"
      }
    ]
  },
  "budgetBreakdown": {
    "accommodation": "$500-800",
    "food": "$210-350",
    "transportation": "$200-300",
    "activities": "$300-400",
    "coworking": "$100-150",
    "miscellaneous": "$100-200",
    "total": "$1410-2200"
  },
  "tips": [
    "Important tip 1 for digital nomads",
    "Important tip 2",
    "Local custom or consideration"
  ]
}

Important Guidelines:
- Focus on work-life balance for digital nomads
- Include coworking spaces and wifi info
- Realistic time estimates considering work hours
- Mix of work-friendly cafes and tourist activities
- Budget-conscious but quality recommendations
- Consider ${input.interests} heavily in planning
- Practical, actionable advice

Return ONLY the JSON, no additional text.`;
}

/**
 * 验证返回的JSON格式
 */
export interface TripPlannerResult {
  overview: {
    destination: string;
    totalDays: number;
    estimatedBudget: string;
    bestTimeToVisit: string;
    summary: string;
  };
  dailyItinerary: Array<{
    day: number;
    title: string;
    morning: {
      activities: string[];
      cost: string;
      workFriendly: boolean;
    };
    afternoon: {
      activities: string[];
      cost: string;
      workFriendly: boolean;
    };
    evening: {
      activities: string[];
      cost: string;
      workFriendly: boolean;
    };
    accommodation: string;
    totalDayCost: string;
  }>;
  practicalInfo: {
    transportation: {
      gettingThere: string;
      localTransport: string;
      estimatedCost: string;
    };
    accommodation: {
      recommendations: string[];
      estimatedCost: string;
    };
    food: {
      recommendations: string[];
      estimatedDailyBudget: string;
    };
    coworkingSpaces: Array<{
      name: string;
      location: string;
      price: string;
      wifi: string;
    }>;
  };
  budgetBreakdown: {
    accommodation: string;
    food: string;
    transportation: string;
    activities: string;
    coworking: string;
    miscellaneous: string;
    total: string;
  };
  tips: string[];
}
