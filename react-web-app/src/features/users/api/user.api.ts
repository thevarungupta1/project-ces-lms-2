import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'educator' | 'learner';
  avatar?: string;
  department?: string;
  isActive?: boolean;
  joinedDate: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'educator' | 'learner';
  department?: string;
  avatar?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'educator' | 'learner';
  department?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: 'admin' | 'educator' | 'learner';
  isActive?: boolean;
  search?: string;
}

export const userApi = {
  /**
   * Get all users with pagination
   */
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user');
    }
    return response.data.data;
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserInput): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create user');
    }
    return response.data.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserInput): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update user');
    }
    return response.data.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete user');
    }
  },
};

