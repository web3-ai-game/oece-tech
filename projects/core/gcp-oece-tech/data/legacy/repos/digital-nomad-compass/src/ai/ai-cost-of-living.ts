'use server';

/**
 * @fileOverview AI-powered cost of living comparison tool for digital nomads in Southeast Asia.
 *
 * - compareCities - A function that generates a comparison of living costs between two cities.
 * - CostOfLivingInput - The input type for the compareCities function.
 * - CostOfLivingOutput - The return type for the compareCities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CostOfLivingInputSchema = z.object({
  city1: z.string().describe('The first city for comparison.'),
  city2: z.string().describe('The second city for comparison.'),
});
export type CostOfLivingInput = z.infer<typeof CostOfLivingInputSchema>;

const CostOfLivingOutputSchema = z.object({
    city1: z.string().describe("The first city being compared."),
    city2: z.string().describe("The second city being compared."),
    summary: z.object({
        title: z.string().describe("A short, engaging title summarizing the main difference, e.g., 'Chiang Mai is 25% cheaper than Bangkok'"),
        details: z.string().describe("A one-paragraph summary explaining the overall cost difference and which city is more affordable for a digital nomad, highlighting the key reasons."),
    }),
    comparison: z.array(z.object({
        item: z.string().describe("The specific item being compared, e.g., '1-bedroom apartment in city center', 'Meal at an inexpensive restaurant', 'Monthly public transport pass', 'Cappuccino'"),
        city1_cost: z.string().describe("The estimated cost for this item in the first city, in USD, formatted as '$XXX.XX'"),
        city2_cost: z.string().describe("The estimated cost for this item in the second city, in USD, formatted as '$XXX.XX'"),
    })).describe("A detailed breakdown of costs for various items relevant to a digital nomad.")
});
export type CostOfLivingOutput = z.infer<typeof CostOfLivingOutputSchema>;

export async function compareCities(input: CostOfLivingInput): Promise<CostOfLivingOutput> {
  return costOfLivingFlow(input);
}

const costOfLivingPrompt = ai.definePrompt({
  name: 'costOfLivingPrompt',
  input: {schema: CostOfLivingInputSchema},
  output: {schema: CostOfLivingOutputSchema},
  prompt: `You are an expert data analyst for digital nomads. Your task is to provide an up-to-date, real-world cost of living comparison between two cities in Southeast Asia. Use current, accurate data (as of today). All prices must be in USD.

Focus on costs relevant to a digital nomad lifestyle.

The comparison should include at least the following items:
- 1-bedroom apartment rent in city center (monthly)
- Co-working space (monthly membership, hot desk)
- Meal at an inexpensive restaurant
- Cappuccino
- Local beer (0.5L draught)
- High-speed internet (monthly)
- Mobile data plan with at least 10GB
- Monthly public transport pass
- Fitness club (monthly fee)

Compare {{city1}} and {{city2}}.

Provide a clear summary and a detailed table.
`,
    config: {
        model: 'googleai/gemini-2.5-pro'
    }
});

const costOfLivingFlow = ai.defineFlow(
  {
    name: 'costOfLivingFlow',
    inputSchema: CostOfLivingInputSchema,
    outputSchema: CostOfLivingOutputSchema,
  },
  async input => {
    const {output} = await costOfLivingPrompt(input);
    return output!;
  }
);
