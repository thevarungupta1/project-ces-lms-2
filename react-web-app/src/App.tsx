import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/app/providers";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/shared/components";
import { HeaderUserProfile, HeaderNotifications } from "@/shared/components";
import { ProtectedRoute } from "@/router";

// Feature imports
import { AuthPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { CoursesPage, CourseDetailPage, CourseFormPage } from "@/features/courses";
import { CategoriesPage } from "@/features/categories";
import { CertificatesPage, CertificateFormPage, CertificatePreviewPage } from "@/features/certificates";
import { UsersPage, UserDetailPage, UserInviteFormPage } from "@/features/users";
import { QuizzesPage, QuizDetailPage, QuizFormPage } from "@/features/quizzes";
import { NotificationsPage } from "@/features/notifications";
import { AnnouncementsPage, AnnouncementFormPage } from "@/features/announcements";
import { GroupsPage, GroupFormPage, GroupDetailPage } from "@/features/groups";
import { SettingsPage } from "@/features/settings";
import { StudentsPage } from "@/features/students";
import { LeaderboardPage } from "@/features/leaderboard";
import { LearningPathsPage, LearningPathFormPage } from "@/features/learning-paths";
import { TalentProfilePage } from "@/features/talent-profile";
import { WebinarsPage, WebinarFormPage, WebinarDetailPage } from "@/features/webinars";
import { NotFoundPage } from "@/shared/pages";

const queryClient = new QueryClient();

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAuth();
  
  const getHeaderTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Panel';
      case 'educator':
        return 'Educator Portal';
      case 'learner':
        return 'Learning Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">{getHeaderTitle()}</h1>
            </div>
            <div className="flex items-center gap-3">
              <HeaderNotifications />
              <HeaderUserProfile />
            </div>
          </header>
          <div className="p-6 bg-background flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <DashboardPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CoursesPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/create" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CourseFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/:id" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CourseDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CourseFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CategoriesPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <UsersPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/invite"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <UserInviteFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/:id" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <UserDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/groups" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <GroupsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/groups/create" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <GroupFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/groups/:id" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <GroupDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <QuizzesPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes/create" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <QuizFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes/:id" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <QuizDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <QuizFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <NotificationsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AnnouncementsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/announcements/create" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AnnouncementFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <SettingsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={['educator']}>
                  <AuthenticatedLayout>
                    <StudentsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <LeaderboardPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learning-paths/create" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <LearningPathFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learning-paths" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <LearningPathsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/talent-profile" 
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <AuthenticatedLayout>
                    <TalentProfilePage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CertificatesPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates/create" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CertificateFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CertificateFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates/preview/:id" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <CertificatePreviewPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates/view/:certId" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CertificatePreviewPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/webinars" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <WebinarsPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/webinars/create" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <WebinarFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/webinars/:id" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <WebinarDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/webinars/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'educator']}>
                  <AuthenticatedLayout>
                    <WebinarFormPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
