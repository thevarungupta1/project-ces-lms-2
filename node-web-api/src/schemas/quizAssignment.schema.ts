import { z } from 'zod';

export const createQuizAssignmentSchema = z.object({
  body: z.object({
    quiz: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
    learner: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learner ID'),
    dueDate: z.string().datetime().optional(),
    group: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

export const assignQuizToGroupSchema = z.object({
  params: z.object({
    quizId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
    groupId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid group ID'),
  }),
  body: z.object({
    dueDate: z.string().datetime().optional(),
  }),
});

export const submitQuizSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assignment ID'),
  }),
  body: z.object({
    answers: z.array(z.object({
      questionIndex: z.number().int().min(0),
      selectedAnswer: z.number().int().min(0),
    })),
  }),
});

export type CreateQuizAssignmentInput = z.infer<typeof createQuizAssignmentSchema>['body'];
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>['body'];

