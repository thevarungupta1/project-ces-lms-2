import { hashPassword } from '../src/core/utils/crypto';

export const sampleUsers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    password: 'admin123',
    role: 'admin' as const,
    department: 'Administration',
    isActive: true,
    joinedDate: new Date('2023-01-15'),
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    password: 'educator123',
    role: 'educator' as const,
    department: 'Engineering',
    isActive: true,
    joinedDate: new Date('2023-02-20'),
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    password: 'educator123',
    role: 'educator' as const,
    department: 'Marketing',
    isActive: true,
    joinedDate: new Date('2023-03-10'),
  },
  {
    name: 'David Kim',
    email: 'david.kim@company.com',
    password: 'learner123',
    role: 'learner' as const,
    department: 'Sales',
    isActive: true,
    joinedDate: new Date('2023-04-05'),
  },
  {
    name: 'Jessica Taylor',
    email: 'jessica.taylor@company.com',
    password: 'learner123',
    role: 'learner' as const,
    department: 'Engineering',
    isActive: true,
    joinedDate: new Date('2023-04-12'),
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    password: 'learner123',
    role: 'learner' as const,
    department: 'Operations',
    isActive: false,
    joinedDate: new Date('2023-05-01'),
  },
];

export const getHashedUsers = async () => {
  return Promise.all(
    sampleUsers.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password),
    }))
  );
};

