import { useQuery } from '@tanstack/react-query';
import { learningPathStepApi } from '../api/learningPathStep.api';

export const useLearningPathSteps = (learningPathId: string) => {
  return useQuery({
    queryKey: ['learning-path-steps', learningPathId],
    queryFn: () => learningPathStepApi.getStepsByLearningPath(learningPathId),
    enabled: !!learningPathId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

