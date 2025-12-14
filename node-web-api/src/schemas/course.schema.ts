import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    educator: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid educator ID'),
    duration: z.string().min(1, 'Duration is required'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    thumbnail: z.string().url().optional(),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    duration: z.string().optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    thumbnail: z.string().url().optional(),
  }),
});

export const getCourseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  }),
});

export const getCoursesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    educator: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    search: z.string().optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>['body'];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>['body'];

