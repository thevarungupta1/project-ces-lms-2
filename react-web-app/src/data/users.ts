export type UserRole = 'admin' | 'educator' | 'learner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedDate: string;
  isActive?: boolean;
}

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    department: 'Administration',
    joinedDate: '2023-01-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'educator',
    department: 'Engineering',
    joinedDate: '2023-02-20',
    isActive: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'educator',
    department: 'Marketing',
    joinedDate: '2023-03-10',
    isActive: true,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'learner',
    department: 'Sales',
    joinedDate: '2023-04-05',
    isActive: true,
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@company.com',
    role: 'learner',
    department: 'Engineering',
    joinedDate: '2023-04-12',
    isActive: true,
  },
  {
    id: '6',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    role: 'learner',
    department: 'Operations',
    joinedDate: '2023-05-01',
    isActive: false,
  },
];
