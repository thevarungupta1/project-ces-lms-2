import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseContentApi, CourseContent, CreateCourseContentInput, UpdateCourseContentInput } from '../api/courseContent.api';
import { toast } from 'sonner';

/**
 * Hook to get content by module ID
 */
export const useCourseContent = (moduleId: string) => {
  return useQuery({
    queryKey: ['course-content', moduleId],
    queryFn: () => courseContentApi.getContentByModule(moduleId),
    enabled: !!moduleId,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get content by ID
 */
export const useCourseContentById = (id: string) => {
  return useQuery({
    queryKey: ['course-content-item', id],
    queryFn: () => courseContentApi.getContentById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create content
 */
export const useCreateCourseContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseContentInput) => courseContentApi.createContent(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-content', variables.module] });
      toast.success('Content created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create content');
    },
  });
};

/**
 * Hook to update content
 */
export const useUpdateCourseContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseContentInput }) => 
      courseContentApi.updateContent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-content'] });
      queryClient.invalidateQueries({ queryKey: ['course-content-item', variables.id] });
      toast.success('Content updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update content');
    },
  });
};

/**
 * Hook to delete content
 */
export const useDeleteCourseContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseContentApi.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-content'] });
      toast.success('Content deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete content');
    },
  });
};

