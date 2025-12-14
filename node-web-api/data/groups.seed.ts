export const getSampleGroups = (adminId: string, learnerIds: string[]) => [
  {
    name: 'Engineering Team',
    description: 'Software engineers and technical staff',
    members: learnerIds.slice(0, 3), // David Kim, Jessica Taylor, etc.
    createdBy: adminId,
    isActive: true,
  },
  {
    name: 'Sales Department',
    description: 'Sales representatives and account managers',
    members: learnerIds.slice(0, 2), // David Kim, etc.
    createdBy: adminId,
    isActive: true,
  },
  {
    name: 'Leadership Program',
    description: 'Participants in the leadership development program',
    members: learnerIds.slice(0, 3),
    createdBy: adminId,
    isActive: true,
  },
  {
    name: 'New Hires 2024',
    description: 'All employees who joined in 2024',
    members: learnerIds,
    createdBy: adminId,
    isActive: true,
  },
  {
    name: 'Marketing Team',
    description: 'Marketing and communications staff',
    members: learnerIds.slice(1, 3),
    createdBy: adminId,
    isActive: true,
  },
];

