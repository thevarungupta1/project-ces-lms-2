import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { useCourseAssignments } from '@/features/courses/hooks/useCourseAssignments';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { Loader, CardLoader } from '@/shared/components';

interface AssignedCourse {
  id: string;
  course_id: string;
  course_title: string;
  due_date: string | null;
  status: string;
  progress: number;
  assigned_at: string;
}

export const MyAssignedCourses = () => {
  const { user } = useAuth();

  // Fetch assignments for current user
  const { data: assignmentsResponse, isLoading: loadingAssignments } = useCourseAssignments(
    user?.id ? { learner: user.id } : undefined
  );

  // Fetch all courses to get course titles
  const { data: coursesResponse } = useCourses();
  const courses = coursesResponse?.data || [];

  // Map assignments to component format
  const assignments = useMemo(() => {
    if (!assignmentsResponse?.data) return [];
    
    return assignmentsResponse.data.map(item => {
      const courseId = typeof item.course === 'object' ? item.course._id : item.course;
      const course = courses.find(c => (c._id || c.id) === courseId);
      const courseTitle = typeof item.course === 'object' ? item.course.title : course?.title || 'Unknown Course';
      
      // Determine status - check if overdue
      let status = item.status;
      if (item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'completed') {
        status = 'overdue';
      }
      
      return {
        id: item._id || item.id || '',
        course_id: courseId,
        course_title: courseTitle,
        due_date: item.dueDate || null,
        status,
        progress: item.progress,
        assigned_at: item.assignedAt,
      } as AssignedCourse;
    }).sort((a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime());
  }, [assignmentsResponse, courses]);

  const isLoading = loadingAssignments;

  const getStatusInfo = (assignment: AssignedCourse) => {
    if (assignment.status === 'completed') {
      return {
        badge: <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>,
        priority: 3,
      };
    }
    
    if (assignment.due_date && isPast(new Date(assignment.due_date)) && assignment.status !== 'completed') {
      return {
        badge: <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>,
        priority: 1,
      };
    }
    
    if (assignment.progress > 0) {
      return {
        badge: <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>,
        priority: 2,
      };
    }
    
    return {
      badge: <Badge variant="secondary">Not Started</Badge>,
      priority: 2,
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Assigned Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardLoader text="Loading courses..." />
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Assigned Courses
          </CardTitle>
          <CardDescription>Courses assigned to you by administrators or educators</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No courses have been assigned to you yet.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/courses">Browse Available Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          My Assigned Courses ({assignments.length})
        </CardTitle>
        <CardDescription>Courses assigned to you by administrators or educators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const statusInfo = getStatusInfo(assignment);
            
            return (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{assignment.course_title}</h4>
                    {statusInfo.badge}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Assigned: {format(new Date(assignment.assigned_at), 'MMM d, yyyy')}</span>
                    {assignment.due_date && (
                      <span className={isPast(new Date(assignment.due_date)) && assignment.status !== 'completed' ? 'text-destructive font-medium' : ''}>
                        Due: {format(new Date(assignment.due_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 max-w-xs">
                    <Progress value={assignment.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{assignment.progress}%</span>
                  </div>
                </div>
                <Button asChild>
                  <Link to={`/courses/${assignment.course_id}`}>
                    {assignment.progress > 0 ? 'Continue' : 'Start'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

