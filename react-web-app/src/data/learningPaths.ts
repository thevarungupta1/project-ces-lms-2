export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  duration_weeks: number;
  is_active: boolean;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export const sampleLearningPaths: LearningPath[] = [
  {
    id: 'path-1',
    title: 'Full Stack Developer Path',
    description: 'Complete path from beginner to full stack developer covering frontend, backend, and DevOps',
    category: 'Technology',
    difficulty_level: 'Intermediate',
    duration_weeks: 24,
    is_active: true,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'path-2',
    title: 'Leadership Excellence Program',
    description: 'Comprehensive leadership development program for managers and executives',
    category: 'Leadership',
    difficulty_level: 'Advanced',
    duration_weeks: 16,
    is_active: true,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: 'path-3',
    title: 'Digital Marketing Mastery',
    description: 'Master all aspects of digital marketing from SEO to social media',
    category: 'Sales & Marketing',
    difficulty_level: 'Intermediate',
    duration_weeks: 12,
    is_active: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'path-4',
    title: 'Data Science Fundamentals',
    description: 'Learn data science from scratch including Python, statistics, and machine learning',
    category: 'Technology',
    difficulty_level: 'Beginner',
    duration_weeks: 20,
    is_active: true,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
  },
];

