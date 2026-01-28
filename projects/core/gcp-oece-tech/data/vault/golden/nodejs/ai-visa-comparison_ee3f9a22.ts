'use server';

/**
 * @fileOverview AI-powered visa comparison tool for digital nomads.
 *
 * - compareVisas - A function that generates a comparison of visa options for a given nationality.
 * - VisaComparisonInput - The input type for the compareVisas function.
 * - VisaComparisonOutput - The return type for the compareVisas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisaComparisonInputSchema = z.object({
  nationality: z.string().describe('The nationality of the user.'),
});
export type VisaComparisonInput = z.infer<typeof VisaComparisonInputSchema>;

const VisaComparisonOutputSchema = z.object({
    introduction: z.string().describe("A brief introduction summarizing the visa situation for the user's nationality."),
    visaOptions: z.array(z.object({
        country: z.string().describe("The destination country."),
        visaName: z.string().describe("The name of the visa (e.g., 'Digital Nomad Visa', 'Tourist Visa')."),
        keyFacts: z.array(z.string()).describe("A short list of key facts, such as 'Duration: 1 year', 'Income Requirement: $2,000/month'."),
        summary: z.string().describe("A paragraph summarizing the main requirements and process for this visa."),
        notes: z.string().describe("Any additional notes, tips, or important considerations for the applicant.")
    })).describe("A detailed breakdown of visa options for popular digital nomad destinations.")
});
export type VisaComparisonOutput = z.infer<typeof VisaComparisonOutputSchema>;

export async function compareVisas(input: VisaComparisonInput): Promise<VisaComparisonOutput> {
  return visaComparisonFlow(input);
}

const visaComparisonPrompt = ai.definePrompt({
  name: 'visaComparisonPrompt',
  input: {schema: VisaComparisonInputSchema},
  output: {schema: VisaComparisonOutputSchema},
  prompt: `You are an expert immigration consultant specializing in digital nomad visas. Your task is to provide a clear and helpful comparison of visa options for a user with the nationality: {{nationality}}.

Focus on the most popular and accessible destinations for digital nomads, especially in Southeast Asia and Europe. For each destination, provide information on the most relevant visa (Digital Nomad Visa if available, otherwise long-term tourist visa or other options).

Please research and provide details for at least 5 popular countries.

For each visa, include:
- The common name of the visa.
- Key facts like duration, minimum income requirements (in USD), and application cost.
- A summary of the application process and main requirements.
- A helpful note or tip for the applicant.

Start with a brief introductory paragraph. Ensure the data is as up-to-date as possible.
`,
    config: {
        model: 'googleai/gemini-2.5-flash'
    }
});

const visaComparisonFlow = ai.defineFlow(
  {
    name: 'visaComparisonFlow',
    inputSchema: VisaComparisonInputSchema,
    outputSchema: VisaComparisonOutputSchema,
  },
  async input => {
    const {output} = await visaComparisonPrompt(input);
    return output!;
  }
);
