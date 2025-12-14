import { z } from 'zod';

export const createWebinarRegistrationSchema = z.object({
  body: z.object({
    webinar: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid webinar ID'),
  }),
});

export const updateAttendanceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid registration ID'),
  }),
  body: z.object({
    attended: z.boolean(),
  }),
});

export type CreateWebinarRegistrationInput = z.infer<typeof createWebinarRegistrationSchema>['body'];

