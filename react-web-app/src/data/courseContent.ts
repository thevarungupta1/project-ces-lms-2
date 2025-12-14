export interface CourseContent {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_order: number;
  is_mandatory: boolean;
  is_active: boolean;
  duration_minutes: number | null;
  video_link: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

export const sampleCourseContent: CourseContent[] = [
  // Module 1-1: Project Management Fundamentals
  {
    id: 'content-1-1-1',
    module_id: 'mod-1-1',
    title: 'Introduction to Project Management',
    description: 'Overview of project management principles',
    content_type: 'video',
    content_order: 1,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 15,
    video_link: 'https://example.com/video/pm-intro',
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'content-1-1-2',
    module_id: 'mod-1-1',
    title: 'Project Management Methodologies',
    description: 'PDF guide covering Agile, Waterfall, and Hybrid approaches',
    content_type: 'document',
    content_order: 2,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 20,
    video_link: null,
    file_url: 'https://example.com/files/pm-methodologies.pdf',
    file_name: 'PM_Methodologies.pdf',
    file_size: 2048000,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Module 1-2: Project Planning and Scheduling
  {
    id: 'content-1-2-1',
    module_id: 'mod-1-2',
    title: 'Creating Project Plans',
    description: 'Step-by-step guide to project planning',
    content_type: 'video',
    content_order: 1,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 25,
    video_link: 'https://example.com/video/project-planning',
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'content-1-2-2',
    module_id: 'mod-1-2',
    title: 'Gantt Chart Template',
    description: 'Excel template for project scheduling',
    content_type: 'document',
    content_order: 2,
    is_mandatory: false,
    is_active: true,
    duration_minutes: 10,
    video_link: null,
    file_url: 'https://example.com/files/gantt-template.xlsx',
    file_name: 'Gantt_Template.xlsx',
    file_size: 512000,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Module 2-1: Data Collection and Preparation
  {
    id: 'content-2-1-1',
    module_id: 'mod-2-1',
    title: 'Data Collection Methods',
    description: 'Various methods for collecting data',
    content_type: 'video',
    content_order: 1,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 30,
    video_link: 'https://example.com/video/data-collection',
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'content-2-1-2',
    module_id: 'mod-2-1',
    title: 'Data Cleaning Techniques',
    description: 'Best practices for cleaning and preparing data',
    content_type: 'video',
    content_order: 2,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 35,
    video_link: 'https://example.com/video/data-cleaning',
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  // Module 3-1: SEO Fundamentals
  {
    id: 'content-3-1-1',
    module_id: 'mod-3-1',
    title: 'SEO Basics',
    description: 'Introduction to Search Engine Optimization',
    content_type: 'video',
    content_order: 1,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 20,
    video_link: 'https://example.com/video/seo-basics',
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'content-3-1-2',
    module_id: 'mod-3-1',
    title: 'Keyword Research Guide',
    description: 'Comprehensive guide to keyword research',
    content_type: 'document',
    content_order: 2,
    is_mandatory: true,
    is_active: true,
    duration_minutes: 15,
    video_link: null,
    file_url: 'https://example.com/files/keyword-research.pdf',
    file_name: 'Keyword_Research_Guide.pdf',
    file_size: 1536000,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
];

