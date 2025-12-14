import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface CourseModule {
  _id: string;
  id?: string; // For compatibility
  course: string | { _id: string; title: string };
  title: string;
  description?: string;
  moduleOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseModuleInput {
  course: string;
  title: string;
  description?: string;
  moduleOrder: number;
}

export interface UpdateCourseModuleInput {
  title?: string;
  description?: string;
  moduleOrder?: number;
  isActive?: boolean;
}

export const courseModuleApi = {
  /**
   * Get modules by course ID
   */
  getModulesByCourse: async (courseId: string): Promise<CourseModule[]> => {
    const response = await apiClient.get<ApiResponse<CourseModule[]>>(`/course-modules/course/${courseId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch modules');
    }
    return response.data.data;
  },

  /**
   * Get module by ID
   */
  getModuleById: async (id: string): Promise<CourseModule> => {
    const response = await apiClient.get<ApiResponse<CourseModule>>(`/course-modules/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch module');
    }
    return response.data.data;
  },

  /**
   * Create new module
   */
  createModule: async (data: CreateCourseModuleInput): Promise<CourseModule> => {
    const response = await apiClient.post<ApiResponse<CourseModule>>('/course-modules', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create module');
    }
    return response.data.data;
  },

  /**
   * Update module
   */
  updateModule: async (id: string, data: UpdateCourseModuleInput): Promise<CourseModule> => {
    const response = await apiClient.put<ApiResponse<CourseModule>>(`/course-modules/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update module');
    }
    return response.data.data;
  },

  /**
   * Delete module
   */
  deleteModule: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/course-modules/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete module');
    }
  },
};

