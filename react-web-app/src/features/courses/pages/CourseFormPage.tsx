import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCourse, useCreateCourse, useUpdateCourse } from '../hooks/useCourses';

const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const isEdit = !!id;

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories({ isActive: true });
  const categories = categoriesResponse?.data || [];

  // Fetch course for edit mode
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(id || '');

  // Mutations
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: '',
    status: 'draft' as 'active' | 'draft' | 'archived',
    thumbnail: '',
  });

  // Populate form when course data is loaded (edit mode)
  useEffect(() => {
    if (course) {
      const categoryId = typeof course.category === 'object' 
        ? course.category._id 
        : course.category;
      
      setFormData({
        title: course.title,
        description: course.description,
        category: categoryId || '',
        level: course.level,
        duration: course.duration,
        status: course.status,
        thumbnail: course.thumbnail || '',
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User information not available. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    if (isEdit && id) {
      // Update existing course
      try {
        await updateMutation.mutateAsync({
          id,
          data: {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            level: formData.level,
            duration: formData.duration,
            status: formData.status,
            thumbnail: formData.thumbnail || undefined,
          },
        });
        navigate('/courses');
      } catch (error) {
        // Error is handled by the mutation hook
      }
    } else {
      // Create new course
      try {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          educator: user.id,
          category: formData.category,
          level: formData.level,
          duration: formData.duration,
          status: formData.status,
          thumbnail: formData.thumbnail || undefined,
        });
        navigate('/courses');
      } catch (error) {
        // Error is handled by the mutation hook
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = courseLoading || categoriesLoading || createMutation.isPending || updateMutation.isPending;

  // Show error if course not found in edit mode
  if (isEdit && courseError) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Course not found</h2>
              <p className="text-muted-foreground mb-4">
                The course you are trying to edit does not exist.
              </p>
              <Button onClick={() => navigate('/courses')}>
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/courses')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what students will learn in this course"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Loading categories...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No categories available
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category._id || category.id} value={category._id || category.id || ''}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="e.g., 6 weeks, 40 hours"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Update Course' : 'Create Course'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/courses')} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseFormPage;
