export const getSampleQuizzes = (courseIds: string[], educatorIds: string[]) => {
  // Map courses: courseIds[0] = Introduction to Project Management, courseIds[1] = Advanced Data Analytics, courseIds[2] = Digital Marketing Essentials
  // Map educators: educatorIds[0] = Michael Chen, educatorIds[1] = Emily Rodriguez
  
  return [
    {
      title: 'Project Management Basics',
      course: courseIds[0], // Introduction to Project Management
      duration: 30,
      totalQuestions: 10,
      passingScore: 70,
      attempts: 3,
      createdBy: educatorIds[0], // Michael Chen
      isActive: true,
      questions: [
        {
          question: 'What is the first phase of project management?',
          options: ['Execution', 'Initiation', 'Planning', 'Monitoring'],
          correctAnswer: 1,
        },
        {
          question: 'Which document defines project scope?',
          options: ['Project Charter', 'Risk Register', 'Status Report', 'Budget Plan'],
          correctAnswer: 0,
        },
      ],
    },
    {
      title: 'Data Visualization Quiz',
      course: courseIds[1], // Advanced Data Analytics
      duration: 45,
      totalQuestions: 15,
      passingScore: 75,
      attempts: 2,
      createdBy: educatorIds[1], // Emily Rodriguez
      isActive: true,
      questions: [
        {
          question: 'Which chart is best for showing trends over time?',
          options: ['Pie Chart', 'Line Chart', 'Bar Chart', 'Scatter Plot'],
          correctAnswer: 1,
        },
      ],
    },
    {
      title: 'SEO Fundamentals Test',
      course: courseIds[2], // Digital Marketing Essentials
      duration: 25,
      totalQuestions: 12,
      passingScore: 70,
      attempts: 3,
      createdBy: educatorIds[1], // Emily Rodriguez
      isActive: true,
      questions: [
        {
          question: 'What does SEO stand for?',
          options: ['Search Engine Optimization', 'Social Engagement Online', 'Secure Email Operation', 'Sales Evaluation Order'],
          correctAnswer: 0,
        },
      ],
    },
  ];
};

