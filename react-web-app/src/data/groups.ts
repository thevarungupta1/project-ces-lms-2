export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdBy: string;
  createdDate: string;
  members: string[]; // Array of user IDs
}

export const sampleGroups: Group[] = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'Software engineers and technical staff',
    memberCount: 24,
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-10',
    members: ['1', '2', '5', '7'],
  },
  {
    id: '2',
    name: 'Sales Department',
    description: 'Sales representatives and account managers',
    memberCount: 18,
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-12',
    members: ['3', '6'],
  },
  {
    id: '3',
    name: 'Leadership Program',
    description: 'Participants in the leadership development program',
    memberCount: 12,
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-15',
    members: ['1', '4', '8'],
  },
  {
    id: '4',
    name: 'New Hires 2024',
    description: 'All employees who joined in 2024',
    memberCount: 32,
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-05',
    members: ['9', '10'],
  },
  {
    id: '5',
    name: 'Marketing Team',
    description: 'Marketing and communications staff',
    memberCount: 15,
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-08',
    members: ['2', '5'],
  },
];
