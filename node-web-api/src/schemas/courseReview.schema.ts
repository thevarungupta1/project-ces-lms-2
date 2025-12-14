import { z } from 'zod';

export const createCourseReviewSchema = z.object({
  body: z.object({
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().optional(),
  }),
});

export const updateCourseReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export type CreateCourseReviewInput = z.infer<typeof createCourseReviewSchema>['body'];
export type UpdateCourseReviewInput = z.infer<typeof updateCourseReviewSchema>['body'];

