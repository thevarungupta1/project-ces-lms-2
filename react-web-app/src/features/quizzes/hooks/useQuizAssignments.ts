import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAssignmentApi, QuizAssignment, CreateQuizAssignmentInput, SubmitQuizInput, QuizAssignmentFilters } from '../api/quizAssignment.api';
import { toast } from 'sonner';

/**
 * Hook to get all assignments with pagination
 */
export const useQuizAssignments = (filters?: QuizAssignmentFilters) => {
  return useQuery({
    queryKey: ['quiz-assignments', filters],
    queryFn: () => quizAssignmentApi.getAssignments(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get assignment by ID
 */
export const useQuizAssignment = (id: string) => {
  return useQuery({
    queryKey: ['quiz-assignment', id],
    queryFn: () => quizAssignmentApi.getAssignmentById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create assignment
 */
export const useCreateQuizAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizAssignmentInput) => quizAssignmentApi.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-assignments'] });
      toast.success('Quiz assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to assign quiz');
    },
  });
};

/**
 * Hook to assign quiz to group
 */
export const useAssignQuizToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, groupId, dueDate }: { quizId: string; groupId: string; dueDate?: string }) =>
      quizAssignmentApi.assignToGroup(quizId, groupId, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-assignments'] });
      toast.success('Quiz assigned to group successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to assign quiz to group');
    },
  });
};

/**
 * Hook to submit quiz
 */
export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitQuizInput }) =>
      quizAssignmentApi.submitQuiz(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-assignment', variables.id] });
      if (result.passed) {
        toast.success(`Quiz passed! You scored ${result.score}%`);
      } else {
        toast.error(`Quiz completed. You scored ${result.score}%. Keep practicing!`);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit quiz');
    },
  });
};

/**
 * Hook to delete assignment
 */
export const useDeleteQuizAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizAssignmentApi.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-assignments'] });
      toast.success('Assignment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete assignment');
    },
  });
};

