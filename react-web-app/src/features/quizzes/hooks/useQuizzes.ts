import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi, Quiz, CreateQuizInput, UpdateQuizInput, QuizFilters } from '../api/quiz.api';
import { toast } from 'sonner';

/**
 * Hook to get all quizzes with pagination
 */
export const useQuizzes = (filters?: QuizFilters) => {
  return useQuery({
    queryKey: ['quizzes', filters],
    queryFn: () => quizApi.getQuizzes(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get quiz by ID
 */
export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getQuizById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get quizzes by course ID
 */
export const useQuizzesByCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['quizzes', 'course', courseId],
    queryFn: () => quizApi.getQuizzesByCourse(courseId),
    enabled: !!courseId,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create quiz
 */
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizInput) => quizApi.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create quiz');
    },
  });
};

/**
 * Hook to update quiz
 */
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuizInput }) => 
      quizApi.updateQuiz(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
      toast.success('Quiz updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update quiz');
    },
  });
};

/**
 * Hook to delete quiz
 */
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizApi.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete quiz');
    },
  });
};

