"use server";

import { passwordResetAssistance } from "@/ai/flows/password-reset-assistance";
import { z } from "zod";

export type PasswordResetState = {
  message: string | null;
  instructions: string | null;
  success: boolean;
};

const ResetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function requestPasswordReset(
  prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const validatedFields = ResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid input.',
      instructions: null,
      success: false,
    };
  }

  try {
    const result = await passwordResetAssistance({ email: validatedFields.data.email });
    return {
      message: "Please follow the instructions below to reset your password.",
      instructions: result.instructions,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
      instructions: null,
      success: false,
    };
  }
}
