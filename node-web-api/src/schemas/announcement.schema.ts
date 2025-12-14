import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    type: z.enum(['info', 'success', 'warning', 'error']).optional(),
    targetAudience: z.enum(['all', 'learners', 'educators', 'managers']).optional(),
    targetDepartments: z.array(z.string()).optional(),
  }),
});

export const updateAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid announcement ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    message: z.string().min(10).optional(),
    type: z.enum(['info', 'success', 'warning', 'error']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>['body'];
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>['body'];

