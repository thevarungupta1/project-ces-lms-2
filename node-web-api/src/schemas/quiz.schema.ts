import { z } from 'zod';

const quizQuestionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  correctAnswer: z.number().int().min(0, 'Correct answer index must be valid'),
});

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
    duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
    totalQuestions: z.number().int().min(1, 'At least 1 question required'),
    passingScore: z.number().int().min(0).max(100, 'Passing score must be between 0 and 100'),
    attempts: z.number().int().min(1).optional(),
    questions: z.array(quizQuestionSchema).min(1, 'At least 1 question required'),
  }),
});

export const updateQuizSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    duration: z.number().int().min(1).optional(),
    passingScore: z.number().int().min(0).max(100).optional(),
    attempts: z.number().int().min(1).optional(),
    questions: z.array(quizQuestionSchema).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getQuizSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
  }),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>['body'];
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>['body'];

