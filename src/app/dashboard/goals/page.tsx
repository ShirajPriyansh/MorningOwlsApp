
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { generateLearningPlan, type LearningPlanInput } from '@/ai/flows/learning-plan-flow';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const learningStyles = [
  { id: 'visual', label: 'Visual (videos, diagrams)' },
  { id: 'auditory', label: 'Auditory (lectures, discussions)' },
  { id: 'reading/writing', label: 'Reading/Writing (articles, notes)' },
  { id: 'kinesthetic', label: 'Kinesthetic (hands-on projects)' },
] as const;


const goalsSchema = z.object({
  careerGoal: z.string().min(5, 'Please describe your career goal in more detail.'),
  profession: z.string().min(2, 'Please enter a valid profession.'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  learningStyle: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one learning style.',
  }),
  currentSkills: z.string().min(3, 'Please list at least one current skill.'),
});

type GoalsFormValues = z.infer<typeof goalsSchema>;

export default function GoalsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);

  const form = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      careerGoal: '',
      profession: '',
      skillLevel: 'beginner',
      learningStyle: [],
      currentSkills: '',
    },
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('learning_goals');
    if (savedGoals) {
      form.reset(JSON.parse(savedGoals));
      setHasGoals(true);
    }
  }, [form]);

  async function onSubmit(values: GoalsFormValues) {
    setIsLoading(true);
    try {
      localStorage.setItem('learning_goals', JSON.stringify(values));
      setHasGoals(true);
      
      const plan = await generateLearningPlan(values as LearningPlanInput);
      localStorage.setItem('learning_plan', JSON.stringify(plan));
      
      toast({
        title: 'Learning Plan Generated!',
        description: 'Your personalized learning path is ready.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to generate learning plan:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a learning plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Learning Goals</CardTitle>
            <CardDescription>
              Tell us about your aspirations so we can tailor your learning
              journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="careerGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your primary career goal?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Become a full-stack developer" {...field} />
                      </FormControl>
                      <FormDescription>
                        This helps us select the right topics for you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your current profession?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Student, Software Engineer" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your profession provides context for your learning goals.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your current relevant skills?</FormLabel>
                       <FormControl>
                        <Textarea
                          placeholder="e.g., HTML, CSS, basic JavaScript"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List any skills you have related to your goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your current skill level?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learningStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred learning style(s)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                               <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between h-auto",
                                  !field.value?.length && "text-muted-foreground"
                                )}
                              >
                                <div className="flex gap-1 flex-wrap">
                                  {Array.isArray(field.value) && field.value?.length > 0 ?
                                   field.value.map(styleId => {
                                      const style = learningStyles.find(s => s.id === styleId);
                                      return <Badge key={styleId} variant="secondary">{style?.label}</Badge>;
                                   })
                                   : "Select your learning styles"
                                  }
                                </div>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search styles..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                  {learningStyles.map((style) => (
                                    <CommandItem
                                      key={style.id}
                                      onSelect={() => {
                                        const currentValues = Array.isArray(field.value) ? field.value : [];
                                        const newValue = currentValues.includes(style.id)
                                          ? currentValues.filter((s) => s !== style.id)
                                          : [...currentValues, style.id];
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(style.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {style.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                       <FormDescription>
                        Select one or more styles. We'll use this to recommend the best content format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {hasGoals ? 'Update & Regenerate Plan' : 'Generate My Learning Plan'}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
