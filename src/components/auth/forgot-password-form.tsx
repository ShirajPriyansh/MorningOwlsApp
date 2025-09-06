"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordReset } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: null,
  instructions: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Sending..." : "Send Reset Instructions"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && state.message) {
        toast({
            title: "Success",
            description: state.message
        });
    }
  }, [state, toast]);

  return (
    <div>
      {state.success ? (
        <div className="space-y-4 text-center">
            <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold">Instructions Generated</h3>
            <p className="text-muted-foreground">Please follow the AI-generated instructions below.</p>
            <Card className="text-left bg-muted/50">
                <CardContent className="p-4">
                    <p className="whitespace-pre-wrap font-mono text-sm">{state.instructions}</p>
                </CardContent>
            </Card>
            <Button asChild variant="outline" className="w-full">
                <Link href="/login">Back to Login</Link>
            </Button>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <SubmitButton />
          <div className="text-sm text-center text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
