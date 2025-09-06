import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex items-center min-h-screen justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-2xl font-bold font-headline">AuthGate</span>
          </Link>
        </div>
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">{title}</CardTitle>
            <CardDescription className="text-center pt-2">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
