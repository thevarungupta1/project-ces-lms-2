import { useMemo } from 'react';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Route, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLearningPaths } from '@/features/learning-paths/hooks/useLearningPaths';
import { useLearningPathEnrollments } from '@/features/learning-paths/hooks/useLearningPathEnrollments';
import { useEnrollInLearningPath } from '@/features/learning-paths/hooks/useLearningPathEnrollments';
import { Loader, CardLoader } from '@/shared/components';

interface LearningPath {
  id: string;
  title: string;
  category: string;
  duration_weeks: number;
  difficulty_level: string;
  thumbnail: string | null;
}

interface Enrollment {
  id: string;
  learning_path_id: string;
  progress_percentage: number;
  completed_steps: number;
  status: string;
}

export function LearningPathsWidget() {
  const { user } = useAuth();

  // Fetch learning paths
  const { data: pathsResponse, isLoading: loadingPaths } = useLearningPaths({ isActive: true, limit: 3 });
  const paths = pathsResponse?.data || [];

  // Fetch user enrollments
  const { data: enrollmentsResponse, isLoading: loadingEnrollments } = useLearningPathEnrollments(
    user?.id ? { user: user.id } : undefined
  );
  const enrollments = enrollmentsResponse?.data || [];

  // Enrollment mutation
  const enrollMutation = useEnrollInLearningPath();

  const loading = loadingPaths || loadingEnrollments;

  const handleEnroll = async (pathId: string) => {
    try {
      await enrollMutation.mutateAsync({ learningPath: pathId });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getEnrollmentForPath = (pathId: string) => {
    return enrollments.find(e => {
      const lpId = typeof e.learningPath === 'object' ? e.learningPath._id : e.learningPath;
      return lpId === pathId;
    });
  };

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-500/10 text-green-600',
      intermediate: 'bg-yellow-500/10 text-yellow-600',
      advanced: 'bg-red-500/10 text-red-600',
    };
    return colors[level] || colors.intermediate;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Learning Paths
        </CardTitle>
        <CardDescription>Structured learning journeys to master new skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="md" text="Loading paths..." />
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No learning paths available</p>
          </div>
        ) : (
          paths.slice(0, 3).map((path) => {
            const pathId = path._id || path.id || '';
            const enrollment = getEnrollmentForPath(pathId);
            const categoryName = typeof path.category === 'object' ? path.category.name : path.category || 'Uncategorized';
            const difficultyLevel = path.difficultyLevel.toLowerCase();
            
            return (
              <div
                key={pathId}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  {path.thumbnail && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={path.thumbnail}
                        alt={path.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{path.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(difficultyLevel)}`}>
                        {path.difficultyLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {path.durationWeeks}w
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryName}
                      </Badge>
                    </div>
                    
                    {enrollment ? (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{enrollment.progressPercentage}%</span>
                        </div>
                        <Progress value={enrollment.progressPercentage} className="h-1.5" />
                        {enrollment.status === 'completed' && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => handleEnroll(pathId)}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <Loader size="sm" text="Enrolling..." />
                        ) : (
                          'Enroll Now'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <Button variant="outline" className="w-full" asChild>
          <Link to="/learning-paths">
            View All Paths
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

