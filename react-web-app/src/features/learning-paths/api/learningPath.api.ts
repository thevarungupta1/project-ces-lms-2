import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface LearningPath {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string | { _id: string; name: string };
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  isActive: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPathFilters {
  page?: number;
  limit?: number;
  category?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive?: boolean;
}

export const learningPathApi = {
  getLearningPaths: async (filters?: LearningPathFilters): Promise<PaginatedResponse<LearningPath>> => {
    const response = await apiClient.get<PaginatedResponse<LearningPath>>('/learning-paths', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch learning paths');
    }
    return response.data;
  },

  getLearningPathById: async (id: string): Promise<LearningPath> => {
    const response = await apiClient.get<ApiResponse<LearningPath>>(`/learning-paths/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch learning path');
    }
    return response.data.data;
  },

  createLearningPath: async (data: any): Promise<LearningPath> => {
    const response = await apiClient.post<ApiResponse<LearningPath>>('/learning-paths', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create learning path');
    }
    return response.data.data;
  },

  updateLearningPath: async (id: string, data: any): Promise<LearningPath> => {
    const response = await apiClient.put<ApiResponse<LearningPath>>(`/learning-paths/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update learning path');
    }
    return response.data.data;
  },

  deleteLearningPath: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/learning-paths/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete learning path');
    }
  },
};

