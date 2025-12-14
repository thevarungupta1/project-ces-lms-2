import { z } from 'zod';

export const createCourseContentSchema = z.object({
  body: z.object({
    module: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    contentType: z.enum(['video', 'document', 'link', 'quiz', 'assignment']),
    contentUrl: z.string().url().optional(),
    contentText: z.string().optional(),
    order: z.number().int().min(1, 'Order must be at least 1'),
    duration: z.number().int().min(0).optional(),
  }),
});

export const updateCourseContentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid content ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    contentType: z.enum(['video', 'document', 'link', 'quiz', 'assignment']).optional(),
    contentUrl: z.string().url().optional(),
    contentText: z.string().optional(),
    order: z.number().int().min(1).optional(),
    duration: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getCourseContentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid content ID'),
  }),
});

export type CreateCourseContentInput = z.infer<typeof createCourseContentSchema>['body'];
export type UpdateCourseContentInput = z.infer<typeof updateCourseContentSchema>['body'];

