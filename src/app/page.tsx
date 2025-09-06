import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold font-headline md:text-7xl text-primary">
          AuthGate
        </h1>
        <p className="max-w-2xl text-lg text-foreground/80">
          Your secure and seamless gateway to modern authentication. Built with
          Next.js, providing a world-class user experience.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="font-bold">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
