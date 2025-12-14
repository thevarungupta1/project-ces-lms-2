import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface LearningPathEnrollment {
  _id: string;
  id?: string;
  learningPath: string | { _id: string; title: string };
  user: string | { _id: string; name: string; email: string };
  enrolledAt: string;
  progressPercentage: number;
  completedSteps: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningPathEnrollmentInput {
  learningPath: string;
}

export interface LearningPathEnrollmentFilters {
  page?: number;
  limit?: number;
  learningPath?: string;
  user?: string;
  status?: 'active' | 'completed' | 'paused';
}

export const learningPathEnrollmentApi = {
  enroll: async (data: CreateLearningPathEnrollmentInput): Promise<LearningPathEnrollment> => {
    const response = await apiClient.post<ApiResponse<LearningPathEnrollment>>('/learning-path-enrollments', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to enroll in learning path');
    }
    return response.data.data;
  },

  getEnrollments: async (filters?: LearningPathEnrollmentFilters): Promise<PaginatedResponse<LearningPathEnrollment>> => {
    const response = await apiClient.get<PaginatedResponse<LearningPathEnrollment>>('/learning-path-enrollments', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch enrollments');
    }
    return response.data;
  },
};

