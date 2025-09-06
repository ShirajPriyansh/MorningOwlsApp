'use server';

/**
 * @fileOverview A password reset assistance AI agent.
 *
 * - passwordResetAssistance - A function that handles the password reset process.
 * - PasswordResetAssistanceInput - The input type for the passwordResetAssistance function.
 * - PasswordResetAssistanceOutput - The return type for the passwordResetAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PasswordResetAssistanceInputSchema = z.object({
  email: z.string().email().describe('The user email address.'),
});
export type PasswordResetAssistanceInput = z.infer<typeof PasswordResetAssistanceInputSchema>;

const PasswordResetAssistanceOutputSchema = z.object({
  instructions: z.string().describe('The instructions to follow in order to reset the password.'),
});
export type PasswordResetAssistanceOutput = z.infer<typeof PasswordResetAssistanceOutputSchema>;

export async function passwordResetAssistance(input: PasswordResetAssistanceInput): Promise<PasswordResetAssistanceOutput> {
  return passwordResetAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'passwordResetAssistancePrompt',
  input: {schema: PasswordResetAssistanceInputSchema},
  output: {schema: PasswordResetAssistanceOutputSchema},
  prompt: `You are an AI assistant designed to guide users through the password reset process.

The user has forgotten their password and needs your help to reset it. Use email verification and security questions to ensure a secure and user-friendly experience.

Generate clear and concise instructions for the user to follow.

Email: {{{email}}}`,
});

const passwordResetAssistanceFlow = ai.defineFlow(
  {
    name: 'passwordResetAssistanceFlow',
    inputSchema: PasswordResetAssistanceInputSchema,
    outputSchema: PasswordResetAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
