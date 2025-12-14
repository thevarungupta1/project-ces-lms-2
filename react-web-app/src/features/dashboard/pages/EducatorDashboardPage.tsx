import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { useDashboard } from '@/shared/hooks/useDashboard';
import { PageLoader } from '@/shared/components';
import type { EducatorDashboardData } from '@/shared/api/dashboard.api';

export default function EducatorDashboardPage() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboard();
  
  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  const data = dashboardData as EducatorDashboardData;
  
  const stats = [
    { title: 'My Courses', value: data?.myCourses || 0, icon: BookOpen },
    { title: 'Total Students', value: data?.totalStudents || 0, icon: Users },
    { title: 'Active Assignments', value: data?.activeAssignments || 0, icon: ClipboardList },
    { title: 'Completed', value: data?.completedAssignments || 0, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">New enrollment</p>
                  <p className="text-xs text-muted-foreground">5 students enrolled in your course</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-success" />
                <div>
                  <p className="text-sm font-medium">Quiz completed</p>
                  <p className="text-xs text-muted-foreground">12 students completed your quiz</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/courses/create">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Course
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/quizzes/create">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Create New Quiz
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/students">
                  <Users className="mr-2 h-4 w-4" />
                  View Students
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

