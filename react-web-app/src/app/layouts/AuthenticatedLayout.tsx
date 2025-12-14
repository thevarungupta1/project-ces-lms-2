import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/shared/components/AppSidebar';
import { HeaderUserProfile } from '@/shared/components/HeaderUserProfile';
import { HeaderNotifications } from '@/shared/components/HeaderNotifications';
import { useAuth } from '@/app/providers';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
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
}

export default AuthenticatedLayout;
