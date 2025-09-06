
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Check, Wand2, Pencil, Briefcase, User, Target, Palette } from 'lucide-react';
import { generateLearningPlan, type LearningPlanInput } from '@/ai/flows/learning-plan-flow';
import { generateSkillKeywords } from '@/ai/flows/skill-keywords-flow';
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

const professions = [
    { id: 'student', label: 'Student' },
    { id: 'software-engineer', label: 'Software Engineer' },
    { id: 'designer', label: 'Designer' },
    { id: 'product-manager', label: 'Product Manager' },
    { id: 'other', label: 'Other' },
] as const;


const goalsSchema = z.object({
  careerGoal: z.string().min(5, 'Please describe your career goal in more detail.'),
  profession: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one profession.',
  }),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  learningStyle: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one learning style.',
  }),
  currentSkills: z.string().min(3, 'Please list at least one current skill.'),
});

type GoalsFormValues = z.infer<typeof goalsSchema>;

function GoalsDisplay({ goals, onEdit }: { goals: GoalsFormValues, onEdit: () => void }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Your Learning Goals</CardTitle>
                <CardDescription>
                    This is your current learning configuration. Click edit to make changes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Target /> Career Goal</h3>
                    <p className="text-muted-foreground">{goals.careerGoal}</p>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Briefcase /> Profession(s)</h3>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(goals.profession) && goals.profession.map(p => {
                            const profession = professions.find(item => item.id === p);
                            return <Badge key={p} variant="secondary">{profession?.label || p}</Badge>
                        })}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><User /> Skill Level</h3>
                    <p className="text-muted-foreground capitalize">{goals.skillLevel}</p>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Palette /> Preferred Learning Style(s)</h3>
                     <div className="flex flex-wrap gap-2">
                        {Array.isArray(goals.learningStyle) && goals.learningStyle.map(ls => {
                             const style = learningStyles.find(item => item.id === ls);
                             return <Badge key={ls} variant="secondary">{style?.label || ls}</Badge>
                        })}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Sparkles /> Current Skills</h3>
                    <p className="text-muted-foreground">{goals.currentSkills}</p>
                 </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onEdit}>
                    <Pencil className="mr-2" />
                    Edit Goals
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function GoalsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const form = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      careerGoal: '',
      profession: [],
      skillLevel: 'beginner',
      learningStyle: [],
      currentSkills: '',
    },
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('learning_goals');
    if (savedGoals) {
      form.reset(JSON.parse(savedGoals));
    } else {
        // If no goals are found, we assume it's a new user or they cleared their data.
        // Onboarding is the right place to start from.
        setIsEditing(true);
    }
    setHasLoaded(true);
  }, [form, router]);
  
  const handleSuggestSkills = async () => {
    const careerGoal = form.getValues('careerGoal');
    if (!careerGoal || careerGoal.length < 5) {
        form.setError('careerGoal', {
            type: 'manual',
            message: 'Please enter a career goal before suggesting skills.'
        });
        return;
    }
    setIsSuggesting(true);
    try {
        const result = await generateSkillKeywords({ careerGoal });
        form.setValue('currentSkills', result.keywords.join(', '));
        form.clearErrors('currentSkills');
    } catch (error) {
        console.error('Failed to suggest skills:', error);
        toast({
            title: 'Error',
            description: 'Could not suggest skills. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSuggesting(false);
    }
  };


  async function onSubmit(values: GoalsFormValues) {
    setIsLoading(true);
    try {
      localStorage.setItem('learning_goals', JSON.stringify(values));
      
      const plan = await generateLearningPlan(values as LearningPlanInput);
      localStorage.setItem('learning_plan', JSON.stringify(plan));
      
      toast({
        title: 'Learning Plan Updated!',
        description: 'Your personalized learning path has been regenerated.',
      });
      setIsEditing(false); // Exit edit mode
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

  const savedGoals = form.getValues();

  if (!hasLoaded) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {!isEditing && savedGoals.careerGoal ? (
            <GoalsDisplay goals={savedGoals} onEdit={() => setIsEditing(true)} />
        ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Update Your Learning Goals</CardTitle>
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
                  render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel>What is your current profession?</FormLabel>
                             <FormDescription>
                                Select all that apply.
                              </FormDescription>
                        </div>
                      {professions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="profession"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
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
                        <div className="relative">
                            <Textarea
                              placeholder="e.g., HTML, CSS, basic JavaScript"
                              {...field}
                              className="pr-28"
                            />
                             <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={handleSuggestSkills}
                                disabled={isSuggesting}
                            >
                                {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" /> }
                                Suggest
                            </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                         List skills you have, or let AI suggest some based on your goal.
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
                
                <div className="flex justify-end gap-2">
                    {savedGoals.careerGoal && (
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Save & Regenerate Plan
                        </>
                      )}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
