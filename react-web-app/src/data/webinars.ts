export interface Webinar {
  id: string;
  title: string;
  description: string | null;
  host_id: string;
  host_name: string;
  host_email: string | null;
  category: string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string | null;
  timezone: string;
  status: string;
  registration_required: boolean;
  registration_deadline: string | null;
  max_attendees: number | null;
  meeting_link: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  is_recorded: boolean;
  recording_url: string | null;
  recording_duration_minutes: number | null;
  thumbnail_url: string | null;
  target_audience: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to generate dates relative to today
const getDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getDateTime = (daysOffset: number, hours: number = 23, minutes: number = 59): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 59, 999);
  return date.toISOString();
};

export const sampleWebinars: Webinar[] = [
  {
    id: 'webinar-1',
    title: 'Introduction to Agile Methodologies',
    description: 'Learn the fundamentals of Agile project management and Scrum framework',
    host_id: '2',
    host_name: 'Michael Chen',
    host_email: 'michael.chen@company.com',
    category: 'Operations',
    scheduled_date: getDate(7), // 7 days from today (upcoming)
    start_time: '14:00:00',
    end_time: '15:30:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(6), // 6 days from today
    max_attendees: 50,
    meeting_link: 'https://meet.example.com/agile-intro',
    meeting_id: 'agile-intro',
    meeting_password: 'Agile2025!',
    is_recorded: false,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-30),
    updated_at: getDateTime(-30),
  },
  {
    id: 'webinar-2',
    title: 'Data Analytics Best Practices',
    description: 'Discover best practices for data collection, analysis, and visualization',
    host_id: '3',
    host_name: 'Emily Rodriguez',
    host_email: 'emily.rodriguez@company.com',
    category: 'Technology',
    scheduled_date: getDate(14), // 14 days from today (upcoming)
    start_time: '10:00:00',
    end_time: '11:00:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(13),
    max_attendees: 100,
    meeting_link: 'https://meet.example.com/data-analytics',
    meeting_id: 'data-analytics',
    meeting_password: 'Data2025!',
    is_recorded: true,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-28),
    updated_at: getDateTime(-28),
  },
  {
    id: 'webinar-3',
    title: 'Digital Marketing Trends 2025',
    description: 'Explore the latest trends in digital marketing and social media',
    host_id: '3',
    host_name: 'Emily Rodriguez',
    host_email: 'emily.rodriguez@company.com',
    category: 'Sales & Marketing',
    scheduled_date: getDate(-14), // 14 days ago (completed)
    start_time: '13:00:00',
    end_time: '14:00:00',
    timezone: 'UTC',
    status: 'completed',
    registration_required: false,
    registration_deadline: null,
    max_attendees: null,
    meeting_link: 'https://meet.example.com/marketing-trends',
    meeting_id: 'marketing-trends',
    meeting_password: null,
    is_recorded: true,
    recording_url: 'https://recordings.example.com/marketing-trends-2025',
    recording_duration_minutes: 60,
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-45),
    updated_at: getDateTime(-14, 14),
  },
  {
    id: 'webinar-4',
    title: 'Leadership Workshop: Building High-Performance Teams',
    description: 'Interactive workshop on team building and leadership',
    host_id: '2',
    host_name: 'Michael Chen',
    host_email: 'michael.chen@company.com',
    category: 'Leadership',
    scheduled_date: getDate(21), // 21 days from today (upcoming)
    start_time: '09:00:00',
    end_time: '12:00:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(20),
    max_attendees: 30,
    meeting_link: 'https://meet.example.com/leadership-workshop',
    meeting_id: 'leadership-workshop',
    meeting_password: 'Lead2025!',
    is_recorded: false,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    target_audience: 'managers',
    created_at: getDateTime(-25),
    updated_at: getDateTime(-25),
  },
  {
    id: 'webinar-5',
    title: 'Cybersecurity Fundamentals for Everyone',
    description: 'Essential cybersecurity practices to protect yourself and your organization',
    host_id: '2',
    host_name: 'Michael Chen',
    host_email: 'michael.chen@company.com',
    category: 'IT & Security',
    scheduled_date: getDate(10), // 10 days from today (upcoming)
    start_time: '15:00:00',
    end_time: '16:00:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(9),
    max_attendees: 200,
    meeting_link: 'https://meet.example.com/cybersecurity',
    meeting_id: 'cybersecurity',
    meeting_password: 'Secure2025!',
    is_recorded: true,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-22),
    updated_at: getDateTime(-22),
  },
  {
    id: 'webinar-6',
    title: 'Effective Communication Skills',
    description: 'Master the art of professional communication in the workplace',
    host_id: '3',
    host_name: 'Emily Rodriguez',
    host_email: 'emily.rodriguez@company.com',
    category: 'Communication',
    scheduled_date: getDate(-7), // 7 days ago (completed)
    start_time: '11:00:00',
    end_time: '12:00:00',
    timezone: 'UTC',
    status: 'completed',
    registration_required: true,
    registration_deadline: getDateTime(-8),
    max_attendees: 75,
    meeting_link: 'https://meet.example.com/communication',
    meeting_id: 'communication',
    meeting_password: null,
    is_recorded: true,
    recording_url: 'https://recordings.example.com/communication-skills-2025',
    recording_duration_minutes: 55,
    thumbnail_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-38),
    updated_at: getDateTime(-7, 12),
  },
  {
    id: 'webinar-7',
    title: 'Time Management Mastery',
    description: 'Learn proven techniques to maximize productivity and achieve work-life balance',
    host_id: '2',
    host_name: 'Michael Chen',
    host_email: 'michael.chen@company.com',
    category: 'Operations',
    scheduled_date: getDate(30), // 30 days from today (upcoming)
    start_time: '14:00:00',
    end_time: '15:00:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(29),
    max_attendees: 60,
    meeting_link: 'https://meet.example.com/time-management',
    meeting_id: 'time-management',
    meeting_password: 'Time2025!',
    is_recorded: false,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-20),
    updated_at: getDateTime(-20),
  },
  {
    id: 'webinar-8',
    title: 'Financial Planning for Professionals',
    description: 'Essential financial planning strategies for career growth and retirement',
    host_id: '3',
    host_name: 'Emily Rodriguez',
    host_email: 'emily.rodriguez@company.com',
    category: 'Finance',
    scheduled_date: getDate(5), // 5 days from today (upcoming)
    start_time: '16:00:00',
    end_time: '17:00:00',
    timezone: 'UTC',
    status: 'published',
    registration_required: true,
    registration_deadline: getDateTime(4),
    max_attendees: 80,
    meeting_link: 'https://meet.example.com/financial-planning',
    meeting_id: 'financial-planning',
    meeting_password: 'Finance2025!',
    is_recorded: true,
    recording_url: null,
    recording_duration_minutes: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    target_audience: 'all',
    created_at: getDateTime(-18),
    updated_at: getDateTime(-18),
  },
];

