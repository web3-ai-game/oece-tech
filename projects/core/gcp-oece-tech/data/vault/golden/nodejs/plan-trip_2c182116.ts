'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';
import { planTrip as generatePlan, TripPlannerOutput } from '@/ai/ai-trip-planner';

const formSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  duration: z.string().min(1, 'Duration is required'),
  budget: z.string().min(1, 'Budget is required'),
  interests: z.string().min(10, 'Please describe your interests'),
  aiMode: z.enum(['quick', 'standard', 'detailed']),
});

type State = {
  data: TripPlannerOutput | null;
  error: string | null;
};

export async function planTrip(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    destination: formData.get('destination'),
    duration: formData.get('duration'),
    budget: formData.get('budget'),
    interests: formData.get('interests'),
    aiMode: formData.get('aiMode') || 'standard',
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    // 获取当前语言设置
    const cookieStore = await cookies();
    const language = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    
    const result = await generatePlan({
      destination: validatedFields.data.destination,
      duration: validatedFields.data.duration,
      budget: validatedFields.data.budget,
      interests: validatedFields.data.interests,
      aiMode: validatedFields.data.aiMode,
      language,
    });
    
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error generating trip plan:', error);
    return {
      data: null,
      error: 'Failed to generate trip plan. Please try again later.',
    };
  }
}
