'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';
import { getVisaAssistance, VisaAssistantOutput } from '@/ai/ai-visa-assistant';

const formSchema = z.object({
  visaType: z.string().min(2, 'Visa type is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  destination: z.string().min(2, 'Destination is required'),
  purpose: z.string().min(2, 'Purpose is required'),
  duration: z.string().min(1, 'Duration is required'),
  aiMode: z.enum(['quick', 'standard', 'detailed']),
});

type State = {
  data: VisaAssistantOutput | null;
  error: string | null;
};

export async function getVisaAssistanceAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    visaType: formData.get('visaType'),
    nationality: formData.get('nationality'),
    destination: formData.get('destination'),
    purpose: formData.get('purpose'),
    duration: formData.get('duration'),
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
    
    const result = await getVisaAssistance({
      ...validatedFields.data,
      aiMode: validatedFields.data.aiMode,
      language,
    });
    
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error getting visa assistance:', error);
    return {
      data: null,
      error: 'Failed to get visa assistance. Please try again later.',
    };
  }
}
