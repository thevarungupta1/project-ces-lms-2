import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseAssignmentApi, CourseAssignment, CreateCourseAssignmentInput, UpdateCourseAssignmentInput, CourseAssignmentFilters } from '../api/courseAssignment.api';
import { toast } from 'sonner';

/**
 * Hook to get all assignments with pagination
 */
export const useCourseAssignments = (filters?: CourseAssignmentFilters) => {
  return useQuery({
    queryKey: ['course-assignments', filters],
    queryFn: () => courseAssignmentApi.getAssignments(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get assignment by ID
 */
export const useCourseAssignment = (id: string) => {
  return useQuery({
    queryKey: ['course-assignment', id],
    queryFn: () => courseAssignmentApi.getAssignmentById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create assignment
 */
export const useCreateCourseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseAssignmentInput) => courseAssignmentApi.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      toast.success('Course assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to assign course');
    },
  });
};

/**
 * Hook to assign course to group
 */
export const useAssignCourseToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, groupId, dueDate }: { courseId: string; groupId: string; dueDate?: string }) =>
      courseAssignmentApi.assignToGroup(courseId, groupId, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      toast.success('Course assigned to group successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to assign course to group');
    },
  });
};

/**
 * Hook to update assignment
 */
export const useUpdateCourseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseAssignmentInput }) =>
      courseAssignmentApi.updateAssignment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['course-assignment', variables.id] });
      toast.success('Assignment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update assignment');
    },
  });
};

/**
 * Hook to update assignment progress
 */
export const useUpdateCourseAssignmentProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress, status }: { id: string; progress: number; status?: 'not_started' | 'in_progress' | 'completed' }) =>
      courseAssignmentApi.updateProgress(id, progress, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['course-assignment', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update progress');
    },
  });
};

/**
 * Hook to delete assignment
 */
export const useDeleteCourseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseAssignmentApi.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      toast.success('Assignment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete assignment');
    },
  });
};

