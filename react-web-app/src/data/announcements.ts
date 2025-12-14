export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  created_by: string;
  target_audience: string | null;
  target_departments: string[] | null;
  is_active: boolean;
}

export const sampleAnnouncements: Announcement[] = [
  {
    id: 'announce-1',
    title: 'New Learning Path Available',
    message: 'We are excited to announce the launch of our new "Full Stack Developer Path" learning program. Enroll now to start your journey!',
    type: 'info',
    created_at: '2024-01-10T09:00:00Z',
    created_by: '1',
    target_audience: 'all',
    target_departments: null,
    is_active: true,
  },
  {
    id: 'announce-2',
    title: 'System Maintenance Scheduled',
    message: 'The platform will be under maintenance on Sunday, February 25th from 2:00 AM to 4:00 AM UTC. Please plan accordingly.',
    type: 'warning',
    created_at: '2024-01-15T10:00:00Z',
    created_by: '1',
    target_audience: 'all',
    target_departments: null,
    is_active: true,
  },
  {
    id: 'announce-3',
    title: 'Q1 Learning Goals',
    message: 'Set your learning goals for Q1 2024. Complete at least 2 courses this quarter to be eligible for the quarterly recognition program.',
    type: 'info',
    created_at: '2024-01-05T08:00:00Z',
    created_by: '1',
    target_audience: 'learners',
    target_departments: null,
    is_active: true,
  },
  {
    id: 'announce-4',
    title: 'New Course: Cybersecurity Fundamentals',
    message: 'Our new Cybersecurity Fundamentals course is now available. Learn essential security practices to protect your organization.',
    type: 'success',
    created_at: '2024-01-20T11:00:00Z',
    created_by: '1',
    target_audience: 'all',
    target_departments: ['Engineering', 'IT'],
    is_active: true,
  },
  {
    id: 'announce-5',
    title: 'Webinar: Leadership Workshop',
    message: 'Join us for an interactive leadership workshop on March 1st. Limited seats available, register now!',
    type: 'info',
    created_at: '2024-01-25T14:00:00Z',
    created_by: '1',
    target_audience: 'managers',
    target_departments: null,
    is_active: true,
  },
];

