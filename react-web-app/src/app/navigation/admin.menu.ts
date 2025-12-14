import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Bell, 
  Settings, 
  GraduationCap,
  Megaphone,
  Tag,
  Award,
  Video
} from 'lucide-react';

export const adminMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Courses', url: '/courses', icon: BookOpen },
  { title: 'Webinars', url: '/webinars', icon: Video },
  { title: 'Categories', url: '/categories', icon: Tag },
  { title: 'Certificates', url: '/certificates', icon: Award },
  { title: 'Users', url: '/users', icon: Users },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Learning Paths', url: '/learning-paths', icon: GraduationCap },
  { title: 'Quizzes', url: '/quizzes', icon: ClipboardList },
  { title: 'Leaderboard', url: '/leaderboard', icon: GraduationCap },
  { title: 'Announcements', url: '/announcements', icon: Megaphone },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

