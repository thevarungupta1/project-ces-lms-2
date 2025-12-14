export const getSampleCourses = (educatorIds: string[], categoryIds: string[]) => {
  // Categories are seeded in this order: Technology, Leadership, Communication, Compliance, Sales & Marketing, Finance, HR & People, Operations
  // Map frontend category names to backend category indices
  // 0: Technology, 1: Leadership, 2: Communication, 3: Compliance, 4: Sales & Marketing, 5: Finance, 6: HR & People, 7: Operations
  const categoryMap: Record<string, number> = {
    'Management': 7, // Operations
    'Data Science': 0, // Technology (closest match)
    'Marketing': 4, // Sales & Marketing
    'IT & Security': 0, // Technology
    'Leadership': 1, // Leadership
  };

  return [
    {
      title: 'Introduction to Project Management',
      description: 'Learn the fundamentals of project management including planning, execution, and monitoring.',
      educator: educatorIds[0], // Michael Chen
      duration: '6 weeks',
      level: 'Beginner' as const,
      enrolledCount: 45,
      category: categoryIds[categoryMap['Management'] || 7],
      status: 'active' as const,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    },
    {
      title: 'Advanced Data Analytics',
      description: 'Deep dive into data analytics, visualization, and business intelligence tools.',
      educator: educatorIds[1], // Emily Rodriguez
      duration: '8 weeks',
      level: 'Advanced' as const,
      enrolledCount: 32,
      category: categoryIds[categoryMap['Data Science'] || 0],
      status: 'active' as const,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      title: 'Digital Marketing Essentials',
      description: 'Master digital marketing strategies including SEO, SEM, and social media marketing.',
      educator: educatorIds[1], // Emily Rodriguez
      duration: '5 weeks',
      level: 'Intermediate' as const,
      enrolledCount: 58,
      category: categoryIds[categoryMap['Marketing'] || 4],
      status: 'active' as const,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
      title: 'Cybersecurity Fundamentals',
      description: 'Understanding cybersecurity threats, best practices, and protection strategies.',
      educator: educatorIds[0], // Michael Chen
      duration: '7 weeks',
      level: 'Beginner' as const,
      enrolledCount: 41,
      category: categoryIds[categoryMap['IT & Security'] || 0],
      status: 'active' as const,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    },
    {
      title: 'Leadership Development Program',
      description: 'Develop essential leadership skills for managing teams and driving organizational success.',
      educator: educatorIds[0], // Michael Chen
      duration: '10 weeks',
      level: 'Intermediate' as const,
      enrolledCount: 28,
      category: categoryIds[categoryMap['Leadership'] || 1],
      status: 'draft' as const,
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    },
  ];
};

