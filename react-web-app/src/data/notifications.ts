export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  link?: string;
}

export const sampleNotifications: Notification[] = [
  // Notifications for learner@ceslms.com (user_id: 'learner@ceslms.com')
  {
    id: 'notif-1',
    user_id: 'learner@ceslms.com',
    title: 'New Course Available',
    message: 'Leadership Development Program is now available for enrollment.',
    type: 'info',
    created_at: '2024-02-15T10:30:00Z',
    read: false,
    link: '/courses',
  },
  {
    id: 'notif-2',
    user_id: 'learner@ceslms.com',
    title: 'Quiz Deadline Approaching',
    message: 'Project Management Basics quiz is due in 2 days.',
    type: 'warning',
    created_at: '2024-02-14T14:20:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    user_id: 'learner@ceslms.com',
    title: 'Course Completed',
    message: 'Congratulations! You have completed Digital Marketing Essentials.',
    type: 'success',
    created_at: '2024-02-13T09:15:00Z',
    read: true,
  },
  {
    id: 'notif-4',
    user_id: 'learner@ceslms.com',
    title: 'Assignment Graded',
    message: 'Your assignment for Advanced Data Analytics has been graded. Check your results.',
    type: 'info',
    created_at: '2024-02-12T16:45:00Z',
    read: true,
  },
  {
    id: 'notif-5',
    user_id: 'learner@ceslms.com',
    title: 'System Maintenance',
    message: 'The platform will be under maintenance on Sunday from 2-4 AM.',
    type: 'warning',
    created_at: '2024-02-11T11:00:00Z',
    read: true,
  },
  // Notifications for educator@ceslms.com (user_id: 'educator@ceslms.com')
  {
    id: 'notif-6',
    user_id: 'educator@ceslms.com',
    title: 'New Student Enrolled',
    message: 'Jessica Taylor has enrolled in your Advanced Data Analytics course.',
    type: 'info',
    created_at: '2024-02-15T08:20:00Z',
    read: false,
    link: '/courses',
  },
  {
    id: 'notif-7',
    user_id: 'educator@ceslms.com',
    title: 'Assignment Submitted',
    message: 'Robert Brown has submitted an assignment for your Digital Marketing Essentials course.',
    type: 'info',
    created_at: '2024-02-14T15:30:00Z',
    read: false,
  },
  {
    id: 'notif-8',
    user_id: 'educator@ceslms.com',
    title: 'Course Review Request',
    message: 'A student has requested a review for Project Management Fundamentals course.',
    type: 'warning',
    created_at: '2024-02-13T10:15:00Z',
    read: true,
  },
  // Notifications for admin@ceslms.com (user_id: 'admin@ceslms.com')
  {
    id: 'notif-9',
    user_id: 'admin@ceslms.com',
    title: 'New User Registration',
    message: 'A new user has registered on the platform. Review their profile.',
    type: 'info',
    created_at: '2024-02-15T09:00:00Z',
    read: false,
    link: '/users',
  },
  {
    id: 'notif-10',
    user_id: 'admin@ceslms.com',
    title: 'System Alert',
    message: 'High server load detected. Consider scaling resources.',
    type: 'warning',
    created_at: '2024-02-14T12:00:00Z',
    read: false,
  },
  {
    id: 'notif-11',
    user_id: 'admin@ceslms.com',
    title: 'Monthly Report Ready',
    message: 'The monthly learning analytics report is ready for review.',
    type: 'success',
    created_at: '2024-02-13T08:00:00Z',
    read: true,
    link: '/analytics',
  },
];
