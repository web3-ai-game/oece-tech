'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating subheadlines.
 *
 * The flow takes a headline as input and generates a subheadline to complement it.
 * - generateSubheadline - A function that generates a subheadline.
 * - GenerateSubheadlineInput - The input type for the generateSubheadline function.
 * - GenerateSubheadlineOutput - The return type for the generateSubheadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubheadlineInputSchema = z.object({
  headline: z.string().describe('The main headline to complement.'),
});
export type GenerateSubheadlineInput = z.infer<
  typeof GenerateSubheadlineInputSchema
>;

const GenerateSubheadlineOutputSchema = z.object({
  subheadline: z.string().describe('The generated subheadline.'),
});
export type GenerateSubheadlineOutput = z.infer<
  typeof GenerateSubheadlineOutputSchema
>;

export async function generateSubheadline(
  input: GenerateSubheadlineInput
): Promise<GenerateSubheadlineOutput> {
  return generateSubheadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubheadlinePrompt',
  input: {schema: GenerateSubheadlineInputSchema},
  output: {schema: GenerateSubheadlineOutputSchema},
  prompt: `You are an expert copywriter specializing in crafting compelling subheadlines for enterprise cloud solutions. Given the following headline, generate a subheadline that elaborates on the value proposition for enterprise businesses.

Headline: {{{headline}}}

Subheadline:`,
});

const generateSubheadlineFlow = ai.defineFlow(
  {
    name: 'generateSubheadlineFlow',
    inputSchema: GenerateSubheadlineInputSchema,
    outputSchema: GenerateSubheadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
