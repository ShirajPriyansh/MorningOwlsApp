
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OwlIcon } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <OwlIcon className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold font-headline md:text-7xl text-primary">
          Morning_Owls
        </h1>
        <p className="max-w-2xl text-lg text-foreground/80">
          Your personalized micro-learning engine. Measurably improve your skills with less fatigue.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="font-bold">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
