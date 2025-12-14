import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useCourseAssignments } from '../hooks/useCourseAssignments';
import type { CourseAssignment } from '../api/courseAssignment.api';

interface CourseAssignmentsListProps {
  courseId: string;
}

export const CourseAssignmentsList = ({ courseId }: CourseAssignmentsListProps) => {
  // Fetch assignments from API
  const { data: assignmentsResponse, isLoading } = useCourseAssignments({ course: courseId });
  
  // Map API response to component format
  const assignments = useMemo(() => {
    if (!assignmentsResponse?.data) return [];
    
    return assignmentsResponse.data.map(a => {
      const learner = typeof a.learner === 'object' ? a.learner : null;
      const group = typeof a.group === 'object' ? a.group : null;
      
      // Determine status - check if overdue
      let status = a.status;
      if (a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'completed') {
        status = 'overdue';
      }
      
      return {
        id: a._id || a.id || '',
        learner_id: typeof a.learner === 'string' ? a.learner : a.learner._id,
        learner_name: learner?.name || 'Unknown',
        learner_email: learner?.email || '',
        group_name: group?.name || null,
        due_date: a.dueDate || null,
        status,
        progress: a.progress,
        assigned_at: a.assignedAt,
        started_at: a.startedAt || null,
        completed_at: a.completedAt || null,
      };
    }).sort((a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime());
  }, [assignmentsResponse]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="secondary">Assigned</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading assignments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No learners assigned to this course yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Use the "Assign Course" button to assign learners.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Assigned Learners ({assignments.length})
        </CardTitle>
        <CardDescription>Track learner progress and completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{assignment.learner_name}</span>
                    {assignment.group_name && (
                      <Badge variant="outline" className="text-xs">
                        {assignment.group_name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.learner_email}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Assigned: {format(new Date(assignment.assigned_at), 'MMM d, yyyy')}</span>
                    {assignment.due_date && (
                      <span>Due: {format(new Date(assignment.due_date), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(assignment.status)}
                  <div className="flex items-center gap-2 w-32">
                    <Progress value={assignment.progress} className="flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{assignment.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
