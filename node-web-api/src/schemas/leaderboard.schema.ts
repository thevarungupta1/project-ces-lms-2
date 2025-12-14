import { z } from 'zod';

export const updateLeaderboardSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid leaderboard ID'),
  }),
  body: z.object({
    totalPoints: z.number().int().min(0).optional(),
    learningProgress: z.number().int().min(0).max(100).optional(),
    engagementScore: z.number().int().min(0).max(100).optional(),
    performanceScore: z.number().int().min(0).max(100).optional(),
    contributions: z.number().int().min(0).optional(),
    activitiesCompleted: z.number().int().min(0).optional(),
  }),
});

export type UpdateLeaderboardInput = z.infer<typeof updateLeaderboardSchema>['body'];

