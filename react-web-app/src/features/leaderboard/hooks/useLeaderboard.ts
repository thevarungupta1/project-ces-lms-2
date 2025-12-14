import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '../api/leaderboard.api';

export const useLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => leaderboardApi.getLeaderboard(limit),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMyRanking = () => {
  return useQuery({
    queryKey: ['leaderboard', 'me'],
    queryFn: () => leaderboardApi.getMyRanking(),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

