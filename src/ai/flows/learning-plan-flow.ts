
'use server';
/**
 * @fileOverview Generates a personalized learning plan for a user.
 *
 * - generateLearningPlan - A function that creates a learning plan based on user goals.
 * - LearningPlanInput - The input type for the learning plan generation.
 * - LearningPlanOutput - The return type for the learning plan generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LearningPlanInputSchema = z.object({
  careerGoal: z.string().describe('The user\'s primary career goal, e.g., "Become a full-stack developer".'),
  profession: z.array(z.string()).describe("The user's current profession(s)."),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The user\'s current skill level.'),
  learningStyle: z.array(z.string()).describe('The user\'s preferred learning styles.'),
  currentSkills: z.string().describe('A list of the user\'s current relevant skills, e.g., "HTML, CSS, basic JavaScript".'),
});
export type LearningPlanInput = z.infer<typeof LearningPlanInputSchema>;

const LearningStepSchema = z.object({
    title: z.string().describe('The title of the learning step.'),
    duration: z.string().describe('An estimated duration for this step, e.g., "3 hours" or "2 days".'),
    description: z.string().describe('A brief description of what this learning step entails.'),
});

const LearningPlanOutputSchema = z.object({
  title: z.string().describe('A concise and motivational title for the entire learning plan.'),
  description: z.string().describe('A short, encouraging description of the learning plan.'),
  steps: z.array(LearningStepSchema).describe('A list of sequential, bite-sized learning steps to achieve the goal. Should be between 3 and 5 steps.'),
});
export type LearningPlanOutput = z.infer<typeof LearningPlanOutputSchema>;

export async function generateLearningPlan(input: LearningPlanInput): Promise<LearningPlanOutput> {
  return learningPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningPlanPrompt',
  input: { schema: LearningPlanInputSchema },
  output: { schema: LearningPlanOutputSchema },
  prompt: `You are an expert curriculum designer for vocational and upskilling programs. Your task is to create a personalized, micro-learning plan for a user based on their goals and preferences.

The plan should be broken down into small, manageable steps that lead the user towards their goal. Each step should be a focused micro-learning moment.

Keep the learning plan concise and motivational. Generate 3 to 5 clear steps.

**User Profile:**
- **Career Goal:** {{{careerGoal}}}
- **Current Profession(s):** {{#each profession}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- **Current Skills:** {{{currentSkills}}}
- **Skill Level:** {{{skillLevel}}}
- **Preferred Learning Style(s):** {{#each learningStyle}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on this profile, generate a learning plan with a title, a brief description, and a series of actionable steps. For each step, provide a title, an estimated duration, and a short description. Tailor the content and recommended activities to the user's preferred learning style(s).`,
});

const learningPlanFlow = ai.defineFlow(
  {
    name: 'learningPlanFlow',
    inputSchema: LearningPlanInputSchema,
    outputSchema: LearningPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
