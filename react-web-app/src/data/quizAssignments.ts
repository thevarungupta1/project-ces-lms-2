export interface QuizAssignment {
  id: string;
  quiz_id: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  assigned_by: string;
  assigned_by_name: string;
  assigned_at: string;
  due_date: string | null;
  status: string; // 'assigned', 'in_progress', 'completed'
  attempts_used: number;
  best_score: number | null;
  group_id: string | null;
  group_name: string | null;
  created_at: string;
  updated_at: string;
}

export const sampleQuizAssignments: QuizAssignment[] = [
  {
    id: 'quiz-assign-1',
    quiz_id: '1',
    learner_id: 'learner@ceslms.com',
    learner_name: 'Learner User',
    learner_email: 'learner@ceslms.com',
    assigned_by: 'admin@ceslms.com',
    assigned_by_name: 'Admin User',
    assigned_at: '2024-12-01T10:00:00Z',
    due_date: '2024-12-31',
    status: 'assigned',
    attempts_used: 0,
    best_score: null,
    group_id: null,
    group_name: null,
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
  },
  {
    id: 'quiz-assign-2',
    quiz_id: '2',
    learner_id: 'learner@ceslms.com',
    learner_name: 'Learner User',
    learner_email: 'learner@ceslms.com',
    assigned_by: 'educator@ceslms.com',
    assigned_by_name: 'Educator User',
    assigned_at: '2024-12-05T14:00:00Z',
    due_date: null,
    status: 'assigned',
    attempts_used: 0,
    best_score: null,
    group_id: null,
    group_name: null,
    created_at: '2024-12-05T14:00:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
];

