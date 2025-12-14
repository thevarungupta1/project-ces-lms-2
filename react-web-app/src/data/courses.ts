export interface Course {
  id: string;
  title: string;
  description: string;
  educator: string;
  educatorId: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  createdDate: string;
  thumbnail?: string;
}

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Project Management',
    description: 'Learn the fundamentals of project management including planning, execution, and monitoring.',
    educator: 'Michael Chen',
    educatorId: '2',
    duration: '6 weeks',
    level: 'Beginner',
    enrolledCount: 45,
    category: 'Management',
    status: 'active',
    createdDate: '2023-06-01',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },
  {
    id: '2',
    title: 'Advanced Data Analytics',
    description: 'Deep dive into data analytics, visualization, and business intelligence tools.',
    educator: 'Emily Rodriguez',
    educatorId: '3',
    duration: '8 weeks',
    level: 'Advanced',
    enrolledCount: 32,
    category: 'Data Science',
    status: 'active',
    createdDate: '2023-06-15',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: '3',
    title: 'Digital Marketing Essentials',
    description: 'Master digital marketing strategies including SEO, SEM, and social media marketing.',
    educator: 'Emily Rodriguez',
    educatorId: '3',
    duration: '5 weeks',
    level: 'Intermediate',
    enrolledCount: 58,
    category: 'Marketing',
    status: 'active',
    createdDate: '2023-07-01',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    id: '4',
    title: 'Cybersecurity Fundamentals',
    description: 'Understanding cybersecurity threats, best practices, and protection strategies.',
    educator: 'Michael Chen',
    educatorId: '2',
    duration: '7 weeks',
    level: 'Beginner',
    enrolledCount: 41,
    category: 'IT & Security',
    status: 'active',
    createdDate: '2023-07-20',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  },
  {
    id: '5',
    title: 'Leadership Development Program',
    description: 'Develop essential leadership skills for managing teams and driving organizational success.',
    educator: 'Michael Chen',
    educatorId: '2',
    duration: '10 weeks',
    level: 'Intermediate',
    enrolledCount: 28,
    category: 'Leadership',
    status: 'draft',
    createdDate: '2023-08-01',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },
];
