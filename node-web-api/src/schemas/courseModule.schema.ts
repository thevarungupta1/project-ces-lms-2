import { z } from 'zod';

export const createCourseModuleSchema = z.object({
  body: z.object({
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    moduleOrder: z.number().int().min(1, 'Module order must be at least 1'),
  }),
});

export const updateCourseModuleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    moduleOrder: z.number().int().min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getCourseModuleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID'),
  }),
});

export type CreateCourseModuleInput = z.infer<typeof createCourseModuleSchema>['body'];
export type UpdateCourseModuleInput = z.infer<typeof updateCourseModuleSchema>['body'];

