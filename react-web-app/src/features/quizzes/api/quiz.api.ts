import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  _id: string;
  id?: string; // For compatibility
  title: string;
  course: string | { _id: string; title: string };
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  attempts: number;
  createdBy: string | { _id: string; name: string };
  questions: QuizQuestion[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizInput {
  title: string;
  course: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  attempts?: number;
  questions: QuizQuestion[];
}

export interface UpdateQuizInput {
  title?: string;
  duration?: number;
  passingScore?: number;
  attempts?: number;
  questions?: QuizQuestion[];
  isActive?: boolean;
}

export interface QuizFilters {
  page?: number;
  limit?: number;
  course?: string;
  isActive?: boolean;
  createdBy?: string;
}

export const quizApi = {
  /**
   * Get all quizzes with pagination
   */
  getQuizzes: async (filters?: QuizFilters): Promise<PaginatedResponse<Quiz>> => {
    const response = await apiClient.get<PaginatedResponse<Quiz>>('/quizzes', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch quizzes');
    }
    return response.data;
  },

  /**
   * Get quiz by ID
   */
  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await apiClient.get<ApiResponse<Quiz>>(`/quizzes/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch quiz');
    }
    return response.data.data;
  },

  /**
   * Get quizzes by course ID
   */
  getQuizzesByCourse: async (courseId: string): Promise<Quiz[]> => {
    const response = await apiClient.get<ApiResponse<Quiz[]>>(`/quizzes/course/${courseId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch quizzes');
    }
    return response.data.data;
  },

  /**
   * Create new quiz
   */
  createQuiz: async (data: CreateQuizInput): Promise<Quiz> => {
    const response = await apiClient.post<ApiResponse<Quiz>>('/quizzes', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create quiz');
    }
    return response.data.data;
  },

  /**
   * Update quiz
   */
  updateQuiz: async (id: string, data: UpdateQuizInput): Promise<Quiz> => {
    const response = await apiClient.put<ApiResponse<Quiz>>(`/quizzes/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update quiz');
    }
    return response.data.data;
  },

  /**
   * Delete quiz
   */
  deleteQuiz: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/quizzes/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete quiz');
    }
  },
};

