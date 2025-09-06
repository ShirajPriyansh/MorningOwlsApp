
'use server';
/**
 * @fileOverview Generates an assessment based on a user's learning goals.
 *
 * - generateAssessment - Creates a multiple-choice quiz.
 * - AssessmentInput - The input type for assessment generation.
 * - AssessmentOutput - The return type for assessment generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssessmentInputSchema = z.object({
  careerGoal: z.string().describe("The user's primary career goal."),
  currentSkills: z.string().describe("The user's current skills."),
  profession: z.string().describe("The user's current profession."),
});
export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('An array of 4 possible answers.'),
  answer: z.string().describe('The correct answer from the options.'),
  explanation: z.string().describe('A brief explanation for the correct answer.'),
});

const AssessmentOutputSchema = z.object({
  title: z.string().describe('A title for the assessment.'),
  questions: z.array(QuestionSchema).describe('An array of 5 multiple-choice questions.'),
});
export type AssessmentOutput = z.infer<typeof AssessmentOutputSchema>;

export async function generateAssessment(input: AssessmentInput): Promise<AssessmentOutput> {
  return assessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessmentPrompt',
  input: { schema: AssessmentInputSchema },
  output: { schema: AssessmentOutputSchema },
  prompt: `You are an expert in creating educational assessments. Generate a 5-question multiple-choice quiz to evaluate a user's baseline knowledge for their stated career goal.

The questions should be suitable for a beginner and cover fundamental concepts related to the user's goal and existing skills. For each question, provide 4 options, one correct answer, and a brief explanation for the answer.

**User Profile:**
- **Career Goal:** {{{careerGoal}}}
- **Current Profession:** {{{profession}}}
- **Current Skills:** {{{currentSkills}}}

Generate an assessment titled "Baseline Knowledge Check" with 5 questions.`,
});

const assessmentFlow = ai.defineFlow(
  {
    name: 'assessmentFlow',
    inputSchema: AssessmentInputSchema,
    outputSchema: AssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
