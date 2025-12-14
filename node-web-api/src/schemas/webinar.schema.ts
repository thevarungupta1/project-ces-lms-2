import { z } from 'zod';

export const createWebinarSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    host: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid host ID'),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    scheduledDate: z.string().datetime(),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    timezone: z.string().default('UTC'),
    status: z.enum(['draft', 'published', 'completed', 'cancelled']).optional(),
    registrationRequired: z.boolean().optional(),
    registrationDeadline: z.string().datetime().optional(),
    maxAttendees: z.number().int().min(1).optional(),
    meetingLink: z.string().url().optional(),
    meetingId: z.string().optional(),
    meetingPassword: z.string().optional(),
    isRecorded: z.boolean().optional(),
    thumbnailUrl: z.string().url().optional(),
    targetAudience: z.string().optional(),
  }),
});

export const updateWebinarSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid webinar ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    scheduledDate: z.string().datetime().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    status: z.enum(['draft', 'published', 'completed', 'cancelled']).optional(),
    registrationRequired: z.boolean().optional(),
    registrationDeadline: z.string().datetime().optional(),
    maxAttendees: z.number().int().min(1).optional(),
    meetingLink: z.string().url().optional(),
    meetingPassword: z.string().optional(),
    isRecorded: z.boolean().optional(),
    recordingUrl: z.string().url().optional(),
    thumbnailUrl: z.string().url().optional(),
  }),
});

export type CreateWebinarInput = z.infer<typeof createWebinarSchema>['body'];
export type UpdateWebinarInput = z.infer<typeof updateWebinarSchema>['body'];

