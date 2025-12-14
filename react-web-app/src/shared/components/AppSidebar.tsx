import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/app/providers';
import { logo } from '@/assets';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { adminMenuItems, educatorMenuItems, learnerMenuItems } from '@/app/navigation';

export function AppSidebar() {
  const { user, role, logout } = useAuth();
  const { state } = useSidebar();

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return adminMenuItems;
      case 'educator':
        return educatorMenuItems;
      case 'learner':
        return learnerMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-center">
          {!collapsed ? (
            <div className="space-y-1.5">
              <img src={logo} alt="Company Logo" className="h-12 w-auto object-contain rounded-lg shadow-lg" />
              <p className="text-xs text-sidebar-foreground/70 text-center font-medium">Learning Portal</p>
            </div>
          ) : (
            <img src={logo} alt="Company Logo" className="h-8 w-8 object-contain rounded-lg shadow-md" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2"}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-sidebar-accent/80 hover:shadow-sm" 
                      activeClassName="bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/10 text-sidebar-primary font-semibold shadow-sm border-l-4 border-sidebar-primary"
                    >
                      <item.icon className={collapsed ? "h-5 w-5 mx-auto" : "h-5 w-5 group-hover:scale-110 transition-transform"} />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                      {!collapsed && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/60 font-medium">
              v1.0.0 • All Systems Operational
            </p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
