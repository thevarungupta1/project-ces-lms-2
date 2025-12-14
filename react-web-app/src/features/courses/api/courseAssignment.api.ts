import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface CourseAssignment {
  _id: string;
  id?: string; // For compatibility
  course: string | { _id: string; title: string };
  learner: string | { _id: string; name: string; email: string };
  assignedBy: string | { _id: string; name: string };
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  group?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseAssignmentInput {
  course: string;
  learner: string;
  dueDate?: string;
  group?: string;
}

export interface UpdateCourseAssignmentInput {
  dueDate?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
}

export interface CourseAssignmentFilters {
  page?: number;
  limit?: number;
  course?: string;
  learner?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  group?: string;
}

export const courseAssignmentApi = {
  /**
   * Get all assignments with pagination
   */
  getAssignments: async (filters?: CourseAssignmentFilters): Promise<PaginatedResponse<CourseAssignment>> => {
    const response = await apiClient.get<PaginatedResponse<CourseAssignment>>('/course-assignments', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch assignments');
    }
    return response.data;
  },

  /**
   * Get assignment by ID
   */
  getAssignmentById: async (id: string): Promise<CourseAssignment> => {
    const response = await apiClient.get<ApiResponse<CourseAssignment>>(`/course-assignments/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch assignment');
    }
    return response.data.data;
  },

  /**
   * Create new assignment
   */
  createAssignment: async (data: CreateCourseAssignmentInput): Promise<CourseAssignment> => {
    const response = await apiClient.post<ApiResponse<CourseAssignment>>('/course-assignments', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create assignment');
    }
    return response.data.data;
  },

  /**
   * Assign course to group
   */
  assignToGroup: async (courseId: string, groupId: string, dueDate?: string): Promise<CourseAssignment[]> => {
    const response = await apiClient.post<ApiResponse<CourseAssignment[]>>(
      `/course-assignments/group/${courseId}/${groupId}`,
      { dueDate }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to assign to group');
    }
    return response.data.data;
  },

  /**
   * Update assignment
   */
  updateAssignment: async (id: string, data: UpdateCourseAssignmentInput): Promise<CourseAssignment> => {
    const response = await apiClient.put<ApiResponse<CourseAssignment>>(`/course-assignments/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update assignment');
    }
    return response.data.data;
  },

  /**
   * Update assignment progress
   */
  updateProgress: async (id: string, progress: number, status?: 'not_started' | 'in_progress' | 'completed'): Promise<CourseAssignment> => {
    const response = await apiClient.put<ApiResponse<CourseAssignment>>(`/course-assignments/${id}/progress`, {
      progress,
      status,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update progress');
    }
    return response.data.data;
  },

  /**
   * Delete assignment
   */
  deleteAssignment: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/course-assignments/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete assignment');
    }
  },
};

