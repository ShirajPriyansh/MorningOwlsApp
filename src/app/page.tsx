
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OwlIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M14.5 13c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
        <path d="M9.5 13c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
        <path d="M12 15c-3 0-5.5 2.5-5.5 5.5"/>
    </svg>
);


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
