
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
  Activity,
  Calendar,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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

const chartData = [
  { skill: 'HTML/CSS', hours: 4 },
  { skill: 'JavaScript', hours: 8 },
  { skill: 'React', hours: 12 },
  { skill: 'Next.js', hours: 6 },
  { skill: 'Genkit', hours: 5 },
];

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--primary))",
  },
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
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>
                  Here's a look at your learning activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">35 hours</div>
                    <p className="text-xs text-muted-foreground">
                      Across all skills
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.5 hours</div>
                    <p className="text-xs text-muted-foreground">
                      Based on your activity this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23 days</div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-3">
                  <CardHeader>
                    <CardTitle>Time Spent on Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ChartContainer config={chartConfig} className="h-64 w-full">
                       <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="skill"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

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
                <Button asChild>
                  <Link href="/dashboard/assessment">
                    <Rocket className="mr-2" />
                    Start Learning
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
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
