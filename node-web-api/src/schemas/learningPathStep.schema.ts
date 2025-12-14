import { z } from 'zod';

export const createLearningPathStepSchema = z.object({
  body: z.object({
    learningPath: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learning path ID'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    stepOrder: z.number().int().min(1, 'Step order must be at least 1'),
    stepType: z.enum(['course', 'webinar', 'quiz', 'resource']),
    isRequired: z.boolean().optional(),
    durationWeeks: z.number().int().min(1, 'Duration must be at least 1 week'),
    resourceLink: z.string().url().optional(),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    webinar: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    quiz: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

export const updateLearningPathStepSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid step ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    stepOrder: z.number().int().min(1).optional(),
    isRequired: z.boolean().optional(),
    durationWeeks: z.number().int().min(1).optional(),
    resourceLink: z.string().url().optional(),
  }),
});

export type CreateLearningPathStepInput = z.infer<typeof createLearningPathStepSchema>['body'];
export type UpdateLearningPathStepInput = z.infer<typeof updateLearningPathStepSchema>['body'];

