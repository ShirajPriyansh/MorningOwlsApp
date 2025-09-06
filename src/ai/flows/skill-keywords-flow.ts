
'use server';
/**
 * @fileOverview Generates skill keywords based on a career goal.
 *
 * - generateSkillKeywords - A function that suggests skills for a goal.
 * - SkillKeywordsInput - The input type for the skill keyword generation.
 * - SkillKeywordsOutput - The return type for the skill keyword generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillKeywordsInputSchema = z.object({
  careerGoal: z.string().describe("The user's primary career goal."),
});
export type SkillKeywordsInput = z.infer<typeof SkillKeywordsInputSchema>;


const SkillKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('An array of 5-10 relevant skill keywords.'),
});
export type SkillKeywordsOutput = z.infer<typeof SkillKeywordsOutputSchema>;

export async function generateSkillKeywords(input: SkillKeywordsInput): Promise<SkillKeywordsOutput> {
  return skillKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillKeywordsPrompt',
  input: { schema: SkillKeywordsInputSchema },
  output: { schema: SkillKeywordsOutputSchema },
  prompt: `You are a career development expert and professional skills assessor. Your task is to generate a list of 5 to 10 essential skill keywords required for a user to achieve their stated career goal.

Focus on concrete, technical, and soft skills that are highly relevant in the job market for the specified goal.

**User's Career Goal:**
{{{careerGoal}}}

Generate the list of skill keywords.`,
});

const skillKeywordsFlow = ai.defineFlow(
  {
    name: 'skillKeywordsFlow',
    inputSchema: SkillKeywordsInputSchema,
    outputSchema: SkillKeywordsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
