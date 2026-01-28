'use server';

import * as z from 'zod';
import { compareVisas, VisaComparisonOutput } from '@/ai/ai-visa-comparison';

const formSchema = z.object({
  nationality: z.string().min(2, 'Please enter a valid nationality.'),
});

type State = {
  data: VisaComparisonOutput | null;
  error: string | null;
};

export async function compareVisaAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    nationality: formData.get('nationality'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please enter your nationality.',
    };
  }

  try {
    const result = await compareVisas({ 
        nationality: validatedFields.data.nationality,
     });
    
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error generating visa comparison:', error);
    return {
      data: null,
      error: 'Failed to generate visa comparison. Please try again later.',
    };
  }
}
