import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sampleLearningPaths, LearningPath } from '@/data/learningPaths';
import { sampleLearningPathSteps, LearningPathStep } from '@/data/learningPathSteps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Route,
  Plus,
  Trash2,
  Save,
  BookOpen,
  FileCheck,
  FolderKanban,
  Presentation,
  GripVertical
} from 'lucide-react';

const pathSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  category: z.string().min(1, 'Category is required'),
  duration_weeks: z.number().min(1).max(52),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type PathFormData = z.infer<typeof pathSchema>;

interface PathStep {
  id: string;
  step_order: number;
  step_type: 'course' | 'assessment' | 'project' | 'presentation';
  title: string;
  description: string;
  duration_weeks: number;
  is_required: boolean;
  resource_link: string;
}

export default function LearningPathForm() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load learning paths from localStorage or use sample data
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => {
    const stored = localStorage.getItem('learning-paths-data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return sampleLearningPaths;
      }
    }
    return sampleLearningPaths;
  });

  // Load learning path steps from localStorage or use sample data
  const [learningPathSteps, setLearningPathSteps] = useState<LearningPathStep[]>(() => {
    const stored = localStorage.getItem('learning-path-steps-data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return sampleLearningPathSteps;
      }
    }
    return sampleLearningPathSteps;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('learning-paths-data', JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem('learning-path-steps-data', JSON.stringify(learningPathSteps));
  }, [learningPathSteps]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PathFormData>({
    resolver: zodResolver(pathSchema),
    defaultValues: {
      difficulty_level: 'intermediate',
      duration_weeks: 12,
    },
  });

  const difficultyLevel = watch('difficulty_level');

  const addStep = () => {
    const newStep: PathStep = {
      id: crypto.randomUUID(),
      step_order: steps.length + 1,
      step_type: 'course',
      title: '',
      description: '',
      duration_weeks: 2,
      is_required: true,
      resource_link: '',
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    const updatedSteps = steps
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, step_order: index + 1 }));
    setSteps(updatedSteps);
  };

  const updateStep = (id: string, field: keyof PathStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    
    const reorderedSteps = newSteps.map((step, idx) => ({
      ...step,
      step_order: idx + 1,
    }));
    setSteps(reorderedSteps);
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'assessment':
        return <FileCheck className="h-4 w-4" />;
      case 'project':
        return <FolderKanban className="h-4 w-4" />;
      case 'presentation':
        return <Presentation className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const onSubmit = async (data: PathFormData) => {
    if (steps.length === 0) {
      toast.error('Please add at least one step to the learning path');
      return;
    }

    setSubmitting(true);

    try {
      const now = new Date().toISOString();
      const pathId = `path-${Date.now()}`;

      // Create learning path
      const newPath: LearningPath = {
        id: pathId,
        title: data.title,
        description: data.description,
        category: data.category,
        duration_weeks: data.duration_weeks,
        difficulty_level: data.difficulty_level.charAt(0).toUpperCase() + data.difficulty_level.slice(1) as 'Beginner' | 'Intermediate' | 'Advanced',
        thumbnail: data.thumbnail || null,
        is_active: true,
        created_at: now,
        updated_at: now,
      };

      // Create steps
      const newSteps: LearningPathStep[] = steps.map(step => ({
        id: `step-${Date.now()}-${step.step_order}`,
        learning_path_id: pathId,
        step_order: step.step_order,
        step_type: step.step_type,
        title: step.title,
        description: step.description,
        duration_weeks: step.duration_weeks,
        is_required: step.is_required,
        resource_link: step.resource_link || null,
        created_at: now,
        updated_at: now,
      }));

      // Save to state and localStorage
      setLearningPaths((prev) => [...prev, newPath]);
      setLearningPathSteps((prev) => [...prev, ...newSteps]);

      toast.success('Learning path created successfully! Note: This is a demo. Changes are stored locally.');
      navigate('/learning-paths');
    } catch (error: any) {
      console.error('Error creating path:', error);
      toast.error(error.message || 'Failed to create learning path');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            Create Learning Path
          </h1>
          <p className="text-muted-foreground mt-1">
            Design a structured learning journey with courses, assessments, and projects
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about the learning path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Path Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Software Architect Path"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the learning path, target audience, and outcomes..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Architecture"
                  {...register('category')}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_weeks">Duration (weeks) *</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  min="1"
                  max="52"
                  {...register('duration_weeks', { valueAsNumber: true })}
                />
                {errors.duration_weeks && (
                  <p className="text-sm text-destructive">{errors.duration_weeks.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level *</Label>
                <Select
                  value={difficultyLevel}
                  onValueChange={(value) => setValue('difficulty_level', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register('thumbnail')}
              />
              {errors.thumbnail && (
                <p className="text-sm text-destructive">{errors.thumbnail.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Learning Steps</CardTitle>
                <CardDescription>
                  Add courses, assessments, projects, and presentations in order
                </CardDescription>
              </div>
              <Button type="button" onClick={addStep} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No steps added yet. Click "Add Step" to begin.</p>
              </div>
            ) : (
              steps.map((step, index) => (
                <div key={step.id} className="p-4 border border-border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Step {step.step_order}</Badge>
                      {getStepIcon(step.step_type)}
                      <span className="font-medium capitalize">{step.step_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === steps.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Step Type</Label>
                      <Select
                        value={step.step_type}
                        onValueChange={(value) => updateStep(step.id, 'step_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (weeks)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={step.duration_weeks}
                        onChange={(e) => updateStep(step.id, 'duration_weeks', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., System Design Fundamentals"
                      value={step.title}
                      onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe what learners will accomplish in this step..."
                      rows={2}
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Resource Link (optional)</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={step.resource_link}
                      onChange={(e) => updateStep(step.id, 'resource_link', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${step.id}`}
                      checked={step.is_required}
                      onChange={(e) => updateStep(step.id, 'is_required', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`required-${step.id}`}>Required step</Label>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/learning-paths')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? 'Creating...' : 'Create Learning Path'}
          </Button>
        </div>
      </form>
    </div>
  );
}
