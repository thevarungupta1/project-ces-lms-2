import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import { LearnerProfileCard } from '../widgets/LearnerProfileCard';
import { MyAssignedCourses } from '../widgets/MyAssignedCourses';
import { LearningPathsWidget } from '../widgets/LearningPathsWidget';
import { LeaderboardWidget } from '../widgets/LeaderboardWidget';

export default function LearnerDashboardPage() {
  const stats = [
    { title: 'Enrolled Courses', value: 3, icon: BookOpen },
    { title: 'Completed', value: 1, icon: TrendingUp },
    { title: 'Pending Quizzes', value: 2, icon: ClipboardList },
    { title: 'Progress', value: '65%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <LearnerProfileCard />
      
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
                <div className="h-2 w-2 mt-2 rounded-full bg-success" />
                <div>
                  <p className="text-sm font-medium">Course completed</p>
                  <p className="text-xs text-muted-foreground">Digital Marketing Essentials</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-warning" />
                <div>
                  <p className="text-sm font-medium">Quiz due soon</p>
                  <p className="text-xs text-muted-foreground">JavaScript Fundamentals - Due in 2 days</p>
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
                <Link to="/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/quizzes">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View Quizzes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <MyAssignedCourses />
        </div>
        <LearningPathsWidget />
        <LeaderboardWidget />
      </div>
    </div>
  );
}

