export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  module_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const sampleCourseModules: CourseModule[] = [
  // Course 1: Introduction to Project Management
  {
    id: 'mod-1-1',
    course_id: '1',
    title: 'Project Management Fundamentals',
    description: 'Introduction to project management concepts and methodologies',
    module_order: 1,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'mod-1-2',
    course_id: '1',
    title: 'Project Planning and Scheduling',
    description: 'Learn how to create effective project plans and schedules',
    module_order: 2,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'mod-1-3',
    course_id: '1',
    title: 'Risk Management',
    description: 'Identifying and managing project risks',
    module_order: 3,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Course 2: Advanced Data Analytics
  {
    id: 'mod-2-1',
    course_id: '2',
    title: 'Data Collection and Preparation',
    description: 'Methods for collecting and preparing data for analysis',
    module_order: 1,
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'mod-2-2',
    course_id: '2',
    title: 'Statistical Analysis',
    description: 'Advanced statistical techniques for data analysis',
    module_order: 2,
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'mod-2-3',
    course_id: '2',
    title: 'Data Visualization',
    description: 'Creating effective visualizations and dashboards',
    module_order: 3,
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  // Course 3: Digital Marketing Essentials
  {
    id: 'mod-3-1',
    course_id: '3',
    title: 'SEO Fundamentals',
    description: 'Search Engine Optimization basics and best practices',
    module_order: 1,
    is_active: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'mod-3-2',
    course_id: '3',
    title: 'Social Media Marketing',
    description: 'Strategies for effective social media campaigns',
    module_order: 2,
    is_active: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'mod-3-3',
    course_id: '3',
    title: 'Content Marketing',
    description: 'Creating and distributing valuable content',
    module_order: 3,
    is_active: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
];

