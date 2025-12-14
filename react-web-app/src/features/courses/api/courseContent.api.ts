import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface CourseContent {
  _id: string;
  id?: string; // For compatibility
  module: string | { _id: string; title: string };
  title: string;
  description?: string;
  contentType: 'video' | 'document' | 'link' | 'quiz' | 'assignment';
  contentUrl?: string;
  contentText?: string;
  order: number;
  duration?: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseContentInput {
  module: string;
  title: string;
  description?: string;
  contentType: 'video' | 'document' | 'link' | 'quiz' | 'assignment';
  contentUrl?: string;
  contentText?: string;
  order: number;
  duration?: number;
}

export interface UpdateCourseContentInput {
  title?: string;
  description?: string;
  contentType?: 'video' | 'document' | 'link' | 'quiz' | 'assignment';
  contentUrl?: string;
  contentText?: string;
  order?: number;
  duration?: number;
  isActive?: boolean;
}

export const courseContentApi = {
  /**
   * Get content by module ID
   */
  getContentByModule: async (moduleId: string): Promise<CourseContent[]> => {
    const response = await apiClient.get<ApiResponse<CourseContent[]>>(`/course-content/module/${moduleId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch content');
    }
    return response.data.data;
  },

  /**
   * Get content by ID
   */
  getContentById: async (id: string): Promise<CourseContent> => {
    const response = await apiClient.get<ApiResponse<CourseContent>>(`/course-content/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch content');
    }
    return response.data.data;
  },

  /**
   * Create new content
   */
  createContent: async (data: CreateCourseContentInput): Promise<CourseContent> => {
    const response = await apiClient.post<ApiResponse<CourseContent>>('/course-content', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create content');
    }
    return response.data.data;
  },

  /**
   * Update content
   */
  updateContent: async (id: string, data: UpdateCourseContentInput): Promise<CourseContent> => {
    const response = await apiClient.put<ApiResponse<CourseContent>>(`/course-content/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update content');
    }
    return response.data.data;
  },

  /**
   * Delete content
   */
  deleteContent: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/course-content/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete content');
    }
  },
};

