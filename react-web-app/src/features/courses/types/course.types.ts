export interface Course {
  id: string;
  title: string;
  description: string | null;
  educator_name: string;
  educator_id: string | null;
  educatorId?: string | null;
  duration: string;
  level: string;
  enrolled_count: number;
  enrolledCount?: number;
  category: string | null;
  status: string;
  thumbnail: string | null;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseContent {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseAssignment {
  id: string;
  course_id: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  assigned_by: string;
  assigned_at: string;
  due_date: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  progress: number;
  group_id: string | null;
  group_name: string | null;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

