import { z } from 'zod';

export const createLearningPathEnrollmentSchema = z.object({
  body: z.object({
    learningPath: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learning path ID'),
  }),
});

export const updateProgressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid enrollment ID'),
  }),
  body: z.object({
    progress: z.number().int().min(0).max(100),
    currentStep: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

export type CreateLearningPathEnrollmentInput = z.infer<typeof createLearningPathEnrollmentSchema>['body'];

