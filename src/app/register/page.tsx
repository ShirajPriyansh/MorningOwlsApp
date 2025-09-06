import AuthLayout from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Join AuthGate to get started"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
