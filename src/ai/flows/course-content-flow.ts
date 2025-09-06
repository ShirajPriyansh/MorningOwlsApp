
'use server';
/**
 * @fileOverview Generates course content with video and text resources.
 *
 * - generateCourseContent - Creates a list of learning materials.
 * - CourseContentInput - The input type for content generation.
 * - CourseContentOutput - The return type for content generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CourseContentInputSchema = z.object({
  careerGoal: z.string().describe("The user's primary career goal."),
  currentSkills: z.string().describe("The user's current skills."),
});
export type CourseContentInput = z.infer<typeof CourseContentInputSchema>;

const VideoResourceSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  url: z.string().url().describe('The full URL of the YouTube video.'),
  description: z.string().describe('A brief, compelling description of what the user will learn from the video.'),
});

const WebResourceSchema = z.object({
  title: z.string().describe('The title of the web article or resource.'),
  url: z.string().url().describe('The full URL of the resource.'),
});

export const CourseContentOutputSchema = z.object({
  title: z.string().describe('A title for the course content page.'),
  description: z.string().describe('A brief, encouraging description of the learning materials.'),
  videos: z.array(VideoResourceSchema).describe('An array of 3 relevant YouTube video recommendations.'),
  resources: z.array(WebResourceSchema).describe('An array of 3 relevant web articles or documentation links.'),
});
export type CourseContentOutput = z.infer<typeof CourseContentOutputSchema>;

export async function generateCourseContent(input: CourseContentInput): Promise<CourseContentOutput> {
  return courseContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseContentPrompt',
  input: { schema: CourseContentInputSchema },
  output: { schema: CourseContentOutputSchema },
  prompt: `You are an expert instructional designer. A user wants to learn new skills to achieve a career goal. Generate a set of high-quality, relevant learning resources for them.

The user is looking for both video content and written materials. Find 3 YouTube videos and 3 web resources (articles, tutorials, documentation) that would be most helpful.

**User Profile:**
- **Career Goal:** {{{careerGoal}}}
- **Current Skills:** {{{currentSkills}}}

Generate a title and description for the course page, and provide the lists of video and web resources. For videos, include a short description. Ensure all URLs are valid.`,
});

const courseContentFlow = ai.defineFlow(
  {
    name: 'courseContentFlow',
    inputSchema: CourseContentInputSchema,
    outputSchema: CourseContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
