export interface CourseAssignment {
  id: string;
  course_id: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  assigned_by: string;
  assigned_by_name: string;
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  due_date: string | null;
  status: string;
  progress: number;
  group_id: string | null;
  group_name: string | null;
  created_at: string;
  updated_at: string;
}

export const sampleCourseAssignments: CourseAssignment[] = [
  {
    id: 'assign-1',
    course_id: '1',
    learner_id: '4',
    learner_name: 'David Kim',
    learner_email: 'david.kim@company.com',
    assigned_by: '2',
    assigned_by_name: 'Michael Chen',
    assigned_at: '2024-01-20T00:00:00Z',
    started_at: '2024-01-21T10:00:00Z',
    completed_at: null,
    due_date: '2024-03-01T23:59:59Z',
    status: 'in_progress',
    progress: 45,
    group_id: '2',
    group_name: 'Sales Department',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'assign-2',
    course_id: '1',
    learner_id: '5',
    learner_name: 'Jessica Taylor',
    learner_email: 'jessica.taylor@company.com',
    assigned_by: '2',
    assigned_by_name: 'Michael Chen',
    assigned_at: '2024-01-18T00:00:00Z',
    started_at: '2024-01-19T09:00:00Z',
    completed_at: '2024-02-15T16:30:00Z',
    due_date: '2024-02-28T23:59:59Z',
    status: 'completed',
    progress: 100,
    group_id: '1',
    group_name: 'Engineering Team',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-02-15T16:30:00Z',
  },
  {
    id: 'assign-3',
    course_id: '2',
    learner_id: '5',
    learner_name: 'Jessica Taylor',
    learner_email: 'jessica.taylor@company.com',
    assigned_by: '3',
    assigned_by_name: 'Emily Rodriguez',
    assigned_at: '2024-01-22T00:00:00Z',
    started_at: '2024-01-23T14:00:00Z',
    completed_at: null,
    due_date: '2024-04-01T23:59:59Z',
    status: 'in_progress',
    progress: 30,
    group_id: '1',
    group_name: 'Engineering Team',
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-28T00:00:00Z',
  },
  {
    id: 'assign-4',
    course_id: '3',
    learner_id: '4',
    learner_name: 'David Kim',
    learner_email: 'david.kim@company.com',
    assigned_by: '3',
    assigned_by_name: 'Emily Rodriguez',
    assigned_at: '2024-01-25T00:00:00Z',
    started_at: null,
    completed_at: null,
    due_date: '2024-03-15T23:59:59Z',
    status: 'not_started',
    progress: 0,
    group_id: '2',
    group_name: 'Sales Department',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'assign-5',
    course_id: '3',
    learner_id: '6',
    learner_name: 'Robert Brown',
    learner_email: 'robert.brown@company.com',
    assigned_by: '3',
    assigned_by_name: 'Emily Rodriguez',
    assigned_at: '2024-01-20T00:00:00Z',
    started_at: '2024-01-21T11:00:00Z',
    completed_at: '2024-02-10T15:00:00Z',
    due_date: '2024-02-28T23:59:59Z',
    status: 'completed',
    progress: 100,
    group_id: null,
    group_name: null,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-02-10T15:00:00Z',
  },
];

