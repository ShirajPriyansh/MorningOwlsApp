
'use server';
/**
 * @fileOverview Generates learning recommendations based on assessment performance.
 *
 * - generateRecommendations - Creates a list of topics to study.
 * - RecommendationsInput - The input type for recommendation generation.
 * - RecommendationsOutput - The return type for recommendation generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendationsInputSchema = z.object({
  careerGoal: z.string().describe("The user's primary career goal."),
  score: z.number().describe("The user's score on the assessment (out of 5)."),
  assessmentTitle: z.string().describe("The title of the assessment taken."),
});
export type RecommendationsInput = z.infer<typeof RecommendationsInputSchema>;

const RecommendationSchema = z.object({
  topic: z.string().describe('A specific topic or skill to focus on.'),
  reason: z.string().describe('A brief explanation of why this topic is recommended based on the assessment score.'),
});

const RecommendationsOutputSchema = z.object({
  title: z.string().describe('A title for the recommendations list.'),
  recommendations: z.array(RecommendationSchema).describe('An array of 3-5 learning recommendations.'),
});
export type RecommendationsOutput = z.infer<typeof RecommendationsOutputSchema>;

export async function generateRecommendations(input: RecommendationsInput): Promise<RecommendationsOutput> {
  return recommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendationsPrompt',
  input: { schema: RecommendationsInputSchema },
  output: { schema: RecommendationsOutputSchema },
  prompt: `You are an expert career coach and learning advisor. A user has just completed a baseline knowledge assessment. Based on their career goal and their score, generate a list of 3 to 5 specific topics or skills they should focus on to improve.

The recommendations should be encouraging and provide clear direction for what to learn next.

**User Profile & Performance:**
- **Career Goal:** {{{careerGoal}}}
- **Assessment Taken:** "{{{assessmentTitle}}}"
- **Score:** {{{score}}} out of 5

Generate a list of recommendations titled "Your Next Steps". For each recommendation, provide the topic and a short reason.`,
});

const recommendationsFlow = ai.defineFlow(
  {
    name: 'recommendationsFlow',
    inputSchema: RecommendationsInputSchema,
    outputSchema: RecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
