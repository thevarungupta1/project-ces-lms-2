import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface Course {
  _id: string;
  id?: string; // For compatibility
  title: string;
  description: string;
  educator: string | { _id: string; name: string; email: string };
  educatorId?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  category: string | { _id: string; name: string };
  categoryId?: string;
  status: 'active' | 'draft' | 'archived';
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  educator: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status?: 'active' | 'draft' | 'archived';
  thumbnail?: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  status?: 'active' | 'draft' | 'archived';
  thumbnail?: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'active' | 'draft' | 'archived';
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  educator?: string;
  search?: string;
}

export const courseApi = {
  /**
   * Get all courses with pagination
   */
  getCourses: async (filters?: CourseFilters): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get<PaginatedResponse<Course>>('/courses', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch courses');
    }
    return response.data;
  },

  /**
   * Get course by ID
   */
  getCourseById: async (id: string): Promise<Course> => {
    const response = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch course');
    }
    return response.data.data;
  },

  /**
   * Create new course
   */
  createCourse: async (data: CreateCourseInput): Promise<Course> => {
    const response = await apiClient.post<ApiResponse<Course>>('/courses', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create course');
    }
    return response.data.data;
  },

  /**
   * Update course
   */
  updateCourse: async (id: string, data: UpdateCourseInput): Promise<Course> => {
    const response = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update course');
    }
    return response.data.data;
  },

  /**
   * Delete course
   */
  deleteCourse: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/courses/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete course');
    }
  },
};

