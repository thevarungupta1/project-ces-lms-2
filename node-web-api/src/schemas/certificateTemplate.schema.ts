import { z } from 'zod';

export const createCertificateTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    borderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    logoUrl: z.string().url().optional(),
    signatureName: z.string().min(2, 'Signature name must be at least 2 characters'),
    signatureTitle: z.string().min(2, 'Signature title must be at least 2 characters'),
    footerText: z.string().optional(),
  }),
});

export const updateCertificateTemplateSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid template ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    borderColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    logoUrl: z.string().url().optional(),
    signatureName: z.string().min(2).optional(),
    signatureTitle: z.string().min(2).optional(),
    footerText: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateCertificateTemplateInput = z.infer<typeof createCertificateTemplateSchema>['body'];
export type UpdateCertificateTemplateInput = z.infer<typeof updateCertificateTemplateSchema>['body'];

