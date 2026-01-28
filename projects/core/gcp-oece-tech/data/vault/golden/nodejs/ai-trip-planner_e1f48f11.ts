// AITripPlanner story implementation

'use server';

/**
 * @fileOverview AI-powered trip planner for Southeast Asia, providing personalized itineraries with tech insights.
 *
 * - planTrip - A function that generates a personalized travel itinerary.
 * - TripPlannerInput - The input type for the planTrip function, including preferences and interests.
 * - TripPlannerOutput - The return type for the planTrip function, containing the travel itinerary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TripPlannerInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'User preferences for the trip, including interests, budget, travel style, and desired destinations in Southeast Asia.'
    ),
});
export type TripPlannerInput = z.infer<typeof TripPlannerInputSchema>;

const TripPlannerOutputSchema = z.object({
  itinerary: z
    .string()
    .describe(
      'A personalized travel itinerary including destinations, activities, accommodation suggestions, and relevant tech insights for seamless travel.'
    ),
});
export type TripPlannerOutput = z.infer<typeof TripPlannerOutputSchema>;

export async function planTrip(input: TripPlannerInput): Promise<TripPlannerOutput> {
  return tripPlannerFlow(input);
}

const tripPlannerPrompt = ai.definePrompt({
  name: 'tripPlannerPrompt',
  input: {schema: TripPlannerInputSchema},
  output: {schema: TripPlannerOutputSchema},
  prompt: `You are an expert travel planner specializing in Southeast Asia.
  Based on the user's preferences, create a detailed and personalized travel itinerary.
  Include specific destinations, activities, and accommodation suggestions.
  Incorporate relevant tech insights for seamless travel in the region, such as useful apps, local SIM card information, and transportation tips.

  User Preferences: {{{preferences}}}
  `,
});

const tripPlannerFlow = ai.defineFlow(
  {
    name: 'tripPlannerFlow',
    inputSchema: TripPlannerInputSchema,
    outputSchema: TripPlannerOutputSchema,
  },
  async input => {
    const {output} = await tripPlannerPrompt(input);
    return output!;
  }
);
