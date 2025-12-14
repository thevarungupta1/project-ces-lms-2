import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    message: z.string().min(5, 'Message must be at least 5 characters'),
    type: z.enum(['info', 'success', 'warning', 'error']).optional(),
    link: z.string().url().optional(),
  }),
});

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification ID'),
  }),
});

export const markAllAsReadSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];

