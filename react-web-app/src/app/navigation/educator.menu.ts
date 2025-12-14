import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Bell, 
  GraduationCap,
  Megaphone,
  Tag,
  Award,
  Video
} from 'lucide-react';

export const educatorMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Courses', url: '/courses', icon: BookOpen },
  { title: 'Webinars', url: '/webinars', icon: Video },
  { title: 'Categories', url: '/categories', icon: Tag },
  { title: 'Certificates', url: '/certificates', icon: Award },
  { title: 'Learning Paths', url: '/learning-paths', icon: GraduationCap },
  { title: 'Quizzes', url: '/quizzes', icon: ClipboardList },
  { title: 'Leaderboard', url: '/leaderboard', icon: GraduationCap },
  { title: 'Students', url: '/students', icon: Users },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

