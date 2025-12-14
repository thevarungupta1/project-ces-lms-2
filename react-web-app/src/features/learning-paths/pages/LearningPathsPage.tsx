import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { useLearningPathSteps } from '../hooks/useLearningPathSteps';
import { useLearningPathEnrollments } from '../hooks/useLearningPathEnrollments';
import { useEnrollInLearningPath } from '../hooks/useLearningPathEnrollments';
import { PageLoader } from '@/shared/components';
import { 
  Route, 
  BookOpen, 
  ClipboardCheck, 
  FolderKanban, 
  Presentation,
  Plus,
  Edit,
  Trash2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathStep {
  id: string;
  step_order: number;
  step_type: string;
  title: string;
  description: string;
  duration_weeks: number;
  is_required: boolean;
}

export default function LearningPaths() {
  const { role, user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Fetch learning paths from API
  const { data: pathsResponse, isLoading: loadingPaths } = useLearningPaths({ isActive: true });
  const pathsData = pathsResponse?.data || [];

  // Fetch steps for selected path
  const { data: stepsData, isLoading: loadingSteps } = useLearningPathSteps(selectedPath || '');

  // Fetch user enrollments
  const { data: enrollmentsResponse } = useLearningPathEnrollments(
    user?.id ? { user: user.id } : undefined
  );
  const enrollments = enrollmentsResponse?.data || [];

  // Enrollment mutation
  const enrollMutation = useEnrollInLearningPath();

  // Map API data to component format
  const paths = useMemo(() => {
    return pathsData.map(path => {
      const categoryName = typeof path.category === 'object' ? path.category.name : path.category || 'Uncategorized';
      
      return {
        id: path._id || path.id || '',
        title: path.title,
        description: path.description,
        category: categoryName,
        duration_weeks: path.durationWeeks,
        difficulty_level: path.difficultyLevel.toLowerCase(),
        thumbnail: path.thumbnail || null,
        is_active: path.isActive,
      };
    }).sort((a, b) => {
      // Sort by created date descending
      const aDate = pathsData.find(p => (p._id || p.id) === a.id)?.createdAt || '';
      const bDate = pathsData.find(p => (p._id || p.id) === b.id)?.createdAt || '';
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [pathsData]);

  const pathSteps = useMemo(() => {
    if (!stepsData) return [];
    
    return stepsData.map(step => ({
      id: step._id || step.id || '',
      step_order: step.stepOrder,
      step_type: step.stepType,
      title: step.title,
      description: step.description || '',
      duration_weeks: step.durationWeeks,
      is_required: step.isRequired,
    })).sort((a, b) => a.step_order - b.step_order);
  }, [stepsData]);

  const loading = loadingPaths || loadingSteps;

  // Set default selected path on mount
  useEffect(() => {
    if (paths.length > 0 && !selectedPath) {
      setSelectedPath(paths[0].id);
    }
  }, [paths, selectedPath]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'assessment':
        return <ClipboardCheck className="h-5 w-5" />;
      case 'project':
        return <FolderKanban className="h-5 w-5" />;
      case 'presentation':
        return <Presentation className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'assessment':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'project':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'presentation':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getDifficultyBadge = (level: string) => {
    const variants: Record<string, string> = {
      beginner: 'bg-green-500/10 text-green-600 border-green-500/20',
      intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return variants[level] || variants.intermediate;
  };

  const canManage = role === 'admin' || role === 'educator';

  if (loading) {
    return <PageLoader text="Loading learning paths..." />;
  }

  const selectedPathData = paths.find(p => p.id === selectedPath);

  if (paths.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Route className="h-8 w-8 text-primary" />
              Learning Paths
            </h1>
            <p className="text-muted-foreground mt-1">
              {canManage ? 'Manage structured learning journeys' : 'Explore guided learning paths'}
            </p>
          </div>
          {canManage && (
            <Button className="gap-2" asChild>
              <Link to="/learning-paths/create">
                <Plus className="h-4 w-4" />
                Create Path
              </Link>
            </Button>
          )}
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No learning paths available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            Learning Paths
          </h1>
          <p className="text-muted-foreground mt-1">
            {canManage ? 'Manage structured learning journeys' : 'Explore guided learning paths'}
          </p>
        </div>
        {canManage && (
          <Button className="gap-2" asChild>
            <Link to="/learning-paths/create">
              <Plus className="h-4 w-4" />
              Create Path
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Paths</h2>
          {paths.map((path) => (
            <Card
              key={path.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPath === path.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => setSelectedPath(path.id)}
            >
              {path.thumbnail && (
                <div className="h-32 overflow-hidden rounded-t-lg">
                  <img
                    src={path.thumbnail}
                    alt={path.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{path.title}</CardTitle>
                  <Badge className={getDifficultyBadge(path.difficulty_level)}>
                    {path.difficulty_level}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {path.duration_weeks} weeks
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {path.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedPathData ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{selectedPathData.title}</CardTitle>
                    <CardDescription>{selectedPathData.description}</CardDescription>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyBadge(selectedPathData.difficulty_level)}>
                        {selectedPathData.difficulty_level}
                      </Badge>
                      <Badge variant="outline">{selectedPathData.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {selectedPathData.duration_weeks} weeks
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="steps">
                  <TabsList>
                    <TabsTrigger value="steps">Learning Journey</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="steps" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      {pathSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-full border-2 ${getStepColor(step.step_type)}`}>
                              {getStepIcon(step.step_type)}
                            </div>
                            {index < pathSteps.length - 1 && (
                              <div className="w-px h-12 bg-border" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    Step {step.step_order}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {step.step_type}
                                  </Badge>
                                  {step.is_required && (
                                    <Badge variant="secondary" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-foreground">{step.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {step.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {step.duration_weeks}w
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="overview" className="mt-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Path Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Steps</span>
                            <span className="font-semibold">{pathSteps.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Courses</span>
                            <span className="font-semibold">
                              {pathSteps.filter(s => s.step_type === 'course').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Assessments</span>
                            <span className="font-semibold">
                              {pathSteps.filter(s => s.step_type === 'assessment').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Projects</span>
                            <span className="font-semibold">
                              {pathSteps.filter(s => s.step_type === 'project').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Presentations</span>
                            <span className="font-semibold">
                              {pathSteps.filter(s => s.step_type === 'presentation').length}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a learning path to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
