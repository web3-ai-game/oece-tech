'use server';

import * as z from 'zod';
import { analyzeCostOfLiving, CostOfLivingOutput } from '@/ai/ai-cost-of-living';

const formSchema = z.object({
  city1: z.string().min(2, 'Please enter a valid city name'),
  city2: z.string().min(2, 'Please enter a valid city name'),
  city3: z.string().optional(),
});

type State = {
  data: CostOfLivingOutput | null;
  error: string | null;
};

export async function analyzeCostOfLivingAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    city1: formData.get('city1'),
    city2: formData.get('city2'),
    city3: formData.get('city3'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please enter at least 2 cities.',
    };
  }

  // 收集非空城市
  const cities = [
    validatedFields.data.city1,
    validatedFields.data.city2,
    validatedFields.data.city3,
  ].filter((city): city is string => city !== undefined && city.trim() !== '');

  if (cities.length < 2) {
    return {
      data: null,
      error: 'Please provide at least 2 cities to compare.',
    };
  }

  try {
    const result = await analyzeCostOfLiving({ cities });
    
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error analyzing cost of living:', error);
    return {
      data: null,
      error: 'Failed to analyze cost of living. Please try again later.',
    };
  }
}
