import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathEnrollmentApi, CreateLearningPathEnrollmentInput, LearningPathEnrollmentFilters } from '../api/learningPathEnrollment.api';
import { toast } from 'sonner';

export const useLearningPathEnrollments = (filters?: LearningPathEnrollmentFilters) => {
  return useQuery({
    queryKey: ['learning-path-enrollments', filters],
    queryFn: () => learningPathEnrollmentApi.getEnrollments(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEnrollInLearningPath = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLearningPathEnrollmentInput) => learningPathEnrollmentApi.enroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-path-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
      toast.success('Enrolled in learning path successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to enroll in learning path');
    },
  });
};

