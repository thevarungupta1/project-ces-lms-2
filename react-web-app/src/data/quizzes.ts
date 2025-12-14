export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  attempts: number;
  createdBy: string;
  createdDate: string;
  questions: QuizQuestion[];
}

export const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Project Management Basics',
    courseId: '1',
    courseName: 'Introduction to Project Management',
    duration: 30,
    totalQuestions: 10,
    passingScore: 70,
    attempts: 3,
    createdBy: 'Michael Chen',
    createdDate: '2023-06-10',
    questions: [
      {
        id: '1-1',
        question: 'What is the first phase of project management?',
        options: ['Execution', 'Initiation', 'Planning', 'Monitoring'],
        correctAnswer: 1,
      },
      {
        id: '1-2',
        question: 'Which document defines project scope?',
        options: ['Project Charter', 'Risk Register', 'Status Report', 'Budget Plan'],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: '2',
    title: 'Data Visualization Quiz',
    courseId: '2',
    courseName: 'Advanced Data Analytics',
    duration: 45,
    totalQuestions: 15,
    passingScore: 75,
    attempts: 2,
    createdBy: 'Emily Rodriguez',
    createdDate: '2023-07-05',
    questions: [
      {
        id: '2-1',
        question: 'Which chart is best for showing trends over time?',
        options: ['Pie Chart', 'Line Chart', 'Bar Chart', 'Scatter Plot'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: '3',
    title: 'SEO Fundamentals Test',
    courseId: '3',
    courseName: 'Digital Marketing Essentials',
    duration: 25,
    totalQuestions: 12,
    passingScore: 70,
    attempts: 3,
    createdBy: 'Emily Rodriguez',
    createdDate: '2023-07-15',
    questions: [
      {
        id: '3-1',
        question: 'What does SEO stand for?',
        options: ['Search Engine Optimization', 'Social Engagement Online', 'Secure Email Operation', 'Sales Evaluation Order'],
        correctAnswer: 0,
      },
    ],
  },
];
