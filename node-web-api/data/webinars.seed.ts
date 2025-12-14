export const getSampleWebinars = (educatorIds: string[]) => {
  const now = new Date();
  
  // Helper to create dates relative to today
  const getDate = (daysOffset: number): Date => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysOffset);
    return date;
  };

  const getDateTime = (daysOffset: number, hours: number = 23, minutes: number = 59): Date => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hours, minutes, 59, 999);
    return date;
  };

  // Map educator IDs: Michael Chen (index 0), Emily Rodriguez (index 1)
  // Assuming educatorIds[0] is Michael Chen and educatorIds[1] is Emily Rodriguez
  const michaelChenId = educatorIds[0];
  const emilyRodriguezId = educatorIds[1];

  return [
    {
      title: 'Introduction to Agile Methodologies',
      description: 'Learn the fundamentals of Agile project management and Scrum framework',
      host: michaelChenId,
      scheduledDate: getDate(7), // 7 days from today
      startTime: '14:00',
      endTime: '15:30',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(6, 23, 59), // 6 days from today
      maxAttendees: 50,
      meetingLink: 'https://meet.example.com/agile-intro',
      meetingId: 'agile-intro',
      meetingPassword: 'Agile2025!',
      isRecorded: false,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Data Analytics Best Practices',
      description: 'Discover best practices for data collection, analysis, and visualization',
      host: emilyRodriguezId,
      scheduledDate: getDate(14), // 14 days from today
      startTime: '10:00',
      endTime: '11:00',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(13, 23, 59),
      maxAttendees: 100,
      meetingLink: 'https://meet.example.com/data-analytics',
      meetingId: 'data-analytics',
      meetingPassword: 'Data2025!',
      isRecorded: true,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Digital Marketing Trends 2025',
      description: 'Explore the latest trends in digital marketing and social media',
      host: emilyRodriguezId,
      scheduledDate: getDate(-14), // 14 days ago (completed)
      startTime: '13:00',
      endTime: '14:00',
      timezone: 'UTC',
      status: 'completed' as const,
      registrationRequired: false,
      registrationDeadline: null,
      maxAttendees: null,
      meetingLink: 'https://meet.example.com/marketing-trends',
      meetingId: 'marketing-trends',
      meetingPassword: null,
      isRecorded: true,
      recordingUrl: 'https://recordings.example.com/marketing-trends-2025',
      recordingDurationMinutes: 60,
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Leadership Workshop: Building High-Performance Teams',
      description: 'Interactive workshop on team building and leadership',
      host: michaelChenId,
      scheduledDate: getDate(21), // 21 days from today
      startTime: '09:00',
      endTime: '12:00',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(20, 23, 59),
      maxAttendees: 30,
      meetingLink: 'https://meet.example.com/leadership-workshop',
      meetingId: 'leadership-workshop',
      meetingPassword: 'Lead2025!',
      isRecorded: false,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      targetAudience: 'managers',
    },
    {
      title: 'Cybersecurity Fundamentals for Everyone',
      description: 'Essential cybersecurity practices to protect yourself and your organization',
      host: michaelChenId,
      scheduledDate: getDate(10), // 10 days from today
      startTime: '15:00',
      endTime: '16:00',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(9, 23, 59),
      maxAttendees: 200,
      meetingLink: 'https://meet.example.com/cybersecurity',
      meetingId: 'cybersecurity',
      meetingPassword: 'Secure2025!',
      isRecorded: true,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Effective Communication Skills',
      description: 'Master the art of professional communication in the workplace',
      host: emilyRodriguezId,
      scheduledDate: getDate(-7), // 7 days ago (completed)
      startTime: '11:00',
      endTime: '12:00',
      timezone: 'UTC',
      status: 'completed' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(-8, 23, 59),
      maxAttendees: 75,
      meetingLink: 'https://meet.example.com/communication',
      meetingId: 'communication',
      meetingPassword: null,
      isRecorded: true,
      recordingUrl: 'https://recordings.example.com/communication-skills-2025',
      recordingDurationMinutes: 55,
      thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Time Management Mastery',
      description: 'Learn proven techniques to maximize productivity and achieve work-life balance',
      host: michaelChenId,
      scheduledDate: getDate(30), // 30 days from today
      startTime: '14:00',
      endTime: '15:00',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(29, 23, 59),
      maxAttendees: 60,
      meetingLink: 'https://meet.example.com/time-management',
      meetingId: 'time-management',
      meetingPassword: 'Time2025!',
      isRecorded: false,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
      targetAudience: 'all',
    },
    {
      title: 'Financial Planning for Professionals',
      description: 'Essential financial planning strategies for career growth and retirement',
      host: emilyRodriguezId,
      scheduledDate: getDate(5), // 5 days from today
      startTime: '16:00',
      endTime: '17:00',
      timezone: 'UTC',
      status: 'published' as const,
      registrationRequired: true,
      registrationDeadline: getDateTime(4, 23, 59),
      maxAttendees: 80,
      meetingLink: 'https://meet.example.com/financial-planning',
      meetingId: 'financial-planning',
      meetingPassword: 'Finance2025!',
      isRecorded: true,
      recordingUrl: null,
      recordingDurationMinutes: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      targetAudience: 'all',
    },
  ];
};

