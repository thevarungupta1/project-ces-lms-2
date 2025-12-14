export interface LearningPathEnrollment {
  id: string;
  learning_path_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  enrolled_at: string;
  completed_at: string | null;
  status: string;
  current_step: number;
  completed_steps: number;
  progress_percentage: number;
}

export const sampleLearningPathEnrollments: LearningPathEnrollment[] = [
  {
    id: 'enroll-1',
    learning_path_id: 'path-1',
    user_id: '5',
    user_name: 'Jessica Taylor',
    user_email: 'jessica.taylor@company.com',
    enrolled_at: '2024-01-15T00:00:00Z',
    completed_at: null,
    status: 'in_progress',
    current_step: 2,
    completed_steps: 1,
    progress_percentage: 20,
  },
  {
    id: 'enroll-2',
    learning_path_id: 'path-2',
    user_id: '4',
    user_name: 'David Kim',
    user_email: 'david.kim@company.com',
    enrolled_at: '2024-01-20T00:00:00Z',
    completed_at: null,
    status: 'in_progress',
    current_step: 1,
    completed_steps: 0,
    progress_percentage: 0,
  },
  {
    id: 'enroll-3',
    learning_path_id: 'path-3',
    user_id: '6',
    user_name: 'Robert Brown',
    user_email: 'robert.brown@company.com',
    enrolled_at: '2024-01-18T00:00:00Z',
    completed_at: null,
    status: 'in_progress',
    current_step: 3,
    completed_steps: 2,
    progress_percentage: 50,
  },
];

