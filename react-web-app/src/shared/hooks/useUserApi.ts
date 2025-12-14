import { useQuery } from '@tanstack/react-query';
import { userApi, UserProfile } from '../api/user.api';

/**
 * Hook to get current user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

