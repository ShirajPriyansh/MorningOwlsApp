import AuthLayout from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive reset instructions"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
