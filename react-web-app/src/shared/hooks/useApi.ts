import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse, PaginatedResponse } from '../api/types';

/**
 * Generic hook for GET requests (queries)
 */
export function useApiQuery<TData = any>(
  queryKey: string[],
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: Omit<UseQueryOptions<ApiResponse<TData>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      if (!response.success) {
        throw new Error(response.message || 'Request failed');
      }
      return response;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Generic hook for paginated GET requests
 */
export function usePaginatedQuery<TData = any>(
  queryKey: string[],
  queryFn: () => Promise<PaginatedResponse<TData>>,
  options?: Omit<UseQueryOptions<PaginatedResponse<TData>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      if (!response.success) {
        throw new Error(response.message || 'Request failed');
      }
      return response;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes for paginated data
    ...options,
  });
}

/**
 * Generic hook for mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables);
      if (!response.success) {
        throw new Error(response.message || 'Request failed');
      }
      return response;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

