import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webinarRegistrationApi, WebinarRegistration, CreateWebinarRegistrationInput, WebinarRegistrationFilters } from '../api/webinarRegistration.api';
import { toast } from 'sonner';

/**
 * Hook to get all registrations with pagination
 */
export const useWebinarRegistrations = (filters?: WebinarRegistrationFilters) => {
  return useQuery({
    queryKey: ['webinar-registrations', filters],
    queryFn: () => webinarRegistrationApi.getRegistrations(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get registration by ID
 */
export const useWebinarRegistration = (id: string) => {
  return useQuery({
    queryKey: ['webinar-registration', id],
    queryFn: () => webinarRegistrationApi.getRegistrationById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to register for a webinar
 */
export const useRegisterForWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebinarRegistrationInput) => webinarRegistrationApi.register(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webinar-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', variables.webinar] });
      toast.success('Registered for webinar successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to register for webinar');
    },
  });
};

/**
 * Hook to update attendance
 */
export const useUpdateWebinarAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, attended }: { id: string; attended: boolean }) => 
      webinarRegistrationApi.updateAttendance(id, attended),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webinar-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['webinar-registration', variables.id] });
      toast.success('Attendance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update attendance');
    },
  });
};

/**
 * Hook to cancel registration
 */
export const useCancelWebinarRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => webinarRegistrationApi.cancelRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinar-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Registration cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to cancel registration');
    },
  });
};

