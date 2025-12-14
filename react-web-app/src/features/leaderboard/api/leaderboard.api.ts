import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface LeaderboardEntry {
  _id: string;
  id?: string;
  user: string | { _id: string; name: string; email: string };
  totalPoints: number;
  learningProgress: number;
  engagementScore: number;
  performanceScore: number;
  contributions: number;
  activitiesCompleted: number;
  rank?: number;
  createdAt: string;
  updatedAt: string;
}

export const leaderboardApi = {
  getLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', { params: { limit } });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch leaderboard');
    }
    return response.data.data;
  },

  getMyRanking: async (): Promise<LeaderboardEntry | null> => {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry | null>>('/leaderboard/me');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch ranking');
    }
    return response.data.data || null;
  },
};

