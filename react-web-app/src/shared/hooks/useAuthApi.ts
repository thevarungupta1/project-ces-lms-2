import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../api/client';
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from '../api/types';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuthData } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);
      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      return response;
    },
    onSuccess: (data) => {
      // Update auth context
      if (setAuthData) {
        setAuthData({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

/**
 * Hook for refreshing access token
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (data: RefreshTokenRequest) => {
      const response = await authApi.refreshToken(data);
      // Update stored tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      return response;
    },
  });
};

