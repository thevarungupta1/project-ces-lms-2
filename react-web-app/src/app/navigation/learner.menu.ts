import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Bell, 
  GraduationCap,
  Award,
  Video
} from 'lucide-react';

export const learnerMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Courses', url: '/courses', icon: BookOpen },
  { title: 'Webinars', url: '/webinars', icon: Video },
  { title: 'Learning Paths', url: '/learning-paths', icon: GraduationCap },
  { title: 'Certificates', url: '/certificates', icon: Award },
  { title: 'Quizzes', url: '/quizzes', icon: ClipboardList },
  { title: 'Talent Profile', url: '/talent-profile', icon: GraduationCap },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

