import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface Category {
  _id: string;
  id?: string; // For compatibility
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
    return response.data;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch category');
    }
    return response.data.data;
  },

  /**
   * Create new category
   */
  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create category');
    }
    return response.data.data;
  },

  /**
   * Update category
   */
  updateCategory: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update category');
    }
    return response.data.data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete category');
    }
  },
};

