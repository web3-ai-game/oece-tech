'use server';

import * as z from 'zod';
import { analyzeCostOfLiving, CostOfLivingOutput } from '@/ai/ai-cost-of-living';

const formSchema = z.object({
  city1: z.string(),
  city2: z.string(),
});

type State = {
  data: CostOfLivingOutput | null;
  error: string | null;
};

export async function compareCostOfLiving(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    city1: formData.get('city1'),
    city2: formData.get('city2'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }
  
  if (validatedFields.data.city1 === validatedFields.data.city2) {
    return {
      data: null,
      error: 'Please select two different cities to compare.',
    }
  }

  try {
    const result = await analyzeCostOfLiving({ 
        cities: [validatedFields.data.city1, validatedFields.data.city2],
     });
    
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error generating comparison:', error);
    return {
      data: null,
      error: 'Failed to generate comparison. Please try again later.',
    };
  }
}
