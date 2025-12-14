import { z } from 'zod';

export const issueCertificateSchema = z.object({
  body: z.object({
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    learner: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learner ID'),
    template: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid template ID').optional(),
    completionDate: z.string().datetime(),
  }),
});

export const getCertificateSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid certificate ID'),
  }),
});

export const getCertificateByNumberSchema = z.object({
  params: z.object({
    certificateNumber: z.string().min(1, 'Certificate number is required'),
  }),
});

export type IssueCertificateInput = z.infer<typeof issueCertificateSchema>['body'];

