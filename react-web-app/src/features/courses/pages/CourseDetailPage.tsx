import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/app/providers';
import { CourseModuleManager } from '@/components/CourseModuleManager';
import { CourseAssignmentDialog } from '@/components/CourseAssignmentDialog';
import { CourseAssignmentsList } from '@/components/CourseAssignmentsList';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Users, Clock, BookOpen, Play, FileText, Folder, UserPlus, Star, MessageSquare } from 'lucide-react';
import { useCourse } from '../hooks/useCourses';
import type { Course } from '../api/course.api';
import { PageLoader } from '@/shared/components';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, profile } = useAuth();
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Fetch course from API
  const { data: course, isLoading, error } = useCourse(id || '');

  // Handle course data mapping
  const courseData = useMemo(() => {
    if (!course) return null;
    
    const educatorName = typeof course.educator === 'object' 
      ? course.educator.name || 'Unknown'
      : 'Unknown';
    const educatorId = typeof course.educator === 'object'
      ? course.educator._id?.toString() || course.educator.id
      : course.educator?.toString();
    
    const categoryName = typeof course.category === 'object'
      ? course.category.name || null
      : null;

    return {
      id: course._id || course.id,
      title: course.title,
      description: course.description,
      educator_name: educatorName,
      educator_id: educatorId,
      duration: course.duration,
      level: course.level,
      enrolled_count: course.enrolledCount || 0,
      category: categoryName,
      status: course.status,
      thumbnail: course.thumbnail || null,
      created_at: course.createdAt,
    };
  }, [course]);

  // TODO: Fetch modules from API when module API is available
  const moduleCount = 0; // Placeholder until module API is implemented

  // TODO: Fetch reviews from API when review API is available
  const reviews: any[] = []; // Placeholder until review API is implemented
  const userReview = null; // Placeholder until review API is implemented

  // Calculate average rating - must be before any early returns
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  // Derived values - must be before any early returns
  const isEnrolled = role === 'learner';
  const isOwner = user?.id === courseData?.educator_id;
  const isEditable = role === 'admin' || isOwner;
  const progress = isEnrolled ? 45 : 0;

  if (isLoading) {
    return <PageLoader text="Loading course..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Error loading course</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'Failed to load course. Please try again.'}
        </p>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <p className="text-muted-foreground mb-4">
          The course you are looking for does not exist.
        </p>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      toast({
        title: 'Review required',
        description: 'Please provide a comment for your review.',
        variant: 'destructive',
      });
      return;
    }

    // For demo purposes, just show a success message
    // In the future, this will call your backend API
    toast({
      title: 'Review submitted',
      description: 'Thank you for your feedback! Your review has been submitted.',
    });

    setReviewDialogOpen(false);
    setReviewComment('');
    setReviewRating(5);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/courses')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      {/* Course Banner */}
      {courseData.thumbnail && (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={courseData.thumbnail} 
            alt={courseData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex gap-2 mb-3">
              <Badge variant="default" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                {courseData.status}
              </Badge>
              <Badge variant="outline" className="border-white/40 text-white hover:bg-white/10">
                {courseData.level}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{courseData.title}</h1>
            <p className="text-lg text-white/90 max-w-3xl">{courseData.description}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {!courseData.thumbnail && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant={courseData.status === 'active' ? 'default' : 'secondary'}>
                        {courseData.status}
                      </Badge>
                      <Badge variant="outline">{courseData.level}</Badge>
                    </div>
                    <CardTitle className="text-3xl">{courseData.title}</CardTitle>
                    <CardDescription className="text-base">{courseData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{courseData.enrolled_count} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>{moduleCount} modules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {courseData.thumbnail && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{courseData.enrolled_count} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>{moduleCount} modules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              {isEditable && <TabsTrigger value="assignments">Assignments</TabsTrigger>}
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <CourseModuleManager courseId={courseData.id} isEditable={isEditable} />
            </TabsContent>

            {isEditable && (
              <TabsContent value="assignments" className="space-y-4">
                <CourseAssignmentsList courseId={courseData.id} />
              </TabsContent>
            )}

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What you'll learn</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Understand core concepts and principles</li>
                      <li>Apply knowledge to real-world scenarios</li>
                      <li>Master advanced techniques and best practices</li>
                      <li>Complete hands-on projects and assessments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Prerequisites</h4>
                    <p className="text-muted-foreground">
                      Basic understanding of the subject area. No prior experience required for beginner level courses.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Student Reviews</CardTitle>
                      {reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {renderStars(Math.round(averageRating))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      )}
                    </div>
                    {role === 'learner' && isEnrolled && !userReview && (
                      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Submit Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                              Share your experience with this course to help other learners.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Rating</Label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setReviewRating(rating)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-8 w-8 transition-colors ${
                                        rating <= reviewRating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'fill-gray-200 text-gray-200'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="review-comment">Your Review</Label>
                              <Textarea
                                id="review-comment"
                                placeholder="Share your thoughts about this course..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={5}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSubmitReview}>
                              Submit Review
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No reviews yet.</p>
                      {role === 'learner' && isEnrolled && !userReview && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Be the first to review this course!
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                            {getInitials(review.user_name)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{review.user_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                              {review.user_email === user?.email && (
                                <Badge variant="secondary" className="text-xs">Your review</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Instructor</p>
                <p className="text-sm text-muted-foreground">{courseData.educator_name}</p>
              </div>
              {courseData.category && (
                <div>
                  <p className="text-sm font-medium mb-1">Category</p>
                  <p className="text-sm text-muted-foreground">{courseData.category}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium mb-1">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(courseData.created_at).toLocaleDateString()}
                </p>
              </div>
              {isEnrolled && (
                <div>
                  <p className="text-sm font-medium mb-2">Your Progress</p>
                  <Progress value={progress} className="mb-1" />
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              {isEditable && (
                <>
                  <CourseAssignmentDialog courseId={courseData.id} courseTitle={courseData.title}>
                    <Button className="w-full" variant="default">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Course
                    </Button>
                  </CourseAssignmentDialog>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/courses/${id}/edit`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Course
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/quizzes/create?courseId=${id}`}>
                      Add Quiz
                    </Link>
                  </Button>
                </>
              )}
              {role === 'learner' && (
                <>
                  <Button className="w-full">
                    {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                  </Button>
                  {isEnrolled && (
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/certificates">View Certificate</Link>
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
