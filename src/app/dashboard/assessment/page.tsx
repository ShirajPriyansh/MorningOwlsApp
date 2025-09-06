
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateAssessment, type AssessmentOutput, type AssessmentInput } from '@/ai/flows/assessment-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

export default function AssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<AssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length !== assessment?.questions.length) {
      toast({
        title: 'Incomplete Assessment',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive'
      });
      return;
    }
    
    let correctAnswers = 0;
    assessment?.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setSubmitted(true);
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
              You scored {score} out of {assessment.questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {assessment.questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-semibold mb-2">{q.question}</p>
                <p className="text-sm">
                  <span className="font-bold">Your Answer: </span>
                  <span className={userAnswers[index] === q.answer ? 'text-green-600' : 'text-red-600'}>
                    {userAnswers[index]}
                  </span>
                </p>
                 <p className="text-sm">
                  <span className="font-bold">Correct Answer: </span>
                  <span className="text-green-600">{q.answer}</span>
                </p>
                 <p className="text-sm text-muted-foreground mt-1">{q.explanation}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetAssessment}>
              Take a New Assessment
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
                  disabled={submitted}
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-2 p-2 rounded-md ${
                        submitted ? 
                        (getAnswerStatus(index, option) === 'correct' ? 'bg-green-100' : 
                         getAnswerStatus(index, option) === 'incorrect' ? 'bg-red-100' : '')
                        : 'hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`${index}-${option}`} />
                      <Label htmlFor={`${index}-${option}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                       {submitted && getAnswerStatus(index, option) === 'correct' && <CheckCircle className="w-5 h-5 text-green-600" />}
                       {submitted && getAnswerStatus(index, option) === 'incorrect' && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitted}>
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
