import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webinarApi, Webinar, CreateWebinarInput, UpdateWebinarInput, WebinarFilters } from '../api/webinar.api';
import { toast } from 'sonner';

/**
 * Hook to get all webinars with pagination
 */
export const useWebinars = (filters?: WebinarFilters) => {
  return useQuery({
    queryKey: ['webinars', filters],
    queryFn: () => webinarApi.getWebinars(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get upcoming webinars
 */
export const useUpcomingWebinars = () => {
  return useQuery({
    queryKey: ['webinars', 'upcoming'],
    queryFn: () => webinarApi.getUpcomingWebinars(),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get webinar by ID
 */
export const useWebinar = (id: string) => {
  return useQuery({
    queryKey: ['webinar', id],
    queryFn: () => webinarApi.getWebinarById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create webinar
 */
export const useCreateWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebinarInput) => webinarApi.createWebinar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create webinar');
    },
  });
};

/**
 * Hook to update webinar
 */
export const useUpdateWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebinarInput }) => 
      webinarApi.updateWebinar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', variables.id] });
      toast.success('Webinar updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update webinar');
    },
  });
};

/**
 * Hook to delete webinar
 */
export const useDeleteWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => webinarApi.deleteWebinar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete webinar');
    },
  });
};

