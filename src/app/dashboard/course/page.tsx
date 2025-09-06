
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateCourseContent, type CourseContentOutput, type CourseContentInput } from '@/ai/flows/course-content-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Youtube, Link as LinkIcon, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function CoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courseContent, setCourseContent] = useState<CourseContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseContent = async () => {
      const goals = localStorage.getItem('learning_goals');
      if (!goals) {
        toast({
          title: 'Set Your Goals First',
          description: 'You need to set your learning goals before accessing course content.',
          variant: 'destructive',
        });
        router.push('/dashboard/goals');
        return;
      }

      try {
        const parsedGoals: CourseContentInput = JSON.parse(goals);
        const content = await generateCourseContent(parsedGoals);
        setCourseContent(content);
      } catch (error) {
        console.error('Failed to generate course content:', error);
        toast({
          title: 'Error',
          description: 'Could not generate course content. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseContent();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Generating your course content...</p>
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Could not load course content.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline mb-2">
          {courseContent.title}
        </h1>
        <p className="text-muted-foreground mb-8">
          {courseContent.description}
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="text-red-500" />
                Recommended Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courseContent.videos.map((video, index) => (
                <a href={video.url} target="_blank" rel="noopener noreferrer" key={index} className="group block">
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video">
                        <Image src={`https://img.youtube.com/vi/${new URL(video.url).searchParams.get('v')}/hqdefault.jpg`} alt={video.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="youtube thumbnail" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen />
                Recommended Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseContent.resources.map((resource, index) => (
                 <a href={resource.url} target="_blank" rel="noopener noreferrer" key={index} className="group block">
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4 flex items-start gap-4">
                          <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <LinkIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold group-hover:text-primary transition-colors">{resource.title}</p>
                            <p className="text-sm text-muted-foreground">{new URL(resource.url).hostname}</p>
                          </div>
                      </CardContent>
                    </Card>
                 </a>
              ))}
            </CardContent>
          </Card>

        </div>
         <div className="mt-8 flex justify-center">
            <Button asChild>
                <Link href="/dashboard/assessment">
                    Take an Assessment
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
