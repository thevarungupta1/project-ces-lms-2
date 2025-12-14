import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, Category, CreateCategoryInput, UpdateCategoryInput, CategoryFilters } from '../api/category.api';
import { toast } from 'sonner';

/**
 * Hook to get all categories
 */
export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoryApi.getCategories(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
  });
};

/**
 * Hook to get category by ID
 */
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create category');
    },
  });
};

/**
 * Hook to update category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => 
      categoryApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update category');
    },
  });
};

/**
 * Hook to delete category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete category');
    },
  });
};

