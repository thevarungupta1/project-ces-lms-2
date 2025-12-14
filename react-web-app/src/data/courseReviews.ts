export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
}

export const sampleCourseReviews: CourseReview[] = [
  {
    id: 'review-1',
    course_id: '1',
    user_id: '5',
    user_name: 'Jessica Taylor',
    user_email: 'jessica.taylor@company.com',
    rating: 5,
    comment: 'Excellent course! Very well structured and easy to follow. The practical examples were particularly helpful.',
    created_at: '2024-02-13T10:00:00Z',
    updated_at: '2024-02-13T10:00:00Z',
  },
  {
    id: 'review-2',
    course_id: '1',
    user_id: '4',
    user_name: 'David Kim',
    user_email: 'david.kim@company.com',
    rating: 4,
    comment: 'Great content and the instructor explains things clearly. Would recommend to anyone starting out.',
    created_at: '2024-02-06T14:30:00Z',
    updated_at: '2024-02-06T14:30:00Z',
  },
  {
    id: 'review-3',
    course_id: '2',
    user_id: '6',
    user_name: 'Robert Brown',
    user_email: 'robert.brown@company.com',
    rating: 5,
    comment: 'Comprehensive and well-paced. The analytics tools covered are industry-standard.',
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-02-10T09:15:00Z',
  },
  {
    id: 'review-4',
    course_id: '3',
    user_id: '5',
    user_name: 'Jessica Taylor',
    user_email: 'jessica.taylor@company.com',
    rating: 4,
    comment: 'Good introduction to digital marketing. The case studies were very relevant.',
    created_at: '2024-02-08T16:20:00Z',
    updated_at: '2024-02-08T16:20:00Z',
  },
];

