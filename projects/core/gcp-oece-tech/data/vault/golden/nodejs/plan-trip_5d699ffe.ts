'use server';

import * as z from 'zod';
import { planTrip as planTripAI, TripPlannerOutput } from '@/ai/ai-trip-planner';

const formSchema = z.object({
  destination: z.string(),
  duration: z.coerce.number(),
  budget: z.enum(['budget', 'mid-range', 'luxury']),
  interests: z.string(),
});

type State = {
  data: TripPlannerOutput | null;
  error: string | null;
};

// This function formats the user input into a string for the AI prompt.
function formatPreferences(input: z.infer<typeof formSchema>): string {
    return `
- Destination: ${input.destination}
- Duration: ${input.duration} days
- Budget: ${input.budget}
- Interests and Vibe: ${input.interests}
`;
}

export async function planTrip(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    destination: formData.get('destination'),
    duration: formData.get('duration'),
    budget: formData.get('budget'),
    interests: formData.get('interests'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    const preferences = formatPreferences(validatedFields.data);
    const itinerary = await planTripAI({ preferences });
    
    // The AI returns a string, we need to parse it into the Day[] structure.
    // For now, we will wrap it in a simple object for display.
    // A more robust solution would be to ask the AI for structured JSON output.
    const itineraryData = {
        title: `Your ${validatedFields.data.duration}-Day Trip to ${validatedFields.data.destination}`,
        summary: "Here is your AI-generated itinerary.",
        itinerary: itinerary.itinerary, // The raw string from the AI
    };
    
    // We are adapting the AI output to the expected format.
    // The AI returns a single string, but the display component expects a more structured object.
    // Let's adjust the state to pass the raw itinerary string.
    return {
      data: itinerary,
      error: null,
    };
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return {
      data: null,
      error: 'Failed to generate itinerary. Please try again later.',
    };
  }
}
