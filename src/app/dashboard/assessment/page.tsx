
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateAssessment, type AssessmentOutput, type AssessmentInput } from '@/ai/flows/assessment-flow';
import { generateRecommendations, type RecommendationsOutput } from '@/ai/flows/recommendations-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, XCircle, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

export default function AssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<AssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendations, setRecommendations] = useState<RecommendationsOutput | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      const goals = localStorage.getItem('learning_goals');
      if (!goals) {
        toast({
          title: 'Set Your Goals First',
          description: 'You need to set your learning goals before taking an assessment.',
          variant: 'destructive',
        });
        router.push('/dashboard/goals');
        return;
      }

      try {
        const parsedGoals: AssessmentInput = JSON.parse(goals);
        const generatedAssessment = await generateAssessment(parsedGoals);
        setAssessment(generatedAssessment);
      } catch (error) {
        console.error('Failed to generate assessment:', error);
        toast({
          title: 'Error',
          description: 'Could not generate an assessment. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [router, toast]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctAnswers = 0;
    assessment?.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correctAnswers++;
      }
    });

    const finalScore = correctAnswers;
    setScore(finalScore);
    setSubmitted(true);

    try {
        const goals = localStorage.getItem('learning_goals');
        if (goals && assessment) {
            const parsedGoals: AssessmentInput = JSON.parse(goals);
            const recommendations = await generateRecommendations({
                careerGoal: parsedGoals.careerGoal,
                score: finalScore,
                assessmentTitle: assessment.title,
            });
            setRecommendations(recommendations);
        }
    } catch(error) {
        console.error('Failed to generate recommendations:', error);
        toast({
            title: 'Error',
            description: 'Could not generate recommendations. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const getAnswerStatus = (questionIndex: number, option: string): AnswerStatus => {
    if (!submitted) return 'unanswered';
    const correctAnswer = assessment!.questions[questionIndex].answer;
    const userAnswer = userAnswers[questionIndex];
    if (option === correctAnswer) return 'correct';
    if (option === userAnswer && option !== correctAnswer) return 'incorrect';
    return 'unanswered';
  };
  
  const resetAssessment = () => {
    setAssessment(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setRecommendations(null);
    setIsLoading(true);
    const fetchAssessment = async () => {
      const goals = localStorage.getItem('learning_goals');
      if (!goals) {
        router.push('/dashboard/goals');
        return;
      }
      try {
        const parsedGoals: AssessmentInput = JSON.parse(goals);
        const generatedAssessment = await generateAssessment(parsedGoals);
        setAssessment(generatedAssessment);
      } catch (error) {
        console.error('Failed to generate assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessment();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Generating your assessment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Could not load assessment.</p>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>
              You scored {score} out of {assessment.questions.length}. Here is what to focus on next.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitting || !recommendations ? (
                 <div className="flex flex-col items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating your recommendations...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">{recommendations.title}</h3>
                     {recommendations.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/20">
                        <p className="font-semibold">{rec.topic}</p>
                        <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                    ))}
                </div>
            )}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-center gap-2">
            <Button onClick={resetAssessment} variant="outline">
              Take a New Assessment
            </Button>
            <Button asChild>
                <Link href="/dashboard">
                  <Rocket className="mr-2" />
                  Back to Learning Path
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription>
              Test your knowledge and find your starting point.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {assessment.questions.map((q, index) => (
              <div key={index}>
                <p className="font-semibold mb-4">
                  {index + 1}. {q.question}
                </p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={userAnswers[index]}
                  disabled={isSubmitting}
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-2 p-2 rounded-md ${
                        'hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`${index}-${option}`} />
                      <Label htmlFor={`${index}-${option}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
