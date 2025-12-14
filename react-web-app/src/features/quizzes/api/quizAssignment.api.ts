import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface QuizAssignment {
  _id: string;
  id?: string; // For compatibility
  quiz: string | { _id: string; title: string };
  learner: string | { _id: string; name: string; email: string };
  assignedBy: string | { _id: string; name: string };
  assignedAt: string;
  dueDate?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  attemptsUsed: number;
  bestScore?: number;
  group?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizAssignmentInput {
  quiz: string;
  learner: string;
  dueDate?: string;
  group?: string;
}

export interface SubmitQuizInput {
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
  }>;
}

export interface QuizAssignmentFilters {
  page?: number;
  limit?: number;
  quiz?: string;
  learner?: string;
  status?: 'assigned' | 'in_progress' | 'completed';
  group?: string;
}

export const quizAssignmentApi = {
  /**
   * Get all assignments with pagination
   */
  getAssignments: async (filters?: QuizAssignmentFilters): Promise<PaginatedResponse<QuizAssignment>> => {
    const response = await apiClient.get<PaginatedResponse<QuizAssignment>>('/quiz-assignments', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch assignments');
    }
    return response.data;
  },

  /**
   * Get assignment by ID
   */
  getAssignmentById: async (id: string): Promise<QuizAssignment> => {
    const response = await apiClient.get<ApiResponse<QuizAssignment>>(`/quiz-assignments/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch assignment');
    }
    return response.data.data;
  },

  /**
   * Create new assignment
   */
  createAssignment: async (data: CreateQuizAssignmentInput): Promise<QuizAssignment> => {
    const response = await apiClient.post<ApiResponse<QuizAssignment>>('/quiz-assignments', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create assignment');
    }
    return response.data.data;
  },

  /**
   * Assign quiz to group
   */
  assignToGroup: async (quizId: string, groupId: string, dueDate?: string): Promise<QuizAssignment[]> => {
    const response = await apiClient.post<ApiResponse<QuizAssignment[]>>(
      `/quiz-assignments/group/${quizId}/${groupId}`,
      { dueDate }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to assign to group');
    }
    return response.data.data;
  },

  /**
   * Submit quiz
   */
  submitQuiz: async (id: string, data: SubmitQuizInput): Promise<{ score: number; passed: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ score: number; passed: boolean }>>(
      `/quiz-assignments/${id}/submit`,
      data
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to submit quiz');
    }
    return response.data.data;
  },

  /**
   * Update assignment
   */
  updateAssignment: async (id: string, data: Partial<QuizAssignment>): Promise<QuizAssignment> => {
    const response = await apiClient.put<ApiResponse<QuizAssignment>>(`/quiz-assignments/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update assignment');
    }
    return response.data.data;
  },

  /**
   * Delete assignment
   */
  deleteAssignment: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/quiz-assignments/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete assignment');
    }
  },
};

