import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';

export interface AdminDashboardData {
  totalUsers: number;
  totalCourses: number;
  totalQuizzes: number;
  totalWebinars: number;
  activeAssignments: number;
  completedCertificates: number;
}

export interface EducatorDashboardData {
  myCourses: number;
  totalStudents: number;
  activeAssignments: number;
  completedAssignments: number;
}

export interface LearnerDashboardData {
  enrolledCourses: number;
  completedCourses: number;
  activeQuizzes: number;
  upcomingWebinars: number;
  learningPaths: number;
  certificates: number;
  leaderboardRank: number | null;
}

export type DashboardData = AdminDashboardData | EducatorDashboardData | LearnerDashboardData;

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch dashboard data');
    }
    return response.data.data;
  },
};

