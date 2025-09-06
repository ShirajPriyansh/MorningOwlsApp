
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  GraduationCap,
  Loader2,
  Rocket,
} from 'lucide-react';

type LearningStep = {
  title: string;
  duration: string;
  description: string;
};

type LearningPlan = {
  title: string;
  description: string;
  steps: LearningStep[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.replace('/login');
      return;
    }
    const plan = localStorage.getItem('learning_plan');
    if (plan) {
      setLearningPlan(JSON.parse(plan));
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline mb-2">
          Your Learning Path
        </h1>
        <p className="text-muted-foreground mb-8">
          Your personalized journey to mastery.
        </p>

        {learningPlan ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6" />
                {learningPlan.title}
              </CardTitle>
              <CardDescription>{learningPlan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {learningPlan.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    {index < learningPlan.steps.length - 1 && (
                      <div className="w-px h-full bg-border" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {step.duration}
                    </p>
                    <p className="mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                <Link href="/dashboard/goals">Adjust Goals</Link>
              </Button>
              <Button>
                <Rocket className="mr-2" />
                Start Learning
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg text-center">
            <CardHeader>
              <CardTitle>Define Your Goals</CardTitle>
              <CardDescription>
                Let's create a personalized learning plan to help you achieve
                your career ambitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You haven't set your learning goals yet.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/goals">
                  <Rocket className="mr-2" />
                  Set Your Goals
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
