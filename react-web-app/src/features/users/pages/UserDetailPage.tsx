import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Calendar, Building2, Edit, UserCog, Shield, CheckCircle2, XCircle, BookOpen, TrendingUp, Award, Activity, Clock, Users, Star, FileText, Loader2 } from 'lucide-react';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { useCourses } from '@/features/courses/hooks/useCourses';
import type { User } from '../api/user.api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch user from API
  const { data: user, isLoading: userLoading, error: userError } = useUser(id || '');
  
  // Fetch courses - filter by educator if user is educator
  const { data: coursesResponse } = useCourses(
    user?.role === 'educator' ? { educator: id } : undefined
  );
  const courses = coursesResponse?.data || [];

  // Mutation for updating user
  const updateMutation = useUpdateUser();

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading user...</span>
      </div>
    );
  }

  // Error or not found state
  if (userError || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground mb-4">
          {userError ? 'Failed to load user. Please try again.' : 'The user you are looking for does not exist.'}
        </p>
        <Button onClick={() => navigate('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'educator':
        return 'secondary';
      case 'learner':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Get user courses - for educators show their courses, for learners show enrolled (placeholder for now)
  const userCourses = useMemo(() => {
    if (user.role === 'educator') {
      return courses;
    }
    // TODO: Fetch enrolled courses when API is available
    return [];
  }, [user.role, courses]);

  const handleRoleChange = async (newRole: 'admin' | 'educator' | 'learner') => {
    if (!id) return;
    
    try {
      await updateMutation.mutateAsync({
        id,
        data: { role: newRole },
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleStatusChange = async (isActive: boolean) => {
    if (!id) return;
    
    try {
      await updateMutation.mutateAsync({
        id,
        data: { isActive },
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/users')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex items-center gap-2">
          {user.isActive ?? true ? (
            <Badge variant="default" className="gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Active User
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5 bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
              <XCircle className="h-3 w-3" />
              Inactive User
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-4 bg-gradient-to-b from-primary/5 to-transparent rounded-t-lg">
            <div className="relative inline-block">
              <Avatar className="h-28 w-28 mx-auto mb-4 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {user.isActive ?? true ? (
                <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              ) : (
                <div className="absolute bottom-2 right-2 h-5 w-5 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                  <XCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize px-3 py-1">
                {user.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-md bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-md bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Department</p>
                  <p className="text-sm font-medium">{user.department || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-md bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Joined</p>
                  <p className="text-sm font-medium">
                    {user.joinedDate 
                      ? new Date(user.joinedDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <Button className="w-full" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* User Management Card */}
        <Card className="lg:col-span-1 shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserCog className="h-5 w-5 text-primary" />
              </div>
              User Management
            </CardTitle>
            <CardDescription className="text-sm">
              Manage user role and account status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Role Management */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <Label htmlFor="user-role" className="text-sm font-semibold">
                  User Role
                </Label>
              </div>
              <Select
                value={user.role}
                onValueChange={(value) => handleRoleChange(value as 'admin' | 'educator' | 'learner')}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger id="user-role" className="w-full h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="educator">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Educator
                    </div>
                  </SelectItem>
                  <SelectItem value="learner">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Learner
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pl-8">
                Controls user permissions and access levels
              </p>
            </div>

            <Separator className="my-4" />

            {/* Status Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    {user.isActive ?? true ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <Label htmlFor="user-status" className="text-sm font-semibold">
                    Account Status
                  </Label>
                </div>
                <Switch
                  id="user-status"
                  checked={user.isActive ?? true}
                  onCheckedChange={handleStatusChange}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="pl-8 space-y-2">
                <Badge 
                  variant={user.isActive ?? true ? 'default' : 'secondary'}
                  className={`w-fit ${
                    user.isActive ?? true 
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                  }`}
                >
                  {user.isActive ?? true ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                  )}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {user.isActive ?? true 
                    ? 'User has full access to the system and can log in' 
                    : 'User access is disabled and login is restricted'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="courses" className="gap-2 data-[state=active]:bg-background">
                <BookOpen className="h-4 w-4" />
                {user.role === 'educator' ? 'Teaching' : 'Enrolled Courses'}
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-background">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2 data-[state=active]:bg-background">
                <TrendingUp className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4 mt-6">
              {userCourses.length === 0 ? (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.role === 'educator' 
                        ? 'This educator has not created any courses yet.' 
                        : 'This learner has not enrolled in any courses yet.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userCourses.map((course) => {
                  const courseId = course._id || course.id;
                  const categoryName = typeof course.category === 'object' 
                    ? course.category.name 
                    : course.category || 'Uncategorized';
                  
                  return (
                    <Card 
                      key={courseId} 
                      className="group hover:border-primary/50 hover:shadow-md transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {categoryName}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {course.level}
                              </Badge>
                              <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {course.status}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {course.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>{course.enrolledCount || 0} students</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/courses/${courseId}`)}
                            className="group/btn"
                          >
                            View Course
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>User's recent actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6 pl-8">
                      <div className="relative flex items-start gap-4 group">
                        <div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20 ring-offset-2 ring-offset-background group-hover:scale-125 transition-transform" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {user.role === 'educator' ? 'Created new course' : 'Enrolled in course'}
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <div className="relative flex items-start gap-4 group">
                        <div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-500/20 ring-offset-2 ring-offset-background group-hover:scale-125 transition-transform" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {user.role === 'educator' ? 'Published quiz' : 'Completed quiz'}
                          </p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                      <div className="relative flex items-start gap-4 group">
                        <div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 ring-offset-2 ring-offset-background group-hover:scale-125 transition-transform" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">Profile updated</p>
                          <p className="text-xs text-muted-foreground">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent rounded-t-lg">
                    <CardTitle className="text-base flex items-center gap-2">
                      {user.role === 'educator' ? (
                        <BookOpen className="h-5 w-5 text-primary" />
                      ) : (
                        <Award className="h-5 w-5 text-primary" />
                      )}
                      {user.role === 'educator' ? 'Teaching Stats' : 'Learning Stats'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {user.role === 'educator' ? 'Total Courses' : 'Enrolled Courses'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-foreground">{userCourses.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {user.role === 'educator' ? 'Total Students' : 'Completed'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        {user.role === 'educator' ? '127' : '1'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {user.role === 'educator' ? 'Avg. Rating' : 'In Progress'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        {user.role === 'educator' ? '4.7' : '2'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent rounded-t-lg">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg. Score</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Learning Streak</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">12 days</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
