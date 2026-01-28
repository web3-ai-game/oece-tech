'use server';

import { generateHeadline, GenerateHeadlineInput } from "@/ai/flows/generate-headline";
import { generateSubheadline, GenerateSubheadlineInput } from "@/ai/flows/generate-subheadline";

export async function handleHeadlineGeneration(input: GenerateHeadlineInput) {
    try {
        const result = await generateHeadline(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate headline." };
    }
}

export async function handleSubheadlineGeneration(input: GenerateSubheadlineInput) {
    try {
        const result = await generateSubheadline(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate subheadline." };
    }
}
