export interface IssuedCertificate {
  id: string;
  certificate_number: string;
  course_id: string;
  course_title: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  template_id: string;
  issued_at: string;
  completion_date: string;
  created_at: string;
}

export const sampleIssuedCertificates: IssuedCertificate[] = [
  {
    id: 'cert-1',
    certificate_number: 'CERT-2024-001',
    course_id: '1',
    course_title: 'Introduction to Project Management',
    learner_id: '5',
    learner_name: 'Jessica Taylor',
    learner_email: 'jessica.taylor@company.com',
    template_id: 'cert-temp-1',
    issued_at: '2024-02-15T16:30:00Z',
    completion_date: '2024-02-15',
    created_at: '2024-02-15T16:30:00Z',
  },
  {
    id: 'cert-2',
    certificate_number: 'CERT-2024-002',
    course_id: '3',
    course_title: 'Digital Marketing Essentials',
    learner_id: '6',
    learner_name: 'Robert Brown',
    learner_email: 'robert.brown@company.com',
    template_id: 'cert-temp-1',
    issued_at: '2024-02-10T15:00:00Z',
    completion_date: '2024-02-10',
    created_at: '2024-02-10T15:00:00Z',
  },
  {
    id: 'cert-3',
    certificate_number: 'CERT-2024-003',
    course_id: '1',
    course_title: 'Introduction to Project Management',
    learner_id: '4',
    learner_name: 'David Kim',
    learner_email: 'david.kim@company.com',
    template_id: 'cert-temp-2',
    issued_at: '2024-02-20T10:00:00Z',
    completion_date: '2024-02-20',
    created_at: '2024-02-20T10:00:00Z',
  },
  // Certificate for learner@ceslms.com
  {
    id: 'cert-4',
    certificate_number: 'CERT-2024-004',
    course_id: '1',
    course_title: 'Introduction to Project Management',
    learner_id: 'learner@ceslms.com',
    learner_name: 'Learner User',
    learner_email: 'learner@ceslms.com',
    template_id: 'cert-temp-1',
    issued_at: '2024-02-18T14:00:00Z',
    completion_date: '2024-02-18',
    created_at: '2024-02-18T14:00:00Z',
  },
  {
    id: 'cert-5',
    certificate_number: 'CERT-2024-005',
    course_id: '3',
    course_title: 'Digital Marketing Essentials',
    learner_id: 'learner@ceslms.com',
    learner_name: 'Learner User',
    learner_email: 'learner@ceslms.com',
    template_id: 'cert-temp-2',
    issued_at: '2024-02-12T11:30:00Z',
    completion_date: '2024-02-12',
    created_at: '2024-02-12T11:30:00Z',
  },
];

