import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface LearningPathStep {
  _id: string;
  id?: string;
  learningPath: string | { _id: string; title: string };
  stepOrder: number;
  stepType: 'course' | 'quiz' | 'webinar' | 'resource';
  title: string;
  description?: string;
  resourceId?: string;
  resourceLink?: string;
  durationWeeks: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export const learningPathStepApi = {
  getStepsByLearningPath: async (learningPathId: string): Promise<LearningPathStep[]> => {
    const response = await apiClient.get<ApiResponse<LearningPathStep[]>>(
      `/learning-path-steps/learning-path/${learningPathId}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch learning path steps');
    }
    return response.data.data;
  },
};

