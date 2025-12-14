import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseModuleApi, CourseModule, CreateCourseModuleInput, UpdateCourseModuleInput } from '../api/courseModule.api';
import { toast } from 'sonner';

/**
 * Hook to get modules by course ID
 */
export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => courseModuleApi.getModulesByCourse(courseId),
    enabled: !!courseId,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get module by ID
 */
export const useCourseModule = (id: string) => {
  return useQuery({
    queryKey: ['course-module', id],
    queryFn: () => courseModuleApi.getModuleById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create module
 */
export const useCreateCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseModuleInput) => courseModuleApi.createModule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-modules', variables.course] });
      toast.success('Module created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create module');
    },
  });
};

/**
 * Hook to update module
 */
export const useUpdateCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseModuleInput }) => 
      courseModuleApi.updateModule(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-modules'] });
      queryClient.invalidateQueries({ queryKey: ['course-module', variables.id] });
      toast.success('Module updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update module');
    },
  });
};

/**
 * Hook to delete module
 */
export const useDeleteCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseModuleApi.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-modules'] });
      toast.success('Module deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete module');
    },
  });
};

