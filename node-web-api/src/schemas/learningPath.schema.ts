import { z } from 'zod';

export const createLearningPathSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    durationWeeks: z.number().int().min(1, 'Duration must be at least 1 week'),
    thumbnail: z.string().url().optional(),
  }),
});

export const updateLearningPathSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learning path ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    durationWeeks: z.number().int().min(1).optional(),
    isActive: z.boolean().optional(),
    thumbnail: z.string().url().optional(),
  }),
});

export type CreateLearningPathInput = z.infer<typeof createLearningPathSchema>['body'];
export type UpdateLearningPathInput = z.infer<typeof updateLearningPathSchema>['body'];

