import { z } from 'zod';

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid member ID')).optional(),
  }),
});

export const updateGroupSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid group ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>['body'];
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>['body'];

