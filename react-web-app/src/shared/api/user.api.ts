import apiClient from './client';
import { ApiResponse } from './types';

export interface UserProfile {
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

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user');
    }
    return response.data.data;
  },
};

