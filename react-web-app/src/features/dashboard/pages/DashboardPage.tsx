import { useAuth } from '@/app/providers';
import AdminDashboardPage from './AdminDashboardPage';
import EducatorDashboardPage from './EducatorDashboardPage';
import LearnerDashboardPage from './LearnerDashboardPage';

export default function DashboardPage() {
  const { user, profile, role, isLoading } = useAuth();
  const displayName = profile?.full_name || user?.email || 'User';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground mt-2">
          {role === 'admin' && 'Comprehensive analytics and insights for your learning platform.'}
          {role === 'educator' && 'Track your courses and engage with students.'}
          {role === 'learner' && 'Continue your learning journey.'}
        </p>
      </div>

      {role === 'admin' && <AdminDashboardPage />}
      {role === 'educator' && <EducatorDashboardPage />}
      {role === 'learner' && <LearnerDashboardPage />}
    </div>
  );
}

