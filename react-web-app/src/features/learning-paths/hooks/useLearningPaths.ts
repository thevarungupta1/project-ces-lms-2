import { useQuery } from '@tanstack/react-query';
import { learningPathApi, LearningPathFilters } from '../api/learningPath.api';

export const useLearningPaths = (filters?: LearningPathFilters) => {
  return useQuery({
    queryKey: ['learning-paths', filters],
    queryFn: () => learningPathApi.getLearningPaths(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLearningPath = (id: string) => {
  return useQuery({
    queryKey: ['learning-path', id],
    queryFn: () => learningPathApi.getLearningPathById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

