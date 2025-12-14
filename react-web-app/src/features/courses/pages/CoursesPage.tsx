import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Filter } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { Course } from '../api/course.api';
import { PageLoader } from '@/shared/components';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  educator_name: string;
  educator_id: string | null;
  duration: string;
  level: string;
  enrolled_count: number;
  category: string | null;
  status: string;
  thumbnail: string | null;
  created_at: string;
}

const CoursesPage = () => {
  const { user, role } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch courses from API
  const { data: coursesResponse, isLoading: coursesLoading, error: coursesError } = useCourses({
    status: 'active',
    educator: role === 'educator' ? user?.id : undefined,
  });

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories({
    isActive: true,
  });

  const isLoading = coursesLoading || categoriesLoading;
  const courses = coursesResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'all') {
      return courses;
    }
    // Find category by name
    const category = categories.find((cat) => cat.name === selectedCategory);
    if (!category) return courses;
    
    return courses.filter((course) => {
      const courseCategoryId = typeof course.category === 'object' 
        ? course.category._id || course.category.id 
        : course.category;
      const categoryId = category._id || category.id;
      return courseCategoryId === categoryId || courseCategoryId === categoryId?.toString();
    });
  }, [courses, categories, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {role === 'educator' ? 'My Courses' : 'Courses'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {role === 'admin' && 'Manage all courses in the platform'}
            {role === 'educator' && 'Manage and create your courses'}
            {role === 'learner' && 'Browse and enroll in courses'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => {
                  const categoryId = category._id || category.id;
                  return (
                    <SelectItem key={categoryId} value={category.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {(role === 'admin' || role === 'educator') && (
            <Button asChild size="lg">
              <Link to="/courses/create">Create New Course</Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <PageLoader text="Loading courses..." />
      ) : coursesError ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to load courses</h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const educatorName = typeof course.educator === 'object' 
              ? course.educator.name || 'Unknown'
              : 'Unknown';
            const categoryName = typeof course.category === 'object'
              ? course.category.name || null
              : null;

            return (
            <Card key={course._id || course.id} className="group hover:border-primary/30 transition-all duration-300 overflow-hidden">
              {course.thumbnail && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className="shadow-lg">
                      {course.status}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg">{course.level}</Badge>
                  </div>
                </div>
              )}
              <CardHeader className="space-y-3">
                {!course.thumbnail && (
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                )}
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1.5" />
                      <span>{course.enrolledCount || 0} enrolled</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Educator:</span> {educatorName}
                    </p>
                    {categoryName && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Category:</span> {categoryName}
                      </p>
                    )}
                  </div>
                  <Button className="w-full" variant={role === 'learner' ? 'default' : 'outline'} asChild>
                    <Link to={`/courses/${course._id || course.id}`}>
                      {role === 'learner' ? 'Enroll Now' : 'View Details'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !coursesError && filteredCourses.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {selectedCategory !== 'all' 
                ? 'Try selecting a different category or clear the filter.'
                : 'No courses are available at the moment.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesPage;
