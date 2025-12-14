// Analytics data for dashboard charts and metrics

export const userGrowthData = [
  { month: 'Jan', users: 45, active: 38 },
  { month: 'Feb', users: 52, active: 44 },
  { month: 'Mar', users: 61, active: 53 },
  { month: 'Apr', users: 68, active: 59 },
  { month: 'May', users: 75, active: 67 },
  { month: 'Jun', users: 82, active: 74 },
];

export const courseCompletionData = [
  { month: 'Jan', completed: 23, inProgress: 45 },
  { month: 'Feb', completed: 31, inProgress: 52 },
  { month: 'Mar', completed: 38, inProgress: 58 },
  { month: 'Apr', completed: 45, inProgress: 61 },
  { month: 'May', completed: 54, inProgress: 67 },
  { month: 'Jun', completed: 62, inProgress: 73 },
];

export const popularCoursesData = [
  { name: 'Advanced JavaScript', enrollments: 156, completion: 78 },
  { name: 'Leadership Development', enrollments: 142, completion: 85 },
  { name: 'Data Science Basics', enrollments: 128, completion: 72 },
  { name: 'Project Management', enrollments: 115, completion: 81 },
  { name: 'Digital Marketing', enrollments: 98, completion: 69 },
];

export const roleDistributionData = [
  { role: 'Learners', value: 68, color: 'hsl(var(--primary))' },
  { role: 'Educators', value: 24, color: 'hsl(var(--secondary))' },
  { role: 'Admins', value: 8, color: 'hsl(var(--accent))' },
];

export const engagementData = [
  { day: 'Mon', hours: 3.2 },
  { day: 'Tue', hours: 4.1 },
  { day: 'Wed', hours: 3.8 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 3.9 },
  { day: 'Sat', hours: 2.1 },
  { day: 'Sun', hours: 1.8 },
];

export const departmentPerformanceData = [
  { department: 'Engineering', courses: 45, avgScore: 87 },
  { department: 'Sales', courses: 38, avgScore: 82 },
  { department: 'Marketing', courses: 32, avgScore: 85 },
  { department: 'HR', courses: 28, avgScore: 90 },
  { department: 'Finance', courses: 25, avgScore: 88 },
];

export const analyticsMetrics = {
  totalActiveUsers: 82,
  totalUsers: 100,
  averageTimeSpent: '3.8 hrs/week',
  courseCompletionRate: '76%',
  averageQuizScore: '85%',
  totalCourseEnrollments: 639,
  newUsersThisMonth: 14,
  coursesPublishedThisMonth: 3,
};
