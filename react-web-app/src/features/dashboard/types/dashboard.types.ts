export interface DashboardMetrics {
  totalActiveUsers: number;
  totalUsers: number;
  averageTimeSpent: string;
  courseCompletionRate: string;
  averageQuizScore: string;
  newUsersThisMonth: number;
  coursesPublishedThisMonth: number;
  totalCourseEnrollments: number;
}

export interface DashboardChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}

