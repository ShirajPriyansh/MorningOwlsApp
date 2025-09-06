
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
            <OwlIcon className="w-8 h-8" />
            <span className="text-2xl font-bold font-headline">Morning_Owls</span>
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
