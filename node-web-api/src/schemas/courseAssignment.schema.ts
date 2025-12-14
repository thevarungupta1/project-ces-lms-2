import { z } from 'zod';

export const createCourseAssignmentSchema = z.object({
  body: z.object({
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    learner: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learner ID'),
    dueDate: z.string().datetime().optional(),
    group: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

export const assignToGroupSchema = z.object({
  params: z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    groupId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid group ID'),
  }),
  body: z.object({
    dueDate: z.string().datetime().optional(),
  }),
});

export const updateAssignmentProgressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assignment ID'),
  }),
  body: z.object({
    progress: z.number().int().min(0).max(100),
    status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  }),
});

export type CreateCourseAssignmentInput = z.infer<typeof createCourseAssignmentSchema>['body'];

