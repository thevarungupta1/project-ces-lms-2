import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Clock, Award, Activity, UserCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/shared/hooks/useDashboard';
import { PageLoader } from '@/shared/components';
import type { AdminDashboardData } from '@/shared/api/dashboard.api';

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading } = useDashboard();
  
  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  const data = dashboardData as AdminDashboardData;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Available courses
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.activeAssignments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.completedCertificates || 0}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Total certificates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Total Quizzes</CardTitle>
            <CardDescription>All quiz assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalQuizzes || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Published Webinars</CardTitle>
            <CardDescription>Active webinars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalWebinars || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.activeAssignments || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

